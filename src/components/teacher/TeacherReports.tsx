import React, { useState } from 'react';
import { Student, Exercise, WorkoutLog, Workout } from '../../types';
import { EvolutionChart } from '../common/EvolutionChart';
import { calculateExerciseEvolution } from '../../lib/storage';
import { BarChart3, User, Calendar, Dumbbell, Clock, Flame, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';

interface TeacherReportsProps {
  students: Student[];
  exercises: Exercise[];
  workouts: Workout[];
  logs: WorkoutLog[];
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

export const TeacherReports: React.FC<TeacherReportsProps> = ({
  students,
  exercises,
  workouts,
  logs,
  selectedStudentId,
  onSelectStudentId,
}) => {
  const [activeStudentId, setActiveStudentId] = useState<string>(
    selectedStudentId || (students[0]?.id ?? '')
  );

  // Selecionar exercício para o gráfico
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    exercises[0]?.id ?? ''
  );

  const currentStudent = students.find(s => s.id === activeStudentId);

  // Filtrar logs do aluno selecionado
  const studentLogs = logs.filter(l => l.studentId === activeStudentId);

  // Calcular evolução para o exercício selecionado
  const evolutionData = calculateExerciseEvolution(logs, activeStudentId, selectedExerciseId);
  const currentExercise = exercises.find(e => e.id === selectedExerciseId);

  // Exercícios que este aluno já executou em treinos
  const executedExerciseIds = new Set<string>();
  studentLogs.forEach(l => {
    l.exercises.forEach(e => {
      if (e.sets.some(s => s.completed || s.weightKg > 0)) {
        executedExerciseIds.add(e.exerciseId);
      }
    });
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Relatórios de Treinos e Cargas dos Alunos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe a frequência dos alunos, as cargas registradas em cada sessão e os gráficos de evolução de força.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl w-full sm:w-auto">
          <User className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          <select
            value={activeStudentId}
            onChange={(e) => {
              setActiveStudentId(e.target.value);
              if (onSelectStudentId) onSelectStudentId(e.target.value);
            }}
            className="w-full bg-transparent text-slate-200 text-xs font-semibold focus:outline-none pr-3 cursor-pointer"
          >
            {students.map(st => (
              <option key={st.id} value={st.id} className="bg-slate-900 text-slate-100">
                {st.name} ({st.accessCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!currentStudent ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          <User className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <h4 className="text-base font-semibold text-slate-300">Nenhum aluno selecionado</h4>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Student Profile Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white text-base shadow-md shadow-emerald-950">
                  {currentStudent.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{currentStudent.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {currentStudent.accessCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentStudent.email} • {currentStudent.phone || 'Sem telefone'}
                  </p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-semibold">Sessões Realizadas</span>
                  <span className="text-lg font-bold text-white">{studentLogs.length} treinos</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block uppercase font-semibold">Exercícios Praticados</span>
                  <span className="text-lg font-bold text-emerald-400">{executedExerciseIds.size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Evolution Chart Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Gráfico de Evolução de Força ao Longo do Tempo
                </h3>
                <p className="text-xs text-slate-400">
                  Selecione o exercício para visualizar a progressão de carga (kg) e volume muscular nas datas em que o aluno treinou.
                </p>
              </div>

              {/* Exercise Selector */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl w-full sm:w-auto">
                <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="w-full bg-transparent text-slate-100 text-xs font-medium focus:outline-none pr-3 cursor-pointer"
                >
                  {exercises.map(ex => {
                    const hasHistory = executedExerciseIds.has(ex.id);
                    return (
                      <option key={ex.id} value={ex.id} className="bg-slate-900 text-slate-100">
                        {hasHistory ? '★ ' : ''}[{ex.muscleGroup}] {ex.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Evolution Chart */}
            <EvolutionChart
              data={evolutionData}
              exerciseName={currentExercise?.name || 'Exercício Selecionado'}
            />
          </div>

          {/* Sessions & Workout Logs Table */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Histórico Detalhado das Sessões de Treino do Aluno
            </h3>

            {studentLogs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <Clock className="w-10 h-10 mx-auto text-slate-700 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Nenhum treino registrado ainda</p>
                <p className="text-xs text-slate-500 mt-1">
                  Assim que o aluno abrir a ficha no app e registrar as séries, os detalhes aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentLogs.map((log) => {
                  const dateFormatted = new Date(log.startedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={log.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
                    >
                      {/* Log Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">
                            {log.workoutCode}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-white">{log.workoutName}</h4>
                            <span className="text-[11px] text-slate-400">{dateFormatted}</span>
                          </div>
                        </div>

                        {log.durationMinutes && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 self-start sm:self-auto">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            {log.durationMinutes} min de treino
                          </span>
                        )}
                      </div>

                      {/* Exercises and registered loads in this log */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {log.exercises.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-slate-200">{item.exerciseName}</span>
                              <span className="text-[10px] text-slate-500">{item.sets.length} séries</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.sets.map((set, sIdx) => (
                                <div
                                  key={sIdx}
                                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                                    set.completed
                                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                                      : 'bg-slate-900 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <span className="text-slate-500 text-[10px]">S{set.setNumber}:</span>
                                  <strong className="text-white">{set.weightKg} kg</strong>
                                  <span className="text-slate-400">× {set.repsCompleted} reps</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {log.feedbackNotes && (
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50 text-xs text-slate-300">
                          <span className="font-semibold text-amber-400">Feedback do Aluno: </span>
                          {log.feedbackNotes}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
