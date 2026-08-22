const VisualBuilder = (() => {
  let elements = [];
  let selectedElementId = null;
  let onCodeUpdateCallback = null;

  const COMPONENT_PRESETS = [
    {
      id: 'navbar',
      name: '🌐 Thanh Điều Hướng (Navbar)',
      category: 'layout',
      icon: '🧭',
      defaultStyles: { bg: '#161b22', color: '#ffffff', padding: '16px 24px', radius: '8px' },
      generateHtml: (data) => `
<nav class="custom-navbar" style="display:flex;justify-content:space-between;align-items:center;background:${data.bg || '#161b22'};color:${data.color || '#fff'};padding:${data.padding || '16px 24px'};border-radius:${data.radius || '8px'};">
  <div style="font-weight:700;font-size:18px;display:flex;align-items:center;gap:8px;">🚀 ${data.brand || 'DevBrand'}</div>
  <div style="display:flex;gap:16px;">
    <a href="#" style="color:${data.color || '#fff'};text-decoration:none;font-weight:500;">Trang chủ</a>
    <a href="#" style="color:${data.color || '#fff'};text-decoration:none;opacity:0.8;">Tính năng</a>
    <a href="#" style="color:${data.color || '#fff'};text-decoration:none;opacity:0.8;">Bảng giá</a>
    <a href="#" style="color:${data.color || '#fff'};text-decoration:none;opacity:0.8;">Liên hệ</a>
  </div>
  <button style="background:#238636;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Đăng nhập</button>
</nav>`
    },
    {
      id: 'hero',
      name: '🎯 Hero Banner',
      category: 'layout',
      icon: '🌟',
      defaultStyles: { bg: 'linear-gradient(135deg, #1f2937, #111827)', color: '#ffffff', padding: '48px 24px', radius: '12px' },
      generateHtml: (data) => `
<section class="custom-hero" style="text-align:center;background:${data.bg || '#1f2937'};color:${data.color || '#fff'};padding:${data.padding || '48px 24px'};border-radius:${data.radius || '12px'};margin:16px 0;">
  <span style="background:rgba(59,130,246,0.2);color:#60a5fa;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin-bottom:12px;">Phiên bản mới 2026</span>
  <h1 style="font-size:32px;font-weight:800;margin:0 0 12px 0;">${data.title || 'Xây Dựng Ứng Dụng Đẳng Cấp'}</h1>
  <p style="font-size:16px;opacity:0.85;max-width:600px;margin:0 auto 24px auto;">${data.subtitle || 'Giải pháp toàn diện giúp bạn tối ưu hóa hiệu suất và mở rộng quy mô kinh doanh nhanh chóng.'}</p>
  <div style="display:flex;gap:12px;justify-content:center;">
    <button style="background:#3b82f6;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer;font-size:15px;">Bắt đầu dùng thử</button>
    <button style="background:transparent;color:#fff;border:1px solid #4b5563;padding:12px 24px;border-radius:8px;font-weight:600;cursor:pointer;font-size:15px;">Xem Demo</button>
  </div>
</section>`
    },
    {
      id: 'features-grid',
      name: '✨ Lưới 3 Tính Năng (Feature Grid)',
      category: 'card',
      icon: '🗂️',
      defaultStyles: { bg: 'transparent', color: '#ffffff', padding: '16px 0', radius: '0px' },
      generateHtml: (data) => `
<div class="custom-features-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin:20px 0;">
  <div style="background:#1f2937;padding:24px;border-radius:10px;border:1px solid #374151;">
    <div style="font-size:32px;margin-bottom:12px;">⚡</div>
    <h3 style="margin:0 0 8px 0;font-size:18px;color:#fff;">Tốc Độ Vượt Trội</h3>
    <p style="margin:0;font-size:14px;color:#9ca3af;">Tối ưu hóa thời gian tải trang dưới 0.5s với công nghệ tiên tiến nhất.</p>
  </div>
  <div style="background:#1f2937;padding:24px;border-radius:10px;border:1px solid #374151;">
    <div style="font-size:32px;margin-bottom:12px;">🛡️</div>
    <h3 style="margin:0 0 8px 0;font-size:18px;color:#fff;">Bảo Mật Tuyệt Đối</h3>
    <p style="margin:0;font-size:14px;color:#9ca3af;">Mã hóa đầu cuối chuẩn quân sự, bảo vệ dữ liệu khách hàng 24/7.</p>
  </div>
  <div style="background:#1f2937;padding:24px;border-radius:10px;border:1px solid #374151;">
    <div style="font-size:32px;margin-bottom:12px;">🤖</div>
    <h3 style="margin:0 0 8px 0;font-size:18px;color:#fff;">Tích Hợp AI</h3>
    <p style="margin:0;font-size:14px;color:#9ca3af;">Tự động hóa tác vụ lặp lại với trợ lý trí tuệ nhân tạo thông minh.</p>
  </div>
</div>`
    },
    {
      id: 'button-cta',
      name: '🔘 Nút Kêu Gọi Hành Động (CTA Button)',
      category: 'element',
      icon: '👆',
      defaultStyles: { bg: '#2563eb', color: '#ffffff', padding: '12px 28px', radius: '8px' },
      generateHtml: (data) => `
<div style="text-align:center;margin:16px 0;">
  <button style="background:${data.bg || '#2563eb'};color:${data.color || '#fff'};padding:${data.padding || '12px 28px'};border-radius:${data.radius || '8px'};font-weight:700;font-size:16px;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(37,99,235,0.4);">
    ${data.text || 'Khám Phá Ngay Hôm Nay ➔'}
  </button>
</div>`
    },
    {
      id: 'pricing-table',
      name: '💳 Bảng Giá 3 Gói (Pricing Table)',
      category: 'card',
      icon: '🏷️',
      defaultStyles: { bg: 'transparent', color: '#ffffff', padding: '24px 0', radius: '0px' },
      generateHtml: (data) => `
<div class="custom-pricing" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin:24px 0;">
  <div style="background:#161b22;padding:28px;border-radius:12px;border:1px solid #30363d;text-align:center;">
    <h4 style="margin:0;font-size:18px;color:#8b949e;">Cơ Bản</h4>
    <div style="font-size:32px;font-weight:800;color:#fff;margin:12px 0;">0đ <span style="font-size:14px;color:#8b949e;">/tháng</span></div>
    <p style="font-size:13px;color:#8b949e;margin-bottom:20px;">Dành cho cá nhân mới bắt đầu</p>
    <button style="width:100%;padding:10px;border-radius:6px;background:#21262d;color:#fff;border:1px solid #30363d;font-weight:600;cursor:pointer;">Đăng ký miễn phí</button>
  </div>
  <div style="background:#161b22;padding:28px;border-radius:12px;border:2px solid #58a6ff;text-align:center;position:relative;">
    <span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#58a6ff;color:#0d1117;font-size:11px;font-weight:800;padding:2px 10px;border-radius:12px;">PHỔ BIẾN NHẤT</span>
    <h4 style="margin:0;font-size:18px;color:#58a6ff;">Chuyên Nghiệp</h4>
    <div style="font-size:32px;font-weight:800;color:#fff;margin:12px 0;">199k <span style="font-size:14px;color:#8b949e;">/tháng</span></div>
    <p style="font-size:13px;color:#8b949e;margin-bottom:20px;">Đầy đủ tính năng cao cấp & AI</p>
    <button style="width:100%;padding:10px;border-radius:6px;background:#238636;color:#fff;border:none;font-weight:600;cursor:pointer;">Bắt đầu trải nghiệm</button>
  </div>
</div>`
    },
    {
      id: 'footer',
      name: '📄 Chân Trang (Footer)',
      category: 'layout',
      icon: '🔻',
      defaultStyles: { bg: '#0d1117', color: '#8b949e', padding: '32px 24px', radius: '8px' },
      generateHtml: (data) => `
<footer style="background:${data.bg || '#0d1117'};color:${data.color || '#8b949e'};padding:${data.padding || '32px 24px'};border-radius:${data.radius || '8px'};margin-top:32px;text-align:center;border-top:1px solid #21262d;">
  <div style="font-weight:700;color:#fff;font-size:16px;margin-bottom:8px;">DevMaster Hub Project</div>
  <p style="font-size:13px;margin:0 0 12px 0;">© 2026 DevMaster Hub. Bản quyền thuộc về tác giả.</p>
  <div style="display:flex;gap:16px;justify-content:center;font-size:13px;">
    <a href="#" style="color:#58a6ff;text-decoration:none;">Chính sách</a>
    <a href="#" style="color:#58a6ff;text-decoration:none;">Điều khoản</a>
    <a href="#" style="color:#58a6ff;text-decoration:none;">Hỗ trợ kỹ thuật</a>
  </div>
</footer>`
    }
  ];

  function init(initialElements = [], onCodeUpdate = null) {
    elements = initialElements.length ? initialElements : [
      { id: 'el-1', presetId: 'navbar', data: { brand: 'MyWebApp' } },
      { id: 'el-2', presetId: 'hero', data: { title: 'Chào Mừng Đến Với Dự Án Của Tôi', subtitle: 'Giao diện được tạo bằng Visual Builder kéo thả trên DevMaster Hub.' } },
      { id: 'el-3', presetId: 'features-grid', data: {} },
      { id: 'el-4', presetId: 'footer', data: {} }
    ];
    onCodeUpdateCallback = onCodeUpdate;
    notifyCodeUpdate();
  }

  function exportHtml() {
    return elements.map(el => {
      const preset = COMPONENT_PRESETS.find(p => p.id === el.presetId);
      if (!preset) return '';
      return preset.generateHtml(el.data || {});
    }).join('\n\n');
  }

  function notifyCodeUpdate() {
    if (typeof onCodeUpdateCallback === 'function') {
      onCodeUpdateCallback(exportHtml());
    }
  }

  function addComponent(presetId) {
    const preset = COMPONENT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    const newId = 'el-' + Date.now();
    elements.push({
      id: newId,
      presetId: presetId,
      data: { ...preset.defaultStyles }
    });
    selectedElementId = newId;
    notifyCodeUpdate();
    render();
  }

  function removeComponent(id) {
    elements = elements.filter(e => e.id !== id);
    if (selectedElementId === id) selectedElementId = null;
    notifyCodeUpdate();
    render();
  }

  function moveComponent(id, direction) {
    const idx = elements.findIndex(e => e.id === id);
    if (idx < 0) return;
    if (direction === 'up' && idx > 0) {
      const temp = elements[idx];
      elements[idx] = elements[idx - 1];
      elements[idx - 1] = temp;
    } else if (direction === 'down' && idx < elements.length - 1) {
      const temp = elements[idx];
      elements[idx] = elements[idx + 1];
      elements[idx + 1] = temp;
    }
    notifyCodeUpdate();
    render();
  }

  function selectElement(id) {
    selectedElementId = id;
    render();
  }

  function updateElementData(id, key, value) {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    if (!el.data) el.data = {};
    el.data[key] = value;
    notifyCodeUpdate();

    updateLiveCanvas();
  }

  function updateLiveCanvas() {
    const canvasBody = document.getElementById('visual-canvas-content');
    if (canvasBody) {
      canvasBody.innerHTML = renderCanvasBlocks();
    }
  }

  function renderStudio(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="visual-studio-layout">
        <!-- 1. LEFT: Component Palette -->
        <div class="studio-palette">
          <div class="palette-header">
            <span class="palette-title">🧩 Thành Phần UI</span>
          </div>
          <div class="palette-list">
            ${COMPONENT_PRESETS.map(p => `
              <div class="palette-item" onclick="VisualBuilder.addComponent('${p.id}')">
                <span class="palette-icon">${p.icon}</span>
                <span class="palette-name">${p.name}</span>
                <span class="palette-add">+</span>
              </div>
            `).join('')}
          </div>
          <div class="ai-ui-section">
            <div class="ai-ui-title">✨ AI UI Assistant</div>
            <input type="text" id="ai-ui-prompt" placeholder="VD: Thêm bảng đánh giá 5 sao..." class="ai-ui-input" onkeydown="if(event.key==='Enter')VisualBuilder.generateAiComponent()" />
            <button class="ai-ui-btn" onclick="VisualBuilder.generateAiComponent()">🪄 Tạo bằng AI</button>
          </div>
        </div>

        <!-- 2. CENTER: Interactive Visual Canvas -->
        <div class="studio-canvas-wrapper">
          <div class="canvas-toolbar">
            <span class="canvas-tag">🎨 Canvas Trực Quan (Kéo/Thả/Sắp Xếp)</span>
            <div class="canvas-actions">
              <button class="canvas-btn" onclick="VisualBuilder.clearCanvas()">🗑️ Xóa hết</button>
            </div>
          </div>
          <div class="studio-canvas" id="visual-canvas-content">
            ${renderCanvasBlocks()}
          </div>
        </div>

        <!-- 3. RIGHT: Style Inspector -->
        <div class="studio-inspector" id="visual-inspector">
          ${renderInspector()}
        </div>
      </div>
    `;
  }

  function renderCanvasBlocks() {
    if (elements.length === 0) {
      return `<div class="canvas-empty-notice">👈 Bấm vào các thành phần bên trái để thêm vào Canvas trực quan!</div>`;
    }

    return elements.map((el, index) => {
      const preset = COMPONENT_PRESETS.find(p => p.id === el.presetId);
      const isSelected = el.id === selectedElementId;
      const htmlContent = preset ? preset.generateHtml(el.data || {}) : '';

      return `
        <div class="canvas-block ${isSelected ? 'selected' : ''}" onclick="VisualBuilder.selectElement('${el.id}')">
          <div class="block-controls">
            <span class="block-label">${preset?.icon || '📦'} ${preset?.name || 'Block'}</span>
            <div class="block-btns">
              <button class="ctrl-btn" onclick="event.stopPropagation();VisualBuilder.moveComponent('${el.id}', 'up')" title="Di chuyển lên">▲</button>
              <button class="ctrl-btn" onclick="event.stopPropagation();VisualBuilder.moveComponent('${el.id}', 'down')" title="Di chuyển xuống">▼</button>
              <button class="ctrl-btn del-btn" onclick="event.stopPropagation();VisualBuilder.removeComponent('${el.id}')" title="Xóa block">✕</button>
            </div>
          </div>
          <div class="block-preview-render">
            ${htmlContent}
          </div>
        </div>
      `;
    }).join('');
  }

  function renderInspector() {
    const selected = elements.find(e => e.id === selectedElementId);
    if (!selected) {
      return `
        <div class="inspector-empty">
          <span>👈 Bấm vào một block trên Canvas để tùy chỉnh màu sắc, chữ và kích thước.</span>
        </div>`;
    }

    const preset = COMPONENT_PRESETS.find(p => p.id === selected.presetId);
    const data = selected.data || {};

    return `
      <div class="inspector-header">
        <span>⚙️ Thuộc Tính: ${preset?.name || 'Block'}</span>
      </div>
      <div class="inspector-fields">
        <div class="inspector-group">
          <label>Tiêu đề / Brand</label>
          <input type="text" value="${escapeHtml(data.title || data.brand || '')}" oninput="VisualBuilder.updateElementData('${selected.id}', 'title', this.value);VisualBuilder.updateElementData('${selected.id}', 'brand', this.value)" />
        </div>
        <div class="inspector-group">
          <label>Mô tả phụ</label>
          <input type="text" value="${escapeHtml(data.subtitle || '')}" oninput="VisualBuilder.updateElementData('${selected.id}', 'subtitle', this.value)" />
        </div>
        <div class="inspector-group">
          <label>Màu Nền (Background)</label>
          <input type="text" value="${escapeHtml(data.bg || '#1f2937')}" placeholder="#161b22 hoặc linear-gradient..." oninput="VisualBuilder.updateElementData('${selected.id}', 'bg', this.value)" />
        </div>
        <div class="inspector-group">
          <label>Màu Chữ (Text Color)</label>
          <input type="text" value="${escapeHtml(data.color || '#ffffff')}" oninput="VisualBuilder.updateElementData('${selected.id}', 'color', this.value)" />
        </div>
        <div class="inspector-group">
          <label>Padding (Khoảng cách trong)</label>
          <input type="text" value="${escapeHtml(data.padding || '16px 24px')}" oninput="VisualBuilder.updateElementData('${selected.id}', 'padding', this.value)" />
        </div>
        <div class="inspector-group">
          <label>Bo Góc (Border Radius)</label>
          <input type="text" value="${escapeHtml(data.radius || '8px')}" oninput="VisualBuilder.updateElementData('${selected.id}', 'radius', this.value)" />
        </div>
      </div>
    `;
  }

  function clearCanvas() {
    if (confirm('Bạn có chắc muốn xóa sạch Canvas?')) {
      elements = [];
      selectedElementId = null;
      notifyCodeUpdate();
      render();
    }
  }

  async function generateAiComponent() {
    const input = document.getElementById('ai-ui-prompt');
    const prompt = input?.value?.trim();
    if (!prompt) return;

    input.value = 'Đang sinh giao diện bằng AI...';
    input.disabled = true;

    try {
      if (typeof AIService !== 'undefined' && AIService.generateCustomUI) {
        const generated = await AIService.generateCustomUI(prompt);

      } else {

        addComponent('pricing-table');
      }
    } catch(e) {
      alert('AI UI Generator: ' + e.message);
    }
    if (input) {
      input.value = '';
      input.disabled = false;
    }
  }

  function render() {
    renderStudio('visual-studio-mount');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    init,
    renderStudio,
    addComponent,
    removeComponent,
    moveComponent,
    selectElement,
    updateElementData,
    clearCanvas,
    exportHtml,
    generateAiComponent
  };
})();

if (typeof window !== 'undefined') {
  window.VisualBuilder = VisualBuilder;
}
