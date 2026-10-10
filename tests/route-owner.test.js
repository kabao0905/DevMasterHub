const { test } = require('node:test');
const assert = require('node:assert');
const { laUrlReact, VIEW_REACT } = require('../lib/route-owner.js');

test('dot 1: trang chu va dang nhap thuoc app React', () => {
  assert.ok(laUrlReact('/'));
  assert.ok(laUrlReact('/auth'));
  assert.ok(laUrlReact('/auth/'));
  assert.ok(laUrlReact('/auth?tu=email'));
});

test('cac trang chua chuyen van thuoc app cu', () => {
  for (const p of ['/roadmap/python', '/lesson/python/newbie/l1', '/career', '/project', '/authx', '/auth/khac']) {
    assert.ok(!laUrlReact(p), p);
  }
});

test('ten view cua app cu tuong ung voi URL da chuyen', () => {
  assert.deepStrictEqual(VIEW_REACT, ['dashboard', 'auth']);
});

test('moi view trong VIEW_REACT, app cu di toi dung URL server giao cho React (lech nhau = tai lai vo han)', () => {
  const { napApp } = require('./helper.js');
  const a = napApp({ dichVu: { AuthService: { init: () => false, isConfigured: () => false }, __REACT_VIEWS: VIEW_REACT } });
  const diToi = [];
  a.sb.location.assign = u => diToi.push(u);
  for (const view of VIEW_REACT) a.App.navigateTo(view);
  assert.strictEqual(diToi.length, VIEW_REACT.length, 'co view khong tai trang moi');
  for (const url of diToi) assert.ok(laUrlReact(url), url + ' khong thuoc app React tren server');
});
