import { Exercise, Student, Workout, WorkoutLog, ProgressDataPoint } from '../types';
import { INITIAL_EXERCISES, INITIAL_STUDENTS, INITIAL_WORKOUTS, INITIAL_LOGS } from '../data/mockData';
import { getSupabaseClient } from './supabase';

const STORAGE_KEYS = {
  STUDENTS: 'academia_students_v1',
  EXERCISES: 'academia_exercises_v1',
  WORKOUTS: 'academia_workouts_v1',
  LOGS: 'academia_logs_v1',
  CURRENT_STUDENT: 'academia_active_student_v1',
  ACTIVE_VIEW_ROLE: 'academia_user_role_v1',
};

// Carrega dados locais com inicialização padrão se vazio
export function getLocalStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_STUDENTS;
  }
}

export function saveLocalStudents(students: Student[]) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function getLocalExercises(): Exercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(INITIAL_EXERCISES));
      return INITIAL_EXERCISES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_EXERCISES;
  }
}

export function saveLocalExercises(exercises: Exercise[]) {
  localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
}

export function getLocalWorkouts(): Workout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(INITIAL_WORKOUTS));
      return INITIAL_WORKOUTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_WORKOUTS;
  }
}

export function saveLocalWorkouts(workouts: Workout[]) {
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
}

export function getLocalLogs(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LOGS;
  }
}

export function saveLocalLogs(logs: WorkoutLog[]) {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

// Aluno ativo em sessão
export function getActiveStudentSession(): Student | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setActiveStudentSession(student: Student | null) {
  if (!student) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  }
}

// ==========================================
// FUNÇÕES INTEGRATÓRIAS (SUPABASE + LOCAL)
// ==========================================

export async function fetchAllData() {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const [studentsRes, exercisesRes, workoutsRes, logsRes] = await Promise.all([
        supabase.from('students').select('*'),
        supabase.from('exercises').select('*'),
        supabase.from('workouts').select('*'),
        supabase.from('workout_logs').select('*').order('created_at', { ascending: false })
      ]);

      if (!studentsRes.error && studentsRes.data && studentsRes.data.length > 0) {
        // Mapear campos snake_case para camelCase
        const mappedStudents: Student[] = studentsRes.data.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          accessCode: s.access_code,
          phone: s.phone,
          status: s.status as 'active' | 'inactive',
          assignedWorkoutIds: s.assigned_workout_ids || [],
          notes: s.notes,
          createdAt: s.created_at
        }));
        saveLocalStudents(mappedStudents);
      }

      if (!exercisesRes.error && exercisesRes.data && exercisesRes.data.length > 0) {
        const mappedExercises: Exercise[] = exercisesRes.data.map(e => ({
          id: e.id,
          name: e.name,
          muscleGroup: e.muscle_group,
          description: e.description,
          youtubeUrl: e.youtube_url,
          defaultSets: e.default_sets,
          defaultReps: e.default_reps,
          defaultRestSeconds: e.default_rest_seconds,
          createdAt: e.created_at
        }));
        saveLocalExercises(mappedExercises);
      }

      if (!workoutsRes.error && workoutsRes.data && workoutsRes.data.length > 0) {
        const mappedWorkouts: Workout[] = workoutsRes.data.map(w => ({
          id: w.id,
          name: w.name,
          code: w.code,
          description: w.description,
          exercises: w.exercises || [],
          createdAt: w.created_at
        }));
        saveLocalWorkouts(mappedWorkouts);
      }

      if (!logsRes.error && logsRes.data && logsRes.data.length > 0) {
        const mappedLogs: WorkoutLog[] = logsRes.data.map(l => ({
          id: l.id,
          studentId: l.student_id,
          workoutId: l.workout_id,
          workoutName: l.workout_name,
          workoutCode: l.workout_code,
          startedAt: l.started_at,
          completedAt: l.completed_at,
          durationMinutes: l.duration_minutes,
          feedbackNotes: l.feedback_notes,
          exercises: l.exercises || []
        }));
        saveLocalLogs(mappedLogs);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using local storage:', err);
    }
  }

  return {
    students: getLocalStudents(),
    exercises: getLocalExercises(),
    workouts: getLocalWorkouts(),
    logs: getLocalLogs()
  };
}

export async function persistStudent(student: Student): Promise<Student> {
  const current = getLocalStudents();
  const index = current.findIndex(s => s.id === student.id);
  let updated: Student[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = student;
  } else {
    updated = [student, ...current];
  }
  saveLocalStudents(updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('students').upsert({
        id: student.id,
        name: student.name,
        email: student.email,
        access_code: student.accessCode,
        phone: student.phone,
        status: student.status,
        assigned_workout_ids: student.assignedWorkoutIds,
        notes: student.notes,
        created_at: student.createdAt
      });
    } catch (e) {
      console.error('Erro ao sincronizar aluno com Supabase:', e);
    }
  }
  return student;
}

