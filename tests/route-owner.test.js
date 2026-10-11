const { test } = require('node:test');
const assert = require('node:assert');
const { laUrlReact } = require('../lib/route-owner.js');

test('trang chu, dang nhap va roadmap thuoc app React', () => {
  for (const p of ['/roadmap', '/roadmap/python', '/roadmap/python/', '/roadmap/python/junior', '/roadmap/python?x=1',
    '/lesson/python/newbie/l1', '/lesson/python/newbie/l1?tab=quiz', '/lesson', '/challenge', '/challenge/',
    '/project', '/project/', '/project-level', '/project-level/mid', '/project-topic', '/project-topic/Game', '/saved-ideas',
    '/my-projects', '/my-projects/', '/my-projects/42', '/career', '/career/']) assert.ok(laUrlReact(p), p);
  assert.ok(laUrlReact('/'));
  assert.ok(laUrlReact('/auth'));
  assert.ok(laUrlReact('/auth/'));
  assert.ok(laUrlReact('/auth?tu=email'));
});

test('URL la (khong co trang) thi khong khop', () => {
  for (const p of ['/careerx', '/career/a', '/projectx', '/project/a', '/project-level/a/b', '/project-topic/a/b', '/saved-ideas/x', '/my-projects/1/2', '/authx', '/auth/khac', '/roadmapx', '/roadmap/a/b/c', '/lesson/a/b/c/d', '/challengex']) {
    assert.ok(!laUrlReact(p), p);
  }
});


