/**
 * API Tester — gui request HTTP that bang fetch(), do thoi gian that,
 * doc status/header/kich thuoc that. Khong co du lieu gia.
 *
 * Khac ban cu: ban cu dung setTimeout roi tra ve JSON viet cung, luon "200 OK"
 * du URL sai. Ban nay hien dung ca loi mang va loi CORS — vi do la thu
 * nguoi hoc backend bat buoc phai hieu.
 */
const ApiTester = (() => {
  'use strict';

  const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const PRESETS = [
    { label: 'Health check', method: 'GET', url: '/api/health', body: '' },
    { label: 'Tìm việc làm', method: 'GET', url: '/api/jobs?search=react&limit=3', body: '' },
    { label: 'Gọi AI (cần đăng nhập)', method: 'POST', url: '/api/ai',
      body: '{\n  "messages": [{ "role": "user", "content": "Xin chào" }]\n}' },
    { label: 'Endpoint không tồn tại', method: 'GET', url: '/api/khong-co-that', body: '' },
    { label: 'API ngoài (thử CORS)', method: 'GET', url: 'https://api.github.com/repos/nodejs/node', body: '' }
  ];

  let state = { method: 'GET', tab: 'body', busy: false };
  let containerId = null;

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function statusClass(code) {
    if (code >= 500) return 'e5';
    if (code >= 400) return 'e4';
    if (code >= 300) return 'e3';
    if (code >= 200) return 'ok';
    return '';
  }

  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(2) + ' MB';
  }

  // ─── JSON viewer thu gon duoc, dung <details> nen khong can JS dieu khien ───
  function jsonTree(value, key = null, depth = 0) {
    const k = key === null ? '' : `<span class="apit-key">${esc(key)}</span><span class="apit-colon">:</span> `;

    if (value === null) return `<div class="apit-line">${k}<span class="apit-null">null</span></div>`;
    if (typeof value === 'number') return `<div class="apit-line">${k}<span class="apit-num">${value}</span></div>`;
    if (typeof value === 'boolean') return `<div class="apit-line">${k}<span class="apit-bool">${value}</span></div>`;
    if (typeof value === 'string') {
      const isUrl = /^https?:\/\//.test(value);
      const shown = value.length > 220 ? value.slice(0, 220) + '…' : value;
      return `<div class="apit-line">${k}<span class="apit-str${isUrl ? ' apit-url' : ''}">"${esc(shown)}"</span></div>`;
    }

    const isArr = Array.isArray(value);
    const entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);
    const open = depth < 2 ? ' open' : '';
    const brace = isArr ? ['[', ']'] : ['{', '}'];

    if (!entries.length) {
      return `<div class="apit-line">${k}<span class="apit-punc">${brace[0]}${brace[1]}</span></div>`;
    }

    return `
      <details class="apit-node"${open}>
        <summary>${k}<span class="apit-punc">${brace[0]}</span><span class="apit-count">${entries.length}</span><span class="apit-punc">${brace[1]}</span></summary>
        <div class="apit-children">
          ${entries.map(([kk, vv]) => jsonTree(vv, isArr ? String(kk) : kk, depth + 1)).join('')}
        </div>
      </details>`;
  }

  // ─────────────────────────────────────────────────────────
  function renderStudio(id) {
    containerId = id;
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = `
      <div class="apit">
        <div class="apit-bar">
          <select class="apit-method m-get" id="apit-method" aria-label="Phương thức HTTP"
                  onchange="ApiTester.setMethod(this.value)">
            ${METHODS.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
          <input class="apit-url" id="apit-url" value="/api/health" spellcheck="false"
                 aria-label="Địa chỉ API"
                 onkeydown="if(event.key==='Enter')ApiTester.send()"
                 placeholder="/api/... hoặc https://..." />
          <button class="apit-send" id="apit-send" onclick="ApiTester.send()">Gửi</button>
        </div>

        <div class="apit-presets">
          ${PRESETS.map((p, i) =>
            `<button class="apit-chip" onclick="ApiTester.loadPreset(${i})">
               <b class="m-${p.method.toLowerCase()}">${p.method}</b> ${esc(p.label)}
             </button>`).join('')}
        </div>

        <div class="apit-tabs" role="tablist">
          <button class="apit-tab active" data-tab="body" onclick="ApiTester.setTab('body')">Body</button>
          <button class="apit-tab" data-tab="headers" onclick="ApiTester.setTab('headers')">Headers</button>
        </div>

        <div class="apit-pane" id="apit-pane-body">
          <textarea class="apit-code" id="apit-body" spellcheck="false"
                    aria-label="Nội dung JSON gửi đi"
                    placeholder='{ "key": "value" }'></textarea>
        </div>
        <div class="apit-pane" id="apit-pane-headers" hidden>
          <textarea class="apit-code" id="apit-headers" spellcheck="false"
                    aria-label="Header, mỗi dòng một cặp"
                    placeholder="Content-Type: application/json">Content-Type: application/json</textarea>
        </div>

        <div class="apit-resp">
          <div class="apit-resp-head">
            <span class="apit-resp-title">Phản hồi</span>
            <div class="apit-meta" id="apit-meta"><span class="apit-idle">chưa gửi request nào</span></div>
          </div>
          <div class="apit-resp-body" id="apit-out">
            <p class="apit-hint">Chọn một ví dụ phía trên hoặc tự nhập địa chỉ, rồi bấm <strong>Gửi</strong>.</p>
          </div>
        </div>
      </div>`;
  }

  function setMethod(m) {
    state.method = m;
    const sel = document.getElementById('apit-method');
    if (sel) { sel.value = m; sel.className = 'apit-method m-' + m.toLowerCase(); }
    // GET/DELETE khong co body -> an di cho do roi mat (Hick)
    const bodyTab = document.querySelector('.apit-tab[data-tab="body"]');
    if (bodyTab) bodyTab.style.display = (m === 'GET' || m === 'DELETE') ? 'none' : '';
    if ((m === 'GET' || m === 'DELETE') && state.tab === 'body') setTab('headers');
  }

  function setTab(t) {
    state.tab = t;
    document.querySelectorAll('.apit-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === t));
    const b = document.getElementById('apit-pane-body');
    const h = document.getElementById('apit-pane-headers');
    if (b) b.hidden = t !== 'body';
    if (h) h.hidden = t !== 'headers';
  }

  function loadPreset(i) {
    const p = PRESETS[i];
    document.getElementById('apit-url').value = p.url;
    document.getElementById('apit-body').value = p.body;
    setMethod(p.method);
    setTab(p.method === 'GET' || p.method === 'DELETE' ? 'headers' : 'body');
    send();
  }

  function parseHeaders(text) {
    const out = {};
    for (const line of String(text || '').split('\n')) {
      const i = line.indexOf(':');
      if (i < 1) continue;
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (k) out[k] = v;
    }
    return out;
  }

  async function send() {
    if (state.busy) return;
    const url = document.getElementById('apit-url').value.trim();
    const method = state.method;
    const out = document.getElementById('apit-out');
    const meta = document.getElementById('apit-meta');
    const btn = document.getElementById('apit-send');
    if (!url) return;

    state.busy = true;
    btn.disabled = true;
    btn.textContent = 'Đang gửi';
    meta.innerHTML = '<span class="apit-idle">đang chờ phản hồi…</span>';
    out.innerHTML = '<div class="apit-loading"><span></span><span></span><span></span></div>';

    const headers = parseHeaders(document.getElementById('apit-headers').value);
    const bodyText = document.getElementById('apit-body').value.trim();

    // Neu dang gui JSON, tu dinh kem token dang nhap de vi du /api/ai chay duoc
    if (typeof AuthService !== 'undefined' && AuthService.isConfigured && AuthService.isConfigured()
        && url.startsWith('/api/') && !headers.Authorization) {
      try { Object.assign(headers, await AuthService.authHeaders()); } catch { /* chua dang nhap */ }
    }

    const init = { method, headers };
    if (method !== 'GET' && method !== 'DELETE' && bodyText) init.body = bodyText;

    const t0 = performance.now();
    let res, text, netError = null;
    try {
      res = await fetch(url, init);
      text = await res.text();
    } catch (err) {
      netError = err;
    }
    const ms = performance.now() - t0;

    state.busy = false;
    btn.disabled = false;
    btn.textContent = 'Gửi';

    if (netError) {
      meta.innerHTML = `<span class="apit-badge e5">Không kết nối được</span>
                        <span class="apit-badge">${ms.toFixed(0)} ms</span>`;
      out.innerHTML = renderNetworkError(netError, url);
      return;
    }

    const size = new Blob([text]).size;
    meta.innerHTML =
      `<span class="apit-badge ${statusClass(res.status)}">${res.status} ${esc(res.statusText || '')}</span>` +
      `<span class="apit-badge">${ms.toFixed(0)} ms</span>` +
      `<span class="apit-badge">${fmtBytes(size)}</span>`;

    const respHeaders = [];
    res.headers.forEach((v, k) => respHeaders.push([k, v]));

    let bodyHtml;
    const ctype = res.headers.get('content-type') || '';
    if (/json/i.test(ctype)) {
      try {
        bodyHtml = `<div class="apit-json">${jsonTree(JSON.parse(text))}</div>`;
      } catch {
        bodyHtml = `<pre class="apit-raw">${esc(text)}</pre>`;
      }
    } else {
      const preview = text.length > 4000 ? text.slice(0, 4000) + '\n… (đã cắt bớt)' : text;
      bodyHtml = `<pre class="apit-raw">${esc(preview)}</pre>`;
    }

    out.innerHTML = `
      ${bodyHtml}
      <details class="apit-headers-box">
        <summary>Header phản hồi <span class="apit-count">${respHeaders.length}</span></summary>
        <table class="apit-htable">
          ${respHeaders.map(([k, v]) =>
            `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
        </table>
      </details>`;
  }

  // Loi mang thuong la CORS — giai thich thay vi chi bao "Failed to fetch"
  function renderNetworkError(err, url) {
    let sameOrigin = true;
    try { sameOrigin = new URL(url, location.href).origin === location.origin; } catch {}

    const corsNote = sameOrigin ? '' : `
      <div class="apit-explain">
        <strong>Nhiều khả năng đây là CORS.</strong>
        Trình duyệt chỉ cho JavaScript đọc phản hồi từ máy chủ khác khi máy chủ đó
        gửi kèm header <code>Access-Control-Allow-Origin</code>. Request vẫn được gửi đi,
        nhưng trình duyệt chặn không cho bạn đọc kết quả.
        <br><br>
        Cách xử lý trong thực tế: gọi qua backend của mình (proxy) thay vì gọi thẳng
        từ trình duyệt — đúng như <code>/api/jobs</code> của DevMaster Hub đang làm.
      </div>`;

    return `
      <div class="apit-err">
        <strong>${esc(err.message || 'Không gửi được request')}</strong>
        ${corsNote}
      </div>`;
  }

  return { renderStudio, setMethod, setTab, loadPreset, send };
})();

if (typeof window !== 'undefined') window.ApiTester = ApiTester;
