import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { luuYTuong, taiYTuong, xoaYTuong, type YTuongDaLuu } from '@/lib/project-db';
import type { CapDo, YTuong } from '@/lib/project-ai';

const KHOA_CACHE_CU = 'devmaster_hub_ideas_cache';
const ghiCacheCu = (ds: YTuongDaLuu[]) => {
  try { localStorage.setItem(KHOA_CACHE_CU, JSON.stringify(ds)); } catch {}
};

const taoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const loiChu = (e: unknown) => (e instanceof Error ? e.message : String(e));

export function useYTuong() {
  const { client, user } = useAuth();
  const { t } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const khoa = ['ideas', uid];

  const q = useQuery({
    queryKey: khoa,
    enabled: !!uid,
    queryFn: async () => {
      const ds = await taiYTuong(client, uid!);
      ghiCacheCu(ds);
      return ds;
    }
  });

  const doc = () => qc.getQueryData<YTuongDaLuu[]>(khoa) ?? [];
  const ghi = (ds: YTuongDaLuu[]) => { qc.setQueryData(khoa, ds); ghiCacheCu(ds); };

  return {
    ds: q.data ?? [],
    dangTai: q.isPending && !!uid,
    loi: q.error,
    taiLai: () => { void q.refetch(); },
    daLuu: (idea: YTuong) => doc().some(s => s.idea.name === idea.name && s.idea.description === idea.description),
    luu: (idea: YTuong, nguon: { source: 'topic' | 'level'; topic: string | null; level: CapDo | null }): 'trung' | 'ok' => {
      if (!uid) return 'ok';
      const truoc = doc();
      if (truoc.some(s => s.idea.name === idea.name && s.idea.description === idea.description)) return 'trung';
      const moi: YTuongDaLuu = { id: taoId(), idea: { ...idea }, savedAt: new Date().toISOString(), ...nguon };
      ghi([moi, ...truoc]);
      luuYTuong(client, uid, moi).catch((e: unknown) => {
        ghi(doc().filter(s => s.id !== moi.id));
        toast.error(t('ideaSaveFailed', { error: loiChu(e) }));
      });
      return 'ok';
    },
    xoa: (id: string) => {
      if (!uid) return;
      const truoc = doc();
      const viTri = truoc.findIndex(s => s.id === id);
      if (viTri < 0) return;
      const bo = truoc[viTri];
      ghi(truoc.filter(s => s.id !== id));
      xoaYTuong(client, uid, id).catch((e: unknown) => {
        const hienTai = doc();
        ghi([...hienTai.slice(0, viTri), bo, ...hienTai.slice(viTri)]);
        toast.error(t('ideaDeleteFailed', { error: loiChu(e) }));
      });
    }
  };
}
