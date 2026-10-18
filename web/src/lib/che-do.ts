// Che do sang / toi cua giao dien. Luu tren may; chua chon thi theo he dieu hanh (prefers-color-scheme).
// <html class="dark"> doi bang mau (globals.css). index.html ap san truoc khi ve trang de khong nhay mau.
// Doi che do co hieu ung: mau moi lan ra thanh vong tron tu cong tac (View Transitions API, neu trinh duyet co).
// Ca khi may bat giam chuyen dong van lan tron (nguoi dung tu bam gat, chu nhan muon thay hieu ung), chi nhanh hon.
import { useCallback, useSyncExternalStore } from 'react';

export type CheDo = 'sang' | 'toi';
export const KHOA_CHE_DO = 'devmaster_hub_che_do';
const SU_KIEN = 'devmaster-che-do';
/** Mau thanh trinh duyet tren dien thoai theo che do */
const MAU_THANH: Record<CheDo, string> = { sang: '#ffffff', toi: '#121922' };
const THOI_GIAN_LAN_MS = 550;
const THOI_GIAN_LAN_GIAM_MS = 400;

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

/** Diem bat dau hieu ung (giua cong tac); khong co thi lan tu goc tren phai */
type Goc = { x: number; y: number };

function doiCheDo(c: CheDo, goc?: Goc) {
  const lam = () => {
    try { localStorage.setItem(KHOA_CHE_DO, c); } catch { /* che do rieng tu: chi doi trong phien */ }
    apCheDo(c);
    window.dispatchEvent(new Event(SU_KIEN));
  };
  const doc = document as CoViewTransition;
  if (!doc.startViewTransition) { lam(); return; }

  // Giam chuyen dong (vd. Windows tat "hieu ung hoat hinh"): van lan tron tu cong tac nhung ngan hon.
  // Truoc day chi mo dan 250ms -> tren may chu nhan trong nhu doi ngay, mat hieu ung lan ra ca man hinh
  const giamChuyenDong = (() => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false; } catch { return false; }
  })();
  const x = goc?.x ?? window.innerWidth;
  const y = goc?.y ?? 0;
  // Ban kinh du phu ca man hinh tinh tu diem bat dau
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const chuyen = doc.startViewTransition(lam);
  chuyen.ready.then(() => {
    document.documentElement.animate?.(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      {
        duration: giamChuyenDong ? THOI_GIAN_LAN_GIAM_MS : THOI_GIAN_LAN_MS,
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

/** [che do hien tai, doi che do (kem diem bat dau hieu ung)] — moi component dung hook cap nhat cung luc */
export function useCheDo(): [CheDo, (c: CheDo, goc?: Goc) => void] {
  const c = useSyncExternalStore(dangKy, docCheDo, () => 'sang' as CheDo);
  return [c, useCallback(doiCheDo, [])];
}
