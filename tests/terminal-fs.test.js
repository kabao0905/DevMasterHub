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

// ── Task 2: nhom lenh ghi ──

test('mkdir -p tao ca cay thu muc', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('mkdir -p /var/www/site');
  assert.strictEqual(T.getFs()['/var/www/site'].type, 'dir');
  assert.strictEqual(T.getFs()['/var'].type, 'dir', 'phai tao ca thu muc cha');
  assert.ok(T.getFs()['/'].children.includes('var'), 'phai noi vao children cua cha');
  assert.ok(String(T.executeCommand('ls /var')).includes('www'));
});

test('echo ghi de vao tep', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('mkdir -p /var/www/site');
  T.executeCommand('echo "Xin chào" > /var/www/site/index.html');
  assert.match(String(T.executeCommand('cat /var/www/site/index.html')), /Xin chào/);
});

test('echo >> ghi noi them', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('echo "dong 1" > /tmp.txt');
  T.executeCommand('echo "dong 2" >> /tmp.txt');
  const ra = String(T.executeCommand('cat /tmp.txt'));
  assert.match(ra, /dong 1/);
  assert.match(ra, /dong 2/);
});

test('chuyen huong dung duoc cho moi lenh, khong rieng echo', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('ls /home/hacker > /ds.txt');
  assert.match(String(T.executeCommand('cat /ds.txt')), /ghichu\.txt/);
});

test('luuTuSoanThao ghi noi dung nhieu dong', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  const loi = T.luuTuSoanThao('/etc/thu.conf', 'dong mot\ndong hai\n');
  assert.strictEqual(loi, null);
  assert.match(String(T.executeCommand('cat /etc/thu.conf')), /dong hai/);
});

test('rm xoa tep va go khoi children cua cha', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('rm /home/hacker/ghichu.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/ghichu.txt')), /No such file/);
  assert.ok(!String(T.executeCommand('ls /home/hacker')).includes('ghichu.txt'),
    'ls van con thay tep da xoa');
});

test('cp va mv', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('cp /home/hacker/ghichu.txt /home/hacker/ban-sao.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/ban-sao.txt')), /noi dung cua lab thu/);
  T.executeCommand('mv /home/hacker/ban-sao.txt /home/hacker/doi-ten.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/doi-ten.txt')), /noi dung cua lab thu/);
  assert.match(String(T.executeCommand('cat /home/hacker/ban-sao.txt')), /No such file/);
});

test('moi lenh ghi deu co trong bang COMMANDS', () => {
  const T = napTerminal();
  const ten = T.commandNames();
  for (const c of ['echo', 'nano', 'mkdir', 'rm', 'cp', 'mv']) {
    assert.ok(ten.includes(c), 'thieu ' + c + ' trong bang COMMANDS');
    assert.ok(!String(T.executeCommand(c)).includes('command not found'),
      c + ' quang cao nhung khong co ban cai');
  }
});
