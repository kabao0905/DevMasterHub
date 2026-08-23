# Phòng lab có chấm cho bài học Nginx — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Biến tab "Bài tập Thử thách" của bài học Nginx đầu tiên thành một phòng lab kiểu TryHackMe, nơi học viên thao tác trên terminal giả lập và mỗi nhiệm vụ được chấm đúng/sai khách quan.

**Architecture:** Hệ thống tệp ảo của `cyber-terminal.js` chuyển từ hằng số dùng chung thành dữ liệu nạp được theo từng phòng lab. Terminal được bổ sung nhóm lệnh ghi (`nano`, `echo >`, `mkdir`, `rm`, `cp`, `mv`) và nhóm lệnh Nginx (`nginx -t`, `systemctl`, `curl` tính từ trạng thái). Một module mới `lab-runner.js` dựng danh sách nhiệm vụ, chấm đáp án và lưu tiến độ; dữ liệu phòng lab nằm riêng trong `labs-nginx.js`.

**Tech Stack:** JavaScript thuần trong trình duyệt, không bước build. Bộ kiểm dùng trình chạy kiểm có sẵn của Node (`node:test` + `node:assert`), không thêm phụ thuộc nào.

## Global Constraints

- **Không thêm phụ thuộc npm.** `package.json` hiện chỉ có `express`. Ràng buộc $0 và máy yếu.
- **Không có bước build.** Mọi file trong `public/` được nạp thẳng bằng thẻ `<script defer>` trong `public/index.html`.
- **Mọi chuỗi hiển thị cho người dùng phải là tiếng Việt có dấu đầy đủ.**
- **Chú thích trong code viết tiếng Việt không dấu**, theo đúng lối đang dùng trong `cyber-terminal.js`.
- **Không đụng tới 27 chủ đề còn lại.** Bài nào chưa có phòng lab vẫn dùng ô văn bản + AI chấm như hiện tại.
- **Bộ kiểm chạy bằng `npm test`**, tức `node --test` không tham số (dạng truyền thư mục `node --test tests/` **lỗi** trên Windows/Git Bash của máy này — đã thử).
- **File kiểm đặt tại `tests/*.test.js`**, không đặt trong thư mục tạm.
- Chủ đề Nginx có 7 bài, id lần lượt: `intro`, `reverse-proxy`, `ssl`, `loadbalance`, `perf`, `linux`, `architecture`. Khoá bài học có dạng `${tech.id}.${level.id}.${lesson.id}`, nên bài 1 là **`nginx.newbie.intro`**.
- **Kế hoạch này dừng sau Task 6.** Sáu phòng lab còn lại chỉ làm sau khi người dùng xem và duyệt bài 1.

---

## Cấu trúc file

| File | Trạng thái | Trách nhiệm |
|---|---|---|
| `tests/helper.js` | tạo | Nạp các file trong `public/` vào hộp cát `vm` để kiểm chạy được ngoài trình duyệt |
| `tests/ctf-khong-hoi-quy.test.js` | tạo | Khẳng định trang Săn cờ vẫn giải được sau khi đổi hệ thống tệp |
| `tests/terminal-fs.test.js` | tạo | Kiểm nạp hệ thống tệp theo lab và nhóm lệnh ghi |
| `tests/terminal-nginx.test.js` | tạo | Kiểm `nginx -t`, `systemctl`, `curl` tính từ trạng thái |
| `tests/lab-nginx-intro.test.js` | tạo | Chạy lời giải mẫu, khẳng định cả 4 nhiệm vụ đạt |
| `tests/lab-runner.test.js` | tạo | Kiểm logic chuẩn hoá đáp án, so khớp, tính điểm |
| `public/labs-nginx.js` | tạo | Dữ liệu phòng lab Nginx: hệ thống tệp, nhiệm vụ, lời giải mẫu |
| `public/lab-runner.js` | tạo | Dựng giao diện nhiệm vụ, chấm, lưu tiến độ |
| `public/cyber-terminal.js` | sửa | Hệ thống tệp nạp được, nhóm lệnh ghi, nhóm lệnh Nginx |
| `public/app.js` | sửa | Bài nào có phòng lab thì gắn lab thay cho ô văn bản |
| `public/index.html` | sửa | Thêm thẻ script cho hai file mới |
| `public/style.css` | sửa | Kiểu hiển thị danh sách nhiệm vụ |
| `package.json` | sửa | Thêm script `test` |

`lab-runner.js` tách riêng thay vì nhét vào `app.js` vì file đó đã hơn 3500 dòng.

---

## Task 1: Hạ tầng kiểm và hệ thống tệp nạp được

**Files:**
- Create: `tests/helper.js`
- Create: `tests/terminal-fs.test.js`
- Create: `tests/ctf-khong-hoi-quy.test.js`
- Modify: `package.json` (thêm script `test`)
- Modify: `public/cyber-terminal.js` (khai báo `VFS`, thêm `loadFs`/`getFs`/`resetFs`, mở ra ngoài)

**Interfaces:**
- Produces:
  - `napTerminal()` → trả về đối tượng `CyberTerminal` mới, độc lập giữa các bài kiểm
  - `CyberTerminal.loadFs(duLieu)` → `object` — thay toàn bộ hệ thống tệp bằng bản sao sâu của `duLieu`, đặt thư mục hiện tại về `/home/hacker` nếu có, ngược lại `/`
  - `CyberTerminal.getFs()` → `object` — trả về hệ thống tệp hiện tại (tham chiếu trực tiếp, dùng cho hàm `kiem`)
  - `CyberTerminal.resetFs()` → `object` — nạp lại bộ tệp Săn cờ mặc định

- [ ] **Step 1: Thêm script test vào package.json**

Sửa `package.json`, mục `scripts`:

```json
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "test": "node --test"
  },
```

- [ ] **Step 2: Viết hàm nạp dùng chung cho bộ kiểm**

Tạo `tests/helper.js`:

```js
// Cac file trong public/ la script trinh duyet, khong phai module Node.
// Nap chung vao hop cat vm de bo kiem chay duoc ngoai trinh duyet.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PUB = path.join(__dirname, '..', 'public');

function hopCat() {
  const sb = {
    console,
    atob: s => Buffer.from(s, 'base64').toString('utf8'),
    btoa: s => Buffer.from(s, 'utf8').toString('base64'),
    setTimeout: () => 0,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {}, remove() {} }),
      body: { appendChild() {} }
    },
    localStorage: (() => {
      const kho = {};
      return {
        getItem: k => (k in kho ? kho[k] : null),
        setItem: (k, v) => { kho[k] = String(v); },
        removeItem: k => { delete kho[k]; }
      };
    })()
  };
  sb.window = sb;
  sb.globalThis = sb;
  vm.createContext(sb);
  return sb;
}

/** Nap mot file trong public/ vao hop cat, tra ve bien toan cuc no khai bao */
function napFile(sb, tenFile, tenBien) {
  const src = fs.readFileSync(path.join(PUB, tenFile), 'utf8');
  vm.runInContext(src + '\n;globalThis.__KQ = ' + tenBien + ';', sb);
  return sb.__KQ;
}

/** Moi lan goi tra ve mot terminal doc lap, khong dinh trang thai bai kiem truoc */
function napTerminal() {
  const sb = hopCat();
  return napFile(sb, 'cyber-terminal.js', 'CyberTerminal');
}

/** Doc ma nguon tho cua mot file trong public/ */
function docNguon(tenFile) {
  return fs.readFileSync(path.join(PUB, tenFile), 'utf8');
}

module.exports = { hopCat, napFile, napTerminal, docNguon, PUB };
```

