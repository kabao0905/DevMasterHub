# React — Đợt 1: Hạ tầng, Đăng nhập, Dashboard — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/` và `/auth` do app React (Vite + TS + Tailwind + shadcn) phục vụ; mọi URL khác vẫn chạy app cũ; deploy được lên Render.

**Architecture:** Express quyết định mỗi URL thuộc app nào qua `lib/route-owner.js`. Dev: Vite nhúng trong Express (middleware mode). Prod: phục vụ `dist/`, tự lùi về app cũ nếu chưa build. Dữ liệu giáo trình và bản dịch được xuất ra JSON lúc build từ `data-*.js` và `i18n.js`.

**Tech Stack:** React 19.3.0, Vite 8.3.1, TypeScript 7.0.2, Tailwind 4.3.3, shadcn CLI 4.21.0 + radix-ui 1.6.7, react-router 8.4.0, TanStack Query 5.104.0, @supabase/supabase-js 2.117.2, Vitest 5.0.2 + Testing Library + jsdom 29.1.1.

**Spec:** `docs/superpowers/specs/2026-10-10-chuyen-frontend-react-design.md`

**Lưu ý về mức chi tiết:** người dùng yêu cầu làm trọn gói không dừng. Kế hoạch này ghi rõ tệp, giao diện (tên hàm, kiểu) và từng bài kiểm phải có; mã cụ thể được viết theo TDD khi thực thi. Mỗi đợt sau có kế hoạch riêng.

## Global Constraints

- Phiên bản ghim chính xác như Tech Stack; gói mới nhất phải ra ít nhất 14 ngày.
- `engines.node`: `>=22.22.0` (react-router 8). Máy dev đang chạy Node 24.12.
- Một tiến trình khi dev: `npm run dev`. Không thêm dịch vụ trả phí.
- URL giữ nguyên. Khóa localStorage dùng chung giữ nguyên tên: `devmaster_hub_lang`, `devmaster_hub_progress_cache`, `devmaster_hub_profile_cache`, `devmaster_hub_ideas_cache`.
- Chuỗi hiển thị tiếng Việt có dấu, đủ 8 ngôn ngữ qua `i18n.js`. Chú thích trong code: tiếng Việt không dấu.
- `npm test` chạy cả `node --test` (server, `lib/`, app cũ) và Vitest (`web/`).
- Không `dangerouslySetInnerHTML` với nội dung chưa escape.

## Review Focus

- Bản build chưa có (Render chưa đổi Build Command): `/` phải lùi về app cũ, không được trắng trang hay lặp chuyển hướng.
- App cũ đi tới `/` hoặc `/auth` khi đăng xuất: không được tạo vòng tải lại vô hạn giữa hai app.
- Link cũ dạng hash (`/#roadmap/python`, `/#/lesson/...`) mở vào app React: phải chuyển sang đúng đường dẫn mới.
- Đăng xuất rồi người khác đăng nhập trên cùng tab: không thấy tiến độ/hồ sơ của người trước (xóa cache truy vấn).
- Đổi ngôn ngữ trong app React rồi sang trang app cũ: app cũ dùng đúng ngôn ngữ đó (cùng khóa `devmaster_hub_lang`).

---

### Task 1: Công cụ build và kiểm thử

**Files:**
- Modify: `package.json` (scripts, engines, dependencies), `.gitignore` (`dist/`, `web/public/curriculum/`, `web/public/i18n/`)
- Create: `web/vite.config.ts`, `web/tsconfig.json`, `web/index.html`, `web/src/main.tsx`, `web/src/styles/globals.css`, `web/src/test/setup.ts`, `web/components.json`, `web/src/lib/utils.ts`
- Test: `web/src/App.smoke.test.tsx`

**Interfaces:** Produces alias `@/*` → `web/src/*`; scripts `dev`, `build`, `test`, `typecheck`.

