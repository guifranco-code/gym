import React, { useState } from 'react';
import { Exercise, Workout, WorkoutExercise } from '../../types';
import { ClipboardList, Plus, Edit2, Trash2, Dumbbell, Clock, MoveUp, MoveDown, Check, X, Layers } from 'lucide-react';

interface WorkoutsManagerProps {
  workouts: Workout[];
  exercises: Exercise[];
  onSaveWorkout: (workout: Workout) => Promise<void>;
  onDeleteWorkout: (workoutId: string) => Promise<void>;
}

export const WorkoutsManager: React.FC<WorkoutsManagerProps> = ({
  workouts,
  exercises,
  onSaveWorkout,
  onDeleteWorkout,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('A');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);

  // Sub-modal for adding an exercise to the workout
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const resetForm = () => {
    setEditingId(null);
    setCode('A');
    setName('');
    setDescription('');
    setWorkoutExercises([]);
  };

  const handleOpenCreate = () => {
    resetForm();
    // Sugere o próximo código disponível (A, B, C, D...)
    const usedCodes = workouts.map(w => w.code.toUpperCase());
    const possibleCodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nextCode = possibleCodes.find(c => !usedCodes.includes(c)) || 'A';
    setCode(nextCode);
    setName(`Treino ${nextCode} - `);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (workout: Workout) => {
    setEditingId(workout.id);
    setCode(workout.code);
    setName(workout.name);
    setDescription(workout.description || '');
    setWorkoutExercises([...workout.exercises]);
    setIsModalOpen(true);
  };

  const handleAddExerciseToWorkout = (exerciseId: string) => {
    if (!exerciseId) return;
    const baseEx = exercises.find(e => e.id === exerciseId);
    if (!baseEx) return;

    const newEntry: WorkoutExercise = {
      id: `we-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      exerciseId: baseEx.id,
      sets: baseEx.defaultSets || 3,
      reps: baseEx.defaultReps || '10-12',
      restSeconds: baseEx.defaultRestSeconds || 60,
      suggestedWeight: undefined,
      notes: '',
      order: workoutExercises.length + 1,
    };

    setWorkoutExercises(prev => [...prev, newEntry]);
    setSelectedExerciseId('');
  };

  const handleRemoveExerciseFromWorkout = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === workoutExercises.length - 1) return;

    const newItems = [...workoutExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Atualizar order
    newItems.forEach((it, i) => { it.order = i + 1; });
    setWorkoutExercises(newItems);
  };

  const handleUpdateExerciseField = (index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkoutExercises(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    setLoading(true);
    try {
      const workout: Workout = {
        id: editingId || `w-${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        exercises: workoutExercises.map((ex, idx) => ({ ...ex, order: idx + 1 })),
        createdAt: new Date().toISOString(),
      };

      await onSaveWorkout(workout);
      setIsModalOpen(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            Fichas de Treinos (A, B, C...)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monte os treinos divididos por letras (ex: Treino A, Treino B, Treino C) e configure as séries e repetições esperadas.
          </p>
        </div>

        <button
          id="btn-new-workout"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-950 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Criar Nova Ficha de Treino
        </button>
      </div>

      {/* Workouts Grid */}
      {workouts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          <Layers className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <h4 className="text-base font-semibold text-slate-300">Nenhum treino montado</h4>
          <p className="text-xs text-slate-500 mt-1">Clique em "Criar Nova Ficha de Treino" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm group"
            >
              <div>
                {/* Top header with code badge and actions */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-base">
                      {w.code}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {w.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{w.description || 'Sem descrição específica.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(w)}
                      title="Editar Ficha de Treino"
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteWorkout(w.id)}
                      title="Excluir Treino"
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exercises list in this workout */}
                <div className="space-y-2 mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Exercícios Incluídos ({w.exercises.length})</span>
                    <span>Séries / Reps / Descanso</span>
                  </div>

                  <div className="divide-y divide-slate-800/60 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden">
                    {w.exercises.map((item, idx) => {
                      const exDetail = exercises.find(e => e.id === item.exerciseId);
                      return (
                        <div key={item.id || idx} className="p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-200">
                                {exDetail?.name || 'Exercício não encontrado'}
                              </p>
                              {item.notes && (
                                <p className="text-[10px] text-amber-400/90 italic">{item.notes}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right text-[11px] text-slate-400">
                            <span className="text-emerald-400 font-medium">{item.sets}x {item.reps}</span>
                            <span className="mx-1.5 text-slate-600">•</span>
                            <span>{item.restSeconds}s</span>
                            {item.suggestedWeight && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                ~{item.suggestedWeight}kg
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {w.exercises.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Nenhum exercício vinculado a este treino ainda.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{w.exercises.length} exercícios configurados</span>
                <button
                  onClick={() => handleOpenEdit(w)}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
                >
                  Gerenciar Exercícios &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Create/Edit Workout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                {editingId ? 'Editar Ficha de Treino' : 'Nova Ficha de Treino'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-medium text-slate-300 mb-1">
                    Código (Letra) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ex: A, B, C"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-bold text-center text-xs focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-medium text-slate-300 mb-1">
                    Nome Completo do Treino *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Treino A - Peito, Tríceps e Ombros"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Orientações Gerais do Treino
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Foco em hipertrofia, descanso controlado de 60 a 90s..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Add Exercise Section */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-slate-200">
                    Exercícios na Ficha ({workoutExercises.length})
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Ajuste as séries, repetições esperadas e descanso
                  </span>
                </div>

                {/* Exercise selector dropdown */}
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Selecione um exercício do catálogo para adicionar...</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        [{ex.muscleGroup}] {ex.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddExerciseToWorkout(selectedExerciseId)}
                    disabled={!selectedExerciseId}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar
                  </button>
                </div>

                {/* List of exercises inside the modal */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {workoutExercises.map((we, index) => {
                    const exDetail = exercises.find(e => e.id === we.exerciseId);
                    return (
                      <div
                        key={we.id}
                        className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <span className="font-semibold text-slate-200 text-xs">
                              {exDetail?.name || 'Exercício'}
                            </span>
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                              {exDetail?.muscleGroup}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(index, 'down')}
                              disabled={index === workoutExercises.length - 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExerciseFromWorkout(index)}
                              className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Editable parameters */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Séries</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={we.sets}
                              onChange={(e) => handleUpdateExerciseField(index, 'sets', Number(e.target.value))}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-100"
                            />
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Repetições</span>
                            <input
                              type="text"
                              value={we.reps}
                              onChange={(e) => handleUpdateExerciseField(index, 'reps', e.target.value)}
                              placeholder="10-12"
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-100"
                            />
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Descanso (s)</span>
                            <input
                              type="number"
                              step="15"
                              value={we.restSeconds}
                              onChange={(e) => handleUpdateExerciseField(index, 'restSeconds', Number(e.target.value))}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-100"
                            />
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Carga Sugerida (kg)</span>
                            <input
                              type="number"
                              value={we.suggestedWeight || ''}
                              onChange={(e) => handleUpdateExerciseField(index, 'suggestedWeight', e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="Opcional"
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-slate-100"
                            />
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={we.notes || ''}
                            onChange={(e) => handleUpdateExerciseField(index, 'notes', e.target.value)}
                            placeholder="Obs técnica para o aluno (ex: Cadência lenta, pico de contração...)"
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-300 placeholder-slate-600 text-[11px]"
                          />
                        </div>

                      </div>
                    );
                  })}

                  {workoutExercises.length === 0 && (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      Selecione um exercício acima para montar a grade deste treino.
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  {editingId ? 'Salvar Alterações da Ficha' : 'Salvar Ficha de Treino'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