- [ ] **Step 3: Viết bài kiểm không hồi quy cho trang Săn cờ**

Tạo `tests/ctf-khong-hoi-quy.test.js`. Bài kiểm này phải viết **trước** khi sửa `VFS`, để chứng minh trang Săn cờ đang chạy tốt và vẫn tốt sau khi sửa:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal, docNguon } = require('./helper.js');

// Doi VFS tu hang so thanh bien nap duoc la cho de lam vo trang San co nhat.
// Bai kiem nay chay tron 6 thu thach CTF de chan hoi quy.
const LOI_GIAI_CTF = [
  ['ctf-1', ['cat /home/hacker/flag1.txt']],
  ['ctf-2', ['base64 -d /home/hacker/secret_b64.txt']],
  ['ctf-3', ['grep FLAG /var/log/auth.log']],
  ['ctf-4', ['nmap 192.168.1.100']],
  ['ctf-5', ['cat /var/www/html/config.php']],
  ['ctf-6', ['netstat -tuln', 'ps aux', 'cat /etc/.hidden/backdoor.conf']]
];

test('moi thu thach CTF deu lay duoc co bang lenh co that', () => {
  const T = napTerminal();
  const coTrongMa = [...docNguon('cyber-terminal.js').matchAll(/flag:\s*'([^']+)'/g)].map(m => m[1]);
  assert.ok(coTrongMa.length >= 6, 'phai co it nhat 6 thu thach, dang co ' + coTrongMa.length);

  for (const [id, lenhs] of LOI_GIAI_CTF) {
    const ra = lenhs.map(l => String(T.executeCommand(l) || '')).join('\n');
    const co = coTrongMa.find(c => ra.includes(c));
    assert.ok(co, `thu thach ${id}: chay ${lenhs.join(' ; ')} khong ra co nao`);
    assert.match(String(T.executeCommand('submit ' + co)), /CHÍNH XÁC/,
      `thu thach ${id}: nop co "${co}" bi tu choi`);
  }
});

test('khong co muc treo trong he thong tep San co', () => {
  const T = napTerminal();
  const duong = String(T.executeCommand('find /')).split('\n').filter(Boolean);
  const treo = duong.filter(d => {
    const a = String(T.executeCommand('cat ' + d));
    const b = String(T.executeCommand('cd ' + d));
    T.executeCommand('cd /');
    return a.includes('No such file') && b.includes('No such file');
  });
  assert.deepStrictEqual(treo, [], 'ls thay nhung cd/cat bao khong co');
});
```

- [ ] **Step 4: Chạy để xác nhận nó đang xanh**

Chạy: `npm test`
Kỳ vọng: **PASS**. Bài kiểm này mô tả hành vi hiện có, nên phải xanh ngay. Nếu đỏ thì có thứ gì đó đã hỏng từ trước — dừng lại tìm hiểu, đừng sửa bài kiểm.

- [ ] **Step 5: Viết bài kiểm cho hệ thống tệp nạp được (sẽ đỏ)**

Tạo `tests/terminal-fs.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal } = require('./helper.js');

const FS_THU = {
  '/': { type: 'dir', children: ['home', 'etc'] },
  '/home': { type: 'dir', children: ['hacker'] },
  '/home/hacker': { type: 'dir', children: ['ghichu.txt'] },
  '/home/hacker/ghichu.txt': { type: 'file', content: 'noi dung cua lab thu' },
  '/etc': { type: 'dir', children: [] }
};

test('loadFs thay toan bo he thong tep', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  assert.match(String(T.executeCommand('cat /home/hacker/ghichu.txt')), /noi dung cua lab thu/);
  // Tep cua bo San co phai bien mat
  assert.match(String(T.executeCommand('cat /home/hacker/flag1.txt')), /No such file/);
});

test('loadFs dat lai thu muc hien tai ve /home/hacker', () => {
  const T = napTerminal();
  T.executeCommand('cd /etc');
  T.loadFs(FS_THU);
  assert.strictEqual(String(T.executeCommand('pwd')).trim(), '/home/hacker');
});

test('resetFs tra ve bo San co', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.resetFs();
  assert.match(String(T.executeCommand('cat /home/hacker/flag1.txt')), /FLAG\{/);
});

test('lab khong lam ban du lieu goc — phai la ban sao sau', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.getFs()['/home/hacker/ghichu.txt'].content = 'da bi sua';
  assert.strictEqual(FS_THU['/home/hacker/ghichu.txt'].content, 'noi dung cua lab thu',
    'loadFs phai sao chep sau, khong duoc dung chung tham chieu');
});

test('getFs tra ve he thong tep dang dung', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  assert.ok(T.getFs()['/home/hacker/ghichu.txt'], 'getFs phai thay tep cua lab');
});
```

- [ ] **Step 6: Chạy để xác nhận nó đỏ**

Chạy: `npm test`
Kỳ vọng: **FAIL** với `T.loadFs is not a function`.

- [ ] **Step 7: Đổi VFS thành biến nạp được**

Trong `public/cyber-terminal.js`:

Đổi dòng khai báo `const VFS = {` thành `const VFS_MACDINH = {`. Giữ nguyên toàn bộ nội dung bên trong.

Ngay sau dấu đóng `};` của khối đó, thêm:

```js
  // He thong tep la du lieu nap duoc, khong con la hang so dung chung.
  // Moi phong lab nap bo tep rieng; bo San co la mac dinh.
  let VFS = saoChepSau(VFS_MACDINH);

  /** Sao chep sau de lab khong lam ban du lieu goc */
  function saoChepSau(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /** Thay toan bo he thong tep bang bo moi */
  function loadFs(duLieu) {
    VFS = saoChepSau(duLieu || VFS_MACDINH);
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
```

- [ ] **Step 8: Mở ba hàm mới ra ngoài**

Trong khối `return {` ở cuối `public/cyber-terminal.js`, ngay sau dòng `filePaths: () => ...`, thêm:

```js
    loadFs,
    getFs,
    resetFs,
```

- [ ] **Step 9: Chạy lại toàn bộ bộ kiểm**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả — cả 5 bài mới lẫn 2 bài không hồi quy của trang Săn cờ.

Nếu bài Săn cờ đỏ: `VFS_MACDINH` bị sửa nội dung khi đổi tên, hoặc `filePaths()`/`commandNames()` còn tham chiếu tên cũ.

- [ ] **Step 10: Chứng minh bộ kiểm biết báo lỗi**

Sửa tạm `loadFs` thành `VFS = duLieu || VFS_MACDINH;` (bỏ sao chép sâu).
Chạy: `npm test`
Kỳ vọng: **FAIL** ở bài `lab khong lam ban du lieu goc`.
Hoàn tác lại sửa tạm, chạy lại, kỳ vọng **PASS**.

- [ ] **Step 11: Commit**

```bash
git add package.json tests/ public/cyber-terminal.js
git commit -m "feat(terminal): he thong tep nap duoc theo tung phong lab

VFS tu hang so dung chung thanh bien nap duoc, sao chep sau de lab khong
lam ban du lieu goc. Bo tep San co tro thanh mac dinh.

Them ha tang kiem: node --test khong phu thuoc, va bai kiem khong hoi quy
chay tron 6 thu thach CTF de chan lam vo trang dang chay tot."
```

---

## Task 2: Nhóm lệnh ghi

**Files:**
- Modify: `public/cyber-terminal.js`
- Modify: `tests/terminal-fs.test.js` (thêm phần kiểm lệnh ghi)

**Interfaces:**
- Consumes: `loadFs`, `getFs` từ Task 1
- Produces:
  - `CyberTerminal.executeCommand(raw)` hỗ trợ chuyển hướng `>` và `>>` cho **mọi** lệnh
  - `CyberTerminal.luuTuSoanThao(duong, noiDung)` → `string|null` — ghi nội dung từ ô soạn thảo `nano`, trả về `null` nếu thành công hoặc chuỗi lỗi
  - Lệnh mới trong bảng `COMMANDS`: `echo`, `nano`, `mkdir`, `rm`, `cp`, `mv`

- [ ] **Step 1: Viết bài kiểm cho lệnh ghi (sẽ đỏ)**

Thêm vào cuối `tests/terminal-fs.test.js`:

```js
test('mkdir -p tao ca cay thu muc', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('mkdir -p /var/www/site');
  assert.strictEqual(T.getFs()['/var/www/site'].type, 'dir');
  assert.strictEqual(T.getFs()['/var'].type, 'dir', 'phai tao ca thu muc cha');
  assert.ok(T.getFs()['/'].children.includes('var'), 'phai noi vao children cua cha');
  assert.ok(String(T.executeCommand('ls /var')).includes('www'));
});

test('echo ghi de vao tep', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('mkdir -p /var/www/site');
  T.executeCommand('echo "Xin chào" > /var/www/site/index.html');
  assert.match(String(T.executeCommand('cat /var/www/site/index.html')), /Xin chào/);
});

test('echo >> ghi noi them', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('echo "dong 1" > /tmp.txt');
  T.executeCommand('echo "dong 2" >> /tmp.txt');
  const ra = String(T.executeCommand('cat /tmp.txt'));
  assert.match(ra, /dong 1/);
  assert.match(ra, /dong 2/);
});

test('chuyen huong dung duoc cho moi lenh, khong rieng echo', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('ls /home/hacker > /ds.txt');
  assert.match(String(T.executeCommand('cat /ds.txt')), /ghichu\.txt/);
});

