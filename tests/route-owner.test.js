const { test } = require('node:test');
const assert = require('node:assert');
const { laUrlReact, VIEW_REACT } = require('../lib/route-owner.js');

test('trang chu, dang nhap va roadmap thuoc app React', () => {
  for (const p of ['/roadmap', '/roadmap/python', '/roadmap/python/', '/roadmap/python/junior', '/roadmap/python?x=1',
    '/lesson/python/newbie/l1', '/lesson/python/newbie/l1?tab=quiz', '/lesson', '/challenge', '/challenge/',
    '/project', '/project/', '/project-level', '/project-level/mid', '/project-topic', '/project-topic/Game', '/saved-ideas',
    '/my-projects', '/my-projects/', '/my-projects/42']) assert.ok(laUrlReact(p), p);
  assert.ok(laUrlReact('/'));
  assert.ok(laUrlReact('/auth'));
  assert.ok(laUrlReact('/auth/'));
  assert.ok(laUrlReact('/auth?tu=email'));
});

test('cac trang chua chuyen van thuoc app cu', () => {
  for (const p of ['/career', '/projectx', '/project/a', '/project-level/a/b', '/project-topic/a/b', '/saved-ideas/x', '/my-projects/1/2', '/authx', '/auth/khac', '/roadmapx', '/roadmap/a/b/c', '/lesson/a/b/c/d', '/challengex']) {
    assert.ok(!laUrlReact(p), p);
  }
});

test('ten view cua app cu tuong ung voi URL da chuyen', () => {
  assert.deepStrictEqual(VIEW_REACT, ['dashboard', 'auth', 'roadmap', 'lesson', 'challenge', 'project', 'project-level', 'project-topic', 'saved-ideas', 'my-projects']);
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
