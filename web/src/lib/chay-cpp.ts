// Chay code C++ qua /api/run-cpp cua server (server goi Compiler Explorer, du phong Wandbox; can dang nhap).
import type { SupabaseLike } from './auth';
import { dongPhongBi } from './phong-bi';

export type KetQuaChay =
  | { stdout: string; stderr: string; maThoat: number; dichVu: string }
  | { bienDichLoi: string; dichVu: string };

/** Bai hoc viet bang C++ (lang trong giao trinh) */
export const laCpp = (lang?: string) => /^(cpp|c\+\+|cc|cxx)$/i.test(lang ?? '');

export async function chayCpp(client: SupabaseLike, code: string, stdin = '', signal?: AbortSignal): Promise<KetQuaChay> {
  const { data } = await client.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let r: Response;
  try {
    r = await fetch('/api/run-cpp', { method: 'POST', headers, body: dongPhongBi({ code, stdin }), signal });
  } catch (e) {
    if (signal?.aborted) throw e;
    throw new Error('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
  }
  const json = (await r.json().catch(() => null)) as (KetQuaChay & { error?: string }) | null;
  if (!r.ok || !json) throw new Error(json?.error || `Lỗi máy chủ (${r.status})`);
  return json;
}
