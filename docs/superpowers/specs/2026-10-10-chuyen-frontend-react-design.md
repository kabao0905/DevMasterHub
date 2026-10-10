# Chuyển frontend DevMaster Hub sang React + Vite — Thiết kế

## Mục tiêu

Người dùng thích React và muốn tự tay chỉnh giao diện cho đẹp hơn. Toàn bộ frontend
(khoảng 12 màn hình, `public/app.js` ~3.700 dòng, `style.css` ~5.100 dòng) chuyển sang
React + TypeScript + Tailwind + shadcn/ui, **chuyển dần theo đường dẫn**: mỗi đợt
deploy được, app luôn chạy trong suốt quá trình chuyển.

**Xong khi:** mọi URL do app React phục vụ, `public/app.js` và các file JS cũ đã xóa,
toàn bộ hành vi đã sửa ở đợt review (109 bài kiểm) vẫn đúng, SEO meta theo URL vẫn còn.

## Người dùng đã chốt

| Câu hỏi | Chọn |
|---|---|
| Lý do | Thích React, muốn giao diện đẹp hơn và dễ chỉnh |
| CSS | Tailwind CSS v4 + shadcn/ui |
| Ngôn ngữ | TypeScript |
| Phạm vi | Chuyển hết |
| Cách chuyển | Chia theo đường dẫn (strangler ở tầng router), 5 đợt |

## Ràng buộc

- Deploy trên Render (free), một dịch vụ Node: Express vừa là API vừa phục vụ frontend.
- **Máy phát triển yếu, chi phí $0**: một tiến trình khi dev, không dịch vụ trả phí mới.
- Ràng buộc cũ "không build step, không thêm npm" **được bỏ** vì người dùng chọn React + Vite.
- URL giữ nguyên (`/`, `/roadmap/:tech`, `/lesson/:tech/:level/:lesson`, `/career`,
  `/project`, `/project-level/:level`, `/project-topic`, `/saved-ideas`, `/my-projects`,
  `/challenge`, `/auth`) để không mất SEO và link đã chia sẻ.
- Chuỗi hiển thị: tiếng Việt có dấu, đủ 8 ngôn ngữ như hiện tại. Chú thích trong code:
  tiếng Việt không dấu (theo lối của repo).

## Kiến trúc

```
web/                       app React (gốc Vite)
  index.html               giữ sẵn <title>/<meta> để server thay theo URL
  src/
    main.tsx, router.tsx
    routes/<man-hinh>/     mỗi màn hình một thư mục
    components/ui/         component shadcn (sinh bằng CLI, sửa tự do)
    components/            Sidebar, TechCard… dùng chung
    lib/                   supabase, api, i18n, curriculum, progress
    styles/globals.css     Tailwind v4 + màu chủ đề
  public/curriculum/*.json SINH RA lúc build (không commit)
  public/i18n/*.json       SINH RA lúc build (không commit)
dist/                      kết quả `vite build` (không commit)
public/                    app cũ, xóa dần theo từng đợt
lib/route-owner.js         bảng duy nhất: URL nào thuộc app React
scripts/xuat-du-lieu.mjs   xuất data-*.js và i18n.js ra JSON tách nhỏ
```

### Express phục vụ hai app

- `lib/route-owner.js` xuất `laUrlReact(path)`. Express:
  - URL thuộc React → `dist/index.html` (prod) hoặc HTML do Vite biến đổi (dev),
    qua cùng hàm chèn SEO `renderIndex` hiện có.
  - URL khác → `public/index.html` cũ như bây giờ.
  - `dist/assets/*` có hash trong tên → cache 1 năm, `immutable`.
- **Dev:** `npm run dev` = `node server.js` với `NODE_ENV!=production`; server nhúng
  Vite ở `middlewareMode` (một tiến trình, một cổng, có HMR).
- **Prod:** `npm run build` = xuất dữ liệu + `vite build`. `npm start` không đổi.
  Render: Build Command phải đổi thành `npm install && npm run build` (người dùng làm).

### Chuyển qua lại giữa hai app

- Phiên đăng nhập dùng chung: cả hai app gọi `createClient(SUPABASE_URL, ANON_KEY)` với
  cùng URL nên cùng khóa localStorage `sb-<ref>-auth-token`.
- App cũ có `REACT_ROUTES` (danh sách view đã chuyển). `navigateTo` của app cũ đi tới các
  view đó bằng `location.assign(path)` thay vì `pushState`. Bài kiểm buộc danh sách này
  khớp với `lib/route-owner.js`.
- App React đi tới URL chưa chuyển bằng thẻ `<a href>` thường (tải lại trang).
- Khóa localStorage dùng chung giữ nguyên tên: `devmaster_hub_lang`,
  `devmaster_hub_progress_cache`, `dmh_lab_progress`.

## Dữ liệu và dịch vụ

- **Giáo trình:** `data-*.js` vẫn là nguồn để sửa nội dung trong suốt quá trình chuyển.
  `scripts/xuat-du-lieu.mjs` (dùng lại bộ nạp `vm` của server, chuyển sang
  `lib/curriculum.js`) xuất `curriculum/index.json` (danh sách công nghệ + số bài,
  không có nội dung bài) và `curriculum/<techId>.json`. App React tải theo nhu cầu.
