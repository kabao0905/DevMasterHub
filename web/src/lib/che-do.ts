// Che do sang / toi cua giao dien. Luu tren may; chua chon thi theo he dieu hanh (prefers-color-scheme).
// <html class="dark"> doi bang mau (globals.css). index.html ap san truoc khi ve trang de khong nhay mau.
// Doi che do co hieu ung: mau moi la chinh vien thuoc cua cong tac phong to deu (giu ti le, hai dau tron) toi khi
// phu kin man hinh (View Transitions API, neu trinh duyet co). Ca khi may bat giam chuyen dong van lan cham nhu thuong
// (nguoi dung tu bam gat, chu nhan muon thay ro hieu ung).
import { useCallback, useSyncExternalStore } from 'react';

export type CheDo = 'sang' | 'toi';
export const KHOA_CHE_DO = 'devmaster_hub_che_do';
const SU_KIEN = 'devmaster-che-do';
/** Mau thanh trinh duyet tren dien thoai theo che do */
const MAU_THANH: Record<CheDo, string> = { sang: '#ffffff', toi: '#121922' };
/** Du cham de thay ro mau lan tu cong tac ra ca man hinh (550ms / 400ms truoc day: nguoi dung thay qua nhanh) */
const THOI_GIAN_LAN_MS = 900;

const heThongToi = () => {
  try { return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false; } catch { return false; }
};

export function docCheDo(): CheDo {
  let luu: string | null = null;
  try { luu = localStorage.getItem(KHOA_CHE_DO); } catch { /* che do rieng tu */ }
  if (luu === 'sang' || luu === 'toi') return luu;
  if (luu !== null) return 'sang';
  return heThongToi() ? 'toi' : 'sang';
}

export function apCheDo(c: CheDo, goc: HTMLElement = document.documentElement) {
  goc.classList.toggle('dark', c === 'toi');
  goc.style.colorScheme = c === 'toi' ? 'dark' : 'light';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', MAU_THANH[c]);
}

type ViewTransition = { ready: Promise<void> };
type CoViewTransition = Document & { startViewTransition?: (f: () => void) => ViewTransition };

/** Khung cua cong tac tren man hinh (getBoundingClientRect); khong co thi lan tu goc tren phai */
type Khung = { left: number; top: number; width: number; height: number };

/**
 * Vien thuoc cua cong tac phong to deu tiLe lan quanh tam cua no (giu ti le va hai dau tron nua chieu cao).
 * Moi canh va ban kinh deu tuyen tinh theo tiLe, nen noi suy giua hai khung hinh chinh la phong to deu that.
 * Canh am = vien thuoc tran ra ngoai man hinh (clip-path inset cho phep).
 */
function vienThuoc(left: number, top: number, width: number, height: number, tiLe: number) {
  const cx = left + width / 2, cy = top + height / 2;
  const a = (width / 2) * tiLe, b = (height / 2) * tiLe;
  const W = window.innerWidth, H = window.innerHeight;
  return `inset(${cy - b}px ${W - cx - a}px ${H - cy - b}px ${cx - a}px round ${b}px)`;
}

/** Ti le phong to nho nhat de vien thuoc (tam o cong tac) phu kin ca man hinh W x H — tim nhi phan, du 2% cho chac */
export function tiLePhuKin(left: number, top: number, width: number, height: number, W: number, H: number): number {
  const cx = left + width / 2, cy = top + height / 2;
  const a0 = Math.max(width, 1) / 2, b0 = Math.max(height, 1) / 2;
  // Goc man hinh xa tam nhat; vien thuoc doi xung va loi nen phu goc nay la phu ca man hinh
  const dx = Math.max(cx, W - cx), dy = Math.max(cy, H - cy);
  const phu = (s: number) => {
    const b = b0 * s, thang = Math.max(0, (a0 - b0) * s); // nua doan thang giua hai dau tron
    return dy <= b && (dx <= thang || (dx - thang) ** 2 + dy ** 2 <= b ** 2);
  };
  let lo = 1, hi = 2;
  while (!phu(hi)) hi *= 2;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (phu(m)) hi = m; else lo = m; }
  return hi * 1.02;
}

function doiCheDo(c: CheDo, khung?: Khung) {
  const lam = () => {
    try { localStorage.setItem(KHOA_CHE_DO, c); } catch { /* che do rieng tu: chi doi trong phien */ }
    apCheDo(c);
    window.dispatchEvent(new Event(SU_KIEN));
  };
  const doc = document as CoViewTransition;
  if (!doc.startViewTransition) { lam(); return; }

  const { left, top, width, height } = khung ?? { left: window.innerWidth - 60, top: 0, width: 60, height: 32 };
  const tu = vienThuoc(left, top, width, height, 1);
  const den = vienThuoc(left, top, width, height, tiLePhuKin(left, top, width, height, window.innerWidth, window.innerHeight));
  const chuyen = doc.startViewTransition(lam);
  chuyen.ready.then(() => {
    document.documentElement.animate?.(
      { clipPath: [tu, den] },
      {
        duration: THOI_GIAN_LAN_MS,
        easing: 'cubic-bezier(.4, 0, .2, 1)',
        pseudoElement: '::view-transition-new(root)'
      }
    );
  }).catch(() => { /* hieu ung bi bo qua: che do van da doi */ });
}

function dangKy(bao: () => void) {
  window.addEventListener(SU_KIEN, bao);
  window.addEventListener('storage', bao); // doi o tab khac
  return () => {
    window.removeEventListener(SU_KIEN, bao);
    window.removeEventListener('storage', bao);
  };
}

/** [che do hien tai, doi che do (kem khung cong tac de lan ra tu do)] — moi component dung hook cap nhat cung luc */
export function useCheDo(): [CheDo, (c: CheDo, khung?: Khung) => void] {
  const c = useSyncExternalStore(dangKy, docCheDo, () => 'sang' as CheDo);
  return [c, useCallback(doiCheDo, [])];
}
