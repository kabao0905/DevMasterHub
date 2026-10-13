// Chuyen tu tests/terminal-fs, terminal-lenh, terminal-nginx, ctf-khong-hoi-quy (app cu).
import { createTerminal, CHALLENGES, type HeThongTep } from './terminal';
import NGUON from './terminal.ts?raw';
import { LENH_VAN_BAN } from './terminal-van-ban';
import { LENH_MA_HOA } from './terminal-ma-hoa';
import { LENH_HE_THONG } from './terminal-he-thong';

const FS_THU: HeThongTep = {
  '/': { type: 'dir', children: ['home', 'etc'] },
  '/home': { type: 'dir', children: ['hacker'] },
  '/home/hacker': { type: 'dir', children: ['ghichu.txt'] },
  '/home/hacker/ghichu.txt': { type: 'file', content: 'noi dung cua lab thu' },
  '/etc': { type: 'dir', children: [] }
};

describe('he thong tep', () => {
  test('loadFs thay toan bo he thong tep', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    expect(T.executeCommand('cat /home/hacker/ghichu.txt')).toMatch(/noi dung cua lab thu/);
    expect(T.executeCommand('cat /home/hacker/flag1.txt')).toMatch(/No such file/);
  });

  test('loadFs dat lai thu muc hien tai ve /home/hacker', () => {
    const T = createTerminal();
    T.executeCommand('cd /etc');
    T.loadFs(FS_THU);
    expect(T.executeCommand('pwd').trim()).toBe('/home/hacker');
  });

  test('resetFs tra ve bo San co', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    T.resetFs();
    expect(T.executeCommand('cat /home/hacker/flag1.txt')).toMatch(/FLAG\{/);
  });

  test('lab khong lam ban du lieu goc — phai la ban sao sau', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    (T.getFs()['/home/hacker/ghichu.txt'] as { content: string }).content = 'da bi sua';
    expect((FS_THU['/home/hacker/ghichu.txt'] as { content: string }).content).toBe('noi dung cua lab thu');
  });

  test('mkdir -p tao ca cay thu muc', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    T.executeCommand('mkdir -p /var/www/site');
    expect(T.getFs()['/var/www/site'].type).toBe('dir');
    expect(T.getFs()['/var'].type).toBe('dir');
    expect((T.getFs()['/'] as { children: string[] }).children).toContain('var');
    expect(T.executeCommand('ls /var')).toContain('www');
  });

  test('echo > ghi de, >> noi them; chuyen huong dung duoc cho moi lenh', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    T.executeCommand('mkdir -p /var/www/site');
    T.executeCommand('echo "Xin chào" > /var/www/site/index.html');
    expect(T.executeCommand('cat /var/www/site/index.html')).toMatch(/Xin chào/);
    T.executeCommand('echo "dong 1" > /tmp.txt');
    T.executeCommand('echo "dong 2" >> /tmp.txt');
    expect(T.executeCommand('cat /tmp.txt')).toMatch(/dong 1[\s\S]*dong 2/);
    T.executeCommand('ls /home/hacker > /ds.txt');
    expect(T.executeCommand('cat /ds.txt')).toMatch(/ghichu\.txt/);
  });

  test('luuTuSoanThao ghi noi dung nhieu dong', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    expect(T.luuTuSoanThao('/etc/thu.conf', 'dong mot\ndong hai\n')).toBeNull();
    expect(T.executeCommand('cat /etc/thu.conf')).toMatch(/dong hai/);
  });

  test('rm, cp, mv', () => {
    const T = createTerminal();
    T.loadFs(FS_THU);
    T.executeCommand('cp /home/hacker/ghichu.txt /home/hacker/ban-sao.txt');
    expect(T.executeCommand('cat /home/hacker/ban-sao.txt')).toMatch(/noi dung cua lab thu/);
    T.executeCommand('mv /home/hacker/ban-sao.txt /home/hacker/doi-ten.txt');
    expect(T.executeCommand('cat /home/hacker/doi-ten.txt')).toMatch(/noi dung cua lab thu/);
    expect(T.executeCommand('cat /home/hacker/ban-sao.txt')).toMatch(/No such file/);
    T.executeCommand('rm /home/hacker/ghichu.txt');
    expect(T.executeCommand('ls /home/hacker')).not.toContain('ghichu.txt');
  });

  test('hai terminal doc lap: lab nap bo tep rieng, terminal kia van la bo San co va giu viec dang lam', () => {
    const baiHoc = createTerminal();
    const lab = createTerminal();
    baiHoc.executeCommand('mkdir /home/hacker/viec');
    lab.loadFs(FS_THU);
    expect(baiHoc.executeCommand('cat /home/hacker/flag1.txt')).toMatch(/FLAG\{/);
    expect(baiHoc.executeCommand('ls /home/hacker/viec')).not.toMatch(/No such file/);
    expect(lab.executeCommand('cat /home/hacker/ghichu.txt')).toMatch(/noi dung cua lab thu/);
    expect(lab.executeCommand('cat /home/hacker/flag1.txt')).toMatch(/No such file/);
  });
});