export async function removeStudent(studentId: string): Promise<void> {
  const current = getLocalStudents();
  saveLocalStudents(current.filter(s => s.id !== studentId));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('students').delete().eq('id', studentId);
    } catch (e) {
      console.error('Erro ao excluir aluno do Supabase:', e);
    }
  }
}

export async function persistExercise(exercise: Exercise): Promise<Exercise> {
  const current = getLocalExercises();
  const index = current.findIndex(e => e.id === exercise.id);
  let updated: Exercise[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = exercise;
  } else {
    updated = [exercise, ...current];
  }
  saveLocalExercises(updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('exercises').upsert({
        id: exercise.id,
        name: exercise.name,
        muscle_group: exercise.muscleGroup,
        description: exercise.description,
        youtube_url: exercise.youtubeUrl,
        default_sets: exercise.defaultSets,
        default_reps: exercise.defaultReps,
        default_rest_seconds: exercise.defaultRestSeconds,
        created_at: exercise.createdAt
      });
    } catch (e) {
      console.error('Erro ao sincronizar exercício com Supabase:', e);
    }
  }
  return exercise;
}

export async function removeExercise(exerciseId: string): Promise<void> {
  const current = getLocalExercises();
  saveLocalExercises(current.filter(e => e.id !== exerciseId));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('exercises').delete().eq('id', exerciseId);
    } catch (e) {
      console.error('Erro ao excluir exercício do Supabase:', e);
    }
  }
}

export async function persistWorkout(workout: Workout): Promise<Workout> {
  const current = getLocalWorkouts();
  const index = current.findIndex(w => w.id === workout.id);
  let updated: Workout[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = workout;
  } else {
    updated = [workout, ...current];
  }
  saveLocalWorkouts(updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('workouts').upsert({
        id: workout.id,
        name: workout.name,
        code: workout.code,
        description: workout.description,
        exercises: workout.exercises,
        created_at: workout.createdAt
      });
    } catch (e) {
      console.error('Erro ao sincronizar treino com Supabase:', e);
    }
  }
  return workout;
}

export async function removeWorkout(workoutId: string): Promise<void> {
  const current = getLocalWorkouts();
  saveLocalWorkouts(current.filter(w => w.id !== workoutId));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('workouts').delete().eq('id', workoutId);
    } catch (e) {
      console.error('Erro ao excluir treino do Supabase:', e);
    }
  }
}

export async function persistWorkoutLog(log: WorkoutLog): Promise<WorkoutLog> {
  const current = getLocalLogs();
  const updated = [log, ...current];
  saveLocalLogs(updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('workout_logs').upsert({
        id: log.id,
        student_id: log.studentId,
        workout_id: log.workoutId,
        workout_name: log.workoutName,
        workout_code: log.workoutCode,
        started_at: log.startedAt,
        completed_at: log.completedAt,
        duration_minutes: log.durationMinutes,
        feedback_notes: log.feedbackNotes,
        exercises: log.exercises,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Erro ao salvar log de treino no Supabase:', e);
    }
  }
  return log;
}

// Calcular dados de evolução de força para um aluno em um exercício específico
export function calculateExerciseEvolution(
  logs: WorkoutLog[],
  studentId: string,
  exerciseId: string
): ProgressDataPoint[] {
  const studentLogs = logs.filter(l => l.studentId === studentId);

  // Ordenar cronologicamente do mais antigo para o mais recente
  studentLogs.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  const points: ProgressDataPoint[] = [];

  for (const log of studentLogs) {
    const exLog = log.exercises.find(e => e.exerciseId === exerciseId);
    if (exLog && exLog.sets && exLog.sets.length > 0) {
      const completedSets = exLog.sets.filter(s => s.completed || s.weightKg > 0);
      if (completedSets.length > 0) {
        let maxWeight = 0;
        let totalVolume = 0;
        let bestReps = 0;

        for (const s of completedSets) {
          if (s.weightKg > maxWeight) {
            maxWeight = s.weightKg;
            bestReps = s.repsCompleted;
          }
          totalVolume += (s.weightKg * (s.repsCompleted || 1));
        }

        const dateObj = new Date(log.startedAt);
        const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        points.push({
          date: log.startedAt,
          formattedDate,
          workoutName: log.workoutName,
          maxWeightKg: maxWeight,
          totalVolumeKg: Math.round(totalVolume),
          bestReps
        });
      }
    }
  }

  return points;
}