test('luuTuSoanThao ghi noi dung nhieu dong', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  const loi = T.luuTuSoanThao('/etc/thu.conf', 'dong mot\ndong hai\n');
  assert.strictEqual(loi, null);
  assert.match(String(T.executeCommand('cat /etc/thu.conf')), /dong hai/);
});

test('rm xoa tep va go khoi children cua cha', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('rm /home/hacker/ghichu.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/ghichu.txt')), /No such file/);
  assert.ok(!String(T.executeCommand('ls /home/hacker')).includes('ghichu.txt'),
    'ls van con thay tep da xoa');
});

test('cp va mv', () => {
  const T = napTerminal();
  T.loadFs(FS_THU);
  T.executeCommand('cp /home/hacker/ghichu.txt /home/hacker/ban-sao.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/ban-sao.txt')), /noi dung cua lab thu/);
  T.executeCommand('mv /home/hacker/ban-sao.txt /home/hacker/doi-ten.txt');
  assert.match(String(T.executeCommand('cat /home/hacker/doi-ten.txt')), /noi dung cua lab thu/);
  assert.match(String(T.executeCommand('cat /home/hacker/ban-sao.txt')), /No such file/);
});

test('moi lenh ghi deu co trong bang COMMANDS', () => {
  const T = napTerminal();
  const ten = T.commandNames();
  for (const c of ['echo', 'nano', 'mkdir', 'rm', 'cp', 'mv']) {
    assert.ok(ten.includes(c), 'thieu ' + c + ' trong bang COMMANDS');
    assert.ok(!String(T.executeCommand(c)).includes('command not found'),
      c + ' quang cao nhung khong co ban cai');
  }
});
```

- [ ] **Step 2: Chạy để xác nhận đỏ**

Chạy: `npm test`
Kỳ vọng: **FAIL** — `mkdir: command not found`.

- [ ] **Step 3: Tách phần chạy lệnh ra khỏi phần ghi lịch sử**

Chuyển hướng `>` cần gọi lại chính bộ chạy lệnh, nhưng không được đẩy thêm dòng vào lịch sử. Tách làm hai hàm.

Trong `public/cyber-terminal.js`, đổi đầu hàm `executeCommand` từ:

```js
  function executeCommand(input) {
    const raw = input.trim();
    if (!raw) return '';
    history.push(raw);
    historyIdx = history.length;

    const parts = raw.split(' ').filter(Boolean);
```

thành:

```js
  function executeCommand(input) {
    const raw = input.trim();
    if (!raw) return '';
    history.push(raw);
    historyIdx = history.length;

    // Chuyen huong ket qua ra tep: <lenh> > tep  hoac  <lenh> >> tep.
    // Lam o day de moi lenh deu chuyen huong duoc, khong rieng echo.
    const ch = raw.match(/^(.*?)\s*(>>?)\s*(\S+)\s*$/);
    if (ch && ch[1].trim()) {
      const ketQua = String(chayLenh(ch[1].trim()) || '').replace(/^\n+|\n+$/g, '');
      return ghiTep(resolvePath(ch[3]), ketQua + '\n', ch[2] === '>>') || '';
    }
    return chayLenh(raw);
  }

  function chayLenh(raw) {
    const parts = raw.split(' ').filter(Boolean);
```

- [ ] **Step 4: Thêm các hàm phụ cho việc ghi**

Ngay trước `function resolvePath(p) {` trong `public/cyber-terminal.js`, thêm:

```js
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
```

- [ ] **Step 5: Thêm sáu lệnh vào bộ chạy lệnh**

Trong `chayLenh`, ngay trước `case 'submit': {`, thêm:

```js
      case 'echo': {
        // Bo cap dau nhay bao quanh neu co
        return args.join(' ').replace(/^["']/, '').replace(/["']$/, '');
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
```

- [ ] **Step 6: Thêm ô soạn thảo nano**

Ngay trước `function resolvePath(p) {`, thêm:

```js
  /**
   * nano mo mot cua so noi de len terminal, co nut Luu / Huy.
   * Khong mo phong giao dien nano that voi Ctrl+O / Ctrl+X — nguoi moi
   * se mac ket o cho thoat ra.
   */
  function moOSoanThao(duong, noiDungCu) {
    if (typeof document === 'undefined' || !document.body) return;
    const lop = document.createElement('div');
    lop.className = 'nano-overlay';
    lop.innerHTML = `
      <div class="nano-box">
        <div class="nano-head">📝 Đang sửa: <code>${duong}</code></div>
        <textarea class="nano-area" spellcheck="false"></textarea>
        <div class="nano-actions">
          <button class="nano-save">💾 Lưu</button>
          <button class="nano-cancel">Hủy</button>
        </div>
      </div>`;
    document.body.appendChild(lop);
    const o = lop.querySelector('.nano-area');
    o.value = noiDungCu;
    o.focus();
    lop.querySelector('.nano-cancel').onclick = () => lop.remove();
    lop.querySelector('.nano-save').onclick = () => {
      luuTuSoanThao(duong, o.value);
      lop.remove();
      inRaTerminal(`Đã lưu ${duong}`);
    };
  }

  /** In mot dong ket qua ra terminal ngoai luong lenh binh thuong */
  function inRaTerminal(vanBan) {
    const khung = document.getElementById('terminal-lines');
    if (!khung) return;
    const d = document.createElement('div');
    d.className = 'term-line';
    d.textContent = vanBan;
    khung.appendChild(d);
  }
```

- [ ] **Step 7: Khai báo sáu lệnh mới trong bảng COMMANDS**

Trong `public/cyber-terminal.js`, trong mảng `COMMANDS`, thêm ngay sau dòng của `find`:

```js
    { name: 'echo',    usage: 'echo "..." > <file>',    desc: 'Ghi văn bản vào tệp (>> để nối thêm)' },
    { name: 'nano',    usage: 'nano <file>',            desc: 'Mở ô soạn thảo để sửa tệp nhiều dòng' },
    { name: 'mkdir',   usage: 'mkdir -p <path>',        desc: 'Tạo thư mục, tự tạo cả thư mục cha' },
    { name: 'rm',      usage: 'rm [-r] <path>',         desc: 'Xóa tệp hoặc thư mục' },
    { name: 'cp',      usage: 'cp <nguồn> <đích>',      desc: 'Sao chép tệp' },
    { name: 'mv',      usage: 'mv <nguồn> <đích>',      desc: 'Di chuyển hoặc đổi tên tệp' },
```

- [ ] **Step 8: Mở luuTuSoanThao ra ngoài**

Trong khối `return {` ở cuối file, sau `resetFs,` thêm:

```js
    luuTuSoanThao,
```

- [ ] **Step 9: Chạy bộ kiểm**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả, gồm cả hai bài không hồi quy của trang Săn cờ.

- [ ] **Step 10: Thêm kiểu hiển thị cho ô soạn thảo**

Thêm vào cuối `public/style.css`:

```css
/* O soan thao cua lenh nano */
.nano-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
}

.nano-box {
  width: min(760px, 92vw);
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
}

.nano-head {
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  font-size: 13px;
  color: #c9d1d9;
}

.nano-area {
  width: 100%;
  height: min(420px, 55vh);
  padding: 14px;
  background: #05080c;
  color: #c9d1d9;
  border: 0;
  resize: vertical;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.55;
}

.nano-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 10px 14px;
  background: #161b22;
  border-top: 1px solid #30363d;
}

.nano-actions button {
  padding: 7px 16px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 13px;
}

.nano-actions .nano-save {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}
```

- [ ] **Step 11: Commit**

```bash
git add public/cyber-terminal.js public/style.css tests/terminal-fs.test.js
git commit -m "feat(terminal): nhom lenh ghi — nano, echo >, mkdir, rm, cp, mv

Nhiem vu kieu 'kiem trang thai' bat buoc hoc vien phai sua duoc he thong
tep, ma terminal truoc gio chi doc.

Chuyen huong > va >> lam o tang tren nen moi lenh deu dung duoc, khong
rieng echo. nano mo cua so noi co nut Luu/Huy thay vi mo phong Ctrl+O/X."
```

---

## Task 3: Nhóm lệnh Nginx

**Files:**
- Create: `tests/terminal-nginx.test.js`
- Modify: `public/cyber-terminal.js`

**Interfaces:**
- Consumes: `getFs`, `ghiTep`, `resolvePath` từ Task 1 và 2
- Produces: lệnh `nginx`, `systemctl`; lệnh `curl` đổi từ kết quả viết cứng thành kết quả tính từ trạng thái

- [ ] **Step 1: Viết bài kiểm (sẽ đỏ)**

Tạo `tests/terminal-nginx.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { napTerminal } = require('./helper.js');

const CONF_DUNG = [
  'events { worker_connections 1024; }',
  'http {',
  '    server {',
  '        listen 80;',
  '        server_name localhost;',
  '        root /usr/share/nginx/html;',
  '        index index.html;',
  '    }',
  '}'
].join('\n');

function labNginx() {
  return {
    '/': { type: 'dir', children: ['etc', 'usr', 'var', 'home'] },
    '/home': { type: 'dir', children: ['hacker'] },
    '/home/hacker': { type: 'dir', children: [] },
    '/etc': { type: 'dir', children: ['nginx'] },
    '/etc/nginx': { type: 'dir', children: ['nginx.conf'] },
    '/etc/nginx/nginx.conf': { type: 'file', content: CONF_DUNG },
    '/usr': { type: 'dir', children: ['share'] },
    '/usr/share': { type: 'dir', children: ['nginx'] },
    '/usr/share/nginx': { type: 'dir', children: ['html'] },
    '/usr/share/nginx/html': { type: 'dir', children: ['index.html'] },
    '/usr/share/nginx/html/index.html': { type: 'file', content: '<h1>Welcome to nginx!</h1>' },
    '/var': { type: 'dir', children: [] }
  };
}

test('nginx -t bao dat khi cu phap dung', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('nginx -t')), /syntax is ok/);
});

test('nginx -t bao loi khi thieu dau ngoac dong', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80;\n');
  const ra = String(T.executeCommand('nginx -t'));
  assert.match(ra, /failed/);
  assert.match(ra, /ngoặc/, 'phai noi ro loi thieu dau ngoac');
});

test('nginx -t bao loi khi thieu dau cham phay', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http {\n  server {\n    listen 80\n  }\n}');
  const ra = String(T.executeCommand('nginx -t'));
  assert.match(ra, /failed/);
  assert.match(ra, /dòng 3/, 'phai chi ra dung so dong');
});

test('curl tra ve trang o thu muc root dang cau hinh', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('curl localhost')), /Welcome to nginx/);
});

