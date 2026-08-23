const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal } = require('./helper.js');

const FS_THU = {
  '/': { type: 'dir', children: ['home', 'etc'] },
  '/home': { type: 'dir', children: ['hacker'] },
  '/home/hacker': { type: 'dir', children: ['ghichu.txt'] },
  '/home/hacker/ghichu.txt': { type: 'file', content: 'noi dung cua lab thu' },
  '/etc': { type: 'dir', children: [] }
};

test('loadFs thay toan bo he thong tep', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  assert.match(String(T.executeCommand('cat /home/hacker/ghichu.txt')), /noi dung cua lab thu/);
  // Tep cua bo San co phai bien mat
  assert.match(String(T.executeCommand('cat /home/hacker/flag1.txt')), /No such file/);
});

test('loadFs dat lai thu muc hien tai ve /home/hacker', () => {
  const T = napTerminal();
  T.executeCommand('cd /etc');
  T.loadFs(FS_THU);
  assert.strictEqual(String(T.executeCommand('pwd')).trim(), '/home/hacker');
});

test('resetFs tra ve bo San co', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.resetFs();
  assert.match(String(T.executeCommand('cat /home/hacker/flag1.txt')), /FLAG\{/);
});

test('lab khong lam ban du lieu goc — phai la ban sao sau', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.getFs()['/home/hacker/ghichu.txt'].content = 'da bi sua';
  assert.strictEqual(FS_THU['/home/hacker/ghichu.txt'].content, 'noi dung cua lab thu',
    'loadFs phai sao chep sau, khong duoc dung chung tham chieu');
});

test('getFs tra ve he thong tep dang dung', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  assert.ok(T.getFs()['/home/hacker/ghichu.txt'], 'getFs phai thay tep cua lab');
});
