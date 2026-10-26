import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { duongTinh } from './duong-tinh';

export type NgonNgu = { name: string; flag: string; code: string };
export type BanDich = {
  ui: Record<string, string>;
  titles: Record<string, string>;
  techDesc: Record<string, string>;
  languages: Record<string, NgonNgu>;
};

export const KHOA_NGON_NGU = 'devmaster_hub_lang';
export const NGON_NGU_HO_TRO = ['vi', 'en', 'ja', 'ko', 'zh', 'fr', 'de', 'es'] as const;

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

function ngonNguTrinhDuyetMacDinh(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

export function ngonNguBanDau(ngonNguTrinhDuyet: string | readonly string[] = ngonNguTrinhDuyetMacDinh()): string {
  let daLuu: string | null = null;
  try { daLuu = localStorage.getItem(KHOA_NGON_NGU); } catch {}
  if (hoTro(daLuu)) return daLuu;
  const ds = typeof ngonNguTrinhDuyet === 'string' ? [ngonNguTrinhDuyet] : ngonNguTrinhDuyet;
  return ds.map(l => (l || '').toLowerCase().slice(0, 2)).find(hoTro) ?? 'vi';
}

const taiMacDinh = async (lang: string): Promise<BanDich> => {
  const r = await fetch(duongTinh(`/i18n/${lang}.json`));
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
  const q = useQuery({
    queryKey: ['i18n', lang],
    queryFn: () => taiBanDich(lang),
    staleTime: Infinity,
    retry: 2,
    retryDelay: n => 500 * 2 ** n,
    placeholderData: keepPreviousData
  });
  const banDich = q.data ?? null;
  useEffect(() => { if (q.isError) console.warn('[i18n]', q.error); }, [q.isError, q.error]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback((l: string) => {
    if (!hoTro(l)) return;
    try { localStorage.setItem(KHOA_NGON_NGU, l); } catch {}
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

  if (!giaTri && q.isError) {
    return (
      <div role="alert" className="grid min-h-dvh place-items-center bg-background p-6 text-center">
        <div className="max-w-sm space-y-4">
          <p className="font-medium">Không tải được giao diện. Kiểm tra kết nối mạng rồi thử lại.</p>
          <p lang="en" className="text-sm text-muted-foreground">Couldn&apos;t load the interface. Check your connection and try again.</p>
          <button type="button" onClick={() => q.refetch()}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
            Thử lại / Try again
          </button>
        </div>
      </div>
    );
  }
  if (!giaTri) return null;
  return <I18nContext.Provider value={giaTri}>{children}</I18nContext.Provider>;
}

export function useT(): GiaTri {
  const v = useContext(I18nContext);
  if (!v) throw new Error('useT phải nằm trong <I18nProvider>');
  return v;
}

export function useTNeuCo(): GiaTri | null {
  return useContext(I18nContext);
}
