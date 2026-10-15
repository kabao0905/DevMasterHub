// Boc body gui server thanh { b64 } (base64 cua JSON UTF-8).
// Tuong lua Cloudflare truoc Render chan body co chuoi giong tan cong (../../, ${jndi:...) bang 403 HTML —
// chat gia su ve lap trinh rat de dinh. Boc lai thi WAF khong doc duoc; server mo ra o lib/phong-bi.js.

/** Moi lan chuyen mot doan: tranh String.fromCharCode(...mang_rat_lon) tran ngan xep */
const DOAN = 0x8000;

export function dongPhongBi(obj: unknown): string {
  const byte = new TextEncoder().encode(JSON.stringify(obj));
  let nhiPhan = '';
  for (let i = 0; i < byte.length; i += DOAN) nhiPhan += String.fromCharCode(...byte.subarray(i, i + DOAN));
  return JSON.stringify({ b64: btoa(nhiPhan) });
}
