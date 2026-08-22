/**
 * AI / RAG Reasoning Studio — mo phong luong suy luan cua he thong RAG.
 *
 * Phan RETRIEVAL la THAT: co kho tai lieu, co tinh diem tuong dong bang
 * TF-IDF + cosine, nen doi cau hoi la doi ket qua tim duoc. Hoc vien thay
 * duoc vi sao doan van nay duoc chon con doan kia thi khong.
 *
 * Phan sinh cau tra loi goi API AI that voi dung ngu canh vua truy xuat.
 */
const AiLlmStudio = (() => {
  'use strict';

  // ─── Kho tai lieu mau: kien thuc ve chinh DevMaster Hub ───
  const DOCS = [
    { id: 'd1', title: 'Lộ trình học',
      text: 'DevMaster Hub có 35 lộ trình công nghệ với 348 bài học, chia theo 5 cấp độ từ Newbie, Junior, Mid, Senior đến Master. Mỗi bài gồm lý thuyết, code mẫu, trắc nghiệm và bài tập thực hành.' },
    { id: 'd2', title: 'Gia sư AI',
      text: 'AI Tutor kèm 1-1 trong từng bài học. Khi học viên làm bài tập hoặc trắc nghiệm, AI chỉ đưa gợi ý hướng làm chứ không đưa đáp án, để học viên tự suy nghĩ. Sau khi nộp bài thì AI mới được phép giải thích đáp án.' },
    { id: 'd3', title: 'Project Lab',
      text: 'Project Lab sinh ý tưởng dự án theo trình độ hoặc theo chủ đề tự chọn. Học viên nộp code và nhận review chấm điểm theo bốn tiêu chí: chất lượng code, tính năng, best practices và sáng tạo.' },
    { id: 'd4', title: 'Cố vấn nghề nghiệp',
      text: 'Cố vấn nghề nghiệp phân tích tiến độ học để đánh giá mức độ phù hợp với từng vị trí tuyển dụng, từ thực tập sinh đến senior. Hệ thống còn tìm việc làm thật qua JSearch, Remotive và Arbeitnow.' },
    { id: 'd5', title: 'Studio thực hành',
      text: 'Mỗi loại project mở ra một không gian làm việc riêng: web thì có trình soạn thảo chia đôi màn hình xem trước trực tiếp, game có trình vẽ bản đồ và nhân vật, backend có công cụ gửi request API, database có sơ đồ ERD và trình chạy SQL.' },
    { id: 'd6', title: 'Bảo mật nền tảng',
      text: 'API tốn tiền yêu cầu đăng nhập bằng token Supabase. Khung chạy code của học viên bị cô lập trong iframe sandbox không có allow-same-origin, nên code đó không đọc được dữ liệu đăng nhập của trang chính.' },
    { id: 'd7', title: 'Đa ngôn ngữ',
      text: 'Giao diện hỗ trợ 8 ngôn ngữ gồm tiếng Việt, Anh, Nhật, Hàn, Trung, Pháp, Đức và Tây Ban Nha. AI cũng trả lời theo đúng ngôn ngữ mà học viên đang chọn.' },
    { id: 'd8', title: 'Cybersecurity',
      text: 'Khóa An ninh mạng dạy từ mô hình CIA, lệnh Linux, phân quyền tệp tin, quét cổng bằng nmap, phân tích gói tin, tới OWASP Top 10 gồm SQL Injection và XSS, mật mã học và leo thang đặc quyền.' }
  ];

  const GOI_Y = [
    'AI Tutor có đưa đáp án luôn không?',
    'Học lập trình game trên đây thế nào?',
    'Nền tảng bảo mật code của học viên ra sao?',
    'Có bao nhiêu bài học và chia cấp độ thế nào?',
    'Tìm việc làm trên nền tảng này kiểu gì?'
  ];

  let cfg = { temperature: 0.7, topP: 0.9, topK: 3, persona: 'Bạn là trợ giảng lập trình thân thiện, trả lời ngắn gọn bằng tiếng Việt.' };
  let stage = 0;          // buoc dang sang trong so do
  let lastRun = null;
  let busy = false;

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ═══════════ PHAN TRUY XUAT (that, khong gia) ═══════════

  /** Tach tu, bo dau tieng Viet de "bảo mật" khop duoc voi "bao mat" */
  function tokenize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  const STOP = new Set(['la','va','co','cua','cho','mot','nhu','the','nao','duoc','khong',
    'thi','o','tren','trong','voi','ra','sao','ay','nay','de','den','tu','bao','nhieu','gi']);

  /** Vector TF-IDF cua mot doan van */
  function tfidf(tokens, df, N) {
    const tf = {};
    for (const t of tokens) if (!STOP.has(t)) tf[t] = (tf[t] || 0) + 1;
    const vec = {};
    for (const t in tf) {
      const idf = Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;
      vec[t] = (1 + Math.log(tf[t])) * idf;
    }
    return vec;
  }

  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (const k in a) { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k]; }
    for (const k in b) nb += b[k] * b[k];
    if (!na || !nb) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  let INDEX = null;
  function buildIndex() {
    if (INDEX) return INDEX;
    const N = DOCS.length;
    const df = {};
    const docTokens = DOCS.map(d => {
      const tk = tokenize(d.title + ' ' + d.text);
      for (const t of new Set(tk)) df[t] = (df[t] || 0) + 1;
      return tk;
    });
    INDEX = {
      df, N,
      vecs: docTokens.map(tk => tfidf(tk, df, N))
    };
    return INDEX;
  }

  /** Truy xuat that: tra ve top-K doan van kem diem tuong dong */
  function retrieve(query, k) {
    const ix = buildIndex();
    const qTokens = tokenize(query);
    const qVec = tfidf(qTokens, ix.df, ix.N);

    const scored = DOCS.map((d, i) => ({
      doc: d,
      score: cosine(qVec, ix.vecs[i]),
      // tu nao trong cau hoi gop diem cho doan nay
      matched: Object.keys(qVec).filter(t => ix.vecs[i][t]).slice(0, 6)
    }));

    scored.sort((a, b) => b.score - a.score);
    return {
      qTokens: qTokens.filter(t => !STOP.has(t)),
      qVecSize: Object.keys(qVec).length,
      all: scored,
      top: scored.filter(s => s.score > 0).slice(0, k)
    };
  }

  // ═══════════ GIAO DIEN ═══════════
  function renderStudio(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = `
      <div class="rag">
        <div class="rag-top">
          <div class="rag-ask">
            <input type="text" id="rag-q" class="rag-input"
                   placeholder="Hỏi một câu về DevMaster Hub…"
                   value="${esc(GOI_Y[0])}"
                   onkeydown="if(event.key==='Enter')AiLlmStudio.run()" />
            <button class="rag-go" id="rag-go" onclick="AiLlmStudio.run()">Chạy pipeline</button>
          </div>
          <div class="rag-chips">
            ${GOI_Y.map((q, i) => `<button class="rag-chip" onclick="AiLlmStudio.ask(${i})">${esc(q)}</button>`).join('')}
          </div>
        </div>

        <div class="rag-main">
          <div class="rag-flow" id="rag-flow">${flowHtml()}</div>

          <aside class="rag-side">
            <h4>Tham số sinh</h4>
            ${slider('temperature', 'Temperature', 0, 1.5, 0.05, cfg.temperature,
                     'Càng cao càng sáng tạo và khó đoán; càng thấp càng bám sát dữ liệu.')}
            ${slider('topP', 'Top-P', 0.1, 1, 0.05, cfg.topP,
                     'Chỉ lấy nhóm từ có tổng xác suất tới ngưỡng này. Thấp = an toàn hơn.')}
            ${slider('topK', 'Số đoạn lấy về', 1, 5, 1, cfg.topK,
                     'Lấy bao nhiêu đoạn văn liên quan nhất đưa vào ngữ cảnh.')}
            <h4>System Persona</h4>
            <textarea class="rag-persona" id="rag-persona"
                      oninput="AiLlmStudio.setPersona(this.value)">${esc(cfg.persona)}</textarea>
            <p class="rag-note">Phần truy xuất chạy thật trong trình duyệt bằng TF-IDF + cosine. Đổi câu hỏi là đổi kết quả.</p>
          </aside>
        </div>
      </div>`;
  }

  function slider(key, label, min, max, step, val, hint) {
    return `
      <label class="rag-field">
        <span class="rag-field-top">${esc(label)}<b id="rag-v-${key}">${val}</b></span>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${val}"
               oninput="AiLlmStudio.setCfg('${key}', this.value)" />
        <small>${esc(hint)}</small>
      </label>`;
  }

  const STEPS = [
    { key: 'query', icon: '👤', name: 'Câu hỏi', desc: 'Tách từ, bỏ từ dừng' },
    { key: 'embed', icon: '🔢', name: 'Vector hóa', desc: 'TF-IDF thành vector' },
    { key: 'retrieve', icon: '🔍', name: 'Truy xuất', desc: 'Cosine, lấy top-K' },
    { key: 'context', icon: '📋', name: 'Ghép ngữ cảnh', desc: 'Prompt gửi cho mô hình' },
    { key: 'think', icon: '🧠', name: 'Suy luận', desc: 'Mô hình xử lý' },
    { key: 'out', icon: '💬', name: 'Kết quả', desc: 'Câu trả lời' }
  ];

  function flowHtml() {
    return STEPS.map((s, i) => `
      <div class="rag-node${i < stage ? ' done' : ''}${i === stage ? ' active' : ''}" id="rag-node-${s.key}">
        <div class="rag-node-head">
          <span class="rag-node-icon">${s.icon}</span>
          <div>
            <strong>${esc(s.name)}</strong>
            <em>${esc(s.desc)}</em>
          </div>
          <span class="rag-node-num">${i + 1}</span>
        </div>
        <div class="rag-node-body" id="rag-body-${s.key}"></div>
      </div>
      ${i < STEPS.length - 1 ? '<div class="rag-arrow' + (i < stage ? ' done' : '') + '">↓</div>' : ''}
    `).join('');
  }

  function setStage(n) {
    stage = n;
    STEPS.forEach((s, i) => {
      const el = document.getElementById('rag-node-' + s.key);
      if (el) el.className = 'rag-node' + (i < n ? ' done' : '') + (i === n ? ' active' : '');
    });
    document.querySelectorAll('.rag-arrow').forEach((a, i) =>
      a.className = 'rag-arrow' + (i < n ? ' done' : ''));
  }

  function fill(key, html) {
    const el = document.getElementById('rag-body-' + key);
    if (el) el.innerHTML = html;
  }

  const setPersona = v => { cfg.persona = v; };
  function setCfg(key, v) {
    cfg[key] = key === 'topK' ? parseInt(v, 10) : parseFloat(v);
    const out = document.getElementById('rag-v-' + key);
    if (out) out.textContent = cfg[key];
  }
  function ask(i) {
    const el = document.getElementById('rag-q');
    if (el) { el.value = GOI_Y[i]; run(); }
  }

  // ═══════════ CHAY PIPELINE ═══════════
  async function run() {
    if (busy) return;
    const q = (document.getElementById('rag-q') || {}).value || '';
    if (!q.trim()) return;

    busy = true;
    const btn = document.getElementById('rag-go');
    if (btn) { btn.disabled = true; btn.textContent = 'Đang chạy…'; }
    STEPS.forEach(s => fill(s.key, ''));

    const wait = ms => new Promise(r => setTimeout(r, ms));

    // 1. Tách từ
    setStage(0);
    const r = retrieve(q, cfg.topK);
    fill('query', `
      <p class="rag-raw">${esc(q)}</p>
      <div class="rag-tokens">${r.qTokens.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <small>${r.qTokens.length} từ có nghĩa sau khi bỏ từ dừng</small>`);
    await wait(420);

    // 2. Vector hóa
    setStage(1);
    fill('embed', `
      <p>Vector thưa <b>${r.qVecSize} chiều</b>, mỗi chiều là một từ có trọng số TF-IDF.</p>
      <small>Từ hiếm trong kho tài liệu được trọng số cao hơn từ phổ biến.</small>`);
    await wait(420);

    // 3. Truy xuất — hiện điểm THẬT của mọi đoạn
    setStage(2);
    const maxScore = Math.max(...r.all.map(x => x.score), 0.0001);
    fill('retrieve', `
      <div class="rag-docs">
        ${r.all.map((x, i) => `
          <div class="rag-doc${i < cfg.topK && x.score > 0 ? ' picked' : ''}">
            <div class="rag-doc-head">
              <b>${esc(x.doc.title)}</b>
              <span class="rag-score">${x.score.toFixed(3)}</span>
            </div>
            <div class="rag-bar"><i style="width:${(x.score / maxScore * 100).toFixed(1)}%"></i></div>
            ${x.matched.length ? `<div class="rag-match">${x.matched.map(m => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
          </div>`).join('')}
      </div>
      <small>Lấy ${r.top.length} đoạn điểm cao nhất. Đoạn 0 điểm không có từ nào trùng.</small>`);
    await wait(500);

    // 4. Ghép ngữ cảnh
    setStage(3);
    const context = r.top.map((x, i) => `[${i + 1}] ${x.doc.title}: ${x.doc.text}`).join('\n\n');
    const prompt = `${cfg.persona}\n\nChỉ trả lời dựa trên tài liệu sau. Nếu tài liệu không có thông tin, hãy nói rõ là không biết.\n\n${context}\n\nCâu hỏi: ${q}`;
    fill('context', `
      <pre class="rag-prompt">${esc(prompt)}</pre>
      <small>${prompt.length} ký tự · khoảng ${Math.ceil(prompt.length / 3.5)} token</small>`);
    await wait(420);

    // 5. Gọi mô hình thật
    setStage(4);
    fill('think', `<div class="rag-thinking"><span></span><span></span><span></span>
      <em>temperature ${cfg.temperature} · top-p ${cfg.topP}</em></div>`);

    let answer = '', err = null;
    const t0 = performance.now();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (typeof AuthService !== 'undefined' && AuthService.isConfigured && AuthService.isConfigured()) {
        Object.assign(headers, await AuthService.authHeaders());
      }
      const res = await fetch('/api/ai', {
        method: 'POST', headers,
        body: JSON.stringify({
          system: cfg.persona,
          messages: [{ role: 'user', content: prompt }],
          temperature: cfg.temperature,
          max_tokens: 700,
          taskType: 'general'
        })
      });
      if (res.status === 401) throw new Error('Bạn cần đăng nhập để chạy bước gọi mô hình.');
      if (!res.ok) throw new Error('Mô hình đang bận, thử lại sau.');
      const data = await res.json();
      answer = (data.content && data.content[0] && data.content[0].text) || '';
    } catch (e) {
      err = e.message;
    }
    const ms = Math.round(performance.now() - t0);

    fill('think', `<p class="rag-done">Xử lý xong trong <b>${ms} ms</b></p>
      <small>temperature ${cfg.temperature} · top-p ${cfg.topP} · ${r.top.length} đoạn ngữ cảnh</small>`);

    // 6. Kết quả
    setStage(5);
    if (err) {
      fill('out', `<div class="rag-err">${esc(err)}</div>
        <small>Các bước truy xuất phía trên vẫn chạy thật và không cần đăng nhập.</small>`);
    } else {
      fill('out', `<div class="rag-answer">${esc(answer).replace(/\n/g, '<br>')}</div>
        <small>≈ ${Math.ceil(answer.length / 3.5)} token sinh ra</small>`);
    }
    setStage(6);

    lastRun = { q, retrieval: r, prompt, answer, ms };
    busy = false;
    if (btn) { btn.disabled = false; btn.textContent = 'Chạy pipeline'; }
  }

  return { renderStudio, run, ask, setCfg, setPersona, retrieve, tokenize,
           getLastRun: () => lastRun, DOCS };
})();

if (typeof window !== 'undefined') window.AiLlmStudio = AiLlmStudio;
if (typeof module !== 'undefined' && module.exports) module.exports = AiLlmStudio;
