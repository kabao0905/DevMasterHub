// curl cua terminal gia lap + cac web server tren mang ao, cho khop voi ps / netstat / nmap:
//  - may nay (localhost): Nginx neu co /etc/nginx/nginx.conf (lab Nginx), khong thi Apache + PHP phuc vu /var/www/html
//  - may muc tieu 192.168.1.100: Apache cong 80, API gateway cong 8080
// Giong curl that: mac dinh chi in than trang; -I chi header (HEAD); -i ca hai; -v hien request/response.
import type { HamDich } from './terminal-ban-dich';

export type MoiTruongWeb = {
  /** Noi dung tep theo duong dan tuyet doi; null neu khong co hoac la thu muc */
  docTep: (duong: string) => string | null;
  /** Trang thai Nginx tren may nay; coCauHinh = false thi may chay Apache */
  nginx: () => { coCauHinh: boolean; dat: boolean; root: string | null };
  t: HamDich;
};

type PhanHoi = { ma: number; header: [string, string][]; than: string };

// Token debug quen tat tren server that — bai "Phan tich HTTP voi cURL" yeu cau tim co nay trong header
export const CO_HEADER_HTTP = 'FLAG{devmaster_http_header_leak}';
const MAY_NAY = new Set(['localhost', '127.0.0.1', '0.0.0.0', 'devmaster-cyber-box', '192.168.1.50']);
const MAY_MUC_TIEU = new Set(['192.168.1.100', 'target-bank-api.local']);
// Cong web dang mo (khop netstat / nmap): 80 va 8080
const CONG_WEB = [80, 8080];
const TEN_MA: Record<number, string> = { 200: 'OK', 404: 'Not Found', 405: 'Method Not Allowed', 502: 'Bad Gateway' };
const DOC_ROOT_APACHE = '/var/www/html';
const APACHE = 'Apache/2.4.58 (Ubuntu)';
const BYTE = new TextEncoder();

const chuanHoa = (p: string) =>
  '/' + p.split('/').filter(s => s && s !== '.').reduce<string[]>((ds, s) => (s === '..' ? ds.slice(0, -1) : [...ds, s]), []).join('/');

