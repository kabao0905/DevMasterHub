# Đợt 2: Roadmap và trang bài học bằng React — Kế hoạch thực hiện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển trang Roadmap sang React và phát hành nó tại `/roadmap/*`. Làm trang bài học React với các tab Lý thuyết, Code, Quiz AI và chat AI Tutor. Trang bài học chưa được phát hành; đợt 3 sẽ thêm tab Bài tập rồi mới mở `/lesson/*`.

**Architecture:**
- Dữ liệu đầy đủ của một công nghệ lấy từ `/curriculum/<id>.json`, file này đã được xuất ở đợt 1.
- Gọi AI qua `POST /api/ai`, kèm token Supabase. Prompt được chép từ `public/ai-service.js`.
- Trạng thái quiz và chat nằm trong react-query, khóa theo người dùng. Khi đăng xuất, `removeQueries` đã xóa sẵn nên không cần store riêng.
- Tô màu code bằng Prism từ npm thay cho 24 thẻ script CDN.
- HTML không do mình viết (bản dịch máy) đi qua DOMPurify.
- Server chỉ giao thêm `/roadmap/*` cho React.

**Tech Stack:** Như đợt 1, thêm `prismjs@1.30.0`, `@types/prismjs@1.26.6`, `dompurify@3.4.16`.

**Spec:** `docs/superpowers/specs/2026-10-10-chuyen-frontend-react-design.md` (mục "Các đợt", dòng đợt 2 và đoạn ngay dưới bảng).

## Global Constraints

- Ghim phiên bản chính xác, chọn bản mới nhất đã ra ít nhất 14 ngày.
- Chú thích code: tiếng Việt không dấu. Chuỗi giao diện: tiếng Việt có dấu qua `t()`. Mọi khóa mới phải có đủ 8 ngôn ngữ trong `public/i18n.js` và được thêm vào `web/src/test/ban-dich-vi.ts`.
- Không đưa nội dung do AI tạo vào `dangerouslySetInnerHTML`. Chỉ hai nguồn được phép:
  - HTML giáo trình do mình viết, sau khi qua `lamSachHtml`.
  - Đầu ra của `Prism.highlight`, vốn đã escape từng token.
- `/lesson/*` vẫn thuộc app cũ trên server. Link tới bài học từ app React dùng `<a href>` thường, cho tới đợt 3.
- Tiến độ ghi đúng một dòng `lesson_progress`, gồm `onConflict: 'user_id,tech_id,level_id,lesson_id'` và `completed_at`. Cache `devmaster_hub_progress_cache` giữ dạng `{ "t.l.s": true }`.
- Bài kiểm tra React đặt cạnh file, chạy bằng `npm test`.

## Review Focus

- URL có id lạ (`/roadmap/constructor`, `/roadmap/__proto__`, bài không tồn tại): hiện thông báo kèm đường quay lại, không văng lỗi và không lặp chuyển hướng.
- AI trả quiz hỏng (`correct` ngoài khoảng, ít hơn 3 đáp án, trường không phải chuỗi, không phải JSON): câu hỏng bị loại. Nếu không còn câu nào thì báo lỗi kèm nút Thử lại, không quay im lặng về màn giới thiệu.
- Bấm "Đánh dấu hoàn thành" liên tục, hoặc ghi bị lỗi: trạng thái cuối khớp server, lỗi thì hoàn tác và báo; không ghi vào cache của người khác sau khi đăng xuất.
- Người dùng ngôn ngữ khác tiếng Việt: lý thuyết được dịch máy; bản dịch đã được làm sạch; dịch lỗi thì giữ nguyên bản gốc.
- Đang chờ AI trả lời thì chuyển bài khác hoặc chuyển tab: câu trả lời vào đúng lịch sử của bài đã hỏi, không gửi trùng.

---

### Task 1: Dữ liệu bài học, tô màu code, làm sạch HTML

