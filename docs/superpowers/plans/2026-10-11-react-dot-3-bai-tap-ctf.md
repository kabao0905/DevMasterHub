# Đợt 3: Tab Bài tập và Thử thách CTF bằng React — Kế hoạch thực hiện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trang bài học React có thêm tab Bài tập: IDE trực tiếp có chế độ Thiết kế, terminal giả lập, lab Nginx, bài tập do AI tạo và chấm. Thêm trang Thử thách CTF. Server giao `/lesson/*` và `/challenge` cho React.

**Architecture:**
- Logic thuần của các module cũ (`cyber-terminal.js`, `lab-runner.js`, `labs-nginx.js`, `css-patch.js`, phần dựng tài liệu của `sandpack-live.js`, script nhúng của `design-mode.js`, `adaptLessonCode`/`seedFilesFromLesson`/`parseJsonLoose` trong `app.js`) được chép gần nguyên văn sang TypeScript. Bài kiểm của chúng chuyển theo sang Vitest.
- Terminal thành factory `createTerminal()`. Mỗi instance có hệ thống tệp, thư mục, lịch sử và cờ riêng. Phần chạm DOM đổi thành callback.
- Giao diện viết lại bằng React và Tailwind. Không mang theo `public/style.css`.
- Trạng thái bài tập nằm trong react-query, khóa theo người dùng (giống quiz), nên đăng xuất là xóa.

**Tech Stack:** Như đợt 2. Không thêm gói npm mới. Thư viện chạy trong iframe xem trước vẫn tải từ CDN đã ghim như app cũ.

**Spec:** `docs/superpowers/specs/2026-10-10-chuyen-frontend-react-design.md`, đợt 3. Phần "chấm lab, công cụ terminal, CssPatch… chuyển sang TS, giữ bài kiểm".

## Global Constraints

- Không thêm phụ thuộc npm. Phiên bản CDN trong iframe giữ đúng như `sandpack-live.js`.
- Chú thích code: tiếng Việt không dấu. Chuỗi giao diện mới đi qua `t()` và có đủ 8 ngôn ngữ. Nhãn bên trong các công cụ (terminal, CTF, lab, IDE) trước đây chỉ có tiếng Việt và được phép giữ như vậy ở đợt này.
- Không đưa văn bản do AI tạo vào HTML thô. Iframe xem trước dùng `sandbox="allow-scripts allow-modals allow-forms allow-popups"` và không có `allow-same-origin`.
- Khóa lưu tiến độ lab trên máy là `dmh_lab_progress`, dạng `{lessonKey: taskId[]}`, dùng chung với app cũ.
- Bài kiểm của app cũ giữ nguyên tới đợt 5. Bản TS có bài kiểm Vitest riêng.

## Review Focus

- Hai terminal trên cùng một trang (bài học có lab, hoặc qua lại bài học và Thử thách): hệ thống tệp, cờ và điểm độc lập, không ghi đè nhau.
- Code học viên chứa `$&`, `$'`, `</script>` hoặc dấu backtick: xem trước chạy đúng nguyên văn. `postMessage` từ khung khác hoặc token cũ bị bỏ qua.
- AI trả bài tập, nhận xét hay chỉnh sửa thiết kế bị hỏng hoặc chứa HTML: không hiện thành thẻ thật. Chỉnh sửa thiết kế chỉ áp vào tệp đang có. JSON hỏng thì báo lỗi kèm nút Thử lại.
- Chuyển tab hoặc chuyển bài rồi quay lại: code trong IDE và câu trả lời trong ô soạn vẫn còn trong phiên. Đăng xuất thì xóa hết, kể cả tiến độ lab.
- Mở thẳng `/lesson/...` hoặc `/challenge` sau khi chuyển route: do React phục vụ, tiêu đề đúng, không trắng trang khi route lười đang tải. Link từ app cũ vẫn tới đúng chỗ.

---

### Task 1: Engine terminal sang TypeScript

**Files:**
- Create: `web/src/lib/terminal.ts`, `web/src/lib/terminal.test.ts`
- Nguồn: `public/cyber-terminal.js` từ dòng 2 tới hết `checkFlag`

**Interfaces:**
- Produces:
  - `createTerminal(nghe?: { xoaManHinh?(): void; moSoanThao?(duong: string, noiDung: string): void; doiDiem?(): void })` trả về:
    - Lệnh và cờ: `executeCommand`, `checkFlag`, `luuTuSoanThao`.
    - Hệ thống tệp: `loadFs`, `getFs`, `resetFs`, `commandNames`, `filePaths`.
    - Trạng thái: `cwd()`, `lichSu()`, `diem()`, `coDaGiai()`.
  - Hằng xuất khẩu: `COMMANDS`, `CHALLENGES`.

- [ ] Chuyển các bài kiểm `tests/terminal-fs.test.js`, `terminal-lenh.test.js`, `terminal-nginx.test.js`, `ctf-khong-hoi-quy.test.js` sang `createTerminal()` (RED vì module chưa có).
  - Hai bài kiểm "renderStudio sau lab" đổi thành "hai instance độc lập".
