import React, { useState } from 'react';
import { Student } from '../../types';
import { Lock, Key, ArrowRight, ShieldAlert, Dumbbell, UserCheck, AlertCircle } from 'lucide-react';

interface StudentLoginProps {
  students: Student[];
  onLoginSuccess: (student: Student) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ students, onLoginSuccess }) => {
  const [accessInput, setAccessInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const term = accessInput.trim().toLowerCase();
    if (!term) {
      setErrorMsg('Por favor, informe seu e-mail ou código de acesso.');
      return;
    }

    // Busca por e-mail ou por accessCode
    const found = students.find(s => 
      s.email.toLowerCase() === term || 
      s.accessCode.toLowerCase() === term
    );

    if (!found) {
      setErrorMsg('Acesso não autorizado. Apenas alunos cadastrados pelo professor da academia têm acesso. Verifique com seu treinador.');
      return;
    }

    if (found.status === 'inactive') {
      setErrorMsg('Seu cadastro está atualmente inativo. Entre em contato com seu professor da academia para reativar.');
      return;
    }

    onLoginSuccess(found);
  };

  const handleQuickLogin = (student: Student) => {
    onLoginSuccess(student);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950 text-white">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Área do Aluno</h2>
            <p className="text-xs text-slate-400 mt-1">
              Acesso exclusivo aos treinos personalizados cadastrados pelo seu treinador.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail ou Código de Acesso do Aluno
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={accessInput}
                onChange={(e) => {
                  setAccessInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ex: ALUNO01 ou seu e-mail"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
          >
            <span>Acessar Meus Treinos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Notice of restriction */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
          <span>
            Não possui cadastro? Solicite ao professor da sua academia para criar sua ficha de aluno e fornecer seu código de acesso.
          </span>
        </div>

        {/* Quick Demo Access (for convenience) */}
        {students.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              Alunos Cadastrados no Sistema (Clique para testar):
            </span>
            <div className="flex flex-col gap-1.5">
              {students.slice(0, 3).map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleQuickLogin(st)}
                  className="w-full px-3 py-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl text-xs text-left text-slate-300 hover:text-white flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-medium truncate">{st.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 group-hover:text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                    {st.accessCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
