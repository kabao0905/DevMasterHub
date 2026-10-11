// Hook cho lich hoc: doc thoi gian hoc moi ngay, muc tieu phut/ngay, va chay dong ho hoc trong khung app.
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth';
import { luiNgay, ngayDatMucTieu, tongTheoNgay, type DongThoiGian } from './ngay-hoc';
import { batDauHoc, DongHoHoc, layYeuCauCho, NHIP_MS, SU_KIEN_BAT_DAU_HOC, type Mon } from './dong-ho-hoc';

/** Du cho lich lui lai ca nam va chuoi dai nhat trong nam */
const SO_NGAY_TAI = 400;
export const CHON_MUC_TIEU = [10, 15, 30, 45, 60] as const;
export const MUC_TIEU_MAC_DINH = 15;
const MUC_TIEU_TOI_DA = 600;
const khoaTruyVan = (uid: string | undefined) => ['thoi-gian-hoc', uid];

/** Muc tieu phut/ngay luu trong user_metadata cua Supabase Auth (khong can them cot DB) */
export function useMucTieu() {
  const { client, user } = useAuth();
  const raw = user?.user_metadata?.daily_goal_minutes;
  const phut = typeof raw === 'number' && Number.isInteger(raw) && raw > 0 ? raw : null;
  const luu = useCallback(async (n: number) => {
    if (!Number.isInteger(n) || n < 1 || n > MUC_TIEU_TOI_DA) throw new Error(`Mục tiêu phải từ 1 đến ${MUC_TIEU_TOI_DA} phút`);
    const { error } = await client.auth.updateUser({ data: { daily_goal_minutes: n } });
    if (error) throw new Error(error.message);
  }, [client]);
  return { phut, daChon: phut != null, luu };
}

export function useThoiGianHoc() {
  const { client, user } = useAuth();
  const { phut } = useMucTieu();
  const mucTieuPhut = phut ?? MUC_TIEU_MAC_DINH;
  const q = useQuery({
    queryKey: khoaTruyVan(user?.id),
    enabled: !!user,
    queryFn: async () => {
      const tu = luiNgay(new Date(), SO_NGAY_TAI).toISOString();
      const { data, error } = await client
        .from('learning_sessions')
        .select('started_at, duration_seconds')
        .eq('user_id', user!.id)
        .gte('started_at', tu);
      if (error) throw error;
      return tongTheoNgay((data as DongThoiGian[] | null) ?? []);
    }
  });
  const giayTheoNgay = useMemo(() => (user ? q.data ?? {} : {}), [q.data, user]);
  const ngayDat = useMemo(() => ngayDatMucTieu(giayTheoNgay, mucTieuPhut), [giayTheoNgay, mucTieuPhut]);
  return { giayTheoNgay, ngayDat, mucTieuPhut, loi: q.isError };
}

/** Vao trang mot mon/bai hoc: bat dong ho hoc */
export function useBatDauHoc(techId: string, lessonId: string) {
  useEffect(() => { if (techId) batDauHoc({ techId, lessonId }); }, [techId, lessonId]);
}

const SU_KIEN_THAO_TAC = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;

/** Dat o khung app (AppShell): dem thoi gian hoc va ghi dan len Supabase */
export function useDongHoHoc() {
  const { client, user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  useEffect(() => {
    if (!uid) return;
    const dh = new DongHoHoc({
      bayGio: () => Date.now(),
      ghi: {
        chen: async d => {
          const { data, error } = await client.from('learning_sessions').insert({ user_id: uid, ...d }).select('id').single();
          return error || !data ? null : (data as { id: number }).id;
        },
        capNhat: async (id, d) => {
          const { error } = await client.from('learning_sessions').update(d).eq('id', id).eq('user_id', uid);
          return !error;
        }
      },
      daGhi: (ngay, giay) => qc.setQueryData<Record<string, number>>(khoaTruyVan(uid), m => (m ? { ...m, [ngay]: (m[ngay] ?? 0) + giay } : m))
    });

    const dangHien = () => document.visibilityState === 'visible';
    const cho = layYeuCauCho();
    if (cho) dh.batDau(cho);

    const khiBatDau = (e: Event) => dh.batDau((e as CustomEvent<Mon>).detail);
    const khiThaoTac = () => dh.thaoTac();
    const khiDoiHien = () => {
      if (dangHien()) { dh.dem(false); dh.thaoTac(); return; }
      // Vua an tab: tinh phan con hien toi luc nay roi ghi luon (co the khong quay lai)
      dh.dem(true);
      void dh.ghi(true);
    };
    const khiRoiTrang = () => { dh.dem(dangHien()); void dh.ghi(true); };

    window.addEventListener(SU_KIEN_BAT_DAU_HOC, khiBatDau);
    for (const ten of SU_KIEN_THAO_TAC) window.addEventListener(ten, khiThaoTac, { passive: true });
    document.addEventListener('scroll', khiThaoTac, { capture: true, passive: true });
    document.addEventListener('visibilitychange', khiDoiHien);
    window.addEventListener('pagehide', khiRoiTrang);
    const nhip = setInterval(() => { dh.dem(dangHien()); void dh.ghi(); }, NHIP_MS);

    return () => {
      clearInterval(nhip);
      window.removeEventListener(SU_KIEN_BAT_DAU_HOC, khiBatDau);
      for (const ten of SU_KIEN_THAO_TAC) window.removeEventListener(ten, khiThaoTac);
      document.removeEventListener('scroll', khiThaoTac, { capture: true });
      document.removeEventListener('visibilitychange', khiDoiHien);
      window.removeEventListener('pagehide', khiRoiTrang);
      khiRoiTrang();
    };
  }, [client, uid, qc]);
}
