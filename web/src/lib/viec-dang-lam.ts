import type { QueryClient, QueryKey } from '@tanstack/react-query';

export const KHOA_VIEC_REACT = 'devmaster_hub_react_session';

type BanChup = { uid: string; ds: [QueryKey, unknown][] };

function cotCat(k: QueryKey, uid: string): boolean {
  if (k[1] !== uid) return false;
  if (k[0] === 'exercise' || k[0] === 'quiz' || k[0] === 'tutor' || k[0] === 'project' || k[0] === 'career') return true;
  return k[0] === 'challenge' && k[2] === 'de';
}

function boCoDangCho(k: QueryKey, du: unknown): unknown {
  if (!du || typeof du !== 'object') return du;
  if (k[0] === 'exercise') return { ...du, dangTao: false, dangCham: false };
  if (k[0] === 'tutor') return { ...du, dangGui: false };
  if (k[0] === 'career') return { ...du, dangGui: false };
  if (k[0] === 'project') return { ...du, dangTao: false, dangGui: false, dangCham: false, tienDo: null };
  return du;
}

export function datMacDinhViecDangLam(qc: QueryClient): void {
  for (const p of ['exercise', 'quiz', 'tutor', 'project', 'challenge', 'career']) qc.setQueryDefaults([p], { gcTime: Infinity });
}

function xoa() {
  try { sessionStorage.removeItem(KHOA_VIEC_REACT); } catch {}
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
    xoa();
  }
}

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
