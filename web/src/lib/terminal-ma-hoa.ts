// Lenh ma hoa / xem byte cua terminal gia lap: base64, sha256sum, xxd. Lam viec tren byte UTF-8 nhu Linux that.
import { docNguon, tachCo, type LenhThuan } from './terminal-van-ban';

const maHoa = new TextEncoder();
const giaiMa = new TextDecoder();

function base64Ma(byte: Uint8Array): string {
  let s = '';
  for (const b of byte) s += String.fromCharCode(b);
  return btoa(s);
}

const base64: LenhThuan['chay'] = (args, nc) => {
  const { co, conLai } = tachCo(args.map(a => (a === '--decode' ? '-d' : a)), 'w');
  const giai = !!co.d;
  let vao: string;
  if (conLai[0]) {
    const r = nc.docTep(conLai[0]);
    // Ban cu cho "base64 -d <chuoi>" giai thang chuoi go vao: giu de bai cu khong gay
    if ('loi' in r) {
      if (!giai) return `base64: ${conLai[0]}: ${r.loi}`;
      vao = conLai[0];
    } else vao = r.noiDung;
  } else if (nc.stdin !== null) vao = nc.stdin;
  else return `base64: ${nc.t('loi.cachDung', { cu: 'base64 [-d] <file>  |  echo text | base64 [-d]' })}`;
  if (!giai) return base64Ma(maHoa.encode(vao));
  try {
    const nhiPhan = atob(vao.replace(/\s+/g, ''));
    return giaiMa.decode(Uint8Array.from(nhiPhan, c => c.charCodeAt(0)));
  } catch {
    return 'base64: invalid input';
  }
};

// SHA-256 dong bo (crypto.subtle la bat dong bo, khong dung duoc trong terminal chay dong bo)
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

export function sha256Hex(du: Uint8Array): string {
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const doDai = Math.ceil((du.length + 9) / 64) * 64;
  const m = new Uint8Array(doDai);
  m.set(du);
  m[du.length] = 0x80;
  const v = new DataView(m.buffer);
  v.setUint32(doDai - 8, Math.floor((du.length * 8) / 0x100000000));
  v.setUint32(doDai - 4, (du.length * 8) >>> 0);
  const w = new Uint32Array(64);
  const xoay = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < doDai; o += 64) {
    for (let i = 0; i < 16; i++) w[i] = v.getUint32(o + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = xoay(w[i - 15], 7) ^ xoay(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = xoay(w[i - 2], 17) ^ xoay(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (xoay(e, 6) ^ xoay(e, 11) ^ xoay(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0;
      const t2 = ((xoay(a, 2) ^ xoay(a, 13) ^ xoay(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((x, i) => { h[i] = (h[i] + x) >>> 0; });
  }
  return Array.from(h, x => x.toString(16).padStart(8, '0')).join('');
}

const sha256sum: LenhThuan['chay'] = (args, nc) => {
  const { conLai } = tachCo(args);
  if (!conLai.length) {
    if (nc.stdin === null) return `sha256sum: ${nc.t('loi.thieuTepPipe', { vd: 'echo abc | sha256sum' })}`;
    return `${sha256Hex(maHoa.encode(nc.stdin))}  -`;
  }
  return conLai.map(t => {
    const r = nc.docTep(t);
    return 'loi' in r ? `sha256sum: ${t}: ${r.loi}` : `${sha256Hex(maHoa.encode(r.noiDung))}  ${t}`;
  }).join('\n');
};

/** xxd: 16 byte moi dong, nhom 2 byte, cot ASCII ben phai */
const xxd: LenhThuan['chay'] = (args, nc) => {
  const r = docNguon('xxd', tachCo(args).conLai, nc);
  if ('loi' in r) return r.loi;
  const byte = maHoa.encode(r.text);
  const dong: string[] = [];
  for (let o = 0; o < byte.length; o += 16) {
    const khuc = byte.slice(o, o + 16);
    const hex = Array.from(khuc, b => b.toString(16).padStart(2, '0')).join('').match(/.{1,4}/g)!.join(' ');
    const chu = Array.from(khuc, b => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '.')).join('');
    dong.push(`${o.toString(16).padStart(8, '0')}: ${hex.padEnd(39)}  ${chu}`);
  }
  return dong.join('\n');
};

export const LENH_MA_HOA: Record<string, LenhThuan> = {
  base64: { usage: 'base64 [-d] [file]', chay: base64 },
  sha256sum: { usage: 'sha256sum [file]', chay: sha256sum },
  xxd: { usage: 'xxd [file]', chay: xxd }
};
