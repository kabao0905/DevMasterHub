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
