const { layTieuDe } = require('./net-guard.js');
const { trichNoiDungTrang } = require('./trich-trang.js');
const { doanLoaiTrang } = require('./link-viec.js');
const { doanYDinh } = require('./y-dinh-link.js');
const { nhenViec } = require('./nhen-viec.js');

const chuoi = (x, toiDa) => (typeof x === 'string' ? x.trim().slice(0, toiDa) : '');

function chuanHoaYeuCauDocViec(body) {
  const b = body && typeof body === 'object' ? body : {};
  const url = chuoi(b.url, 2000);
  if (!/^https?:\/\//i.test(url)) return { loi: 'Cần một link http(s)' };
  const h = b.hoSo && typeof b.hoSo === 'object' ? b.hoSo : {};
  const skills = Array.isArray(h.skills) ? h.skills.filter(s => typeof s === 'string' && s.length <= 40).slice(0, 40) : [];
  const soBai = Math.max(0, Math.min(100000, Math.floor(Number(h.completedLessons)) || 0));
  return { url, cauHoi: chuoi(b.cauHoi, 2000), hoSo: { level: chuoi(h.level, 20) || 'newbie', skills, completedLessons: soBai } };
}

const loi = (thongBao, code, them = {}) => Object.assign(new Error(thongBao), { code, ...them });

function docMotTin(dau, yDinh, ghiChu) {
  return {
    cheDo: 'mot_tin', yDinh, url: dau.url,
    pageTitle: layTieuDe(dau.body) || 'Trang tuyển dụng',
    content: trichNoiDungTrang(dau.body).substring(0, 6500),
    ...(ghiChu ? { ghiChu } : {})
  };
}

async function docViecTuLink({ url, cauHoi, hoSo }, { tai, hoiAi, jev, cho }) {
  const daTai = new Map();
  const taiNho = u => {
    if (!daTai.has(u)) daTai.set(u, tai(u));
    return daTai.get(u);
  };
  const r = await taiNho(url);
  if (r.status === 403 || r.status === 429) {
    throw loi(`${new URL(url).hostname.replace(/^www\./, '')} không cho đọc tự động (trang có lớp chống bot)`, 'ECHAN', { status: r.status });
  }
  if (r.status < 200 || r.status >= 300) throw loi(`Không thể tải trang (HTTP ${r.status})`, 'EHTTP', { status: r.status });
  if (!/text\/html|text\/plain|application\/xhtml/i.test(String(r.headers?.['content-type'] || ''))) throw loi('Chỉ đọc được trang HTML', 'ELOAI');
  const dau = { url: r.url || url, body: r.body };
  daTai.set(dau.url, Promise.resolve(r));

  const { yDinh } = await doanYDinh({ cauHoi, loaiTrang: doanLoaiTrang(dau.url, dau.body), hoiAi });
  if (yDinh === 'mot_tin') return docMotTin(dau, yDinh);
  try {
    const kq = await nhenViec({ url: dau.url, hoSo, tai: taiNho, jev, ...(cho ? { cho } : {}) });
    return { cheDo: 'danh_sach', yDinh, ...kq };
  } catch (e) {
    if (e.code === 'EKHONGDANHSACH') return docMotTin(dau, yDinh, e.message);
    throw e;
  }
}

module.exports = { chuanHoaYeuCauDocViec, docViecTuLink };
