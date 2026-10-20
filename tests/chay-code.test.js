const { test } = require('node:test');
const assert = require('node:assert');
const { chonTrinhGodbolt, chonTrinhWandbox, boPublicJava, chuanHoaNgonNgu, chuanHoaYeuCauChay, NGON_NGU, MAU_TU_KIEM } = require('../lib/chay-code.js');

test('chonTrinhGodbolt: chi lay trinh chay duoc, bo ban trunk/nightly, uu tien phien ban moi nhat', () => {
  const ds = [
    { id: 'a', name: 'rustc 1.70.0', semver: '1.70.0', supportsExecute: true },
    { id: 'b', name: 'rustc 1.83.0', semver: '1.83.0', supportsExecute: true },
    { id: 'c', name: 'rustc nightly', semver: 'nightly', supportsExecute: true },
    { id: 'd', name: 'rustc 1.90.0', semver: '1.90.0', supportsExecute: false }
  ];
  assert.deepStrictEqual(chonTrinhGodbolt(ds), { id: 'b', ten: 'rustc 1.83.0' });
  assert.strictEqual(chonTrinhGodbolt([{ id: 'x', name: 'x', supportsExecute: false }]), null);
  assert.strictEqual(chonTrinhGodbolt(null), null);
});

test('chonTrinhGodbolt: uu tien dung ho trinh bien dich khi co', () => {
  const ds = [
    { id: 'cclang19', name: 'x86-64 clang 19.1.0', semver: '19.1.0', supportsExecute: true },
    { id: 'cg142', name: 'x86-64 gcc 14.2', semver: '14.2', supportsExecute: true }
  ];
  assert.strictEqual(chonTrinhGodbolt(ds, /x86-64 gcc/i).id, 'cg142');
});

test('chonTrinhWandbox: dung ngon ngu, bo ban head, lay ban moi nhat va theo uu tien', () => {
  const ds = [
    { name: 'cpython-head', language: 'Python', version: 'head' },
    { name: 'pypy-3.10-v7.3.17', language: 'Python', version: '3.10' },
    { name: 'cpython-3.12.7', language: 'Python', version: '3.12.7' },
    { name: 'cpython-3.11.10', language: 'Python', version: '3.11.10' }
  ];
  assert.strictEqual(chonTrinhWandbox(ds, NGON_NGU.python.wandbox).id, 'cpython-3.12.7');
  assert.strictEqual(chonTrinhWandbox(ds, { ngonNgu: 'Ruby' }), null);
});

test('boPublicJava: bo public o kieu ngoai cung, giu nguyen ben trong', () => {
  const vao = 'import java.util.*;\npublic class A {\n  public static void main(String[] a) {}\n}\npublic final class B {}\npublic record P(int x) {}\nclass C {}';
  const ra = boPublicJava(vao);
  assert.ok(ra.includes('\nclass A {'));
  assert.ok(ra.includes('  public static void main'));
  assert.ok(ra.includes('\nfinal class B {}'));
  assert.ok(ra.includes('\nrecord P(int x) {}'));
});

test('chuanHoaNgonNgu va yeu cau chay', () => {
  assert.strictEqual(chuanHoaNgonNgu('C#'), 'csharp');
  assert.strictEqual(chuanHoaNgonNgu('c++'), 'cpp');
  assert.strictEqual(chuanHoaNgonNgu('Golang'), 'go');
  assert.strictEqual(chuanHoaNgonNgu('cobol'), null);
  assert.strictEqual(chuanHoaNgonNgu('toString'), null);
  assert.deepStrictEqual(chuanHoaYeuCauChay({ code: 'x' }, 'cpp'), { lang: 'cpp', code: 'x', stdin: '' });
  assert.ok(chuanHoaYeuCauChay({ lang: 'rust', code: ' ' }).loi.includes('Rust'));
  assert.ok(chuanHoaYeuCauChay({ lang: 'go', code: 'x', stdin: 5 }).loi);
});

test('moi ngon ngu tren may chu deu co chuong trinh mau tu kiem', () => {
  for (const lang of Object.keys(NGON_NGU)) assert.ok(MAU_TU_KIEM[lang], lang);
});
