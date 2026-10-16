// Nhen tim viec: tu link nguoi hoc gui, tim trang danh sach viec IT, lat trang, gom tin, cham do phu hop.
// Code lam het phan chac chan (lay link, nhom tin, mau trang N, kiem tin moi); Jev (System One) chi:
//   - chon link dan toi danh sach viec IT khi trang dang dung khong phai danh sach
//   - cham tung viec so voi ho so hoc (score) va loc viec khong phai IT (noul)
// Jev loi (het credit, mang...) thi quay ve cham bang code — chuc nang van chay.
// Y tuong cham link 1 request / trang theo jevcrawl (github.com/RayenMlayeh/jevcrawl, Apache-2.0).
const { layLink, nhomTinViec, tinTheoKhuon, doanLoaiTrang, mauTrangSau, trangThu, trichTheViec, khuon } = require('./link-viec.js');
const { lamGiauViec } = require('./chi-tiet-viec.js');

const BAY = /\/(dang-nhap|dang-ky|login|logout|signin|signup|register|cart|checkout|account|tai-khoan)(?:[/.?]|$)/i;
const TU_IT = /(^|[^a-z])(it|cntt|phan-mem|software|developer|lap-trinh|cong-nghe-thong-tin|engineer)([^a-z]|$)/i;
const SO_LINK_TOI_DA = 100;
const SO_VIEC_MOI_LO = 25;
const CHO_GIUA_TRANG_MS = 400;
/** Mo them vai trang chi tiet ngoai so viec can tra: bai blog lot vao se bi loai */
const SO_DU_PHONG = 5;

const loiNhen = (thongBao, code) => Object.assign(new Error(thongBao), { code });

async function taiHtml(tai, url) {
  try {
    const t = await tai(url);
    return t.status >= 200 && t.status < 300 && t.body ? { url: t.url || url, body: t.body } : null;
  } catch { return null; }
}

// ── Tim trang danh sach viec IT ──

/** Link danh sach viec chung (khong rieng IT): "tất cả việc làm", "việc làm mới", /jobs */
const DS_CHUNG = /tat-ca-viec|viec-lam-moi|tim-viec|all-jobs|\/jobs\/?$|\/viec-lam\/?$|việc làm mới|tất cả việc/i;

/** Doan theo tu trong link: danh sach IT 0.6, danh sach viec chung 0.5 (Jev loc viec IT sau), con lai 0 */
const chamLinkBangCode = links => links.map(l => {
  const chu = `${l.text} ${new URL(l.url).pathname}`;
  return { ...l, diem: TU_IT.test(chu) ? 0.6 : DS_CHUNG.test(chu) ? 0.5 : 0 };
});

/** Diem moi link: Jev noul "dan toi danh sach viec IT"; Jev loi thi doan theo tu trong link */
async function chamLink(jev, links) {
  const theoCode = () => chamLinkBangCode(links);
  if (!jev || !jev.sanSang) return theoCode();
  const questions = Object.fromEntries(links.map((l, i) => [`link${i}`, {
    type: 'noul',
    instructions: { link: { text: l.text, url: l.url }, question: 'Following `link` leads to a page listing many IT or software development job openings.' },
    criteria: { true: 'A job listing or job category page for IT / software jobs', false: 'Login, a single job post, a company page, news, or a non-IT job category' }
  }]));
  try {
    const ans = await jev.hoi({ goal: 'Find the page listing IT / software job openings on this job site' }, questions);
    return links.map((l, i) => ({ ...l, diem: ans[`link${i}`]?.noul ?? 0 }));
  } catch { return theoCode(); }
}

const ungVien = (html, url) => {
  const host = new URL(url).host;
  return layLink(html, url)
    .filter(l => l.url !== url && new URL(l.url).host === host && !BAY.test(new URL(l.url).pathname) && l.text)
    .slice(0, SO_LINK_TOI_DA);
};

