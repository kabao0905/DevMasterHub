/**
 * StudioRouter — chon khong gian lam viec phu hop voi loai project AI sinh ra.
 *
 * Ban cu dung if/else theo thu tu: gap tu khoa nao truoc thi tra ve tab do.
 * Cach do sai voi de bai lai nhieu mien, vi du "REST API cho bang xep hang GAME"
 * se bi day vao studio Game du no la project backend.
 *
 * Ban nay CHAM DIEM tat ca cac mien roi chon mien cao diem nhat:
 *  - tu khoa trong techStack duoc nhan he so cao nhat (dang tin nhat)
 *  - tu khoa trong ten project cao hon trong mo ta
 *  - co ca tu khoa tieng Viet vi de bai AI sinh ra bang tieng Viet
 */
const StudioRouter = (() => {
  'use strict';

  // He so theo nguon: cong nghe > ten > mo ta
  const WEIGHT = { tech: 5, name: 3, desc: 1 };

  /**
   * Moi mien co danh sach tu khoa kem diem rieng.
   * Tu khoa cang dac trung thi diem cang cao.
   */
  const DOMAINS = {
    game: {
      strong: ['phaser', 'unity', 'godot', 'tilemap', 'sprite', 'platformer', 'roguelike',
               'game loop', 'game engine', 'pixel art'],
      normal: ['game', 'trò chơi', 'tro choi', 'arcade', 'puzzle', 'nhân vật', 'nhan vat',
               'màn chơi', 'man choi', 'người chơi', 'nguoi choi', 'điểm số', 'diem so',
               'snake', 'tetris', 'flappy', 'pong', 'breakout', 'maze', 'mê cung', 'me cung',
               'rpg', 'shooter', 'canvas 2d', 'va chạm', 'va cham', 'collision'],
      weak: ['canvas', 'animation', 'hoạt hình', 'hoat hinh']
    },
    cyber: {
      strong: ['ctf', 'pentest', 'penetration test', 'owasp', 'sql injection', 'xss',
               'metasploit', 'nmap', 'wireshark', 'reverse shell', 'privilege escalation',
               'burp suite', 'kali'],
      normal: ['cybersecurity', 'an ninh mạng', 'an ninh mang', 'bảo mật', 'bao mat',
               'hacking', 'ethical hacking', 'exploit', 'lỗ hổng', 'lo hong', 'vulnerability',
               'firewall', 'tường lửa', 'tuong lua', 'mã hóa', 'ma hoa', 'cryptography',
               'forensics', 'điều tra số', 'dieu tra so', 'malware', 'mã độc', 'ma doc'],
      weak: ['security', 'linux', 'terminal', 'shell', 'bash']
    },
    'ai-llm': {
      strong: ['rag', 'retrieval augmented', 'vector database', 'embedding', 'chain of thought',
               'prompt engineering', 'fine-tune', 'fine tune', 'langchain', 'transformer',
               'hugging face', 'openai api', 'llm'],
      normal: ['chatbot', 'trợ lý ảo', 'tro ly ao', 'machine learning', 'học máy', 'hoc may',
               'deep learning', 'học sâu', 'hoc sau', 'neural network', 'mạng nơ-ron',
               'nlp', 'xử lý ngôn ngữ', 'xu ly ngon ngu', 'gpt', 'gemini', 'claude',
               'phân loại văn bản', 'phan loai van ban', 'sentiment', 'cảm xúc', 'cam xuc',
               'gợi ý', 'goi y', 'recommendation'],
      weak: ['ai', 'trí tuệ nhân tạo', 'tri tue nhan tao', 'model', 'mô hình', 'mo hinh']
    },
    'api-test': {
      strong: ['rest api', 'restful', 'graphql', 'grpc', 'microservice', 'vi dịch vụ',
               'endpoint', 'swagger', 'openapi', 'postman', 'webhook', 'jwt', 'oauth'],
      normal: ['api', 'backend', 'back-end', 'máy chủ', 'may chu', 'server',
               'express', 'fastapi', 'django rest', 'spring boot', 'nest.js', 'nestjs',
               'xác thực', 'xac thuc', 'authentication', 'phân quyền', 'phan quyen',
               'middleware', 'rate limit', 'crud api'],
      weak: ['http', 'json', 'request', 'response', 'node.js', 'nodejs']
    },
    sql: {
      strong: ['erd', 'sơ đồ quan hệ', 'so do quan he', 'normalization', 'chuẩn hóa', 'chuan hoa',
               'stored procedure', 'index tuning', 'query optimization', 'tối ưu truy vấn',
               'toi uu truy van', 'data warehouse', 'join'],
      normal: ['sql', 'database', 'cơ sở dữ liệu', 'co so du lieu', 'csdl',
               'postgres', 'postgresql', 'mysql', 'sqlite', 'mongodb', 'mongo',
               'truy vấn', 'truy van', 'query', 'schema', 'bảng dữ liệu', 'bang du lieu',
               'quản lý sinh viên', 'quan ly sinh vien', 'quản lý kho', 'quan ly kho',
               'quản lý thư viện', 'quan ly thu vien', 'đơn hàng', 'don hang'],
      weak: ['crud', 'dữ liệu', 'du lieu', 'data', 'report', 'báo cáo', 'bao cao']
    },
    sandpack: {
      strong: ['landing page', 'trang chủ', 'trang chu', 'portfolio', 'giao diện', 'giao dien',
               'responsive', 'tailwind', 'bootstrap', 'flexbox', 'css grid',
               'single page application', 'component'],
      normal: ['html', 'css', 'frontend', 'front-end', 'react', 'vue', 'angular', 'svelte',
               'next.js', 'nextjs', 'website', 'trang web', 'web app', 'ứng dụng web',
               'ung dung web', 'dashboard', 'form', 'biểu mẫu', 'bieu mau',
               'todo app', 'blog', 'thương mại điện tử', 'thuong mai dien tu', 'e-commerce'],
      weak: ['ui', 'ux', 'javascript', 'dom', 'web', 'giao diện người dùng']
    }
  };

  const POINTS = { strong: 6, normal: 3, weak: 1 };

  function normalize(s) {
    // Doi dau cau thanh khoang trang de tu khoa khop tron tu, roi bao hai dau
    // bang khoang trang de dau/cuoi chuoi cung co bien.
    return ' ' + String(s || '')
      .toLowerCase()
      .replace(/[.,;:!?()\[\]{}"'`/\\|<>+*=~@#$%^&_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() + ' ';
  }

  /**
   * Tim tu khoa theo BIEN TU, khong phai chuoi con.
   * Neu chi tim chuoi con thi "nhap hai so" se khop tu khoa "ai" (trong chu "hai")
   * va bi day nham vao studio AI — loi nay da xay ra that khi kiem thu.
   */
  function hasWord(haystack, needle) {
    if (!needle) return false;
    return haystack.indexOf(' ' + needle + ' ') !== -1;
  }

  /**
   * @param {object} idea  { name, description, techStack:[] }
   * @param {string} topic chu de nguoi dung nhap them (neu co)
   * @returns {{ tab:string, scores:object, reason:string }}
   */
  function classify(idea, topic) {
    const sources = [
      { text: normalize((idea && (idea.techStack || []).join(' ')) || ''), w: WEIGHT.tech },
      { text: normalize((idea && idea.name) || ''), w: WEIGHT.name },
      { text: normalize(((idea && idea.description) || '') + ' ' + (topic || '')), w: WEIGHT.desc }
    ];

    const scores = {};
    const evidence = {};

    for (const [domain, groups] of Object.entries(DOMAINS)) {
      let total = 0;
      const found = [];
      for (const [level, words] of Object.entries(groups)) {
        for (const word of words) {
          for (const src of sources) {
            if (hasWord(src.text, word)) {
              total += POINTS[level] * src.w;
              if (found.length < 3) found.push(word);
              break;      // moi tu khoa chi tinh mot lan cho moi mien
            }
          }
        }
      }
      scores[domain] = total;
      evidence[domain] = found;
    }

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [best, bestScore] = ranked[0];

    // Nguong: mot tu khoa yeu duy nhat trong phan mo ta thi chua du chac chan.
    // Phai co it nhat mot dau hieu ro rang moi dieu huong.
    const NGUONG = POINTS.normal * WEIGHT.desc;
    if (bestScore < NGUONG) {
      return { tab: 'code', scores, reason: 'không đủ dấu hiệu để đoán loại project' };
    }

    return {
      tab: best,
      scores,
      reason: evidence[best].length
        ? 'khớp: ' + evidence[best].join(', ')
        : 'điểm cao nhất'
    };
  }

  /** Ham goi don gian, giu tuong thich voi cho goi cu trong app.js */
  function pick(idea, topic) {
    return classify(idea, topic).tab;
  }

  return { classify, pick, DOMAINS, POINTS, WEIGHT };
})();

if (typeof window !== 'undefined') window.StudioRouter = StudioRouter;
if (typeof module !== 'undefined' && module.exports) module.exports = StudioRouter;
