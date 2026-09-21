import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Obter credenciais de variáveis de ambiente ou do localStorage (para configuração em tempo real no app)
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') || '' : '';

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.includes('supabase.co') &&
    anonKey !== 'your-anon-key'
  );

  return { url, anonKey, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey);
    }
    return supabaseInstance;
  } catch (error) {
    console.error('Erro ao inicializar cliente Supabase:', error);
    return null;
  }
}

export function resetSupabaseClient() {
  supabaseInstance = null;
}

// Script SQL completo para criação das tabelas no Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- =======================================================
-- SCRIPT SQL COMPLETO PARA O SUPABASE (ACADEMIA PRO TREINOS)
-- =======================================================
-- Execute este script no 'SQL Editor' do seu painel Supabase.
-- Ele cria todas as tabelas, índices de alta performance,
-- políticas de segurança (RLS) e insere os dados iniciais.

-- 1. TABELA DE ALUNOS (students)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  access_code TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  assigned_workout_ids JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE EXERCÍCIOS (exercises)
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  default_sets INTEGER NOT NULL DEFAULT 3,
  default_reps TEXT NOT NULL DEFAULT '10-12',
  default_rest_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE FICHAS DE TREINO (workouts)
CREATE TABLE IF NOT EXISTS public.workouts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE HISTÓRICO E REGISTRO DE CARGAS (workout_logs)
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  workout_id TEXT,
  workout_name TEXT NOT NULL,
  workout_code TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  feedback_notes TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ÍNDICES DE DESEMPENHO
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_access_code ON public.students(access_code);
CREATE INDEX IF NOT EXISTS idx_workout_logs_student ON public.workout_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_created ON public.workout_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON public.exercises(muscle_group);

-- 6. HABILITAR ROW LEVEL SECURITY (RLS) E PERMISSÕES PÚBLICAS (ANON KEY)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access students" ON public.students;
CREATE POLICY "Allow public all access students" ON public.students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all access exercises" ON public.exercises;
CREATE POLICY "Allow public all access exercises" ON public.exercises FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all access workouts" ON public.workouts;
CREATE POLICY "Allow public all access workouts" ON public.workouts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all access logs" ON public.workout_logs;
CREATE POLICY "Allow public all access logs" ON public.workout_logs FOR ALL USING (true) WITH CHECK (true);

