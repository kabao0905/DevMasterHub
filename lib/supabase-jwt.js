const { createPublicKey, verify } = require('node:crypto');

const KHOA_SONG_MS = 10 * 60_000;
const NAP_LAI_TOI_THIEU_MS = 30_000;
const LECH_GIO_S = 30;
const THUAT_TOAN = Object.freeze({
  ES256: { bam: 'sha256', dsaEncoding: 'ieee-p1363' },
  RS256: { bam: 'sha256' }
});

function loi(code, message) {
  return Object.assign(new Error(message), { code });
}

function docPhan(s) {
  try {
    return JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function taoXacThucJwt({ supabaseUrl, fetchImpl = (...a) => fetch(...a), bayGio = () => Date.now() }) {
  const iss = supabaseUrl.replace(/\/$/, '') + '/auth/v1';
  let bo = null;
  let lanNap = -Infinity;
  let napLoi = false;
  let dangNap = null;

  function napKhoa() {
    if (dangNap) return dangNap;
    dangNap = (async () => {
      lanNap = bayGio();
      napLoi = true;
      const r = await fetchImpl(iss + '/.well-known/jwks.json', { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw loi('FALLBACK', `JWKS HTTP ${r.status}`);
      const { keys } = await r.json();
      const khoa = new Map();
      for (const jwk of Array.isArray(keys) ? keys : []) {
        if (!jwk.kid || !Object.hasOwn(THUAT_TOAN, jwk.alg) || (jwk.use && jwk.use !== 'sig')) continue;
        try {
          khoa.set(jwk.kid, { alg: jwk.alg, key: createPublicKey({ key: jwk, format: 'jwk' }) });
        } catch {}
      }
      bo = { khoa, het: bayGio() + KHOA_SONG_MS };
      napLoi = false;
      return bo;
    })().finally(() => { dangNap = null; });
    return dangNap;
  }

  async function timKhoa(kid) {
    if (!bo || bayGio() > bo.het) {
      if (napLoi && bayGio() - lanNap < NAP_LAI_TOI_THIEU_MS) throw loi('FALLBACK', 'JWKS vừa lỗi, tạm dùng cách kiểm từ xa');
      await napKhoa();
    }
    if (!bo.khoa.has(kid) && bayGio() - lanNap > NAP_LAI_TOI_THIEU_MS) await napKhoa();
    return bo.khoa.get(kid);
  }

  return async function xacThuc(token) {
    const phan = String(token).split('.');
    if (phan.length !== 3) throw loi('FALLBACK', 'Không phải JWT');
    const dau = docPhan(phan[0]);
    const than = docPhan(phan[1]);
    if (!dau || !than) throw loi('INVALID', 'JWT hỏng');
    if (!Object.hasOwn(THUAT_TOAN, dau.alg)) throw loi('FALLBACK', `Thuật toán ${dau.alg} không kiểm cục bộ`);

    let khoa;
    try {
      khoa = await timKhoa(dau.kid);
    } catch (e) {
      throw e.code ? e : loi('FALLBACK', e.message);
    }
    if (!khoa) throw loi('FALLBACK', 'Không có khóa khớp kid');
    if (khoa.alg !== dau.alg) throw loi('INVALID', 'Thuật toán không khớp khóa');

    const tt = THUAT_TOAN[dau.alg];
    const dung = verify(tt.bam, Buffer.from(phan[0] + '.' + phan[1]),
      tt.dsaEncoding ? { key: khoa.key, dsaEncoding: tt.dsaEncoding } : khoa.key,
      Buffer.from(phan[2], 'base64url'));
    if (!dung) throw loi('INVALID', 'Sai chữ ký');

    const giay = Math.floor(bayGio() / 1000);
    if (typeof than.exp !== 'number' || than.exp <= giay) throw loi('INVALID', 'Hết hạn');
    if (typeof than.nbf === 'number' && than.nbf - LECH_GIO_S > giay) throw loi('INVALID', 'Chưa tới hạn');
    if (than.iss !== iss) throw loi('FALLBACK', `iss ${than.iss} khác ${iss}, kiểm lại cấu hình SUPABASE_URL`);
    const aud = Array.isArray(than.aud) ? than.aud : [than.aud];
    if (!aud.includes('authenticated')) throw loi('INVALID', 'Sai aud');
    if (than.role !== 'authenticated' || typeof than.sub !== 'string' || !than.sub) throw loi('INVALID', 'Không phải người dùng đã đăng nhập');

    return { id: than.sub, email: than.email, role: than.role };
  };
}

module.exports = { taoXacThucJwt };
