const AiLlmStudio = (() => {
  let isThinking = false;

  const SAMPLE_PIPELINES = {
    rag_search: {
      query: "Giải thích cách hoạt động của cơ chế Attention trong Transformer?",
      chunks: [
        { id: 1, score: 0.94, text: "Self-Attention tính toán ma trận tương quan giữa Query (Q), Key (K) và Value (V): Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V." },
        { id: 2, score: 0.88, text: "Multi-Head Attention chiếu các vector Q, K, V thành nhiều không gian biểu diễn con để nắm bắt các mối quan hệ đa chiều." },
        { id: 3, score: 0.81, text: "Kiến trúc Transformer loại bỏ hoàn toàn Recurrence (RNN), cho phép huấn luyện song song cực nhanh trên GPU." }
      ],
      thoughts: [
        "1. Phân tích câu hỏi: Người dùng hỏi về cơ chế Attention trong Transformer.",
        "2. Truy xuất RAG: Tìm thấy 3 đoạn tài liệu có độ tương đồng cosine cao (> 0.80).",
        "3. Lập luận CoT: Cần giải thích công thức cốt lõi Q, K, V và ý nghĩa trực quan của việc gán trọng số chú ý giữa các từ trong câu.",
        "4. Kiểm tra ràng buộc: Diễn giải bằng tiếng Việt sư phạm, có công thức LaTeX và ví dụ dễ hiểu."
      ],
      output: "Cơ chế **Self-Attention** trong Transformer cho phép mô hình gán 'trọng số chú ý' giữa từng từ với tất cả các từ khác trong câu cùng một lúc. Công thức toán học cốt lõi:\n\n\\[ \\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V \\]\n\nTrong đó: **Q (Query)** là từ đang xét, **K (Key)** là các từ khóa để so khớp, và **V (Value)** là nội dung thông tin thực sự được truyền tải."
    }
  };

  function renderStudio(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="ai-studio-layout">
        <!-- LEFT: Model Hyperparameters & Prompt Inputs -->
        <div class="ai-studio-sidebar">
          <div class="ai-panel-header">
            <span>⚙️ Cấu Hình Tham Số LLM</span>
          </div>
          <div class="ai-param-group">
            <label>Nhiệt Độ (Temperature): <strong id="val-temp" style="color:#58a6ff">0.7</strong></label>
            <input type="range" min="0" max="1" step="0.05" value="0.7" oninput="document.getElementById('val-temp').textContent=this.value" />
          </div>
          <div class="ai-param-group">
            <label>Top-P (Nucleus Sampling): <strong id="val-topp" style="color:#58a6ff">0.9</strong></label>
            <input type="range" min="0.1" max="1" step="0.05" value="0.9" oninput="document.getElementById('val-topp').textContent=this.value" />
          </div>
          <div class="ai-param-group">
            <label>System Prompt (Persona):</label>
            <textarea id="ai-sys-prompt" rows="3">Bạn là chuyên gia AI Deep Learning. Hãy giải thích trực quan và sư phạm.</textarea>
          </div>
          <div class="ai-param-group">
            <label>Chế độ suy luận:</label>
            <select id="ai-reason-mode" style="width:100%;padding:6px;background:#0d1117;border:1px solid #30363d;color:#c9d1d9;border-radius:6px">
              <option value="cot">🧠 Chain-of-Thought (Tư duy từng bước)</option>
              <option value="rag">🔍 RAG + Vector Retrieval (Trích xuất tri thức)</option>
              <option value="direct">⚡ Direct Token Generation</option>
            </select>
          </div>
        </div>

        <!-- RIGHT: Interactive Visual Reasoning Flow Canvas -->
        <div class="ai-studio-canvas">
          <div class="ai-canvas-header">
            <span>🧠 Luồng Suy Luận & Phân Tích Tư Duy AI (Thinking Flow Pipeline)</span>
            <button class="ai-run-flow-btn" onclick="AiLlmStudio.runReasoningSimulation()">▶️ Chạy Mô Phỏng Tư Duy</button>
          </div>

          <!-- 1. Input Node -->
          <div class="pipeline-node node-input">
            <div class="node-badge">👤 1. USER PROMPT (Câu hỏi đầu vào)</div>
            <input type="text" id="ai-user-query" value="${escapeHtml(SAMPLE_PIPELINES.rag_search.query)}" />
          </div>

          <!-- 2. RAG Retrieval Node -->
          <div class="pipeline-node node-rag" id="node-rag-box">
            <div class="node-badge">🔍 2. RAG VECTOR RETRIEVAL (Top 3 Tài liệu tương đồng)</div>
            <div class="rag-chunks-grid">
              ${SAMPLE_PIPELINES.rag_search.chunks.map(c => `
                <div class="rag-chunk-card">
                  <div class="chunk-score">Cosine Score: ${c.score}</div>
                  <div class="chunk-text">${c.text}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. Chain-of-Thought Thinking Node -->
          <div class="pipeline-node node-cot" id="node-cot-box">
            <div class="node-badge">🧠 3. INTERNAL CHAIN-OF-THOUGHT (Luồng tư duy nội bộ)</div>
            <div class="cot-steps-list" id="cot-steps">
              ${SAMPLE_PIPELINES.rag_search.thoughts.map(t => `<div class="cot-step-item">💭 ${t}</div>`).join('')}
            </div>
          </div>

          <!-- 4. Final Output Node -->
          <div class="pipeline-node node-output" id="node-output-box">
            <div class="node-badge">📤 4. FINAL GENERATED TOKENS (Phản hồi cuối cùng)</div>
            <div class="ai-final-text" id="ai-final-stream">
              ${SAMPLE_PIPELINES.rag_search.output.replace(/\\n/g, '<br>')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function runReasoningSimulation() {
    if (isThinking) return;
    isThinking = true;

    const queryInput = document.getElementById('ai-user-query');
    const cotBox = document.getElementById('cot-steps');
    const outputBox = document.getElementById('ai-final-stream');

    if (!cotBox || !outputBox) return;

    cotBox.innerHTML = '<div class="cot-step-item animate-pulse">⏳ Đang phân tích ngữ nghĩa và tính toán vector embedding...</div>';
    outputBox.innerHTML = '<div style="color:#8b949e">Đang chờ luồng suy luận hoàn thành...</div>';

    setTimeout(() => {
      cotBox.innerHTML = `
        <div class="cot-step-item">💭 1. Embedding truy vấn: d_model=1536 chiều, phát hiện từ khóa trọng tâm: "Attention", "Transformer".</div>
        <div class="cot-step-item">💭 2. Quét Vector Database: Độ trùng khớp 94% với chương "Self-Attention Mechanism".</div>
        <div class="cot-step-item">💭 3. Lập luận: Trình bày công thức Q, K, V trước, sau đó diễn giải ý nghĩa bằng ngôn ngữ tự nhiên.</div>
        <div class="cot-step-item">💭 4. Hoàn tất kiểm tra logic: Độ tin cậy (Confidence) = 98.6%.</div>
      `;

      setTimeout(() => {
        outputBox.innerHTML = SAMPLE_PIPELINES.rag_search.output.replace(/\\n/g, '<br>');
        isThinking = false;
      }, 400);
    }, 600);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    renderStudio,
    runReasoningSimulation
  };
})();

if (typeof window !== 'undefined') {
  window.AiLlmStudio = AiLlmStudio;
}
