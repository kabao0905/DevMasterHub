import { buildDocument, presetFor, PRESETS } from './sandpack-doc';
import { injectScript, rgbToHex, GROUPS } from './design-inject';

const tepHtml = (them: Record<string, string>) => ({ ...PRESETS.html.files, ...them });

test('code JS co $$, $& va $\' duoc dua nguyen van vao khung xem truoc', () => {
  const code = "out.textContent = `Giá: $${gia}`;\nconst a = '$&'; const b = \"$'\"; const c = '$`';";
  expect(buildDocument('html', tepHtml({ 'script.js': code }), { token: 'sp1' }).doc).toContain(code);
});

test('CSS co $ cung giu nguyen', () => {
  const css = "body::after { content: '$$ $&'; }";
  expect(buildDocument('html', tepHtml({ 'style.css': css }), { token: 'sp1' }).doc).toContain(css);
});

test('code hoc vien co </script> khong dong the som (ca che do trang web lan console)', () => {
  const code = 'const s = "</script><img src=x onerror=alert(1)>";';
  const web = buildDocument('html', tepHtml({ 'script.js': code }), { token: 't' }).doc;
  expect(web).not.toContain('"</script><img');
  expect(web).toContain('"<\\/script><img src=x onerror=alert(1)>"');
  const con = buildDocument('js', { 'main.js': code }, { token: 't' }).doc;
  expect(con).not.toContain('"</script><img');
  const css = buildDocument('html', tepHtml({ 'style.css': 'a{}</style><script>x()</script>' }), { token: 't' }).doc;
  expect(css).not.toContain('</style><script>x()');
});

test('thu vien nap truoc code hoc vien; token cau noi console dung token truyen vao', () => {
  const r = buildDocument('react', { ...PRESETS.react.files, 'App.jsx': 'function App(){return <b>hi</b>}' }, { token: 'sp42' });
  expect(r.token).toBe('sp42');
  expect(r.doc.indexOf('react.development.js')).toBeLessThan(r.doc.indexOf('function App()'));
  expect(r.doc).toContain("__sandpack: 'sp42'");
  expect(r.doc).toContain('__dmChay(true)');
  expect(r.doc).not.toContain('type="text/babel"');
});

test('cau noi console nam truoc thu vien; thu vien tai kem crossorigin; bai tu khai bao libs thi thay libs mac dinh', () => {
  const r = buildDocument('react', PRESETS.react.files, { token: 't' });
  expect(r.doc.indexOf('window.__dmChay')).toBeLessThan(r.doc.indexOf('react.development.js'));
  expect(r.doc).toMatch(/react\.development\.js" crossorigin="anonymous"/);
  expect(r.doc).toContain("var TEN = \"App.jsx\"");
  const rieng = buildDocument('react', PRESETS.react.files, { token: 't', libs: ['https://unpkg.com/x@1/x.js'] }).doc;
  expect(rieng).toContain('https://unpkg.com/x@1/x.js');
  expect(rieng).not.toContain('react.development.js');
  const web = buildDocument('html', tepHtml({}), { token: 't' }).doc;
  expect(web).toContain('__dmChay(false)');
  expect(web).toContain('id="__dm_nguon"');
});

test('che do thiet ke chi chen script chon phan tu khi duoc truyen vao', () => {
  const tep = tepHtml({});
  expect(buildDocument('html', tep, { token: 't1' }).doc).not.toContain('__design');
  const coThietKe = buildDocument('html', tep, { token: 't1', designScript: injectScript('t1') }).doc;
  expect(coThietKe).toContain("__design");
  expect(coThietKe).toContain('t1');
});

test('preset theo cong nghe: htmlcss la html, la thi html', () => {
  expect(presetFor('react')).toBe('react');
  expect(presetFor('typescript')).toBe('typescript');
  expect(presetFor('htmlcss')).toBe('html');
  expect(presetFor('constructor')).toBe('html');
  expect(PRESETS.js.mode).toBe('console');
  expect(buildDocument('khong-co', tepHtml({}), { token: 't' }).doc).toContain('<main class="card">');
});

test('rgbToHex va bang thuoc tinh thiet ke', () => {
  expect(rgbToHex('rgb(255, 0, 16)')).toBe('#ff0010');
  expect(rgbToHex('#abc')).toBe('#abc');
  expect(rgbToHex('')).toBe('');
  expect(GROUPS.flatMap(g => g.fields.map(f => f.prop))).toContain('background-color');
});
