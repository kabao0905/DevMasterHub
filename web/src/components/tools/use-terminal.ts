import { useEffect, useState } from 'react';
import { useQuery, type QueryKey } from '@tanstack/react-query';
import { useT } from '@/lib/i18n';
import { createTerminal, type HeThongTep, type MayTerminal } from '@/lib/terminal';

type SuKien = {
  xoa: () => void;
  soan: (duong: string, noiDung: string) => void;
  diem: () => void;
};
export type KenhTerminal = {
  may: MayTerminal;
  nghe: <K extends keyof SuKien>(ten: K, fn: SuKien[K]) => () => void;
};

function taoKenh(boTep: HeThongTep | undefined, ngonNgu: string): KenhTerminal {
  const ds: { [K in keyof SuKien]: Set<SuKien[K]> } = { xoa: new Set(), soan: new Set(), diem: new Set() };
  const may = createTerminal({
    xoaManHinh: () => ds.xoa.forEach(f => f()),
    moSoanThao: (duong, noiDung) => ds.soan.forEach(f => f(duong, noiDung)),
    doiDiem: () => ds.diem.forEach(f => f())
  }, ngonNgu);
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

export function useTerminal(boTep?: HeThongTep): KenhTerminal {
  const { lang } = useT();
  const [kenh] = useState<KenhTerminal>(() => taoKenh(boTep, lang));
  useTheoNgonNgu(kenh.may, lang);
  return kenh;
}

function useTheoNgonNgu(may: MayTerminal, lang: string) {
  useEffect(() => { may.datNgonNgu(lang); }, [may, lang]);
}

export function useTerminalBenVung(khoa: QueryKey): KenhTerminal {
  const { lang } = useT();
  const { data } = useQuery({
    queryKey: khoa,
    queryFn: () => taoKenh(undefined, lang),
    initialData: () => taoKenh(undefined, lang),
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
    structuralSharing: false
  });
  useTheoNgonNgu(data.may, lang);
  return data;
}
