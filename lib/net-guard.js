// Tai trang web cho /api/crawl ma khong mo cua SSRF.
//
// Ban cu kiem dns.lookup roi de fetch tu phan giai lai lan nua: ten mien doi dap an
// giua hai lan (DNS rebinding) la lot vao mang noi bo. O day dia chi duoc kiem
// NGAY trong ham lookup ma socket dung de ket noi, nen khong con khe ho do.
const net = require('node:net');
const dns = require('node:dns');
const http = require('node:http');
const https = require('node:https');
const zlib = require('node:zlib');

const CHAN = new net.BlockList();
for (const [diaChi, doDai] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16],
  ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15],
  ['198.51.100.0', 24], ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4]
]) CHAN.addSubnet(diaChi, doDai, 'ipv4');
for (const [diaChi, doDai] of [
  ['::', 128], ['::1', 128], ['100::', 64], ['64:ff9b::', 96], ['64:ff9b:1::', 48],
  ['2001:db8::', 32], ['fc00::', 7], ['fe80::', 10], ['ff00::', 8]
]) CHAN.addSubnet(diaChi, doDai, 'ipv6');

/** BlockList hieu ca dang IPv4 nhung trong IPv6 (::ffff:7f00:1) */
function isBlockedAddress(ip) {
  const loai = net.isIPv4(ip) ? 'ipv4' : net.isIPv6(ip) ? 'ipv6' : null;
  if (!loai) return true;
  return CHAN.check(ip, loai);
}

function coMa(thongBao, ma) {
  const e = new Error(thongBao);
  e.code = ma;
  return e;
}

const loiChan = () => coMa('Không được phép truy cập địa chỉ nội bộ', 'EBLOCKED');

/**
 * Dung lam option `lookup` cua http.get. Node goi ham nay ngay truoc khi mo socket,
 * co luc kem { all: true } (autoSelectFamily) va khi do doi mot mang dia chi.
 * Chi can mot dia chi noi bo la tu choi ca nhom.
 */
function traCuuAnToan(tenMien, tuyChon, goiLai) {
  if (typeof tuyChon === 'function') { goiLai = tuyChon; tuyChon = {}; }
  const opt = typeof tuyChon === 'number' ? { family: tuyChon } : (tuyChon || {});
  dns.lookup(tenMien, { ...opt, all: true }, (loi, ds) => {
    if (loi) return goiLai(loi);
    if (!ds.length || ds.some(d => isBlockedAddress(d.address))) return goiLai(loiChan());
    if (opt.all) return goiLai(null, ds);
    goiLai(null, ds[0].address, ds[0].family);
  });
}

/** Doc luong toi da `toiDa` byte roi cat — khong om ca phan hoi vai GB vao RAM */
function docGioiHan(luong, toiDa) {
  return new Promise((xong, hong) => {
    const manh = [];
    let co = 0;
    let daXong = false;
    const ketThuc = () => {
      if (daXong) return;
      daXong = true;
      xong(Buffer.concat(manh, co));
    };
    luong.on('data', c => {
      if (daXong) return;
      const conLai = toiDa - co;
      if (c.length >= conLai) {
        manh.push(c.subarray(0, conLai));
        co = toiDa;
        ketThuc();
        luong.destroy();
        return;
      }
      manh.push(c);
      co += c.length;
    });
    luong.on('end', ketThuc);
    luong.on('close', ketThuc);
    luong.on('error', e => {
      if (daXong) return;
      daXong = true;
      hong(e);
    });
  });
}

function giaiNen(res) {
  const ma = String(res.headers['content-encoding'] || '').toLowerCase();
  if (ma === 'gzip' || ma === 'x-gzip') return res.pipe(zlib.createGunzip());
  if (ma === 'deflate') return res.pipe(zlib.createInflate());
  if (ma === 'br') return res.pipe(zlib.createBrotliDecompress());
  return res;
}

/**
 * GET mot trang, khong theo chuyen huong (3xx tra ve cho ben goi xu ly).
 * @returns {Promise<{ status: number, headers: object, body: string }>}
 *          body chi co khi 2xx; cac ma khac tra body rong de khong doc thua.
 */
