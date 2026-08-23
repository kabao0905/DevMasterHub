const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal, docNguon } = require('./helper.js');

// Doi VFS tu hang so thanh bien nap duoc la cho de lam vo trang San co nhat.
// Bai kiem nay chay tron 6 thu thach CTF de chan hoi quy.
const LOI_GIAI_CTF = [
  ['ctf-1', ['cat /home/hacker/flag1.txt']],
  ['ctf-2', ['base64 -d /home/hacker/secret_b64.txt']],
  ['ctf-3', ['grep FLAG /var/log/auth.log']],
  ['ctf-4', ['nmap 192.168.1.100']],
  ['ctf-5', ['cat /var/www/html/config.php']],
  ['ctf-6', ['netstat -tuln', 'ps aux', 'cat /etc/.hidden/backdoor.conf']]
];

test('moi thu thach CTF deu lay duoc co bang lenh co that', () => {
  const T = napTerminal();
  const coTrongMa = [...docNguon('cyber-terminal.js').matchAll(/flag:\s*'([^']+)'/g)].map(m => m[1]);
  assert.ok(coTrongMa.length >= 6, 'phai co it nhat 6 thu thach, dang co ' + coTrongMa.length);

  for (const [id, lenhs] of LOI_GIAI_CTF) {
    const ra = lenhs.map(l => String(T.executeCommand(l) || '')).join('\n');
    const co = coTrongMa.find(c => ra.includes(c));
    assert.ok(co, `thu thach ${id}: chay ${lenhs.join(' ; ')} khong ra co nao`);
    assert.match(String(T.executeCommand('submit ' + co)), /CHÍNH XÁC/,
      `thu thach ${id}: nop co "${co}" bi tu choi`);
  }
});

test('khong co muc treo trong he thong tep San co', () => {
  const T = napTerminal();
  const duong = String(T.executeCommand('find /')).split('\n').filter(Boolean);
  const treo = duong.filter(d => {
    const a = String(T.executeCommand('cat ' + d));
    const b = String(T.executeCommand('cd ' + d));
    T.executeCommand('cd /');
    return a.includes('No such file') && b.includes('No such file');
  });
  assert.deepStrictEqual(treo, [], 'ls thay nhung cd/cat bao khong co');
});