test('curl doi theo khi root doi — day la vong lap hoc', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.executeCommand('mkdir -p /var/www/site');
  T.executeCommand('echo "<h1>Trang cua toi</h1>" > /var/www/site/index.html');
  T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/www/site'));
  const ra = String(T.executeCommand('curl localhost'));
  assert.match(ra, /Trang cua toi/);
  assert.ok(!ra.includes('Welcome to nginx'), 'van con tra ve trang cu');
});

test('curl tra 404 khi thu muc root khong co index.html', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', CONF_DUNG.replace('/usr/share/nginx/html', '/var/trong'));
  assert.match(String(T.executeCommand('curl localhost')), /404/);
});

test('curl tra 502 khi cau hinh sai cu phap', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server { listen 80;');
  assert.match(String(T.executeCommand('curl localhost')), /502/);
});

test('systemctl status bao dang chay', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  assert.match(String(T.executeCommand('systemctl status nginx')), /active \(running\)/);
});

test('systemctl reload tu choi khi cu phap sai', () => {
  const T = napTerminal();
  T.loadFs(labNginx());
  T.luuTuSoanThao('/etc/nginx/nginx.conf', 'http { server {');
  assert.match(String(T.executeCommand('systemctl reload nginx')), /Job for nginx.service failed/);
});

