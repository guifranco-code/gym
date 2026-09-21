import React, { useState } from 'react';
import { Student, Workout } from '../../types';
import { Users, Plus, Edit2, Trash2, Key, Check, Copy, Phone, Mail, ShieldCheck, ShieldX, UserCheck, Dumbbell } from 'lucide-react';

interface StudentsManagerProps {
  students: Student[];
  workouts: Workout[];
  onSaveStudent: (student: Student) => Promise<void>;
  onDeleteStudent: (studentId: string) => Promise<void>;
  onSelectStudentReports?: (studentId: string) => void;
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  workouts,
  onSaveStudent,
  onDeleteStudent,
  onSelectStudentReports,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [assignedWorkoutIds, setAssignedWorkoutIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    // Gerar código de acesso aleatório de 6 caracteres legíveis
    const generated = `ALUNO${Math.floor(10 + Math.random() * 90)}`;
    setAccessCode(generated);
    setPhone('');
    setStatus('active');
    // Atribuir todos os treinos por padrão
    setAssignedWorkoutIds(workouts.map(w => w.id));
    setNotes('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAccessCode(student.accessCode);
    setPhone(student.phone || '');
    setStatus(student.status);
    setAssignedWorkoutIds(student.assignedWorkoutIds || []);
    setNotes(student.notes || '');
    setIsModalOpen(true);
  };

  const handleToggleWorkout = (workoutId: string) => {
    setAssignedWorkoutIds(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !accessCode.trim()) return;

    setLoading(true);
    try {
      const student: Student = {
        id: editingId || `std-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        accessCode: accessCode.trim().toUpperCase(),
        phone: phone.trim(),
        status,
        assignedWorkoutIds,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      await onSaveStudent(student);
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
            <Users className="w-5 h-5 text-emerald-400" />
            Alunos Autorizados
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            O aluno só consegue acessar o aplicativo se for cadastrado pelo professor. Cada aluno possui e-mail e código de acesso.
          </p>
        </div>

        <button
          id="btn-new-student"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-950 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Aluno
        </button>
      </div>

      {/* Info notice about access restriction */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Controle de Acesso Restrito: </span>
          O aluno entrará informando seu e-mail cadastrado ou código de acesso. Alunos não cadastrados não têm permissão para acessar os treinos.
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <h4 className="text-base font-semibold text-slate-300">Nenhum aluno cadastrado</h4>
          <p className="text-xs text-slate-500 mt-1">Cadastre o primeiro aluno para liberar o acesso ao app.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {students.map((st) => {
            const isAssignedAny = st.assignedWorkoutIds && st.assignedWorkoutIds.length > 0;
            const assignedWorkouts = workouts.filter(w => st.assignedWorkoutIds?.includes(w.id));

            return (
              <div
                key={st.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm"
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm">
                        {st.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">{st.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            st.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {st.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{st.email}</span>
                        </div>
                        {st.phone && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{st.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(st)}
                        title="Editar Aluno"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(st.id)}
                        title="Excluir Aluno"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Access Code Box */}
                  <div className="mt-4 bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-400">Código de Acesso:</span>
                      <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {st.accessCode}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(st.accessCode)}
                      title="Copiar código para enviar para o aluno"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedCode === st.accessCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedCode === st.accessCode ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  {/* Assigned Workouts */}
                  <div className="mt-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Fichas de Treino Habilitadas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedWorkouts.map(w => (
                        <span
                          key={w.id}
                          className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-slate-200 flex items-center gap-1.5"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                            {w.code}
                          </span>
                          {w.name}
                        </span>
                      ))}
                      {assignedWorkouts.length === 0 && (
                        <span className="text-xs text-amber-400/80 italic">
                          Nenhum treino liberado ainda.
                        </span>
                      )}
                    </div>
                  </div>

                  {st.notes && (
                    <p className="mt-3 text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                      <strong>Obs do Treinador:</strong> {st.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Cadastrado em {new Date(st.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  {onSelectStudentReports && (
                    <button
                      onClick={() => onSelectStudentReports(st.id)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Ver Cargas e Evolução &rarr;
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Cadastrar/Editar Aluno */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
            
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                {editingId ? 'Editar Cadastro do Aluno' : 'Cadastrar Novo Aluno'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4 hidden" />
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Nome Completo do Aluno *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    E-mail do Aluno * (Usado para login)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aluno@email.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Código de Acesso / PIN *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="Ex: ALUNO01"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Status de Acesso
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">Ativo (Permitir acesso aos treinos)</option>
                    <option value="inactive">Inativo (Bloquear acesso)</option>
                  </select>
                </div>
              </div>

              {/* Workouts to assign */}
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">
                  Fichas de Treino Liberadas para este Aluno:
                </label>
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
                  {workouts.map(w => {
                    const isChecked = assignedWorkoutIds.includes(w.id);
                    return (
                      <label
                        key={w.id}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleWorkout(w.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                        />
                        <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                          {w.code}
                        </span>
                        <span className="text-slate-200 font-medium text-xs">{w.name}</span>
                      </label>
                    );
                  })}
                  {workouts.length === 0 && (
                    <p className="text-xs text-slate-500">Nenhum treino criado ainda na aba de Treinos.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Observações e Metas do Aluno
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Objetivos, histórico de lesões, restrições ou frequência recomendada..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
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
                  {editingId ? 'Salvar Alterações' : 'Concluir Cadastro'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