**Files:**
- Modify: `package.json`, `web/src/lib/curriculum.ts`, `web/src/lib/use-curriculum.ts`
- Create: `web/src/lib/highlight.ts`, `web/src/lib/sanitize.ts`, `web/src/components/CodeBlock.tsx`
- Test: `web/src/lib/curriculum.test.ts`, `web/src/lib/highlight.test.ts`, `web/src/lib/sanitize.test.ts`, `web/src/components/CodeBlock.test.tsx`

**Interfaces:**
- Produces:
  - Kiểu dữ liệu:
    - `BaiDayDu = { id; title; theory?: string; code?: string; lang?: string; keyPoints?: string[]; exercise?: string }`
    - `CapDayDu = Omit<CapTomTat,'lessons'> & { lessons: BaiDayDu[] }`
    - `CongNgheDayDu = Omit<CongNgheTomTat,'levels'> & { levels: CapDayDu[] }`
  - `timCongNghe<T extends {id:string}>(ds: T[], id: string): T | undefined`: so khớp đúng `id`, không tra theo thuộc tính của object.
  - `viTriBai(tech, levelId, lessonId)` trả `{ level, lesson, truoc, sau } | null`. `truoc` và `sau` có dạng `{ level, lesson } | null`, tính trên toàn bộ bài của mọi cấp nối liền nhau.
  - `useTech(id: string | undefined)` = `useQuery(['curriculum','tech',id], taiJson('/curriculum/<id>.json'))`, chỉ chạy khi id hợp lệ (`/^[a-z0-9-]+$/`).
  - `toMauCode(code: string, lang?: string): string` trả HTML an toàn. Ngôn ngữ lạ thì escape thường.
  - `lamSachHtml(html: string): string` dùng DOMPurify. Giữ thẻ định dạng và `style` trên `span`; bỏ script, thuộc tính `on*`, `javascript:`.
  - `<CodeBlock code lang? className? copy?>` gồm `<pre><code>` đã tô màu và nút chép. Chép xong thì hiện "Đã chép" 2 giây; lỗi thì báo bằng toast.

- [ ] Cài `prismjs@1.30.0`, `dompurify@3.4.16` (dependencies) và `@types/prismjs@1.26.6` (devDependencies). Thêm `<Toaster />` vào `main.tsx` và `web/src/test/ve-app.tsx`.
- [ ] RED, cho từng hàm:
  - `viTriBai` nối bài qua ranh giới cấp: bài cuối Newbie có `sau` là bài đầu Junior. Bài đầu tiên có `truoc = null`.
  - `timCongNghe(ds,'constructor')` trả `undefined`.
  - `toMauCode('<script>x</script>','html')` không sinh thẻ script thật. `toMauCode('def f(): pass','python')` có token keyword. `toMauCode('a<b','khong-co')` trả `a&lt;b`.
  - `lamSachHtml('<img src=x onerror=alert(1)><span style="color:red">a</span><script>b</script>')` giữ span và style, bỏ onerror và script.
  - `CodeBlock`: bấm chép thì gọi `navigator.clipboard.writeText(code)` và hiện "Đã chép". Clipboard lỗi thì hiện toast "Không chép được".
- [ ] GREEN. Nạp ngôn ngữ Prism theo thứ tự phụ thuộc:
  - markup, css, clike, javascript, jsx, typescript, tsx, c, cpp, csharp, java, kotlin, swift, go, rust, python, ruby, php (sau markup-templating), dart, scala, lua, r, sql, bash, docker, nginx, graphql, json, yaml, git, zig.
  - Bí danh: `html → markup`, `dockerfile → docker`, `js → javascript`, `ts → typescript`, `sh → bash`.
- [ ] Thêm khóa i18n `copied` ("Đã chép") và `copyFailed` ("Không chép được"), đủ 8 ngôn ngữ.
- [ ] Commit `feat(web): du lieu bai hoc day du, to mau code bang Prism, lam sach HTML`.

### Task 2: Ghi tiến độ bài học