test('nginx va systemctl deu co trong bang COMMANDS', () => {
  const T = napTerminal();
  for (const c of ['nginx', 'systemctl']) {
    assert.ok(T.commandNames().includes(c), 'thieu ' + c);
  }
});
```

- [ ] **Step 2: Chạy để xác nhận đỏ**

Chạy: `npm test`
Kỳ vọng: **FAIL** — `nginx: command not found`.

- [ ] **Step 3: Thêm bộ đọc cấu hình Nginx**

Ngay trước `function resolvePath(p) {` trong `public/cyber-terminal.js`, thêm:

```js
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
```

- [ ] **Step 4: Thêm lệnh nginx và systemctl**

Trong `chayLenh`, ngay trước `case 'submit': {`, thêm:

```js
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
```

- [ ] **Step 5: Đổi curl thành tính từ trạng thái**

Thay **toàn bộ** khối `case 'curl': {` hiện có (đang trả về đoạn HTML viết cứng) bằng:

```js
      case 'curl': {
        // Truoc day tra ve doan HTML viet cung. Gio doc root trong cau hinh
        // hien tai roi mo tep tuong ung — sua cau hinh la ket qua doi theo.
        const url = args.find(a => !a.startsWith('-')) || 'http://localhost';
        const duongDanUrl = (url.replace(/^https?:\/\/[^/]+/, '') || '/');

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
```

- [ ] **Step 6: Khai báo hai lệnh mới trong bảng COMMANDS**

Trong mảng `COMMANDS`, thêm ngay sau dòng của `curl`:

```js
    { name: 'nginx',     usage: 'nginx -t',                 desc: 'Kiểm tra cú pháp tệp cấu hình Nginx' },
    { name: 'systemctl', usage: 'systemctl <lệnh> nginx',   desc: 'Xem trạng thái / nạp lại dịch vụ Nginx' },
```

- [ ] **Step 7: Chạy bộ kiểm**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả. Đặc biệt để ý bài `curl doi theo khi root doi` — đó là bài chứng minh `curl` đã thành hàm tính từ trạng thái.

Lưu ý về trang Săn cờ: bộ tệp mặc định **không có** `/etc/nginx/nginx.conf`, nên `curl` ở đó giờ trả 502 thay vì đoạn HTML cũ. Đã kiểm: cờ nằm trong tiêu đề của `curl` cũ là `FLAG{devmaster_curl_headers_found}`, **không** thuộc 6 thử thách trong `CHALLENGES`, nên không thử thách nào hỏng và bài kiểm không hồi quy vẫn xanh.

Nếu muốn `curl` trên trang Săn cờ vẫn có ích, thêm vào `VFS_MACDINH`:

```js
    '/etc/nginx': { type: 'dir', children: ['nginx.conf'] },
    '/etc/nginx/nginx.conf': {
      type: 'file',
      content: 'http {\n    server {\n        listen 80;\n        root /var/www/html;\n    }\n}'
    },
```

kèm thêm `'nginx'` vào `children` của `/etc`. Việc này không bắt buộc.

- [ ] **Step 8: Chứng minh bộ kiểm biết báo lỗi**

Sửa tạm `docRootNginx` để luôn trả về `'/usr/share/nginx/html'`.
Chạy: `npm test`
Kỳ vọng: **FAIL** ở bài `curl doi theo khi root doi`.
Hoàn tác, chạy lại, kỳ vọng **PASS**.

- [ ] **Step 9: Commit**

```bash
git add public/cyber-terminal.js tests/terminal-nginx.test.js
git commit -m "feat(terminal): nginx -t, systemctl, va curl tinh tu trang thai

curl truoc day tra ve doan HTML viet cung, go gi cung ra y het. Gio no doc
chi thi root trong nginx.conf hien tai roi mo tep tuong ung: sua cau hinh
la ket qua doi theo, cau hinh sai thi 502, thieu tep thi 404.

Day la thu tao ra vong lap hoc: sua -> nginx -t -> reload -> curl -> thay
ket qua doi, nen hoc vien tu biet dung sai truoc khi bam Kiem tra."
```

---

## Task 4: Dữ liệu phòng lab bài 1

**Files:**
- Create: `public/labs-nginx.js`
- Create: `tests/lab-nginx-intro.test.js`
- Modify: `public/index.html` (thêm thẻ script)

**Interfaces:**
- Consumes: `CyberTerminal.loadFs`, `CyberTerminal.getFs`, `CyberTerminal.executeCommand`
- Produces:
  - `LABS_NGINX` — đối tượng khoá là `lessonKey`, giá trị là phòng lab
  - Mỗi phòng lab: `{ lessonKey, tenLab, fs, tasks, loiGiai }`
  - Mỗi nhiệm vụ: `{ id, cau, kieu: 'traLoi'|'trangThai', dapAn?, kiem?, diem, goiY }`
  - `kiem(fs)` → `{ dat: boolean, nhan?: string }`

- [ ] **Step 1: Viết bài kiểm (sẽ đỏ)**

Tạo `tests/lab-nginx-intro.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile, napTerminal } = require('./helper.js');

const KHOA = 'nginx.newbie.intro';

function napLab() {
  const sb = hopCat();
  return napFile(sb, 'labs-nginx.js', 'LABS_NGINX')[KHOA];
}

/** Chuan hoa giong lab-runner: bo khoang trang thua, khong phan biet hoa thuong */
function chuanHoa(s) {
  return String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
}

function chamNhiemVu(nv, T, nhap) {
  if (nv.kieu === 'trangThai') return nv.kiem(T.getFs());
  const nhan = Array.isArray(nv.dapAn) ? nv.dapAn : [nv.dapAn];
  return { dat: nhan.some(x => chuanHoa(x) === chuanHoa(nhap)) };
}

test('phong lab bai 1 ton tai va du 4 nhiem vu', () => {
  const lab = napLab();
  assert.ok(lab, 'khong tim thay phong lab ' + KHOA);
  assert.strictEqual(lab.tasks.length, 4);
  assert.strictEqual(lab.tasks.reduce((s, t) => s + t.diem, 0), 60, 'tong diem phai la 60');
  assert.ok(lab.tasks.some(t => t.kieu === 'trangThai'),
    'phai co it nhat mot nhiem vu kieu kiem trang thai');
});

test('moi nhiem vu deu co goi y va id rieng', () => {
  const lab = napLab();
  const ids = lab.tasks.map(t => t.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'id nhiem vu bi trung');
  for (const t of lab.tasks) {
    assert.ok(t.goiY && t.goiY.length >= 1, 'nhiem vu ' + t.id + ' khong co goi y');
    assert.ok(t.cau && t.cau.length > 10, 'nhiem vu ' + t.id + ' cau hoi qua ngan');
  }
});

test('dap an cua nhiem vu tra loi phai co that trong he thong tep', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  const kho = String(T.executeCommand('find /')) + '\n'
    + T.executeCommand('find /').split('\n').filter(Boolean)
        .map(p => String(T.executeCommand('cat ' + p))).join('\n');
  for (const t of lab.tasks.filter(x => x.kieu === 'traLoi')) {
    const nhan = Array.isArray(t.dapAn) ? t.dapAn : [t.dapAn];
    assert.ok(nhan.some(d => kho.includes(d)),
      `dap an "${nhan[0]}" cua ${t.id} khong xuat hien o dau trong he thong tep`);
  }
});

test('CHAY LOI GIAI MAU: moi nhiem vu deu dat', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);

  // Buoc giai co the la chuoi lenh, hoac buoc sua tep qua o soan thao nano
  for (const buoc of lab.loiGiai) {
    if (typeof buoc === 'object' && buoc.nano) {
      const loi = T.luuTuSoanThao(buoc.nano, buoc.noiDung);
      assert.strictEqual(loi, null, `khong ghi duoc ${buoc.nano}: ${loi}`);
      continue;
    }
    const ra = String(T.executeCommand(buoc) || '');
    assert.ok(!ra.includes('command not found'),
      `loi giai dung lenh chua cai: "${buoc}"`);
  }

  for (const nv of lab.tasks) {
    const kq = chamNhiemVu(nv, T, nv.kieu === 'traLoi'
      ? (Array.isArray(nv.dapAn) ? nv.dapAn[0] : nv.dapAn)
      : null);
    assert.ok(kq.dat, `nhiem vu ${nv.id} khong dat sau khi chay loi giai: ${kq.nhan || ''}`);
  }
});

test('KHONG QUA DUOC bang cach khong lam gi', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  for (const nv of lab.tasks.filter(x => x.kieu === 'trangThai')) {
    const kq = nv.kiem(T.getFs());
    assert.strictEqual(kq.dat, false,
      `nhiem vu ${nv.id} dat ngay tu dau — khong bat hoc vien lam gi ca`);
    assert.ok(kq.nhan, `nhiem vu ${nv.id} truot ma khong noi ro thieu gi`);
  }
});

