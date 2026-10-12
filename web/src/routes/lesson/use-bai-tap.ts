// Trang thai tab Bai tap cua mot bai: bai tap AI, cau tra loi va nhan xet theo TUNG bai, tep IDE.
// Luu trong react-query theo nguoi dung (dang xuat la xoa), song qua doi tab/doi bai trong phien.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hashKey, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { useDanhDauXong } from '@/lib/use-progress';
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
  const danhDauXong = useDanhDauXong();
  const uid = user?.id;
  const kb = khoaBai(bai.tech.id, bai.level.id, bai.lesson.id);
  // Bai tap soan san (vd moi thuat toan sap xep mot bai); khong co thi bai tap goc la bai duy nhat.
  // Chi so: 0..soCoSan-1 la bai soan san, tu soCoSan tro di la bai AI tao them (bai chi co bai goc: soCoSan = 1, nhu cu)
  const coSan = useMemo(() => bai.lesson.exercises ?? [], [bai.lesson.exercises]);
  const soCoSan = Math.max(1, coSan.length);
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

  const deHienTai = kho.activeExIdx >= soCoSan ? kho.aiExercises[kho.activeExIdx - soCoSan] ?? null : null;
  const deCoSan = kho.activeExIdx < soCoSan ? coSan[kho.activeExIdx] ?? null : null;
  const deBaiChu = deHienTai?.description ?? deCoSan?.description ?? bai.lesson.exercise ?? '';

  const tao = useMutation({
    mutationFn: ({ cu, chuDe }: { k: QueryKey; cu: string; soCoSan: number; chuDe?: string }) => taoBaiTap(client, { ...bai, cu, chuDe, lang }),
    // Bai moi mang "loai" cua bai dang mo luc bam (vd Linear Search): nut hien canh bai do, tao tiep van cung loai
    onSuccess: (bt, { k, soCoSan: n, chuDe }) => dat(k, s => ({ ...s, aiExercises: [...s.aiExercises, { ...bt, loai: chuDe }], activeExIdx: n + s.aiExercises.length })),
    onSettled: (_kq, _loi, { k }) => dat(k, s => ({ ...s, dangTao: false }))
  });

  const cham = useMutation({
    mutationFn: ({ deBai, baiLam }: { k: QueryKey; idx: number; deBai: string; baiLam: string; bai: [string, string, string] }) =>
      chamBai(client, { tech: bai.tech, deBai, baiLam, ngonNgu: bai.lesson.lang || '', lang }),
    onSuccess: (nx, { k, idx, bai: [tech, level, lesson] }) => {
      dat(k, s => ({ ...s, feedback: { ...s.feedback, [idx]: nx } }));
      // Lam DAT bai tap (goc hay AI tao) la cach duy nhat de bai duoc tich hoan thanh
      if (nx.status === 'correct') danhDauXong(tech, level, lesson);
    },
    onSettled: (_kq, _loi, { k }) => dat(k, s => ({ ...s, dangCham: false }))
  });

  // O soan de trong: code khung chi chen khi hoc vien bam "Dung code khung" (khong tu dien san)
  const traLoi = kho.answers[kho.activeExIdx] ?? '';

  return {
    kho,
    deHienTai,
    coSan,
    soCoSan,
    deCoSan,
    /** Bai dang lam de gui gia su AI: bai AI tao, hoac bai soan san khi bai hoc co nhieu bai */
    deChoGiaSu: deHienTai ?? (coSan.length > 1 && deCoSan ? { title: deCoSan.title, description: deCoSan.description, hints: [] } : null),
    traLoi,
    nhanXet: kho.feedback[kho.activeExIdx] ?? null,
    dangTao: !!kho.dangTao || tao.isPending,
    loiTao: tao.error,
    dangCham: !!kho.dangCham || cham.isPending,
    loiCham: cham.error,
    taoMoi: () => {
      if (kho.dangTao || tao.isPending) return;
      dat(khoa, s => ({ ...s, dangTao: true }));
      // Loai cua bai dang mo: bai soan san (khi bai hoc co nhieu bai) hoac bai AI da thuoc mot loai
      const chuDe = (coSan.length > 1 ? deCoSan?.title : undefined) ?? deHienTai?.loai;
      tao.mutate({ k: khoa, cu: deBaiChu, soCoSan, chuDe });
    },
    /** Cham o soan (mac dinh) hoac bai lam truyen vao: bo tep IDE, lenh terminal da dan */
    cham: (baiLam: string = traLoi) => {
      if (!baiLam.trim() || kho.dangCham || cham.isPending) return;
      dat(khoa, s => ({ ...s, dangCham: true }));
      cham.mutate({ k: khoa, idx: kho.activeExIdx, deBai: deBaiChu, baiLam, bai: [bai.tech.id, bai.level.id, bai.lesson.id] });
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
