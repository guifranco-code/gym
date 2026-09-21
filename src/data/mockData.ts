import { Exercise, Student, Workout, WorkoutLog } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Supino Reto com Barra',
    muscleGroup: 'Peito',
    description: 'Deitado no banco, pegada ligeiramente mais larga que os ombros. Desça a barra de forma controlada até tocar suavemente o meio do peito, mantendo as escápulas retraídas e cotovelos a ~45 graus do tronco. Empurre com força.',
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'ex-2',
    name: 'Crucifixo Inclinado com Halteres',
    muscleGroup: 'Peito',
    description: 'Banco inclinado a 30-45 graus. Abra os braços mantendo leve flexão dos cotovelos sentindo o alongamento peitoral. Retorne fechando os halteres no alto contraindo o peitoral superior.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ajdFwa-qM98',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    createdAt: '2026-08-01T10:05:00Z',
  },
  {
    id: 'ex-3',
    name: 'Tríceps Corda na Polia',
    muscleGroup: 'Tríceps',
    description: 'Cotovelos fixos ao lado do corpo. Estenda os braços para baixo abrindo a corda no final da descida para contração máxima do tríceps. Suba controlando o movimento sem mover os ombros.',
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSeconds: 45,
    createdAt: '2026-08-01T10:10:00Z',
  },
  {
    id: 'ex-4',
    name: 'Puxada Frontal Aberta',
    muscleGroup: 'Costas',
    description: 'Sentado no pulley, pegada aberta pronada. Inicie o movimento puxando com as escápulas e cotovelos apontando para baixo até a barra se aproximar da parte superior do peito. Não incline o tronco excessivamente.',
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 75,
    createdAt: '2026-08-01T10:15:00Z',
  },
  {
    id: 'ex-5',
    name: 'Remada Curvada com Barra',
    muscleGroup: 'Costas',
    description: 'Pés na largura dos ombros, joelhos semi-flexionados e tronco inclinado a cerca de 45 graus com coluna alinhada. Puxe a barra em direção ao umbigo contraindo as dorsais.',
    youtubeUrl: 'https://www.youtube.com/watch?v=G8l_8chR5BE',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 90,
    createdAt: '2026-08-01T10:20:00Z',
  },
  {
    id: 'ex-6',
    name: 'Rosca Direta com Barra W',
    muscleGroup: 'Bíceps',
    description: 'Em pé, cotovelos junto ao tronco. Flexione os antebraços erguendo a barra sem balançar o corpo. Desça de forma lenta e controlada até quase a extensão total.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSeconds: 60,
    createdAt: '2026-08-01T10:25:00Z',
  },
  {
    id: 'ex-7',
    name: 'Agachamento Livre com Barra',
    muscleGroup: 'Pernas',
    description: 'Barra apoiada nos trapézios, pés alinhados aos ombros e levemente apontados para fora. Desça flexionando quadril e joelhos mantendo o peito erguido e a coluna neutra até pelo menos 90 graus.',
    youtubeUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 120,
    createdAt: '2026-08-01T10:30:00Z',
  },
  {
    id: 'ex-8',
    name: 'Leg Press 45°',
    muscleGroup: 'Pernas',
    description: 'Apoie os pés no centro da plataforma afastados na largura dos ombros. Destrave o aparelho e desça flexionando os joelhos até aproximadamente 90 graus sem descolar a lombar do encosto.',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSeconds: 90,
    createdAt: '2026-08-01T10:35:00Z',
  },
  {
    id: 'ex-9',
    name: 'Desenvolvimento Militar com Halteres',
    muscleGroup: 'Ombros',
    description: 'Sentado com encosto ereto a 85-90 graus. Halteres na altura das orelhas, empurre acima da cabeça até os braços quase estenderem. Controle a descida.',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSeconds: 75,
    createdAt: '2026-08-01T10:40:00Z',
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-1',
    code: 'A',
    name: 'Treino A - Peito, Tríceps e Ombros',
    description: 'Foco em cadeia anterior superior e impulso. Manter cadência controlada na fase excêntrica.',
    exercises: [
      {
        id: 'we-1',
        exerciseId: 'ex-1',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        suggestedWeight: 40,
        notes: 'Aquecimento prévio com barra vazia. Carga progressiva.',
        order: 1
      },
      {
        id: 'we-2',
        exerciseId: 'ex-2',
        sets: 3,
        reps: '10-12',
        restSeconds: 60,
        suggestedWeight: 14,
        notes: 'Alongamento máximo no fundo do movimento.',
        order: 2
      },
      {
        id: 'we-3',
        exerciseId: 'ex-9',
        sets: 4,
        reps: '8-10',
        restSeconds: 75,
        suggestedWeight: 16,
        notes: 'Sem impulsão de pernas, tronco apoiado.',
        order: 3
      },
      {
        id: 'we-4',
        exerciseId: 'ex-3',
        sets: 3,
        reps: '12-15',
        restSeconds: 45,
        suggestedWeight: 20,
        notes: 'Pico de contração de 1 segundo embaixo.',
        order: 4
      }
    ],
    createdAt: '2026-08-01T11:00:00Z'
  },
  {
    id: 'w-2',
    code: 'B',
    name: 'Treino B - Costas e Bíceps',
    description: 'Foco em tração e espessura dorsal. Ativar bem as escápulas antes de puxar com os braços.',
    exercises: [
      {
        id: 'we-5',
        exerciseId: 'ex-4',
        sets: 4,
        reps: '10-12',
        restSeconds: 75,
        suggestedWeight: 45,
        notes: 'Puxar até o queixo/peito alto.',
        order: 1
      },
      {
        id: 'we-6',
        exerciseId: 'ex-5',
        sets: 4,
        reps: '8-10',
        restSeconds: 90,
        suggestedWeight: 40,
        notes: 'Manter lombar selada e firme.',
        order: 2
      },
      {
        id: 'we-7',
        exerciseId: 'ex-6',
        sets: 3,
        reps: '10-12',
        restSeconds: 60,
        suggestedWeight: 15,
        notes: 'Sem balanço do tronco.',
        order: 3
      }
    ],
    createdAt: '2026-08-01T11:10:00Z'
  },
  {
    id: 'w-3',
    code: 'C',
    name: 'Treino C - Pernas Completo',
    description: 'Membros inferiores completo: quadríceps, posteriores e estabilização de core.',
    exercises: [
      {
        id: 'we-8',
        exerciseId: 'ex-7',
        sets: 4,
        reps: '8-10',
        restSeconds: 120,
        suggestedWeight: 60,
        notes: 'Profundidade consistente até 90 graus.',
        order: 1
      },
      {
        id: 'we-9',
        exerciseId: 'ex-8',
        sets: 4,
        reps: '10-12',
        restSeconds: 90,
        suggestedWeight: 140,
        notes: 'Pés paralelos e respiração cadenciada.',
        order: 2
      }
    ],
    createdAt: '2026-08-01T11:20:00Z'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@academia.com',
    accessCode: 'ALUNO01',
    phone: '(11) 98765-4321',
    status: 'active',
    assignedWorkoutIds: ['w-1', 'w-2', 'w-3'],
    notes: 'Objetivo: Hipertrofia e ganho de força. Treina 4x na semana.',
    createdAt: '2026-08-01T12:00:00Z'
  },
  {
    id: 'std-2',
    name: 'Mariana Costa Oliveira',
    email: 'mariana.costa@academia.com',
    accessCode: 'ALUNO02',
    phone: '(21) 99887-1122',
    status: 'active',
    assignedWorkoutIds: ['w-1', 'w-2', 'w-3'],
    notes: 'Objetivo: Condicionamento e definição. Atenção com postura no agachamento.',
    createdAt: '2026-08-02T14:00:00Z'
  }
];