/** Trang dang dung la danh sach thi dung luon; khong thi cho Jev chon link (trang nay roi trang chu) */
async function timDanhSach({ url, html, tai, jev, cho }) {
  // Trang chu chi co muc "viec noi bat" tron moi nganh: khong dung, di vao danh sach viec IT
  if (new URL(url).pathname !== '/' && doanLoaiTrang(url, html) === 'danh_sach') return { url, html };
  const chu = `${new URL(url).origin}/`;
  const nguon = [{ url, body: html }, ...(chu !== url ? [{ url: chu }] : [])];
  for (const n of nguon) {
    const trang = n.body != null ? n : await taiHtml(tai, n.url);
    if (!trang) continue;
    const links = ungVien(trang.body, trang.url);
    let xep = await chamLink(jev, links);
    // Khong link nao dan toi danh sach IT (menu dung bang JS...): thu danh sach viec chung, Jev loc viec IT sau
    if (!xep.some(x => x.diem >= 0.5)) xep = chamLinkBangCode(links);
    xep.sort((a, b) => b.diem - a.diem);
    for (const l of xep.slice(0, 3).filter(x => x.diem >= 0.5)) {
      await cho(CHO_GIUA_TRANG_MS);
      const t = await taiHtml(tai, l.url);
      if (t && doanLoaiTrang(t.url, t.body) === 'danh_sach') return { url: t.url, html: t.body };
    }
  }
  throw loiNhen('Không tìm thấy trang danh sách việc làm IT trên website này', 'EKHONGDANHSACH');
}

// ── Lat trang ──

/** Doc trang 1..N; trang 2 thu lan luot cac mau URL, chi giu mau nao ra tin moi */
async function docDanhSach({ batDau, html, tai, cho, toiDaTrang, hanGio }) {
  const viec = new Map();
  const nhom1 = nhomTinViec(layLink(html, batDau), batDau);
  // Trang sau nhan tin theo khuon duong dan cua tin trang 1: trang cuoi chi con 1-2 tin van dem du
  const khuonTin = nhom1.length ? khuon(nhom1[0].url) : null;
  const them = (body, url, nhom) => {
    let moi = 0;
    for (const t of trichTheViec(body, nhom ?? tinTheoKhuon(layLink(body, url), khuonTin))) {
      if (!viec.has(t.url)) { viec.set(t.url, t); moi++; }
    }
    return moi;
  };
  them(html, batDau, nhom1);
  const dsMau = mauTrangSau(batDau, layLink(html, batDau));
  let mau = null;
  let soTrang = 1;
  let dungVi = 'het_tin_moi';
  for (let n = 2; ; n++) {
    if (soTrang >= toiDaTrang) { dungVi = 'gioi_han_trang'; break; }
    if (Date.now() > hanGio) { dungVi = 'het_gio'; break; }
    let moi = 0;
    for (const m of mau ? [mau] : dsMau) {
      await cho(CHO_GIUA_TRANG_MS);
      const t = await taiHtml(tai, trangThu(m, n));
      if (t && (moi = them(t.body, t.url)) > 0) { mau = m; break; }
    }
    if (!moi) break;
    soTrang++;
  }
  return { viec: [...viec.values()], soTrang, dungVi };
}

// ── Cham do phu hop ──

const MUC_PHU_HOP = [
  'Poor fit: needs skills or seniority the learner clearly lacks',
  'Stretch: some key required skills are missing',
  'Good fit: the learner has most of the required skills',
  "Strong fit: matches the learner's skills and level well"
];

async function chamLoJev(jev, learner, lo) {
  const questions = {};
  lo.forEach((v, i) => {
    // Da doc trang chi tiet: cham bang du lieu day du (ky nang, kinh nghiem) thay vi vai dong tren danh sach
    const job = v.chiTiet
      ? { title: v.title, company: v.congTy, location: v.diaDiem, experience: v.kinhNghiem, skills: (v.kyNang || []).join(', '), details: v.moTa }
      : { title: v.title, details: v.snippet };
    questions[`fit${i}`] = { type: 'score', instructions: { job, question: 'How well does `job` fit `learner`, given their learned skills and level?' }, criteria: MUC_PHU_HOP };
    questions[`it${i}`] = { type: 'noul', instructions: { job, question: '`job` is a software, IT or technical role (developer, tester, DevOps, data, IT support, IT project manager).' } };
  });
  const ans = await jev.hoi({ learner }, questions);
  return lo.map((v, i) => ({ ...v, diem: (ans[`fit${i}`]?.score ?? 0) / (MUC_PHU_HOP.length - 1), laIT: ans[`it${i}`]?.noul ?? 1 }));
}

