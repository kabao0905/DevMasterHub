const giaiMa = s => s
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&');
const boThe = s => giaiMa(String(s).replace(/<[^<>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function layLink(html, goc) {
  const ra = [];
  const daCo = new Set();
  for (const m of String(html).matchAll(/<a\b[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi)) {
    let u;
    try { u = new URL(giaiMa(m[1] ?? m[2]), goc); } catch { continue; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
    u.hash = '';
    const url = u.href;
    if (daCo.has(url)) continue;
    daCo.add(url);
    const tieuDe = m[0].match(/\btitle\s*=\s*"([^"]*)"/i);
    ra.push({ url, text: boThe(m[3]) || (tieuDe ? boThe(tieuDe[1]) : ''), viTri: m.index });
  }
  return ra;
}

const LA_NAM = /^(199\d|20[0-3]\d)$/;
const coMa = doan => /[A-Za-z0-9]*\d[A-Za-z0-9]{4,}/.test(doan)
  || [...doan.matchAll(/(?:^|[-_.])(\d{3,})(?=$|[-_.])/g)].some(m => !LA_NAM.test(m[1]));
const doanCuoi = u => new URL(u).pathname.split('/').pop() || '';
const TU_VIEC = /viec|job|tuyen|career|position|vacanc|recruit|opening/i;
const BAI_VIET = /cam-nang|blog|tin-tuc|news|bai-viet|article|huong-dan|kinh-nghiem|cau-hoi|faq/i;

const khuon = u => {
  const p = new URL(u).pathname.split('/');
  const cuoi = p.pop() || '';
  const duoi = (cuoi.match(/\.[a-z]+$/i) || [''])[0];
  return `${p.join('/')}/*${duoi}`;
};

function nhomTinViec(links, urlTrang) {
  const host = new URL(urlTrang).host;
  const nhom = new Map();
  for (const l of links) {
    if (l.url === urlTrang || new URL(l.url).host !== host) continue;
    const k = khuon(l.url);
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push(l);
  }
  let tot = [];
  let diemTot = 0;
  for (const [k, ds] of nhom) {
    if (BAI_VIET.test(k)) continue;
    const tin = chiTinCoMa(ds);
    if (tin.length < 3) continue;
    const diem = tin.length * (1 + (TU_VIEC.test(k) ? 1 : 0));
    if (diem > diemTot) { diemTot = diem; tot = tin; }
  }
  return tot;
}

function chiTinCoMa(ds) {
  const theoDuongDan = new Map();
  for (const l of ds) {
    const p = new URL(l.url).pathname;
    if (coMa(doanCuoi(l.url)) && !theoDuongDan.has(p)) theoDuongDan.set(p, l);
  }
  return [...theoDuongDan.values()];
}

const tinTheoKhuon = (links, khuonTin) => chiTinCoMa(links.filter(l => khuon(l.url) === khuonTin));

function doanLoaiTrang(url, html) {
  const nhom = nhomTinViec(layLink(html, url), url);
  const laTrangTin = nhom.length > 0 && coMa(doanCuoi(url)) && khuon(nhom[0].url) === khuon(url);
  if (nhom.length >= 5 && !laTrangTin) return 'danh_sach';
  if (laTrangTin) return 'mot_tin';
  const cuoi = new URL(url).pathname.split('/').pop() || '';
  if (coMa(cuoi) || /"@type"\s*:\s*"JobPosting"/.test(html)) return 'mot_tin';
  return 'khac';
}

const KIEU_SO_TRANG = [/([?&](?:page|p|pg|trang)=)(\d+)/i, /(\/page\/)(\d+)/i, /(-trang-)(\d+)/i, /(\/trang-)(\d+)/i];

function thanhMau(url) {
  for (const re of KIEU_SO_TRANG) {
    if (re.test(url)) return url.replace(re, '$1{n}');
  }
  return null;
}

function mauTrangSau(url, links) {
  const sach = url.replace(/#.*$/, '');
  const coSan = thanhMau(sach);
  if (coSan) return [coSan];
  const host = new URL(sach).host;
  const dem = new Map();
  for (const l of links) {
    if (new URL(l.url).host !== host) continue;
    const mau = thanhMau(l.url);
    if (mau) dem.set(mau, (dem.get(mau) || 0) + 1);
  }
  if (dem.size) return [...dem.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m);
  const u = new URL(sach);
  const doan = [];
  if (/-(vi|en)\.html$/i.test(u.pathname)) doan.push(sach.replace(/-(vi|en)\.html(?=$|\?)/i, '-trang-{n}-$1.html'));
  doan.push(`${sach}${u.search ? '&' : '?'}page={n}`);
  if (!/\.[a-z]+$/i.test(u.pathname)) doan.push(`${u.origin}${u.pathname.replace(/\/$/, '')}/page/{n}${u.search}`);
  return doan;
}

const trangThu = (mau, n) => mau.replace('{n}', String(n));

const THANH_PHO = [
  ['Hồ Chí Minh', /hồ chí minh|tp\.?\s*hcm|\bhcm\b|ho chi minh/i],
  ['Hà Nội', /hà nội|ha noi|\bhanoi\b/i],
  ['Đà Nẵng', /đà nẵng|da nang/i],
  ['Cần Thơ', /cần thơ|can tho/i],
  ['Hải Phòng', /hải phòng|hai phong/i],
  ['Bình Dương', /bình dương|binh duong/i],
  ['Đồng Nai', /đồng nai|dong nai/i]
];

function diaDiemTrong(chu) {
  const tp = THANH_PHO.map(([ten, re]) => ({ ten, vt: chu.search(re) })).filter(x => x.vt >= 0).sort((a, b) => a.vt - b.vt).map(x => x.ten);
  const kieu = /làm từ xa|\bremote\b/i.test(chu) ? 'Remote' : /linh hoạt|\bhybrid\b/i.test(chu) ? 'Hybrid' : '';
  if (!tp.length) return kieu;
  return kieu ? `${tp.join(', ')} · ${kieu}` : tp.join(', ');
}

const LUONG = /\d[\d.,]*\s*(?:-|–|đến|to)\s*\d[\d.,]*\s*(?:triệu|tr\b|usd|\$|vnđ|vnd)|(?:tới|lên đến|up ?to)\s*\d[\d.,]*\s*(?:triệu|usd|\$)|\d[\d.,]*\s*(?:triệu|usd)\b|thương lượng|cạnh tranh|negotiable/i;
const luongTrong = chu => (chu.match(LUONG) || [''])[0].trim();

function trichTheViec(html, nhom) {
  const s = String(html);
  const viTri = nhom.map(l => l.viTri).concat(s.length);
  return nhom.map((l, i) => {
    const chu = boThe(s.slice(l.viTri, Math.min(viTri[i + 1], l.viTri + 12000))
      .replace(/<svg\b[\s\S]*?(?:<\/svg>|$)/gi, ' ')
      .replace(/<[^>]*$/, ''));
    const dau = chu.slice(0, 600);
    return {
      url: l.url,
      title: l.text || doanCuoi(l.url).replace(/\.[a-z]+$/i, '').replace(/[.][A-Za-z0-9]+$/, '').replace(/-\d+$/, '').replace(/[-_]+/g, ' ').trim(),
      snippet: chu.slice(0, 400),
      diaDiem: diaDiemTrong(dau),
      luong: luongTrong(dau)
    };
  });
}

module.exports = { layLink, nhomTinViec, tinTheoKhuon, doanLoaiTrang, mauTrangSau, trangThu, trichTheViec, boThe, khuon };