// Histórico de treinos com cargas reais para demonstrar a evolução de força nos gráficos
export const INITIAL_LOGS: WorkoutLog[] = [
  {
    id: 'log-1',
    studentId: 'std-1',
    workoutId: 'w-1',
    workoutName: 'Treino A - Peito, Tríceps e Ombros',
    workoutCode: 'A',
    startedAt: '2026-08-05T18:00:00Z',
    completedAt: '2026-08-05T19:05:00Z',
    durationMinutes: 65,
    feedbackNotes: 'Treino bem executado, sentiu boa fadiga no peitoral.',
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Supino Reto com Barra',
        sets: [
          { setNumber: 1, weightKg: 40, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 40, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 44, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 44, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Crucifixo Inclinado com Halteres',
        sets: [
          { setNumber: 1, weightKg: 12, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 12, repsCompleted: 12, completed: true },
          { setNumber: 3, weightKg: 14, repsCompleted: 10, completed: true },
        ]
      },
      {
        exerciseId: 'ex-9',
        exerciseName: 'Desenvolvimento Militar com Halteres',
        sets: [
          { setNumber: 1, weightKg: 14, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 14, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 16, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 16, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Tríceps Corda na Polia',
        sets: [
          { setNumber: 1, weightKg: 18, repsCompleted: 14, completed: true },
          { setNumber: 2, weightKg: 18, repsCompleted: 14, completed: true },
          { setNumber: 3, weightKg: 20, repsCompleted: 12, completed: true },
        ]
      }
    ]
  },
  {
    id: 'log-2',
    studentId: 'std-1',
    workoutId: 'w-1',
    workoutName: 'Treino A - Peito, Tríceps e Ombros',
    workoutCode: 'A',
    startedAt: '2026-08-12T18:15:00Z',
    completedAt: '2026-08-12T19:18:00Z',
    durationMinutes: 63,
    feedbackNotes: 'Aumentei 4kg no supino nas últimas séries!',
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Supino Reto com Barra',
        sets: [
          { setNumber: 1, weightKg: 44, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 44, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 48, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 48, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Crucifixo Inclinado com Halteres',
        sets: [
          { setNumber: 1, weightKg: 14, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 14, repsCompleted: 11, completed: true },
          { setNumber: 3, weightKg: 14, repsCompleted: 10, completed: true },
        ]
      },
      {
        exerciseId: 'ex-9',
        exerciseName: 'Desenvolvimento Militar com Halteres',
        sets: [
          { setNumber: 1, weightKg: 16, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 16, repsCompleted: 9, completed: true },
          { setNumber: 3, weightKg: 16, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 18, repsCompleted: 7, completed: true },
        ]
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Tríceps Corda na Polia',
        sets: [
          { setNumber: 1, weightKg: 20, repsCompleted: 13, completed: true },
          { setNumber: 2, weightKg: 20, repsCompleted: 12, completed: true },
          { setNumber: 3, weightKg: 22, repsCompleted: 10, completed: true },
        ]
      }
    ]
  },
  {
    id: 'log-3',
    studentId: 'std-1',
    workoutId: 'w-1',
    workoutName: 'Treino A - Peito, Tríceps e Ombros',
    workoutCode: 'A',
    startedAt: '2026-08-20T18:00:00Z',
    completedAt: '2026-08-20T19:00:00Z',
    durationMinutes: 60,
    feedbackNotes: 'Execução muito limpa no supino e tríceps.',
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Supino Reto com Barra',
        sets: [
          { setNumber: 1, weightKg: 48, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 48, repsCompleted: 9, completed: true },
          { setNumber: 3, weightKg: 52, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 52, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Crucifixo Inclinado com Halteres',
        sets: [
          { setNumber: 1, weightKg: 14, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 16, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 16, repsCompleted: 10, completed: true },
        ]
      },
      {
        exerciseId: 'ex-9',
        exerciseName: 'Desenvolvimento Militar com Halteres',
        sets: [
          { setNumber: 1, weightKg: 16, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 18, repsCompleted: 8, completed: true },
          { setNumber: 3, weightKg: 18, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 18, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Tríceps Corda na Polia',
        sets: [
          { setNumber: 1, weightKg: 22, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 22, repsCompleted: 12, completed: true },
          { setNumber: 3, weightKg: 24, repsCompleted: 10, completed: true },
        ]
      }
    ]
  },
  {
    id: 'log-4',
    studentId: 'std-1',
    workoutId: 'w-1',
    workoutName: 'Treino A - Peito, Tríceps e Ombros',
    workoutCode: 'A',
    startedAt: '2026-08-28T18:10:00Z',
    completedAt: '2026-08-28T19:15:00Z',
    durationMinutes: 65,
    feedbackNotes: 'Novo recorde pessoal de 58kg no supino!',
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Supino Reto com Barra',
        sets: [
          { setNumber: 1, weightKg: 50, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 54, repsCompleted: 8, completed: true },
          { setNumber: 3, weightKg: 56, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 58, repsCompleted: 6, completed: true },
        ]
      },
      {
        exerciseId: 'ex-2',
        exerciseName: 'Crucifixo Inclinado com Halteres',
        sets: [
          { setNumber: 1, weightKg: 16, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 16, repsCompleted: 11, completed: true },
          { setNumber: 3, weightKg: 18, repsCompleted: 9, completed: true },
        ]
      },
      {
        exerciseId: 'ex-9',
        exerciseName: 'Desenvolvimento Militar com Halteres',
        sets: [
          { setNumber: 1, weightKg: 18, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 18, repsCompleted: 9, completed: true },
          { setNumber: 3, weightKg: 20, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 20, repsCompleted: 7, completed: true },
        ]
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Tríceps Corda na Polia',
        sets: [
          { setNumber: 1, weightKg: 22, repsCompleted: 14, completed: true },
          { setNumber: 2, weightKg: 24, repsCompleted: 12, completed: true },
          { setNumber: 3, weightKg: 26, repsCompleted: 10, completed: true },
        ]
      }
    ]
  },
  {
    id: 'log-5',
    studentId: 'std-1',
    workoutId: 'w-3',
    workoutName: 'Treino C - Pernas Completo',
    workoutCode: 'C',
    startedAt: '2026-08-08T17:30:00Z',
    completedAt: '2026-08-08T18:40:00Z',
    durationMinutes: 70,
    feedbackNotes: 'Primeiro treino de perna com agachamento livre.',
    exercises: [
      {
        exerciseId: 'ex-7',
        exerciseName: 'Agachamento Livre com Barra',
        sets: [
          { setNumber: 1, weightKg: 60, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 60, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 65, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 70, repsCompleted: 8, completed: true },
        ]
      },
      {
        exerciseId: 'ex-8',
        exerciseName: 'Leg Press 45°',
        sets: [
          { setNumber: 1, weightKg: 140, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 150, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 160, repsCompleted: 10, completed: true },
          { setNumber: 4, weightKg: 160, repsCompleted: 10, completed: true },
        ]
      }
    ]
  },
  {
    id: 'log-6',
    studentId: 'std-1',
    workoutId: 'w-3',
    workoutName: 'Treino C - Pernas Completo',
    workoutCode: 'C',
    startedAt: '2026-08-25T17:30:00Z',
    completedAt: '2026-08-25T18:42:00Z',
    durationMinutes: 72,
    feedbackNotes: 'Evolução brutal nas pernas, agachando com 90kg!',
    exercises: [
      {
        exerciseId: 'ex-7',
        exerciseName: 'Agachamento Livre com Barra',
        sets: [
          { setNumber: 1, weightKg: 70, repsCompleted: 10, completed: true },
          { setNumber: 2, weightKg: 80, repsCompleted: 8, completed: true },
          { setNumber: 3, weightKg: 85, repsCompleted: 8, completed: true },
          { setNumber: 4, weightKg: 90, repsCompleted: 6, completed: true },
        ]
      },
      {
        exerciseId: 'ex-8',
        exerciseName: 'Leg Press 45°',
        sets: [
          { setNumber: 1, weightKg: 160, repsCompleted: 12, completed: true },
          { setNumber: 2, weightKg: 180, repsCompleted: 10, completed: true },
          { setNumber: 3, weightKg: 200, repsCompleted: 10, completed: true },
          { setNumber: 4, weightKg: 210, repsCompleted: 8, completed: true },
        ]
      }
    ]
  }
];
