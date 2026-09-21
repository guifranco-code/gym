import React, { useState, useEffect, useRef } from 'react';
import { Exercise, Student, Workout, WorkoutLog, ExerciseExecutionLog, SetExecutionLog } from '../../types';
import { Dumbbell, Youtube, Play, CheckCircle2, Circle, Clock, Check, ArrowRight, RotateCcw, Volume2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../../utils/youtube';

interface StudentWorkoutViewProps {
  student: Student;
  workouts: Workout[];
  exercises: Exercise[];
  onCompleteWorkout: (log: WorkoutLog) => Promise<void>;
  onGoToHistory: () => void;
}

export const StudentWorkoutView: React.FC<StudentWorkoutViewProps> = ({
  student,
  workouts,
  exercises,
  onCompleteWorkout,
  onGoToHistory,
}) => {
  // Filtrar os treinos liberados para este aluno
  const availableWorkouts = workouts.filter(w => 
    student.assignedWorkoutIds && student.assignedWorkoutIds.length > 0
      ? student.assignedWorkoutIds.includes(w.id)
      : true
  );

  // Treino do dia selecionado pelo aluno
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(
    availableWorkouts[0]?.id || ''
  );

  const activeWorkout = workouts.find(w => w.id === selectedWorkoutId);

  // Estrutura de registro de execução em andamento
  const [sessionExercises, setSessionExercises] = useState<ExerciseExecutionLog[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [workoutFinishedSuccess, setWorkoutFinishedSuccess] = useState(false);

  // Modal de vídeo ativo
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Timer de descanso
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar formulário de registro quando o aluno troca o treino selecionado
  useEffect(() => {
    if (!activeWorkout) return;

    const initialExecution: ExerciseExecutionLog[] = activeWorkout.exercises.map(we => {
      const exBase = exercises.find(e => e.id === we.exerciseId);
      const setsCount = we.sets || 3;
      const initialSets: SetExecutionLog[] = [];

      for (let i = 1; i <= setsCount; i++) {
        initialSets.push({
          setNumber: i,
          weightKg: we.suggestedWeight || 0,
          repsCompleted: Number(we.reps.split('-')[0]) || 10,
          completed: false,
          notes: ''
        });
      }

      return {
        exerciseId: we.exerciseId,
        exerciseName: exBase?.name || 'Exercício',
        sets: initialSets
      };
    });

    setSessionExercises(initialExecution);
    setWorkoutFinishedSuccess(false);
  }, [selectedWorkoutId, activeWorkout, exercises]);

  // Contagem do timer de descanso
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleUpdateSet = (exIndex: number, setIndex: number, field: keyof SetExecutionLog, val: any) => {
    setSessionExercises(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as ExerciseExecutionLog[];
      copy[exIndex].sets[setIndex] = {
        ...copy[exIndex].sets[setIndex],
        [field]: val
      };
      return copy;
    });
  };

  const handleToggleSetComplete = (exIndex: number, setIndex: number, restSeconds: number) => {
    setSessionExercises(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as ExerciseExecutionLog[];
      const currentStatus = copy[exIndex].sets[setIndex].completed;
      copy[exIndex].sets[setIndex].completed = !currentStatus;

      // Se marcou como concluído, dispara o cronômetro de descanso automaticamente!
      if (!currentStatus) {
        startRestTimer(restSeconds || 60);
      }
      return copy;
    });
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout) return;
    setIsFinishing(true);

    try {
      const now = new Date();
      const startedAt = new Date(now.getTime() - 55 * 60 * 1000).toISOString(); // ~55 min de treino
      const completedAt = now.toISOString();

      const log: WorkoutLog = {
        id: `log-${Date.now()}`,
        studentId: student.id,
        workoutId: activeWorkout.id,
        workoutName: activeWorkout.name,
        workoutCode: activeWorkout.code,
        startedAt,
        completedAt,
        durationMinutes: 55,
        feedbackNotes: feedbackNotes.trim(),
        exercises: sessionExercises
      };

      await onCompleteWorkout(log);
      setWorkoutFinishedSuccess(true);
    } finally {
      setIsFinishing(false);
    }
  };

  if (availableWorkouts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 max-w-lg mx-auto my-8">
        <Dumbbell className="w-12 h-12 mx-auto text-slate-700 mb-3" />
        <h3 className="text-lg font-bold text-white">Nenhum treino disponível</h3>
        <p className="text-xs text-slate-400 mt-1">
          O professor ainda não atribuiu fichas de treino ao seu cadastro. Solicite a liberação dos seus treinos na academia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Selector of workout of the day */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              Olá, {student.name.split(' ')[0]}! 💪
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5">
              Selecione o Treino do Dia
            </h2>
          </div>

          {/* Quick Buttons for Workouts: A, B, C... without scrollbars */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {availableWorkouts.map((w) => {
              const isSelected = w.id === selectedWorkoutId;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWorkoutId(w.id)}
                  className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-emerald-950/50 scale-102'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-white text-emerald-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {w.code}
                  </span>
                  <span className="truncate max-w-[140px] sm:max-w-none">{w.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeWorkout && (
          <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <p className="italic text-slate-300 text-[11px] sm:text-xs">
              "{activeWorkout.description || 'Siga as orientações de postura e descanso para máxima performance.'}"
            </p>
            <span className="font-semibold text-emerald-400 shrink-0 text-[11px] sm:text-xs">
              {activeWorkout.exercises.length} exercícios na ficha
            </span>
          </div>
        )}
      </div>

      {/* Floating Rest Timer Bar (when running) */}
      {(timerSeconds > 0 || isTimerRunning) && (
        <div className="sticky top-15 z-30 bg-emerald-950/95 border border-emerald-500/50 rounded-2xl p-3 px-4 sm:px-5 backdrop-blur-md shadow-xl flex items-center justify-between text-emerald-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs animate-pulse shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Descanso entre séries
              </span>
              <span className="text-lg sm:text-xl font-black font-mono text-white leading-none">
                {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setTimerSeconds(prev => prev + 30)}
              className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-700/50 touch-manipulation"
            >
              +30s
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="px-2.5 sm:px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg touch-manipulation"
            >
              Pular
            </button>
          </div>
        </div>
      )}

      {/* Success Celebration Card after finishing */}
      {workoutFinishedSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-3xl p-6 text-center text-emerald-200 space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Treino Finalizado com Sucesso!</h3>
          <p className="text-xs text-emerald-300/90 max-w-md mx-auto">
            Todas as suas cargas e repetições foram gravadas no banco de dados. Seu professor já pode acompanhar sua evolução de força!
          </p>
          <button
            onClick={onGoToHistory}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            Ver Meu Gráfico de Evolução &rarr;
          </button>
        </div>
      )}

      {/* Exercises List to execute and record loads */}
      <div className="space-y-4 sm:space-y-5">
        {activeWorkout?.exercises.map((we, exIdx) => {
          const exDetail = exercises.find(e => e.id === we.exerciseId);
          const currentExecution = sessionExercises[exIdx];
          const hasVideo = Boolean(exDetail?.youtubeUrl);

          return (
            <div
              key={we.id || exIdx}
              className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm space-y-3 sm:space-y-4"
            >
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0">
                      {exIdx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {exDetail?.name || 'Exercício'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-300 shrink-0">
                      {exDetail?.muscleGroup}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                    {exDetail?.description || 'Execute com postura controlada.'}
                  </p>

                  {we.notes && (
                    <p className="text-xs text-amber-400/90 pl-8 italic">
                      ★ Instrução do Treinador: {we.notes}
                    </p>
                  )}
                </div>

                {/* Video Button */}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveVideoUrl(exDetail!.youtubeUrl)}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 shrink-0 self-start touch-manipulation"
                  >
                    <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Ver Vídeo</span>
                  </button>
                )}
              </div>

              {/* Target specs banner */}
              <div className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-300 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span><strong>Meta:</strong> {we.sets} séries × {we.reps} reps</span>
                  <span>•</span>
                  <span><strong>Descanso:</strong> {we.restSeconds}s</span>
                </div>
                {we.suggestedWeight && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Sugerido: {we.suggestedWeight} kg
                  </span>
                )}
              </div>

              {/* Sets Execution Table (Mobile-friendly, no squishing) */}
              <div className="space-y-2">
                
                {/* Desktop table header */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
                  <div className="col-span-2">Série</div>
                  <div className="col-span-4 text-center">Carga (kg)</div>
                  <div className="col-span-4 text-center">Reps Feitas</div>
                  <div className="col-span-2 text-center">Feito</div>
                </div>

                <div className="space-y-2">
                  {currentExecution?.sets.map((setLog, setIdx) => (
                    <div
                      key={setIdx}
                      className={`flex items-center justify-between sm:grid sm:grid-cols-12 gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all ${
                        setLog.completed
                          ? 'bg-emerald-950/25 border-emerald-700/50 text-emerald-200'
                          : 'bg-slate-950 border-slate-800/80 text-slate-100'
                      }`}
                    >
                      {/* Set Badge */}
                      <div className="sm:col-span-2 flex items-center gap-1.5 font-bold text-xs text-slate-300 shrink-0">
                        <span className={`w-6 h-6 sm:w-5 sm:h-5 rounded-lg sm:rounded-full flex items-center justify-center text-[11px] sm:text-[10px] font-bold ${
                          setLog.completed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {setLog.setNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 sm:inline">ª</span>
                      </div>

                      {/* Inputs Container (Flexible on mobile, grid columns on desktop) */}
                      <div className="flex items-center gap-2 flex-1 justify-center sm:contents">
                        
                        {/* Weight Input (kg) */}
                        <div className="sm:col-span-4 flex justify-center">
                          <div className="flex items-center bg-slate-900 border border-slate-700 focus-within:border-emerald-500 rounded-xl px-2.5 py-1.5 transition-colors">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1.5 sm:hidden">Carga</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={setLog.weightKg === 0 ? '' : setLog.weightKg}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weightKg', Number(e.target.value))}
                              placeholder="0"
                              className="w-12 sm:w-16 bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none text-center"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold ml-1">
                              kg
                            </span>
                          </div>
                        </div>

                        {/* Reps Input */}
                        <div className="sm:col-span-4 flex justify-center">
                          <div className="flex items-center bg-slate-900 border border-slate-700 focus-within:border-emerald-500 rounded-xl px-2.5 py-1.5 transition-colors">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1.5 sm:hidden">Reps</span>
                            <input
                              type="number"
                              min="0"
                              value={setLog.repsCompleted === 0 ? '' : setLog.repsCompleted}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'repsCompleted', Number(e.target.value))}
                              placeholder="10"
                              className="w-10 sm:w-14 bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none text-center"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold ml-1">
                              reps
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* Complete Checkbox Button */}
                      <div className="sm:col-span-2 flex justify-end sm:justify-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSetComplete(exIdx, setIdx, we.restSeconds)}
                          className={`min-w-[42px] min-h-[42px] sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all touch-manipulation active:scale-95 ${
                            setLog.completed
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                              : 'bg-slate-900 border border-slate-700 text-slate-500 hover:text-slate-300'
                          }`}
                          title="Marcar série como concluída e iniciar descanso"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Finish Workout Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Como você se sentiu hoje? (Feedback para o professor)
          </label>
          <textarea
            rows={2}
            value={feedbackNotes}
            onChange={(e) => setFeedbackNotes(e.target.value)}
            placeholder="Ex: Treino muito bom, aumentei 2kg no supino, senti leve fadiga no tríceps..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            As cargas registradas acima alimentarão os gráficos de evolução de força.
          </span>
          <button
            id="btn-finish-workout"
            type="button"
            onClick={handleFinishWorkout}
            disabled={isFinishing}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all self-stretch sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isFinishing ? 'Salvando Treino...' : 'Finalizar Treino do Dia'}</span>
          </button>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                Vídeo de Execução Correta
              </span>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {getYouTubeEmbedUrl(activeVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideoUrl)!}
                  title="Vídeo YouTube"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Não foi possível reproduzir este link diretamente.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
