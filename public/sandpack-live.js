/**
 * Sandpack Live IDE — trinh soan thao nhieu file, xem truoc truc tiep.
 *
 * Ba diem khac ban cu:
 *  1. Nhieu file that (index.html / style.css / script.js) co tab chuyen qua lai.
 *  2. Thanh ngan giua hai cot keo duoc bang chuot lan ban phim.
 *  3. sandbox CHI co allow-scripts. Ban cu them allow-same-origin, nghia la
 *     code trong khung xem truoc doc duoc parent.localStorage — tuc lay duoc
 *     token dang nhap Supabase cua nguoi hoc.
 */
const SandpackLive = (() => {
  'use strict';

  const DEFAULT_FILES = {
    'index.html': `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <h1>Xin chào 👋</h1>
    <p>Sửa code bên trái, khung bên phải đổi ngay.</p>
    <button id="btn">Bấm thử</button>
    <p id="out"></p>
  </main>
  <script src="script.js"><\/script>
</body>
</html>`,
    'style.css': `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}
.card {
  padding: 32px 40px;
  border-radius: 16px;
  background: #1e293b;
  box-shadow: 0 10px 40px rgba(0,0,0,.4);
  text-align: center;
}
h1 { margin: 0 0 8px; color: #38bdf8; }
button {
  margin-top: 12px;
  padding: 10px 22px;
  border: 0;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
button:hover { background: #2563eb; }`,
    'script.js': `let n = 0;
document.getElementById('btn').addEventListener('click', () => {
  n++;
  document.getElementById('out').textContent = 'Đã bấm ' + n + ' lần';
  console.log('lần bấm thứ', n);
});`
  };

  /**
   * Moi cong nghe co bo file va thu vien rieng.
   * Bai React ma mo ra trang HTML thuan thi hoc vien khong hoc duoc gi.
   */
  const PRESETS = {
    html: {
      label: 'HTML / CSS',
      files: DEFAULT_FILES,
      libs: [],
      entry: 'script.js'
    },
    react: {
      label: 'React',
      libs: [
        'https://unpkg.com/react@18/umd/react.development.js',
        'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
        'https://unpkg.com/@babel/standalone/babel.min.js'
      ],
      entry: 'App.jsx',
      files: {
        'index.html': `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
        'style.css': `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}
.card {
  width: 260px;
  padding: 20px;
  border-radius: 14px;
  background: #1e293b;
  box-shadow: 0 10px 30px rgba(0,0,0,.4);
}
.card img { width: 100%; border-radius: 10px; }
.card h3 { margin: 12px 0 6px; color: #38bdf8; }
.card p { margin: 0; font-size: 14px; color: #94a3b8; }`,
        'App.jsx': `function Card({ image, title, description }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function App() {
  const [dem, setDem] = React.useState(0);

  return (
    <div>
      <Card
        image="https://picsum.photos/seed/devmaster/300/180"
        title="Component Card"
        description="Sua code ben trai, ket qua ben phai doi ngay."
      />
      <button onClick={() => setDem(dem + 1)} style={{ marginTop: 12 }}>
        Da bam {dem} lan
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`
      }
    },
    vue: {
      label: 'Vue',
      libs: ['https://unpkg.com/vue@3/dist/vue.global.js'],
      entry: 'App.js',
      files: {
        'index.html': `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"></div>
</body>
</html>`,
        'style.css': `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}
.box { padding: 24px 32px; border-radius: 14px; background: #1e293b; text-align: center; }
h2 { margin: 0 0 10px; color: #42b883; }
button { margin-top: 10px; padding: 8px 18px; border: 0; border-radius: 8px;
         background: #42b883; color: #fff; cursor: pointer; }`,
        'App.js': `const { createApp, ref } = Vue;

createApp({
  setup() {
    const dem = ref(0);
    const tang = () => dem.value++;
    return { dem, tang };
  },
  template: \`
    <div class="box">
      <h2>Xin chao Vue</h2>
      <p>Da bam {{ dem }} lan</p>
      <button @click="tang">Bam thu</button>
    </div>
  \`
}).mount('#app');`
      }
    },
    tailwind: {
      label: 'Tailwind CSS',
      libs: ['https://cdn.tailwindcss.com'],
      entry: 'script.js',
      files: {
        'index.html': `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
</head>
<body class="min-h-screen grid place-items-center bg-slate-900 text-slate-100">
  <div class="p-8 rounded-2xl bg-slate-800 shadow-2xl text-center">
    <h1 class="text-3xl font-bold text-sky-400">Xin chao Tailwind</h1>
    <p class="mt-2 text-slate-400">Sua class ben trai, giao dien ben phai doi ngay.</p>
    <button id="btn" class="mt-4 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 font-medium">
      Bam thu
    </button>
    <p id="out" class="mt-3 text-sm text-slate-400"></p>
  </div>
</body>
</html>`,
        'style.css': `/* Tailwind lo phan lon giao dien.
   File nay danh cho CSS tu viet them. */`,
        'script.js': `let n = 0;
document.getElementById('btn').addEventListener('click', () => {
  n++;
  document.getElementById('out').textContent = 'Da bam ' + n + ' lan';
});`
      }
    }
  };

  /** Chon preset theo id cong nghe cua bai hoc */
  function presetFor(techId) {
    if (techId === 'react') return 'react';
    if (techId === 'vue') return 'vue';
    if (techId === 'tailwind') return 'tailwind';
    return 'html';
  }

  const VIEWPORTS = {
    desktop: { label: 'Desktop', w: null, icon: '🖥️' },
    tablet: { label: 'Tablet', w: 768, icon: '💻' },
    mobile: { label: 'Mobile', w: 375, icon: '📱' }
  };

  let preset = 'html';
  let files = { ...DEFAULT_FILES };
  let active = 'index.html';
  let loadedFile = null;   // file dang thuc su nam trong textarea
  let viewport = 'desktop';
  let split = 50;               // % chieu rong cot trai
  let timer = null;
  let logs = [];
  let frameId = 0;
  let hostId = null;
  let designMode = false;

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ─── Ghep 3 file thanh mot tai lieu HTML hoan chinh ───
  function buildDocument() {
    const P = PRESETS[preset] || PRESETS.html;
    const html = files['index.html'] || '';
    const css = files['style.css'] || '';
    const js = files[P.entry] || '';
    const token = 'sp' + (++frameId);

    // Cau noi console: khung xem truoc chay o origin rieng nen chi postMessage duoc
    // voi targetOrigin '*'. Ben nhan phai doi chieu event.source truoc khi tin.
    const bridge = `
<script>
(function () {
  var send = function (level, args) {
    try {
      parent.postMessage({ __sandpack: '${token}', level: level, args: args.map(function (a) {
        try {
          if (a instanceof Error) return a.name + ': ' + a.message;
          return typeof a === 'object' ? JSON.stringify(a) : String(a);
        } catch (e) { return String(a); }
      }) }, '*');
    } catch (e) {}
  };
  ['log', 'warn', 'error', 'info'].forEach(function (lv) {
    var orig = console[lv];
    console[lv] = function () { send(lv, [].slice.call(arguments)); orig.apply(console, arguments); };
  });
  window.addEventListener('error', function (e) { send('error', [e.message + ' (dòng ' + e.lineno + ')']); });
  window.addEventListener('unhandledrejection', function (e) { send('error', ['Promise bị từ chối: ' + e.reason]); });
})();
<\/script>`;

    let doc = html;
    const styleTag = `<style>\n${css}\n</style>`;
    // JSX phai chay qua Babel, con lai la script thuong
    const scriptType = P.entry.endsWith('.jsx') ? ' type="text/babel"' : '';
    const scriptTag = `<script${scriptType}>\n${js}\n<\/script>`;
    const libTags = (P.libs || []).map(u => `<script src="${u}"><\/script>`).join('\n');

    // thay <link href="style.css"> bang style thuc te
    doc = doc.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, styleTag);
    // thay the script tro toi file entry bang noi dung thuc te
    const entryRe = new RegExp('<script[^>]*src=["\']' +
      P.entry.replace('.', '\\.') + '["\'][^>]*>\\s*<\\/script>', 'i');
    doc = doc.replace(entryRe, scriptTag);

    if (!/<style/i.test(doc) && css) {
      doc = doc.includes('</head>') ? doc.replace('</head>', styleTag + '</head>') : styleTag + doc;
    }
    if (!doc.includes(scriptTag) && js) {
      doc = doc.includes('</body>') ? doc.replace('</body>', scriptTag + '</body>') : doc + scriptTag;
    }
    // Thu vien phai nap TRUOC code cua hoc vien
    if (libTags) {
      doc = doc.includes('</head>') ? doc.replace('</head>', libTags + '</head>') : libTags + doc;
    }

    let extra = bridge;
    // Che do thiet ke: chen them lop phu bat hover/click de chon phan tu
    if (designMode && typeof DesignMode !== 'undefined') {
      extra += DesignMode.injectScript(token);
    }
    doc = doc.includes('</head>') ? doc.replace('</head>', extra + '</head>') : extra + doc;
    return { doc, token };
  }

  let currentToken = null;

  function onMessage(e) {
    const f = document.getElementById('sp-frame');
    if (!f || e.source !== f.contentWindow) return;         // chi tin khung cua minh
    const d = e.data;
    if (d && d.__design === currentToken && d.type === 'select') {
      if (typeof DesignMode !== 'undefined') DesignMode.setSelection(d);
      return;
    }
    if (!d || d.__sandpack !== currentToken) return;
    logs.push({ level: d.level, text: (d.args || []).join(' ') });
    if (logs.length > 80) logs = logs.slice(-80);
    paintConsole();
  }

  function paintConsole() {
    const box = document.getElementById('sp-console');
    const badge = document.getElementById('sp-log-count');
    if (!box) return;
    const errs = logs.filter(l => l.level === 'error').length;
    if (badge) {
      badge.textContent = logs.length ? String(logs.length) : '';
      badge.className = 'sp-count' + (errs ? ' has-err' : '');
    }
    box.innerHTML = logs.length
      ? logs.map(l => `<div class="sp-log ${l.level}">${esc(l.text)}</div>`).join('')
      : '<div class="sp-log-empty">console.log() trong code sẽ hiện ở đây</div>';
    box.scrollTop = box.scrollHeight;
  }

  // ─────────────────────────────────────────────────────────
  function renderStudio(id, initialFiles, techId) {
    hostId = id;
    const el = document.getElementById(id);
    if (!el) return;

    if (techId !== undefined) preset = presetFor(techId);
    const P = PRESETS[preset] || PRESETS.html;

    if (!Object.keys(files).length || techId !== undefined) files = { ...P.files };
    if (Array.isArray(initialFiles) && initialFiles.length) {
      files = { ...P.files };
      for (const f of initialFiles) if (f && f.name) files[f.name] = f.code || '';
    }
    logs = [];
    loadedFile = null;

    el.innerHTML = `
      <div class="sp${designMode ? ' design' : ''}" id="sp-root" style="--sp-split:${split}%">
        <div class="sp-pane sp-left">
          <div class="sp-head">
            <div class="sp-tabs" role="tablist">
              ${Object.keys(files).map(n => `
                <button class="sp-tab${n === active ? ' active' : ''}" role="tab"
                        aria-selected="${n === active}"
                        onclick="SandpackLive.openFile('${esc(n)}')">${esc(n)}</button>`).join('')}
            </div>
            <button class="sp-reset" onclick="SandpackLive.reset()" title="Khôi phục code mẫu">↺</button>
          </div>
          <div class="sp-editor-wrap">
            <div class="sp-gutter" id="sp-gutter"></div>
            <textarea class="sp-editor" id="sp-editor" spellcheck="false"
                      aria-label="Trình soạn thảo mã nguồn"
                      oninput="SandpackLive.onInput()"
                      onscroll="SandpackLive.syncScroll()"
                      onkeydown="SandpackLive.onKey(event)"></textarea>
          </div>
        </div>

        <div class="sp-divider" id="sp-divider" role="separator" aria-orientation="vertical"
             tabindex="0" aria-label="Kéo để đổi tỉ lệ hai cột"
             onmousedown="SandpackLive.startDrag(event)"
             ontouchstart="SandpackLive.startDrag(event)"
             onkeydown="SandpackLive.dividerKey(event)"><span></span></div>

        <div class="sp-pane sp-right">
          <div class="sp-head">
            <button class="sp-design-toggle${designMode ? ' on' : ''}"
                    onclick="SandpackLive.toggleDesign()"
                    aria-pressed="${designMode}"
                    title="Bật để bấm chọn và sửa trực tiếp trên trang">
              <span class="sp-dot"></span>${designMode ? 'Đang thiết kế' : 'Thiết kế'}
            </button>
            <div class="sp-vps">
              ${Object.entries(VIEWPORTS).map(([k, v]) => `
                <button class="sp-vp${k === viewport ? ' active' : ''}"
                        onclick="SandpackLive.setViewport('${k}')"
                        title="${v.label}${v.w ? ' — ' + v.w + 'px' : ''}">${v.icon}</button>`).join('')}
            </div>
          </div>
          <div class="sp-stage" id="sp-stage">
            <iframe id="sp-frame" class="sp-frame" title="Kết quả xem trước"
                    sandbox="allow-scripts allow-modals allow-forms allow-popups"></iframe>
          </div>
          <div class="dm-dock" id="dm-dock"${designMode ? '' : ' hidden'}>
            <div class="dm-ai">
              <div class="dm-ai-row">
                <span class="dm-ai-label">Nhờ AI sửa</span>
                <span class="dm-ai-target" id="dm-ai-target">cả trang</span>
              </div>
              <div class="dm-ai-row">
                <input type="text" id="dm-ai-input" class="dm-ai-input"
                       placeholder="ví dụ: đổi nền thành gradient tím, bo góc nút to hơn…"
                       onkeydown="DesignMode.aiKey(event)" />
                <button class="dm-ai-btn" onclick="DesignMode.askAi()">Gửi</button>
              </div>
              <div class="dm-ai-status" id="dm-ai-status"></div>
            </div>
            <div class="dm-panel" id="dm-panel"></div>
          </div>
          <details class="sp-console-box"${designMode ? '' : ' open'}>
            <summary>Console <span class="sp-count" id="sp-log-count"></span></summary>
            <div class="sp-console" id="sp-console"></div>
          </details>
        </div>
      </div>`;

    window.removeEventListener('message', onMessage);
    window.addEventListener('message', onMessage);

    openFile(active);
    if (designMode && typeof DesignMode !== 'undefined') DesignMode.setSelection(DesignMode.getSelection());
    refresh();
  }

  function openFile(name) {
    if (!(name in files)) return;
    const ta = document.getElementById('sp-editor');
    // Chi luu khi textarea dang thuc su chua file do. Sau khi render lai,
    // textarea rong — luu luc nay se xoa sach noi dung file.
    if (ta && loadedFile && loadedFile in files) files[loadedFile] = ta.value;
    active = name;
    document.querySelectorAll('.sp-tab').forEach(b => {
      const on = b.textContent === name;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    if (ta) { ta.value = files[name]; loadedFile = name; syncGutter(); }
  }

  function onInput() {
    const ta = document.getElementById('sp-editor');
    if (ta && loadedFile) files[loadedFile] = ta.value;
    syncGutter();
    clearTimeout(timer);
    timer = setTimeout(refresh, 300);
  }

  function onKey(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart;
    ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = s + 2;
    onInput();
  }

  function syncGutter() {
    const ta = document.getElementById('sp-editor');
    const g = document.getElementById('sp-gutter');
    if (!ta || !g) return;
    const n = ta.value.split('\n').length;
    g.innerHTML = Array.from({ length: n }, (_, i) => i + 1).join('<br>');
    g.scrollTop = ta.scrollTop;
  }

  function syncScroll() {
    const ta = document.getElementById('sp-editor');
    const g = document.getElementById('sp-gutter');
    if (ta && g) g.scrollTop = ta.scrollTop;
  }

  function refresh() {
    const frame = document.getElementById('sp-frame');
    if (!frame) return;
    logs = [];
    const { doc, token } = buildDocument();
    currentToken = token;
    frame.srcdoc = doc;
    paintConsole();
  }

  function setViewport(k) {
    if (!VIEWPORTS[k]) return;
    viewport = k;
    const stage = document.getElementById('sp-stage');
    if (stage) {
      stage.dataset.vp = k;
      const w = VIEWPORTS[k].w;
      stage.style.setProperty('--sp-frame-w', w ? w + 'px' : '100%');
    }
    // so khop theo khoa, khong doan tu chu trong nut nhu ban cu
    document.querySelectorAll('.sp-vp').forEach(b => {
      b.classList.toggle('active', b.getAttribute('onclick').includes(`'${k}'`));
    });
  }

  // ─── Keo thanh ngan ───
  let dragging = false;
  function startDrag(e) {
    dragging = true;
    e.preventDefault();
    document.body.style.userSelect = 'none';
    const frame = document.getElementById('sp-frame');
    if (frame) frame.style.pointerEvents = 'none';   // khong de iframe nuot su kien chuot
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  }
  function onDrag(e) {
    if (!dragging) return;
    const root = document.getElementById('sp-root');
    if (!root) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const r = root.getBoundingClientRect();
    const pct = ((x - r.left) / r.width) * 100;
    split = Math.min(80, Math.max(20, pct));
    root.style.setProperty('--sp-split', split + '%');
    if (e.cancelable) e.preventDefault();
  }
  function endDrag() {
    dragging = false;
    document.body.style.userSelect = '';
    const frame = document.getElementById('sp-frame');
    if (frame) frame.style.pointerEvents = '';
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);
  }
  // Keo duoc bang ban phim: nguoi dung khong dung chuot van chinh duoc
  function dividerKey(e) {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') split = Math.max(20, split - step);
    else if (e.key === 'ArrowRight') split = Math.min(80, split + step);
    else return;
    e.preventDefault();
    document.getElementById('sp-root').style.setProperty('--sp-split', split + '%');
  }

  function reset() {
    files = { ...(PRESETS[preset] || PRESETS.html).files };
    renderStudio(hostId);
  }

  // ─── Che do thiet ke ───
  function toggleDesign() {
    designMode = !designMode;
    if (typeof DesignMode !== 'undefined') DesignMode.setSelection(null);
    renderStudio(hostId);
  }

  /**
   * Va mot hoac nhieu thuoc tinh vao style.css.
   * Day la diem mau chot cua "code la goc": khong sinh lai file, chi chen
   * dung khai bao can thiet nen code hoc vien tu go van con nguyen.
   */
  function applyStyle(selector, props, skipRefresh) {
    if (typeof CssPatch === 'undefined' || !selector) return;
    const res = CssPatch.setProperties(files['style.css'] || '', selector, props);
    if (!res.changed) return;
    files['style.css'] = res.css;

    // neu dang mo dung file do thi cap nhat luon o soan thao
    if (loadedFile === 'style.css') {
      const ta = document.getElementById('sp-editor');
      if (ta) { ta.value = res.css; syncGutter(); }
    }
    if (!skipRefresh) {
      clearTimeout(timer);
      timer = setTimeout(refresh, 220);
    }
  }

  function replaceFile(name, content) {
    if (!(name in files)) return;
    files[name] = content;
    if (loadedFile === name) {
      const ta = document.getElementById('sp-editor');
      if (ta) { ta.value = content; syncGutter(); }
    }
  }

  return {
    renderStudio, openFile, onInput, onKey, syncGutter, syncScroll,
    setViewport, startDrag, dividerKey, reset, refresh,
    toggleDesign, applyStyle, replaceFile,
    isDesignMode: () => designMode,
    getPreset: () => preset,
    PRESETS,
    getFiles: () => ({ ...files })
  };
})();

if (typeof window !== 'undefined') window.SandpackLive = SandpackLive;
