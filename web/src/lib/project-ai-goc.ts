// @ts-nocheck
// SINH TU public/ai-service.js bang chuyen-t4.cjs (scratchpad) — chep NGUYEN VAN, dung sua tay.
// Ban co kieu va phan dieu phoi cham bai nam o project-ai.ts.
import { goiAi, docJson } from './ai';

export function taoDichVuDuAn(client, { lang, signal, cho, ngauNhien = Math.random } = {}) {
  // Ban cu doc ngon ngu tu I18n va so ngau nhien tu Math.random: thay bang tham so de kiem duoc
  const I18n = { getLang: () => lang };
  const Math = Object.assign(Object.create(globalThis.Math), { random: ngauNhien });
  const parseJSON = docJson;
  const callClaude = (system, userMessage, temperature = 0.8, maxTokens = 4096, taskType = 'general') =>
    goiAi(client, { system, user: userMessage, temperature, maxTokens, taskType, lang, signal, cho });

  async function generateProjectIdea(level, topic = null) {
    const system = `Bạn là mentor lập trình giàu kinh nghiệm, chuyên thiết kế project thực hành.
Luôn trả lời bằng JSON hợp lệ, không có text thừa.
NGUYÊN TẮC VÀNG: Mỗi lần phải tạo idea HOÀN TOÀN KHÁC BIỆT. TUYỆT ĐỐI KHÔNG lặp lại dạng "máy tính",  "calculator", hay bất kỳ pattern nào giống nhau.`;

    const seed = Math.random().toString(36).substring(2, 12);
    const rndNum = Math.floor(Math.random() * 1000);

    const levelDescMap = {
      newbie: 'Người mới, chỉ biết cơ bản (biến, vòng lặp, hàm). Project đơn giản, console-based hoặc 1 file HTML.',
      junior: 'Biết OOP cơ bản, DOM. Project nhỏ có UI đơn giản, logic trung bình.',
      mid: 'Thành thạo OOP, API, database cơ bản. Project có frontend-backend, CRUD.',
      senior: 'Kiến trúc tốt, patterns, testing. Project phức tạp, multiple features, real-world.',
      master: 'Expert. Project quy mô lớn, system design, microservices, tối ưu hiệu suất.'
    };

    const categoryPools = {
      newbie: [

        'game đoán số/đoán từ', 'trò chơi oẳn tù tì', 'trò chơi xúc xắc', 'trò chơi tic-tac-toe',
        'game hangman', 'game đuổi hình bắt chữ', 'game maze text-based', 'snake game đơn giản',
        'game flappy bird clone (HTML Canvas)', 'game bắn bóng (Pong)', 'game tung đồng xu',

        'quiz kiến thức (console)', 'to-do list console', 'quản lý danh bạ console',
        'chương trình mã hóa/giải mã tin nhắn (Caesar cipher)', 'trình tạo mật khẩu mạnh',
        'chuyển đổi đơn vị (tiền/nhiệt độ/chiều dài)', 'kiểm tra số nguyên tố/palindrome',
        'bộ sinh nickname/tên nhân vật ngẫu nhiên', 'trình tạo thơ/câu chuyện ngẫu nhiên',

        'bảng tin gia đình (HTML/CSS/JS)', 'sổ ghi chú đơn giản', 'danh sách mua sắm',
        'bộ đếm ngược/đồng hồ bấm giờ', 'từ điển mini offline', 'ứng dụng flashcard học từ vựng',
        'bảng điểm học sinh', 'landing page portfolio cá nhân',

        'chatbot console đơn giản (Python)', 'web scraper đơn giản lấy tin tức (Python)',
        'file organizer tự động sắp xếp thư mục (Python)', 'trình quản lý mật khẩu local (Python)'
      ],
      junior: [

        'platformer game 2D (HTML5 Canvas/Phaser)', 'game bắn zombie (top-down shooter)',
        'puzzle game (Sudoku/2048/Tetris)', 'RPG text-based có inventory system',
        'game đua xe đơn giản', 'game tower defense cơ bản', 'game memory card matching',

        'thời tiết app + API', 'pomodoro timer', 'expense tracker', 'habit tracker',
        'color palette generator', 'markdown previewer', 'typing speed test',
        'meme generator', 'kanban board đơn giản',

        'media player đơn giản (Python Tkinter)', 'file manager GUI (Python)',
        'image viewer/editor cơ bản (crop, resize, filter)', 'screen recorder đơn giản',
        'desktop sticky notes app (Electron)', 'system monitor (CPU/RAM usage)',

        'bot Discord đơn giản', 'bot Telegram nhắc việc', 'web scraper nâng cao + export CSV',
        'auto backup tool (zip files theo lịch)', 'bulk file renamer tool',
        'email sender tự động (SMTP)', 'RSS feed reader',

        'data visualization dashboard (Chart.js)', 'COVID/weather data analyzer',
        'personal finance analyzer từ file CSV', 'GitHub profile stats viewer',

        'pixel art editor', 'drawing app đơn giản', 'music beat maker (Web Audio API)',
        'generative art (p5.js/Canvas)', 'ASCII art generator'
      ],
      mid: [

        'blog platform', 'e-commerce mini', 'chat app real-time (WebSocket)',
        'URL shortener + analytics', 'file sharing service', 'booking system',
        'social media feed', 'job board', 'recipe sharing community',

        'multiplayer game online (Socket.io)', 'game engine 2D đơn giản',
        'chess/cờ vua online', 'game RPG có save/load system',
        'game physics engine (collision detection)', 'card game (Poker/UNO) multiplayer',

        'fitness tracker mobile (React Native/Flutter)', 'recipe app mobile',
        'habit tracker mobile với notifications', 'expense manager mobile + charts',
        'travel planner mobile app', 'plant care reminder app',

        'image classifier (TensorFlow.js hoặc Python)', 'sentiment analysis tool',
        'chatbot thông minh (intent recognition)', 'recommendation engine đơn giản',
        'face detection app (OpenCV)', 'text summarizer (NLP)',

        'REST API framework tự build', 'task queue system (Redis/Bull)',
        'cron job manager dashboard', 'log aggregator + search',
        'database migration tool', 'API rate limiter middleware',

        'code editor đơn giản (syntax highlighting)', 'database GUI client',
        'markdown note-taking app (Electron)', 'torrent client đơn giản',

        'password manager có encryption (AES)', 'network scanner tool',
        'file encryption/decryption tool', 'two-factor auth system',

        'stock price predictor', 'data pipeline ETL tool',
        'web analytics tracker tự build', 'survey/poll creator + data viz'
      ],
      senior: [

        'real-time collaboration tool (like Google Docs)', 'multi-tenant SaaS platform',
        'video streaming platform', 'payment integration system (Stripe)',
        'analytics dashboard (custom Mixpanel)', 'CMS headless',

        'AI chatbot platform (RAG + vector DB)', 'MLOps pipeline dashboard',
        'computer vision app (object detection real-time)', 'voice assistant (speech-to-text + TTS)',
        'AI code reviewer tool', 'image generation UI (Stable Diffusion API)',
        'recommendation system với collaborative filtering',

        'game engine 3D cơ bản (WebGL/Three.js)', 'MMORPG server architecture',
        'procedural world generation', 'game AI (pathfinding, behavior tree)',
        'physics simulation engine', 'voxel engine (Minecraft-like)',

        'CI/CD pipeline dashboard', 'API gateway + load balancer',
        'container orchestration UI', 'feature flag system', 'service health monitor',
        'distributed cache system', 'message queue system (like RabbitMQ)',

        'food delivery app fullstack', 'ride-sharing app prototype',
        'social media app full (stories, reels, DM)', 'IoT mobile dashboard',

        'vulnerability scanner tool', 'SIEM dashboard (security monitoring)',
        'penetration testing toolkit', 'SSL/TLS certificate manager',

        'custom shell/terminal emulator', 'process manager (like PM2)',
        'file sync system (like rsync)', 'virtual filesystem'
      ],
      master: [

        'distributed database (consensus algorithm)', 'search engine (indexer + ranker)',
        'compiler/interpreter cho ngôn ngữ tự tạo', 'operating system kernel module',
        'distributed file system', 'container runtime (like mini Docker)',

        'ML model serving platform (auto-scaling)', 'neural network framework from scratch',
        'reinforcement learning game agent', 'LLM fine-tuning pipeline',
        'distributed training framework', 'AI model marketplace',

        'edge computing framework', 'real-time bidding system (< 100ms)',
        'high-frequency trading simulator', 'CDN simulator + cache invalidation',
        'time-series database tự build', 'in-memory database engine',

        'blockchain network + smart contracts', 'distributed task queue',
        'service mesh implementation', 'consensus protocol (Raft/Paxos)',
        'event sourcing + CQRS framework', 'distributed tracing system',

        'ray tracing engine', 'procedural terrain generator',
        'multiplayer game server (100+ concurrent)', 'custom game scripting language',

        'intrusion detection system (ML-based)', 'zero-knowledge proof system',
        'homomorphic encryption library', 'network protocol analyzer'
      ]
    };

    const pool = categoryPools[level] || categoryPools.mid;
    const randomCategory = pool[Math.floor(Math.random() * pool.length)];
    const levelContext = level ? (levelDescMap[level] || levelDescMap.mid) : '';

    const lang = typeof I18n !== 'undefined' ? I18n.getLang() : 'vi';
    const langInstructions = lang === 'vi'
      ? 'Viết toàn bộ nội dung (tên, mô tả, yêu cầu, các bước, thời gian) bằng Tiếng Việt.'
      : `LANGUAGE MANDATE: Write ALL text fields ("name", "description", "requirements", "steps", "bonusFeatures", "estimatedTime") strictly in ${lang === 'en' ? 'ENGLISH' : lang === 'ja' ? 'JAPANESE' : lang === 'ko' ? 'KOREAN' : lang === 'zh' ? 'CHINESE' : lang === 'fr' ? 'FRENCH' : lang === 'de' ? 'GERMAN' : lang === 'es' ? 'SPANISH' : 'ENGLISH'}. Do NOT use Vietnamese.`;

    let prompt;
    if (topic) {
      const technicalTwists = [
        'thêm tính năng gamification (điểm, badge, leaderboard)',
        'tích hợp AI/ML (gợi ý thông minh, phân tích dữ liệu)',
        'tính năng real-time (live updates, WebSocket)',
        'data visualization đẹp mắt (charts, graphs, dashboard)',
        'tính năng collaboration (nhiều người dùng cùng lúc)',
        'tích hợp API bên ngoài (third-party services)',
        'offline-first (PWA, service worker, sync khi có mạng)',
        'tính năng automation (tự động hóa, scheduled tasks)',
        'UX sáng tạo (drag & drop, animations, gestures)',
        'tính năng social (chia sẻ, bình luận, reactions)',
        'export/import đa dạng (PDF, Excel, JSON, CSV)',
        'notification system (push, email, in-app)',
        'search & filter nâng cao (full-text search, facets)',
        'tích hợp maps/geolocation',
        'multi-language/i18n support',
        'dark mode & theme customization'
      ];

      const twist = technicalTwists[Math.floor(Math.random() * technicalTwists.length)];

      prompt = `Generate 1 creative and realistic programming project idea.
${langInstructions}

🎯 TOPIC (MANDATORY): "${topic}"
${level ? `DIFFICULTY LEVEL: ${level} — ${levelContext}` : 'DIFFICULTY LEVEL: auto-determined'}

💡 Technical Twist (optional): "${twist}"

⚠️ RULES:
1. The project MUST strictly match the topic "${topic}"
2. Seed: ${seed}-${rndNum}
3. ${langInstructions}

Return strictly JSON:
{
  "name": "Concise creative project name",
  "description": "Detailed project description (3-5 sentences)",
  "difficulty": "${level || 'mid'}",
  "techStack": ["recommended technologies"],
  "requirements": ["requirement 1", "requirement 2", "..."],
  "steps": ["step 1: ...", "step 2: ...", "..."],
  "bonusFeatures": ["bonus features for extra credit"],
  "estimatedTime": "${lang === 'vi' ? '6-10 giờ' : '6-10 hours'}"
}`;
    } else {
      prompt = `Generate 1 creative, practical, and difficulty-appropriate programming project idea.
${langInstructions}

DIFFICULTY LEVEL: ${level} — ${levelContext}

🎯 DOMAIN FOR THIS PROJECT: "${randomCategory}"

⚠️ RULES:
- The project MUST be within the domain "${randomCategory}"
- Do NOT generate simple calculator/converter unless requested
- The project MUST fit the ${level} difficulty level
- Seed: ${seed}-${rndNum}
- ${langInstructions}

Return strictly JSON:
{
  "name": "Concise creative project name",
  "description": "Detailed project description (3-5 sentences) explaining why it is impactful",
  "difficulty": "${level}",
  "techStack": ["recommended technologies suitable for level"],
  "requirements": ["functional requirement 1", "requirement 2", "requirement 3", "..."],
  "steps": ["step 1: ...", "step 2: ...", "step 3: ...", "..."],
  "bonusFeatures": ["bonus features for advanced learning"],
  "estimatedTime": "${lang === 'vi' ? '6-10 giờ' : '6-10 hours'}"
}`;
    }

    const text = await callClaude(system, prompt, 0.95, 4096, 'projectIdea');
    return parseJSON(text);
  }

  async function chatAboutProject(projectContext, chatHistory, userMessage) {
    const system = `Bạn là mentor lập trình. Đang hướng dẫn học viên làm project.
Trả lời ngắn gọn, dễ hiểu, có code example khi cần.
KHÔNG trả lời bằng JSON. Trả lời bằng text thường, có thể dùng markdown.
Nếu học viên hỏi về code của họ, hãy phân tích code họ đã gửi bên dưới.
Context project hiện tại:
${projectContext}`;

    const conversationContext = chatHistory.length > 0
      ? 'Lịch sử hội thoại:\n' + chatHistory.map(m => `${m.role === 'user' ? 'Học viên' : 'Mentor'}: ${m.content}`).join('\n') + '\n\n'
      : '';

    return await callClaude(system, conversationContext + userMessage, 0.7, 4096, 'projectChat');
  }

  function localAnalyze(code, filename = '') {
    const lines = code.split('\n');
    const ext = filename.split('.').pop().toLowerCase();
    const isJS = ['js', 'jsx', 'ts', 'tsx', 'mjs'].includes(ext);
    const isCSS = ['css', 'scss', 'less'].includes(ext);
    const isHTML = ['html', 'htm'].includes(ext);
    const isPython = ['py'].includes(ext);

    const issues = [];
    const stats = {
      totalLines: lines.length,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
      longestLine: 0,
      functions: 0,
      classes: 0
    };

    let inBlockComment = false;
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) { stats.blankLines++; return; }
      if (trimmed.startsWith('/*')) inBlockComment = true;
      if (inBlockComment) {
        stats.commentLines++;
        if (trimmed.includes('*/')) inBlockComment = false;
        return;
      }
      if (trimmed.startsWith('//') || trimmed.startsWith('#')) { stats.commentLines++; return; }
      stats.codeLines++;
      if (line.length > stats.longestLine) stats.longestLine = line.length;
      if (isJS && /\bfunction\b/.test(trimmed)) stats.functions++;
      if (/\bclass\b/.test(trimmed)) stats.classes++;
    });

    if (isJS) {
      lines.forEach((line, i) => {
        const ln = i + 1;
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

        if (/\bvar\s+\w/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Dùng "var" — nên dùng "const" hoặc "let"`, line: ln });
        }

        if (/[^=!<>]={2}[^=]/.test(trimmed) && !/===/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Dùng "==" — nên dùng "===" (so sánh chặt)`, line: ln });
        }

        if (/\bconsole\.(log|warn|error|debug|info)\b/.test(trimmed)) {
          issues.push({ severity: 'info', message: `console.log còn sót — nên xóa trước khi submit`, line: ln });
        }

        if (/\b(let|const|var)\s+[a-df-hln-z]\s*[=;,]/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Tên biến quá ngắn (1 ký tự) — nên đặt tên rõ ràng`, line: ln });
        }

        if (line.length > 150) {
          issues.push({ severity: 'info', message: `Dòng quá dài (${line.length} ký tự) — nên tách nhỏ`, line: ln });
        }

        if (/catch\s*\(\s*\w*\s*\)\s*\{\s*\}/.test(trimmed)) {
          issues.push({ severity: 'error', message: `Empty catch block — lỗi bị nuốt mất, nên xử lý`, line: ln });
        }

        if (/[=<>+\-*\/]\s*\b([3-9]\d{2,}|[1-9]\d{3,})\b/.test(trimmed) && !/setTimeout|setInterval|delay|port|status|width|height/.test(trimmed)) {
          issues.push({ severity: 'info', message: `"Magic number" — nên tạo constant có tên rõ ràng`, line: ln });
        }

        if (/\}\s*\)\s*\}\s*\)\s*\}/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Callback hell — nên dùng async/await hoặc tách hàm`, line: ln });
        }

        if (/\b(TODO|FIXME|HACK|XXX|BUG)\b/i.test(trimmed)) {
          issues.push({ severity: 'info', message: `"${trimmed.match(/\b(TODO|FIXME|HACK|XXX|BUG)\b/i)[0]}" — cần xử lý trước khi submit`, line: ln });
        }

        if (/\balert\s*\(/.test(trimmed)) {
          issues.push({ severity: 'info', message: `Dùng alert() — nên thay bằng UI notification`, line: ln });
        }

        if (/document\.write\s*\(/.test(trimmed)) {
          issues.push({ severity: 'error', message: `document.write() — nguy hiểm, nên dùng DOM manipulation`, line: ln });
        }

        if (/\beval\s*\(/.test(trimmed)) {
          issues.push({ severity: 'error', message: `eval() — nguy hiểm về bảo mật, TUYỆT ĐỐI KHÔNG dùng`, line: ln });
        }

        if (/\.innerHTML\s*=/.test(trimmed) && /\$\{|\+\s*\w/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `innerHTML với biến — có nguy cơ XSS, nên sanitize`, line: ln });
        }
      });

      if (stats.codeLines > 300) {
        issues.push({ severity: 'warning', message: `File quá dài (${stats.codeLines} dòng code) — nên tách thành module nhỏ hơn` });
      }
      if (stats.functions > 20) {
        issues.push({ severity: 'info', message: `Quá nhiều functions (${stats.functions}) trong 1 file — nên tách module` });
      }
      if (stats.commentLines === 0 && stats.codeLines > 50) {
        issues.push({ severity: 'info', message: `Không có comment — nên thêm comment cho logic phức tạp` });
      }
    }

    if (isCSS) {
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (/!important/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `!important — nên tránh, fix CSS specificity thay vì ép buộc`, line: i + 1 });
        }
      });
      if (stats.codeLines > 500) {
        issues.push({ severity: 'info', message: `CSS quá dài (${stats.codeLines} dòng) — nên tách thành modules` });
      }
    }

    if (isHTML) {
      const fullCode = code.toLowerCase();
      if (!/<meta\s+name="viewport"/.test(fullCode)) {
        issues.push({ severity: 'warning', message: `Thiếu meta viewport — sẽ hiển thị sai trên mobile` });
      }
      if (!/<title>/.test(fullCode)) {
        issues.push({ severity: 'warning', message: `Thiếu <title> — quan trọng cho SEO` });
      }
      if ((fullCode.match(/<h1/g) || []).length > 1) {
        issues.push({ severity: 'info', message: `Nhiều hơn 1 thẻ <h1> — chỉ nên có 1 cho SEO` });
      }
      if (!/<html\s+lang=/.test(fullCode)) {
        issues.push({ severity: 'info', message: `<html> thiếu thuộc tính lang — nên thêm cho accessibility` });
      }
    }

    if (isPython) {
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (/\bprint\s*\(/.test(trimmed) && !trimmed.startsWith('#')) {
          issues.push({ severity: 'info', message: `print() còn sót — nên dùng logging module`, line: i + 1 });
        }
        if (/\bexcept\s*:/.test(trimmed)) {
          issues.push({ severity: 'error', message: `Bare except — nên chỉ định exception cụ thể`, line: i + 1 });
        }
        if (/\bimport\s+\*/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `import * — nên import cụ thể`, line: i + 1 });
        }
      });
    }

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    let score = 100;
    score -= errorCount * 10;
    score -= warnCount * 4;
    score -= infoCount * 1;

    if (stats.codeLines < 5) score -= 20;
    if (stats.longestLine > 200) score -= 5;
    score = Math.max(0, Math.min(100, score));

    return {
      fileName: filename,
      score,
      stats,
      issues,
      errorCount,
      warnCount,
      infoCount,
      grade: score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F'
    };
  }

  function localAnalyzeAll(projectFiles) {
    const results = projectFiles
      .filter(f => f.code.trim())
      .map(f => localAnalyze(f.code, f.name));
    const avgScore = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length) : 0;
    const totalIssues = results.reduce((s, r) => s + r.issues.length, 0);
    const totalErrors = results.reduce((s, r) => s + r.errorCount, 0);
    const totalWarnings = results.reduce((s, r) => s + r.warnCount, 0);
    return { files: results, avgScore, totalIssues, totalErrors, totalWarnings };
  }

  function smartTruncateCode(code, maxLines = 300) {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    const keepTop = Math.floor(maxLines * 0.6);
    const keepBottom = maxLines - keepTop;
    const omitted = lines.length - keepTop - keepBottom;
    return [
      ...lines.slice(0, keepTop),
      `\n// ... [${omitted} dòng bị lược bỏ do file quá dài] ...\n`,
      ...lines.slice(-keepBottom)
    ].join('\n');
  }

  function groupFilesIntoModules(files) {
    const categories = {
      markup:  { label: '📄 Markup (HTML)', langs: ['html'], files: [] },
      styles:  { label: '🎨 Styles (CSS)', langs: ['css'], files: [] },
      logic:   { label: '⚙️ Logic (JS/TS/Python...)', langs: ['javascript','typescript','python','java','cpp','csharp','go','rust','php','ruby','kotlin','swift','dart'], files: [] },
      config:  { label: '📋 Config', langs: ['json','yaml','toml','xml'], files: [] },
      data:    { label: '🗄️ Data', langs: ['sql','csv','graphql'], files: [] }
    };

    for (const f of files) {
      let placed = false;
      for (const cat of Object.values(categories)) {
        if (cat.langs.includes(f.lang)) { cat.files.push(f); placed = true; break; }
      }
      if (!placed) categories.logic.files.push(f);
    }

    return Object.entries(categories)
      .filter(([, cat]) => cat.files.length > 0)
      .map(([key, cat]) => ({ id: key, label: cat.label, files: cat.files }));
  }

  async function reviewStructure(projectFiles, projectIdea) {
    const system = `Bạn là giảng viên lập trình. Đánh giá CẤU TRÚC project (không cần đọc code). Trả lời bằng JSON ngắn gọn.`;

    const fileList = projectFiles.map(f => {
      const lineCount = f.code.split('\n').length;
      const size = f.code.length;
      return `- ${f.name} (${f.lang}, ${lineCount} dòng, ${size} ký tự)`;
    }).join('\n');

    const prompt = `Đánh giá CẤU TRÚC project "${projectIdea.name}":

PROJECT: ${projectIdea.name}
MÔ TẢ: ${projectIdea.description}
YÊU CẦU: ${(projectIdea.requirements || []).join(', ')}

DANH SÁCH FILES:
${fileList}

Chỉ đánh giá: cách đặt tên file, tổ chức project, có đủ file cần thiết không, có thừa file không.
KHÔNG CẦN đọc code — chỉ phân tích metadata.

Trả về JSON:
{
  "structureScore": 0-100,
  "naming": "nhận xét đặt tên file",
  "organization": "nhận xét tổ chức",
  "completeness": "có đủ file cho yêu cầu không",
  "missingFiles": ["file nên có nhưng thiếu"],
  "suggestions": ["gợi ý cải thiện cấu trúc"]
}`;

    const text = await callClaude(system, prompt, 0.3, 2048);
    return parseJSON(text);
  }

  async function reviewModule(moduleInfo, projectIdea, localResults) {
    const system = `Bạn là giảng viên lập trình. Đánh giá một MODULE gồm nhiều file liên quan. Trả lời bằng JSON.
QUAN TRỌNG: Static analysis đã chạy trước. Tập trung vào LOGIC, KIẾN TRÚC, TƯƠNG TÁC GIỮA CÁC FILE — không nhắc lại lỗi cơ bản.`;

    const fileBlocks = moduleInfo.files.map(f => {
      const code = smartTruncateCode(f.code, 300);
      const lineCount = f.code.split('\n').length;

      const localResult = localResults.files.find(r => r.fileName === f.name);
      let localNote = '';
      if (localResult && localResult.issues.length > 0) {
        const topIssues = localResult.issues.slice(0, 5).map(i =>
          `[${i.severity.toUpperCase()}] ${i.message}`
        ).join(', ');
        localNote = `\n  ⚠️ Static Analysis: ${localResult.score}/100 — ${topIssues}`;
      }

      return `### ${f.name} (${f.lang}, ${lineCount} dòng)${localNote}
\`\`\`${f.lang || 'javascript'}
${code}
\`\`\``;
    }).join('\n\n');

    const prompt = `Đánh giá MODULE "${moduleInfo.label}" trong project "${projectIdea.name}":

PROJECT: ${projectIdea.name}
MÔ TẢ: ${projectIdea.description}
YÊU CẦU: ${(projectIdea.requirements || []).join(', ')}

MODULE: ${moduleInfo.label} (${moduleInfo.files.length} files)

${fileBlocks}

Đánh giá TỔNG THỂ module này (không phải từng file riêng lẻ):
- Các file phối hợp tốt không?
- Logic đúng yêu cầu không?
- Có lỗ hổng bảo mật không?

Trả về JSON:
{
  "moduleId": "${moduleInfo.id}",
  "moduleLabel": "${moduleInfo.label}",
  "score": 0-100,
  "codeQuality": 0-10,
  "logic": 0-10,
  "errorHandling": 0-10,
  "relevance": 0-10,
  "cohesion": 0-10,
  "summary": "nhận xét tổng thể module 2-3 câu",
  "fileScores": [${moduleInfo.files.map(f => `{"file": "${f.name}", "score": 0}`).join(', ')}],
  "issues": ["vấn đề 1", "vấn đề 2"],
  "positives": ["điểm tốt 1", "điểm tốt 2"]
}`;

    const text = await callClaude(system, prompt, 0.3, 4096, 'projectReview');
    return parseJSON(text);
  }

  async function synthesizeReview(structureReview, moduleReviews, localAnalysis, projectIdea, totalFiles) {
    const system = `Bạn là giảng viên lập trình. Tổng hợp đánh giá TẤT CẢ các tầng thành kết luận cuối cùng. Trả lời bằng JSON.`;

    const structureSummary = `CẤU TRÚC (${structureReview.structureScore}/100):
- Đặt tên: ${structureReview.naming || 'N/A'}
- Tổ chức: ${structureReview.organization || 'N/A'}
- Đầy đủ: ${structureReview.completeness || 'N/A'}
- Thiếu: ${(structureReview.missingFiles || []).join(', ') || 'Không'}`;

    const moduleSummary = moduleReviews.map(m =>
      `MODULE ${m.moduleLabel}: ${m.score}/100 | Quality:${m.codeQuality} Logic:${m.logic} Error:${m.errorHandling} Relevance:${m.relevance} Cohesion:${m.cohesion || 'N/A'}
  Files: ${(m.fileScores || []).map(fs => `${fs.file}(${fs.score})`).join(', ')}
  Summary: ${m.summary}
  Issues: ${(m.issues || []).join('; ')}
  Positives: ${(m.positives || []).join('; ')}`
    ).join('\n\n');

    const localSummary = `LOCAL ANALYSIS: Score ${localAnalysis.avgScore}/100, ${localAnalysis.totalErrors} errors, ${localAnalysis.totalWarnings} warnings`;

    const prompt = `Tổng hợp đánh giá project "${projectIdea.name}" từ 3 tầng:

PROJECT: ${projectIdea.name}
MÔ TẢ: ${projectIdea.description}
YÊU CẦU: ${(projectIdea.requirements || []).join(', ')}
TỔNG SỐ FILES: ${totalFiles}

═══ TẦNG 1: ${structureSummary}

═══ TẦNG 2: ĐÁNH GIÁ MODULES
${moduleSummary}

═══ LOCAL ANALYSIS: ${localSummary}

Tổng hợp TẤT CẢ thông tin trên. Điểm cuối cùng phải phản ánh cả 3 tầng.
Trả về JSON:
{
  "score": 0-100,
  "status": "excellent|good|partial|needs_work",
  "summary": "nhận xét tổng thể 2-3 câu",
  "criteria": [
    {"name": "Cấu trúc project", "score": 0-20, "comment": "..."},
    {"name": "Code quality", "score": 0-20, "comment": "..."},
    {"name": "Logic & Algorithm", "score": 0-20, "comment": "..."},
    {"name": "Error handling", "score": 0-20, "comment": "..."},
    {"name": "Bonus & Creativity", "score": 0-20, "comment": "..."}
  ],
  "strengths": ["điểm mạnh 1", "..."],
  "improvements": ["cần cải thiện 1", "..."],
  "tips": ["gợi ý nâng cao 1", "..."]
}`;

    const text = await callClaude(system, prompt, 0.3, 8192, 'projectReview');
    return parseJSON(text);
  }

  function buildSubmission({ review, idea, files, difficulty, topic }) {
    const tieuChi = Array.isArray(review && review.criteria) ? review.criteria : [];
    // Tim tieu chi theo ten; AI doi ten thi lui ve vi tri trong prompt synthesizeReview
    const diem = (mau, viTri) => {
      const c = tieuChi.find(x => mau.test(String(x && x.name))) || tieuChi[viTri];
      const so = Number(c && c.score);
      return Number.isFinite(so) ? so : null;
    };
    const thang100 = so => (so == null ? null : Math.round(so * 5));

    const cauTruc = diem(/cấu trúc|structure/i, 0);
    const xuLyLoi = diem(/error|lỗi/i, 3);
    const thucHanh = cauTruc == null || xuLyLoi == null
      ? (cauTruc ?? xuLyLoi)
      : (cauTruc + xuLyLoi) / 2;
    const tong = Number(review && review.score);

    return {
      projectName: (idea && idea.name) || 'Unnamed',
      projectDescription: (idea && idea.description) || '',
      difficultyLevel: difficulty || (idea && idea.difficulty) || 'mid',
      topic: topic || '',
      files: (files || []).map(f => ({ name: f.name, lang: f.lang, code: f.code })),
      review,
      scoreOverall: Number.isFinite(tong) ? Math.round(tong) : null,
      scoreCodeQuality: thang100(diem(/quality|chất lượng/i, 1)),
      scoreFunctionality: thang100(diem(/logic|algorithm|thuật toán/i, 2)),
      scoreBestPractices: thang100(thucHanh),
      scoreCreativity: thang100(diem(/creativ|sáng tạo|bonus/i, 4)),
      aiFeedback: typeof (review && review.summary) === 'string' ? review.summary : '',
      aiStrengths: (review && review.strengths) || [],
      aiImprovements: (review && review.improvements) || [],
      languagesUsed: [...new Set((files || []).map(f => f.lang).filter(Boolean))]
    };
  }

  return { generateProjectIdea, chatAboutProject, localAnalyze, localAnalyzeAll, smartTruncateCode, groupFilesIntoModules, reviewStructure, reviewModule, synthesizeReview, buildSubmission };
}
