// Kieu giao dien: "co-dien" (toi, sidebar trai) hoac "pastel" (sang pastel, thanh dieu huong tren cung, the bo tron lon).
// Luu tren may; <html data-giao-dien="..."> dieu khien mau (globals.css) va bien the `pastel:` cua Tailwind.
// index.html ap san truoc khi ve trang (khong nhay man hinh toi -> sang).
import { useCallback, useSyncExternalStore } from 'react';

export type GiaoDien = 'co-dien' | 'pastel';
export const KHOA_GIAO_DIEN = 'devmaster_hub_giao_dien';
const SU_KIEN = 'devmaster-giao-dien';
/** Mau thanh trinh duyet tren dien thoai theo giao dien */
const MAU_THANH: Record<GiaoDien, string> = { 'co-dien': '#0a0e17', pastel: '#dff3f8' };

export function docGiaoDien(): GiaoDien {
  try {
    return localStorage.getItem(KHOA_GIAO_DIEN) === 'pastel' ? 'pastel' : 'co-dien';
  } catch {
    return 'co-dien';
  }
}

export function apGiaoDien(g: GiaoDien, goc: HTMLElement = document.documentElement) {
  goc.dataset.giaoDien = g;
  goc.classList.toggle('dark', g === 'co-dien');
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', MAU_THANH[g]);
}

function datGiaoDien(g: GiaoDien) {
  try { localStorage.setItem(KHOA_GIAO_DIEN, g); } catch { /* che do rieng tu: chi doi trong phien */ }
  apGiaoDien(g);
  window.dispatchEvent(new Event(SU_KIEN));
}

function dangKy(bao: () => void) {
  window.addEventListener(SU_KIEN, bao);
  window.addEventListener('storage', bao); // doi o tab khac
  return () => {
    window.removeEventListener(SU_KIEN, bao);
    window.removeEventListener('storage', bao);
  };
}

/** [giao dien hien tai, doi giao dien] — moi component dung hook deu cap nhat cung luc */
export function useGiaoDien(): [GiaoDien, (g: GiaoDien) => void] {
  const g = useSyncExternalStore(dangKy, docGiaoDien, () => 'co-dien' as GiaoDien);
  return [g, useCallback(datGiaoDien, [])];
}
