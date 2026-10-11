# Đợt 5 — Career Advisor sang React, JSON thành nguồn dữ liệu, xóa app cũ

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** `/career` do React phục vụ (đủ hành vi `public/career-advisor.js` + `renderCareerAdvisor` trong `public/app.js`), sau đó mọi URL là React: xóa app cũ, giáo trình và bản dịch thành file JSON được commit, server bỏ nhánh app cũ, README cập nhật.

**Spec:** docs/superpowers/specs/2026-10-10-chuyen-frontend-react-design.md (dòng đợt 5; "Xong khi").

## Global Constraints

- URL `/career` giữ nguyên; SEO meta theo URL vẫn do server chèn.
- Prompt, bắt ý định tìm việc, chấm độ phù hợp việc làm chép nguyên văn (script sinh `career-goc.ts`), không đổi `taskType` (ruling: giữ `general` như bản cũ để không tăng chi phí).
- Lịch sử chat lưu bảng `career_chats` (upsert theo `user_id`) như bản cũ.
- Link việc làm và logo chỉ http/https.

## Review Focus

1. Gửi tin khi tin trước chưa xong / sửa câu hỏi / trả lời lại / xóa chat giữa chừng → kết quả cũ không chen vào.
2. Lỗi AI không bị lưu vào lịch sử chat trên server (bản cũ lưu "❌ Lỗi: ..." thành tin của AI).
3. Xóa app cũ không làm mất tài nguyên tĩnh còn dùng (robots.txt, llms*.txt, og-image, sitemap).
4. Giáo trình/bản dịch đọc từ JSON cho kết quả giống hệt bản đọc từ data-*.js / i18n.js.
5. URL lạ sau khi bỏ app cũ → trang "Không tìm thấy" của React, không vòng lặp tải lại.

## Tasks

### Task 1: Logic Career (`career-goc.ts` sinh từ career-advisor.js, `career.ts`, `career-db.ts`)
- Test RED: bắt ý định + địa điểm (đà nẵng, hn trong từ), chấm độ phù hợp (người mới, senior, không đúng kỹ năng), prompt trùng bản cũ, `getUserStats` từ Supabase, load/save chat. Cài đặt, commit.

### Task 2: Trang `/career`
- Test RED: chat, việc làm tự gợi ý (thu gọn/mở), sửa câu hỏi, trả lời lại, xóa chat có xác nhận, tìm việc thủ công, link an toàn, lỗi có Gửi lại không lưu lên server, rời trang quay lại còn. route-owner + VIEW_REACT + sidebar. Commit.

### Task 3: JSON thành nguồn dữ liệu
- `data/curriculum/<tech>.json` + `data/i18n.json` sinh một lần từ data-*.js / i18n.js; `lib/curriculum.js` và `scripts/xuat-du-lieu.mjs` đọc JSON. Test: kết quả giống hệt bản cũ (so trước khi xóa). Commit.

### Task 4: Xóa app cũ
- Chuyển robots.txt, llms*.txt, assets/og-image.* sang `web/public/`; xóa `public/`, test cũ, bài kiểm so khớp với app cũ; server chỉ phục vụ React; route `*` → NotFound; route-owner bỏ. Test server cập nhật. Commit.

### Task 5: README + review cuối.
