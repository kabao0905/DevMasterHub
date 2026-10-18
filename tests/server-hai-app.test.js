const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function taoDist() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
  fs.mkdirSync(path.join(d, 'assets'));
  fs.writeFileSync(path.join(d, 'index.html'), [
    '<!DOCTYPE html><html><head>',
    '<title>x</title>',
    '<meta name="description" content="x">',
    '<link rel="canonical" href="x">',
    '</head><body><div id="root" data-app="react"></div>',
    '<script type="module" src="/assets/index-AbC123xy.js"></script></body></html>'
  ].join(''));
  fs.writeFileSync(path.join(d, 'assets', 'index-AbC123xy.js'), 'console.log(1)');
  fs.writeFileSync(path.join(d, 'assets', 'og-image.png'), 'png');
  fs.writeFileSync(path.join(d, 'robots.txt'), 'User-agent: *');
  return d;
}

async function moServer(distDir) {
  process.env.DIST_DIR = distDir;
  const duongDan = path.join(__dirname, '..', 'server.js');
  delete require.cache[require.resolve(duongDan)];
  const app = require(duongDan);
  const sv = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  return { goc: `http://127.0.0.1:${sv.address().port}`, dong: () => { sv.closeAllConnections(); sv.close(); } };
}

test('co ban build: /, /auth, /roadmap/*, /lesson/* va /challenge do app React phuc vu, co meta SEO', async () => {
  const s = await moServer(taoDist());
  try {
    const roadmap = await (await fetch(s.goc + '/roadmap/python')).text();
    assert.ok(roadmap.includes('data-app="react"'), '/roadmap/python khong phai app React');
    assert.match(roadmap, /<title>Học Python/);
    const bai = await (await fetch(s.goc + '/lesson/python/newbie/intro')).text();
    assert.ok(bai.includes('data-app="react"'), '/lesson/... khong phai app React');
    assert.match(bai, /<title>Hello World/);
    const thuThach = await (await fetch(s.goc + '/challenge')).text();
    assert.ok(thuThach.includes('data-app="react"'), '/challenge khong phai app React');
    const lab = await (await fetch(s.goc + '/project')).text();
    assert.ok(lab.includes('data-app="react"'), '/project khong phai app React');
    assert.match(lab, /<title>Project Lab/);
    for (const p of ['/project-level/mid', '/project-topic/Game', '/saved-ideas', '/my-projects', '/my-projects/5']) {
      assert.ok((await (await fetch(s.goc + p)).text()).includes('data-app="react"'), p + ' khong phai app React');
    }
    for (const p of ['/', '/auth']) {
      const html = await (await fetch(s.goc + p)).text();
      assert.ok(html.includes('data-app="react"'), p + ' khong phai app React');
      assert.match(html, /<title>DevMaster Hub/);
      assert.ok(!html.includes('<title>x</title>'));
    }
  } finally { s.dong(); }
});


test('file trong dist/assets co hash duoc cache lau dai; file tinh khac (og-image, robots) van phuc vu', async () => {
  const s = await moServer(taoDist());
  try {
    const js = await fetch(s.goc + '/assets/index-AbC123xy.js');
    assert.strictEqual(js.status, 200);
    assert.match(js.headers.get('cache-control'), /immutable/);
    const anh = await fetch(s.goc + '/assets/og-image.png');
    assert.strictEqual(anh.status, 200);
    assert.strictEqual((await fetch(s.goc + '/robots.txt')).status, 200);
  } finally { s.dong(); }
});


test('/index.html (bookmark cu) chuyen 301 ve / — static tra ban React o day thi router React tai lai mai', async () => {
  const s = await moServer(taoDist());
  try {
    for (const [vao, ra] of [['/index.html', '/'], ['/index.html?x=1', '/?x=1']]) {
      const r = await fetch(s.goc + vao, { redirect: 'manual' });
      assert.strictEqual(r.status, 301, vao);
      assert.strictEqual(r.headers.get('location'), ra);
    }
  } finally { s.dong(); }
});

test('URL la: van tra trang React (hien Khong tim thay) voi ma 404, khong con dau vet app cu', async () => {
  const s = await moServer(taoDist());
  try {
    const r = await fetch(s.goc + '/khong-co-trang-nay');
    assert.strictEqual(r.status, 404);
    const html = await r.text();
    assert.ok(html.includes('data-app="react"'));
    assert.ok(!html.includes('__REACT_VIEWS'));
    assert.strictEqual((await fetch(s.goc + '/career')).status, 200);
  } finally { s.dong(); }
});

test('chua co ban build: tra 503 kem huong dan, khong vong lap', async () => {
  const s = await moServer(fs.mkdtempSync(path.join(os.tmpdir(), 'dist-rong-')));
  try {
    const r = await fetch(s.goc + '/');
    assert.strictEqual(r.status, 503);
    assert.match(await r.text(), /npm run build/);
  } finally { s.dong(); }
});
