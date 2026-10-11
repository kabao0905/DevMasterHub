// Moi lan goi la mot may terminal rieng (he thong tep, lich su, co CTF rieng).
// Cac component ve (man hinh, hop nano, bang CTF) dang ky nghe su kien cua may qua kenh nay.
import { useState } from 'react';
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

export function useTerminal(boTep?: HeThongTep): KenhTerminal {
  const [kenh] = useState<KenhTerminal>(() => {
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
  });
  return kenh;
}
