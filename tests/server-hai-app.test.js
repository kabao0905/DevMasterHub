const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Ban build gia cua app React: chi can co cac the meta de server chen SEO
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
  return d;
}

async function moServer(distDir) {
  process.env.DIST_DIR = distDir;
  const duongDan = path.join(__dirname, '..', 'server.js');
  delete require.cache[require.resolve(duongDan)];
  const app = require(duongDan);
  const sv = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  return { goc: `http://127.0.0.1:${sv.address().port}`, dong: () => sv.close() };
}

test('co ban build: / va /auth do app React phuc vu, co meta SEO', async () => {
  const s = await moServer(taoDist());
  try {
    for (const p of ['/', '/auth']) {
      const html = await (await fetch(s.goc + p)).text();
      assert.ok(html.includes('data-app="react"'), p + ' khong phai app React');
      assert.match(html, /<title>DevMaster Hub/);
      assert.ok(!html.includes('<title>x</title>'));
    }
  } finally { s.dong(); }
});

test('co ban build: trang chua chuyen van la app cu, va app cu biet view nao da sang React', async () => {
  const s = await moServer(taoDist());
  try {
    const html = await (await fetch(s.goc + '/roadmap/python')).text();
    assert.ok(html.includes('id="main-content"'), 'khong phai app cu');
    assert.match(html, /<title>Học Python/);
    assert.ok(html.includes('window.__REACT_VIEWS=["dashboard","auth"]'));
  } finally { s.dong(); }
});

test('file trong dist/assets co hash duoc cache lau dai; file cu trong public van phuc vu', async () => {
  const s = await moServer(taoDist());
  try {
    const js = await fetch(s.goc + '/assets/index-AbC123xy.js');
    assert.strictEqual(js.status, 200);
    assert.match(js.headers.get('cache-control'), /immutable/);
    const anh = await fetch(s.goc + '/assets/og-image.png');
    assert.strictEqual(anh.status, 200);
  } finally { s.dong(); }
});

test('chua co ban build: / lui ve app cu va khong bao app cu chuyen huong (tranh vong lap)', async () => {
  const s = await moServer(fs.mkdtempSync(path.join(os.tmpdir(), 'dist-rong-')));
  try {
    const html = await (await fetch(s.goc + '/')).text();
    assert.ok(html.includes('id="main-content"'), 'khong lui ve app cu');
    assert.ok(!html.includes('__REACT_VIEWS'));
  } finally { s.dong(); }
});
