import { createClient } from '@supabase/supabase-js';

const URL_MAC_DINH = 'https://nlkljhpqwepabglrqkmz.supabase.co';
const KHOA_MAC_DINH = 'sb_publishable_0s-SglEeMENWRqgbC2QWuQ_w0pzWJMe';

export const voiKeepalive = (goc: typeof fetch): typeof fetch => (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const ghiThoiGianHoc = !!init?.method && init.method !== 'GET' && /\/rest\/v1\/learning_sessions(\?|$)/.test(url);
  return goc(input, ghiThoiGianHoc ? { ...init, keepalive: true } : init);
};

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || URL_MAC_DINH,
  import.meta.env.VITE_SUPABASE_ANON_KEY || KHOA_MAC_DINH,
  { global: { fetch: voiKeepalive((...a) => fetch(...a)) } }
);
