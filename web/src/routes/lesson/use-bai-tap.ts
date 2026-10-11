// Trang thai tab Bai tap cua mot bai: bai tap AI, cau tra loi va nhan xet theo TUNG bai, tep IDE.
// Luu trong react-query theo nguoi dung (dang xuat la xoa), song qua doi tab/doi bai trong phien.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hashKey, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { chamBai, taoBaiTap, type BaiTapAi, type NhanXet } from '@/lib/ai';
import type { BaiDangMo } from './use-quiz-bai';

export type KhoBaiTap = {
  aiExercises: BaiTapAi[];
  /** 0 = bai goc cua giao trinh, i = aiExercises[i - 1] */
  activeExIdx: number;
  answers: Record<number, string>;
  feedback: Record<number, NhanXet>;
  hienGoiY: Record<number, boolean>;
  hienLoiGiai: Record<number, boolean>;
  files?: Record<string, string>;
  /** AI dang tao/cham cho bai nay — luu o day (khong chi trong mutation) de mo lai bai van thay dang cho */
  dangTao?: boolean;
  dangCham?: boolean;
};
const RONG: KhoBaiTap = { aiExercises: [], activeExIdx: 0, answers: {}, feedback: {}, hienGoiY: {}, hienLoiGiai: {} };

export function useBaiTap(bai: BaiDangMo) {
  const { client, user } = useAuth();
  const { lang } = useT();
  const qc = useQueryClient();
  const uid = user?.id;
  const kb = khoaBai(bai.tech.id, bai.level.id, bai.lesson.id);
  const khoa = useMemo<QueryKey>(() => ['exercise', uid, kb], [uid, kb]);
  // Muc trong cache: giu viec dang lam qua cac lan mo lai tab/bai, va bi xoa khi dang xuat.
  // enabled: false — khong bao gio "tai lai" (tai lai la tra ve RONG, xoa sach viec dang lam).
  const { data: trongCache } = useQuery({ queryKey: khoa, queryFn: () => RONG, initialData: RONG, enabled: false, staleTime: Infinity, gcTime: Infinity });
  // Ban sao dong bo cho giao dien: cache bao thay doi bat dong bo, ma o nhap duoc dieu khien
  // se bi React tra ve gia tri cu ngay sau moi phim go — go nhanh la mat chu.
  const [kho, datKho] = useState<KhoBaiTap>(() => qc.getQueryData<KhoBaiTap>(khoa) ?? RONG);
  const khoaRef = useRef(khoa);
  const conGanRef = useRef(true);
  useEffect(() => {
    khoaRef.current = khoa;
    conGanRef.current = true;
    return () => { conGanRef.current = false; };
  }, [khoa]);
  // Ket qua AI ve khi ban hook nay chua gan (da roi bai roi quay lai) chi nam trong cache: lay ve.
  // Moi lan ghi deu ghi ca hai noi nen khi da trung thi day la no-op.
  useEffect(() => { if (trongCache) datKho(trongCache); }, [trongCache]);

  // Ghi theo khoa cua bai LUC BAM: ket qua AI ve muon khi da doi bai van vao dung bai;
  // da dang xuat (truy van bi xoa) thi bo qua.
  const dat = useCallback((k: QueryKey, f: (s: KhoBaiTap) => KhoBaiTap) => {
    if (!qc.getQueryState(k)) return;
    const moi = f(qc.getQueryData<KhoBaiTap>(k) ?? RONG);
    qc.setQueryData<KhoBaiTap>(k, moi);
    if (conGanRef.current && hashKey(k) === hashKey(khoaRef.current)) datKho(moi);
  }, [qc]);

  const deHienTai = kho.activeExIdx > 0 ? kho.aiExercises[kho.activeExIdx - 1] ?? null : null;
  const deBaiChu = deHienTai?.description ?? bai.lesson.exercise ?? '';

  const tao = useMutation({
    mutationFn: ({ cu }: { k: QueryKey; cu: string }) => taoBaiTap(client, { ...bai, cu, lang }),
    onSuccess: (bt, { k }) => dat(k, s => ({ ...s, aiExercises: [...s.aiExercises, bt], activeExIdx: s.aiExercises.length + 1 })),
    onSettled: (_kq, _loi, { k }) => dat(k, s => ({ ...s, dangTao: false }))
  });

  const cham = useMutation({
    mutationFn: ({ deBai, baiLam }: { k: QueryKey; idx: number; deBai: string; baiLam: string }) =>
      chamBai(client, { tech: bai.tech, deBai, baiLam, ngonNgu: bai.lesson.lang || '', lang }),
    onSuccess: (nx, { k, idx }) => dat(k, s => ({ ...s, feedback: { ...s.feedback, [idx]: nx } })),
    onSettled: (_kq, _loi, { k }) => dat(k, s => ({ ...s, dangCham: false }))
  });

  const traLoi = kho.answers[kho.activeExIdx] ?? '';

  return {
    kho,
    deHienTai,
    traLoi,
    nhanXet: kho.feedback[kho.activeExIdx] ?? null,
    dangTao: !!kho.dangTao || tao.isPending,
    loiTao: tao.error,
    dangCham: !!kho.dangCham || cham.isPending,
    loiCham: cham.error,
    taoMoi: () => {
      if (kho.dangTao || tao.isPending) return;
      dat(khoa, s => ({ ...s, dangTao: true }));
      tao.mutate({ k: khoa, cu: deBaiChu });
    },
    cham: () => {
      if (!traLoi.trim() || kho.dangCham || cham.isPending) return;
      dat(khoa, s => ({ ...s, dangCham: true }));
      cham.mutate({ k: khoa, idx: kho.activeExIdx, deBai: deBaiChu, baiLam: traLoi });
    },
    chon: (idx: number) => { cham.reset(); dat(khoa, s => ({ ...s, activeExIdx: idx })); },
    datTraLoi: (text: string) => dat(khoa, s => ({ ...s, answers: { ...s.answers, [s.activeExIdx]: text } })),
    xoaTraLoi: () => dat(khoa, s => {
      const feedback = { ...s.feedback };
      delete feedback[s.activeExIdx];
      return { ...s, answers: { ...s.answers, [s.activeExIdx]: '' }, feedback };
    }),
    doiGoiY: () => dat(khoa, s => ({ ...s, hienGoiY: { ...s.hienGoiY, [s.activeExIdx]: !s.hienGoiY[s.activeExIdx] } })),
    doiLoiGiai: () => dat(khoa, s => ({ ...s, hienLoiGiai: { ...s.hienLoiGiai, [s.activeExIdx]: !s.hienLoiGiai[s.activeExIdx] } })),
    datFiles: (files: Record<string, string>) => dat(khoa, s => ({ ...s, files }))
  };
}

export type BaiTapBai = ReturnType<typeof useBaiTap>;

/** Code hoc vien dang lam (gui kem cau hoi cho gia su) */
export function codeDangLam(kho: KhoBaiTap): string {
  const traLoi = kho.answers[kho.activeExIdx];
  if (traLoi?.trim()) return traLoi;
  return kho.files ? Object.entries(kho.files).map(([ten, code]) => `--- ${ten} ---\n${code}`).join('\n') : '';
}
