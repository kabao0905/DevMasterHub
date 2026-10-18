import { dieuHuong } from './dieu-huong';

const KHOA = 'devmaster_hub_tai_lai_chunk';
const KHOANG_MS = 10_000;

export function laLoiTaiChunk(loi: unknown): boolean {
  const chu = loi instanceof Error ? `${loi.name} ${loi.message}` : String(loi ?? '');
  return /dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError/i.test(chu);
}

export function taiLaiMotLan(): boolean {
  try {
    const truoc = Number(sessionStorage.getItem(KHOA));
    if (truoc && Date.now() - truoc < KHOANG_MS) return false;
    sessionStorage.setItem(KHOA, String(Date.now()));
  } catch {
    return false;
  }
  dieuHuong.taiLai();
  return true;
}

export function ganTaiLaiKhiLoiChunk(): () => void {
  const nghe = (e: Event) => { if (taiLaiMotLan()) e.preventDefault(); };
  window.addEventListener('vite:preloadError', nghe);
  return () => window.removeEventListener('vite:preloadError', nghe);
}
