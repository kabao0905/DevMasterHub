const ApiTester = (() => {
  let activeMethod = 'GET';

  function renderStudio(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="api-studio-layout">
        <!-- 1. URL & Request Bar -->
        <div class="api-request-bar">
          <select class="api-method-select" id="api-method" onchange="ApiTester.setMethod(this.value)">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input type="text" class="api-url-input" id="api-url" value="/api/users" placeholder="https://api.example.com/v1/resource" />
          <button class="api-send-btn" onclick="ApiTester.sendRequest()">Send 🚀</button>
        </div>

        <!-- 2. Request Body / Headers Tab -->
        <div class="api-body-tabs">
          <span class="api-tab-label">JSON Request Payload (Dành cho POST/PUT):</span>
          <textarea class="api-payload-editor" id="api-payload" rows="4">{\n  "username": "devmaster_pro",\n  "role": "engineer",\n  "skills": ["JavaScript", "Python", "Rust"]\n}</textarea>
        </div>

        <!-- 3. Response Inspector -->
        <div class="api-response-panel">
          <div class="api-response-header">
            <span>Phản hồi (Response):</span>
            <div class="api-status-badges">
              <span class="api-badge status-200" id="api-status-badge">Status: 200 OK</span>
              <span class="api-badge status-time" id="api-time-badge">Time: 32 ms</span>
              <span class="api-badge status-size" id="api-size-badge">Size: 428 B</span>
            </div>
          </div>
          <pre class="api-json-viewer" id="api-response-json">{\n  "status": "success",\n  "message": "User created successfully",\n  "data": {\n    "id": 1082,\n    "username": "devmaster_pro",\n    "role": "engineer",\n    "createdAt": "2026-08-20T20:50:00.000Z"\n  }\n}</pre>
        </div>
      </div>
    `;
  }

  function setMethod(m) {
    activeMethod = m;
    const sel = document.getElementById('api-method');
    if (sel) {
      sel.className = 'api-method-select method-' + m.toLowerCase();
    }
  }

  function sendRequest() {
    const method = document.getElementById('api-method')?.value || 'GET';
    const url = document.getElementById('api-url')?.value || '/api/users';
    const jsonView = document.getElementById('api-response-json');
    const statusBadge = document.getElementById('api-status-badge');
    const timeBadge = document.getElementById('api-time-badge');

    if (statusBadge) statusBadge.textContent = 'Đang gửi...';

    setTimeout(() => {
      const mockTime = Math.floor(Math.random() * 40) + 15;
      if (statusBadge) statusBadge.textContent = 'Status: 200 OK';
      if (timeBadge) timeBadge.textContent = `Time: ${mockTime} ms`;
      if (jsonView) {
        jsonView.textContent = JSON.stringify({
          status: 'success',
          endpoint: url,
          method: method,
          timestamp: new Date().toISOString(),
          data: {
            id: Math.floor(Math.random() * 9000) + 1000,
            result: 'API Endpoint tested successfully on DevMaster Hub'
          }
        }, null, 2);
      }
    }, 200);
  }

  return {
    renderStudio,
    setMethod,
    sendRequest
  };
})();

if (typeof window !== 'undefined') {
  window.ApiTester = ApiTester;
}