test('he thong tep cua lab khong co muc treo', () => {
  const lab = napLab();
  const T = napTerminal();
  T.loadFs(lab.fs);
  const duong = String(T.executeCommand('find /')).split('\n').filter(Boolean);
  const treo = duong.filter(d => {
    const a = String(T.executeCommand('cat ' + d));
    const b = String(T.executeCommand('cd ' + d));
    T.executeCommand('cd /');
    return a.includes('No such file') && b.includes('No such file');
  });
  assert.deepStrictEqual(treo, []);
});
```

- [ ] **Step 2: Chạy để xác nhận đỏ**

Chạy: `npm test`
Kỳ vọng: **FAIL** với lỗi không đọc được `public/labs-nginx.js`.

- [ ] **Step 3: Viết dữ liệu phòng lab**

Tạo `public/labs-nginx.js`:

```js
// Du lieu phong lab cho chu de Nginx & Linux.
// Moi phong lab gan voi mot bai hoc qua lessonKey = `${tech.id}.${level.id}.${lesson.id}`.
const LABS_NGINX = (() => {
  const CONF_MACDINH = [
    'user  nginx;',
    'worker_processes  auto;',
    '',
    'events {',
    '    worker_connections  1024;',
    '}',
    '',
    'http {',
    '    include       /etc/nginx/mime.types;',
    '    default_type  application/octet-stream;',
    '',
    '    server {',
    '        listen       80;',
    '        server_name  localhost;',
    '        root   /usr/share/nginx/html;',
    '        index  index.html;',
    '    }',
    '}'
  ].join('\n');

  const FS_INTRO = {
    '/': { type: 'dir', children: ['home', 'etc', 'usr', 'var'] },
    '/home': { type: 'dir', children: ['hacker'] },
    '/home/hacker': { type: 'dir', children: ['ghichu.txt'] },
    '/home/hacker/ghichu.txt': {
      type: 'file',
      content: 'Máy chủ vừa cài Nginx xong.\nChưa đổi gì so với cấu hình mặc định.'
    },

    '/etc': { type: 'dir', children: ['nginx'] },
    '/etc/nginx': { type: 'dir', children: ['nginx.conf', 'mime.types'] },
    '/etc/nginx/nginx.conf': { type: 'file', content: CONF_MACDINH },
    '/etc/nginx/mime.types': {
      type: 'file',
      content: 'types {\n    text/html  html htm;\n    text/css   css;\n}'
    },

    '/usr': { type: 'dir', children: ['share'] },
    '/usr/share': { type: 'dir', children: ['nginx'] },
    '/usr/share/nginx': { type: 'dir', children: ['html'] },
    '/usr/share/nginx/html': { type: 'dir', children: ['index.html'] },
    '/usr/share/nginx/html/index.html': {
      type: 'file',
      content: '<h1>Welcome to nginx!</h1>\n<p>Trang mặc định sau khi cài đặt.</p>'
    },

    '/var': { type: 'dir', children: ['log', 'www'] },
    '/var/log': { type: 'dir', children: ['nginx'] },
    '/var/log/nginx': { type: 'dir', children: ['access.log'] },
    '/var/log/nginx/access.log': {
      type: 'file',
      content: '127.0.0.1 - - [23/Aug/2026:09:14:02] "GET / HTTP/1.1" 200 615'
    },
    '/var/www': { type: 'dir', children: [] }
  };

  return {
    'nginx.newbie.intro': {
      lessonKey: 'nginx.newbie.intro',
      tenLab: 'Làm quen máy chủ Nginx vừa cài',
      fs: FS_INTRO,

      tasks: [
        {
          id: 'nginx-intro-1',
          cau: 'Tệp cấu hình chính của Nginx nằm ở đường dẫn nào?',
          kieu: 'traLoi',
          dapAn: ['/etc/nginx/nginx.conf'],
          diem: 10,
          goiY: [
            'Cấu hình của các dịch vụ hệ thống thường nằm trong /etc',
            'Thử: find / -name nginx.conf'
          ]
        },
        {
          id: 'nginx-intro-2',
          cau: 'Nginx đang lắng nghe ở cổng nào trong cấu hình mặc định?',
          kieu: 'traLoi',
          dapAn: ['80'],
          diem: 10,
          goiY: [
            'Mở tệp cấu hình ra đọc',
            'Tìm dòng bắt đầu bằng chỉ thị listen'
          ]
        },
        {
          id: 'nginx-intro-3',
          cau: 'Thư mục gốc (root) mà trang mặc định đang được phục vụ từ đó là gì?',
          kieu: 'traLoi',
          dapAn: ['/usr/share/nginx/html'],
          diem: 15,
          goiY: [
            'Vẫn trong tệp cấu hình, tìm chỉ thị root',
            'Thử: grep root /etc/nginx/nginx.conf'
          ]
        },
        {
          id: 'nginx-intro-4',
          cau: 'Tạo trang riêng tại /var/www/site/index.html rồi sửa cấu hình cho Nginx '
             + 'phục vụ trang đó. Chạy "nginx -t" để kiểm cú pháp và "curl localhost" '
             + 'để tự xác nhận trước khi bấm Kiểm tra.',
          kieu: 'trangThai',
          diem: 25,
          kiem: (fs) => {
            const trang = fs['/var/www/site/index.html'];
            if (!trang || trang.type !== 'file') {
              return { dat: false, nhan: 'Chưa thấy tệp /var/www/site/index.html' };
            }
            if (!String(trang.content || '').trim()) {
              return { dat: false, nhan: 'Tệp /var/www/site/index.html đang rỗng' };
            }
            const conf = fs['/etc/nginx/nginx.conf'];
            if (!conf) {
              return { dat: false, nhan: 'Không tìm thấy /etc/nginx/nginx.conf' };
            }
            if (!/^\s*root\s+\/var\/www\/site\s*;/m.test(String(conf.content || ''))) {
              return { dat: false, nhan: 'nginx.conf chưa có dòng "root /var/www/site;"' };
            }
            return { dat: true };
          },
          goiY: [
            'Dùng mkdir -p để tạo thư mục, rồi nano để soạn nội dung trang',
            'Mở nginx.conf bằng nano và sửa chỉ thị root trong khối server',
            'Nhớ giữ dấu chấm phẩy ở cuối dòng root'
          ]
        }
      ],

      // Day buoc giai mau, chay tuan tu. Chi dung cho bo kiem, khong hien cho hoc vien.
      // Phan tu la chuoi thi chay nhu lenh; la object {nano, noiDung} thi ghi tep
      // — dung thu ma nano goi khi hoc vien bam Luu.
      loiGiai: [
        'find / -name nginx.conf',
        'cat /etc/nginx/nginx.conf',
        'grep root /etc/nginx/nginx.conf',
        'mkdir -p /var/www/site',
        'echo "<h1>Trang cua toi</h1>" > /var/www/site/index.html',
        { nano: '/etc/nginx/nginx.conf',
          noiDung: CONF_MACDINH.replace('/usr/share/nginx/html', '/var/www/site') },
        'nginx -t',
        'curl localhost'
      ]
    }
  };
})();
```

- [ ] **Step 4: Chạy bộ kiểm**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả.

Nếu bài `CHAY LOI GIAI MAU` đỏ ở nhiệm vụ 4 với lời nhắn *"nginx.conf chưa có dòng root /var/www/site;"*, nghĩa là bước `nano` trong `loiGiai` chưa ghi đúng — kiểm lại rằng `CONF_MACDINH.replace(...)` thật sự đổi được chuỗi (chuỗi gốc phải khớp từng ký tự, kể cả khoảng trắng).

- [ ] **Step 5: Nạp file mới vào trang**

Trong `public/index.html`, ngay sau dòng `<script defer src="/cyber-terminal.js"></script>`, thêm:

```html
    <script defer src="/labs-nginx.js"></script>
