// Moi lan deploy, ten tep chunk doi (co hash) va tep cu bi xoa: tab dang mo tu truoc import trang luoi
// (bai hoc, thu thach) se loi. Tai lai trang mot lan de lay index.html moi; vua tai lai ma van loi thi dung
// (tranh vong lap tai lai khi may chu hong that), de nguoi dung tu bam.
import { dieuHuong } from './dieu-huong';

const KHOA = 'devmaster_hub_tai_lai_chunk';
/** Trong khoang nay sau lan tai lai truoc ma van loi thi coi la loi that, khong tai lai nua */
const KHOANG_MS = 10_000;

export function laLoiTaiChunk(loi: unknown): boolean {
  const chu = loi instanceof Error ? `${loi.name} ${loi.message}` : String(loi ?? '');
  return /dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError/i.test(chu);
}

/** Tai lai trang neu chua tai lai vi ly do nay gan day. Tra ve true neu da tai lai. */
export function taiLaiMotLan(): boolean {
  try {
    const truoc = Number(sessionStorage.getItem(KHOA));
    if (truoc && Date.now() - truoc < KHOANG_MS) return false;
    sessionStorage.setItem(KHOA, String(Date.now()));
  } catch {
    // Khong ghi duoc dau vet (che do rieng tu): khong tu tai lai, de nguoi dung bam nut
    return false;
  }
  dieuHuong.taiLai();
  return true;
}

/** Vite phat 'vite:preloadError' khi tai truoc CSS/JS cua mot import dong that bai */
export function ganTaiLaiKhiLoiChunk(): () => void {
  const nghe = (e: Event) => { if (taiLaiMotLan()) e.preventDefault(); };
  window.addEventListener('vite:preloadError', nghe);
  return () => window.removeEventListener('vite:preloadError', nghe);
}
