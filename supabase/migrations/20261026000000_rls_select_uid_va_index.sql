BEGIN;

DROP POLICY IF EXISTS "profiles_own" ON public.profiles;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "progress_own" ON public.lesson_progress;
CREATE POLICY "progress_own" ON public.lesson_progress FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "sessions_own" ON public.learning_sessions;
CREATE POLICY "sessions_own" ON public.learning_sessions FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "chats_own" ON public.career_chats;
CREATE POLICY "chats_own" ON public.career_chats FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "ideas_own" ON public.saved_ideas;
CREATE POLICY "ideas_own" ON public.saved_ideas FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "submissions_own" ON public.project_submissions;
CREATE POLICY "submissions_own" ON public.project_submissions FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON public.learning_sessions(user_id, started_at);
CREATE INDEX IF NOT EXISTS idx_submissions_user_submitted ON public.project_submissions(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_user_saved ON public.saved_ideas(user_id, saved_at DESC);

DROP INDEX IF EXISTS public.idx_sessions_user;
DROP INDEX IF EXISTS public.idx_submissions_user;
DROP INDEX IF EXISTS public.idx_ideas_user;
DROP INDEX IF EXISTS public.idx_progress_user;

COMMIT;
