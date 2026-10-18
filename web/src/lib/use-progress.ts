import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './auth';
import { useT } from './i18n';
import { khoaBai } from './progress';

export const KHOA_TIEN_DO = 'devmaster_hub_progress_cache';

function docCache(): string[] {
  try {
    const o = JSON.parse(localStorage.getItem(KHOA_TIEN_DO) || '{}') as Record<string, boolean>;
    return Object.keys(o).filter(k => o[k]);
  } catch {
    return [];
  }
}

function ghiCache(khoa: string[]) {
  try {
    localStorage.setItem(KHOA_TIEN_DO, JSON.stringify(Object.fromEntries(khoa.map(k => [k, true]))));
  } catch {}
}

type Dong = { tech_id: string; level_id: string; lesson_id: string; completed: boolean };

export function useProgress() {
  const { client, user } = useAuth();
  const q = useQuery({
    queryKey: ['progress', user?.id],
    enabled: !!user,
    placeholderData: user ? docCache : undefined,
    queryFn: async ({ signal }) => {
      const { data, error } = await client
        .from('lesson_progress')
        .select('tech_id, level_id, lesson_id, completed')
        .eq('user_id', user!.id);
      if (error) throw error;
      const khoa = ((data as Dong[] | null) || []).filter(r => r.completed).map(r => khoaBai(r.tech_id, r.level_id, r.lesson_id));
      if (!signal.aborted) ghiCache(khoa);
      return khoa;
    }
  });

  const done = useMemo(() => new Set(user ? q.data ?? (q.isError ? docCache() : []) : []), [q.data, q.isError, user]);
  const isDone = useCallback((tech: string, level: string, lesson: string) => done.has(khoaBai(tech, level, lesson)), [done]);
  return { done, isDone, loading: !!user && !q.isError && (q.data === undefined || q.isPlaceholderData) };
}

type Bien = { uid: string; tech: string; level: string; lesson: string };
const KHOA_GHI = ['progress', 'ghi'];

export function useDanhDauXong() {
  const { client, user } = useAuth();
  const { t } = useT();
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: KHOA_GHI,
    scope: { id: 'progress' },
    mutationFn: async ({ uid, tech, level, lesson }: Bien) => {
      const { error } = await client.from('lesson_progress').upsert(
        { user_id: uid, tech_id: tech, level_id: level, lesson_id: lesson, completed: true, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,tech_id,level_id,lesson_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => { toast.success(t('lessonCompletedToast')); },
    onError: (_loi, { uid, tech, level, lesson }) => {
      const khoa = khoaBai(tech, level, lesson);
      qc.setQueryData<string[]>(['progress', uid], ds => ds && ds.filter(k => k !== khoa));
      toast.error(t('progressSaveFailed'));
    },
    onSettled: (_kq, _loi, { uid }) => {
      if (qc.isMutating({ mutationKey: KHOA_GHI }) === 1) void qc.invalidateQueries({ queryKey: ['progress', uid] });
    }
  });

  return useCallback((tech: string, level: string, lesson: string) => {
    if (!user) return;
    const uid = user.id;
    const khoa = khoaBai(tech, level, lesson);
    const ds = qc.getQueryData<string[]>(['progress', uid]);
    if (ds?.includes(khoa)) return;
    if (ds) qc.setQueryData<string[]>(['progress', uid], [...ds, khoa]);
    mutate({ uid, tech, level, lesson });
  }, [user, qc, mutate]);
}