-- 7. DADOS INICIAIS (EXERCÍCIOS COM VÍDEOS REAIS E FICHAS)
INSERT INTO public.exercises (id, name, muscle_group, description, youtube_url, default_sets, default_reps, default_rest_seconds)
VALUES 
  ('ex-1', 'Supino Reto com Barra', 'Peito', 'Deitado no banco, pegada ligeiramente mais larga que os ombros. Desça a barra até o peito mantendo escápulas aduzidas.', 'https://www.youtube.com/watch?v=rT7DgCr-3pg', 4, '8-10', 90),
  ('ex-2', 'Crucifixo Inclinado com Halteres', 'Peito', 'Banco a 30-45 graus. Abra os braços com leve flexão nos cotovelos sentindo o peitoral superior.', 'https://www.youtube.com/watch?v=ajdFwa-qM98', 3, '10-12', 60),
  ('ex-3', 'Tríceps Corda na Polia', 'Tríceps', 'Cotovelos junto ao tronco, abra a corda no ponto de máxima extensão.', 'https://www.youtube.com/watch?v=vB5OHsJ3EME', 3, '12-15', 45),
  ('ex-4', 'Puxada Frontal Aberta', 'Costas', 'Puxe a barra em direção à parte superior do peito puxando com os cotovelos.', 'https://www.youtube.com/watch?v=CAwf7n6Luuc', 4, '10-12', 75),
  ('ex-5', 'Remada Curvada com Barra', 'Costas', 'Coluna alinhada em 45 graus, puxe a barra rente às pernas em direção ao abdômen.', 'https://www.youtube.com/watch?v=G8l_8chR5BE', 4, '8-10', 90),
  ('ex-6', 'Rosca Direta com Barra W', 'Bíceps', 'Mantenha os cotovelos travados na linha do corpo e eleve a barra flexionando os antebraços.', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', 3, '10-12', 60),
  ('ex-7', 'Agachamento Livre com Barra', 'Pernas', 'Pés na largura dos ombros, desça flexionando joelhos e quadril com tronco firme.', 'https://www.youtube.com/watch?v=bEv6CCg2BC8', 4, '8-10', 120),
  ('ex-8', 'Leg Press 45°', 'Pernas', 'Pés no centro da plataforma, desça até 90 graus sem arredondar a lombar.', 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', 4, '10-12', 90),
  ('ex-9', 'Desenvolvimento Militar com Halteres', 'Ombros', 'Sentado com banco em 90 graus, empurre os halteres acima da cabeça.', 'https://www.youtube.com/watch?v=qEwKCR5JCog', 4, '8-10', 75),
  ('ex-10', 'Elevação Lateral com Halteres', 'Ombros', 'Eleve os braços lateralmente até a altura dos ombros controlando a fase excêntrica.', 'https://www.youtube.com/watch?v=3VcKaXpzqRo', 3, '12-15', 45)
ON CONFLICT (id) DO NOTHING;

-- ALUNO DE DEMONSTRAÇÃO
INSERT INTO public.students (id, name, email, access_code, phone, status, assigned_workout_ids, notes)
VALUES (
  'student-1',
  'Lucas Silva',
  'lucas@exemplo.com',
  '1234',
  '(11) 98765-4321',
  'active',
  '["w-1", "w-2", "w-3"]'::jsonb,
  'Objetivo: Hipertrofia e melhora postural. Foco em progressão de cargas nos compostos.'
)
ON CONFLICT (id) DO NOTHING;

-- FICHAS DE TREINO (A, B, C)
INSERT INTO public.workouts (id, name, code, description, exercises)
VALUES 
  (
    'w-1',
    'Treino A - Peito, Tríceps & Ombro Frontal',
    'A',
    'Foco no complexo anterior superior. Aquecer o manguito antes de iniciar as séries pesadas de supino.',
    '[
      {"exerciseId": "ex-1", "sets": 4, "reps": "8-10", "restSeconds": 90, "suggestedWeight": 60, "notes": "Manter escápulas retraídas."},
      {"exerciseId": "ex-2", "sets": 3, "reps": "10-12", "restSeconds": 60, "suggestedWeight": 16, "notes": "Foco no alongamento peitoral."},
      {"exerciseId": "ex-9", "sets": 4, "reps": "8-10", "restSeconds": 75, "suggestedWeight": 18, "notes": "Controle a descida até as orelhas."},
      {"exerciseId": "ex-3", "sets": 3, "reps": "12-15", "restSeconds": 45, "suggestedWeight": 25, "notes": "Pausa de 1 segundo em contração máxima."}
    ]'::jsonb
  ),
  (
    'w-2',
    'Treino B - Costas, Bíceps & Trapézio',
    'B',
    'Foco na cadeia posterior superior e espessura dorsal. Manter pegada firme e puxar com os cotovelos.',
    '[
      {"exerciseId": "ex-4", "sets": 4, "reps": "10-12", "restSeconds": 75, "suggestedWeight": 55, "notes": "Puxar a barra em direção à clavícula."},
      {"exerciseId": "ex-5", "sets": 4, "reps": "8-10", "restSeconds": 90, "suggestedWeight": 50, "notes": "Tronco firme a 45 graus."},
      {"exerciseId": "ex-6", "sets": 3, "reps": "10-12", "restSeconds": 60, "suggestedWeight": 24, "notes": "Não balance a coluna na subida."}
    ]'::jsonb
  ),
  (
    'w-3',
    'Treino C - Pernas Completo & Ombros Laterais',
    'C',
    'Foco em membros inferiores e deltoide lateral. Atenção à amplitude do agachamento e controle do quadril.',
    '[
      {"exerciseId": "ex-7", "sets": 4, "reps": "8-10", "restSeconds": 120, "suggestedWeight": 80, "notes": "Descer até pelo menos 90 graus."},
      {"exerciseId": "ex-8", "sets": 4, "reps": "10-12", "restSeconds": 90, "suggestedWeight": 160, "notes": "Pés alinhados aos ombros."},
      {"exerciseId": "ex-10", "sets": 3, "reps": "12-15", "restSeconds": 45, "suggestedWeight": 10, "notes": "Não impulsione com o trapézio."}
    ]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
`;
