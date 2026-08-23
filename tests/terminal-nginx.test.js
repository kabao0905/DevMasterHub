const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal } = require('./helper.js');

const CONF_DUNG = [
  'events { worker_connections 1024; }',
  'http {',
  '    server {',
  '        listen 80;',
  '        server_name localhost;',
  '        root /usr/share/nginx/html;',
  '        index index.html;',
  '    }',
  '}'
].join('\n');

function labNginx() {
  return {
    '/': { type: 'dir', children: ['etc', 'usr', 'var', 'home'] },
    '/home': { type: 'dir', children: ['hacker'] },
    '/home/hacker': { type: 'dir', children: [] },
    '/etc': { type: 'dir', children: ['nginx'] },
    '/etc/nginx': { type: 'dir', children: ['nginx.conf'] },
    '/etc/nginx/nginx.conf': { type: 'file', content: CONF_DUNG },
    '/usr': { type: 'dir', children: ['share'] },
    '/usr/share': { type: 'dir', children: ['nginx'] },
    '/usr/share/nginx': { type: 'dir', children: ['html'] },
    '/usr/share/nginx/html': { type: 'dir', children: ['index.html'] },
    '/usr/share/nginx/html/index.html': { type: 'file', content: '<h1>Welcome to nginx!</h1>' },
    '/var': { type: 'dir', children: [] }
  };
}

test('nginx -t bao dat khi cu phap dung', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('nginx -t')), /syntax is ok/);
});

test('nginx -t bao loi khi thieu dau ngoac dong', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80;\n');
  const ra = String(T.executeCommand('nginx -t'));
  assert.match(ra, /failed/);
  assert.match(ra, /ngoặc/, 'phai noi ro loi thieu dau ngoac');
});

test('nginx -t bao loi khi thieu dau cham phay', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80\n  }\n}');
  const ra = String(T.executeCommand('nginx -t'));
  assert.match(ra, /failed/);
  assert.match(ra, /dòng 3/, 'phai chi ra dung so dong');
});

test('curl tra ve trang o thu muc root dang cau hinh', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('curl localhost')), /Welcome to nginx/);
});

test('curl doi theo khi root doi — day la vong lap hoc', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.executeCommand('mkdir -p /var/www/site');
  T.executeCommand('echo "<h1>Trang cua toi</h1>" > /var/www/site/index.html');
  T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/www/site'));
  const ra = String(T.executeCommand('curl localhost'));
  assert.match(ra, /Trang cua toi/);
  assert.ok(!ra.includes('Welcome to nginx'), 'van con tra ve trang cu');
});

test('curl tra 404 khi thu muc root khong co index.html', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/trong'));
  assert.match(String(T.executeCommand('curl localhost')), /404/);
});

test('curl tra 502 khi cau hinh sai cu phap', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server { listen 80;');
  assert.match(String(T.executeCommand('curl localhost')), /502/);
});

test('systemctl status bao dang chay', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('systemctl status nginx')), /active \(running\)/);
});

test('systemctl reload tu choi khi cu phap sai', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server {');
  assert.match(String(T.executeCommand('systemctl reload nginx')), /Job for nginx.service failed/);
});

test('nginx va systemctl deu co trong bang COMMANDS', () => {
  const T = napTerminal();
  for (const c of ['nginx', 'systemctl']) {
    assert.ok(T.commandNames().includes(c), 'thieu ' + c);
  }
});
