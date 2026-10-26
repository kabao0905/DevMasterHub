import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { lamSachHtml } from '@/lib/sanitize';

function bam(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36) + s.length.toString(36);
}

const TOI_DA = 60;
const khoaDs = (lang: string) => `devmaster_hub_dich_${lang}__ds`;
const khoaMuc = (lang: string, ma: string) => `devmaster_hub_dich_${lang}_${ma}`;

function docDs(lang: string): string[] {
  try {
    const x: unknown = JSON.parse(localStorage.getItem(khoaDs(lang)) || '[]');
    return Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function ghiDs(lang: string, ds: string[]) {
  try { localStorage.setItem(khoaDs(lang), JSON.stringify(ds)); } catch {}
}

export function docCacheDich(lang: string, ma: string): string | null {
  try {
    const v = localStorage.getItem(khoaMuc(lang, ma));
    if (v == null) return null;
    ghiDs(lang, [...docDs(lang).filter(x => x !== ma), ma]);
    return v;
  } catch {
    return null;
  }
}

export function ghiCacheDich(lang: string, ma: string, text: string): void {
  const ds = [...docDs(lang).filter(x => x !== ma), ma];
  while (ds.length > TOI_DA) {
    const cu = ds.shift()!;
    try { localStorage.removeItem(khoaMuc(lang, cu)); } catch {}
  }
  try { localStorage.setItem(khoaMuc(lang, ma), text); } catch {}
  ghiDs(lang, ds);
}

export async function dichMay(html: string, lang: string, signal: AbortSignal): Promise<string> {
  const ma = bam(html);
  const daLuu = docCacheDich(lang, ma);
  if (daLuu) return daLuu;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(html)}`;
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(`Dịch máy lỗi (HTTP ${r.status})`);
  const data: unknown = await r.json();
  const doan = Array.isArray(data) && Array.isArray(data[0]) ? (data[0] as unknown[]) : [];
  const ra = doan.map(x => (Array.isArray(x) && typeof x[0] === 'string' ? x[0] : '')).join('');
  if (!ra) throw new Error('Bản dịch rỗng');
  ghiCacheDich(lang, ma, ra);
  return ra;
}

export function useDichNoiDung(html: string, lang: string) {
  const canDich = lang !== 'vi' && html.trim() !== '';
  const q = useQuery({
    queryKey: ['dich', lang, bam(html)],
    queryFn: ({ signal }) => dichMay(html, lang, signal),
    enabled: canDich,
    staleTime: Infinity,
    gcTime: 10 * 60_000,
    retry: false
  });
  const nguon = canDich && q.data ? q.data : html;
  const sach = useMemo(() => lamSachHtml(nguon), [nguon]);
  return { html: sach, dangDich: canDich && q.isFetching };
}