function taiTrang(diaChi, { toiDa = 2_000_000, thoiGian = 9000, headers = {} } = {}) {
  let u;
  try { u = new URL(diaChi); } catch { return Promise.reject(coMa('URL không hợp lệ', 'EINVALIDURL')); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return Promise.reject(coMa('Chỉ hỗ trợ http và https', 'EPROTOCOL'));

  // Host la IP viet san thi Node khong goi lookup, phai kiem truoc
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (net.isIP(host) && isBlockedAddress(host)) return Promise.reject(loiChan());

  const goi = u.protocol === 'https:' ? https : http;
  return new Promise((xong, hong) => {
    const req = goi.get(u, {
      headers: { 'accept-encoding': 'gzip, deflate, br', ...headers },
      lookup: traCuuAnToan
    }, res => {
      const status = res.statusCode || 0;
      if (status < 200 || status >= 300) {
        res.destroy();
        clearTimeout(henGio);
        return xong({ status, headers: res.headers, body: '' });
      }
      docGioiHan(giaiNen(res), toiDa).then(buf => {
        clearTimeout(henGio);
        req.destroy();
        xong({ status, headers: res.headers, body: buf.toString('utf8') });
      }, e => { clearTimeout(henGio); hong(e); });
    });
    // timeout cua http chi tinh luc socket im lang; can them gioi han tong thoi gian
    const henGio = setTimeout(() => req.destroy(new Error('Hết thời gian chờ trang phản hồi')), thoiGian);
    req.on('error', e => { clearTimeout(henGio); hong(e); });
  });
}

/**
 * Nhu taiTrang nhung theo chuyen huong (http -> https, link rut gon, link tracking cua trang viec lam).
 * Moi buoc deu qua `tai` (mac dinh taiTrang) nen dia chi moi van bi kiem chan mang noi bo.
 * @returns {Promise<{ status: number, headers: object, body: string, url: string }>}
 */
async function taiTheoChuyenHuong(diaChi, tuyChon = {}, { soLan = 3, tai = taiTrang } = {}) {
  let url = diaChi;
  for (let lan = 0; lan <= soLan; lan++) {
    const r = await tai(url, tuyChon);
    const den = r.headers && r.headers.location;
    if (r.status < 300 || r.status >= 400 || !den) return { ...r, url };
    try { url = new URL(den, url).href; } catch { throw coMa('Địa chỉ chuyển hướng không hợp lệ', 'EINVALIDURL'); }
  }
  throw coMa('Trang chuyển hướng quá nhiều lần', 'EREDIRECT');
}

/** Cat bo moi khoi <ten>...</ten>. Duyet tien mot chieu nen tuyen tinh theo do dai. */
function boKhoi(html, ten) {
  const mo = new RegExp('<' + ten + '\\b', 'gi');
  const dong = new RegExp('</' + ten + '\\s*>', 'gi');
  let ra = '';
  let vt = 0;
  while (vt < html.length) {
    mo.lastIndex = vt;
    const m = mo.exec(html);
    if (!m) { ra += html.slice(vt); break; }
    ra += html.slice(vt, m.index);
    dong.lastIndex = m.index;
    const d = dong.exec(html);
    // Khong co the dong: phan con lai deu nam trong khoi, bo het va dung
    if (!d) break;
    vt = d.index + d[0].length;
  }
  return ra;
}

/** Lay noi dung the <title>, khong co thi tra ve '' */
function layTieuDe(html) {
  const m = /<title\b/i.exec(html);
  if (!m) return '';
  const batDau = html.indexOf('>', m.index);
  if (batDau === -1) return '';
  const dong = /<\/title\s*>/gi;
  dong.lastIndex = batDau;
  const d = dong.exec(html);
  return html.slice(batDau + 1, d ? d.index : batDau + 1).replace(/\s+/g, ' ').trim();
}

/** HTML -> van ban thuan cho AI doc. Moi buoc deu tuyen tinh de khong bi ReDoS. */
function trichVanBan(html) {
  let s = String(html || '');
  for (const ten of ['script', 'style', 'svg', 'nav', 'footer', 'header']) s = boKhoi(s, ten);
  return s
    .replace(/<[^<>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { isBlockedAddress, traCuuAnToan, docGioiHan, taiTrang, taiTheoChuyenHuong, trichVanBan, layTieuDe };
