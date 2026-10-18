const DAU = '(?<![\\p{L}\\p{N}_])';
const CUOI = '(?![\\p{L}\\p{N}_])';

const thoatRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function tuRieng(ds, co = 'iu') {
  const sapXep = [...ds].sort((a, b) => b.length - a.length).map(thoatRe);
  return new RegExp(DAU + '(?:' + sapXep.join('|') + ')' + CUOI, co);
}

const THANH_PHO = [
  ['hcm', ['hcm', 'tp.hcm', 'tp hcm', 'tphcm', 'hồ chí minh', 'ho chi minh', 'sài gòn', 'sai gon', 'saigon']],
  ['hanoi', ['hà nội', 'ha noi', 'hanoi', 'hn']],
  ['danang', ['đà nẵng', 'da nang', 'danang']],
  ['remote', ['remote', 'từ xa', 'nước ngoài', 'global', 'quốc tế']]
].map(([id, ds]) => [id, tuRieng(ds)]);

const DIA_DIEM = tuRieng([
  'vietnam', 'viet nam', 'việt nam', 'vn', 'hcm', 'ho chi minh', 'hồ chí minh', 'tp.hcm', 'tp hcm', 'tphcm',
  'ha noi', 'hà nội', 'hanoi', 'hn', 'da nang', 'đà nẵng', 'danang', 'remote', 'global', 'sài gòn', 'sai gon', 'saigon'
], 'giu');

const TU_DEM = tuRieng([
  'tui', 'tôi', 'muốn', 'tìm', 'việc', 'về', 'ở', 'tại', 'công việc', 'việc làm', 'tuyển dụng',
  'parttime', 'part time', 'fulltime', 'full time'
], 'giu');

const CAP_BAC = tuRieng([
  'developer', 'engineer', 'programmer', 'intern', 'fresher', 'junior', 'senior', 'lead',
  'chuyên viên', 'kỹ sư', 'lập trình viên', 'thực tập', 'thực tập sinh'
], 'giu');

const VAI_TRO = /\b(developer|engineer|programmer)\b/;

const gonKhoangTrang = s => s.replace(/\s+/g, ' ').trim();

function doanThanhPho(chuoi) {
  const s = String(chuoi || '').toLowerCase();
  for (const [id, re] of THANH_PHO) if (re.test(s)) return id;
  return null;
}

function lamSachTuKhoa(chuoi) {
  const s = String(chuoi || '').toLowerCase();
  const cleanTechQuery = gonKhoangTrang(s.replace(DIA_DIEM, ' ').replace(TU_DEM, ' ')) || 'developer';
  const coreTech = gonKhoangTrang(cleanTechQuery.replace(CAP_BAC, ' ')) || (cleanTechQuery.match(VAI_TRO)?.[1] ?? 'developer');
  return { cleanTechQuery, coreTech };
}

function chiNhanHttp(url) {
  try {
    const u = new URL(String(url).trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

module.exports = { doanThanhPho, lamSachTuKhoa, chiNhanHttp };
