// Ghep cac tep cua IDE thanh mot tai lieu HTML cho khung xem truoc (chep tu public/sandpack-live.js).
// Ham thuan: token va script Thiet ke do ben goi truyen vao, khong doc trang thai chung nao.

export type Preset = { label: string; files: Record<string, string>; libs?: string[]; entry: string; mode?: 'console' };
export type TaiLieu = { doc: string; token: string };

/** </script> trong code nhung vao trang se dong the som: doi thanh <\/script */
function chanDongThe(s: string, the: 'script' | 'style'): string {
  return s.replace(new RegExp('</' + the, 'gi'), '<\\/' + the);
}

export const DEFAULT_FILES: Record<string, string> = {
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
 * Moi cong nghe co bo file va thu vien rieng (thu vien chi tai trong khung xem truoc).
 * Bai React ma mo ra trang HTML thuan thi hoc vien khong hoc duoc gi.
 */
export const PRESETS: Record<string, Preset> = {
  html: {
    label: 'HTML / CSS',
    files: DEFAULT_FILES,
    libs: [],
    entry: 'script.js'
  },
  react: {
    label: 'React',
    libs: [
      'https://unpkg.com/react@18.3.1/umd/react.development.js',
      'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
      'https://unpkg.com/@babel/standalone@7.29.9/babel.min.js'
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
    libs: ['https://unpkg.com/vue@3.5.43/dist/vue.global.js'],
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
  typescript: {
    label: 'TypeScript',
    mode: 'console',
    libs: ['https://unpkg.com/typescript@5.4.5/lib/typescript.js'],
    entry: 'main.ts',
    files: {
      'main.ts': `// TypeScript duoc bien dich ngay trong trinh duyet,
// ket qua console.log hien o khung ben phai.

interface NguoiDung {
  ten: string;
  tuoi: number;
  kyNang: string[];
}

function moTa(u: NguoiDung): string {
  return \`\${u.ten}, \${u.tuoi} tuoi, biet \${u.kyNang.length} ky nang\`;
}

const an: NguoiDung = {
  ten: 'An',
  tuoi: 25,
  kyNang: ['TypeScript', 'React']
};

console.log(moTa(an));

// Thu bo dong duoi ra khoi comment de xem TypeScript bao loi kieu
// const sai: NguoiDung = { ten: 'Binh' };

// Generic
function dauTien<T>(mang: T[]): T | undefined {
  return mang[0];
}
console.log(dauTien([10, 20, 30]));
console.log(dauTien(['a', 'b']));`
    }
  },
  js: {
    label: 'JavaScript',
    mode: 'console',
    libs: [],
    entry: 'main.js',
    files: {
      'main.js': `// Ket qua console.log hien o khung ben phai.

// O(1) — khong phu thuoc kich thuoc mang
function layPhanTuDau(arr) {
  return arr[0];
}

// O(n) — duyet het mang mot lan
function tongMang(arr) {
  let tong = 0;
  for (const x of arr) tong += x;
  return tong;
}

// O(log n) — tim kiem nhi phan
function timNhiPhan(arr, dich) {
  let trai = 0, phai = arr.length - 1;
  while (trai <= phai) {
    const giua = Math.floor((trai + phai) / 2);
    if (arr[giua] === dich) return giua;
    if (arr[giua] < dich) trai = giua + 1;
    else phai = giua - 1;
  }
  return -1;
}

const so = [1, 3, 5, 7, 9, 11, 13];
console.log('phan tu dau :', layPhanTuDau(so));
console.log('tong        :', tongMang(so));
console.log('vi tri cua 9:', timNhiPhan(so, 9));
console.log('vi tri cua 4:', timNhiPhan(so, 4));`
    }
  },
  tailwind: {
    label: 'Tailwind CSS',
    libs: ['https://cdn.tailwindcss.com/3.4.19'],
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
export function presetFor(techId?: string): string {
  if (techId === 'react') return 'react';
  if (techId === 'vue') return 'vue';
  if (techId === 'tailwind') return 'tailwind';
  if (techId === 'typescript') return 'typescript';
  if (techId === 'dsa') return 'js';
  return 'html';
}

/** Che do console (TypeScript, JS thuan): khong co trang web, chi chay code va in ket qua */
export const laConsole = (presetId: string): boolean => (Object.hasOwn(PRESETS, presetId) ? PRESETS[presetId] : PRESETS.html).mode === 'console';

// Ghep 3 file thanh mot tai lieu HTML hoan chinh
export function buildDocument(presetId: string, files: Record<string, string>, { token, designScript = '' }: { token: string; designScript?: string }): TaiLieu {
  const P = Object.hasOwn(PRESETS, presetId) ? PRESETS[presetId] : PRESETS.html;

  // Che do console: khong co trang web de hien thi, chi chay code va in ket qua.
  // Van dung iframe sandbox de code chay tach biet khoi trang chinh.
  if (P.mode === 'console') return buildConsoleDocument(P, files, token);

  const html = files['index.html'] || '';
  // Code hoc vien chua </script> hay </style> se dong the som: viet thanh <\/script (cung nghia trong JS/CSS)
  const css = chanDongThe(files['style.css'] || '', 'style');
  const js = chanDongThe(files[P.entry] || '', 'script');

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

  // Chuoi thay the LUON truyen qua ham: replace(a, chuoi) hieu $$, $&, $' trong
  // chuoi la ky hieu dac biet, nen code `Giá: $${gia}` cua hoc vien mat dau $.
  const chen = (tim: string | RegExp, them: string) => doc.replace(tim, () => them);

  // thay <link href="style.css"> bang style thuc te
  doc = chen(/<link[^>]*href=["']style\.css["'][^>]*>/i, styleTag);
  // thay the script tro toi file entry bang noi dung thuc te
  const entryRe = new RegExp('<script[^>]*src=["\']' +
    P.entry.replace('.', '\\.') + '["\'][^>]*>\\s*<\\/script>', 'i');
  doc = chen(entryRe, scriptTag);

  if (!/<style/i.test(doc) && css) {
    doc = doc.includes('</head>') ? chen('</head>', styleTag + '</head>') : styleTag + doc;
  }
  if (!doc.includes(scriptTag) && js) {
    doc = doc.includes('</body>') ? chen('</body>', scriptTag + '</body>') : doc + scriptTag;
  }
  // Thu vien phai nap TRUOC code cua hoc vien
  if (libTags) {
    doc = doc.includes('</head>') ? chen('</head>', libTags + '</head>') : libTags + doc;
  }

  let extra = bridge;
  // Che do thiet ke: chen them lop phu bat hover/click de chon phan tu
  extra += designScript;
  doc = doc.includes('</head>') ? chen('</head>', extra + '</head>') : extra + doc;
  return { doc, token };
}

/**
 * Trang cho che do console. Nguon duoc dat trong the text/plain roi doc ra,
 * khong noi chuoi vao script.
 */
function buildConsoleDocument(P: Preset, files: Record<string, string>, token: string): TaiLieu {
  // Nguon nam trong the text/plain: </script> trong code cung dong the som nen phai chan
  const src = chanDongThe(files[P.entry] || '', 'script');
  const isTs = P.entry.endsWith('.ts');

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
})();
<\/script>`;

  const runner = isTs ? `
<script>
(function () {
  var src = document.getElementById('__src').textContent;
  var BASE = 'https://unpkg.com/typescript@5.4.5/lib/';
  var ROOT = 'lib.es2020.full.d.ts';
  var files = {};

  // lib.es2020.full.d.ts chi tro toi cac lib khac bang /// <reference lib="..." />
  // nen phai tai de quy het chuoi truoc, roi moi tao program.
  function tai(name) {
    if (files[name] !== undefined) return Promise.resolve();
    files[name] = '';
    return fetch(BASE + name)
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (text) {
        files[name] = text;
        var refs = [];
        var re = /\\/\\/\\/\\s*<reference\\s+lib=["']([^"']+)["']/g, m;
        while ((m = re.exec(text)) !== null) refs.push('lib.' + m[1] + '.d.ts');
        return Promise.all(refs.map(tai));
      })
      .catch(function () { files[name] = ''; });
  }

  function chay(outputText) {
    try { (0, eval)(outputText); }
    catch (e) { console.error(e.message); }
  }

  tai(ROOT).then(function () {
    var libNames = Object.keys(files).filter(function (n) { return files[n]; });
    files['main.ts'] = src;

    var opts = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: true,
      skipLibCheck: true,
      noEmitOnError: false
    };
    var host = {
      getSourceFile: function (name, lang) {
        if (files[name] === undefined) return undefined;
        return ts.createSourceFile(name, files[name], lang, true);
      },
      getDefaultLibFileName: function () { return ROOT; },
      writeFile: function () {},
      getCurrentDirectory: function () { return ''; },
      getDirectories: function () { return []; },
      fileExists: function (n) { return files[n] !== undefined; },
      readFile: function (n) { return files[n]; },
      getCanonicalFileName: function (n) { return n; },
      useCaseSensitiveFileNames: function () { return true; },
      getNewLine: function () { return String.fromCharCode(10); }
    };

    var program = ts.createProgram(libNames.concat(['main.ts']), opts, host);
    var diags = ts.getPreEmitDiagnostics(program).filter(function (d) {
      return d.file && d.file.fileName === 'main.ts';
    });

    diags.forEach(function (d) {
      var msg = ts.flattenDiagnosticMessageText(d.messageText, ' ');
      var pos = d.start !== undefined
        ? d.file.getLineAndCharacterOfPosition(d.start) : null;
      console.error('Lỗi kiểu' + (pos ? ' (dòng ' + (pos.line + 1) + ')' : '') + ': ' + msg);
    });

    chay(ts.transpileModule(src, { compilerOptions: opts }).outputText);
  }).catch(function () {
    console.warn('Không tải được thư viện kiểu — code vẫn chạy nhưng không kiểm tra kiểu.');
    chay(ts.transpileModule(src, {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None }
    }).outputText);
  });
})();
<\/script>` : `
<script>
(function () {
  try { (0, eval)(document.getElementById('__src').textContent); }
  catch (e) { console.error(e.message); }
})();
<\/script>`;

  const libTags = (P.libs || []).map(u => `<script src="${u}"><\/script>`).join('\n');

  const doc = [
    '<!doctype html><html><head><meta charset="utf-8">',
    bridge,
    libTags,
    '</head><body>',
    '<script type="text/plain" id="__src">', src, '<\/script>',
    runner,
    '</body></html>'
  ].join('\n');

  return { doc, token };
}
