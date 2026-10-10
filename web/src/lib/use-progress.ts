import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import { khoaBai } from './progress';

/** Cung khoa va dinh dang { "<tech>.<level>.<lesson>": true } voi app cu */
export const KHOA_TIEN_DO = 'devmaster_hub_progress_cache';

function docCache(): string[] {
  try {
    const o = JSON.parse(localStorage.getItem(KHOA_TIEN_DO) || '{}') as Record<string, boolean>;
    return Object.keys(o).filter(k => o[k]);
  } catch {
    return [];
  }
}

type Dong = { tech_id: string; level_id: string; lesson_id: string; completed: boolean };

export function useProgress() {
  const { client, user } = useAuth();
  const q = useQuery({
    queryKey: ['progress', user?.id],
    enabled: !!user,
    // Hien ngay tien do da luu tren may trong luc cho Supabase
    placeholderData: user ? docCache : undefined,
    queryFn: async ({ signal }) => {
      const { data, error } = await client
        .from('lesson_progress')
        .select('tech_id, level_id, lesson_id, completed')
        .eq('user_id', user!.id);
      if (error) throw error;
      const khoa = ((data as Dong[] | null) || []).filter(r => r.completed).map(r => khoaBai(r.tech_id, r.level_id, r.lesson_id));
      // Da dang xuat trong luc cho (truy van bi huy): khong ghi tien do nguoi cu cho nguoi sau thay
      if (!signal.aborted) {
        try {
          localStorage.setItem(KHOA_TIEN_DO, JSON.stringify(Object.fromEntries(khoa.map(k => [k, true]))));
        } catch { /* het cho luu */ }
      }
      return khoa;
    }
  });

  const done = useMemo(() => new Set(user ? q.data ?? [] : []), [q.data, user]);
  const isDone = useCallback((tech: string, level: string, lesson: string) => done.has(khoaBai(tech, level, lesson)), [done]);
  return { done, isDone, loading: !!user && q.isLoading };
}
