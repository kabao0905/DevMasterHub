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

type Bien = { uid: string; tech: string; level: string; lesson: string; xong: boolean };
const KHOA_GHI = ['progress', 'ghi'];
const datTrangThai = (ds: string[], khoa: string, xong: boolean) => (xong ? [...ds.filter(k => k !== khoa), khoa] : ds.filter(k => k !== khoa));

/** Bat/tat "da hoan thanh" mot bai: doi ngay tren giao dien, ghi dung mot dong len Supabase */
export function useToggleComplete() {
  const { client, user } = useAuth();
  const { t } = useT();
  const qc = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: KHOA_GHI,
    // Cung scope: lan ghi sau doi lan truoc xong, server nhan dung thu tu nguoi dung bam
    scope: { id: 'progress' },
    mutationFn: async ({ uid, tech, level, lesson, xong }: Bien) => {
      const { error } = await client.from('lesson_progress').upsert(
        { user_id: uid, tech_id: tech, level_id: level, lesson_id: lesson, completed: xong, completed_at: xong ? new Date().toISOString() : null },
        { onConflict: 'user_id,tech_id,level_id,lesson_id' }
      );
      if (error) throw error;
    },
    onError: (_loi, { uid, tech, level, lesson, xong }) => {
      // Supabase tra { error } chu khong nem: truoc day loi ghi bi nuot im lang
      qc.setQueryData<string[]>(['progress', uid], ds => ds && datTrangThai(ds, khoaBai(tech, level, lesson), !xong));
      toast.error(t('progressSaveFailed'));
    },
    onSettled: (_kq, _loi, { uid }) => {
      // Lan ghi cuoi cung trong loat bam: lay lai su that tu server (queryFn ghi luon cache cho app cu).
      // Doi den luc nay moi doi chieu vi giua chung giao dien da doi theo nhung lan bam sau.
      // Da dang xuat thi truy van da bi xoa: khong co gi de tai, khong ghi tien do nguoi cu vao may.
      if (qc.isMutating({ mutationKey: KHOA_GHI }) === 1) void qc.invalidateQueries({ queryKey: ['progress', uid] });
    }
  });

  const toggle = useCallback((tech: string, level: string, lesson: string) => {
    if (!user) return;
    const uid = user.id;
    const khoa = khoaBai(tech, level, lesson);
    const ds = qc.getQueryData<string[]>(['progress', uid]);
    // Chua biet trang thai that (dang tai / tai loi): bam luc nay se tinh sai va ghi de cache
    if (!ds) return;
    const xong = !ds.includes(khoa);
    // Doi ngay luc bam (khong doi den luot ghi) de lan bam sau tinh tu trang thai nguoi dung dang thay
    qc.setQueryData<string[]>(['progress', uid], datTrangThai(ds, khoa, xong));
    mutate({ uid, tech, level, lesson, xong });
  }, [user, qc, mutate]);

  return { toggle, pending: isPending };
}
