// @ts-nocheck — engine chep nguyen tu public/cyber-terminal.js (da co bai kiem); kieu nam o API ben duoi.
// Khac ban cu: moi lan goi createTerminal() la mot may rieng (he thong tep, thu muc, lich su, co CTF),
// nen terminal bai hoc, lab va Thu thach khong ghi de nhau. Cho cham DOM (clear, nano, diem) thanh callback.

import { phanTichDong } from './shell-cu-phap';
import { LENH_VAN_BAN, tachCo } from './terminal-van-ban';
import { LENH_MA_HOA } from './terminal-ma-hoa';
import { LENH_HE_THONG } from './terminal-he-thong';
import { DS_THU_THACH, VFS_MAC_DINH } from './terminal-du-lieu';

// mode: quyen kieu 0o755 khi da chmod; khong co thi lay mac dinh (thu muc/bin 755, tep 644)
export type NutTep = { type: 'dir'; children: string[]; mode?: number } | { type: 'file'; content: string; mode?: number };
export type HeThongTep = Record<string, NutTep>;
export type ThuThach = { id: string; title: string; desc: string; hint: string; flag: string; points: number };
export type LenhTerminal = { name: string; usage: string; desc: string };
export type SuKienTerminal = {
  xoaManHinh?: () => void;
  moSoanThao?: (duong: string, noiDung: string) => void;
  doiDiem?: () => void;
};
export type MayTerminal = {
  executeCommand(lenh: string): string;
  checkFlag(co: string): string;
  luuTuSoanThao(duong: string, noiDung: string): string | null;
  loadFs(duLieu?: HeThongTep | null): HeThongTep;
  getFs(): HeThongTep;
  resetFs(): HeThongTep;
  commandNames(): string[];
  filePaths(): string[];
  cwd(): string;
  lichSu(): string[];
  diem(): number;
  coDaGiai(): Set<string>;
  COMMANDS: LenhTerminal[];
  CHALLENGES: ThuThach[];
};

