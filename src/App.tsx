import React, { useState, useEffect } from 'react';
import { UserRole, Student, Exercise, Workout, WorkoutLog } from './types';
import {
  fetchAllData,
  persistExercise,
  removeExercise,
  persistWorkout,
  removeWorkout,
  persistStudent,
  removeStudent,
  persistWorkoutLog,
  getActiveStudentSession,
  setActiveStudentSession,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { ExercisesManager } from './components/teacher/ExercisesManager';
import { WorkoutsManager } from './components/teacher/WorkoutsManager';
import { StudentsManager } from './components/teacher/StudentsManager';
import { TeacherReports } from './components/teacher/TeacherReports';
import { StudentLogin } from './components/student/StudentLogin';
import { StudentWorkoutView } from './components/student/StudentWorkoutView';
import { StudentHistory } from './components/student/StudentHistory';
import { SupabaseModal } from './components/common/SupabaseModal';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('teacher');

  // Teacher navigation
  const [teacherTab, setTeacherTab] = useState<'exercises' | 'workouts' | 'students' | 'reports'>('exercises');
  const [selectedStudentForReports, setSelectedStudentForReports] = useState<string>('');

  // Student navigation
  const [studentTab, setStudentTab] = useState<'today' | 'history'>('today');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  // Entities
  const [students, setStudents] = useState<Student[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  // Supabase modal
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      const data = await fetchAllData();
      setStudents(data.students);
      setExercises(data.exercises);
      setWorkouts(data.workouts);
      setLogs(data.logs);

      // Check active student session
      const savedStudent = getActiveStudentSession();
      if (savedStudent) {
        // Confirm student is still in active students
        const currentActive = data.students.find(s => s.id === savedStudent.id && s.status === 'active');
        if (currentActive) {
          setCurrentStudent(currentActive);
        } else {
          setActiveStudentSession(null);
        }
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for exercises
  const handleSaveExercise = async (exercise: Exercise) => {
    await persistExercise(exercise);
    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === exercise.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = exercise;
        return updated;
      }
      return [exercise, ...prev];
    });
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Deseja realmente excluir este exercício?')) return;
    await removeExercise(exerciseId);
    setExercises(prev => prev.filter(e => e.id !== exerciseId));
  };

  // Handlers for workouts
  const handleSaveWorkout = async (workout: Workout) => {
    await persistWorkout(workout);
    setWorkouts(prev => {
      const idx = prev.findIndex(w => w.id === workout.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = workout;
        return updated;
      }
      return [workout, ...prev];
    });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm('Deseja realmente excluir esta ficha de treino?')) return;
    await removeWorkout(workoutId);
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  // Handlers for students
  const handleSaveStudent = async (student: Student) => {
    await persistStudent(student);
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === student.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = student;
        return updated;
      }
      return [student, ...prev];
    });
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Deseja realmente remover o acesso deste aluno?')) return;
    await removeStudent(studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (currentStudent?.id === studentId) {
      setCurrentStudent(null);
      setActiveStudentSession(null);
    }
  };

  // Switch to teacher reports for a specific student
  const handleSelectStudentReports = (studentId: string) => {
    setSelectedStudentForReports(studentId);
    setTeacherTab('reports');
  };

  // Student auth
  const handleStudentLogin = (student: Student) => {
    setCurrentStudent(student);
    setActiveStudentSession(student);
    setStudentTab('today');
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setActiveStudentSession(null);
  };

  // Student workout completion
  const handleCompleteWorkout = async (log: WorkoutLog) => {
    await persistWorkoutLog(log);
    setLogs(prev => [log, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-300">Carregando dados da academia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        role={role}
        onRoleChange={(newRole) => {
          setRole(newRole);
          // If switching to student and no student session, prompt login
          if (newRole === 'student' && !currentStudent && students.length > 0) {
            // keep currentStudent as null to prompt login or allow quick-select
          }
        }}
        activeTeacherTab={teacherTab}
        onTeacherTabChange={setTeacherTab}
        activeStudentTab={studentTab}
        onStudentTabChange={setStudentTab}
        currentStudent={currentStudent}
        onStudentLogout={handleStudentLogout}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8">
        
        {/* TEACHER ROLE */}
        {role === 'teacher' && (
          <div>
            {teacherTab === 'exercises' && (
              <ExercisesManager
                exercises={exercises}
                onSaveExercise={handleSaveExercise}
                onDeleteExercise={handleDeleteExercise}
              />
            )}

            {teacherTab === 'workouts' && (
              <WorkoutsManager
                workouts={workouts}
                exercises={exercises}
                onSaveWorkout={handleSaveWorkout}
                onDeleteWorkout={handleDeleteWorkout}
              />
            )}

            {teacherTab === 'students' && (
              <StudentsManager
                students={students}
                workouts={workouts}
                onSaveStudent={handleSaveStudent}
                onDeleteStudent={handleDeleteStudent}
                onSelectStudentReports={handleSelectStudentReports}
              />
            )}

            {teacherTab === 'reports' && (
              <TeacherReports
                students={students}
                exercises={exercises}
                workouts={workouts}
                logs={logs}
                selectedStudentId={selectedStudentForReports || students[0]?.id}
                onSelectStudentId={(id) => setSelectedStudentForReports(id)}
              />
            )}
          </div>
        )}

        {/* STUDENT ROLE */}
        {role === 'student' && (
          <div>
            {!currentStudent ? (
              <StudentLogin
                students={students.filter(s => s.status === 'active')}
                onLoginSuccess={handleStudentLogin}
              />
            ) : (
              <div>
                {studentTab === 'today' && (
                  <StudentWorkoutView
                    student={currentStudent}
                    workouts={workouts}
                    exercises={exercises}
                    onCompleteWorkout={handleCompleteWorkout}
                    onGoToHistory={() => setStudentTab('history')}
                  />
                )}

                {studentTab === 'history' && (
                  <StudentHistory
                    student={currentStudent}
                    exercises={exercises}
                    workouts={workouts}
                    logs={logs}
                    onStartNewWorkout={() => setStudentTab('today')}
                  />
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Supabase Setup & Sync Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onDataRefreshed={loadData}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-400 mb-16 sm:mb-0 px-4">
        <p>Academia Pro Treinos • Sistema integrado para Professores e Alunos</p>
      </footer>

    </div>
  );
}
