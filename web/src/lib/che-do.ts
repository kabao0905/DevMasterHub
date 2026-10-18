// Che do sang / toi cua giao dien. Luu tren may; chua chon thi theo he dieu hanh (prefers-color-scheme).
// <html class="dark"> doi bang mau (globals.css). index.html ap san truoc khi ve trang de khong nhay mau.
// Doi che do co hieu ung: mau moi lan ra tu chinh cong tac, giu hinh vien thuoc bo tron cua no roi gian ra phu ca
// man hinh (View Transitions API, neu trinh duyet co). Ca khi may bat giam chuyen dong van lan cham nhu thuong
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

function doiCheDo(c: CheDo, khung?: Khung) {
  const lam = () => {
    try { localStorage.setItem(KHOA_CHE_DO, c); } catch { /* che do rieng tu: chi doi trong phien */ }
    apCheDo(c);
    window.dispatchEvent(new Event(SU_KIEN));
  };
  const doc = document as CoViewTransition;
  if (!doc.startViewTransition) { lam(); return; }

  const { left, top, width, height } = khung ?? { left: window.innerWidth, top: 0, width: 0, height: 0 };
  // Bat dau dung bang vien thuoc cua cong tac (bo tron nua chieu cao), gian ra thanh ca man hinh.
  // Giua chung van bo goc lon de nhin ra hinh cong tac dang no ra, het moi vuong goc
  const le = [top, window.innerWidth - left - width, window.innerHeight - top - height, left];
  const hinh = (tiLe: number, bo: number) => `inset(${le.map(v => `${v * tiLe}px`).join(' ')} round ${bo}px)`;
  const chuyen = doc.startViewTransition(lam);
  chuyen.ready.then(() => {
    document.documentElement.animate?.(
      { clipPath: [hinh(1, height / 2), hinh(0.5, 48), hinh(0, 0)] },
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
