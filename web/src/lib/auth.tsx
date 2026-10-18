import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { chupViecDangLam, datMacDinhViecDangLam, napViecDangLam, KHOA_VIEC_REACT } from './viec-dang-lam';

export type SupabaseLike = Pick<SupabaseClient, 'auth' | 'from'>;
export type HoSo = { id: string; username: string; display_name: string | null };

const KHOA_CACHE = ['devmaster_hub_profile_cache', 'devmaster_hub_progress_cache', 'devmaster_hub_ideas_cache', 'dmh_lab_progress'];
const KHOA_VIEC_DANG_LAM = 'devmaster_hub_legacy_session';
const TRUY_VAN_CONG_KHAI = new Set(['i18n', 'curriculum']);
const emailTu = (ten: string) => `${ten}@devmaster.hub`;
export const MA_LOI_AUTH = ['authWrongCredentials', 'authUsernameShort', 'authUsernameLong', 'authUsernameChars', 'authPasswordShort', 'authUsernameTaken'] as const;
export type MaLoiAuth = (typeof MA_LOI_AUTH)[number];
export const laMaLoiAuth = (s: string): s is MaLoiAuth => (MA_LOI_AUTH as readonly string[]).includes(s);

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
  useState(() => datMacDinhViecDangLam(qc));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const daCoSuKien = useRef(false);

  const xoaDuLieuNguoiDung = useCallback(() => {
    qc.removeQueries({ predicate: q => !TRUY_VAN_CONG_KHAI.has(String(q.queryKey[0])) });
    for (const k of KHOA_CACHE) {
      try { localStorage.removeItem(k); } catch {}
    }
    try { sessionStorage.removeItem(KHOA_VIEC_DANG_LAM); sessionStorage.removeItem(KHOA_VIEC_REACT); } catch {}
  }, [qc]);

  useEffect(() => {
    let song = true;
    client.auth.getSession().then(({ data }) => {
      if (!song || daCoSuKien.current) return;
      if (data.session) napViecDangLam(qc, data.session.user.id);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (!data.session) xoaDuLieuNguoiDung();
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      daCoSuKien.current = true;
      if (session) napViecDangLam(qc, session.user.id);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) xoaDuLieuNguoiDung();
    });
    return () => {
      song = false;
      data.subscription.unsubscribe();
    };
  }, [client, qc, xoaDuLieuNguoiDung]);

  const uidRef = useRef<string | undefined>(undefined);
  useEffect(() => { uidRef.current = user?.id; }, [user]);
  useEffect(() => {
    const khiRoi = () => chupViecDangLam(qc, uidRef.current);
    window.addEventListener('pagehide', khiRoi);
    return () => window.removeEventListener('pagehide', khiRoi);
  }, [qc]);

  useEffect(() => {
    function khiHienLai(e: PageTransitionEvent) {
      if (!e.persisted) return;
      if (uidRef.current) napViecDangLam(qc, uidRef.current);
      void qc.invalidateQueries({ queryKey: ['progress'] });
      void qc.invalidateQueries({ queryKey: ['profile'] });
    }
    window.addEventListener('pageshow', khiHienLai);
    return () => window.removeEventListener('pageshow', khiHienLai);
  }, [qc]);

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
    if (error) throw new Error(/invalid login/i.test(error.message) ? 'authWrongCredentials' : error.message);
  }, [client]);

  const register = useCallback(async (tenDangNhap: string, matKhau: string) => {
    const ten = tenDangNhap.trim().toLowerCase();
    if (ten.length < 3) throw new Error('authUsernameShort');
    if (ten.length > 20) throw new Error('authUsernameLong');
    if (!/^[a-z0-9_]+$/.test(ten)) throw new Error('authUsernameChars');
    if (matKhau.length < 6) throw new Error('authPasswordShort');

    const { data, error } = await client.auth.signUp({
      email: emailTu(ten),
      password: matKhau,
      options: { data: { display_name: ten } }
    });
    if (error) throw new Error(/already registered/i.test(error.message) ? 'authUsernameTaken' : error.message);
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