export function createTerminal(nghe: SuKienTerminal = {}): MayTerminal {
  let currentDir = '/home/hacker';
  let history = [];
  let historyIdx = -1;
  let capturedFlags = new Set();
  let userScore = 0;


  const VFS_MACDINH = VFS_MAC_DINH;
  const CHALLENGES = DS_THU_THACH;

  // He thong tep la du lieu nap duoc, khong con la hang so dung chung.
  // Moi phong lab nap bo tep rieng; bo San co la mac dinh.
  let VFS = saoChepSau(VFS_MACDINH);
  // VFS la bien dung chung cho moi terminal tren trang. Phai nho dang nap bo cua lab
  // de terminal CTF ve sau biet ma tra lai bo San co (truoc day CTF chay tren bo
  // Nginx, khong con tep co nao cho toi khi tai lai trang).
  let dangDungBoLab = false;

  /** Sao chep sau de lab khong lam ban du lieu goc */
  function saoChepSau(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /** Thay toan bo he thong tep bang bo moi */
  function loadFs(duLieu) {
    VFS = saoChepSau(duLieu || VFS_MACDINH);
    dangDungBoLab = !!duLieu && duLieu !== VFS_MACDINH;
    currentDir = VFS['/home/hacker'] ? '/home/hacker' : '/';
    return VFS;
  }

  /** Tra ve he thong tep dang dung — ham kiem cua phong lab doc truc tiep tu day */
  function getFs() {
    return VFS;
  }

  /** Nap lai bo tep San co */
  function resetFs() {
    return loadFs(VFS_MACDINH);
  }


  /**
   * Danh sach lenh CO THAT cua terminal gia lap. Day la nguon duy nhat:
   * lenh "help" in ra tu day, va cau lenh mo ta gui cho AI cung lay tu day.
   * Truoc kia hai cho ghi tay rieng nen lech nhau — AI ra de bang netstat/ps
   * trong khi terminal chua cai, hoc vien go vao thi "command not found".
   * Lenh can he thong tep / trang thai may nam o switch ben duoi (LENH_MAY);
   * lenh thuan (van ban, ma hoa, he thong co dinh) nam o cac module terminal-*.ts.
   */
  const LENH_MAY = [
    { name: 'ls',      usage: 'ls [-la] [path]',        desc: 'Liệt kê thư mục (-l: quyền, kích thước; -a: cả tệp ẩn)' },
    { name: 'cd',      usage: 'cd <path>',              desc: 'Chuyển đổi thư mục làm việc' },
    { name: 'pwd',     usage: 'pwd',                    desc: 'Hiển thị đường dẫn thư mục hiện tại' },
    { name: 'find',    usage: 'find <path> [-type f|d] [-name "*.log"]', desc: 'Tìm tệp trong cả cây thư mục' },
    { name: 'tree',    usage: 'tree [-a] [path]',       desc: 'Vẽ cây thư mục' },
    { name: 'file',    usage: 'file <file>',            desc: 'Đoán loại tệp (script, văn bản, nhị phân...)' },
    { name: 'stat',    usage: 'stat <file>',            desc: 'Xem kích thước, quyền của tệp' },
    { name: 'du',      usage: 'du -sh [path]',          desc: 'Dung lượng thư mục / tệp' },
    { name: 'echo',    usage: 'echo "..." > <file>',    desc: 'In / ghi văn bản vào tệp (>> để nối thêm)' },
    { name: 'touch',   usage: 'touch <file>',           desc: 'Tạo tệp rỗng' },
    { name: 'nano',    usage: 'nano <file>',            desc: 'Mở ô soạn thảo để sửa tệp nhiều dòng' },
    { name: 'mkdir',   usage: 'mkdir -p <path>',        desc: 'Tạo thư mục, tự tạo cả thư mục cha' },
    { name: 'rm',      usage: 'rm [-r] <path>',         desc: 'Xóa tệp hoặc thư mục' },
    { name: 'cp',      usage: 'cp <nguồn> <đích>',      desc: 'Sao chép tệp' },
    { name: 'mv',      usage: 'mv <nguồn> <đích>',      desc: 'Di chuyển hoặc đổi tên tệp' },
    { name: 'chmod',   usage: 'chmod 755|+x <file>',    desc: 'Đổi quyền tệp' },
    { name: 'bash',    usage: 'bash <script.sh>',       desc: 'Chạy script (hoặc ./script.sh sau khi chmod +x)' },
    { name: 'sh',      usage: 'sh <script.sh>',         desc: 'Chạy script bằng sh' },
    { name: 'history', usage: 'history',                desc: 'Xem các lệnh đã gõ' },
    { name: 'which',   usage: 'which <lệnh>',           desc: 'Lệnh nằm ở đâu' },
    { name: 'crontab', usage: 'crontab -l',             desc: 'Xem tác vụ chạy định kỳ của bạn' },
    { name: 'curl',    usage: 'curl <url>',             desc: 'Gửi request HTTP tới web server' },
    { name: 'nginx',     usage: 'nginx -t',                 desc: 'Kiểm tra cú pháp tệp cấu hình Nginx' },
    { name: 'systemctl', usage: 'systemctl <lệnh> nginx',   desc: 'Xem trạng thái / nạp lại dịch vụ Nginx' },
    { name: 'clear',   usage: 'clear',                  desc: 'Xóa màn hình terminal' },
    { name: 'help',    usage: 'help',                   desc: 'Xem danh sách lệnh này' },
    { name: 'submit',  usage: 'submit <flag>',          desc: 'Nộp cờ CTF để nhận điểm XP' }
  ];
  const LENH_THUAN = { ...LENH_VAN_BAN, ...LENH_MA_HOA, ...LENH_HE_THONG };
  const moTa = bang => Object.entries(bang).map(([name, l]) => ({ name, usage: l.usage, desc: l.desc }));
  const NHOM_TRO_GIUP = [
    ['📂 TỆP, THƯ MỤC & SHELL', LENH_MAY],
    ['🔎 XỬ LÝ VĂN BẢN', moTa(LENH_VAN_BAN)],
    ['🔐 MÃ HÓA', moTa(LENH_MA_HOA)],
    ['🌐 HỆ THỐNG & MẠNG', moTa(LENH_HE_THONG)]
  ];
  const COMMANDS = NHOM_TRO_GIUP.flatMap(([, ds]) => ds);

  // Script goi script (hoac bash -c) long nhau toi da chung nay tang — chan vong lap vo han
  const SAU_TOI_DA = 5;
  const BYTE = new TextEncoder();

  function executeCommand(input) {
    const raw = input.trim();
    if (!raw) return '';
    history.push(raw);
    historyIdx = history.length;
    // Lenh hoc vien go la tuy y: loi bat ngo trong engine chi duoc thanh mot dong bao, khong lam vo man hinh
    try {
      return chayDong(raw, 0);
    } catch (e) {
      return `bash: lỗi khi chạy lệnh (${e instanceof Error ? e.message : String(e)})`;
    }
  }

  /**
   * Loi thuong bat dau bang "<lenh>: ..." kem cac cum nay. Terminal gia lap khong co ma thoat
   * that, nen && / || dua vao day de biet lenh truoc hong hay khong.
   */
  function laLoi(ra) {
    return /^[\w.\/-]+: .*(No such file|not found|cannot|Permission denied|Is a directory|invalid|missing|thiếu|không hợp lệ|cách dùng|usage|test failed)/im.test(ra);
  }

  /** Chay mot dong lenh: nhieu cau noi bang ; && ||, moi cau la mot pipeline */
  function chayDong(raw, doSau) {
    const cau = phanTichDong(raw);
    if (!Array.isArray(cau)) return `bash: ${cau.loi}`;
    const ra = [];
    let thanhCong = true;
    for (let i = 0; i < cau.length; i++) {
      const noiTruoc = i > 0 ? cau[i - 1].noi : null;
      if ((noiTruoc === '&&' && !thanhCong) || (noiTruoc === '||' && thanhCong)) continue;
      const kq = chayOng(cau[i].ong, doSau);
      thanhCong = kq.ok;
      if (kq.ra) ra.push(kq.ra);
    }
    return ra.join('\n');
  }

  /** Chay pipeline: ket qua lenh truoc thanh stdin cua lenh sau; < > >> theo tung doan */
  function chayOng(ong, doSau) {
    let stdin = null;
    let ra = '';
    for (let i = 0; i < ong.length; i++) {
      const doan = ong[i];
      const tu = bungGlob(doan.tu);
      if (doan.vao) {
        const t = VFS[resolvePath(doan.vao)];
        if (!t) return { ra: `bash: ${doan.vao}: No such file or directory`, ok: false };
        if (t.type === 'dir') return { ra: `bash: ${doan.vao}: Is a directory`, ok: false };
        stdin = t.content || '';
      }
      const biChuyen = i < ong.length - 1 || !!doan.ra;
      ra = String(chayLenh(tu[0], tu.slice(1), stdin, biChuyen, doSau) ?? '').replace(/\n+$/, '');
      if (doan.ra) {
        const loi = ghiTep(resolvePath(doan.ra.tep), ra ? ra + '\n' : '', doan.ra.noiThem);
        ra = loi ? `bash: ${doan.ra.tep}: ${loi}` : '';
      }
      // Lenh that luon in xuong dong cuoi: giu dung de wc -c, sha256sum, base64 cho ket qua nhu Linux
      stdin = ra ? ra + '\n' : '';
    }
    return { ra, ok: !laLoi(ra) };
  }

  /** Bung * va ? (khong nam trong dau nhay) o doan cuoi cua duong dan; khong khop thi giu nguyen nhu bash */
  function bungGlob(tu) {
    return tu.flatMap(({ v, coNhay }) => {
      if (coNhay || !/[*?]/.test(v)) return [v];
      const cat = v.lastIndexOf('/');
      const thuMucGo = cat >= 0 ? v.slice(0, cat + 1) : '';
      const mau = v.slice(cat + 1);
      if (/[*?]/.test(thuMucGo)) return [v];
      const thuMuc = VFS[resolvePath(thuMucGo || '.')];
      if (!thuMuc || thuMuc.type !== 'dir') return [v];
      const khop = (thuMuc.children || [])
        .filter(ten => (mau.startsWith('.') || !ten.startsWith('.')) && khopTenTep(ten, mau))
        .sort()
        .map(ten => thuMucGo + ten);
      return khop.length ? khop : [v];
    });
  }

  /** Ngu canh cho lenh thuan: doc tep qua he thong tep cua may nay */
  function nguCanh(stdin) {
    return {
      stdin,
      docTep: p => {
        const n = VFS[resolvePath(p)];
        if (!n) return { loi: 'No such file or directory' };
        if (n.type === 'dir') return { loi: 'Is a directory' };
        return { noiDung: n.content || '' };
      },
      tepDeQuy: p => {
        const goc = resolvePath(p);
        if (!VFS[goc] || VFS[goc].type !== 'dir') return null;
        const ds = [];
        thuThapDuongDan(goc, ds);
        const hien = p.replace(/\/+$/, '');
        return ds.filter(d => VFS[d].type === 'file').map(d => hien + (goc === '/' ? d : d.slice(goc.length)));
      }
    };
  }

  /** Quyen mac dinh: thu muc 755, tep trong thu muc bin 755, con lai 644 */
  function quyenCua(p, n) {
    if (n.mode !== undefined) return n.mode;
    if (n.type === 'dir' || /^\/(usr\/(local\/)?)?s?bin\//.test(p)) return 0o755;
    return 0o644;
  }

  const chuoiQuyen = m => [6, 3, 0].map(s => ((m >> s) & 4 ? 'r' : '-') + ((m >> s) & 2 ? 'w' : '-') + ((m >> s) & 1 ? 'x' : '-')).join('');

  /** Mot dong cua ls -l */
  function dongDai(p, ten) {
    const n = VFS[p];
    const chu = p.startsWith('/home/hacker') ? 'hacker' : 'root';
    const coLon = n.type === 'dir' ? 4096 : BYTE.encode(n.content || '').length;
    return `${n.type === 'dir' ? 'd' : '-'}${chuoiQuyen(quyenCua(p, n))} 1 ${chu.padEnd(6)} ${chu.padEnd(6)} ${String(coLon).padStart(5)} Oct 12 20:41 ${ten}`;
  }

  /** chmod 755 / +x / u+x,go-w -> quyen moi; sai cu phap thi null */
  function tinhQuyen(che, cu) {
    if (/^[0-7]{3,4}$/.test(che)) return parseInt(che.slice(-3), 8);
    let m = cu;
    for (const phan of che.split(',')) {
      const k = phan.match(/^([ugoa]*)([+\-=])([rwx]*)$/);
      if (!k) return null;
      const ai = k[1] && !k[1].includes('a') ? k[1] : 'ugo';
      const bit = (k[3].includes('r') ? 4 : 0) | (k[3].includes('w') ? 2 : 0) | (k[3].includes('x') ? 1 : 0);
      for (const c of ai) {
        const dich = { u: 6, g: 3, o: 0 }[c];
        if (k[2] === '+') m |= bit << dich;
        else if (k[2] === '-') m &= ~(bit << dich);
        else m = (m & ~(7 << dich)) | (bit << dich);
      }
    }
    return m;
  }

  /** Chay tep script tung dong (bo dong trong va chu thich) */
  function chayScript(duong, canQuyenX, doSau) {
    if (doSau >= SAU_TOI_DA) return 'bash: quá nhiều tầng script lồng nhau';
    const p = resolvePath(duong);
    const n = VFS[p];
    if (!n) return `bash: ${duong}: No such file or directory`;
    if (n.type === 'dir') return `bash: ${duong}: Is a directory`;
    if (canQuyenX && !(quyenCua(p, n) & 0o100)) return `bash: ${duong}: Permission denied (chạy "chmod +x ${duong}" trước)`;
    const noiDung = String(n.content || '');
    if (noiDung.startsWith('(tệp nhị phân')) return `bash: ${duong}: tệp nhị phân không chạy được trong terminal giả lập`;
    return noiDung.split('\n').map(d => d.trim()).filter(d => d && !d.startsWith('#'))
      .map(d => chayDong(d, doSau + 1)).filter(Boolean).join('\n');
  }

  /** Dinh dang danh sach muc cua ls: -l chi tiet; bi pipe thi moi ten mot dong, khong mau */
  function dinhDangLs(ds, dai, biChuyen) {
    if (dai) return ds.map(x => dongDai(x.p, x.ten)).join('\n');
    if (biChuyen) return ds.map(x => x.ten).join('\n');
    return ds.map(x => (VFS[x.p].type === 'dir' ? `📁 \u001b[1;34m${x.ten}/\u001b[0m` : `📄 ${x.ten}`)).join('   ');
  }

  function chayLenh(lenhGo, args, stdin, biChuyen, doSau) {
    if (!lenhGo) return '';
    // ./script.sh hoac /duong/toi/script: can quyen thuc thi nhu Linux that
    if (lenhGo.includes('/')) return chayScript(lenhGo, true, doSau);
    const cmd = lenhGo.toLowerCase();
    if (Object.hasOwn(LENH_THUAN, cmd)) return LENH_THUAN[cmd].chay(args, nguCanh(stdin));

    switch (cmd) {
      case 'help': {
        const rong = Math.max(...COMMANDS.map(c => c.usage.length));
        return '\n📋 CÁC LỆNH ĐƯỢC HỖ TRỢ — nối lệnh bằng | ; &&, ghi tệp bằng > >>, đọc tệp bằng <, ký tự đại diện *\n'
          + NHOM_TRO_GIUP.map(([ten, ds]) => `\n${ten}\n` + ds.map(c => '  • ' + c.usage.padEnd(rong + 2) + ': ' + c.desc).join('\n')).join('\n')
          + '\n';
      }

      case 'pwd':
        return currentDir;

      case 'clear':
        nghe.xoaManHinh?.();
        return '';

      case 'ls': {
        const { co, conLai } = tachCo(args);
        const hienAn = !!(co.a || co.A);
        const tep = [];
        const thuMuc = [];
        const loi = [];
        for (const d of conLai.length ? conLai : ['.']) {
          const p = resolvePath(d);
          if (!VFS[p]) loi.push(`ls: cannot access '${d}': No such file or directory`);
          else (VFS[p].type === 'file' ? tep : thuMuc).push({ ten: d, p });
        }
        const phan = [...loi];
        if (tep.length) phan.push(dinhDangLs(tep, !!co.l, biChuyen));
        for (const { ten, p } of thuMuc) {
          const con = (VFS[p].children || []).filter(x => hienAn || !x.startsWith('.'))
            .map(x => ({ ten: x, p: p === '/' ? '/' + x : p + '/' + x }));
          const tieuDe = tep.length + thuMuc.length > 1 ? `${ten}:\n` : '';
          phan.push(tieuDe + dinhDangLs(con, !!co.l, biChuyen));
        }
        return phan.join('\n');
      }

      case 'cd': {
        const target = args[0] || '/home/hacker';
        const newPath = resolvePath(target);
        if (VFS[newPath] && VFS[newPath].type === 'dir') {
          currentDir = newPath;
          return '';
        }
        return `bash: cd: ${target}: No such file or directory`;
      }

      case 'find': {
        const goc = args[0] && !args[0].startsWith('-') ? args[0] : '.';
        const pGoc = resolvePath(goc);
        if (!VFS[pGoc]) return `find: '${goc}': No such file or directory`;
        const lay = k => { const i = args.indexOf(k); return i !== -1 ? args[i + 1] || '' : null; };
        const mau = lay('-name');
        const mauI = lay('-iname');
        const loai = lay('-type');
        const duong = [];
        thuThapDuongDan(pGoc, duong);
        return duong.filter(d => {
          const ten = d.split('/').pop() || '/';
          if (loai === 'f' && VFS[d].type !== 'file') return false;
          if (loai === 'd' && VFS[d].type !== 'dir') return false;
          if (mau !== null && !khopTenTep(ten, mau)) return false;
          if (mauI !== null && !khopTenTep(ten.toLowerCase(), mauI.toLowerCase())) return false;
          return true;
        }).join('\n');
      }

      case 'tree': {
        const { co, conLai } = tachCo(args);
        const goc = conLai[0] || '.';
        const pGoc = resolvePath(goc);
        if (!VFS[pGoc] || VFS[pGoc].type !== 'dir') return `${goc} [error opening dir]`;
        const dong = [goc];
        let soThuMuc = 0;
        let soTep = 0;
        const ve = (p, le) => {
          const con = (VFS[p].children || []).filter(x => co.a || !x.startsWith('.'));
          con.forEach((x, i) => {
            const cuoi = i === con.length - 1;
            const cp = p === '/' ? '/' + x : p + '/' + x;
            dong.push(le + (cuoi ? '└── ' : '├── ') + x);
            if (VFS[cp]?.type === 'dir') { soThuMuc++; ve(cp, le + (cuoi ? '    ' : '│   ')); } else soTep++;
          });
        };
        ve(pGoc, '');
        return [...dong, '', `${soThuMuc} directories, ${soTep} files`].join('\n');
      }

      case 'file': {
        if (!args.length) return 'file: thiếu tên tệp (vd: file script.sh)';
        return args.map(t => {
          const n = VFS[resolvePath(t)];
          if (!n) return `${t}: cannot open (No such file or directory)`;
          if (n.type === 'dir') return `${t}: directory`;
          const c = String(n.content || '');
          if (!c) return `${t}: empty`;
          if (c.startsWith('(tệp nhị phân')) return `${t}: ELF 64-bit LSB executable, x86-64, dynamically linked`;
          if (/^#!.*\bbash\b/.test(c)) return `${t}: Bourne-Again shell script, ASCII text executable`;
          if (c.startsWith('#!')) return `${t}: POSIX shell script, ASCII text executable`;
          if (c.startsWith('<?php')) return `${t}: PHP script, ASCII text`;
          return `${t}: ${/[^\x00-\x7f]/.test(c) ? 'Unicode text, UTF-8 text' : 'ASCII text'}`;
        }).join('\n');
      }

      case 'stat': {
        if (!args[0]) return 'stat: thiếu tên tệp';
        const p = resolvePath(args[0]);
        const n = VFS[p];
        if (!n) return `stat: cannot statx '${args[0]}': No such file or directory`;
        const q = quyenCua(p, n);
        const chu = p.startsWith('/home/hacker') ? ' 1000/  hacker' : '    0/    root';
        return [`  File: ${args[0]}`,
          `  Size: ${n.type === 'dir' ? 4096 : BYTE.encode(n.content || '').length}\tBlocks: 8\tIO Block: 4096   ${n.type === 'dir' ? 'directory' : 'regular file'}`,
          `Access: (0${q.toString(8)}/${n.type === 'dir' ? 'd' : '-'}${chuoiQuyen(q)})  Uid: (${chu})   Gid: (${chu})`,
          'Modify: 2026-10-12 20:41:00.000000000 +0700'].join('\n');
      }

      case 'du': {
        const { co, conLai } = tachCo(args);
        return (conLai.length ? conLai : ['.']).map(d => {
          const p = resolvePath(d);
          if (!VFS[p]) return `du: cannot access '${d}': No such file or directory`;
          const ds = [];
          thuThapDuongDan(p, ds);
          const tong = ds.reduce((s, x) => s + (VFS[x].type === 'file' ? BYTE.encode(VFS[x].content || '').length : 4096), 0);
          const kb = Math.max(1, Math.ceil(tong / 1024));
          return `${co.h ? (kb >= 1024 ? (kb / 1024).toFixed(1) + 'M' : kb + 'K') : kb}\t${d}`;
        }).join('\n');
      }

      case 'echo': {
        let i = 0;
        let thoat = false;
        while (/^-[neE]+$/.test(args[i] || '')) { if (args[i].includes('e')) thoat = true; i++; }
        const chu = args.slice(i).join(' ');
        return thoat ? chu.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : chu;
      }

      case 'touch': {
        if (!args.length) return 'touch: missing file operand';
        for (const t of args) {
          const p = resolvePath(t);
          if (VFS[p]) continue;
          const [cha] = tachDuong(p);
          if (!VFS[cha] || VFS[cha].type !== 'dir') return `touch: cannot touch '${t}': No such file or directory`;
          ghiTep(p, '', false);
        }
        return '';
      }

      case 'mkdir': {
        const p = args.find(a => !a.startsWith('-'));
        if (!p) return 'mkdir: missing operand';
        const duong = resolvePath(p);
        if (VFS[duong]) return `mkdir: cannot create directory '${p}': File exists`;
        taoThuMuc(duong);
        return '';
      }

      case 'nano': {
        const p = args.find(a => !a.startsWith('-'));
        if (!p) return 'nano: missing filename';
        const duong = resolvePath(p);
        const cu = (VFS[duong] && VFS[duong].content) || '';
        moOSoanThao(duong, cu);
        return '';
      }

      case 'rm': {
        const p = args.find(a => !a.startsWith('-'));
        if (!p) return 'rm: missing operand';
        const duong = resolvePath(p);
        if (!VFS[duong]) return `rm: cannot remove '${p}': No such file or directory`;
        const deQuy = args.some(a => a.startsWith('-') && (a.includes('r') || a.includes('R')));
        if (VFS[duong].type === 'dir' && !deQuy) return `rm: cannot remove '${p}': Is a directory`;
        for (const k of Object.keys(VFS)) {
          if (k === duong || k.startsWith(duong + '/')) delete VFS[k];
        }
        const [cha, ten] = tachDuong(duong);
        goKhoiCha(cha, ten);
        return '';
      }

      case 'cp':
      case 'mv': {
        if (args.length < 2) return `${cmd}: usage: ${cmd} <nguon> <dich>`;
        const nguon = resolvePath(args[0]);
        const dich = resolvePath(args[1]);
        if (!VFS[nguon]) return `${cmd}: cannot stat '${args[0]}': No such file or directory`;
        if (VFS[nguon].type === 'dir') return `${cmd}: '${args[0]}': la thu muc, chua ho tro`;
        const loi = ghiTep(dich, VFS[nguon].content || '', false);
        if (loi) return `${cmd}: ${loi}`;
        if (cmd === 'mv') {
          delete VFS[nguon];
          const [cha, ten] = tachDuong(nguon);
          goKhoiCha(cha, ten);
        }
        return '';
      }

      case 'chmod': {
        const [che, ...tep] = args.filter(a => a !== '-R');
        if (!che || !tep.length) return 'chmod: cách dùng: chmod 755 <tệp>  hoặc  chmod +x <tệp>';
        for (const t of tep) {
          const p = resolvePath(t);
          const n = VFS[p];
          if (!n) return `chmod: cannot access '${t}': No such file or directory`;
          const moi = tinhQuyen(che, quyenCua(p, n));
          if (moi === null) return `chmod: invalid mode: '${che}'`;
          n.mode = moi;
        }
        return '';
      }

      case 'bash':
      case 'sh': {
        if (args[0] === '-c') {
          if (!args[1]) return `${cmd}: -c: cần một chuỗi lệnh`;
          return doSau >= SAU_TOI_DA ? `${cmd}: quá nhiều tầng lồng nhau` : chayDong(args[1], doSau + 1);
        }
        if (!args[0]) return `${cmd}: terminal giả lập chỉ chạy tệp script: ${cmd} <tệp.sh>`;
        return chayScript(args[0], false, doSau);
      }

      case 'history': {
        if (args[0] === '-c') { history = []; return ''; }
        return history.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`).join('\n');
      }

      case 'which': {
        if (!args.length) return 'which: thiếu tên lệnh (vd: which grep)';
        const noiBo = ['cd', 'history', 'help', 'clear'];
        return args.map(a => (COMMANDS.some(c => c.name === a) && !noiBo.includes(a)
          ? `/usr/bin/${a}` : `which: no ${a} in (/usr/local/bin:/usr/bin:/bin)`)).join('\n');
      }

      case 'crontab': {
        if (args[0] !== '-l') return 'crontab: terminal giả lập chỉ hỗ trợ crontab -l (xem tác vụ định kỳ)';
        const t = VFS['/var/spool/cron/crontabs/hacker'];
        return t && t.type === 'file' ? t.content || '' : 'no crontab for hacker';
      }

      case 'curl': {
        // Truoc day tra ve doan HTML viet cung. Gio doc root trong cau hinh
        // hien tai roi mo tep tuong ung — sua cau hinh la ket qua doi theo.
        const url = args.find(a => !a.startsWith('-')) || 'http://localhost';
        // Bo scheme roi lay phan tu dau gach cheo dau tien tro di.
        // Neu khong co gach cheo nao ("localhost", "localhost:80") thi la trang goc.
        const khongScheme = url.replace(/^[a-z]+:\/\//i, '');
        const viTri = khongScheme.indexOf('/');
        const duongDanUrl = viTri === -1 ? '/' : (khongScheme.slice(viTri) || '/');

        const cuPhap = kiemCuPhapNginx();
        if (!cuPhap.dat) {
          return `HTTP/1.1 502 Bad Gateway\n\n<h1>502 Bad Gateway</h1>\n`
               + `(cấu hình Nginx đang lỗi — chạy "nginx -t" để xem chi tiết)`;
        }

        const root = docRootNginx();
        if (!root) {
          return `HTTP/1.1 502 Bad Gateway\n\n<h1>502 Bad Gateway</h1>\n`
               + `(không tìm thấy chỉ thị root trong ${NGINX_CONF})`;
        }

        const duongTep = duongDanUrl === '/' ? root + '/index.html' : root + duongDanUrl;
        const tep = VFS[normalize(duongTep)];
        if (!tep || tep.type !== 'file') {
          return `HTTP/1.1 404 Not Found\n\n<h1>404 Not Found</h1>\n`
               + `(không có ${duongTep})`;
        }

        return `HTTP/1.1 200 OK\nServer: nginx/1.24.0\nContent-Type: text/html\n\n${tep.content}`;
      }

      case 'nginx': {
        if (!args.includes('-t')) return 'nginx: usage: nginx -t';
        const kq = kiemCuPhapNginx();
        if (kq.dat) {
          return `nginx: the configuration file ${NGINX_CONF} syntax is ok\n`
               + `nginx: configuration file ${NGINX_CONF} test is successful`;
        }
        return `nginx: [emerg] ${kq.nhan}${kq.dong ? ' (dòng ' + kq.dong + ')' : ''} trong ${NGINX_CONF}\n`
             + `nginx: configuration file ${NGINX_CONF} test failed`;
      }

      case 'systemctl': {
        const hanhDong = args[0];
        const dichVu = (args[1] || '').replace(/\.service$/, '');
        if (dichVu !== 'nginx') return `Unit ${args[1] || '(trống)'} could not be found.`;
        if (hanhDong === 'status') {
          return `● nginx.service - A high performance web server\n`
               + `     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n`
               + `     Active: active (running)\n`
               + `   Main PID: 878 (nginx)`;
        }
        if (hanhDong === 'reload' || hanhDong === 'restart') {
          const kq = kiemCuPhapNginx();
          if (!kq.dat) {
            return `Job for nginx.service failed.\n`
                 + `Xem chi tiết bằng: nginx -t`;
          }
          return '';
        }
        return `systemctl: hành động "${hanhDong}" chưa được hỗ trợ (dùng status, reload, restart)`;
      }

      case 'submit': {
        const submittedFlag = args[0];
        if (!submittedFlag) return 'submit: usage: submit FLAG{...}';
        return checkFlag(submittedFlag);
      }

      default:
        return `bash: ${lenhGo}: command not found. Gõ "help" để xem danh sách lệnh.`;
    }
  }

  /** Duyet ca cay thu muc, gom moi duong dan lai */
  function thuThapDuongDan(goc, ra) {
    ra.push(goc);
    const e = VFS[goc];
    if (!e || e.type !== 'dir') return;
    for (const con of e.children || []) {
      thuThapDuongDan(goc === '/' ? '/' + con : goc + '/' + con, ra);
    }
  }

  /** So khop ten tep voi mau co dau * (va ? = mot ky tu), vi du "*.conf" hay ".sys*" */
  function khopTenTep(ten, mau) {
    const re = new RegExp('^' + mau.split('*')
      .map(x => x.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\?/g, '.'))
      .join('.*') + '$');
    return re.test(ten);
  }

  const NGINX_CONF = '/etc/nginx/nginx.conf';

  /**
   * Kiem cu phap nginx.conf o muc rut gon: can bang dau ngoac va dau cham phay.
   * Khong hieu het cu phap that cua Nginx — du de hoc vien nhan ra loi thuong gap.
   */
  function kiemCuPhapNginx() {
    const tep = VFS[NGINX_CONF];
    if (!tep || tep.type !== 'file') {
      return { dat: false, nhan: `không mở được ${NGINX_CONF}` };
    }
    const dong = String(tep.content || '').split('\n');
    let mo = 0;
    for (let i = 0; i < dong.length; i++) {
      const d = dong[i].replace(/#.*$/, '').trim();
      if (!d) continue;
      for (const c of d) {
        if (c === '{') mo++;
        else if (c === '}') mo--;
        if (mo < 0) return { dat: false, dong: i + 1, nhan: 'thừa dấu ngoặc đóng' };
      }
      // Dong khai bao chi thi (khong mo/dong khoi) phai ket thuc bang dau cham phay
      if (!/[{}]$/.test(d) && !d.endsWith(';')) {
        return { dat: false, dong: i + 1, nhan: 'thiếu dấu chấm phẩy ở cuối dòng' };
      }
    }
    if (mo > 0) return { dat: false, nhan: `thiếu ${mo} dấu ngoặc đóng` };
    return { dat: true };
  }

  /** Doc chi thi root trong nginx.conf; khong co thi tra ve null */
  function docRootNginx() {
    const tep = VFS[NGINX_CONF];
    if (!tep) return null;
    const m = String(tep.content || '').match(/^\s*root\s+([^\s;]+)\s*;/m);
    return m ? m[1] : null;
  }

  /** Noi mot ten con vao danh sach children cua thu muc cha */
  function themVaoCha(cha, ten) {
    if (!VFS[cha]) VFS[cha] = { type: 'dir', children: [] };
    if (!VFS[cha].children) VFS[cha].children = [];
    if (!VFS[cha].children.includes(ten)) VFS[cha].children.push(ten);
  }

  /** Go mot ten con khoi danh sach children cua thu muc cha */
  function goKhoiCha(cha, ten) {
    if (VFS[cha] && VFS[cha].children) {
      VFS[cha].children = VFS[cha].children.filter(x => x !== ten);
    }
  }

  /** Tach duong dan thanh [thu muc cha, ten] */
  function tachDuong(duong) {
    const i = duong.lastIndexOf('/');
    return [duong.slice(0, i) || '/', duong.slice(i + 1)];
  }

  /** Tao thu muc va moi thu muc cha con thieu */
  function taoThuMuc(duong) {
    const phan = duong.split('/').filter(Boolean);
    let hienTai = '';
    for (const ten of phan) {
      const cha = hienTai || '/';
      hienTai = hienTai + '/' + ten;
      if (!VFS[hienTai]) VFS[hienTai] = { type: 'dir', children: [] };
      themVaoCha(cha, ten);
    }
  }

  /** Ghi noi dung vao tep. Tra ve null neu xong, hoac chuoi loi. */
  function ghiTep(duong, noiDung, noiThem) {
    const [cha, ten] = tachDuong(duong);
    if (!ten) return 'khong ghi duoc vao thu muc goc';
    if (!VFS[cha]) taoThuMuc(cha);
    if (VFS[cha].type !== 'dir') return `khong ghi duoc: ${cha} khong phai thu muc`;
    if (VFS[duong] && VFS[duong].type === 'dir') return `khong ghi duoc: ${duong} la thu muc`;
    const cu = (noiThem && VFS[duong] && VFS[duong].content) || '';
    VFS[duong] = { type: 'file', content: cu + noiDung };
    themVaoCha(cha, ten);
    return null;
  }

  /** Ghi noi dung tu o soan thao nano. Mo ra ngoai de bo kiem goi truc tiep. */
  function luuTuSoanThao(duong, noiDung) {
    return ghiTep(duong, String(noiDung), false);
  }

  /**
   * nano mo mot cua so noi de len terminal, co nut Luu / Huy.
   * Khong mo phong giao dien nano that voi Ctrl+O / Ctrl+X — nguoi moi
   * se mac ket o cho thoat ra.
   */
  function moOSoanThao(duong, noiDungCu) {
    // Giao dien soan thao do React ve (Dialog); luu qua luuTuSoanThao
    nghe.moSoanThao?.(duong, noiDungCu);
  }

  function resolvePath(p) {
    if (p.startsWith('/')) return normalize(p);
    if (p === '~') return '/home/hacker';
    if (p.startsWith('~/')) return normalize('/home/hacker/' + p.substring(2));
    const full = currentDir === '/' ? '/' + p : currentDir + '/' + p;
    return normalize(full);
  }

  function normalize(pathStr) {
    const parts = pathStr.split('/').filter(Boolean);
    const stack = [];
    for (const seg of parts) {
      if (seg === '.') continue;
      if (seg === '..') { if (stack.length) stack.pop(); }
      else stack.push(seg);
    }
    return '/' + stack.join('/');
  }

  function checkFlag(flag) {
    const match = CHALLENGES.find(c => c.flag.trim() === flag.trim());
    if (match) {
      if (capturedFlags.has(match.id)) {
        return `⚠️ Cờ "${flag}" đã được nộp trước đó!`;
      }
      capturedFlags.add(match.id);
      userScore += match.points;
      nghe.doiDiem?.();
      return `🎉 CHÍNH XÁC! Bạn đã mở khóa: ${match.title} (+ ${match.points} XP)!`;
    }
    return `❌ Cờ không hợp lệ: "${flag}". Hãy kiểm tra lại định dạng!`;
  }


  return {
    executeCommand: lenh => String(executeCommand(lenh) ?? ''),
    checkFlag,
    luuTuSoanThao,
    loadFs,
    getFs,
    resetFs,
    commandNames: () => COMMANDS.map(c => c.name),
    filePaths: () => Object.keys(VFS).filter(k => VFS[k].type === 'file'),
    cwd: () => currentDir,
    lichSu: () => history.slice(),
    diem: () => userScore,
    coDaGiai: () => new Set(capturedFlags),
    COMMANDS,
    CHALLENGES
  };
}

const mau = createTerminal();
/** Bang lenh co that — nguon duy nhat cho "help" va cho de AI ra */
export const COMMANDS: LenhTerminal[] = mau.COMMANDS;
export const CHALLENGES: ThuThach[] = mau.CHALLENGES;