- [ ] Chép engine vào factory. Thay `clear` (setTimeout + DOM), `moOSoanThao`/`inRaTerminal` và `updateScoreUI` bằng callback. File để `// @ts-nocheck` vì là code cũ chép nguyên; API xuất ra có kiểu.
- [ ] GREEN, rồi commit `feat(web): engine terminal sang TS, moi terminal mot he thong tep rieng`.

### Task 2: Lab Nginx sang TypeScript

**Files:**
- Create: `web/src/lib/lab.ts`, `web/src/lib/labs-nginx.ts`, `web/src/lib/lab.test.ts`
- Modify: `web/src/lib/auth.tsx` (đăng xuất xóa `dmh_lab_progress`)

**Interfaces:**
- Produces: `chuanHoa`, `soKhop`, `tinhDiem`, `docTienDo(khoa)`, `luuTienDo(khoa, ds)`, `timLab(lessonKey)`, `kiemNhiemVu(lab, task, fs, nhap)`, `LABS_NGINX`. Kiểu `Lab` và `NhiemVu`.

- [ ] Chuyển `tests/lab-runner.test.js` và `lab-nginx-intro.test.js`. Lời giải mẫu chạy trên terminal tạo bằng `createTerminal()`.
- [ ] RED, rồi GREEN. Thêm bài kiểm: đăng xuất xóa tiến độ lab.
- [ ] Commit.

### Task 3: Dựng tài liệu xem trước, CssPatch, seed code, JSON lỏng

**Files:**
- Create:
  - `web/src/lib/sandpack-doc.ts` (`PRESETS`, `presetFor`, `buildDocument`, `buildConsoleDocument`)
  - `web/src/lib/css-patch.ts`
  - `web/src/lib/design-inject.ts` (`injectScript`, `GROUPS`, `rgbToHex`)
  - `web/src/lib/exercise-seed.ts` (`adaptLessonCode`, `seedFilesFromLesson`, `TECH_FRONTEND`)
  - `web/src/lib/json-loose.ts` (`parseJsonLoose`)
  - Bài kiểm đặt cạnh từng file

- [ ] RED:
  - Ca của `tests/sandpack.test.js`: `$$`, `$&`, `$'` vào `srcdoc` nguyên văn.
  - CssPatch: đặt và đọc thuộc tính, giữ phần còn lại của tệp.
  - Seed: trang HTML đầy đủ ra `index.html`; CSS thuần ra `style.css`; React bỏ `import`, thêm render; Vue thêm `const {createApp…}=Vue`.
  - JSON lỏng: JSON bị cắt cụt vẫn đọc được phần đóng ngoặc được, chữ thừa quanh JSON bị bỏ.
- [ ] GREEN bằng cách chép nguyên văn, chỉ thêm kiểu.
- [ ] Commit.

### Task 4: AI cho bài tập, chấm bài, thiết kế, thử thách

**Files:**
- Modify: `web/src/lib/ai.ts`, `web/src/lib/ai-prompts.ts`, `web/src/lib/ai.test.ts`

**Interfaces:**
- Produces:
  - `taoBaiTap(client, { tech, level, lesson, cu, lang })` trả `BaiTapAi = { title, description, hints: string[], sampleInput?, expectedOutput?, solution?, solutionLang? }`.
  - `chamBai(client, { tech, deBai, baiLam, ngonNgu, lang })` trả `NhanXet = { score: 0..100, status: 'correct'|'partial'|'incorrect', feedback, errors: string[], suggestions: string[], correctedCode? }`.
  - `suaThietKe(client, { yeuCau, chon, files, lang })` trả `{ edits, explain }`.
  - `taoThuThach(client, { lenh, tep, lang })` trả `{ title, level, scenario, steps[], hint }`.
  - `nguCanhBai` tab `exercise` nhận `baiTap?: { hienTai?: BaiTapAi; code?: string }`.
- Đọc JSON đối tượng bằng `parseJsonLoose`, không dùng `docJson` (vì `docJson` có thể trả nhầm mảng `hints`).

- [ ] RED: tạo bài tập hỏng bị từ chối, trường thiếu thì lấy mặc định như app cũ; điểm bị kẹp vào 0..100; status lạ thì suy theo điểm; mảng chỉ giữ chuỗi; ngữ cảnh gia sư có bài AI và code học viên.
- [ ] GREEN, rồi commit.

### Task 5: Component công cụ (Terminal, Lab, IDE, Thiết kế)

**Files:**
- Create:
  - `web/src/components/tools/Terminal.tsx`, `CtfPanel.tsx`, `LabPanel.tsx`, `LiveIde.tsx`, `DesignPanel.tsx`
  - `web/src/components/ui/dialog.tsx` (tải từ registry radix-nova bằng `scripts/tai-shadcn.mjs`)
  - `tools.test.tsx`

