// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — AI Service (Claude API via local proxy)
// ═══════════════════════════════════════════════════════════════

const AIService = (() => {
  let _enabled = null; // cached health check

  // ─── Check if AI is available ───
  async function checkHealth() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      _enabled = data.aiEnabled;
      return data;
    } catch {
      _enabled = false;
      return { status: 'error', aiEnabled: false };
    }
  }

  function isEnabled() {
    return _enabled;
  }

  // ─── Token estimation (~4 chars per token for code) ───
  function estimateTokens(text) {
    return Math.ceil((text || '').length / 3.5);
  }

  // ─── Core Claude Call (via server proxy) with auto-retry ───
  async function callClaude(system, userMessage, temperature = 0.8, maxTokens = 4096) {
    const MAX_RETRIES = 3;
    const RETRY_DELAYS = [2000, 4000, 8000]; // exponential backoff

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system,
            messages: [{ role: 'user', content: userMessage }],
            temperature,
            max_tokens: maxTokens
          })
        });

        // Retry on overload (429/529)
        if ((res.status === 429 || res.status === 529) && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS[attempt] || 8000;
          console.warn(`Claude API overloaded (${res.status}), retrying in ${delay/1000}s... (${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(err.error || `Claude API Error: ${res.status}`);
        }

        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (!text) throw new Error('Empty AI response');
        return text;
      } catch (err) {
        // Retry on network errors too
        if (attempt < MAX_RETRIES && (err.message.includes('529') || err.message.includes('429') || err.name === 'TypeError')) {
          const delay = RETRY_DELAYS[attempt] || 8000;
          console.warn(`Retry ${attempt + 1}/${MAX_RETRIES}: ${err.message}`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }
  }

  // ─── Parse JSON from AI response (robust) ───
  function parseJSON(text) {
    // Strip markdown code blocks first (```json ... ```)
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    // Try direct parse
    try { return JSON.parse(cleaned); } catch {}
    // Try extracting JSON array
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) { try { return JSON.parse(arrayMatch[0]); } catch {} }
    // Try extracting JSON object
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) { try { return JSON.parse(objMatch[0]); } catch {} }
    throw new Error('Cannot parse AI response as JSON');
  }

  // ─── Generate Quiz ───
  async function generateQuiz(techName, levelName, lessonTitle, lessonTheory, count = 4) {
    const system = `Bạn là giảng viên lập trình chuyên nghiệp. Luôn trả lời bằng JSON hợp lệ, không có text thừa. Mỗi lần tạo quiz phải hoàn toàn MỚI và KHÁC BIỆT.`;

    // Random factors to force variety
    const seed = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    const focusAngles = [
      'tập trung vào lỗi thường gặp và edge cases',
      'tập trung vào ứng dụng thực tế trong dự án',
      'tập trung vào so sánh các cách tiếp cận khác nhau',
      'tập trung vào best practices và anti-patterns',
      'tập trung vào hiệu suất và tối ưu hóa',
      'tập trung vào debug và xử lý lỗi',
      'tập trung vào syntax và ngữ pháp ngôn ngữ',
      'tập trung vào tình huống phỏng vấn thực tế'
    ];
    const angle = focusAngles[Math.floor(Math.random() * focusAngles.length)];
    const difficultyMix = [
      '2 dễ, 1 trung bình, 1 khó',
      '1 dễ, 2 trung bình, 1 khó',
      '1 dễ, 1 trung bình, 2 khó',
      '0 dễ, 2 trung bình, 2 khó'
    ];
    const difficulty = difficultyMix[Math.floor(Math.random() * difficultyMix.length)];

    const prompt = `Tạo ${count} câu hỏi trắc nghiệm HOÀN TOÀN MỚI cho bài học:

CÔNG NGHỆ: ${techName}
CẤP ĐỘ: ${levelName}
BÀI HỌC: ${lessonTitle}
NỘI DUNG BÀI HỌC:
${(lessonTheory || '').substring(0, 2500)}

⚠️ RÀNG BUỘC NGHIÊM NGẶT:
- CHỈ hỏi về nội dung TRONG bài học "${lessonTitle}" ở trên
- TUYỆT ĐỐI KHÔNG hỏi về chủ đề ngoài phạm vi bài học (ví dụ: nếu bài về "Biến & Kiểu dữ liệu" thì KHÔNG hỏi về struct, class, pointer, OOP, v.v.)
- Cấp độ: ${levelName} — câu hỏi phải PHÙ HỢP với trình độ này
- Nếu bài là Newbie thì CHỈ hỏi kiến thức cơ bản, đừng hỏi nâng cao

YÊU CẦU:
- Mỗi câu 4 đáp án, 1 đúng
- Phân bổ độ khó: ${difficulty}
- GÓC ĐỘ: ${angle}
- Câu hỏi ĐA DẠNG: lý thuyết, code output, tìm lỗi, chọn cách viết đúng
- Viết tiếng Việt, code giữ tiếng Anh
- Seed: ${seed}

FORMAT CODE:
- Nếu câu hỏi CÓ code, tách thành 2 field: "question" (text) và "code" (đoạn code)
- Code trong "code" PHẢI có xuống dòng (\\n), KHÔNG viết 1 dòng
- Nếu KHÔNG có code thì bỏ field "code"

JSON array:
[{"question":"...","code":"int x = 5;\\nint y = 10;\\ncout << x + y;","options":["15","10","5","Lỗi"],"correct":0,"explanation":"..."}]`;


    const text = await callClaude(system, prompt, 0.85);
    const parsed = parseJSON(text);
    if (!Array.isArray(parsed)) throw new Error('Expected array');
    return parsed.filter(q =>
      q.question && Array.isArray(q.options) && q.options.length >= 3 &&
      typeof q.correct === 'number' && q.explanation
    );
  }

  // ─── Generate Exercise ───
  async function generateExercise(techName, levelName, lessonTitle, lessonTheory, existingExercise) {
    const system = `Bạn là giảng viên lập trình. Luôn trả lời bằng JSON hợp lệ.`;

    const prompt = `Tạo 1 bài tập thực hành MỚI:

CÔNG NGHỆ: ${techName}
CẤP ĐỘ: ${levelName}
BÀI HỌC: ${lessonTitle}
NỘI DUNG: ${(lessonTheory || '').substring(0, 800)}
BÀI TẬP CŨ (tránh trùng): ${existingExercise || 'Không có'}

Trả về JSON:
{"title":"...","description":"Mô tả chi tiết","hints":["gợi ý 1","gợi ý 2"],"sampleInput":"...","expectedOutput":"...","solution":"code solution","solutionLang":"python/cpp/java/etc"}`;

    const text = await callClaude(system, prompt, 0.85);
    return parseJSON(text);
  }

  // ─── Check User Answer ───
  async function checkAnswer(techName, exerciseDesc, userAnswer, lang) {
    const system = `Bạn là giảng viên lập trình. Đánh giá bài làm chính xác. Trả lời bằng JSON.`;

    const prompt = `Đánh giá bài làm của học viên:

CÔNG NGHỆ: ${techName}
BÀI TẬP: ${exerciseDesc}

BÀI LÀM:
\`\`\`${lang || ''}
${userAnswer}
\`\`\`

Trả về JSON:
{"score":0-100,"status":"correct|partial|incorrect","feedback":"nhận xét tổng thể","errors":["lỗi nếu có"],"suggestions":["gợi ý cải thiện"],"correctedCode":"code sửa nếu cần"}`;

    const text = await callClaude(system, prompt, 0.3);
    return parseJSON(text);
  }

  // ─── Generate Project Idea ───
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
        // 🎮 Games
        'game đoán số/đoán từ', 'trò chơi oẳn tù tì', 'trò chơi xúc xắc', 'trò chơi tic-tac-toe',
        'game hangman', 'game đuổi hình bắt chữ', 'game maze text-based', 'snake game đơn giản',
        'game flappy bird clone (HTML Canvas)', 'game bắn bóng (Pong)', 'game tung đồng xu',
        // 📝 Console/CLI
        'quiz kiến thức (console)', 'to-do list console', 'quản lý danh bạ console',
        'chương trình mã hóa/giải mã tin nhắn (Caesar cipher)', 'trình tạo mật khẩu mạnh',
        'chuyển đổi đơn vị (tiền/nhiệt độ/chiều dài)', 'kiểm tra số nguyên tố/palindrome',
        'bộ sinh nickname/tên nhân vật ngẫu nhiên', 'trình tạo thơ/câu chuyện ngẫu nhiên',
        // 🌐 Web đơn giản
        'bảng tin gia đình (HTML/CSS/JS)', 'sổ ghi chú đơn giản', 'danh sách mua sắm',
        'bộ đếm ngược/đồng hồ bấm giờ', 'từ điển mini offline', 'ứng dụng flashcard học từ vựng',
        'bảng điểm học sinh', 'landing page portfolio cá nhân',
        // 🐍 Python cơ bản
        'chatbot console đơn giản (Python)', 'web scraper đơn giản lấy tin tức (Python)',
        'file organizer tự động sắp xếp thư mục (Python)', 'trình quản lý mật khẩu local (Python)'
      ],
      junior: [
        // 🎮 Games
        'platformer game 2D (HTML5 Canvas/Phaser)', 'game bắn zombie (top-down shooter)',
        'puzzle game (Sudoku/2048/Tetris)', 'RPG text-based có inventory system',
        'game đua xe đơn giản', 'game tower defense cơ bản', 'game memory card matching',
        // 🌐 Web App
        'thời tiết app + API', 'pomodoro timer', 'expense tracker', 'habit tracker',
        'color palette generator', 'markdown previewer', 'typing speed test',
        'meme generator', 'kanban board đơn giản',
        // 🖥️ Desktop/GUI
        'media player đơn giản (Python Tkinter)', 'file manager GUI (Python)',
        'image viewer/editor cơ bản (crop, resize, filter)', 'screen recorder đơn giản',
        'desktop sticky notes app (Electron)', 'system monitor (CPU/RAM usage)',
        // 🤖 Automation/CLI
        'bot Discord đơn giản', 'bot Telegram nhắc việc', 'web scraper nâng cao + export CSV',
        'auto backup tool (zip files theo lịch)', 'bulk file renamer tool',
        'email sender tự động (SMTP)', 'RSS feed reader',
        // 📊 Data
        'data visualization dashboard (Chart.js)', 'COVID/weather data analyzer',
        'personal finance analyzer từ file CSV', 'GitHub profile stats viewer',
        // 🎨 Creative
        'pixel art editor', 'drawing app đơn giản', 'music beat maker (Web Audio API)',
        'generative art (p5.js/Canvas)', 'ASCII art generator'
      ],
      mid: [
        // 🌐 Web Fullstack
        'blog platform', 'e-commerce mini', 'chat app real-time (WebSocket)',
        'URL shortener + analytics', 'file sharing service', 'booking system',
        'social media feed', 'job board', 'recipe sharing community',
        // 🎮 Games nâng cao
        'multiplayer game online (Socket.io)', 'game engine 2D đơn giản',
        'chess/cờ vua online', 'game RPG có save/load system',
        'game physics engine (collision detection)', 'card game (Poker/UNO) multiplayer',
        // 📱 Mobile
        'fitness tracker mobile (React Native/Flutter)', 'recipe app mobile',
        'habit tracker mobile với notifications', 'expense manager mobile + charts',
        'travel planner mobile app', 'plant care reminder app',
        // 🤖 AI/ML
        'image classifier (TensorFlow.js hoặc Python)', 'sentiment analysis tool',
        'chatbot thông minh (intent recognition)', 'recommendation engine đơn giản',
        'face detection app (OpenCV)', 'text summarizer (NLP)',
        // ⚙️ Backend/DevOps
        'REST API framework tự build', 'task queue system (Redis/Bull)',
        'cron job manager dashboard', 'log aggregator + search',
        'database migration tool', 'API rate limiter middleware',
        // 🖥️ Desktop
        'code editor đơn giản (syntax highlighting)', 'database GUI client',
        'markdown note-taking app (Electron)', 'torrent client đơn giản',
        // 🔒 Security
        'password manager có encryption (AES)', 'network scanner tool',
        'file encryption/decryption tool', 'two-factor auth system',
        // 📊 Data Science
        'stock price predictor', 'data pipeline ETL tool',
        'web analytics tracker tự build', 'survey/poll creator + data viz'
      ],
      senior: [
        // 🌐 Web Scale
        'real-time collaboration tool (like Google Docs)', 'multi-tenant SaaS platform',
        'video streaming platform', 'payment integration system (Stripe)',
        'analytics dashboard (custom Mixpanel)', 'CMS headless',
        // 🤖 AI/ML nâng cao
        'AI chatbot platform (RAG + vector DB)', 'MLOps pipeline dashboard',
        'computer vision app (object detection real-time)', 'voice assistant (speech-to-text + TTS)',
        'AI code reviewer tool', 'image generation UI (Stable Diffusion API)',
        'recommendation system với collaborative filtering',
        // 🎮 Game Engine/Complex Games
        'game engine 3D cơ bản (WebGL/Three.js)', 'MMORPG server architecture',
        'procedural world generation', 'game AI (pathfinding, behavior tree)',
        'physics simulation engine', 'voxel engine (Minecraft-like)',
        // ⚙️ Infrastructure
        'CI/CD pipeline dashboard', 'API gateway + load balancer',
        'container orchestration UI', 'feature flag system', 'service health monitor',
        'distributed cache system', 'message queue system (like RabbitMQ)',
        // 📱 Mobile nâng cao
        'food delivery app fullstack', 'ride-sharing app prototype',
        'social media app full (stories, reels, DM)', 'IoT mobile dashboard',
        // 🔒 Security
        'vulnerability scanner tool', 'SIEM dashboard (security monitoring)',
        'penetration testing toolkit', 'SSL/TLS certificate manager',
        // 🖥️ System
        'custom shell/terminal emulator', 'process manager (like PM2)',
        'file sync system (like rsync)', 'virtual filesystem'
      ],
      master: [
        // 🏗️ System Design
        'distributed database (consensus algorithm)', 'search engine (indexer + ranker)',
        'compiler/interpreter cho ngôn ngữ tự tạo', 'operating system kernel module',
        'distributed file system', 'container runtime (like mini Docker)',
        // 🤖 AI/ML Expert
        'ML model serving platform (auto-scaling)', 'neural network framework from scratch',
        'reinforcement learning game agent', 'LLM fine-tuning pipeline',
        'distributed training framework', 'AI model marketplace',
        // ⚡ Performance
        'edge computing framework', 'real-time bidding system (< 100ms)',
        'high-frequency trading simulator', 'CDN simulator + cache invalidation',
        'time-series database tự build', 'in-memory database engine',
        // 🔗 Distributed Systems
        'blockchain network + smart contracts', 'distributed task queue',
        'service mesh implementation', 'consensus protocol (Raft/Paxos)',
        'event sourcing + CQRS framework', 'distributed tracing system',
        // 🎮 Advanced
        'ray tracing engine', 'procedural terrain generator',
        'multiplayer game server (100+ concurrent)', 'custom game scripting language',
        // 🔒 Security Expert
        'intrusion detection system (ML-based)', 'zero-knowledge proof system',
        'homomorphic encryption library', 'network protocol analyzer'
      ]
    };

    const pool = categoryPools[level] || categoryPools.mid;
    const randomCategory = pool[Math.floor(Math.random() * pool.length)];
    const levelContext = level ? (levelDescMap[level] || levelDescMap.mid) : '';

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

      prompt = `Tạo 1 idea project lập trình SÁNG TẠO và THỰC TẾ.

🎯 CHỦ ĐỀ (BẮT BUỘC PHẢI ĐÚNG): "${topic}"
${level ? `CẤP ĐỘ: ${level} — ${levelContext}` : 'CẤP ĐỘ: tự xác định phù hợp với chủ đề'}

💡 Twist kỹ thuật để thêm phần thú vị (tùy chọn, nếu phù hợp): "${twist}"

⚠️ QUY TẮC:
1. Project PHẢI ĐÚNG chủ đề "${topic}" — không được lệch sang chủ đề khác
2. VD: "tạo AI như Claude" → project về xây dựng AI chatbot. "quản lý kho" → app quản lý kho hàng
3. Twist kỹ thuật chỉ là GỢI Ý THÊM, bỏ qua nếu không phù hợp với chủ đề
4. Tên project phải phản ánh ĐÚNG nội dung chủ đề user yêu cầu
5. Mỗi lần phải cho idea KHÁC nhau — thay đổi approach, tech stack, hoặc scope

Seed: ${seed}-${rndNum}

Trả về JSON:
{
  "name": "Tên project ngắn gọn (tiếng Việt hoặc tiếng Anh)",
  "description": "Mô tả chi tiết project (3-5 câu)",
  "difficulty": "newbie|junior|mid|senior|master",
  "techStack": ["các công nghệ gợi ý"],
  "requirements": ["yêu cầu 1", "yêu cầu 2", "..."],
  "steps": ["bước 1: ...", "bước 2: ...", "..."],
  "bonusFeatures": ["tính năng bonus nếu muốn nâng cao"],
  "estimatedTime": "thời gian ước tính"
}`;
    } else {
      prompt = `Tạo 1 idea project lập trình SÁNG TẠO, THỰC TẾ và PHÙ HỢP cấp độ.

CẤP ĐỘ: ${level} — ${levelContext}

🎯 LĨNH VỰC BẮT BUỘC cho lần này: "${randomCategory}"
Hãy tạo project THUỘC LĨNH VỰC TRÊN hoặc có liên quan trực tiếp.

⚠️ QUY TẮC ĐA DẠNG:
- PHẢI tạo project thuộc lĩnh vực "${randomCategory}"
- KHÔNG ĐƯỢC tạo dạng "máy tính/calculator/converter" trừ khi lĩnh vực yêu cầu
- Project PHẢI phù hợp đúng cấp độ ${level}
- Ý tưởng phải THỰC TẾ, làm được, và THÚ VỊ
- Mỗi lần phải cho idea KHÁC BIỆT hoàn toàn

Seed: ${seed}-${rndNum}

Trả về JSON:
{
  "name": "Tên project ngắn gọn sáng tạo (tiếng Việt hoặc tiếng Anh)",
  "description": "Mô tả chi tiết project (3-5 câu), giải thích tại sao project hay và hữu ích",
  "difficulty": "${level}",
  "techStack": ["các công nghệ gợi ý phù hợp cấp độ"],
  "requirements": ["yêu cầu chức năng 1", "yêu cầu 2", "yêu cầu 3", "..."],
  "steps": ["bước 1: ...", "bước 2: ...", "bước 3: ...", "..."],
  "bonusFeatures": ["tính năng bonus nếu muốn nâng cao"],
  "estimatedTime": "thời gian ước tính"
}`;
    }

    const text = await callClaude(system, prompt, 0.95);
    return parseJSON(text);
  }

  // ─── Chat About Project (uses callClaude with retry) ───
  async function chatAboutProject(projectContext, chatHistory, userMessage) {
    const system = `Bạn là mentor lập trình. Đang hướng dẫn học viên làm project.
Trả lời ngắn gọn, dễ hiểu, có code example khi cần.
KHÔNG trả lời bằng JSON. Trả lời bằng text thường, có thể dùng markdown.
Nếu học viên hỏi về code của họ, hãy phân tích code họ đã gửi bên dưới.
Context project hiện tại:
${projectContext}`;

    // Build conversation context for multi-turn chat
    const conversationContext = chatHistory.length > 0
      ? 'Lịch sử hội thoại:\n' + chatHistory.map(m => `${m.role === 'user' ? 'Học viên' : 'Mentor'}: ${m.content}`).join('\n') + '\n\n'
      : '';

    return await callClaude(system, conversationContext + userMessage, 0.7, 4096);
  }

  // ─── Chat About Lesson (Theory/Quiz/Exercise helper) ───
  async function chatAboutLesson(lessonContext, chatHistory, userMessage, tabContext) {
    const tabLabels = { theory: 'lý thuyết', quiz: 'quiz/trắc nghiệm', exercise: 'bài tập', code: 'code example' };
    const tabLabel = tabLabels[tabContext] || 'bài học';

    const system = `Bạn là gia sư lập trình thân thiện và kiên nhẫn. Đang giúp học viên hiểu bài học.
Trả lời ngắn gọn, dễ hiểu, có code example khi cần.
KHÔNG trả lời bằng JSON. Trả lời bằng text thường, có thể dùng markdown.
Hãy giải thích theo cách đơn giản nhất có thể, dùng ví dụ thực tế.
Nếu học viên hỏi về ${tabLabel}, hãy tập trung giải thích phần đó.
Nếu học viên gửi code, hãy phân tích và góp ý.

Context bài học hiện tại:
${lessonContext}`;

    const conversationContext = chatHistory.length > 0
      ? 'Lịch sử hội thoại:\n' + chatHistory.slice(-10).map(m => `${m.role === 'user' ? 'Học viên' : 'Gia sư'}: ${m.content}`).join('\n') + '\n\n'
      : '';

    return await callClaude(system, conversationContext + userMessage, 0.7, 4096);
  }

  // ═══════════════════════════════════════════════════════════════
  // LOCAL CODE ANALYZER — Static analysis, NO AI, NO tokens, FREE
  // ═══════════════════════════════════════════════════════════════

  function localAnalyze(code, filename = '') {
    const lines = code.split('\n');
    const ext = filename.split('.').pop().toLowerCase();
    const isJS = ['js', 'jsx', 'ts', 'tsx', 'mjs'].includes(ext);
    const isCSS = ['css', 'scss', 'less'].includes(ext);
    const isHTML = ['html', 'htm'].includes(ext);
    const isPython = ['py'].includes(ext);

    const issues = []; // { severity: 'error'|'warning'|'info', message, line? }
    const stats = {
      totalLines: lines.length,
      codeLines: 0,
      commentLines: 0,
      blankLines: 0,
      longestLine: 0,
      functions: 0,
      classes: 0
    };

    // ─── Count stats ───
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

    // ─── JS/TS Checks ───
    if (isJS) {
      lines.forEach((line, i) => {
        const ln = i + 1;
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

        // var usage
        if (/\bvar\s+\w/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Dùng "var" — nên dùng "const" hoặc "let"`, line: ln });
        }
        // Loose equality
        if (/[^=!<>]={2}[^=]/.test(trimmed) && !/===/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Dùng "==" — nên dùng "===" (so sánh chặt)`, line: ln });
        }
        // console.log
        if (/\bconsole\.(log|warn|error|debug|info)\b/.test(trimmed)) {
          issues.push({ severity: 'info', message: `console.log còn sót — nên xóa trước khi submit`, line: ln });
        }
        // Single-char variable (except i, j, k, e, _)
        if (/\b(let|const|var)\s+[a-df-hln-z]\s*[=;,]/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Tên biến quá ngắn (1 ký tự) — nên đặt tên rõ ràng`, line: ln });
        }
        // Very long line
        if (line.length > 150) {
          issues.push({ severity: 'info', message: `Dòng quá dài (${line.length} ký tự) — nên tách nhỏ`, line: ln });
        }
        // Empty catch
        if (/catch\s*\(\s*\w*\s*\)\s*\{\s*\}/.test(trimmed)) {
          issues.push({ severity: 'error', message: `Empty catch block — lỗi bị nuốt mất, nên xử lý`, line: ln });
        }
        // Magic numbers (not 0, 1, 2, -1)
        if (/[=<>+\-*\/]\s*\b([3-9]\d{2,}|[1-9]\d{3,})\b/.test(trimmed) && !/setTimeout|setInterval|delay|port|status|width|height/.test(trimmed)) {
          issues.push({ severity: 'info', message: `"Magic number" — nên tạo constant có tên rõ ràng`, line: ln });
        }
        // Nested callbacks (3+ levels of })
        if (/\}\s*\)\s*\}\s*\)\s*\}/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `Callback hell — nên dùng async/await hoặc tách hàm`, line: ln });
        }
        // TODO/FIXME/HACK
        if (/\b(TODO|FIXME|HACK|XXX|BUG)\b/i.test(trimmed)) {
          issues.push({ severity: 'info', message: `"${trimmed.match(/\b(TODO|FIXME|HACK|XXX|BUG)\b/i)[0]}" — cần xử lý trước khi submit`, line: ln });
        }
        // alert()
        if (/\balert\s*\(/.test(trimmed)) {
          issues.push({ severity: 'info', message: `Dùng alert() — nên thay bằng UI notification`, line: ln });
        }
        // document.write
        if (/document\.write\s*\(/.test(trimmed)) {
          issues.push({ severity: 'error', message: `document.write() — nguy hiểm, nên dùng DOM manipulation`, line: ln });
        }
        // eval
        if (/\beval\s*\(/.test(trimmed)) {
          issues.push({ severity: 'error', message: `eval() — nguy hiểm về bảo mật, TUYỆT ĐỐI KHÔNG dùng`, line: ln });
        }
        // innerHTML with variable (XSS risk)
        if (/\.innerHTML\s*=/.test(trimmed) && /\$\{|\+\s*\w/.test(trimmed)) {
          issues.push({ severity: 'warning', message: `innerHTML với biến — có nguy cơ XSS, nên sanitize`, line: ln });
        }
      });

      // File-level checks
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

    // ─── CSS Checks ───
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

    // ─── HTML Checks ───
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

    // ─── Python Checks ───
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

    // ─── Calculate score ───
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    let score = 100;
    score -= errorCount * 10;   // Errors: -10 each
    score -= warnCount * 4;     // Warnings: -4 each
    score -= infoCount * 1;     // Info: -1 each
    // Penalty for extremes
    if (stats.codeLines < 5) score -= 20;  // Almost empty
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

  // ─── Analyze all files locally (batch) ───
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

  // ─── Smart truncate: keep first + last portions of large files ───
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

  // ═══════════════════════════════════════════════════════
  // ██  3-TIER REVIEW SYSTEM                            ██
  // ██  Tier 1: Structure → Tier 2: Module → Tier 3: Synthesis ██
  // ═══════════════════════════════════════════════════════

  // ─── Auto-group files into logical modules ───
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
      if (!placed) categories.logic.files.push(f); // default to logic
    }

    // Return only modules that have files
    return Object.entries(categories)
      .filter(([, cat]) => cat.files.length > 0)
      .map(([key, cat]) => ({ id: key, label: cat.label, files: cat.files }));
  }

  // ─── TIER 1: Structure Review (no code, just metadata) ───
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

  // ─── TIER 2: Module Review (review grouped files together) ───
  async function reviewModule(moduleInfo, projectIdea, localResults) {
    const system = `Bạn là giảng viên lập trình. Đánh giá một MODULE gồm nhiều file liên quan. Trả lời bằng JSON.
QUAN TRỌNG: Static analysis đã chạy trước. Tập trung vào LOGIC, KIẾN TRÚC, TƯƠNG TÁC GIỮA CÁC FILE — không nhắc lại lỗi cơ bản.`;

    // Build code blocks for all files in module
    const fileBlocks = moduleInfo.files.map(f => {
      const code = smartTruncateCode(f.code, 300);
      const lineCount = f.code.split('\n').length;

      // Get local analysis for this file
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

    const text = await callClaude(system, prompt, 0.3, 4096);
    return parseJSON(text);
  }

  // ─── TIER 3: Final Synthesis (combine all tiers) ───
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

    const text = await callClaude(system, prompt, 0.3, 8192);
    return parseJSON(text);
  }

  // ─── Main Review: 3-Tier Pipeline ───
  async function reviewProject(projectIdea, projectFiles, onProgress) {
    const codeFiles = projectFiles.filter(f => f.code.trim());
    if (codeFiles.length === 0) throw new Error('Không có file code nào để chấm');

    const totalSteps = 4; // local + structure + modules + synthesis

    // ═══ STEP 1: Local Analysis (FREE, instant) ═══
    if (onProgress) onProgress(1, totalSteps, '🔍 Step 1: Phân tích static code (miễn phí)...');
    const localResults = localAnalyzeAll(projectFiles);

    // ═══ STEP 2: Inject local context (already built into tier 2) ═══
    // (local results are passed to reviewModule automatically)

    // ═══ STEP 3 — TIER 1: Structure Review ═══
    if (onProgress) onProgress(2, totalSteps, '🏗️ Tier 1: Đánh giá cấu trúc project...');
    let structureReview;
    try {
      structureReview = await reviewStructure(codeFiles, projectIdea);
    } catch (err) {
      structureReview = { structureScore: 0, naming: 'Lỗi', organization: 'Lỗi', completeness: 'Lỗi', missingFiles: [], suggestions: [`Lỗi: ${err.message}`] };
    }

    // ═══ STEP 3 — TIER 2: Module Reviews ═══
    const modules = groupFilesIntoModules(codeFiles);
    const moduleReviews = [];
    for (let i = 0; i < modules.length; i++) {
      if (onProgress) onProgress(2, totalSteps, `🤖 Tier 2: Module ${i + 1}/${modules.length} — ${modules[i].label}`);
      try {
        const modReview = await reviewModule(modules[i], projectIdea, localResults);
        moduleReviews.push(modReview);
      } catch (err) {
        moduleReviews.push({
          moduleId: modules[i].id, moduleLabel: modules[i].label,
          score: 0, codeQuality: 0, logic: 0, errorHandling: 0, relevance: 0, cohesion: 0,
          summary: `Lỗi khi chấm module: ${err.message}`,
          fileScores: modules[i].files.map(f => ({ file: f.name, score: 0 })),
          issues: ['Không thể đánh giá'],
          positives: []
        });
      }
    }

    // ═══ STEP 4 — TIER 3: Final Synthesis ═══
    if (onProgress) onProgress(3, totalSteps, '📊 Tier 3: Tổng hợp đánh giá cuối cùng...');
    const finalReview = await synthesizeReview(structureReview, moduleReviews, localResults, projectIdea, projectFiles.length);

    // Build perFileReviews from module reviews for UI compatibility
    const perFileReviews = [];
    for (const modReview of moduleReviews) {
      for (const fs of (modReview.fileScores || [])) {
        perFileReviews.push({
          fileName: fs.file,
          score: fs.score,
          summary: modReview.summary,
          codeQuality: modReview.codeQuality,
          logic: modReview.logic,
          errorHandling: modReview.errorHandling,
          relevance: modReview.relevance,
          issues: modReview.issues,
          positives: modReview.positives
        });
      }
    }

    finalReview.perFileReviews = perFileReviews;
    finalReview.moduleReviews = moduleReviews;
    finalReview.structureReview = structureReview;
    finalReview.localAnalysis = localResults;
    return finalReview;
  }

  return { checkHealth, isEnabled, generateQuiz, generateExercise, checkAnswer, generateProjectIdea, chatAboutProject, chatAboutLesson, reviewProject, localAnalyze, localAnalyzeAll };
})();
