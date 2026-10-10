// Dang nhap bang ten dang nhap (email noi bo <ten>@devmaster.hub), giong app cu.
// Dung chung phien voi app cu vi ca hai tao client Supabase cung URL -> cung khoa localStorage.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type SupabaseLike = Pick<SupabaseClient, 'auth' | 'from'>;
export type HoSo = { id: string; username: string; display_name: string | null };

/** Cache cua app cu tren may; phai xoa khi dang xuat de nguoi sau khong thay */
const KHOA_CACHE = ['devmaster_hub_profile_cache', 'devmaster_hub_progress_cache', 'devmaster_hub_ideas_cache'];
/** Viec dang lam do app cu cat tam khi sang app React (xem catViecDangLam trong public/app.js) */
const KHOA_VIEC_DANG_LAM = 'devmaster_hub_legacy_session';
/** Truy van dung chung cho moi nguoi: doi nguoi dung khong can xoa, khoi tai lai */
const TRUY_VAN_CONG_KHAI = new Set(['i18n', 'curriculum']);
const emailTu = (ten: string) => `${ten}@devmaster.hub`;

type GiaTri = {
  client: SupabaseLike;
  user: User | null;
  profile: HoSo | null;
  loading: boolean;
  login: (tenDangNhap: string, matKhau: string) => Promise<void>;
  register: (tenDangNhap: string, matKhau: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<GiaTri | null>(null);

export function AuthProvider({ children, client = supabase }: { children: ReactNode; client?: SupabaseLike }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const daCoSuKien = useRef(false);

  const xoaDuLieuNguoiDung = useCallback(() => {
    // Huy luon truy van dang chay: ket qua ve muon khong duoc ghi vao cache cua may (xem use-progress)
    qc.removeQueries({ predicate: q => !TRUY_VAN_CONG_KHAI.has(String(q.queryKey[0])) });
    for (const k of KHOA_CACHE) {
      try { localStorage.removeItem(k); } catch { /* bo qua */ }
    }
    try { sessionStorage.removeItem(KHOA_VIEC_DANG_LAM); } catch { /* bo qua */ }
  }, [qc]);

  useEffect(() => {
    let song = true;
    client.auth.getSession().then(({ data }) => {
      // Su kien dang nhap co the den truoc; khi do ket qua getSession ban dau da cu
      if (!song || daCoSuKien.current) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (!data.session) xoaDuLieuNguoiDung();
    });
    // Khong goi ham Supabase khac trong callback nay (co the khoa lan nhau) — chi doi state
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      daCoSuKien.current = true;
      setUser(session?.user ?? null);
      setLoading(false);
      // Moi lan khong co phien (ke ca phien cu het han luc mo trang, khong co SIGNED_OUT) — giong app cu
      if (!session) xoaDuLieuNguoiDung();
    });
    return () => {
      song = false;
      data.subscription.unsubscribe();
    };
  }, [client, xoaDuLieuNguoiDung]);

  const { data: profile = null } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await client.from('profiles').select('id, username, display_name').eq('id', user!.id).maybeSingle();
      if (error) throw error;
      return (data as HoSo | null) ?? null;
    }
  });

  const login = useCallback(async (tenDangNhap: string, matKhau: string) => {
    const ten = tenDangNhap.trim().toLowerCase();
    const { error } = await client.auth.signInWithPassword({ email: emailTu(ten), password: matKhau });
    if (error) throw new Error(/invalid login/i.test(error.message) ? 'Sai tên đăng nhập hoặc mật khẩu' : error.message);
  }, [client]);

  const register = useCallback(async (tenDangNhap: string, matKhau: string) => {
    const ten = tenDangNhap.trim().toLowerCase();
    if (ten.length < 3) throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
    if (ten.length > 20) throw new Error('Tên đăng nhập tối đa 20 ký tự');
    if (!/^[a-z0-9_]+$/.test(ten)) throw new Error('Tên đăng nhập chỉ chứa chữ thường, số và dấu _');
    if (matKhau.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');

    const { data, error } = await client.auth.signUp({
      email: emailTu(ten),
      password: matKhau,
      options: { data: { display_name: ten } }
    });
    if (error) throw new Error(/already registered/i.test(error.message) ? 'Tên đăng nhập đã tồn tại' : error.message);
    // Trigger handle_new_user cung tao ho so; upsert de chac chan co username dung
    if (data.user) await client.from('profiles').upsert({ id: data.user.id, username: ten, display_name: ten });
  }, [client]);

  const logout = useCallback(async () => {
    await client.auth.signOut();
    xoaDuLieuNguoiDung();
    setUser(null);
  }, [client, xoaDuLieuNguoiDung]);

  const giaTri = useMemo(() => ({ client, user, profile, loading, login, register, logout }),
    [client, user, profile, loading, login, register, logout]);

  return <AuthContext.Provider value={giaTri}>{children}</AuthContext.Provider>;
}

export function useAuth(): GiaTri {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth phải nằm trong <AuthProvider>');
  return v;
}
