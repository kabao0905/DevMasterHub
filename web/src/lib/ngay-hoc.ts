// Ngay hoc va chuoi ngay lien tiep (streak) cho lich tren Dashboard.
// Mot ngay tinh la "da hoc" khi nguoi dung mo mot mon/bai hoc hoac hoi AI (khong tinh theo thoi gian hoc).
// Ghi vao bang learning_sessions co san (RLS: moi nguoi chi doc/ghi dong cua minh) nen khong can doi DB.
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth';

/** Phat moi khi app goi AI; AppShell nghe de tich ngay hoc (lib/ai.ts khong dung duoc hook) */
export const SU_KIEN_HOI_AI = 'dmh:hoi-ai';
export const baoDaHoiAi = () => window.dispatchEvent(new Event(SU_KIEN_HOI_AI));

/** Du cho lich lui lai ca nam va chuoi dai nhat trong nam */
const SO_NGAY_TAI = 400;
/** Ngay cuoi cung may nay da ghi cho tung nguoi: khoi ghi trung moi lan mo bai trong ngay */
const khoaDaGhi = (uid: string) => `dmh_ngay_hoc_da_ghi_${uid}`;
const khoaTruyVan = (uid: string | undefined) => ['ngay-hoc', uid];

/** 'YYYY-MM-DD' theo gio may nguoi hoc (toISOString dung gio UTC: o mui gio +7 truoc 7h sang se lech ngay) */
export function ngayDiaPhuong(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const luiNgay = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);

export function tinhStreak(ngay: ReadonlySet<string>, homNay: Date): { hienTai: number; daiNhat: number } {
  // Hom nay chua hoc thi chuoi chua dut (con ca ngay de giu): dem lui tu hom qua
  let lui = ngay.has(ngayDiaPhuong(homNay)) ? 0 : 1;
  let hienTai = 0;
  while (ngay.has(ngayDiaPhuong(luiNgay(homNay, lui)))) { hienTai++; lui++; }

  let daiNhat = 0;
  let chay = 0;
  let truoc = '';
  for (const s of [...ngay].sort()) {
    const [y, m, d] = s.split('-').map(Number);
    chay = ngayDiaPhuong(new Date(y, m - 1, d - 1)) === truoc ? chay + 1 : 1;
    daiNhat = Math.max(daiNhat, chay);
    truoc = s;
  }
  return { hienTai, daiNhat };
}

export function useNgayHoc() {
  const { client, user } = useAuth();
  const q = useQuery({
    queryKey: khoaTruyVan(user?.id),
    enabled: !!user,
    queryFn: async () => {
      const tu = luiNgay(new Date(), SO_NGAY_TAI).toISOString();
      const { data, error } = await client
        .from('learning_sessions')
        .select('started_at')
        .eq('user_id', user!.id)
        .gte('started_at', tu);
      if (error) throw error;
      const ds = ((data as { started_at: string | null }[] | null) ?? []).filter(r => r.started_at);
      return [...new Set(ds.map(r => ngayDiaPhuong(new Date(r.started_at!))))];
    }
  });
  const ngay = useMemo(() => new Set(user ? q.data ?? [] : []), [q.data, user]);
  return { ngay, dangTai: !!user && q.isPending, loi: q.isError };
}

/** Moi uid+ngay chi ghi mot lan du nhieu man hinh cung goi trong luc dang ghi */
const dangGhi = new Set<string>();

export function useGhiNgayHoc() {
  const { client, user } = useAuth();
  const qc = useQueryClient();
  return useCallback((techId: string, lessonId: string) => {
    if (!user) return;
    const uid = user.id;
    const homNay = ngayDiaPhuong(new Date());
    const daCo = qc.getQueryData<string[]>(khoaTruyVan(uid))?.includes(homNay);
    let daGhiTrenMay = false;
    try { daGhiTrenMay = localStorage.getItem(khoaDaGhi(uid)) === homNay; } catch { /* localStorage bi chan: van ghi */ }
    const khoa = `${uid}|${homNay}`;
    if (daCo || daGhiTrenMay || dangGhi.has(khoa)) return;

    dangGhi.add(khoa);
    void (async () => {
      const { error } = await client.from('learning_sessions').insert({
        user_id: uid, tech_id: techId, lesson_id: lessonId, started_at: new Date().toISOString()
      });
      dangGhi.delete(khoa);
      // Ghi loi (mat mang...): khong bao loi lam phien; lan mo bai / hoi AI sau se thu ghi lai
      if (error) return;
      try { localStorage.setItem(khoaDaGhi(uid), homNay); } catch { /* het cho luu: lan sau ghi trung, doc van gop theo ngay */ }
      // Lich chua tai thi khong co gi de cap nhat; luc tai se doc ca dong vua ghi
      qc.setQueryData<string[]>(khoaTruyVan(uid), ds => (ds && !ds.includes(homNay) ? [...ds, homNay] : ds));
    })();
  }, [client, user, qc]);
}

/** Tich ngay hoc khi vao trang mot mon/bai hoc */
export function useTichKhiMo(techId: string, lessonId: string) {
  const ghi = useGhiNgayHoc();
  useEffect(() => { if (techId) ghi(techId, lessonId); }, [ghi, techId, lessonId]);
}

/** Dat o khung app: tich ngay hoc moi khi app goi AI */
export function useTichKhiHoiAi() {
  const ghi = useGhiNgayHoc();
  useEffect(() => {
    const nghe = () => ghi('ai', 'ai');
    window.addEventListener(SU_KIEN_HOI_AI, nghe);
    return () => window.removeEventListener(SU_KIEN_HOI_AI, nghe);
  }, [ghi]);
}
