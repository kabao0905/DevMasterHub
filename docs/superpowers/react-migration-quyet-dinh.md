# Chuyển frontend sang React — quyết định đã chọn và việc nhỏ để sau

Trích nguyên văn từ ledger của 5 đợt (`.superpowers/sdd/*/progress.md`, đã xóa sau khi xong). Mỗi dòng **Ruling** là một quyết định tự chọn thay người dùng, kèm cái giá nếu sai; mỗi dòng **Minor** là lỗi nhỏ review tìm ra nhưng chưa sửa.

## 2026-10-10-react-dot-1-ha-tang

- **Ruling** Ruling: Plan gives interfaces + required tests, not full code (user said "lam full di") — code written TDD at execution — cost if wrong: less upfront review of code shape.
- **Ruling** Ruling: Branch feat/react used instead of a worktree — user's working copy, not main — cost if wrong: none (no shared branch touched).
- **Ruling** Task 1: Ruling: shadcn CLI 4.21 khong chay duoc trong web/ (khong co web/package.json -> tao du an moi web/vite-app, cai goi "cn") — tai component radix-nova truc tiep tu registry ui.shadcn.com, doi import "cn" -> "@/lib/utils", IconPlaceholder -> lucide, sonner bo next-themes (luon dark) — cost if wrong: cap nhat component sau nay phai chay lai script (scratchpad/tai-shadcn.mjs) thay vi CLI.
- **Ruling** Task 1: Ruling: them devDependency shadcn@4.21.0 chi de @import "shadcn/tailwind.css" (style radix-nova can) — cost if wrong: mot goi dev thua.
- **Ruling** Task 1: Ruling: font Be Vietnam Pro thay Inter (spec ghi Inter) — font Viet, dau tieng Viet dep, theo frontend-design — cost if wrong: doi 1 dong trong globals.css + index.html.
- **Ruling** Task 1: Ruling: vite.config.ts -> vite.config.mts — root package khong "type":"module", Vite canh bao CJS — cost if wrong: khong.
- **Ruling** Task 1: Ruling: npm audit fix + express ^4.22.3 (va qs 6.16) — 3 lo hong co san (1 critical proxy-addr) — cost if wrong: express 4.x patch, da chay 109 bai kiem server.
- **Ruling** Task 2: Ruling: giu thu tu nap data*.js cua server (khong doi theo index.html) — data-extra.js moi la noi gop nen thu tu khong anh huong — cost if wrong: thu tu the cong nghe lech app cu.
- **Ruling** Task 3: Ruling: server khoi dong qua http.createServer de gan HMR cua Vite vao cung cong (mot tien trinh, mot cong) — cost if wrong: khong.
- **Ruling** Task 5: Ruling: tach hook goi mang (use-curriculum.ts, use-progress.ts) khoi ham thuan (curriculum.ts, progress.ts) thay vi gop nhu plan — logic test duoc ma khong can provider — cost if wrong: them 2 file.
- **Ruling** Task 5: Ruling: bo query.ts — QueryClient tao thang trong main.tsx (Task 6) — cost if wrong: khong.
- **Ruling** Task 5: Ruling: AuthProvider bo qua ket qua getSession neu da co su kien auth — tranh ghi de user bang null — cost if wrong: khong.
- **Ruling** Task 5: Ruling: tim kiem khong phan biet dau (go "vong lap" ra "Vòng lặp") — cai thien so voi app cu — cost if wrong: khop rong hon mot chut.
- **Ruling** Task 6: Ruling: chon ngon ngu bang <select> goc (khong dung Select cua radix) — de dung tren dien thoai, de kiem bang jsdom — cost if wrong: khac kieu mot chut voi component shadcn.
- **Ruling** Task 6: Ruling: them 5 khoa i18n moi (continueLearning, openLesson, pickRoadmap, openMenu, levelProgress) du 8 ngon ngu vao public/i18n.js — cost if wrong: ban dich may can nguoi ban xu soat.
- **Ruling** Task 6: Ruling: giu window.confirm khi dang xuat (giong app cu) — cost if wrong: hop thoai trinh duyet, chua dep.
- **Ruling** Final: Ruling: bundle size 689KB/203KB gzip — route-level code splitting in later phases — cost if wrong: slower first load on mobile until then.
- **Ruling** Final: Ruling: no response compression in Express — Render edge compresses; infra outside plan — cost if wrong: larger transfers.
- **Ruling** Final: Ruling: bfcache restoring stale page on Back — browser-dependent, both apps re-check auth on load — cost if wrong: brief stale view.
- **Ruling** Final: Ruling: radix-nova vs new-york style — design choice already ruled — cost if wrong: restyle.
- **Ruling** Final: Ruling: Express default error handler stack trace from async catch-all — only reachable in --dev — cost if wrong: none in prod.
- **Ruling** Final: Ruling: export does not delete JSON for removed techs — files unreferenced by index.json — cost if wrong: stale files on disk.
- **Ruling** Final: Ruling: React register skips legacy username pre-check — Supabase "already registered" maps to same message — cost if wrong: if email confirm turned on, message differs.
- **Ruling** Final: Ruling: Radix Tabs without TabsContent leaves dangling aria-controls — a11y nit — cost if wrong: screen reader announces missing panel.
- **Ruling** Final: Ruling: unknown legacy URLs (/foo, //, /AUTH) render legacy dashboard — predates branch, no loop — cost if wrong: none new.
- **Ruling** Final: Ruling: Be Vietnam Pro instead of spec's Inter — keep, surface to user for confirmation — cost if wrong: 2-line change.
- **Ruling** Final: Ruling: I2 fix keeps the legacy login screen (old design) for logged-out deep links instead of /auth?next= — a JS redirect from ~400 sitemap URLs to /auth risks deindexing; old screen is transitional until roadmap/lesson move to React (dot 2-3) — cost if wrong: logged-out deep-link visitors see the old login design for now.
- **Ruling** Final: Ruling: I4 snapshot excludes careerChatHistory — already saved to Supabase and reloaded when empty — cost if wrong: none.
- **Ruling** Final: Ruling: logout removes every query except an allowlist of public roots (i18n, curriculum) rather than a denylist of user roots — new user-scoped queries in later phases are cleared by default — cost if wrong: a new public query root refetches after logout until added to the list.
- **Ruling** Final: Ruling: finishing-a-development-branch and workspace deletion deferred until all 5 phases land on feat/react — user said 'lam full di'; merge/push needs their call at the end anyway — cost if wrong: phase-1 ledger lingers in git-ignored .superpowers/.
- **Minor** logout ignores signOut error (offline logout keeps session; reload restores user) — auth.tsx logout.
- **Minor** web/src/test/ban-dich-vi.ts hand-copied, can drift from public/i18n.js — add key-coverage test.
- **Minor** shadcn fetch script lives in session scratchpad, not repo — commit under scripts/ or make CLI work (corrects cost of Task 1 ruling).
- **Minor** README stale (no build step, Node 18); Render Build Command + devDependencies not documented in repo.
- **Minor** chenMeta not tested against real web/index.html template.
- **Minor** LanguageSelect.tsx folded into Sidebar; search.json uses t/l/s keys (consumer consistent).
- **Minor** AuthPage flashes form while auth loading; search text keeps 3 HTML entities; literal combining-mark ranges in regex.

## 2026-10-11-react-dot-2-roadmap-bai-hoc

- **Ruling** Ruling: Plan gives interfaces + required tests, not full code (user said 'lam full di') — cost if wrong: less upfront review of code shape.
- **Ruling** Task 1: Ruling: npm audit 6 high (braces GHSA-vfj7-8cjw-p6xm via shadcn devDependency -> fast-glob/ts-morph) — dev-only CLI tooling, never shipped; only fix is downgrading shadcn to 1.0.0 (breaking) — cost if wrong: DoS risk only when running shadcn CLI on hostile globs.
- **Ruling** Task 2: Ruling: optimistic update applied at click time in toggle(), not in onMutate — scoped (serialized) mutations start late, so the 2nd click must see the 1st click's state — cost if wrong: none observed.
- **Ruling** Task 2: Ruling: no cancelQueries before optimistic set — cancel(revert) restores pre-fetch state after our set and wipes it; useProgress.loading now = 'no server data yet' (pending or placeholder) and the lesson button stays disabled while loading — cost if wrong: a background refetch racing a toggle could briefly show server state until the next refetch.
- **Ruling** Task 3: Ruling: param named nguCanh (plan wrote ngucanh) to match nguCanhBai — cost if wrong: none.
- **Ruling** Task 3: Ruling: quiz prompt line 'Viết tiếng Việt' changed to 'Viết bằng ngôn ngữ trong chỉ thị ngôn ngữ ở cuối' — legacy prompt contradicted the appended language directive for non-vi learners — cost if wrong: quiz language could differ from legacy for vi (it does not: directive is vi).
- **Ruling** Task 3: Ruling: tutor quiz context labels student pick as 'đúng/sai' (Vietnamese, like the rest of the prompt) instead of I18n answerCorrect/answerWrong, and includes q.code which legacy omitted — cost if wrong: none.
- **Ruling** Task 3: Ruling: AI client retries 429/529 at most 2 times honoring Retry-After (legacy 3 times fixed 2/4/8s ignoring header), network error once — fewer requests against the shared 30/min limit — cost if wrong: slightly more user-visible 429s.
- **Ruling** Task 5: Ruling: added ResizeObserver stub in web/src/test/setup.ts — jsdom lacks it, Radix ScrollArea needs it once sidebar content changes — cost if wrong: none (test-only).
- **Ruling** Task 5: Ruling: roadmap drops legacy JSON-LD (BreadcrumbList + Course with fake aggregateRating 4.9/120) — fake ratings violate search structured-data guidelines; server meta (title/description/canonical) kept identical — cost if wrong: loss of breadcrumb rich result for roadmap pages.
- **Ruling** Task 5: Ruling: unknown tech renders NotFoundPanel inside the app shell instead of legacy's pushState redirect to Dashboard (which trapped the Back button) — cost if wrong: none.
- **Ruling** Task 6: Ruling: no lessonNotFound key — unknown lesson reuses pageNotFound + link back to the tech roadmap — cost if wrong: none.
- **Ruling** Task 6: Ruling: new key submitQuizCount ('Nộp bài ({done}/{total})') because submitQuiz already exists with other text; prevLesson/nextLesson reused (they carry arrows) — cost if wrong: none.
- **Ruling** Task 6: Ruling: tutor chat always expanded (legacy had a collapse toggle that reset on every render) — cost if wrong: one more toggle to add later.
- **Ruling** Task 6: Ruling: tutor errors kept out of chat history (legacy pushed '⚠️ Lỗi...' as an assistant message that was then sent back to the AI as context); error shown with Resend instead — cost if wrong: none.
- **Ruling** Task 6: Ruling: machine translation keeps legacy's unofficial translate.googleapis GET endpoint (long theory may exceed URL length -> falls back to original, same as legacy); cache key now hashes full content (legacy keyed on first 30 chars -> collisions) — cost if wrong: some long lessons stay untranslated for non-vi users.
- **Ruling** Task 6: Ruling: AI quiz generation is aborted if the learner leaves the lesson mid-generation (query loses its last observer and the signal is consumed) — cost if wrong: a wasted AI call is cancelled rather than finished in the background.
- **Ruling** Task 6: Ruling: breadcrumb level crumb links to /roadmap/<tech>/<level> (legacy: not clickable) — cost if wrong: none.
- **Ruling** Final: Ruling: Task 2 cancelQueries ruling's cost was understated (stale state persisted to localStorage) — superseded by M6 fix (reconcile once after the last scoped write) — cost if wrong: one extra progress refetch per burst of clicks.
- **Ruling** Final: Ruling: soft-404 (HTTP 200) for unknown roadmap ids — existing server behaviour, spec silent — cost if wrong: crawlers may index junk ids.
- **Ruling** Final: Ruling: lazy lesson route has no HydrateFallback — route not served by server until phase 3; add then — cost if wrong: none now.
- **Ruling** Final: Ruling: finishing-a-development-branch and workspace deletion deferred until all 5 phases land on feat/react — cost if wrong: ledger lingers in git-ignored .superpowers/.
- **Minor** page meta — not-found title set while index loading; canonical/og:url/description left from previous page when next page passes no url; client canonical uses location.origin vs server BASE_URL.
- **Minor** server.js metaForPath uses CURRICULUM[seg] (prototype keys: /roadmap/constructor gets 'Học Object…', canonical /roadmap/undefined) — use Object.hasOwn.
- **Minor** a11y — quiz legend lacks question text; mark-complete label changes + aria-pressed + emoji read aloud; breadcrumb aria-label not localized, no aria-current; 'Đã chép' not announced; role=alert nested in aria-live list.
- **Minor** goiAi retry wait cho() ignores abort signal.
- **Minor** machine-translation localStorage cache unbounded (new prefix duplicates legacy devmaster_trans_*); could approach quota — cap it (LRU) before /lesson/* goes live in phase 3.
- **Minor** ChatMarkdown code fence inside quiz option <label> nests a copy <button> in the label (click selects answer).

## 2026-10-11-react-dot-3-bai-tap-ctf

- **Ruling** Ruling: hybrid port (pure logic verbatim to TS + React UI) instead of mounting vanilla modules — explorer report: avoids 8 global shims, ~975 lines legacy CSS, StrictMode/tab-unmount fights; spec says tools move to TS keeping tests — cost if wrong: more rewrite effort.
- **Ruling** Task 1: Ruling: terminal.ts engine keeps // @ts-nocheck (712 lines copied verbatim by script, behaviour pinned by 19 ported tests); exported API (MayTerminal etc.) fully typed — cost if wrong: type errors inside the engine are not caught by tsc.
- **Ruling** Task 3: Ruling: buildDocument/buildConsoleDocument escape '</script' and '</style' in inlined student code as '<\/script' — legacy let such code close the tag early (and could inject markup into the preview); equivalent inside JS strings/CSS — cost if wrong: a student who literally needs '</script' outside a string sees a syntax error (it was broken before too).
- **Ruling** Task 3: Ruling: parseJsonLoose returns objects only (legacy accepted an array on the first full parse) — callers expect exercise/feedback/challenge objects — cost if wrong: none.
- **Ruling** Task 3: Ruling: css-patch.ts keeps // @ts-nocheck (verbatim copy); exported signatures typed — cost if wrong: internal type errors not caught.
- **Ruling** Task 4: Ruling: taoBaiTap throws when no description field (legacy showed 'No description') — an exercise without a task is useless; user gets Retry — cost if wrong: one more AI call.
- **Ruling** Task 4: Ruling: design-mode and CTF-challenge AI now go through goiAi (language directive, retry, timeout); challenge prompt dropped 'Viet bang tieng Viet' (directive decides language) — cost if wrong: non-vi learners get challenges in their language instead of Vietnamese.
- **Ruling** Task 5: Ruling: tool UI labels (terminal, CTF, lab, IDE, design panel) stay Vietnamese-only like legacy (allowed by plan Global Constraints) — cost if wrong: non-vi learners see Vietnamese labels inside tools.
- **Ruling** Task 5: Ruling: console-mode presets (TypeScript, dsa JS) run only on 'Chạy' (legacy re-ran 9MB typescript.js on every 300ms keystroke debounce) — cost if wrong: one extra click to see output.
- **Ruling** Task 6: Ruling: original exercise rendered as escaped text (legacy injected raw HTML and swallowed Stack<T>; a scan of 419 exercise strings found no intended markup) — diverges from legacy test app.test.js:91 'curriculum exercise raw' — cost if wrong: an exercise that relies on HTML formatting shows tags as text.
- **Ruling** Task 6: Ruling: textarea 'Run' button only for lessons with lang javascript/js (legacy evaluated every language as JS, e.g. Python) — cost if wrong: none for non-JS; JS learners keep run.
- **Ruling** Task 6: Ruling: useBaiTap keeps a synchronous local mirror of the react-query entry — controlled inputs backed only by setQueryData (async notify) dropped keystrokes; caught by 'o soan giu cau tra loi' test — cost if wrong: none.
- **Ruling** Task 6: Ruling: exercise TabsContent mounts on first visit then stays mounted (forceMount + hidden) so IDE/terminal state survives tab switches — cost if wrong: IDE iframe keeps running while hidden.
- **Ruling** Final: Ruling: declined-to-judge list accepted as-is (Vietnamese tool labels, loose JSON for exercises/grading/challenges, </script escaping, per-device lab progress, client-side CTF flags, infinite loops freeze tab, TS preset 9MB load, legacy default-file leak in full-page htmlcss lessons, CodeArea Tab trap, terminal/lab reset on lesson revisit, main chunk size, Vietnamese ai.ts errors, pre-LRU cache entries) — all legacy parity or plan-mandated — cost if wrong: as listed by reviewer.
- **Ruling** Final: Ruling: ScrollRestoration getKey = URL for key "default" entries (found while debugging the flake): every fresh page load (arriving from the legacy app via location.assign, typed URL) has key "default", so the new page was scrolled to the saved position of a different earlier "default" page; now keyed by pathname+search, reload of the same URL still restores — tests 'vao thang trang React khong nhan vi tri cuon da luu cua mot trang khac' and 'tai lai dung trang do thi tra lai vi tri cuon cu' RED→GREEN, suite 187/187 — cost if wrong: arriving fresh at a URL visited fresh earlier restores that old position.
- **Ruling** Final: Ruling: I4 snapshot excludes the challenge terminal machine (['challenge', uid, 'may'] holds closures, not serializable) — CTF score/solved flags still reset after a legacy round trip (the AI challenge text is kept) — cost if wrong: a learner mid-CTF who opens a legacy page loses CTF progress, as with any reload in the legacy app.
- **Ruling** Final: Ruling: I5 route error UI placed on a pathless wrapper inside the shell (plus layout and /auth fallbacks) rather than only on the layout route — a broken page keeps the sidebar usable; future lazy routes (phase 4) inherit it — cost if wrong: none beyond one extra route level.
- **Minor** LessonPage sets not-found title/og:title while curriculum loads (same as phase-2 deferred meta minor).
- **Minor** LiveIde builds preview twice on mount (initial + 300ms effect).
- **Minor** LiveIde Tab comment mentions Esc that does not exist; Tab writes through controlled value (no undo) unlike CodeArea.
- **Minor** codeDangLam joins all IDE files in key order; boilerplate eats the tutor's 1500-char budget before App.jsx.
- **Minor** no loading indicator on first lazy navigation (useNavigation progress bar).
- **Minor** ChayThuJs tokenRef via effect; no echo of final expression like legacy.
- **Minor** React keys from AI strings (hints/steps) can duplicate.
- **Minor** nano Dialog lacks DialogDescription; vendored dialog sr-only 'Close' is English.
- **Minor** exercise tabs container aria-label on plain div (needs role=group).
- **Minor** useBaiTap queryFn returns RONG — a broad refetch would wipe state (use enabled:false).

## 2026-10-11-react-dot-4-project-lab

- **Ruling** Ruling: plan written without the behavior-mapping workflow (both workflows died on the account spend limit); legacy code read directly instead — cost if wrong: a legacy behavior missed, caught by final review.
- **Ruling** Ruling: idea generation uses taskType 'projectIdea' (legacy omitted taskType -> 'general' although the server allowlist names projectIdea) — cost if wrong: idea requests routed to a pricier model.
- **Ruling** Task 2: Ruling: hooks use-du-an/use-y-tuong move into Task 3 and are tested through page flows (they only exist to serve those pages) — cost if wrong: hook edge cases covered less directly.
- **Ruling** Task 5: Ruling: server-hai-app assertions added after route-owner change (RED observed on route-owner.test.js, not on the server test) — cost if wrong: none, same table.
- **Ruling** Final: Ruling: declined-to-judge list accepted (verbatim prompts checked by parity tests; topic for save/submission = current input like legacy; quota drop of whole snapshot pre-existing).
- **Minor** submission save still attempted after logout/user switch (RLS rejects; stray toast).
- **Minor** idea saved before the ideas list first loads can vanish from the list (still on server).
- **Minor** fallback error strings from AI pipeline/idea validation are Vietnamese-only (legacy parity).
- **Minor** file tabs use role=tablist without tabpanel/arrow keys; close buttons inside tablist.

## 2026-10-11-react-dot-5-career-xoa-app-cu

- **Ruling** Ruling: career chat keeps legacy taskType 'general' (server also maps 'career' to a pricier model; legacy never used it) — cost if wrong: career answers from the cheaper model, same as today.
- **Ruling** Ruling: legacy parity tests (sandpack-parity, project-ai prompt parity) are removed with the legacy files in Task 4; the verbatim copies stay — cost if wrong: future edits to copied prompts are not cross-checked (nothing left to check against).
- **Ruling** Task 4: Ruling: unknown URLs get the React page with HTTP 404 (route-owner kept as the list of known routes) instead of a plain-text 404 — users still see the in-app Not Found page, crawlers see 404 — cost if wrong: a new route added to the router but not to route-owner returns 404 status (page still works).
- **Ruling** Task 4: Ruling: server tests close keep-alive connections on shutdown (one flaky 'fetch failed' seen 1/3 runs after the suite got shorter) — 6/6 green after — cost if wrong: none (test-only).
- **Ruling** Final: Ruling: declined-to-judge list accepted (byte-identical JSON verified in Task 3 by diff -rq; ChatMarkdown unchanged; llms.txt /roadmap/javascript link pre-existing; static serving checked sound).
- **Minor** manual job search overwrites the chat advisor ref, so edit/regenerate/clear may not abort an in-flight /api/ai call (UI correct via phien; wasted call).
- **Minor** after a reload mid-request the dangling user message has no Send-again button (edit still works).
- **Minor** stale wording mentioning the legacy app (server startup banner, viec-dang-lam.ts header, ban-dich-vi.ts header).