**Files:**
- Modify: `web/src/lib/use-progress.ts`, `web/src/test/gia-supabase.ts`
- Test: `web/src/lib/use-progress.test.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `khoaBai`, `KHOA_TIEN_DO`.
- Produces: `useToggleComplete()` trả `{ toggle(tech, level, lesson): void, pending: boolean }`.
  - Cập nhật lạc quan `['progress', uid]`.
  - Upsert đúng một dòng: `{ user_id, tech_id, level_id, lesson_id, completed, completed_at }` với `onConflict`.
  - Lỗi (`{error}` hoặc throw): hoàn tác, rồi `toast.error(t('progressSaveFailed'))`.
  - Thành công: ghi cache trên máy, trừ khi người dùng đã đổi.
  - Các mutation có cùng `scope: { id: 'progress' }`, nên chạy tuần tự.
- Giả Supabase cần thêm: ghi lại tham số thứ hai của `upsert`, và `loiGhi?: Record<bang, string>` để trả `{ error }` khi ghi vào bảng đó.

- [ ] RED:
  - Bật một bài: upsert đúng một dòng có `completed: true`, `completed_at` là chuỗi ISO, `onConflict` đúng. Cache có bài đó.
  - Tắt bài: `completed: false`, `completed_at: null`, cache không còn bài đó.
  - Supabase trả lỗi: `isDone` quay về giá trị cũ và có toast lỗi.
  - Bấm hai lần liên tiếp: hai lần ghi chạy tuần tự, kết quả cuối là `false`.
- [ ] GREEN, rồi thêm khóa i18n `progressSaveFailed` ("Không lưu được tiến độ. Thử lại sau.").
- [ ] Commit `feat(web): danh dau hoan thanh bai hoc`.

### Task 3: Gọi AI, tạo quiz, hỏi gia sư

**Files:**
- Create: `web/src/lib/ai.ts`, `web/src/lib/ai-prompts.ts`
- Test: `web/src/lib/ai.test.ts`

**Interfaces:**
- Consumes: `supabase.auth.getSession()` (truyền vào dưới dạng `SupabaseLike`).
- Produces:
  - `goiAi(client, { system, user, temperature?, maxTokens?, taskType, lang, signal?, cho? }): Promise<string>`
    - POST `/api/ai` với body `{ system: system + chiThiNgonNgu(lang), messages:[{role:'user',content:user}], temperature, max_tokens, taskType }`.
    - Header `Authorization: Bearer <access_token>` khi có phiên.
    - Gặp 429/529 thì thử lại tối đa 2 lần. Chờ theo `Retry-After` nếu có, nếu không thì 2 giây rồi 4 giây, tối đa 8 giây. Lỗi mạng (`TypeError`) thì thử lại 1 lần.
    - 401 ném `Error('Bạn cần đăng nhập để dùng tính năng AI.')`. Các mã lỗi khác ném `body.error ?? 'AI API Error: <status>'`.
    - Đặt timeout 100 giây.
  - `docJson(text)`: chép từ `parseJSON`.
  - `taoQuiz(client, { tech, level, lesson, lang, soCau=4 }): Promise<CauHoi[]>`.
    - `CauHoi = { question: string; code?: string; options: string[]; correct: number; explanation: string }`.
    - Lý thuyết đưa vào prompt đã bỏ thẻ HTML, cắt ở 2500 ký tự.
    - Chỉ giữ câu hợp lệ: 3–6 đáp án đều là chuỗi, `correct` là số nguyên nằm trong khoảng, `question` và `explanation` là chuỗi không rỗng. Cắt còn `soCau` câu. Không còn câu nào thì ném `Error('AI trả về quiz không hợp lệ')`.
  - `hoiGiaSu(client, { ngucanh, lichSu, cauHoi, tab, daNopQuiz, lang }): Promise<string>`.
    - System prompt chép từ `chatAboutLesson`, kèm quy tắc theo tab.
    - Nội dung gửi gồm 10 tin gần nhất (`Học viên:` / `Gia sư:`), rồi đến câu hỏi.
  - `nguCanhBai({ tech, level, lesson, tab, quiz? }): string`: chép từ app.js:1745-1811, theo tab đang mở. Quiz chưa nộp thì không lộ đáp án.

- [ ] RED (dùng `vi.stubGlobal('fetch')`, `cho` giả để không phải chờ thật):
  - Gửi đúng body, header và `taskType`, và system có chỉ thị ngôn ngữ cho `en`.
  - Lần đầu 429 rồi 200: trả về text. 401: ném thông báo đăng nhập.
  - `taoQuiz` loại câu `correct: 7`, câu chỉ có 2 đáp án và câu có `options` không phải chuỗi. Nhận được văn bản không phải JSON thì ném lỗi.
  - `nguCanhBai` tab `quiz` khi chưa nộp: không có "Đáp án đúng". Sau khi nộp thì có.
  - `hoiGiaSu` chỉ gửi 10 tin gần nhất.
- [ ] GREEN.
- [ ] Commit `feat(web): goi AI, tao quiz, hoi gia su`.

### Task 4: Hiển thị markdown của AI an toàn

**Files:**
- Create: `web/src/components/ChatMarkdown.tsx`
- Test: `web/src/components/ChatMarkdown.test.tsx`

**Interfaces:**
- Produces: `<ChatMarkdown text={string} />`, bản React của `HtmlUtils.formatChatMarkdown`, sinh phần tử React (không chèn HTML).
  - Khối ```` ```lang ```` thành `<pre><code>` (tô màu bằng `toMauCode`).
  - `` `x` `` thành `<code>`.
  - `**x**` thành `<strong>`, `*x*` thành `<em>` (theo quy tắc của bản cũ).
  - `\n` thành `<br>`.
  - Bỏ ký tự NUL. Khối không đóng thì giữ nguyên chữ.

