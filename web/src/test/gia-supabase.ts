import { vi } from 'vitest';
import type { SupabaseLike } from '@/lib/auth';

type TrangThai = { bang: string; op: string; payload: unknown; tuyChon?: unknown; dieuKien: [string, unknown][]; motDong: boolean };

export function giaSupabase({ bang = {}, loiDangNhap, nguoiDung, treo = {}, loiGhi = {}, loiDoc = {} }: {
  bang?: Record<string, unknown[]>; loiDangNhap?: string; nguoiDung?: { id: string; user_metadata?: Record<string, unknown> };
  treo?: Record<string, Promise<unknown> | undefined>;
  loiGhi?: Record<string, string | ((payload: unknown) => string | undefined)>;
  loiDoc?: Record<string, string>;
} = {}) {
  let phat: ((e: string, s: unknown) => void) | null = null;
  const truyVan: TrangThai[] = [];
  const MUC_TIEU_MAC_DINH = { daily_goal_minutes: 15 };
  let hienTai: { id: string; user_metadata: Record<string, unknown> } | null =
    nguoiDung ? { ...nguoiDung, user_metadata: nguoiDung.user_metadata ?? MUC_TIEU_MAC_DINH } : null;

  const tao = (tenBang: string) => {
    const tt: TrangThai = { bang: tenBang, op: 'select', payload: null, dieuKien: [], motDong: false };
    const b = {
      select: () => b,
      eq: (k: string, v: unknown) => { tt.dieuKien.push([k, v]); return b; },
      gte: (k: string, v: unknown) => { tt.dieuKien.push([k + '>=', v]); return b; },
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
        let data = tt.op === 'select' ? (tt.motDong ? (v[0] ?? null) : v) : tt.payload;
        return Promise.resolve(treo[tenBang]).then(() => {
          const l = tt.op === 'select' ? loiDoc[tenBang] : loiGhi[tenBang];
          const thongBao = typeof l === 'function' ? l(tt.payload) : l;
          if (thongBao) return { data: null, error: { message: thongBao } };
          if (tt.op === 'insert' && tt.payload && typeof tt.payload === 'object' && !Array.isArray(tt.payload)) {
            const ds = (bang[tenBang] ??= []) as Record<string, unknown>[];
            const dong = { id: ds.length + 1, ...(tt.payload as Record<string, unknown>) };
            ds.push(dong);
            if (tt.motDong) data = dong;
          }
          if (tt.op === 'upsert' && tt.payload && typeof tt.payload === 'object' && !Array.isArray(tt.payload)) {
            const ds = (bang[tenBang] ??= []) as Record<string, unknown>[];
            const moi = tt.payload as Record<string, unknown>;
            const cot = ((tt.tuyChon as { onConflict?: string } | undefined)?.onConflict ?? '').split(',').filter(Boolean);
            const i = cot.length ? ds.findIndex(r => cot.every(c => r[c] === moi[c])) : -1;
            if (i >= 0) ds[i] = { ...ds[i], ...moi }; else ds.push({ ...moi });
          }
          return { data, error: null };
        }).then(ok, loi);
      }
    };
    return b;
  };

  const client = {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: hienTai ? { user: hienTai } : null } })),
      onAuthStateChange: vi.fn((f: (e: string, s: unknown) => void) => {
        phat = f;
        return { data: { subscription: { unsubscribe() {} } } };
      }),
      signInWithPassword: vi.fn(async () => {
        if (loiDangNhap) return { data: { user: null }, error: { message: loiDangNhap } };
        const user = { id: 'u1', user_metadata: MUC_TIEU_MAC_DINH };
        hienTai = user;
        phat?.('SIGNED_IN', { user });
        return { data: { user }, error: null };
      }),
      signUp: vi.fn(async () => {
        const user = { id: 'u2', user_metadata: {} };
        hienTai = user;
        phat?.('SIGNED_IN', { user });
        return { data: { user }, error: null };
      }),
      signOut: vi.fn(async () => { hienTai = null; phat?.('SIGNED_OUT', null); return { error: null }; }),
      updateUser: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        if (!hienTai) return { data: { user: null }, error: { message: 'Auth session missing!' } };
        hienTai = { ...hienTai, user_metadata: { ...hienTai.user_metadata, ...data } };
        phat?.('USER_UPDATED', { user: hienTai });
        return { data: { user: hienTai }, error: null };
      })
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
