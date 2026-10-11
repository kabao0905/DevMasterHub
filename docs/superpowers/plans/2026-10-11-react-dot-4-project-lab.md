# Đợt 4 — Project Lab, Idea đã lưu, My Projects sang React

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** `/project`, `/project-level/:level?`, `/project-topic/:topic?`, `/saved-ideas`, `/my-projects(/:id)?` do app React phục vụ, giữ đủ hành vi của app cũ (public/app.js 281-336, 2201-3030, 3586-3665; public/ai-service.js 213-458, 505-977; public/auth-service.js 212-286).

**Architecture:** Logic thuần (phân tích tĩnh, nhóm module, cắt gọn code, buildSubmission, prompt) chép sang `web/src/lib/project-ai.ts` và có bài kiểm so khớp prompt với file cũ. Supabase ở `web/src/lib/project-db.ts`. Không gian làm project (idea, chat mentor, file, kết quả chấm) nằm trong react-query theo người dùng `['project', uid, 'level'|'topic']`, đọc/ghi qua hook kiểu `useBaiTap` (bản sao cục bộ đồng bộ để ô nhập không mất phím). Trang tách chunk lazy `web/src/routes/project/*`.

**Tech Stack:** React 19, TS strict, react-router 8, TanStack Query 5, Tailwind v4 + shadcn, Vitest + RTL.

**Spec:** docs/superpowers/specs/2026-10-10-chuyen-frontend-react-design.md (bảng "Các đợt", dòng 4).

## Global Constraints

- URL giữ nguyên: `/project`, `/project-level`, `/project-topic`, `/saved-ideas`, `/my-projects`.
- Chuỗi hiển thị qua `t()`, đủ 8 ngôn ngữ (khóa mới thêm vào `public/i18n.js`).
- Nội dung AI hiển thị bằng JSX (tự escape); markdown chỉ qua `ChatMarkdown`.
- Dữ liệu theo người dùng nằm dưới khóa react-query có uid → đăng xuất là xóa (đã có trong AuthProvider).
- Cột Supabase `project_submissions` / `saved_ideas` đúng như auth-service.js cũ.
- Chú thích code tiếng Việt không dấu.

## Review Focus

1. AI trả JSON thiếu trường / sai kiểu (mảng chứa object, score là chuỗi) → không được làm vỡ trang (React ném lỗi khi render object).
2. Kết quả AI về sau khi học viên đã rời trang / đổi cấp độ / đăng xuất → ghi đúng khóa đã chụp, không ghi cho người sau.
3. Lưu idea trùng, xóa idea, mất mạng khi ghi Supabase → báo lỗi rõ, danh sách không lệch với server.
4. My Projects: người chưa nộp bài nào → không gọi Supabase lặp vô hạn (lỗi cũ); bài nộp chứa HTML trong tên/nhận xét → hiện như chữ.
5. Sang app cũ (/career) rồi quay lại → không mất project đang làm (thêm `project` vào `viec-dang-lam.ts`).

## Tasks

### Task 1: Logic Project AI (`web/src/lib/project-ai.ts`)

**Files:** Create `web/src/lib/project-ai.ts`, `web/src/lib/project-ai.test.ts`.

**Produces:** `YTuong`, `TepDuAn {name, lang, code}`, `KetQuaCham`, `BanNop`; `phanTichTinh(code, ten)`, `phanTichTatCa(files)`, `nhomModule(files)`, `catGonCode(code, n)`, `taoBanNop({review, idea, files, difficulty, topic})`, `nguCanhDuAn(idea, files)`, `taoYTuong(client, {level, topic, lang, ngauNhien?, signal?, cho?})`, `hoiMentor(client, {nguCanh, lichSu, cauHoi, lang, signal?})`, `chamDuAn(client, {idea, files, lang, khiTienDo?, signal?})`, `chuanHoaYTuong`, `chuanHoaKetQua`.

