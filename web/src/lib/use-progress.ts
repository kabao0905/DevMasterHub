import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './auth';
import { useT } from './i18n';
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

function ghiCache(khoa: string[]) {
  try {
    localStorage.setItem(KHOA_TIEN_DO, JSON.stringify(Object.fromEntries(khoa.map(k => [k, true]))));
  } catch { /* het cho luu */ }
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
      if (!signal.aborted) ghiCache(khoa);
      return khoa;
    }
  });

  const done = useMemo(() => new Set(user ? q.data ?? [] : []), [q.data, user]);
  const isDone = useCallback((tech: string, level: string, lesson: string) => done.has(khoaBai(tech, level, lesson)), [done]);
  // loading: chua co du lieu that tu server (dang tai, dang hien ban tam tu may, hoac tai loi)
  return { done, isDone, loading: !!user && (q.data === undefined || q.isPlaceholderData) };
}

type Bien = { uid: string; tech: string; level: string; lesson: string };
const KHOA_GHI = ['progress', 'ghi'];

/**
 * Tich "da hoan thanh" mot bai. Chi goi khi hoc vien lam DAT bai tap/thu thach (AI cham Dung, xong lab):
 * nguoi dung khong tu tich hay bo tich. Doi ngay tren giao dien, ghi dung mot dong len Supabase.
 */
export function useDanhDauXong() {
  const { client, user } = useAuth();
  const { t } = useT();
  const qc = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: KHOA_GHI,
    // Cung scope: cac lan ghi tien do noi duoi nhau, server nhan dung thu tu
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
      // Supabase tra { error } chu khong nem: bo dau tich da hien truoc va bao loi
      const khoa = khoaBai(tech, level, lesson);
      qc.setQueryData<string[]>(['progress', uid], ds => ds && ds.filter(k => k !== khoa));
      toast.error(t('progressSaveFailed'));
    },
    onSettled: (_kq, _loi, { uid }) => {
      // Lan ghi cuoi cung trong loat: lay lai su that tu server (queryFn ghi luon cache cho app cu).
      // Da dang xuat thi truy van da bi xoa: khong co gi de tai, khong ghi tien do nguoi cu vao may.
      if (qc.isMutating({ mutationKey: KHOA_GHI }) === 1) void qc.invalidateQueries({ queryKey: ['progress', uid] });
    }
  });

  return useCallback((tech: string, level: string, lesson: string) => {
    if (!user) return;
    const uid = user.id;
    const khoa = khoaBai(tech, level, lesson);
    const ds = qc.getQueryData<string[]>(['progress', uid]);
    // Da xong tu truoc: khong ghi lai, khong chuc mung lan nua. Chua tai xong tien do thi van ghi (ghi "xong" khong hai gi)
    if (ds?.includes(khoa)) return;
    if (ds) qc.setQueryData<string[]>(['progress', uid], [...ds, khoa]);
    mutate({ uid, tech, level, lesson });
  }, [user, qc, mutate]);
}