- [ ] RED, chép các ca của `tests/html-utils.test.js`:
  - Khối code giữ xuống dòng và dấu `*`.
  - `<img src=x onerror=alert(1)>` hiện ra như chữ.
  - Đậm, nghiêng và code inline hoạt động.
  - `2 * 3 * 4` giữ nguyên.
  - Khối không đóng giữ nguyên.
- [ ] GREEN.
- [ ] Commit `feat(web): hien markdown cua AI an toan`.

### Task 5: Trang Roadmap và mở `/roadmap/*` cho React

**Files:**
- Create: `web/src/routes/roadmap/RoadmapPage.tsx`
- Modify: `web/src/router.tsx`, `web/src/components/TechCard.tsx`, `web/src/components/Sidebar.tsx`, `lib/route-owner.js`
- Test: `web/src/routes/roadmap/roadmap.test.tsx`, `tests/route-owner.test.js`, `tests/server-hai-app.test.js`

**Interfaces:**
- Consumes: `useCurriculumIndex`, `timCongNghe`, `useProgress`, `tienDoCongNghe`, `MAU_CAP`/`CHU_CAP`.
- Produces:
  - Route `/roadmap` chuyển về `/`. Route `/roadmap/:tech` và `/roadmap/:tech/:level` dùng RoadmapPage, nằm trong RequireAuth và AppShell.
  - `MAU_REACT` thêm `/^\/roadmap(\/[^/]+){0,2}\/?$/`. `VIEW_REACT` thêm `'roadmap'`.

- [ ] RED:
  - Roadmap hiện tên, mô tả, thanh tiến độ tổng, mỗi cấp có `x/y` và trạng thái (xong / đang học).
  - Dòng bài là `<a href="/lesson/t/l/s">`. Bài đã xong có dấu ✓ và `aria-label` có chữ "Hoàn thành".
  - `/roadmap/cybersecurity` có link `/challenge`.
  - `/roadmap/constructor` hiện "Không tìm thấy trang này" kèm link Dashboard.
  - `/roadmap/python/junior` cuộn tới cấp Junior và đánh dấu nó (`aria-current`).
  - Thẻ ở Dashboard và link trong sidebar đi bằng router, không tải lại trang.
  - Tiêu đề trang: `Học Python Từ Cơ Bản Đến Nâng Cao — N Bài | DevMaster Hub`, giống server.
  - Server: `/roadmap/python` do React phục vụ, có `<title>Học Python`. `__REACT_VIEWS` có `roadmap`.
  - Bất biến route-owner vẫn xanh.
