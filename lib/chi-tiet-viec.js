// Doc trang chi tiet tin tuyen dung: JSON-LD schema.org JobPosting (du lieu cac trang viec lam gan cho Google Jobs).
// Cho con nhen lam giau the viec (cong ty, logo, dia diem, luong, hinh thuc, ky nang) va loai trang khong phai tin
// tuyen dung (bai blog "CV dai bao nhieu la vua?" co ma so trong link nhung khong co JobPosting).
const { boThe } = require('./link-viec.js');

const SO_KY_NANG = 5;

function timJobPosting(html) {
  for (const m of String(html).matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let d;
    try { d = JSON.parse(m[1]); } catch { continue; }
    const ds = [d].flat().flatMap(x => (x && Array.isArray(x['@graph']) ? x['@graph'] : [x]));
    const tin = ds.find(x => x && /JobPosting/.test([].concat(x['@type']).join(' ')));
    if (tin) return tin;
  }
  return null;
}

const chuoi = x => (typeof x === 'string' ? x.trim() : '');
const KHONG_RO = /^(not available|n\/a|none|-)$/i;

/** Quan / huyen / phuong — CareerViet de o addressRegion, thanh pho o addressLocality (nguoc ITviec) */
const LA_QUAN = /^(quận|huyện|phường|thị xã|district|ward)\b/i;

/** Mot dia chi -> "Thành phố" hoac "Thành phố (Quận 1)" */
function tenNoi(a) {
  const ds = [a.addressRegion, a.addressLocality].map(chuoi).filter(x => x && !KHONG_RO.test(x));
  const thanhPho = ds.find(x => !LA_QUAN.test(x));
  const quan = ds.find(x => LA_QUAN.test(x));
  if (thanhPho && quan) return `${thanhPho} (${quan})`;
  return thanhPho || quan || '';
}

function diaDiemTu(tin) {
  const noi = [];
  for (const l of [].concat(tin.jobLocation || [])) {
    const ten = tenNoi((l && l.address) || {});
    if (ten && !noi.includes(ten)) noi.push(ten);
  }
  const tuXa = /TELECOMMUTE/i.test(String(tin.jobLocationType || ''));
  if (!noi.length) return tuXa ? 'Remote' : '';
  return tuXa ? `${noi.join(', ')} · Remote` : noi.join(', ');
}

const soDep = n => Number(n).toLocaleString('en-US');
const LUONG_CHU = /cạnh tranh|thương lượng|thỏa thuận|thoả thuận|negotiable|competitive/i;
const laSo = x => x !== null && x !== undefined && x !== '' && Number.isFinite(Number(x));

function luongTu(tin) {
  const bs = tin.baseSalary;
  if (!bs || typeof bs !== 'object') return '';
  const v = bs.value && typeof bs.value === 'object' ? bs.value : { value: bs.value };
  const tien = chuoi(bs.currency).toUpperCase();
  // Luong bang chu: giu khi co so ("14 – 16 million VND/month") hoac la "Cạnh tranh / Thương lượng / Thỏa thuận";
  // cau quang cao khong co so ("You'll love it" cua ITviec khi an luong) coi nhu khong ghi
  if (typeof v.value === 'string' && !/^\d[\d.,]*$/.test(v.value.trim()) && v.minValue == null) {
    const s = v.value.trim();
    return /\d/.test(s) || LUONG_CHU.test(s) ? s : '';
  }
  const khoang = [v.minValue, v.maxValue].filter(laSo).map(Number);
  const ds = khoang.length ? khoang : laSo(v.value) ? [Number(v.value)] : [];
  if (!ds.length) return typeof v.value === 'string' ? v.value.trim() : '';
  // VND: doi ra trieu cho de doc (15000000 -> 15)
  if (tien === 'VND' && ds.every(x => x >= 1e6)) return `${ds.map(x => soDep(Math.round(x / 1e5) / 10)).join(' - ')} triệu`;
  return `${ds.map(soDep).join(' - ')}${tien && tien !== 'LTT' ? ` ${tien}` : ''}`;
}

function kinhNghiemTu(tin) {
  const e = tin.experienceRequirements;
  if (!e) return '';
  if (typeof e === 'string') return e.trim().slice(0, 80);
  const thang = Number(e.monthsOfExperience);
  if (!Number.isFinite(thang) || thang <= 0) return '';
  return thang % 12 === 0 ? `${thang / 12} năm` : `${thang} tháng`;
}

/**
 * @returns {null | { title, congTy, logo, diaDiem, luong, hinhThuc, kyNang: string[], kinhNghiem, moTa, hanNop }}
 */
function docTinTuyenDung(html) {
  const tin = timJobPosting(html);
  if (!tin) return null;
  const org = tin.hiringOrganization || {};
  const logo = typeof org.logo === 'string' ? org.logo : chuoi(org.logo && org.logo.url);
  const kyNang = (Array.isArray(tin.skills) ? tin.skills : String(tin.skills || '').split(/[,;|]/))
    .map(chuoi).filter(Boolean).slice(0, SO_KY_NANG);
  return {
    title: boThe(chuoi(tin.title)),
    congTy: boThe(chuoi(org.name)),
    logo: /^https?:\/\//i.test(logo) ? logo : '',
    diaDiem: diaDiemTu(tin),
    luong: luongTu(tin),
    // CareerViet ghi '"FULL_TIME"' (boc ngoac kep thua); giao dien dung FULLTIME / PARTTIME...
    hinhThuc: chuoi([].concat(tin.employmentType || [])[0]).replace(/["']/g, '').replace(/_/g, '').toUpperCase(),
    kyNang,
    kinhNghiem: kinhNghiemTu(tin),
    moTa: boThe(chuoi(tin.description)).slice(0, 300),
    hanNop: chuoi(tin.validThrough).slice(0, 10)
  };
}

const SONG_SONG = 4;
const CHO_GIUA_LO_MS = 300;

/**
 * Mo trang chi tiet cua tung viec (4 trang mot luc, nghi giua cac lo, dung khi het gio) va gop du lieu JobPosting.
 * Viec da mo co `daMo: true`; doc duoc JobPosting thi them `chiTiet: true` va cac truong tu trang chi tiet.
 * @param {object[]} viec  viec tu trang danh sach ({ url, title, snippet, diaDiem, luong, ... })
 * @param {{ tai: Function, cho: (ms: number) => Promise<void>, hanGio: number }} dv
 */
async function lamGiauViec(viec, { tai, cho, hanGio }) {
  const ra = viec.map(v => ({ ...v }));
  for (let i = 0; i < ra.length; i += SONG_SONG) {
    if (Date.now() > hanGio) break;
    if (i) await cho(CHO_GIUA_LO_MS);
    await Promise.all(ra.slice(i, i + SONG_SONG).map(async (v, k) => {
      let ct = null;
      try {
        const t = await tai(v.url);
        if (t.status >= 200 && t.status < 300) ct = docTinTuyenDung(t.body);
      } catch { /* trang loi: coi nhu khong co chi tiet */ }
      ra[i + k] = ct
        ? { ...v, daMo: true, chiTiet: true, ...ct, title: ct.title || v.title, diaDiem: ct.diaDiem || v.diaDiem, luong: ct.luong || v.luong }
        : { ...v, daMo: true };
    }));
  }
  return ra;
}

module.exports = { docTinTuyenDung, lamGiauViec };
