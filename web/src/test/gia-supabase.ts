// Client Supabase gia cho bai kiem: chi nhung ham app goi toi.
// Lenh doc tra du lieu tu `bang[tenBang]`; moi truy van da chay ghi vao `truyVan`.
// `treo[tenBang]`: Promise phai xong truoc khi truy van bang do tra ket qua (mo phong mang cham).
// `loiGhi[tenBang]`: lenh ghi (insert/upsert/update/delete) vao bang do tra { error } nhu Supabase that.
import { vi } from 'vitest';
import type { SupabaseLike } from '@/lib/auth';

type TrangThai = { bang: string; op: string; payload: unknown; tuyChon?: unknown; dieuKien: [string, unknown][]; motDong: boolean };

export function giaSupabase({ bang = {}, loiDangNhap, nguoiDung, treo = {}, loiGhi = {} }: {
  bang?: Record<string, unknown[]>; loiDangNhap?: string; nguoiDung?: { id: string };
  treo?: Record<string, Promise<unknown> | undefined>; loiGhi?: Record<string, string>;
} = {}) {
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
      upsert: (p: unknown, tuyChon?: unknown) => { tt.op = 'upsert'; tt.payload = p; tt.tuyChon = tuyChon; return b; },
      update: (p: unknown) => { tt.op = 'update'; tt.payload = p; return b; },
      delete: () => { tt.op = 'delete'; return b; },
      then: (ok: (v: unknown) => unknown, loi?: (e: unknown) => unknown) => {
        truyVan.push(tt);
        const v = bang[tenBang] ?? [];
        const data = tt.op === 'select' ? (tt.motDong ? (v[0] ?? null) : v) : tt.payload;
        const error = tt.op !== 'select' && loiGhi[tenBang] ? { message: loiGhi[tenBang] } : null;
        return Promise.resolve(treo[tenBang]).then(() => ({ data: error ? null : data, error })).then(ok, loi);
      }
    };
    return b;
  };

  const client = {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: nguoiDung ? { user: nguoiDung } : null } })),
      onAuthStateChange: vi.fn((f: (e: string, s: unknown) => void) => {
        phat = f;
        return { data: { subscription: { unsubscribe() {} } } };
      }),
      // Nhu Supabase that: dang nhap/dang ky thanh cong thi phat su kien SIGNED_IN
      signInWithPassword: vi.fn(async () => {
        if (loiDangNhap) return { data: { user: null }, error: { message: loiDangNhap } };
        const user = { id: 'u1' };
        phat?.('SIGNED_IN', { user });
        return { data: { user }, error: null };
      }),
      signUp: vi.fn(async () => {
        const user = { id: 'u2' };
        phat?.('SIGNED_IN', { user });
        return { data: { user }, error: null };
      }),
      signOut: vi.fn(async () => { phat?.('SIGNED_OUT', null); return { error: null }; })
    },
    from: vi.fn(tao)
  };

  return {
    client: client as unknown as SupabaseLike & typeof client,
    truyVan,
    treo,
    loiGhi,
    phat: (e: string, s: unknown) => phat?.(e, s)
  };
}
