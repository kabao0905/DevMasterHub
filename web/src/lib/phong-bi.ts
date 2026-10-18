const DOAN = 0x8000;

export function dongPhongBi(obj: unknown): string {
  const byte = new TextEncoder().encode(JSON.stringify(obj));
  let nhiPhan = '';
  for (let i = 0; i < byte.length; i += DOAN) nhiPhan += String.fromCharCode(...byte.subarray(i, i + DOAN));
  return JSON.stringify({ b64: btoa(nhiPhan) });
}