- [ ] Cài gói đúng phiên bản (Tech Stack) + `@vitejs/plugin-react@6.1.1`, `@tailwindcss/vite@4.3.3`, `@testing-library/{react@16.3.3,jest-dom@7.0.1,user-event@14.6.7}`, `@types/{react,react-dom}@19.3.0`, `@types/node@26.6.3`, `class-variance-authority@0.7.1`, `clsx@2.1.1`, `tailwind-merge@3.7.0`, `tw-animate-css@1.4.0`, `lucide-react@1.48.0`, `sonner@2.0.8`.
- [ ] Bài kiểm khói: render `<p>` qua Testing Library → chạy `npx vitest run --config web/vite.config.ts` thấy đỏ (chưa có cấu hình) rồi xanh.
- [ ] `npm run build` tạo `dist/index.html`; `npm test` chạy cả hai bộ kiểm.
- [ ] Thêm component shadcn bằng `npx shadcn@4.21.0 add button card input label tabs select badge progress separator sheet skeleton tooltip scroll-area dropdown-menu avatar sonner`.
- [ ] Commit.

### Task 2: Xuất dữ liệu giáo trình và bản dịch ra JSON

**Files:**
- Create: `lib/curriculum.js` (chuyển `loadCurriculum` khỏi `server.js`), `scripts/xuat-du-lieu.mjs`
- Modify: `server.js` (dùng `lib/curriculum.js`), `public/i18n.js` (mở `_duLieu`)
- Test: `tests/xuat-du-lieu.test.js`

**Interfaces:**
- `napGiaoTrinh(thuMucPublic: string): Record<string, Tech>`
- `xuatDuLieu({ thuMucPublic, thuMucRa }): { soCongNghe, ngonNgu: string[] }`
- Ra: `curriculum/index.json` = `TechTomTat[]` (`id,name,icon,color,gradient,category,description, levels[{id,name,desc,badge,lessons[{id,title}]}]`, KHÔNG có `theory`), `curriculum/<id>.json` = Tech đầy đủ, `curriculum/search.json` = `[{tech,level,lesson,title,text}]` (text = lý thuyết bỏ thẻ, tối đa 2000 ký tự), `i18n/<lang>.json` = `{ ui, titles, techDesc, languages }` đã gộp sẵn dự phòng (ui: vi ← en ← lang; titles: entry[lang] ‖ (vi: entry.vi) ‖ entry.en).

- [ ] Đỏ: chạy xuất vào thư mục tạm → index có đủ số công nghệ như `napGiaoTrinh`, không có trường `theory`; `python.json` có bài đầu đủ `theory`; `en.json` có `ui.dashboardTitle`; `fr.json` thiếu khóa thì lùi về tiếng Anh; `titles` tra được bằng khóa chuẩn hóa.
- [ ] Xanh; kiểm server SEO vẫn đúng (bài kiểm cũ).
- [ ] Commit.

### Task 3: Express phục vụ hai app

**Files:**
- Create: `lib/route-owner.js`
- Modify: `server.js` (khởi động bất đồng bộ, Vite middleware khi `--dev`, phục vụ `dist`, chèn meta vào cả hai template, chèn `window.__REACT_VIEWS` vào trang cũ khi có app React)
- Test: `tests/route-owner.test.js`, `tests/server-hai-app.test.js`

**Interfaces:**
- `laUrlReact(duongDan: string): boolean`; `VIEW_REACT: string[]` (tên view của app cũ: `['dashboard','auth']`)
- Biến môi trường `DIST_DIR` (mặc định `<repo>/dist`) để bài kiểm dùng thư mục mẫu.

