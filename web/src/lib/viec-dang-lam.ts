// Viec dang lam cua hoc vien trong app React (bai tap, quiz, gia su, de thu thach AI) chi nam trong react-query.
// Sang trang app cu la tai trang moi -> mat het. Cat tam vao sessionStorage khi roi trang (pagehide),
// nap lai o tai lieu React ke tiep neu van dung nguoi dang nhap. Chieu nguoc lai (app cu -> React) la
// devmaster_hub_legacy_session trong public/app.js.
import type { QueryClient, QueryKey } from '@tanstack/react-query';

export const KHOA_VIEC_REACT = 'devmaster_hub_react_session';

type BanChup = { uid: string; ds: [QueryKey, unknown][] };

/** Chi du lieu thuan (JSON duoc); may terminal ['challenge', uid, 'may'] co ham nen khong cat */
function cotCat(k: QueryKey, uid: string): boolean {
  if (k[1] !== uid) return false;
  if (k[0] === 'exercise' || k[0] === 'quiz' || k[0] === 'tutor') return true;
  return k[0] === 'challenge' && k[2] === 'de';
}

/** Yeu cau AI dang cho da mat theo trang cu: bo co "dang..." de nut khong treo mai */
function boCoDangCho(k: QueryKey, du: unknown): unknown {
  if (!du || typeof du !== 'object') return du;
  if (k[0] === 'exercise') return { ...du, dangTao: false, dangCham: false };
  if (k[0] === 'tutor') return { ...du, dangGui: false };
  return du;
}

function xoa() {
  try { sessionStorage.removeItem(KHOA_VIEC_REACT); } catch { /* che do rieng tu */ }
}

export function chupViecDangLam(qc: QueryClient, uid: string | null | undefined): void {
  if (!uid) { xoa(); return; }
  const ds = qc.getQueryCache()
    .findAll({ predicate: q => q.state.data !== undefined && cotCat(q.queryKey, uid) })
    .map(q => [q.queryKey, q.state.data] as [QueryKey, unknown]);
  const ban: BanChup = { uid, ds };
  try {
    sessionStorage.setItem(KHOA_VIEC_REACT, JSON.stringify(ban));
  } catch {
    // Day bo nho phien: bo ban chup cu (da cu hon viec dang lam) thay vi nap nham ve sau
    xoa();
  }
}

/** Nap ban chup cua dung nguoi `uid` vao cache roi xoa no; cua nguoi khac thi chi xoa */
export function napViecDangLam(qc: QueryClient, uid: string): void {
  let ban: unknown;
  try {
    const tho = sessionStorage.getItem(KHOA_VIEC_REACT);
    if (tho === null) return;
    ban = JSON.parse(tho);
  } catch {
    xoa();
    return;
  }
  xoa();
  if (!ban || typeof ban !== 'object') return;
  const { uid: cua, ds } = ban as Partial<BanChup>;
  if (cua !== uid || !Array.isArray(ds)) return;
  for (const muc of ds) {
    if (!Array.isArray(muc) || !Array.isArray(muc[0])) continue;
    const k = muc[0] as QueryKey;
    if (cotCat(k, uid)) qc.setQueryData(k, boCoDangCho(k, muc[1]));
  }
}
