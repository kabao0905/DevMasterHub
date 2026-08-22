const SandboxRunner = (() => {
  let logs = [];
  let consoleListener = null;

  function init() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'DEVMASTER_SANDBOX_LOG') {
        const { level, args, time } = event.data;
        logs.push({ level, args, time: time || new Date().toLocaleTimeString() });
        if (typeof consoleListener === 'function') {
          consoleListener(logs);
        }
      }
    });
  }

  function onLog(callback) {
    consoleListener = callback;
  }

  function clearLogs() {
    logs = [];
    if (typeof consoleListener === 'function') {
      consoleListener(logs);
    }
  }

  function getLogs() {
    return [...logs];
  }

  function runWebCode({ html = '', css = '', js = '' }, iframeContainerEl) {
    if (!iframeContainerEl) return;
    clearLogs();

    iframeContainerEl.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'sandbox-preview-frame';
    iframe.setAttribute('sandbox', 'allow-scripts allow-modals allow-same-origin');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = '#ffffff';
    iframe.style.borderRadius = '8px';

    iframeContainerEl.appendChild(iframe);

    const loggerScript = `
      <script>
        (function() {
          function sendLog(level, args) {
            try {
              const formattedArgs = Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
                }
                return String(arg);
              });
              window.parent.postMessage({
                type: 'DEVMASTER_SANDBOX_LOG',
                level: level,
                args: formattedArgs,
                time: new Date().toLocaleTimeString()
              }, '*');
            } catch (err) {}
          }

          const _log = console.log;
          const _warn = console.warn;
          const _error = console.error;
          const _info = console.info;

          console.log = function() { sendLog('info', arguments); _log.apply(console, arguments); };
          console.warn = function() { sendLog('warn', arguments); _warn.apply(console, arguments); };
          console.error = function() { sendLog('error', arguments); _error.apply(console, arguments); };
          console.info = function() { sendLog('info', arguments); _info.apply(console, arguments); };

          window.onerror = function(msg, url, line, col, error) {
            sendLog('error', ['[Lỗi Runtime] ' + msg + ' (Dòng ' + line + ')']);
            return false;
          };
        })();
      <\/script>
    `;

    const fullSrcDoc = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Base sandbox reset */
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2328; }
          ${css}
        </style>
        ${loggerScript}
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch(err) {
            console.error('[Lỗi Thực Thi JS]: ' + err.message);
          }
        <\/script>
      </body>
      </html>
    `;

    iframe.srcdoc = fullSrcDoc;
  }

  function runJavaScript(code) {
    clearLogs();
    const sandboxIframe = document.createElement('iframe');
    sandboxIframe.style.display = 'none';
    sandboxIframe.setAttribute('sandbox', 'allow-scripts');
    document.body.appendChild(sandboxIframe);

    const script = `
      <script>
        (function() {
          function sendLog(level, args) {
            try {
              const formattedArgs = Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
                }
                return String(arg);
              });
              window.parent.postMessage({
                type: 'DEVMASTER_SANDBOX_LOG',
                level: level,
                args: formattedArgs,
                time: new Date().toLocaleTimeString()
              }, '*');
            } catch (err) {}
          }

          console.log = function() { sendLog('info', arguments); };
          console.warn = function() { sendLog('warn', arguments); };
          console.error = function() { sendLog('error', arguments); };

          try {
            const result = eval(${JSON.stringify(code)});
            if (result !== undefined) {
              sendLog('info', ['=> ' + (typeof result === 'object' ? JSON.stringify(result) : result)]);
            }
          } catch (err) {
            console.error(err.message);
          }
        })();
      <\/script>
    `;

    sandboxIframe.srcdoc = script;

    setTimeout(() => {
      if (sandboxIframe && sandboxIframe.parentNode) {
        sandboxIframe.parentNode.removeChild(sandboxIframe);
      }
    }, 1500);
  }

  function renderConsoleDrawer(containerId, isDark = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isVi = typeof I18n !== 'undefined' ? I18n.getLang() === 'vi' : true;

    container.innerHTML = `
      <div class="sandbox-console-drawer ${isDark ? 'dark-theme' : ''}">
        <div class="console-header">
          <div class="console-title">
            <span class="console-dot"></span>
            <span>Console Output</span>
            <span class="console-count" id="${containerId}-count">0</span>
          </div>
          <div class="console-actions">
            <button class="console-btn" onclick="SandboxRunner.clearLogs()" title="${isVi ? 'Xóa Console' : 'Clear Console'}">🗑️ ${isVi ? 'Xóa' : 'Clear'}</button>
          </div>
        </div>
        <div class="console-body" id="${containerId}-body">
          <div class="console-empty">${isVi ? 'Chưa có output. Nhấn "Chạy Code / Run" để xem kết quả.' : 'No output yet. Click "Run Code" to view output.'}</div>
        </div>
      </div>
    `;

    onLog((currentLogs) => {
      const bodyEl = document.getElementById(`${containerId}-body`);
      const countEl = document.getElementById(`${containerId}-count`);
      if (!bodyEl) return;

      if (countEl) countEl.textContent = currentLogs.length;

      if (currentLogs.length === 0) {
        bodyEl.innerHTML = `<div class="console-empty">${isVi ? 'Console đã được xóa sạch.' : 'Console cleared.'}</div>`;
        return;
      }

      bodyEl.innerHTML = currentLogs.map(item => {
        const icon = item.level === 'error' ? '❌' : item.level === 'warn' ? '⚠️' : '▶';
        const msg = item.args.join(' ');
        return `
          <div class="console-line console-${item.level}">
            <span class="console-time">${item.time}</span>
            <span class="console-level-icon">${icon}</span>
            <pre class="console-text">${escapeHtml(msg)}</pre>
          </div>
        `;
      }).join('');

      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  init();

  return {
    init,
    onLog,
    clearLogs,
    getLogs,
    runWebCode,
    runJavaScript,
    renderConsoleDrawer
  };
})();

if (typeof window !== 'undefined') {
  window.SandboxRunner = SandboxRunner;
}