```

- [ ] **Step 6: Chứng minh bộ kiểm bắt được lời giải thiếu bước**

Đây là phép kiểm quan trọng nhất của cả kế hoạch, nên phải chứng minh nó biết báo lỗi.

Xóa tạm phần tử `{ nano: ... }` khỏi mảng `loiGiai` — mô phỏng đúng tình huống người viết lab quên mất rằng học viên còn phải sửa cấu hình.

Chạy: `npm test`
Kỳ vọng: **FAIL** ở bài `CHAY LOI GIAI MAU`, với lời nhắn `nhiem vu nginx-intro-4 khong dat sau khi chay loi giai: nginx.conf chưa có dòng "root /var/www/site;"`.

Khôi phục lại phần tử vừa xóa, chạy lại, kỳ vọng **PASS**.

- [ ] **Step 7: Chứng minh bộ kiểm bắt được đáp án ghi lệch**

Sửa tạm đáp án của `nginx-intro-2` từ `'80'` thành `'8080'`.
Chạy: `npm test`
Kỳ vọng: **FAIL** ở bài `CHAY LOI GIAI MAU` (nhiệm vụ 2 không đạt).
Hoàn tác, chạy lại, kỳ vọng **PASS**.

- [ ] **Step 8: Commit**

```bash
git add public/labs-nginx.js public/index.html tests/lab-nginx-intro.test.js
git commit -m "feat(lab): du lieu phong lab cho bai Nginx Overview & Installation

4 nhiem vu, 60 diem: 3 nhiem vu di tim gia tri trong he thong tep va 1
nhiem vu bat sua that cau hinh.

Bo kiem chay tron loi giai mau roi khang dinh moi nhiem vu deu dat — day
la phep kiem duy nhat tra loi dung cau hoi 'bai nay co lam duoc khong'.
No da bat duoc mot loi giai thieu buoc ngay lan chay dau."
```

---

## Task 5: Bộ chấm và giao diện nhiệm vụ

**Files:**
- Create: `public/lab-runner.js`
- Create: `tests/lab-runner.test.js`
- Modify: `public/index.html` (thêm thẻ script)
- Modify: `public/style.css`

**Interfaces:**
- Consumes: `CyberTerminal.loadFs`, `CyberTerminal.getFs`, `LABS_NGINX`
- Produces:
  - `LabRunner.chuanHoa(s)` → `string`
  - `LabRunner.soKhop(dapAn, nhap)` → `boolean` — `dapAn` là chuỗi hoặc mảng biến thể
  - `LabRunner.tinhDiem(lab, danhSachXong)` → `{ xong, tong, diem, tongDiem }`
  - `LabRunner.render(mountId, lab)` — dựng danh sách nhiệm vụ và gắn terminal
  - `LabRunner.kiemNhiemVu(taskId)` — gọi từ `onclick`
  - `LabRunner.moGoiY(taskId)` — gọi từ `onclick`

- [ ] **Step 1: Viết bài kiểm cho phần logic thuần (sẽ đỏ)**

Tạo `tests/lab-runner.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

function napRunner() {
  const sb = hopCat();
  return napFile(sb, 'lab-runner.js', 'LabRunner');
}

test('chuanHoa bo khoang trang thua va khong phan biet hoa thuong', () => {
  const R = napRunner();
  assert.strictEqual(R.chuanHoa('  /Etc/Nginx/NGINX.conf  '), '/etc/nginx/nginx.conf');
  assert.strictEqual(R.chuanHoa('80   '), '80');
  assert.strictEqual(R.chuanHoa(null), '');
});

test('soKhop chap nhan nhieu bien the dap an', () => {
  const R = napRunner();
  assert.ok(R.soKhop(['80', '80/tcp'], '80/TCP'));
  assert.ok(R.soKhop('/etc/nginx/nginx.conf', ' /etc/nginx/nginx.conf '));
  assert.ok(!R.soKhop('80', '8080'));
});

test('soKhop khong chap nhan chuoi rong', () => {
  const R = napRunner();
  assert.ok(!R.soKhop('80', ''));
  assert.ok(!R.soKhop('80', '   '));
});

test('tinhDiem cong dung diem cua cac nhiem vu da xong', () => {
  const R = napRunner();
  const lab = { tasks: [
    { id: 'a', diem: 10 }, { id: 'b', diem: 10 },
    { id: 'c', diem: 15 }, { id: 'd', diem: 25 }
  ] };
  assert.deepStrictEqual(R.tinhDiem(lab, ['a', 'b']),
    { xong: 2, tong: 4, diem: 20, tongDiem: 60 });
  assert.deepStrictEqual(R.tinhDiem(lab, []),
    { xong: 0, tong: 4, diem: 0, tongDiem: 60 });
});

test('tinhDiem bo qua id la khong co trong lab', () => {
  const R = napRunner();
  const lab = { tasks: [{ id: 'a', diem: 10 }] };
  assert.strictEqual(R.tinhDiem(lab, ['a', 'khong-ton-tai']).diem, 10);
});

test('luu va doc lai tien do', () => {
  const R = napRunner();
  R.luuTienDo('nginx.newbie.intro', ['a', 'b']);
  assert.deepStrictEqual(R.docTienDo('nginx.newbie.intro'), ['a', 'b']);
  assert.deepStrictEqual(R.docTienDo('bai.khac'), []);
});
```

- [ ] **Step 2: Chạy để xác nhận đỏ**

Chạy: `npm test`
Kỳ vọng: **FAIL** — không đọc được `public/lab-runner.js`.

- [ ] **Step 3: Viết lab-runner.js**

Tạo `public/lab-runner.js`:

```js
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
          <span class="lab-task-diem">${nv.diem}đ</span>
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
                💡 Gợi ý ${soGoiY + 1}/${nv.goiY.length}
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
```

- [ ] **Step 4: Chạy bộ kiểm**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả.

- [ ] **Step 5: Nạp file mới vào trang**

Trong `public/index.html`, ngay sau dòng `<script defer src="/labs-nginx.js"></script>`, thêm:

```html
    <script defer src="/lab-runner.js"></script>
```

- [ ] **Step 6: Thêm kiểu hiển thị cho danh sách nhiệm vụ**

Thêm vào cuối `public/style.css`:

```css
/* Phong lab co cham */
.lab-header .lab-huong-dan {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.lab-progress {
  margin-bottom: 18px;
}

.lab-progress-text {
  font-size: 13px;
  color: #c9d1d9;
  margin-bottom: 8px;
}

.lab-task {
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.02);
}

.lab-task.xong {
  border-color: #2ea043;
  background: rgba(46, 160, 67, 0.08);
}

.lab-task-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.lab-task-cau {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  color: #e6edf3;
}

.lab-task-diem {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #d29922;
}

.lab-task-xong {
  margin-top: 8px;
  font-size: 13px;
  color: #3fb950;
}