describe('bang lenh la nguon duy nhat', () => {
  // Lenh can he thong tep la case trong terminal.ts; lenh thuan nam trong cac module terminal-*.ts
  const nhanCase = () => [
    ...[...NGUON.matchAll(/^\s*case '([a-z0-9_]+)':/gm)].map(m => m[1]),
    ...Object.keys({ ...LENH_VAN_BAN, ...LENH_MA_HOA, ...LENH_HE_THONG })
  ];

  test('moi lenh quang cao deu co ban cai, moi ban cai deu duoc khai bao', () => {
    const T = createTerminal();
    expect(T.commandNames().filter(c => !nhanCase().includes(c))).toEqual([]);
    expect(nhanCase().filter(c => !T.commandNames().includes(c))).toEqual([]);
  });

  test('khong lenh nao roi vao command not found; help liet ke du', () => {
    const T = createTerminal();
    expect(T.commandNames().filter(c => T.executeCommand(c).includes('command not found'))).toEqual([]);
    const troGiup = T.executeCommand('help');
    expect(T.commandNames().filter(c => !troGiup.includes(c))).toEqual([]);
  });

  test('cac lenh dieu tra co san van chay duoc', () => {
    const T = createTerminal();
    expect(T.executeCommand('ps aux')).toMatch(/PID/);
    expect(T.executeCommand('netstat -tuln')).toMatch(/LISTEN/);
    expect(T.executeCommand('find /home')).toMatch(/\/home\/hacker/);
    expect(T.executeCommand('nmap 192.168.1.100')).toMatch(/PORT/);
  });

  test('clear va nano bao ra ngoai qua callback, khong cham DOM', () => {
    const xoa = vi.fn();
    const soan = vi.fn();
    const T = createTerminal({ xoaManHinh: xoa, moSoanThao: soan });
    T.loadFs(FS_THU);
    T.executeCommand('clear');
    T.executeCommand('nano /home/hacker/ghichu.txt');
    expect(xoa).toHaveBeenCalledTimes(1);
    expect(soan).toHaveBeenCalledWith('/home/hacker/ghichu.txt', 'noi dung cua lab thu');
  });
});

const CONF_DUNG = ['events { worker_connections 1024; }', 'http {', '    server {', '        listen 80;', '        server_name localhost;',
  '        root /usr/share/nginx/html;', '        index index.html;', '    }', '}'].join('\n');
const labNginx = (): HeThongTep => ({
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
});

describe('nginx', () => {
  test('nginx -t: dung thi ok; thieu ngoac, thieu ; thi chi dung dong', () => {
    const T = createTerminal();
    T.loadFs(labNginx());
    expect(T.executeCommand('nginx -t')).toMatch(/syntax is ok/);
    T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80;\n');
    expect(T.executeCommand('nginx -t')).toMatch(/failed[\s\S]*ngoặc|ngoặc[\s\S]*failed/);
    T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80\n  }\n}');
    expect(T.executeCommand('nginx -t')).toMatch(/dòng 3/);
  });

  test('curl theo root dang cau hinh; 404 khi khong co index; 502 khi sai cu phap', () => {
    const T = createTerminal();
    T.loadFs(labNginx());
    expect(T.executeCommand('curl localhost')).toMatch(/Welcome to nginx/);
    T.executeCommand('mkdir -p /var/www/site');
    T.executeCommand('echo "<h1>Trang cua toi</h1>" > /var/www/site/index.html');
    T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/www/site'));
    expect(T.executeCommand('curl localhost')).toMatch(/Trang cua toi/);
    T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/trong'));
    expect(T.executeCommand('curl localhost')).toMatch(/404/);
    T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server { listen 80;');
    expect(T.executeCommand('curl localhost')).toMatch(/502/);
  });

  test('systemctl status/reload', () => {
    const T = createTerminal();
    T.loadFs(labNginx());
    expect(T.executeCommand('systemctl status nginx')).toMatch(/active \(running\)/);
    T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server {');
    expect(T.executeCommand('systemctl reload nginx')).toMatch(/Job for nginx.service failed/);
  });
});