/** PHP chay tren server: chu ngoai <?php ?> giu nguyen, ben trong chi lay cac chuoi echo — ma nguon khong lo ra */
function chayPhp(nguon: string): string {
  return nguon.split(/<\?php([\s\S]*?)(?:\?>|$)/).map((phan, i) => {
    if (i % 2 === 0) return phan;
    return [...phan.matchAll(/echo\s+(["'])((?:\\.|(?!\1).)*)\1\s*;/g)].map(m => m[2]).join('');
  }).join('').replace(/^\s+/, '');
}

function trangLoi(ma: number, diaChi: string): PhanHoi {
  const ten = TEN_MA[ma] ?? '';
  const than = `<!DOCTYPE html>\n<html><head><title>${ma} ${ten}</title></head>\n<body><h1>${ten}</h1>\n<p>The requested URL was not found on this server.</p>\n<hr><address>${diaChi}</address>\n</body></html>`;
  return { ma, header: [['Server', APACHE], ['Content-Type', 'text/html; charset=iso-8859-1']], than };
}

function apacheMayNay(duongUrl: string, mt: MoiTruongWeb): PhanHoi {
  const goc = chuanHoa(DOC_ROOT_APACHE + duongUrl);
  const ungVien = duongUrl.endsWith('/') ? [goc + '/index.html', goc + '/index.php'] : [goc];
  for (const p of ungVien) {
    const noiDung = mt.docTep(chuanHoa(p));
    if (noiDung === null) continue;
    if (!p.endsWith('.php')) return { ma: 200, header: [['Server', APACHE], ['Content-Type', 'text/html; charset=UTF-8']], than: noiDung };
    return {
      ma: 200,
      header: [['Server', APACHE], ['X-Powered-By', 'PHP/8.1.2'], ['X-Debug-Token', CO_HEADER_HTTP], ['Content-Type', 'text/html; charset=UTF-8']],
      than: chayPhp(noiDung)
    };
  }
  return trangLoi(404, `${APACHE} Server at localhost Port 80`);
}

function nginxMayNay(duongUrl: string, mt: MoiTruongWeb): PhanHoi {
  const SERVER = 'nginx/1.24.0';
  const ng = mt.nginx();
  const loi502 = (goiY: string): PhanHoi => ({ ma: 502, header: [['Server', SERVER], ['Content-Type', 'text/html']], than: `<h1>502 Bad Gateway</h1>\n${goiY}` });
  if (!ng.dat) return loi502(mt.t('nginx.loi'));
  if (!ng.root) return loi502(mt.t('nginx.khongRoot', { tep: '/etc/nginx/nginx.conf' }));
  const duongTep = duongUrl === '/' ? ng.root + '/index.html' : ng.root + duongUrl;
  const noiDung = mt.docTep(chuanHoa(duongTep));
  if (noiDung === null) {
    return { ma: 404, header: [['Server', SERVER], ['Content-Type', 'text/html']], than: `<h1>404 Not Found</h1>\n${mt.t('nginx.khongCo', { tep: duongTep })}` };
  }
  return { ma: 200, header: [['Server', SERVER], ['Content-Type', 'text/html']], than: noiDung };
}

function mayMucTieu(cong: number, duongUrl: string): PhanHoi {
  if (cong === 8080) {
    const than = duongUrl === '/'
      ? '{"service":"DevMaster-API-Gateway","version":"1.4.2","endpoints":["/api/health","/api/login"]}'
      : duongUrl === '/api/health' ? '{"status":"ok"}' : '{"error":"not found"}';
    return { ma: than.includes('error') ? 404 : 200, header: [['Server', 'DevMaster-API-Gateway'], ['Content-Type', 'application/json']], than };
  }
  if (duongUrl !== '/') return trangLoi(404, `${APACHE} Server at 192.168.1.100 Port 80`);
  return { ma: 200, header: [['Server', APACHE], ['Content-Type', 'text/html']], than: '<html><body><h1>It works!</h1><p>Apache2 Ubuntu Default Page</p></body></html>' };
}

type TuyChon = { chiHeader: boolean; kemHeader: boolean; chiTiet: boolean; phuongThuc: string; url: string | null };

function tachTuyChon(args: string[]): TuyChon {
  const tc: TuyChon = { chiHeader: false, kemHeader: false, chiTiet: false, phuongThuc: 'GET', url: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--head') tc.chiHeader = true;
    else if (a === '--include') tc.kemHeader = true;
    else if (a === '--verbose') tc.chiTiet = true;
    else if (a === '-X' || a === '--request') tc.phuongThuc = (args[++i] || 'GET').toUpperCase();
    else if (['-d', '--data', '--data-raw'].includes(a)) { i++; if (tc.phuongThuc === 'GET') tc.phuongThuc = 'POST'; }
    else if (['-H', '--header', '-A', '--user-agent', '-o', '--output', '-u', '--user', '-b', '--cookie'].includes(a)) i++;
    else if (/^-[a-zA-Z]+$/.test(a)) {
      // co gop: -sI, -si, -sv, -Lk ... (s, L, k khong doi ket qua o day)
      if (a.includes('I')) tc.chiHeader = true;
      if (a.includes('i')) tc.kemHeader = true;
      if (a.includes('v')) tc.chiTiet = true;
    } else if (!a.startsWith('-') && tc.url === null) tc.url = a;
  }
  return tc;
}

/** Chay curl; tra ve chu in ra man hinh. Loi ket noi in dang "curl: (N) ..." nhu curl that */
export function chayCurl(args: string[], mt: MoiTruongWeb): string {
  const tc = tachTuyChon(args);
  if (!tc.url) return "curl: no URL specified!\ncurl: try 'curl --help' for more information";

  const m = tc.url.match(/^(?:(https?):\/\/)?([^/:?#]+)(?::(\d+))?([^?#]*)/i);
  if (!m) return 'curl: (3) URL rejected: Malformed input to a URL function';
  const may = m[2].toLowerCase();
  const cong = m[3] ? Number(m[3]) : (m[1] || '').toLowerCase() === 'https' ? 443 : 80;
  const duongUrl = m[4] || '/';
  const laMayNay = MAY_NAY.has(may);
  if (!laMayNay && !MAY_MUC_TIEU.has(may)) return `curl: (6) Could not resolve host: ${may}`;
  if (!CONG_WEB.includes(cong)) return `curl: (7) Failed to connect to ${may} port ${cong} after 0 ms: Couldn't connect to server`;

  let ph: PhanHoi;
  if (!laMayNay) ph = mayMucTieu(cong, duongUrl);
  else ph = mt.nginx().coCauHinh ? nginxMayNay(duongUrl, mt) : apacheMayNay(duongUrl, mt);
  if (laMayNay && ph.ma === 200 && !['GET', 'HEAD'].includes(tc.phuongThuc)) {
    ph = { ...trangLoi(405, `${APACHE} Server at localhost Port 80`), than: '<h1>405 Method Not Allowed</h1>' };
  }

  const header = [`HTTP/1.1 ${ph.ma} ${TEN_MA[ph.ma] ?? ''}`.trim(), `Date: ${new Date().toUTCString()}`,
    ...ph.header.map(([k, v]) => `${k}: ${v}`), `Content-Length: ${BYTE.encode(ph.than).length}`];
  const than = tc.chiHeader ? '' : ph.than;
  if (tc.chiTiet) {
    const ip = laMayNay ? (may === '192.168.1.50' ? may : '127.0.0.1') : '192.168.1.100';
    const yeuCau = [`*   Trying ${ip}:${cong}...`, `* Connected to ${may} (${ip}) port ${cong}`,
      `> ${tc.chiHeader ? 'HEAD' : tc.phuongThuc} ${duongUrl} HTTP/1.1`, `> Host: ${may}${m[3] ? ':' + cong : ''}`,
      '> User-Agent: curl/8.5.0', '> Accept: */*', '>'];
    return [...yeuCau, ...header.map(h => '< ' + h), '<', than].join('\n').replace(/\n+$/, '');
  }
  if (tc.chiHeader) return header.join('\n');
  if (tc.kemHeader) return header.join('\n') + '\n\n' + than;
  return than;
}
