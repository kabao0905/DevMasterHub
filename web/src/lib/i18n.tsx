// Ban dich cho app React. Du lieu xuat tu public/i18n.js (scripts/xuat-du-lieu.mjs),
// moi ngon ngu mot file /i18n/<lang>.json da gop san du phong "ngon ngu > en > vi".
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type NgonNgu = { name: string; flag: string; code: string };
export type BanDich = {
  ui: Record<string, string>;
  titles: Record<string, string>;
  techDesc: Record<string, string>;
  languages: Record<string, NgonNgu>;
};

/** Dung chung voi app cu de doi ngon ngu ben nay thi ben kia cung doi */
export const KHOA_NGON_NGU = 'devmaster_hub_lang';
export const NGON_NGU_HO_TRO = ['vi', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es'] as const;

/** Giong normalizeKey cua app cu: khoa tra ten bai hoc da dich */
export function chuanHoaKhoa(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

const hoTro = (l: string | null | undefined): l is string => !!l && (NGON_NGU_HO_TRO as readonly string[]).includes(l);

export function ngonNguBanDau(ngonNguTrinhDuyet = typeof navigator !== 'undefined' ? navigator.language : 'vi'): string {
  let daLuu: string | null = null;
  try { daLuu = localStorage.getItem(KHOA_NGON_NGU); } catch { /* che do rieng tu */ }
  if (hoTro(daLuu)) return daLuu;
  const tuTrinhDuyet = (ngonNguTrinhDuyet || '').toLowerCase().slice(0, 2);
  return hoTro(tuTrinhDuyet) ? tuTrinhDuyet : 'vi';
}

const taiMacDinh = async (lang: string): Promise<BanDich> => {
  const r = await fetch(`/i18n/${lang}.json`);
  if (!r.ok) throw new Error(`Không tải được bản dịch ${lang} (HTTP ${r.status})`);
  return r.json();
};

type GiaTri = {
  lang: string;
  setLang: (l: string) => void;
  t: (khoa: string, bien?: Record<string, string | number>) => string;
  translateTitle: (tieuDe: string) => string;
  techDesc: (id: string, macDinh: string) => string;
  languages: Record<string, NgonNgu>;
};

const I18nContext = createContext<GiaTri | null>(null);

export function I18nProvider({ children, taiBanDich = taiMacDinh }: { children: ReactNode; taiBanDich?: (lang: string) => Promise<BanDich> }) {
  const [lang, datLang] = useState(ngonNguBanDau);
  // Giu ban dich cu trong luc tai ban moi de giao dien khong nhay ve khoa tho
  const [banDich, datBanDich] = useState<BanDich | null>(null);

  useEffect(() => {
    let huy = false;
    taiBanDich(lang)
      .then(b => { if (!huy) datBanDich(b); })
      .catch(err => console.warn('[i18n]', err));
    return () => { huy = true; };
  }, [lang, taiBanDich]);

  const setLang = useCallback((l: string) => {
    if (!hoTro(l)) return;
    try { localStorage.setItem(KHOA_NGON_NGU, l); } catch { /* bo qua */ }
    document.documentElement.lang = l;
    datLang(l);
  }, []);

  const giaTri = useMemo<GiaTri | null>(() => {
    if (!banDich) return null;
    return {
      lang,
      setLang,
      languages: banDich.languages,
      t: (khoa, bien) => {
        const s = banDich.ui[khoa] ?? khoa;
        return bien ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in bien ? String(bien[k]) : m)) : s;
      },
      translateTitle: tieuDe => banDich.titles[chuanHoaKhoa(tieuDe)] ?? tieuDe,
      techDesc: (id, macDinh) => banDich.techDesc[id.toLowerCase()] ?? macDinh
    };
  }, [banDich, lang, setLang]);

  // Chua co ban dich nao thi chua ve gi: tranh nhay chu tho "dashboardTitle" len man hinh
  if (!giaTri) return null;
  return <I18nContext.Provider value={giaTri}>{children}</I18nContext.Provider>;
}

export function useT(): GiaTri {
  const v = useContext(I18nContext);
  if (!v) throw new Error('useT phải nằm trong <I18nProvider>');
  return v;
}
