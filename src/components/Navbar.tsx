import React from 'react';
import { Dumbbell, UserCheck, Users, ClipboardList, BarChart3, LogOut, Flame, PlayCircle, Activity } from 'lucide-react';
import { Student, UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTeacherTab: 'exercises' | 'workouts' | 'students' | 'reports';
  onTeacherTabChange: (tab: 'exercises' | 'workouts' | 'students' | 'reports') => void;
  activeStudentTab: 'today' | 'history';
  onStudentTabChange: (tab: 'today' | 'history') => void;
  currentStudent: Student | null;
  onStudentLogout: () => void;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  onRoleChange,
  activeTeacherTab,
  onTeacherTabChange,
  activeStudentTab,
  onStudentTabChange,
  currentStudent,
  onStudentLogout,
}) => {
  return (
    <>
      {/* Top App Header */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 text-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-black text-sm sm:text-lg tracking-tight">
                  <span className="text-white">PRO</span>
                  <span className="text-emerald-400">TREINOS</span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    App
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden md:block">Gestão de Séries, Vídeos e Cargas</p>
              </div>
            </div>

            {/* Right controls: Role switch and student status */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Role Switcher: Professor vs Aluno */}
              <div className="flex items-center bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800">
                <button
                  id="role-teacher-btn"
                  onClick={() => onRoleChange('teacher')}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                    role === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[11px] sm:text-xs">Prof</span>
                </button>
                <button
                  id="role-student-btn"
                  onClick={() => onRoleChange('student')}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transition-all ${
                    role === 'student'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span className="text-[11px] sm:text-xs">Aluno</span>
                </button>
              </div>

              {/* If Student logged in, show quick logout */}
              {role === 'student' && currentStudent && (
                <button
                  onClick={onStudentLogout}
                  title={`Conectado como ${currentStudent.name}. Clique para sair.`}
                  className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Sair</span>
                </button>
              )}

            </div>

          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on Mobile, replaced by Bottom Bar) */}
        <div className="hidden sm:block bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between no-scrollbar overflow-x-auto py-2">
            
            {role === 'teacher' ? (
              <div className="flex items-center gap-2">
                <button
                  id="tab-exercises-btn"
                  onClick={() => onTeacherTabChange('exercises')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTeacherTab === 'exercises'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Exercícios & Vídeos</span>
                </button>

                <button
                  id="tab-workouts-btn"
                  onClick={() => onTeacherTabChange('workouts')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTeacherTab === 'workouts'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Fichas de Treino (A, B, C)</span>
                </button>

                <button
                  id="tab-students-btn"
                  onClick={() => onTeacherTabChange('students')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTeacherTab === 'students'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Alunos Autorizados</span>
                </button>

                <button
                  id="tab-reports-btn"
                  onClick={() => onTeacherTabChange('reports')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTeacherTab === 'reports'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Relatórios & Cargas dos Alunos</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <button
                    id="tab-student-today-btn"
                    onClick={() => onStudentTabChange('today')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      activeStudentTab === 'today'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Treino do Dia</span>
                  </button>

                  <button
                    id="tab-student-history-btn"
                    onClick={() => onStudentTabChange('history')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      activeStudentTab === 'history'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Minha Evolução de Força</span>
                  </button>
                </div>

                {currentStudent && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium truncate max-w-[160px]">
                      {currentStudent.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      {currentStudent.accessCode}
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR (Visible on mobile screens) */}
      <nav aria-label="Navegação mobile" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 safe-pb shadow-2xl">
        {role === 'teacher' ? (
          <div className="grid grid-cols-4 h-15 items-center px-1">
            
            <button
              onClick={() => onTeacherTabChange('exercises')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                activeTeacherTab === 'exercises'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Dumbbell className={`w-5 h-5 transition-transform ${activeTeacherTab === 'exercises' ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 truncate">Exercícios</span>
            </button>

            <button
              onClick={() => onTeacherTabChange('workouts')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                activeTeacherTab === 'workouts'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className={`w-5 h-5 transition-transform ${activeTeacherTab === 'workouts' ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 truncate">Fichas</span>
            </button>

            <button
              onClick={() => onTeacherTabChange('students')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                activeTeacherTab === 'students'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className={`w-5 h-5 transition-transform ${activeTeacherTab === 'students' ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 truncate">Alunos</span>
            </button>

            <button
              onClick={() => onTeacherTabChange('reports')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                activeTeacherTab === 'reports'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className={`w-5 h-5 transition-transform ${activeTeacherTab === 'reports' ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-1 truncate">Relatórios</span>
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-2 h-15 items-center px-4 max-w-sm mx-auto">
            
            <button
              onClick={() => onStudentTabChange('today')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                activeStudentTab === 'today'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlayCircle className={`w-5 h-5 transition-transform ${activeStudentTab === 'today' ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1">Treino do Dia</span>
            </button>

            <button
              onClick={() => onStudentTabChange('history')}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                activeStudentTab === 'history'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className={`w-5 h-5 transition-transform ${activeStudentTab === 'history' ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1">Evolução & Cargas</span>
            </button>

          </div>
        )}
      </nav>
    </>
  );
};