/** Diem bang code: ty le ky nang da hoc xuat hien trong tin */
function chamBangCode(viec, hoSo) {
  const kyNang = (hoSo.skills || []).map(s => s.toLowerCase());
  return viec.map(v => {
    const chu = `${v.title} ${v.snippet} ${v.url}`.toLowerCase();
    const khop = kyNang.filter(k => chu.includes(k)).length;
    return { ...v, diem: kyNang.length ? Math.min(1, khop / 2) : 0, laIT: 1 };
  });
}

async function chamViec(jev, viec, hoSo) {
  const learner = { level: hoSo.level || 'newbie', skills: hoSo.skills || [], completed_lessons: hoSo.completedLessons || 0 };
  if (!jev || !jev.sanSang || !viec.length) return { ds: chamBangCode(viec, hoSo), nguon: 'code' };
  const lo = [];
  for (let i = 0; i < viec.length; i += SO_VIEC_MOI_LO) lo.push(viec.slice(i, i + SO_VIEC_MOI_LO));
  try {
    const kq = [];
    for (let i = 0; i < lo.length; i += 3) kq.push(...(await Promise.all(lo.slice(i, i + 3).map(x => chamLoJev(jev, learner, x)))).flat());
    return { ds: kq, nguon: 'jev' };
  } catch {
    return { ds: chamBangCode(viec, hoSo), nguon: 'code' };
  }
}

/**
 * @param {{ url: string, hoSo: object, tai: (url: string) => Promise<{status:number, body:string, url?:string}>,
 *           jev?: { hoi: Function, sanSang: boolean }, cho?: (ms:number)=>Promise<void>, toiDaTrang?: number, toiDaViec?: number, giay?: number }} p
 */
async function nhenViec({ url, hoSo = {}, tai, jev, cho = ms => new Promise(r => setTimeout(r, ms)), toiDaTrang = 5, toiDaViec = 15, giay = 40 }) {
  const hanGio = Date.now() + giay * 1000;
  const dau = await taiHtml(tai, url);
  if (!dau) throw loiNhen('Không tải được trang', 'EKHONGTAI');
  const ds = await timDanhSach({ url: dau.url, html: dau.body, tai, jev, cho });
  const { viec, soTrang, dungVi } = await docDanhSach({ batDau: ds.url, html: ds.html, tai, cho, toiDaTrang, hanGio });
  const { ds: daCham, nguon } = await chamViec(jev, viec, hoSo);
  const xep = ds2 => ds2.filter(v => v.laIT >= 0.3).sort((a, b) => b.diem - a.diem);
  // Mo trang chi tiet cua nhom tot nhat (du phong them vai tin vi bai blog se bi loai)
  const giau = await lamGiauViec(xep(daCham).slice(0, toiDaViec + SO_DU_PHONG), { tai, cho, hanGio });
  if (!giau.some(v => v.chiTiet)) {
    return { batDau: ds.url, soTrang, tongViec: viec.length, dungVi, nguonDiem: nguon, viec: giau.slice(0, toiDaViec).map(boCo) };
  }
  // Website co JobPosting: trang da mo ma khong co la bai viet / trang khac -> bo. Jev cham lai bang du lieu day du
  const tinThat = giau.filter(v => v.chiTiet || !v.daMo);
  const { ds: chamLai } = await chamViec(jev, tinThat, hoSo);
  return { batDau: ds.url, soTrang, tongViec: viec.length, dungVi, nguonDiem: nguon, viec: xep(chamLai).slice(0, toiDaViec).map(boCo) };
}

/** Bo co noi bo truoc khi tra ve client */
const boCo = ({ daMo, chiTiet, ...v }) => v;

module.exports = { nhenViec };