- [ ] Đỏ: `laUrlReact('/')`, `('/auth')`, `('/auth?x=1')` đúng; `('/roadmap/python')`, `('/lesson/a/b/c')` sai.
- [ ] Đỏ: có `DIST_DIR` mẫu → `GET /` trả HTML mẫu React với `<title>` mặc định đã chèn; `GET /roadmap/python` trả trang cũ chứa `window.__REACT_VIEWS=["dashboard","auth"]`; `GET /assets/index-abc123.js` có `Cache-Control` chứa `immutable`.
- [ ] Đỏ: `DIST_DIR` trỏ vào thư mục rỗng → `GET /` trả trang cũ và KHÔNG có `__REACT_VIEWS`.
- [ ] Xanh; commit.

### Task 4: App cũ nhường `/` và `/auth`

**Files:** Modify `public/app.js` (`navigateTo`); Test: `tests/app.test.js`

**Interfaces:** Consumes `window.__REACT_VIEWS: string[] | undefined`.

- [ ] Đỏ: có `__REACT_VIEWS=['dashboard','auth']` → `App.goToDashboard()` gọi `location.assign('/')`; đăng xuất → `location.assign('/auth')`; `App.openRoadmap('python')` vẫn `pushState`.
- [ ] Đỏ: không có cờ → hành vi cũ (các bài kiểm cũ vẫn xanh).
- [ ] Xanh; commit.

### Task 5: Nền tảng phía React (auth, i18n, giáo trình, tiến độ)

**Files:** Create `web/src/lib/{supabase.ts,auth.tsx,i18n.tsx,curriculum.ts,progress.ts,page-meta.ts,legacy-hash.ts,query.ts}`; Tests cạnh từng tệp.

**Interfaces:**
- `useAuth(): { user, profile, loading, login(u,p), register(u,p), logout() }` — `logout` xóa cache TanStack Query và 3 khóa cache localStorage.
- `useT(): { t(key, vars?), lang, setLang(l), translateTitle(s), techDesc(id, fallback), languages }`; `chuanHoaKhoa(s)` khớp `normalizeKey` cũ.
- `useCurriculumIndex()`, `useSearchIndex(bat: boolean)`; `nhomCongNghe(tech): 'language'|'frontend'|'backend'|'mobile'|'tool'`.
- `useProgress(): { done: Set<string>, isDone(t,l,ls) }`; `tienDoCongNghe(tech, done)`, `tienDoTong(index, done)`.
- `usePageMeta({ title, description, url })`; `duongDanTuHashCu(hash): string | null`.

- [ ] Đỏ rồi xanh cho từng hàm: chuẩn hóa khóa (có chữ `đ`, dấu), lùi ngôn ngữ, tính tiến độ, chuyển hash cũ, đăng xuất xóa cache, đăng nhập sai báo đúng thông báo tiếng Việt.
- [ ] Commit.

### Task 6: Khung app, Đăng nhập, Dashboard

**Files:** Create `web/src/router.tsx`, `web/src/components/{AppShell,Sidebar,RequireAuth,TechCard,LanguageSelect}.tsx`, `web/src/routes/auth/AuthPage.tsx`, `web/src/routes/dashboard/{DashboardPage,SearchResults}.tsx`; Tests cạnh tệp.

- [ ] Đỏ: chưa đăng nhập vào `/` → về `/auth`. Đăng nhập sai → thấy lỗi, nút trở lại "Đăng nhập". Đăng nhập đúng → vào `/`. Đăng ký mật khẩu nhập lại sai → báo lỗi, không gọi Supabase.
- [ ] Đỏ: Dashboard hiện thẻ công nghệ theo nhóm, % tiến độ đúng, thẻ link `/roadmap/<id>`; tìm kiếm khớp tiêu đề/lý thuyết, kết quả link `/lesson/<tech>/<level>/<lesson>`.
- [ ] Đỏ: Sidebar link sang app cũ bằng `<a href>` thường (`/project`, `/my-projects`, `/career`, `/roadmap/<id>`); đổi ngôn ngữ ghi `devmaster_hub_lang`.
- [ ] Xanh; giao diện theo hướng dẫn spec; kiểm tra trên trình duyệt (dev và bản build); commit.
