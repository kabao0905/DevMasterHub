const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

test('khung chay code web khong dung chung origin voi trang (khong doc duoc token dang nhap)', () => {
  const sb = hopCat();
  const daTao = [];
  sb.addEventListener = () => {};
  sb.document.createElement = tag => {
    const thuocTinh = {};
    const el = { tag, style: {}, setAttribute: (k, v) => { thuocTinh[k] = v; }, thuocTinh };
    daTao.push(el);
    return el;
  };
  const SR = napFile(sb, 'sandbox-runner.js', 'SandboxRunner');
  const hop = { innerHTML: '', appendChild() {} };

  SR.runWebCode({ html: '<p>hi</p>' }, hop);

  const khung = daTao.find(e => e.tag === 'iframe');
  assert.ok(khung, 'khong tao iframe');
  assert.match(khung.thuocTinh.sandbox, /allow-scripts/);
  assert.doesNotMatch(khung.thuocTinh.sandbox, /allow-same-origin/);
});
