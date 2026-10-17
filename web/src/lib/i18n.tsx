// Ban dich cho app React. Nguon: data/i18n.json (scripts/xuat-du-lieu.mjs xuat ra web/public/i18n/<lang>.json),
// moi ngon ngu mot file /i18n/<lang>.json da gop san du phong "ngon ngu > en > vi".
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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

/** Ngon ngu trinh duyet theo thu tu uu tien (navigator.languages), thieu thi navigator.language */
function ngonNguTrinhDuyetMacDinh(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

export function ngonNguBanDau(ngonNguTrinhDuyet: string | readonly string[] = ngonNguTrinhDuyetMacDinh()): string {
  let daLuu: string | null = null;
  try { daLuu = localStorage.getItem(KHOA_NGON_NGU); } catch { /* che do rieng tu */ }
  if (hoTro(daLuu)) return daLuu;
  // Ngon ngu dau tien duoc ho tro trong danh sach uu tien: ['pt-BR', 'en'] -> en
  const ds = typeof ngonNguTrinhDuyet === 'string' ? [ngonNguTrinhDuyet] : ngonNguTrinhDuyet;
  return ds.map(l => (l || '').toLowerCase().slice(0, 2)).find(hoTro) ?? 'vi';
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
  const q = useQuery({
    queryKey: ['i18n', lang],
    queryFn: () => taiBanDich(lang),
    staleTime: Infinity,
    // Mang chap chon thi thu them 2 lan (0.5s, 1s) truoc khi bao loi
    retry: 2,
    retryDelay: n => 500 * 2 ** n,
    // Giu ban dich cu trong luc tai ban moi de giao dien khong nhay ve khoa tho
    placeholderData: keepPreviousData
  });
  const banDich = q.data ?? null;
  useEffect(() => { if (q.isError) console.warn('[i18n]', q.error); }, [q.isError, q.error]);
  // Ca luc mo trang (ngon ngu da luu), khong chi khi doi: trinh doc man hinh va goi y dich dua vao day
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const setLang = useCallback((l: string) => {
    if (!hoTro(l)) return;
    try { localStorage.setItem(KHOA_NGON_NGU, l); } catch { /* bo qua */ }
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

  // Khong co ban dich nao de dung: chu viet tay hai thu tieng, khong qua t()
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
  // Chua co ban dich nao thi chua ve gi: tranh nhay chu tho "dashboardTitle" len man hinh
  if (!giaTri) return null;
  return <I18nContext.Provider value={giaTri}>{children}</I18nContext.Provider>;
}

export function useT(): GiaTri {
  const v = useContext(I18nContext);
  if (!v) throw new Error('useT phải nằm trong <I18nProvider>');
  return v;
}

/** Nhu useT nhung tra null khi nam ngoai <I18nProvider> (thanh phan ui dung chung, ve rieng le trong test) */
export function useTNeuCo(): GiaTri | null {
  return useContext(I18nContext);
}