**Interfaces:**
- `<Terminal terminal={ReturnType<typeof createTerminal>} />`: nhập lệnh, dùng ↑/↓ để xem lịch sử, tự cuộn, bỏ mã ANSI, `nano` mở Dialog.
- `<CtfPanel terminal />`: thẻ thử thách, điểm, ô nộp cờ. Báo kết quả bằng toast.
- `<LabPanel lab lessonKey />`: nhiệm vụ, gợi ý, kiểm tra, tiến độ, kèm terminal riêng nạp `lab.fs`.
- `<LiveIde files techId onFilesChange />`:
  - Tab tệp, cột số dòng, Tab chèn hai dấu cách, kéo vạch chia, chọn khổ màn hình.
  - Iframe `srcDoc` cập nhật sau 300ms. Preset dạng console chỉ chạy khi bấm Chạy.
  - Bảng console nhận `postMessage`, kiểm nguồn và token, giữ tối đa 80 dòng.
  - Bật/tắt chế độ Thiết kế.
- `<DesignPanel>`: chỉnh thuộc tính của phần tử đang chọn bằng CssPatch, kèm ô hỏi AI.

- [ ] RED:
  - `ls`, `cd`, `cat` hiện kết quả; hai terminal độc lập.
  - Nộp cờ đúng thì cộng điểm và thẻ chuyển "đã giải".
  - `nano`, lưu, rồi `cat` thấy nội dung mới.
  - Lab: kiểm tra đúng thì nhiệm vụ xong và lưu tiến độ; gợi ý tăng dần.
  - IDE: sửa code thì gọi `onFilesChange`, srcDoc chứa code; tin nhắn từ nguồn lạ bị bỏ; Thiết kế đổi màu thì tệp CSS đổi.
- [ ] GREEN, rồi commit.

### Task 6: Tab Bài tập trong trang bài học

**Files:**
- Create: `web/src/routes/lesson/ExerciseTab.tsx`, `use-bai-tap.ts`, `CodeArea.tsx`
- Modify: `LessonPage.tsx` (`TABS` thêm `exercise`), `TutorChat.tsx` (prop `baiTap`), `public/i18n.js`, `ban-dich-vi.ts`, `lesson.test.tsx`

**Interfaces:**
- `useBaiTap(bai)` lưu `['exercise', uid, khoaBai]`, gồm `{ aiExercises, activeExIdx, answers: Record<idx, string>, feedback: Record<idx, NhanXet>, files?: FileIde[] }`.
- Thứ tự quyết định:
  1. Có lab (`timLab`) thì hiện LabPanel.
  2. `cybersecurity` thì hiện Terminal (không có CTF).
  3. Thuộc `TECH_FRONTEND` thì hiện LiveIde, seed từ bài học.
  4. Các trường hợp khác thì hiện ô soạn có `CodeArea` cùng bài tập AI, gợi ý, lời giải, chấm bài.
- Đề bài gốc hiện dạng chữ đã escape. App cũ chèn thô nên mất `Stack<T>`; đây là chỗ khác app cũ và được ghi thành ruling.

- [ ] RED:
  - Bài frontend hiện IDE; bài an ninh mạng hiện terminal; bài nginx intro hiện lab; bài Python hiện ô soạn.
  - Tạo bài tập AI hiện tab "AI #1". Chuyển qua lại giữa các tab vẫn giữ câu trả lời của từng bài.
  - Chấm bài hiện điểm và nhận xét đã escape. Gợi ý và lời giải chỉ có ở bài AI.
  - Đổi tab Lý thuyết rồi quay lại vẫn giữ code trong IDE.
  - Gia sư ở tab Bài tập có code học viên trong ngữ cảnh.
- [ ] GREEN. Thêm khóa i18n mới.
- [ ] Commit.

### Task 7: Trang Thử thách và mở `/lesson/*`, `/challenge`

**Files:**
- Create: `web/src/routes/challenge/ChallengePage.tsx`, `challenge.test.tsx`
- Modify:
  - `web/src/router.tsx` (route `challenge`; `HydrateFallback` cho route lười)
  - `RoadmapPage.tsx` (link bài học và `/challenge` đi bằng router)
  - `lib/route-owner.js`, `tests/route-owner.test.js`, `tests/server-hai-app.test.js`
  - `web/src/routes/lesson/use-dich-noi-dung.ts` (giới hạn cache dịch)

- [ ] RED:
  - Trang Thử thách có terminal, 6 thẻ CTF, nút "AI ra đề" (lỗi thì báo, JSON lỏng vẫn đọc được).
  - Server: `/lesson/python/newbie/l1` và `/challenge` do React phục vụ với tiêu đề đúng; `__REACT_VIEWS` có `lesson`, `challenge`.
  - Bất biến route-owner vẫn xanh.
  - Roadmap mở bài học bằng router.
  - Cache dịch giữ tối đa 60 mục mỗi ngôn ngữ.
- [ ] GREEN, rồi commit.