- [ ] Test RED: buildSubmission (2 ca của tests/project-submission.test.js), phân tích tĩnh (var, ==, eval, empty catch, HTML viewport, Python bare except, điểm/grade), nhóm module, chấm dự án với AI giả (số lần gọi = 1 cấu trúc + n module + 1 tổng hợp; module lỗi → điểm 0 có lý do; cấu trúc lỗi → mặc định; tổng hợp lỗi → ném), chuẩn hóa idea/kết quả với dữ liệu xấu, prompt trùng nguyên văn với ai-service.js (nạp file cũ bằng `?raw` + `new Function`, chặn fetch để bắt body).
- [ ] Cài đặt, chạy xanh, commit.

### Task 2: Dữ liệu và trạng thái (`project-db.ts`, `use-du-an.ts`, `use-y-tuong.ts`)

**Files:** Create `web/src/lib/project-db.ts`, `web/src/routes/project/use-du-an.ts`, `web/src/routes/project/use-y-tuong.ts`, tests.

**Produces:** `luuBaiNop(client, uid, banNop)`, `taiBaiNop(client, uid)`, `taiYTuong(client, uid)`, `luuYTuong(client, uid, yt)`, `xoaYTuong(client, uid, id)` (ném lỗi khi Supabase báo lỗi; `taiYTuong` chuẩn hóa `saved_at` → `savedAt`). `useDuAn(cheDo)` trả kho + hành động (chọn cấp, đặt chủ đề, tạo idea, chat, sửa file, chấm). `useYTuong()` trả danh sách + lưu/xóa (lạc quan, hoàn tác khi lỗi, ghi cache `devmaster_hub_ideas_cache`).

- [ ] Test RED → cài đặt → xanh → commit.

### Task 3: Trang Project Lab (hub, theo cấp độ, theo chủ đề)

**Files:** `web/src/routes/project/{ProjectHubPage,ProjectLevelPage,ProjectTopicPage,IdeaPanel,MentorChat,KhongGianCode,KetQuaChamView}.tsx`, `project.test.tsx`, `web/src/components/ChuDam.tsx`, khóa i18n mới.

- [ ] Test RED cho các luồng: hub 3 thẻ + đếm idea; chọn cấp → tạo idea → panel; đổi cấp xóa idea; chủ đề: gõ + Enter, chip, chọn cấp/Auto; Lưu idea (trùng thì báo); chat mentor gửi ngữ cảnh có code; thêm/đổi tên (đổi ngôn ngữ theo đuôi)/xóa file; chấm → tiến độ → kết quả + insert project_submissions; AI tắt thì không có nút tạo/chấm; lỗi AI có Thử lại.
- [ ] Cài đặt, xanh, commit.

### Task 4: Idea đã lưu và My Projects

**Files:** `web/src/routes/project/{SavedIdeasPage,MyProjectsPage,ProjectDetailPage}.tsx`, tests.

- [ ] Test RED: danh sách idea (ngày giờ theo ngôn ngữ, nguồn), xóa có xác nhận, "Bắt đầu làm" mở đúng chế độ với idea; rỗng → nút tạo theo chủ đề; My Projects danh sách/rỗng/lỗi + chi tiết `/my-projects/:id` (điểm 5 mục, nhận xét markdown, điểm mạnh/cải thiện, code tô màu), HTML hiện như chữ, không tải lặp.
- [ ] Cài đặt, xanh, commit.

### Task 5: Định tuyến và tích hợp

**Files:** `web/src/router.tsx`, `lib/route-owner.js`, `tests/route-owner.test.js`, `tests/server-hai-app.test.js`, `web/src/components/Sidebar.tsx`, `web/src/lib/viec-dang-lam.ts`.

- [ ] Test RED: route-owner nhận các URL mới + VIEW_REACT có 'project','project-level','project-topic','saved-ideas','my-projects'; server trả React cho `/project`; sidebar dùng link router; snapshot giữ project qua vòng sang app cũ.
- [ ] Cài đặt, `npm test` + `npm run build` xanh, kiểm tra trên trình duyệt (phiên giả), commit.
