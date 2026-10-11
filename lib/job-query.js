// Xu ly tu khoa tim viec cho /api/jobs.
// Tach khoi server.js de kiem duoc ma khong phai mo cong mang.

// \b cua JavaScript chi hieu ky tu ASCII: \bở\b va \bkỹ sư\b khong bao gio khop,
// con includes('hn') thi khop ca "technical". Dung lookaround theo lop chu Unicode.
const DAU = '(?<![\\p{L}\\p{N}_])';
const CUOI = '(?![\\p{L}\\p{N}_])';

const thoatRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Regex khop bat ky cum nao trong ds khi no dung thanh tu rieng */
function tuRieng(ds, co = 'iu') {
  // Cum dai dat truoc, neu khong "việc" se an mat mot nua cua "việc làm"
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

/** Vai tro chung con giu duoc khi bo het cap bac; "kỹ sư"/"lập trình viên" thi quy ve developer */
const VAI_TRO = /\b(developer|engineer|programmer)\b/;

const gonKhoangTrang = s => s.replace(/\s+/g, ' ').trim();

/** Tra ve 'hcm' | 'hanoi' | 'danang' | 'remote' | null */
function doanThanhPho(chuoi) {
  const s = String(chuoi || '').toLowerCase();
  for (const [id, re] of THANH_PHO) if (re.test(s)) return id;
  return null;
}

/** Bo dia diem va tu dem; coreTech bo them cap bac de tim lai khi khong ra ket qua */
function lamSachTuKhoa(chuoi) {
  const s = String(chuoi || '').toLowerCase();
  const cleanTechQuery = gonKhoangTrang(s.replace(DIA_DIEM, ' ').replace(TU_DEM, ' ')) || 'developer';
  // Nguoi moi chua hoc gi thi AI de xuat kieu "Intern Developer": bo cap bac xong khong con gi.
  // Quay ve ca cum thi gan nhu khong tieu de nao chua -> 0 viec; quay ve vai tro chung thi van ra viec.
  const coreTech = gonKhoangTrang(cleanTechQuery.replace(CAP_BAC, ' ')) || (cleanTechQuery.match(VAI_TRO)?.[1] ?? 'developer');
  return { cleanTechQuery, coreTech };
}

/** Du lieu viec lam den tu ben thu ba: chi chap nhan http/https, con lai tra ve null */
function chiNhanHttp(url) {
  try {
    const u = new URL(String(url).trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

module.exports = { doanThanhPho, lamSachTuKhoa, chiNhanHttp };
