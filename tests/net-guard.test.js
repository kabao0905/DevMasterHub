const { test } = require('node:test');
const assert = require('node:assert');
const { Readable } = require('node:stream');
const http = require('node:http');
const { isBlockedAddress, traCuuAnToan, docGioiHan, trichVanBan, taiTrang } = require('../lib/net-guard.js');

test('taiTrang khong gui request nao toi may chu noi bo, du qua IP hay ten mien', async () => {
  let soLanBiGoi = 0;
  const sv = http.createServer((req, res) => { soLanBiGoi++; res.end('bi mat noi bo'); });
  await new Promise(r => sv.listen(0, '127.0.0.1', r));
  const cong = sv.address().port;
  try {
    await assert.rejects(taiTrang(`http://127.0.0.1:${cong}/`), { code: 'EBLOCKED' });
    await assert.rejects(taiTrang(`http://localhost:${cong}/`), { code: 'EBLOCKED' });
    await assert.rejects(taiTrang(`http://[::ffff:127.0.0.1]:${cong}/`), { code: 'EBLOCKED' });
    assert.strictEqual(soLanBiGoi, 0);
  } finally {
    sv.close();
  }
});

test('taiTrang tu choi scheme khong phai http/https', async () => {
  await assert.rejects(taiTrang('file:///etc/passwd'), /http và https/);
});

test('chan dia chi noi bo ke ca cac dang viet IPv6 lach luat', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '169.254.169.254', '192.168.0.9', '100.64.0.1',
    '0.0.0.0', '198.18.0.1', '::1', '::', 'fd00::1', 'fe80::1',
    '::ffff:127.0.0.1', '::ffff:7f00:1', '64:ff9b::7f00:1']) {
    assert.ok(isBlockedAddress(ip), ip + ' phai bi chan');
  }
});

test('khong chan dia chi cong khai', () => {
  for (const ip of ['8.8.8.8', '104.16.0.1', '2606:4700::6810:84e5']) {
    assert.ok(!isBlockedAddress(ip), ip + ' khong duoc chan');
  }
});

test('tra cuu DNS ra dia chi noi bo thi bao loi ngay luc ket noi', async () => {
  // localhost luon phan giai ve 127.0.0.1 / ::1
  const loi = await new Promise(xong => traCuuAnToan('localhost', {}, err => xong(err)));
  assert.ok(loi, 'phai tu choi');
  assert.strictEqual(loi.code, 'EBLOCKED');
});

test('tra cuu che do all: mot dia chi noi bo la tu choi ca nhom', async () => {
  const loi = await new Promise(xong => traCuuAnToan('localhost', { all: true }, err => xong(err)));
  assert.strictEqual(loi && loi.code, 'EBLOCKED');
});

test('docGioiHan dung doc khi vuot gioi han, khong om het vao bo nho', async () => {
  let daDay = 0;
  const luong = new Readable({
    read() {
      daDay += 64 * 1024;
      this.push(Buffer.alloc(64 * 1024, 97));
      if (daDay >= 50 * 1024 * 1024) this.push(null);
    }
  });
  const buf = await docGioiHan(luong, 1024 * 1024);
  assert.ok(buf.length <= 1024 * 1024);
  assert.ok(daDay < 5 * 1024 * 1024, 'da doc ' + daDay + ' byte, qua nhieu');
  assert.ok(luong.destroyed);
});

test('trichVanBan bo script/style/nav va giu noi dung', () => {
  const html = '<title>X</title><nav>menu</nav><script>var a="<b>";</script><style>p{}</style>'
    + '<p>Tuyen &amp; dung <b>React</b></p><footer>f</footer>';
  assert.strictEqual(trichVanBan(html), 'X Tuyen & dung React');
});

test('trichVanBan chay tuyen tinh voi hang tram nghin the script khong dong', () => {
  const html = '<p>dau</p>' + '<script x'.repeat(200000);
  const bd = Date.now();
  const kq = trichVanBan(html);
  assert.ok(Date.now() - bd < 1000, 'mat ' + (Date.now() - bd) + 'ms');
  assert.strictEqual(kq, 'dau');
});