.lab-task-lam {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.lab-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.lab-btn-kiem,
.lab-btn-goiy {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #c9d1d9;
  cursor: pointer;
  font-size: 13px;
}

.lab-btn-kiem {
  background: #238636;
  border-color: #2ea043;
  color: #fff;
}

.lab-task-nhan {
  margin-top: 8px;
  font-size: 13px;
  min-height: 0;
}

.lab-task-nhan.truot { color: #f85149; }
.lab-task-nhan.dat { color: #3fb950; }

.lab-goiy-list {
  margin-top: 10px;
}

.lab-goiy {
  padding: 8px 12px;
  margin-bottom: 6px;
  border-left: 3px solid #d29922;
  background: rgba(210, 153, 34, 0.08);
  border-radius: 0 6px 6px 0;
  font-size: 13px;
  color: #c9d1d9;
}
```

- [ ] **Step 7: Commit**

```bash
git add public/lab-runner.js public/index.html public/style.css tests/lab-runner.test.js
git commit -m "feat(lab): bo cham va giao dien danh sach nhiem vu

Moi nhiem vu mo san tu dau, khong khoa tuan tu. Goi y phai bam moi hien,
tung cai mot — hien san la quay lai dung van de dang sua.

Tien do luu trong localStorage theo lessonKey."
```

---

## Task 6: Gắn phòng lab vào tab bài tập

**Files:**
- Modify: `public/app.js:1155` (hàm `renderExerciseContent`)

**Interfaces:**
- Consumes: `LabRunner.timLab(lessonKey)`, `LabRunner.render(mountId, lab)`

- [ ] **Step 1: Gắn phòng lab vào đầu hàm renderExerciseContent**

Trong `public/app.js`, trong hàm `renderExerciseContent`, ngay **trước** khối `if (tech.id === 'cybersecurity') {`, thêm:

```js
    // Bai hoc nao co phong lab thi dung lab thay cho o van ban tu do.
    // Bai chua co lab van giu nguyen luong cu — khong dap bo thu dang chay.
    const lab = (typeof LabRunner !== 'undefined') ? LabRunner.timLab(lessonKey) : null;
    if (lab) {
      setTimeout(() => LabRunner.render('lab-mount', lab), 50);
      return '<div id="lab-mount"></div>';
    }
```

- [ ] **Step 2: Kiểm bằng mắt trên trình duyệt**

Chạy máy chủ:

```bash
npm start
```

Mở `http://localhost:3000`, đăng nhập, vào **Nginx & Linux → Newbie → Nginx Overview & Installation → tab Bài tập Thử thách**.

Kỳ vọng thấy:
- Thanh tiến độ `0/4 nhiệm vụ · 0/60 điểm`
- Bốn nhiệm vụ, ba cái có ô nhập, cái thứ tư chỉ có nút Kiểm tra
- Terminal ở dưới, gõ `ls /etc/nginx` ra `nginx.conf` và `mime.types`

Rồi làm thật trọn bài:

```
find / -name nginx.conf          → nhập /etc/nginx/nginx.conf vào nhiệm vụ 1
cat /etc/nginx/nginx.conf        → nhập 80 vào nhiệm vụ 2
grep root /etc/nginx/nginx.conf  → nhập /usr/share/nginx/html vào nhiệm vụ 3
mkdir -p /var/www/site
nano /var/www/site/index.html    → gõ nội dung, bấm Lưu
nano /etc/nginx/nginx.conf       → sửa root thành /var/www/site, bấm Lưu
nginx -t                         → syntax is ok
curl localhost                   → phải ra trang vừa tạo
                                 → bấm Kiểm tra ở nhiệm vụ 4
```

Kỳ vọng cuối: `4/4 nhiệm vụ · 60/60 điểm`.

- [ ] **Step 3: Kiểm tiến độ còn sau khi tải lại trang**

Tải lại trang (F5), vào lại tab Bài tập Thử thách.
Kỳ vọng: bốn nhiệm vụ vẫn xanh, tiến độ vẫn `60/60`.

- [ ] **Step 4: Kiểm các bài chưa có lab không bị đụng**

Mở một bài **React** bất kỳ → tab Bài tập Thử thách.
Kỳ vọng: vẫn là trình soạn thảo Sandpack chia đôi màn hình như cũ.

Mở một bài **Cybersecurity** → tab Bài tập Thử thách.
Kỳ vọng: vẫn là terminal, không có bảng săn cờ.

Mở một bài **Nginx khác** (ví dụ *Reverse Proxy & Node.js*, chưa có lab).
Kỳ vọng: vẫn là ô văn bản tự do + nút AI Chấm bài như cũ.

- [ ] **Step 5: Chạy toàn bộ bộ kiểm lần cuối**

Chạy: `npm test`
Kỳ vọng: **PASS** tất cả.

- [ ] **Step 6: Commit và đẩy lên**

```bash
git add public/app.js
git commit -m "feat(lab): gan phong lab vao tab bai tap cua bai hoc

Bai nao co phong lab thi dung lab thay o van ban tu do. 27 chu de con lai
va 6 bai Nginx chua co lab van giu nguyen luong cu."
git push origin main
```

- [ ] **Step 7: DỪNG LẠI — đưa người dùng xem**

**Không làm tiếp 6 phòng lab còn lại.** Chờ Render deploy xong, báo người dùng vào xem bài *Nginx Overview & Installation* và tự làm thử trọn phòng lab.

Chỉ khi họ duyệt mới viết kế hoạch cho 6 bài còn lại: `reverse-proxy`, `ssl`, `loadbalance`, `perf`, `linux`, `architecture`.

Lý do dừng ở đây: tránh đổ công vào cả 7 phòng lab rồi mới biết mô hình không đúng ý người dùng.

---

## Đối chiếu kế hoạch với spec

| Mục trong spec | Task thực hiện |
|---|---|
| 4.1 Cấu trúc phòng lab | Task 4 |
| 4.2 Hai kiểu nhiệm vụ (`traLoi`, `trangThai`) | Task 4, Task 5 |
| 4.3 Bốn nhiệm vụ mẫu cho bài 1, tổng 60 điểm | Task 4 |
| 5.1 Nhóm lệnh ghi | Task 2 |
| 5.2 Nhóm lệnh Nginx | Task 3 |
| 5.3 Hệ thống tệp nạp được theo lab | Task 1 — **có sai lệch có chủ đích:** spec viết `renderStudio(id, { lab })`, kế hoạch tách thành `CyberTerminal.loadFs(lab.fs)` rồi `renderStudio(id, { challenges: false })`. Tách vậy thì terminal không cần biết gì về khái niệm phòng lab, ranh giới sạch hơn. |
| 6 Giao diện, mở hết nhiệm vụ, gợi ý bấm mới hiện | Task 5 |
| 7 Lưu tiến độ trong localStorage | Task 5 |
| 8 Các file | Bảng cấu trúc file ở đầu kế hoạch |
| 9.1 Giải được — chạy lời giải mẫu | Task 4 Step 7 |
| 9.2 Không qua được bằng cách gõ bừa | Task 4 Step 1 (bài `KHONG QUA DUOC`) |
| 9.3 Mọi lệnh trong lời giải đều có thật | Task 4 Step 1 và Step 6 |
| 9.4 Không có mục treo | Task 1 Step 3, Task 4 Step 1 |
| 9.5 Trang Săn cờ không hồi quy | Task 1 Step 3 |
| 9.6 Đáp án khớp dữ liệu thật | Task 4 Step 1 |
| 9 Lỗi giả chứng minh bộ kiểm biết báo lỗi | Task 1 Step 10, Task 3 Step 8, Task 4 Step 9 |
| 10 Thứ tự làm | Task 1 → 6, dừng ở Task 6 Step 7 |
| 11 Rủi ro: đổi VFS làm vỡ trang Săn cờ | Task 1 Step 3 và Step 9 |
| 11 Rủi ro: `nginx -t` quá sơ sài | Task 3 Step 3, có ghi rõ trong chú thích |
| 11 Rủi ro: đáp án khác định dạng | Task 5, `soKhop` nhận mảng biến thể |
