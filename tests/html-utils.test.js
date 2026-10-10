const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

const H = napFile(hopCat(), 'html-utils.js', 'HtmlUtils');

test('escapeHtml thoat ca dau nhay don va chap nhan gia tri khong phai chuoi', () => {
  assert.strictEqual(H.escapeHtml(`<a href="x" title='y'>&</a>`), '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  assert.strictEqual(H.escapeHtml(0), '0');
  assert.strictEqual(H.escapeHtml(null), '');
  assert.strictEqual(H.escapeHtml(undefined), '');
});

test('safeUrl chi cho http/https, con lai thanh #', () => {
  assert.strictEqual(H.safeUrl('https://remoteok.com/l/1'), 'https://remoteok.com/l/1');
  assert.strictEqual(H.safeUrl('javascript:alert(1)'), '#');
  assert.strictEqual(H.safeUrl(' JAVASCRIPT:alert(1)'), '#');
  assert.strictEqual(H.safeUrl('data:text/html,x'), '#');
  assert.strictEqual(H.safeUrl(null), '#');
});

test('khoi code giu nguyen xuong dong va dau *, khong bi chen <br>/<em>', () => {
  const ra = H.formatChatMarkdown('Xem:\n```cpp\nint *a = *b;\nreturn 0;\n```\nXong');
  assert.ok(ra.includes('<pre><code class="language-cpp">int *a = *b;\nreturn 0;</code></pre>'), ra);
  assert.ok(ra.startsWith('Xem:<br>'), ra);
  assert.ok(ra.endsWith('Xong'), ra);
});

test('van ban ngoai code duoc escape truoc khi dinh dang', () => {
  const ra = H.formatChatMarkdown('Thẻ <img src=x onerror=alert(1)> và <div> chưa đóng');
  assert.ok(!ra.includes('<img'), ra);
  assert.ok(!ra.includes('<div'), ra);
  assert.ok(ra.includes('&lt;img src=x onerror=alert(1)&gt;'), ra);
});

test('dam, nghieng, code dong; dau * le trong cau khong bi bien thanh nghieng', () => {
  assert.strictEqual(
    H.formatChatMarkdown('**đậm** và *nghiêng* với `a<b>` và `*p`'),
    '<strong>đậm</strong> và <em>nghiêng</em> với <code>a&lt;b&gt;</code> và <code>*p</code>'
  );
  assert.strictEqual(H.formatChatMarkdown('2 * 3 * 4'), '2 * 3 * 4');
});

test('co the gan class rieng cho khoi code va code dong', () => {
  const ra = H.formatChatMarkdown('```\nx\n``` `y`', { preClass: 'lchat-code', inlineClass: 'lchat-inline-code' });
  assert.strictEqual(ra, '<pre class="lchat-code"><code class="language-plaintext">x</code></pre> <code class="lchat-inline-code">y</code>');
});