- **Bản dịch:** `i18n.js` vẫn là nguồn. Script xuất `i18n/<lang>.json` gồm
  `{ ui, titles, techDesc }`. Chuỗi mới của app React thêm thẳng vào `i18n.js`.
  `I18nProvider` + `useT()`; đổi ngôn ngữ ghi `devmaster_hub_lang`.
- **Supabase:** gói npm `@supabase/supabase-js` ghim phiên bản. `AuthProvider` cung cấp
  `{ user, profile, loading, login, register, logout }`; `<RequireAuth>` chuyển về `/auth`.
- **Dữ liệu từ server:** TanStack Query cho mọi lần đọc Supabase và `/api/*` — có cache,
  trạng thái tải, và không thể lặp gọi vô hạn như lỗi My Projects cũ.
- **Logic thuần** (chuyển sang TS, giữ bài kiểm): chấm lab, công cụ terminal, CssPatch,
  ánh xạ bài nộp (`buildSubmission`), chuẩn hóa JSON AI (`parseJsonLoose`), prompt AI.
- **Hiển thị nội dung AI:** JSX tự escape. Chỗ cần markdown dùng một component
  `<ChatMarkdown>` port từ `HtmlUtils.formatChatMarkdown` (không `dangerouslySetInnerHTML`
  với văn bản AI chưa escape). HTML lý thuyết của giáo trình là nội dung tin được.

## Giao diện

- Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (style new-york, TS, `cssVariables`).
- Chủ đề tối làm mặc định, kế thừa nhận diện hiện tại: nền `#0a0e17`, thẻ `#1a1f2e`,
  nhấn xanh `#58a6ff`, gradient tím–hồng cho điểm nhấn, font Inter + JetBrains Mono.
  Màu đặt thành CSS variable của shadcn để đổi chủ đề ở một chỗ.
- Bố cục: sidebar trái (thu gọn được, dạng Sheet trên mobile), nội dung giữa; dùng
  component shadcn: Button, Card, Tabs, Input, Select, Dialog, Sheet, Badge, Progress,
  Tooltip, Separator, ScrollArea, Skeleton, Sonner (thông báo thay `alert`).
- Tô màu code: giữ Prism qua npm, chỉ nạp ngôn ngữ cần (không còn 24 thẻ script CDN
  chặn cả trang).

## Kiểm thử

- Vitest + React Testing Library + jsdom cho `web/`. Bài kiểm React ở `web/src/**/*.test.tsx`.
- `node --test` giữ cho server và `lib/`. `npm test` chạy cả hai.
- Mỗi hành vi đã sửa ở đợt review phải có bài kiểm tương ứng ở phía React khi màn hình
  đó được chuyển (đăng nhập vào app ngay, không lặp gọi, escape nội dung AI, link việc
  làm chỉ http/https, bài nộp lưu đúng cột, xóa dữ liệu khi đăng xuất…).
- Bài kiểm của app cũ xóa cùng lúc với màn hình cũ tương ứng.

## Các đợt

| Đợt | Nội dung | URL chuyển sang React |
|---|---|---|
| 1 | Hạ tầng (Vite, TS, Tailwind, shadcn, xuất dữ liệu, Express hai app, Vitest), khung app (Sidebar, chọn ngôn ngữ), Đăng nhập, Dashboard + tìm kiếm | `/`, `/auth` |
| 2 | Roadmap, trang bài học: Lý thuyết, Code, Quiz AI, chat AI Tutor | `/roadmap/*` (trang bài học chưa phát hành, xem dưới) |
| 3 | Tab Bài tập: Sandpack + chế độ Thiết kế, terminal, lab Nginx, bài tập AI chấm; trang Thử thách CTF | `/challenge` |
| 4 | Project Lab: theo cấp độ, theo chủ đề, idea đã lưu, chat mentor, nộp và chấm; My Projects | `/project*`, `/saved-ideas`, `/my-projects` |
| 5 | Career Advisor; JSON thành nguồn dữ liệu, xóa app cũ (`public/*.js`, `style.css`, bài kiểm cũ), server bỏ nhánh app cũ | `/career` |

Trang bài học là một URL duy nhất cho cả 4 tab, nên `/lesson/*` chỉ chuyển sang React khi
cả đợt 2 và đợt 3 xong: đợt 2 được commit nhưng `route-owner` chỉ thêm `/roadmap/*`;
đợt 3 thêm `/lesson/*` và `/challenge`.

## Rủi ro và cách xử lý

| Rủi ro | Xử lý |
|---|---|
| Build lỗi trên Render | Đợt 1 deploy hạ tầng sớm nhất; `engines.node >=20.19` cho Vite |
| Mất SEO meta | Bài kiểm server: URL React trả HTML có `<title>` đúng theo bài học |
| Hai app lệch phiên đăng nhập | Cùng URL Supabase; bài kiểm khóa localStorage; thử thật trên trình duyệt |
| Giao diện lẫn lộn giữa hai app trong lúc chuyển | Chấp nhận tạm; sidebar React liệt kê đủ mục và link sang app cũ |
| Mất hành vi đã sửa | Bài kiểm React tương ứng là điều kiện xong của mỗi đợt |
