-- ═══════════════════════════════════════════════════════════════
-- DevMaster Hub — Database Schema Migration
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── User Profiles ───
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferred_market TEXT DEFAULT 'both',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Lesson Progress ───
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tech_id TEXT NOT NULL,
  level_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, tech_id, level_id, lesson_id)
);

-- ─── Learning Sessions ───
CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tech_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

-- ─── Career Advisor Chats ───
CREATE TABLE IF NOT EXISTS public.career_chats (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Saved Project Ideas ───
CREATE TABLE IF NOT EXISTS public.saved_ideas (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea JSONB NOT NULL,
  source TEXT,
  topic TEXT,
  level TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Project Submissions ───
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_description TEXT,
  difficulty_level TEXT,
  topic TEXT,
  files JSONB NOT NULL DEFAULT '[]',
  review JSONB,
  score_overall INTEGER,
  score_code_quality INTEGER,
  score_functionality INTEGER,
  score_best_practices INTEGER,
  score_creativity INTEGER,
  ai_feedback TEXT,
  ai_strengths JSONB DEFAULT '[]',
  ai_improvements JSONB DEFAULT '[]',
  languages_used JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own
CREATE POLICY "profiles_own" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Lesson progress: users manage their own
CREATE POLICY "progress_own" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Learning sessions: users manage their own
CREATE POLICY "sessions_own" ON public.learning_sessions FOR ALL USING (auth.uid() = user_id);

-- Career chats: users manage their own
CREATE POLICY "chats_own" ON public.career_chats FOR ALL USING (auth.uid() = user_id);

-- Saved ideas: users manage their own
CREATE POLICY "ideas_own" ON public.saved_ideas FOR ALL USING (auth.uid() = user_id);

-- Project submissions: users manage their own
CREATE POLICY "submissions_own" ON public.project_submissions FOR ALL USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════
-- Auto-create profile on signup (trigger)
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════
-- Indexes for performance
-- ═══════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_user ON public.saved_ideas(user_id);

-- ═══════════════════════════════════════════
-- Disable email confirmation (username-based auth)
-- Run this AFTER creating the project:
-- Go to Authentication > Settings > Email > Disable "Confirm email"
-- ═══════════════════════════════════════════
