// Doc body ma app gui di trong bai kiem: mo phong bi { b64 } (xem lib/phong-bi.ts) neu co, khong thi JSON thuong.
// Mac dinh `any` nhu JSON.parse cu: bai kiem doc thang b.system, b.messages...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function docThan<T = any>(body: unknown): T {
  const o = JSON.parse(String(body)) as { b64?: unknown };
  if (o && typeof o.b64 === 'string' && Object.keys(o).length === 1) {
    const byte = Uint8Array.from(atob(o.b64), c => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(byte)) as T;
  }
  return o as T;
}
