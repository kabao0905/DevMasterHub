// Dung danh sach nhiem vu cua mot phong lab, cham dap an va luu tien do.
// Tach rieng khoi app.js vi file do da hon 3500 dong.
const LabRunner = (() => {
  const KHOA_LUU = 'dmh_lab_progress';

  let labHienTai = null;
  let daXong = [];
  let mocGoiY = {};   // taskId -> so goi y da mo

  /** Bo khoang trang thua, khong phan biet hoa thuong */
  function chuanHoa(s) {
    return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /** dapAn co the la chuoi hoac mang bien the chap nhan duoc */
  function soKhop(dapAn, nhap) {
    const sach = chuanHoa(nhap);
    if (!sach) return false;
    const nhan = Array.isArray(dapAn) ? dapAn : [dapAn];
    return nhan.some(x => chuanHoa(x) === sach);
  }

  function tinhDiem(lab, danhSachXong) {
    const tasks = lab.tasks || [];
    const xongThat = tasks.filter(t => danhSachXong.includes(t.id));
    return {
      xong: xongThat.length,
      tong: tasks.length,
      diem: xongThat.reduce((s, t) => s + (t.diem || 0), 0),
      tongDiem: tasks.reduce((s, t) => s + (t.diem || 0), 0)
    };
  }

  function docTatCa() {
    try { return JSON.parse(localStorage.getItem(KHOA_LUU) || '{}'); }
    catch (e) { return {}; }
  }

  function docTienDo(lessonKey) {
    const t = docTatCa()[lessonKey];
    return Array.isArray(t) ? t : [];
  }

  function luuTienDo(lessonKey, danhSach) {
    const tatCa = docTatCa();
    tatCa[lessonKey] = danhSach;
    try { localStorage.setItem(KHOA_LUU, JSON.stringify(tatCa)); } catch (e) { /* het cho luu */ }
  }

  function thoat(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function veThanhTienDo() {
    const d = tinhDiem(labHienTai, daXong);
    const phanTram = d.tongDiem ? Math.round(d.diem / d.tongDiem * 100) : 0;
    return `
      <div class="lab-progress">
        <div class="lab-progress-text">
          Tiến độ: <strong>${d.xong}/${d.tong}</strong> nhiệm vụ ·
          <strong>${d.diem}/${d.tongDiem}</strong> điểm
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${phanTram}%"></div>
        </div>
      </div>`;
  }

  function veNhiemVu(nv) {
    const xong = daXong.includes(nv.id);
    const soGoiY = mocGoiY[nv.id] || 0;
    const dapAnHien = Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn;

    return `
      <div class="lab-task ${xong ? 'xong' : ''}" id="lab-task-${thoat(nv.id)}">
        <div class="lab-task-head">
          <span class="lab-task-icon">${xong ? '✅' : '▸'}</span>
          <span class="lab-task-cau">${thoat(nv.cau)}</span>
          <span class="lab-task-diem">${Number(nv.diem) || 0}đ</span>
        </div>

        ${xong ? `
          <div class="lab-task-xong">
            ${nv.kieu === 'traLoi' ? '→ <code>' + thoat(dapAnHien) + '</code>' : '→ Đã hoàn thành'}
          </div>` : `
          <div class="lab-task-lam">
            ${nv.kieu === 'traLoi' ? `
              <input type="text" class="lab-input" id="lab-input-${thoat(nv.id)}"
                     placeholder="Nhập đáp án…"
                     onkeydown="if(event.key==='Enter')LabRunner.kiemNhiemVu('${thoat(nv.id)}')" />` : ''}
            <button class="lab-btn-kiem" onclick="LabRunner.kiemNhiemVu('${thoat(nv.id)}')">Kiểm tra</button>
            ${soGoiY < (nv.goiY || []).length ? `
              <button class="lab-btn-goiy" onclick="LabRunner.moGoiY('${thoat(nv.id)}')">
                💡 Gợi ý ${soGoiY + 1}/${Number(nv.goiY.length) || 0}
              </button>` : ''}
          </div>
          <div class="lab-task-nhan" id="lab-nhan-${thoat(nv.id)}"></div>
          ${soGoiY > 0 ? `
            <div class="lab-goiy-list">
              ${nv.goiY.slice(0, soGoiY).map(g => `<div class="lab-goiy">💡 ${thoat(g)}</div>`).join('')}
            </div>` : ''}
        `}
      </div>`;
  }

  function veLai() {
    const khung = document.getElementById('lab-tasks-mount');
    if (!khung || !labHienTai) return;
    khung.innerHTML = veThanhTienDo()
      + labHienTai.tasks.map(veNhiemVu).join('');
  }

  /** Dung phong lab: danh sach nhiem vu o tren, terminal o duoi */
  function render(mountId, lab) {
    const khung = document.getElementById(mountId);
    if (!khung || !lab) return;

    labHienTai = lab;
    daXong = docTienDo(lab.lessonKey);
    mocGoiY = {};

    khung.innerHTML = `
      <div class="lab-wrapper">
        <div class="lesson-section glass-card lab-header">
          <h2 class="section-title">🧪 ${thoat(lab.tenLab)}</h2>
          <p class="lab-huong-dan">
            Dùng terminal bên dưới để tìm câu trả lời. Không đoán được đâu —
            phải thật sự gõ lệnh mới ra.
          </p>
        </div>
        <div class="lesson-section glass-card" id="lab-tasks-mount"></div>
        <div id="lab-terminal-mount"></div>
      </div>`;

    veLai();

    if (typeof CyberTerminal !== 'undefined') {
      CyberTerminal.loadFs(lab.fs);
      CyberTerminal.renderStudio('lab-terminal-mount', { challenges: false });
    }
  }

  function baoNhan(taskId, vanBan, dat) {
    const o = document.getElementById('lab-nhan-' + taskId);
    if (!o) return;
    o.textContent = vanBan;
    o.className = 'lab-task-nhan ' + (dat ? 'dat' : 'truot');
  }

  function kiemNhiemVu(taskId) {
    if (!labHienTai) return;
    const nv = labHienTai.tasks.find(t => t.id === taskId);
    if (!nv || daXong.includes(taskId)) return;

    let kq;
    if (nv.kieu === 'trangThai') {
      const fs = typeof CyberTerminal !== 'undefined' ? CyberTerminal.getFs() : {};
      kq = nv.kiem(fs) || { dat: false };
    } else {
      const o = document.getElementById('lab-input-' + taskId);
      const nhap = o ? o.value : '';
      kq = { dat: soKhop(nv.dapAn, nhap), nhan: 'Chưa đúng. Thử tìm kỹ hơn trong terminal.' };
    }

    if (!kq.dat) {
      baoNhan(taskId, '❌ ' + (kq.nhan || 'Chưa đúng.'), false);
      return;
    }

    daXong.push(taskId);
    luuTienDo(labHienTai.lessonKey, daXong);
    veLai();
  }

  function moGoiY(taskId) {
    mocGoiY[taskId] = (mocGoiY[taskId] || 0) + 1;
    veLai();
  }

  /** Tra ve phong lab cua mot bai hoc, hoac null neu bai do chua co lab */
  function timLab(lessonKey) {
    if (typeof LABS_NGINX !== 'undefined' && LABS_NGINX[lessonKey]) return LABS_NGINX[lessonKey];
    return null;
  }

  return {
    chuanHoa, soKhop, tinhDiem,
    docTienDo, luuTienDo,
    render, kiemNhiemVu, moGoiY, timLab
  };
})();
