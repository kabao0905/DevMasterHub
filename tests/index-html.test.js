const { test } = require('node:test');
const assert = require('node:assert');
const { docNguon } = require('./helper.js');

const html = docNguon('index.html');
const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
const viTri = ten => scripts.indexOf(ten);

test('html-utils.js duoc nap truoc moi file dung den no', () => {
  assert.ok(viTri('/html-utils.js') !== -1, 'index.html chua nap /html-utils.js');
  for (const f of ['/app.js']) {
    assert.ok(viTri('/html-utils.js') < viTri(f), `/html-utils.js phai dung truoc ${f}`);
  }
});

test('thu vien CDN ghim dung phien ban, khong de @2 hay khong co phien ban', () => {
  const nguon = [html, docNguon('sandpack-live.js')].join('\n');
  const cdn = [...nguon.matchAll(/https:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net\/npm)\/[^\s"'`)]+/g)].map(m => m[0]);
  assert.ok(cdn.length > 0);
  for (const url of cdn) {
    assert.match(url, /@\d+\.\d+\.\d+(\/|$)/, 'chua ghim phien ban: ' + url);
  }
  assert.ok(!/https:\/\/cdn\.tailwindcss\.com["'`]/.test(nguon), 'Tailwind CDN chua ghim phien ban');
});
