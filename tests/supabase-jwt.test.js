const { test } = require('node:test');
const assert = require('node:assert');
const { generateKeyPairSync, sign, createHmac } = require('node:crypto');
const { taoXacThucJwt } = require('../lib/supabase-jwt.js');

const GOC = 'https://demo.supabase.co';
const ISS = GOC + '/auth/v1';
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');

function taoKhoa(kid) {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  return { kid, privateKey, jwk: { ...publicKey.export({ format: 'jwk' }), kid, alg: 'ES256', use: 'sig' } };
}

function kyToken(k, than, dau = {}) {
  const phan = b64({ alg: 'ES256', typ: 'JWT', kid: k.kid, ...dau }) + '.' + b64(than);
  return phan + '.' + sign('sha256', Buffer.from(phan), { key: k.privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64url');
}

const BAY_GIO = 1_800_000_000_000;
const thanHopLe = (them = {}) => ({ sub: 'u-1', email: 'a@b.c', role: 'authenticated', aud: 'authenticated', iss: ISS, exp: BAY_GIO / 1000 + 3600, iat: BAY_GIO / 1000, ...them });

function dung(dsKhoa, { bayGio = () => BAY_GIO } = {}) {
  const goi = [];
  let khoa = dsKhoa;
  const xacThuc = taoXacThucJwt({
    supabaseUrl: GOC,
    bayGio,
    fetchImpl: async url => {
      goi.push(url);
      if (khoa === 'loi') return new Response('', { status: 503 });
      return new Response(JSON.stringify({ keys: khoa.map(k => k.jwk) }));
    }
  });
  return { xacThuc, goi, doiKhoa: ds => { khoa = ds; } };
}

const maLoi = async p => { try { await p; return 'OK'; } catch (e) { return e.code; } };

test('token Supabase hop le: tra id/email, chi tai JWKS mot lan cho nhieu request', async () => {
  const k = taoKhoa('k1');
  const { xacThuc, goi } = dung([k]);
  assert.deepStrictEqual(await xacThuc(kyToken(k, thanHopLe())), { id: 'u-1', email: 'a@b.c', role: 'authenticated' });
  await xacThuc(kyToken(k, thanHopLe({ sub: 'u-2' })));
  assert.deepStrictEqual(goi, [ISS + '/.well-known/jwks.json']);
});

test('het han, sai chu ky, sai iss/aud/role, thieu sub: tu choi INVALID ma khong goi Supabase', async () => {
  const k = taoKhoa('k1');
  const khac = taoKhoa('k1');
  const { xacThuc } = dung([k]);
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ exp: BAY_GIO / 1000 - 60 })))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(khac, thanHopLe()))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ exp: BAY_GIO / 1000 - 1 })))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ aud: 'other' })))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ role: 'anon' })))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ sub: '' })))), 'INVALID');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ nbf: BAY_GIO / 1000 + 3600 })))), 'INVALID');
  const t = kyToken(k, thanHopLe());
  const [d, , c] = t.split('.');
  assert.strictEqual(await maLoi(xacThuc(`${d}.${b64(thanHopLe({ sub: 'admin' }))}.${c}`)), 'INVALID');
});

test('alg none/HS256 hoac khong phai JWT: khong tu tin, de server hoi Supabase (FALLBACK)', async () => {
  const k = taoKhoa('k1');
  const { xacThuc } = dung([k]);
  const none = b64({ alg: 'none', typ: 'JWT', kid: 'k1' }) + '.' + b64(thanHopLe()) + '.';
  assert.strictEqual(await maLoi(xacThuc(none)), 'FALLBACK');
  const phan = b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64(thanHopLe());
  const hs = phan + '.' + createHmac('sha256', 'bi-mat').update(phan).digest('base64url');
  assert.strictEqual(await maLoi(xacThuc(hs)), 'FALLBACK');
  assert.strictEqual(await maLoi(xacThuc('tok')), 'FALLBACK');
});

test('chu ky dung nhung iss lech (cau hinh SUPABASE_URL khac): khong da nguoi dung ra, de Supabase quyet', async () => {
  const k = taoKhoa('k1');
  const { xacThuc } = dung([k]);
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ iss: 'https://custom.domain/auth/v1' })))), 'FALLBACK');
});

test('alg la ten thuoc tinh cua Object (constructor/toString): khong lot qua bang thuat toan', async () => {
  const k = taoKhoa('k1');
  const { xacThuc, goi } = dung([k]);
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe(), { alg: 'constructor' }))), 'FALLBACK');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe(), { alg: 'toString' }))), 'FALLBACK');
  assert.strictEqual(goi.length, 0);
});

test('JWKS loi thi 30 giay sau moi thu lai, khong bat moi request cho them', async () => {
  let gio = BAY_GIO;
  const k = taoKhoa('k1');
  const { xacThuc, goi, doiKhoa } = dung('loi', { bayGio: () => gio });
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe()))), 'FALLBACK');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe()))), 'FALLBACK');
  assert.strictEqual(goi.length, 1);
  doiKhoa([k]);
  gio += 31_000;
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ exp: gio / 1000 + 600 })))), 'OK');
  assert.strictEqual(goi.length, 2);
});

test('mot khoa JWK hong khong lam hong cac khoa con lai', async () => {
  const k = taoKhoa('k1');
  const xacThuc = taoXacThucJwt({
    supabaseUrl: GOC, bayGio: () => BAY_GIO,
    fetchImpl: async () => new Response(JSON.stringify({ keys: [{ kty: 'EC', crv: 'P-256', alg: 'ES256', kid: 'hong', x: 'xx', y: 'yy' }, k.jwk] }))
  });
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe()))), 'OK');
});

test('alg trong token khac alg cua khoa: tu choi', async () => {
  const k = taoKhoa('k1');
  const { xacThuc } = dung([k]);
  const t = kyToken(k, thanHopLe(), { alg: 'RS256' });
  assert.strictEqual(await maLoi(xacThuc(t)), 'INVALID');
});

test('Supabase doi khoa: kid moi thi tai lai JWKS (toi da 30 giay/lan), kid la thi FALLBACK', async () => {
  let gio = BAY_GIO;
  const k1 = taoKhoa('k1');
  const k2 = taoKhoa('k2');
  const { xacThuc, goi, doiKhoa } = dung([k1], { bayGio: () => gio });
  await xacThuc(kyToken(k1, thanHopLe()));
  doiKhoa([k1, k2]);
  assert.strictEqual(await maLoi(xacThuc(kyToken(k2, thanHopLe()))), 'FALLBACK');
  gio += 31_000;
  assert.strictEqual(await maLoi(xacThuc(kyToken(k2, thanHopLe()))), 'OK');
  assert.strictEqual(goi.length, 2);
  gio += 31_000;
  assert.strictEqual(await maLoi(xacThuc(kyToken(taoKhoa('k9'), thanHopLe()))), 'FALLBACK');
});

test('JWKS het han sau 10 phut thi tai lai; tai JWKS loi thi FALLBACK', async () => {
  let gio = BAY_GIO;
  const k = taoKhoa('k1');
  const { xacThuc, goi, doiKhoa } = dung([k], { bayGio: () => gio });
  await xacThuc(kyToken(k, thanHopLe()));
  gio += 11 * 60_000;
  doiKhoa('loi');
  assert.strictEqual(await maLoi(xacThuc(kyToken(k, thanHopLe({ exp: gio / 1000 + 600 })))), 'FALLBACK');
  assert.strictEqual(goi.length, 2);
});
