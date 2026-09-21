export type UserRole = 'teacher' | 'student';

export interface Student {
  id: string;
  name: string;
  email: string;
  accessCode: string; // Código de acesso do aluno (ex: ALUNO123 ou PIN)
  phone?: string;
  status: 'active' | 'inactive';
  assignedWorkoutIds: string[]; // IDs dos treinos atribuídos a ele (ex: A, B, C)
  notes?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Bíceps' | 'Tríceps' | 'Abdômen' | 'Cardio' | 'Outro';
  description: string;
  youtubeUrl: string;
  defaultSets: number; // Séries esperadas padrão
  defaultReps: string; // Ex: "10-12" ou "8-10"
  defaultRestSeconds: number; // Tempo de descanso em segundos (ex: 60)
  createdAt: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: string; // ex: "12-10-8" ou "3x10"
  restSeconds: number; // ex: 60 ou 90
  suggestedWeight?: number; // Carga sugerida pelo professor (kg)
  notes?: string; // Ex: "Cadência 3010, drop-set na última"
  order: number;
}

export interface Workout {
  id: string;
  name: string; // Ex: "Treino A - Peito e Tríceps", "Treino B - Costas e Bíceps", "Treino C - Pernas Completo"
  code: string; // Ex: "A", "B", "C", "D", "E"
  description?: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface SetExecutionLog {
  setNumber: number;
  weightKg: number; // Carga em kg registrada pelo aluno
  repsCompleted: number; // Repetições realizadas
  completed: boolean;
  notes?: string;
}

export interface ExerciseExecutionLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetExecutionLog[];
}

export interface WorkoutLog {
  id: string;
  studentId: string;
  workoutId: string;
  workoutName: string;
  workoutCode: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  feedbackNotes?: string;
  exercises: ExerciseExecutionLog[];
}

export interface ProgressDataPoint {
  date: string;
  formattedDate: string;
  workoutName: string;
  maxWeightKg: number;
  totalVolumeKg: number; // Soma de (peso * reps)
  bestReps: number;
}
