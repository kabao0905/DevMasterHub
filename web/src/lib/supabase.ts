import { createClient } from '@supabase/supabase-js';

const URL_MAC_DINH = 'https://nlkljhpqwepabglrqkmz.supabase.co';
const KHOA_MAC_DINH = 'sb_publishable_0s-SglEeMENWRqgbC2QWuQ_w0pzWJMe';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || URL_MAC_DINH,
  import.meta.env.VITE_SUPABASE_ANON_KEY || KHOA_MAC_DINH
);
