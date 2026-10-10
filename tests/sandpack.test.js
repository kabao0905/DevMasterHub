const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

// Nap Sandpack voi mot iframe gia de doc lai tai lieu HTML no ghep ra
function napSandpack() {
  const sb = hopCat();
  const khung = { id: 'sp-frame', srcdoc: '', style: {} };
  sb.document.getElementById = id => (id === 'sp-frame' ? khung : null);
  const SP = napFile(sb, 'sandpack-live.js', 'SandpackLive');
  return { SP, khung };
}

test('code JS co $$, $& va $\' duoc dua nguyen van vao khung xem truoc', () => {
  const { SP, khung } = napSandpack();
  const code = "out.textContent = `Giá: $${gia}`;\nconst a = '$&'; const b = \"$'\"; const c = '$`';";
  SP.replaceFile('script.js', code);
  SP.refresh();
  assert.ok(khung.srcdoc.includes(code), khung.srcdoc);
});

test('CSS co $ cung giu nguyen', () => {
  const { SP, khung } = napSandpack();
  const css = "body::after { content: '$$ $&'; }";
  SP.replaceFile('style.css', css);
  SP.refresh();
  assert.ok(khung.srcdoc.includes(css), khung.srcdoc);
});
