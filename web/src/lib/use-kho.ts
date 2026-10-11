// Viec dang lam theo nguoi dung (khong tai tu server): giu trong react-query de song qua viec
// roi trang roi quay lai, dang xuat thi bi xoa. Cung cach voi useBaiTap (routes/lesson/use-bai-tap.ts).
import { useCallback, useEffect, useRef, useState } from 'react';
import { hashKey, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';

export function useKho<T>(khoa: QueryKey, rong: T) {
  const qc = useQueryClient();
  // enabled: false — khong bao gio "tai lai" (tai lai la tra ve rong, xoa sach viec dang lam)
  const { data: trongCache } = useQuery({ queryKey: khoa, queryFn: () => rong, initialData: rong, enabled: false, staleTime: Infinity, gcTime: Infinity });
  // Ban sao dong bo cho giao dien: cache bao thay doi bat dong bo, o nhap duoc dieu khien
  // se bi tra ve gia tri cu ngay sau moi phim go — go nhanh la mat chu
  const [kho, datKho] = useState<T>(() => qc.getQueryData<T>(khoa) ?? rong);
  const khoaRef = useRef(khoa);
  const conGanRef = useRef(true);
  useEffect(() => {
    khoaRef.current = khoa;
    conGanRef.current = true;
    return () => { conGanRef.current = false; };
  }, [khoa]);
  // Ket qua AI ve khi trang chua gan (da roi trang roi quay lai) chi nam trong cache: lay ve
  useEffect(() => { if (trongCache) datKho(trongCache); }, [trongCache]);

  /** Ghi theo khoa LUC BAM: ket qua ve muon van vao dung cho; da dang xuat (truy van bi xoa) thi bo qua */
  const dat = useCallback((k: QueryKey, f: (s: T) => T) => {
    if (!qc.getQueryState(k)) return;
    const moi = f(qc.getQueryData<T>(k) ?? rong);
    qc.setQueryData<T>(k, moi);
    if (conGanRef.current && hashKey(k) === hashKey(khoaRef.current)) datKho(moi);
  }, [qc, rong]);

  /** Doc gia tri moi nhat (khong phai cua lan ve truoc): bam hai lan lien tiep chi chay mot lan */
  const doc = useCallback((k: QueryKey) => qc.getQueryData<T>(k) ?? rong, [qc, rong]);

  return { kho, dat, doc };
}
