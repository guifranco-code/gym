import React, { useState } from 'react';
import { Exercise } from '../../types';
import { Dumbbell, Plus, Search, Youtube, Clock, RefreshCw, Trash2, Edit2, Play, ExternalLink, X } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeVideoId, getYouTubeThumbnail } from '../../utils/youtube';

interface ExercisesManagerProps {
  exercises: Exercise[];
  onSaveExercise: (exercise: Exercise) => Promise<void>;
  onDeleteExercise: (exerciseId: string) => Promise<void>;
}

const MUSCLE_GROUPS = [
  'Todos',
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Cardio',
  'Outro'
] as const;

export const ExercisesManager: React.FC<ExercisesManagerProps> = ({
  exercises,
  onSaveExercise,
  onDeleteExercise,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<Exercise['muscleGroup']>('Peito');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [defaultSets, setDefaultSets] = useState(3);
  const [defaultReps, setDefaultReps] = useState('10-12');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(60);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setMuscleGroup('Peito');
    setDescription('');
    setYoutubeUrl('');
    setDefaultSets(3);
    setDefaultReps('10-12');
    setDefaultRestSeconds(60);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ex: Exercise) => {
    setEditingId(ex.id);
    setName(ex.name);
    setMuscleGroup(ex.muscleGroup);
    setDescription(ex.description || '');
    setYoutubeUrl(ex.youtubeUrl || '');
    setDefaultSets(ex.defaultSets || 3);
    setDefaultReps(ex.defaultReps || '10-12');
    setDefaultRestSeconds(ex.defaultRestSeconds || 60);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const exercise: Exercise = {
        id: editingId || `ex-${Date.now()}`,
        name: name.trim(),
        muscleGroup,
        description: description.trim(),
        youtubeUrl: youtubeUrl.trim(),
        defaultSets: Number(defaultSets) || 3,
        defaultReps: defaultReps.trim() || '10-12',
        defaultRestSeconds: Number(defaultRestSeconds) || 60,
        createdAt: new Date().toISOString(),
      };

      await onSaveExercise(exercise);
      setIsModalOpen(false);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'Todos' || ex.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            Catálogo de Exercícios
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre os exercícios, descrições técnicas, links de vídeo do YouTube e séries recomendadas para os alunos.
          </p>
        </div>

        <button
          id="btn-new-exercise"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-950 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Exercício
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do exercício ou descrição..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Muscle group chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full -mx-1 px-1">
          {MUSCLE_GROUPS.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGroup === group
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      {filteredExercises.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          <Dumbbell className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <h4 className="text-base font-semibold text-slate-300">Nenhum exercício encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca ou cadastre um novo exercício.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => {
            const hasVideo = Boolean(ex.youtubeUrl);
            const thumb = getYouTubeThumbnail(ex.youtubeUrl);

            return (
              <div
                key={ex.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-xs"
              >
                <div>
                  {/* Top badge and actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {ex.muscleGroup}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(ex)}
                        title="Editar Exercício"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteExercise(ex.id)}
                        title="Excluir Exercício"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {ex.description || 'Sem descrição técnica informada.'}
                  </p>

                  {/* Video Preview / Button */}
                  {hasVideo && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setPreviewVideoUrl(ex.youtubeUrl)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/40 rounded-xl text-xs text-slate-300 hover:text-white transition-all group/vid"
                      >
                        <Youtube className="w-4 h-4 text-red-500 group-hover/vid:scale-110 transition-transform" />
                        <span>Ver Vídeo de Execução</span>
                        <Play className="w-3 h-3 text-slate-400 ml-auto" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer specs */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">
                    {ex.defaultSets} séries × {ex.defaultReps}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    {ex.defaultRestSeconds}s descanso
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                {editingId ? 'Editar Exercício' : 'Cadastrar Novo Exercício'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Supino Reto com Barra, Agachamento Livre..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Grupo Muscular *
                </label>
                <select
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value as Exercise['muscleGroup'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {MUSCLE_GROUPS.filter(g => g !== 'Todos').map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Link do Vídeo do YouTube
                </label>
                <div className="relative">
                  <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cole o link normal do YouTube. O app carrega o player para o aluno ver a postura e execução.
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Descrição Técnica e Instruções de Execução
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Orientações sobre pegada, postura, amplitude, respiração e cadência..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs resize-none"
                />
              </div>

              {/* Default Sets, Reps & Rest */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Séries Padrão
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={defaultSets}
                    onChange={(e) => setDefaultSets(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs text-center"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Reps Padrão
                  </label>
                  <input
                    type="text"
                    value={defaultReps}
                    onChange={(e) => setDefaultReps(e.target.value)}
                    placeholder="Ex: 8-10"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs text-center"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Descanso (s)
                  </label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    max="300"
                    value={defaultRestSeconds}
                    onChange={(e) => setDefaultRestSeconds(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs text-center"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Exercício'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-sm text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                Demonstração da Execução
              </span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {getYouTubeEmbedUrl(previewVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(previewVideoUrl)!}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                  <p className="text-sm font-medium">Não foi possível carregar o player para esta URL.</p>
                  <a
                    href={previewVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium inline-flex items-center gap-2"
                  >
                    Abrir no YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