// Bai "Phan tich HTTP voi cURL": may mac dinh khong co Nginx — Apache (dung nhu ps/netstat) phuc vu /var/www/html.
// Truoc day curl chi biet Nginx nen bai nay luc nao cung 502 Bad Gateway.
describe('curl tren may mac dinh (Apache) giong curl that', () => {
  test('mac dinh chi in than trang; -I chi in header; -i ca hai; header lo co bi mat', () => {
    const T = createTerminal();
    const than = T.executeCommand('curl http://localhost');
    expect(than).toMatch(/DevMaster Target Portal/);
    expect(than).not.toMatch(/Bad Gateway|HTTP\/1\.1/);
    const dau = T.executeCommand('curl -I http://localhost');
    expect(dau).toMatch(/^HTTP\/1\.1 200 OK/);
    expect(dau).toMatch(/Server: Apache\/2\.4\.58/);
    expect(dau).toMatch(/X-Powered-By: PHP/);
    expect(dau).toMatch(/FLAG\{[^}]+\}/);
    expect(dau).not.toMatch(/<h1>/);
    const caHai = T.executeCommand('curl -i localhost');
    expect(caHai).toMatch(/HTTP\/1\.1 200 OK[\s\S]*\n\n[\s\S]*DevMaster Target Portal/);
    expect(T.executeCommand('curl -s -I localhost | grep -i powered')).toBe('X-Powered-By: PHP/8.1.2');
  });

  test('-v hien request va response; trang khong co la 404; PHP chay tren server nen khong lo ma nguon', () => {
    const T = createTerminal();
    expect(T.executeCommand('curl -v http://localhost/')).toMatch(/> GET \/ HTTP\/1\.1[\s\S]*< HTTP\/1\.1 200 OK/);
    expect(T.executeCommand('curl -I localhost/khong-co.html')).toMatch(/^HTTP\/1\.1 404 Not Found/);
    expect(T.executeCommand('curl localhost/khong-co.html')).toMatch(/404/);
    expect(T.executeCommand('curl localhost/config.php')).not.toMatch(/db_pass|<\?php/);
  });

  test('may la / cong dong / thieu URL bao loi nhu curl that', () => {
    const T = createTerminal();
    expect(T.executeCommand('curl http://khong-ton-tai.example')).toMatch(/curl: \(6\) Could not resolve host: khong-ton-tai\.example/);
    expect(T.executeCommand('curl localhost:9999')).toMatch(/curl: \(7\) Failed to connect to localhost port 9999/);
    expect(T.executeCommand('curl')).toMatch(/curl: no URL specified/);
    expect(T.executeCommand('curl localhost:9999 && echo SAU')).not.toContain('SAU');
  });
});

const LOI_GIAI_CTF: [string, string[]][] = [
  ['ctf-1', ['cat /home/hacker/flag1.txt']],
  ['ctf-2', ['base64 -d /home/hacker/secret_b64.txt']],
  ['ctf-3', ['grep FLAG /var/log/auth.log']],
  ['ctf-4', ['nmap 192.168.1.100']],
  ['ctf-5', ['cat /var/www/html/config.php']],
  ['ctf-6', ['netstat -tuln', 'ps aux', 'cat /etc/.hidden/backdoor.conf']],
  ['ctf-7', ['curl -I http://localhost']]
];

describe('CTF', () => {
  test('moi thu thach lay duoc co bang lenh co that; nop thi cong diem mot lan', () => {
    const doiDiem = vi.fn();
    const T = createTerminal({ doiDiem });
    const co = CHALLENGES.map(c => c.flag);
    expect(co.length).toBeGreaterThanOrEqual(6);
    for (const [id, lenhs] of LOI_GIAI_CTF) {
      const ra = lenhs.map(l => T.executeCommand(l)).join('\n');
      const tim = co.find(c => ra.includes(c));
      expect(tim, `thu thach ${id}`).toBeTruthy();
      expect(T.executeCommand('submit ' + tim)).toMatch(/CHÍNH XÁC/);
    }
    expect(T.diem()).toBe(CHALLENGES.reduce((s, c) => s + c.points, 0));
    expect(T.coDaGiai().size).toBe(CHALLENGES.length);
    expect(doiDiem).toHaveBeenCalledTimes(CHALLENGES.length);
    expect(T.checkFlag(CHALLENGES[0].flag)).toMatch(/đã được nộp/);
  });

  test('co cua may nay khong tinh cho may kia', () => {
    const a = createTerminal();
    const b = createTerminal();
    a.checkFlag(CHALLENGES[0].flag);
    expect(a.diem()).toBe(CHALLENGES[0].points);
    expect(b.diem()).toBe(0);
  });

  test('khong co muc treo trong he thong tep San co', () => {
    const T = createTerminal();
    const duong = T.executeCommand('find /').split('\n').filter(Boolean);
    const treo = duong.filter(d => {
      const a = T.executeCommand('cat ' + d);
      const b = T.executeCommand('cd ' + d);
      T.executeCommand('cd /');
      return a.includes('No such file') && b.includes('No such file');
    });
    expect(treo).toEqual([]);
  });
});
