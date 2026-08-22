const SandpackLive = (() => {
  let activeViewport = 'desktop';
  let debounceTimer = null;

  function renderStudio(containerId, initialFiles = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const htmlFile = initialFiles.find(f => f.name.endsWith('.html')) || { name: 'index.html', code: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 24px; background: #0f172a; color: #fff; text-align: center; }\n    h1 { color: #38bdf8; }\n    .btn { background: #3b82f6; color: #fff; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>🚀 Frontend Live Sandbox</h1>\n  <p>Chỉnh sửa code bên trái, giao diện bên phải cập nhật tức thì!</p>\n  <button class="btn" onclick="alert(\'Xin chào từ DevMaster Hub!\')">Click Me</button>\n</body>\n</html>' };
    const jsFile = initialFiles.find(f => f.name.endsWith('.js')) || { name: 'script.js', code: '// JavaScript logic' };

    container.innerHTML = `
      <div class="sandpack-split-layout">
        <!-- LEFT: Code Editor Pane -->
        <div class="sandpack-editor-pane">
          <div class="sandpack-pane-header">
            <span class="pane-title">💻 Trình Soạn Thảo (HTML / CSS / JS)</span>
            <span class="live-indicator"><span class="pulse-dot"></span> Live Sync</span>
          </div>
          <textarea class="sandpack-textarea" id="sandpack-code-input" spellcheck="false" oninput="SandpackLive.handleCodeInput()">${escapeHtml(htmlFile.code)}</textarea>
        </div>

        <!-- RIGHT: Instant Live Preview Pane -->
        <div class="sandpack-preview-pane">
          <div class="sandpack-pane-header">
            <span class="pane-title">⚡ Live Preview</span>
            <div class="viewport-controls">
              <button class="vp-btn ${activeViewport === 'desktop' ? 'active' : ''}" onclick="SandpackLive.setViewport('desktop')" title="Desktop View (100%)">🖥️ 100%</button>
              <button class="vp-btn ${activeViewport === 'tablet' ? 'active' : ''}" onclick="SandpackLive.setViewport('tablet')" title="Tablet View (768px)">💻 Tablet</button>
              <button class="vp-btn ${activeViewport === 'mobile' ? 'active' : ''}" onclick="SandpackLive.setViewport('mobile')" title="Mobile View (375px)">📱 Mobile</button>
            </div>
          </div>
          <div class="sandpack-preview-wrapper" id="sandpack-preview-wrapper">
            <iframe id="sandpack-preview-iframe" class="sandpack-frame" sandbox="allow-scripts allow-modals allow-same-origin"></iframe>
          </div>
        </div>
      </div>
    `;

    updatePreview();
  }

  function setViewport(vp) {
    activeViewport = vp;
    const wrapper = document.getElementById('sandpack-preview-wrapper');
    if (!wrapper) return;
    wrapper.className = 'sandpack-preview-wrapper vp-' + vp;

    document.querySelectorAll('.viewport-controls .vp-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(vp.substring(0, 3)));
    });
  }

  function handleCodeInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updatePreview();
    }, 250);
  }

  function updatePreview() {
    const input = document.getElementById('sandpack-code-input');
    const iframe = document.getElementById('sandpack-preview-iframe');
    if (!input || !iframe) return;

    iframe.srcdoc = input.value;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    renderStudio,
    setViewport,
    handleCodeInput,
    updatePreview
  };
})();

if (typeof window !== 'undefined') {
  window.SandpackLive = SandpackLive;
}
