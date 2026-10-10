const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

const FILE_REACT = {
  'index.html': '<div id="root"></div>',
  'style.css': '.card { color: red; }',
  'App.jsx': 'function App() { return <button className="dem">Đếm</button>; }'
};

function napThietKe(traLoiAi) {
  const sb = hopCat();
  const daGui = [];
  const doiFile = [];
  const o = { 'dm-ai-input': { value: 'thêm nút đếm' }, 'dm-ai-status': { textContent: '', className: '' } };
  sb.document.getElementById = id => o[id] || null;
  sb.SandpackLive = {
    getFiles: () => ({ ...FILE_REACT }),
    applyStyle() {},
    replaceFile: (ten, noiDung) => doiFile.push([ten, noiDung]),
    refresh() {}
  };
  sb.fetch = async (url, opts) => {
    daGui.push(JSON.parse(opts.body));
    return { ok: true, status: 200, json: async () => ({ content: [{ text: JSON.stringify(traLoiAi) }] }) };
  };
  const DM = napFile(sb, 'design-mode.js', 'DesignMode');
  return { DM, daGui, doiFile, trangThai: o['dm-ai-status'] };
}

test('AI Thiet ke duoc gui ca file component cua bai React', async () => {
  const { DM, daGui } = napThietKe({ edits: [{ type: 'css', selector: '.dem', props: { color: 'blue' } }], explain: 'ok' });
  await DM.askAi();
  const guiDi = daGui[0].messages[0].content + '\n' + daGui[0].system;
  assert.ok(guiDi.includes('--- App.jsx ---'), 'khong gui App.jsx');
  assert.ok(guiDi.includes('className="dem"'), 'thieu noi dung component');
});

test('sua file cua bai React duoc ap dung, file khong ton tai thi khong bao la da ap dung', async () => {
  const { DM, doiFile, trangThai } = napThietKe({
    edits: [
      { type: 'file', file: 'App.jsx', content: 'function App() { return <p>Mới</p>; }' },
      { type: 'file', file: 'script.js', content: 'khong ton tai' }
    ],
    explain: 'Đã sửa'
  });
  await DM.askAi();
  assert.deepStrictEqual(doiFile.map(([ten]) => ten), ['App.jsx']);
  assert.match(trangThai.textContent, /\(1 thay đổi\)/);
});
