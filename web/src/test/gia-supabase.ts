// Client Supabase gia cho bai kiem: chi nhung ham app goi toi.
// Lenh doc tra du lieu tu `bang[tenBang]`; moi truy van da chay ghi vao `truyVan`.
import { vi } from 'vitest';
import type { SupabaseLike } from '@/lib/auth';

type TrangThai = { bang: string; op: string; payload: unknown; dieuKien: [string, unknown][]; motDong: boolean };

export function giaSupabase({ bang = {}, loiDangNhap }: { bang?: Record<string, unknown[]>; loiDangNhap?: string } = {}) {
  let phat: ((e: string, s: unknown) => void) | null = null;
  const truyVan: TrangThai[] = [];

  const tao = (tenBang: string) => {
    const tt: TrangThai = { bang: tenBang, op: 'select', payload: null, dieuKien: [], motDong: false };
    const b = {
      select: () => b,
      eq: (k: string, v: unknown) => { tt.dieuKien.push([k, v]); return b; },
      order: () => b,
      limit: () => b,
      single: () => { tt.motDong = true; return b; },
      maybeSingle: () => { tt.motDong = true; return b; },
      insert: (p: unknown) => { tt.op = 'insert'; tt.payload = p; return b; },
      upsert: (p: unknown) => { tt.op = 'upsert'; tt.payload = p; return b; },
      update: (p: unknown) => { tt.op = 'update'; tt.payload = p; return b; },
      delete: () => { tt.op = 'delete'; return b; },
      then: (ok: (v: unknown) => unknown, loi?: (e: unknown) => unknown) => {
        truyVan.push(tt);
        const v = bang[tenBang] ?? [];
        const data = tt.op === 'select' ? (tt.motDong ? (v[0] ?? null) : v) : tt.payload;
        return Promise.resolve({ data, error: null }).then(ok, loi);
      }
    };
    return b;
  };

  const client = {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: null } })),
      onAuthStateChange: vi.fn((f: (e: string, s: unknown) => void) => {
        phat = f;
        return { data: { subscription: { unsubscribe() {} } } };
      }),
      signInWithPassword: vi.fn(async () => (loiDangNhap
        ? { data: { user: null }, error: { message: loiDangNhap } }
        : { data: { user: { id: 'u1' } }, error: null })),
      signUp: vi.fn(async () => ({ data: { user: { id: 'u2' } }, error: null })),
      signOut: vi.fn(async () => { phat?.('SIGNED_OUT', null); return { error: null }; })
    },
    from: vi.fn(tao)
  };

  return {
    client: client as unknown as SupabaseLike & typeof client,
    truyVan,
    phat: (e: string, s: unknown) => phat?.(e, s)
  };
}
