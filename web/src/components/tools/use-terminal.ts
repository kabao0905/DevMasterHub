// Moi lan goi la mot may terminal rieng (he thong tep, lich su, co CTF rieng).
// Cac component ve (man hinh, hop nano, bang CTF) dang ky nghe su kien cua may qua kenh nay.
import { useState } from 'react';
import { useQuery, type QueryKey } from '@tanstack/react-query';
import { createTerminal, type HeThongTep, type MayTerminal } from '@/lib/terminal';

type SuKien = {
  xoa: () => void;
  soan: (duong: string, noiDung: string) => void;
  diem: () => void;
};
export type KenhTerminal = {
  may: MayTerminal;
  /** Dang ky nghe; tra ve ham huy dang ky (dung lam cleanup cua useEffect) */
  nghe: <K extends keyof SuKien>(ten: K, fn: SuKien[K]) => () => void;
};

function taoKenh(boTep?: HeThongTep): KenhTerminal {
  const ds: { [K in keyof SuKien]: Set<SuKien[K]> } = { xoa: new Set(), soan: new Set(), diem: new Set() };
  const may = createTerminal({
    xoaManHinh: () => ds.xoa.forEach(f => f()),
    moSoanThao: (duong, noiDung) => ds.soan.forEach(f => f(duong, noiDung)),
    doiDiem: () => ds.diem.forEach(f => f())
  });
  if (boTep) may.loadFs(boTep);
  return {
    may,
    nghe: (ten, fn) => {
      const tap = ds[ten] as Set<typeof fn>;
      tap.add(fn);
      return () => { tap.delete(fn); };
    }
  };
}

/** May rieng cho component nay, mat khi component go ra (terminal bai hoc, lab) */
export function useTerminal(boTep?: HeThongTep): KenhTerminal {
  const [kenh] = useState<KenhTerminal>(() => taoKenh(boTep));
  return kenh;
}

/**
 * May giu qua cac lan roi trang roi quay lai trong phien (trang Thu thach: diem, co da giai).
 * Nam trong react-query theo khoa co id nguoi dung, nen dang xuat la xoa.
 */
export function useTerminalBenVung(khoa: QueryKey): KenhTerminal {
  const { data } = useQuery({
    queryKey: khoa,
    queryFn: () => taoKenh(),
    initialData: () => taoKenh(),
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
    // May co ham va trang thai trong closure: khong so sanh/sao chep sau nhu du lieu thuong
    structuralSharing: false
  });
  return data;
}