- [ ] GREEN. Phím Escape trên roadmap đưa về `/`, giống app cũ.
- [ ] Commit `feat(web): trang Roadmap bang React, mo /roadmap/* cho React`.

### Task 6: Trang bài học (chưa phát hành)

**Files:**
- Create:
  - `web/src/routes/lesson/LessonPage.tsx`
  - `TheoryTab.tsx`, `CodeTab.tsx`, `QuizTab.tsx`, `TutorChat.tsx`, `use-dich-noi-dung.ts`, `lesson.test.tsx`, tất cả trong `web/src/routes/lesson/`
- Modify: `web/src/router.tsx` (route lazy `/lesson/:tech/:level/:lesson`), `public/i18n.js`, `web/src/test/ban-dich-vi.ts`

**Interfaces:**
- Consumes: Task 1–4, `useToggleComplete`, `useT`, `useAuth`. Lấy `aiEnabled` từ query `['health']`.
- Produces:
  - Tab đang mở nằm ở `?tab=theory|code|quiz`, chuyển tab bằng `replace` nên không thêm lịch sử.
  - Quiz lưu ở `['quiz', uid, khoaBai]` với `{ questions, answers, submitted }`.
  - Chat lưu ở `['tutor', uid, khoaBai]` với `{ messages }`.
  - Chỗ chờ tab Bài tập cho đợt 3: `TABS` là mảng có thể thêm `exercise`.

- [ ] RED:
  - Bài lạ hiện thông báo kèm link về roadmap.
  - Breadcrumb Dashboard › Python › Newbie. Nút trước/sau qua được ranh giới cấp. Đổi bài thì cuộn lên đầu trang.
  - Đánh dấu hoàn thành đổi được trạng thái nút.
  - Lý thuyết đã được làm sạch. `keyPoints` hiện dạng chữ (`#include <iostream>` thấy được nguyên văn).
  - Không phải tiếng Việt thì gọi dịch, và kết quả `<img onerror>` bị làm sạch. Dịch lỗi thì giữ bản gốc.
  - Tab Code tô màu và có nút chép. Bài không có code thì hiện `noCodeExample`.
  - Quiz đi đủ vòng: tạo, chọn đáp án, nút nộp chỉ bật khi đã trả lời đủ, nộp, hiện điểm, giải thích, đúng/sai, rồi "Quiz mới" tạo lại. Lỗi AI thì có "Thử lại". AI tắt thì hiện thông báo.
  - Chat:
    - Gợi ý gửi đúng câu `t('explainSimply')`. Đang gửi thì không gửi thêm được.
    - Lỗi hiện kèm nút gửi lại và không lọt vào lịch sử gửi AI.
    - Xóa chat thì về màn chào.
    - Ở tab Quiz, ngữ cảnh gửi đi có câu hỏi quiz nhưng không có đáp án khi chưa nộp.
  - Chuyển bài khi trả lời chưa về: câu trả lời nằm ở bài cũ.
- [ ] GREEN.
- [ ] Thêm khóa i18n mới, đủ 8 ngôn ngữ: `quizQuestion`, `submitQuiz`, `explanation`, `newQuiz`, `generatingQuiz`, `quizIntro`, `quizFailed`, `aiDisabled`, `tutorFailed`, `resend`, `prevLesson`, `nextLesson`, `lessonNotFound`.
- [ ] Commit `feat(web): trang bai hoc React (ly thuyet, code, quiz, gia su) — chua phat hanh`.
