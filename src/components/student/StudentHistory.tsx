import React, { useState } from 'react';
import { Student, Exercise, WorkoutLog, Workout } from '../../types';
import { EvolutionChart } from '../common/EvolutionChart';
import { calculateExerciseEvolution } from '../../lib/storage';
import { Dumbbell, Calendar, Clock, Award, Activity, Sparkles, TrendingUp } from 'lucide-react';

interface StudentHistoryProps {
  student: Student;
  exercises: Exercise[];
  workouts: Workout[];
  logs: WorkoutLog[];
  onStartNewWorkout: () => void;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({
  student,
  exercises,
  workouts,
  logs,
  onStartNewWorkout,
}) => {
  // Logs deste aluno
  const studentLogs = logs.filter(l => l.studentId === student.id);

  // Descobrir exercícios que o aluno já treinou
  const trainedExerciseIds = new Set<string>();
  studentLogs.forEach(l => {
    l.exercises.forEach(e => {
      if (e.sets.some(s => s.completed || s.weightKg > 0)) {
        trainedExerciseIds.add(e.exerciseId);
      }
    });
  });

  const availableExerciseList = exercises.filter(e => 
    trainedExerciseIds.size > 0 ? trainedExerciseIds.has(e.id) : true
  );

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    availableExerciseList[0]?.id || exercises[0]?.id || ''
  );

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);
  const evolutionData = calculateExerciseEvolution(logs, student.id, selectedExerciseId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Minha Evolução de Força
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe o ganho de carga (kg) e volume nos exercícios ao longo das suas sessões.
          </p>
        </div>

        <button
          onClick={onStartNewWorkout}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950 self-start sm:self-auto"
        >
          Treinar Hoje &rarr;
        </button>
      </div>

      {/* Exercise Selector Chips / Dropdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            Selecione o Exercício para Ver a Curva de Força:
          </label>
          <span className="text-[11px] text-slate-500">
            {availableExerciseList.length} exercícios com registros
          </span>
        </div>

        {/* Mobile Dropdown Selector */}
        <div className="sm:hidden">
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:border-emerald-500"
          >
            {availableExerciseList.map(ex => (
              <option key={ex.id} value={ex.id}>
                [{ex.muscleGroup}] {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop / Horizontal swipeable pills (no scrollbar) */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {availableExerciseList.map(ex => {
            const isSelected = ex.id === selectedExerciseId;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{ex.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {ex.muscleGroup}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evolution Chart */}
      <EvolutionChart
        data={evolutionData}
        exerciseName={selectedExercise?.name || 'Exercício'}
      />

      {/* History of logged sessions */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Seus Treinos Anteriores ({studentLogs.length})
        </h3>

        {studentLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <Clock className="w-10 h-10 mx-auto text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Você ainda não finalizou nenhum treino</p>
            <p className="text-xs text-slate-500 mt-1">
              Selecione o treino na aba "Treino do Dia" e clique em "Finalizar Treino" após marcar suas cargas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentLogs.map(log => {
              const dateStr = new Date(log.startedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });

              return (
                <div
                  key={log.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">
                        {log.workoutCode}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{log.workoutName}</h4>
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>
                    </div>

                    {log.durationMinutes && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        {log.durationMinutes} min
                      </span>
                    )}
                  </div>

                  {/* Summary of loads in this workout */}
                  <div className="space-y-1.5 pt-1">
                    {log.exercises.map((ex, i) => {
                      const completedSets = ex.sets.filter(s => s.completed || s.weightKg > 0);
                      const maxKg = Math.max(...completedSets.map(s => s.weightKg), 0);

                      return (
                        <div
                          key={i}
                          className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-300 truncate max-w-[200px]">
                            {ex.exerciseName}
                          </span>
                          <span className="text-emerald-400 font-bold text-[11px] shrink-0">
                            Pico: {maxKg} kg ({completedSets.length} séries)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {log.feedbackNotes && (
                    <p className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
                      <strong>Obs:</strong> {log.feedbackNotes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
