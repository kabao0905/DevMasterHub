// Phan tich trang tuyen dung bang code (khong AI): lay link, nhan ra nhom link tin viec,
// doan loai trang va mau URL trang N. Nhen tim viec (lib/nhen-viec.js) dung cac ham nay;
// Jev chi duoc hoi o nhung cho code khong tu quyet duoc.

const giaiMa = s => s
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&amp;/g, '&');
const boThe = s => giaiMa(String(s).replace(/<[^<>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Moi the <a href> thanh { url tuyet doi, text, viTri trong HTML }; bo #, chi http(s), moi URL mot lan */
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

/** Doan cuoi duong dan co ma tin: ma chu-so (35C8AE31) hoac so >= 3 chu so (…-5536, …-2110976-jv) */
const coMa = doan => /[A-Za-z0-9]*\d[A-Za-z0-9]{4,}/.test(doan) || /(^|[-_.])\d{3,}($|[-_.])/.test(doan);
const doanCuoi = u => new URL(u).pathname.split('/').pop() || '';
const TU_VIEC = /viec|job|tuyen|career|position|vacanc|recruit|opening/i;

const khuon = u => {
  const p = new URL(u).pathname.split('/');
  const cuoi = p.pop() || '';
  const duoi = (cuoi.match(/\.[a-z]+$/i) || [''])[0];
  return `${p.join('/')}/*${duoi}`;
};

/**
 * Nhom link tin viec tren trang danh sach: cac link cung khuon duong dan (/vi/tim-viec-lam/*.html) lap lai.
 * Uu tien nhom co tu "viec/job" va doan cuoi co ma tin — tach khoi link cong ty, danh muc, menu.
 * @returns {{ url: string, text: string, viTri: number }[]} rong neu khong co nhom nao du lon
 */
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
    // Chi link co ma tin moi la tin viec: link loc ky nang / dia diem / danh muc chung khuon (ITviec) thi khong.
    // Gop link cung duong dan khac tham so theo doi (?lab_feature=..., ?track_action=...)
    const theoDuongDan = new Map();
    for (const l of ds) {
      const u = new URL(l.url);
      if (coMa(doanCuoi(l.url)) && !theoDuongDan.has(u.pathname)) theoDuongDan.set(u.pathname, l);
    }
    const tin = [...theoDuongDan.values()];
    if (tin.length < 3) continue;
    const diem = tin.length * (1 + (TU_VIEC.test(k) ? 1 : 0));
    if (diem > diemTot) { diemTot = diem; tot = tin; }
  }
  return tot;
}

/** Trang du lieu cho tu 5 tin tro len la danh sach; duong dan co ma tin la mot tin; con lai la "khac" */
function doanLoaiTrang(url, html) {
  const nhom = nhomTinViec(layLink(html, url), url);
  // Trang cung khuon voi chinh cac link tin = trang chi tiet co muc "viec tuong tu", khong phai danh sach
  // (chinh URL phai co ma tin: /it-jobs/reactjs cung khuon voi tin ITviec nhung la trang danh sach)
  const laTrangTin = nhom.length > 0 && coMa(doanCuoi(url)) && khuon(nhom[0].url) === khuon(url);
  if (nhom.length >= 5 && !laTrangTin) return 'danh_sach';
  if (laTrangTin) return 'mot_tin';
  const cuoi = new URL(url).pathname.split('/').pop() || '';
  if (coMa(cuoi) || /"@type"\s*:\s*"JobPosting"/.test(html)) return 'mot_tin';
  return 'khac';
}

/** Cac kieu so trang hay gap: ?page=2, ?p=2, /page/2, -trang-2, /trang-2 */
const KIEU_SO_TRANG = [/([?&](?:page|p|pg|trang)=)(\d+)/i, /(\/page\/)(\d+)/i, /(-trang-)(\d+)/i, /(\/trang-)(\d+)/i];

function thanhMau(url) {
  for (const re of KIEU_SO_TRANG) {
    if (re.test(url)) return url.replace(re, '$1{n}');
  }
  return null;
}

/**
 * Mau URL trang N ('{n}' la so trang), uu tien: URL dang co so trang > link so trang tren trang > doan kieu pho bien.
 * Ben goi phai thu trang 2 va chi tin mau nao ra tin viec moi.
 */
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

/** Chu cua tung the tin (ten, cong ty, luong, dia diem): tu link tin toi link tin ke tiep, toi da 400 ky tu */
function trichTheViec(html, nhom) {
  const s = String(html);
  const viTri = nhom.map(l => l.viTri).concat(s.length);
  return nhom.map((l, i) => ({
    url: l.url,
    // Link chi boc anh (khong chu, khong title) thi lay ten tu duong dan: senior-react-developer.AB1.html
    title: l.text || doanCuoi(l.url).replace(/\.[a-z]+$/i, '').replace(/[.][A-Za-z0-9]+$/, '').replace(/-\d+$/, '').replace(/[-_]+/g, ' ').trim(),
    // Bo icon SVG va the bi cat do o cuoi doan (cat giua the thi "<path d=..." lot vao chu)
    snippet: boThe(s.slice(l.viTri, Math.min(viTri[i + 1], l.viTri + 2500))
      .replace(/<svg\b[\s\S]*?(?:<\/svg>|$)/gi, ' ')
      .replace(/<[^>]*$/, '')).slice(0, 400)
  }));
}

module.exports = { layLink, nhomTinViec, doanLoaiTrang, mauTrangSau, trangThu, trichTheViec, boThe, khuon };
