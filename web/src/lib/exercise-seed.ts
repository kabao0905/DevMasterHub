// Dung tep khoi tao cho IDE tu code mau cua bai hoc (chep tu public/app.js).

export type TepIde = { name: string; code: string };

/** Cong nghe co trang xem truoc chay ngay trong trinh duyet (Angular can buoc build nen khong co) */
export const TECH_FRONTEND = ['htmlcss', 'react', 'vue', 'tailwind', 'typescript', 'dsa'];

/**
 * Chuyen code mau cua bai hoc thanh code chay duoc trong sandbox.
 * Bai hoc viet theo kieu du an that (import/export), con sandbox nap thu vien
 * tu CDN nen React/Vue la bien toan cuc — de nguyen se loi "Unexpected token export".
 */
export function adaptLessonCode(raw: string | null | undefined, techId: string): string {
  let code = String(raw || '');

  // Bo cac dong import: thu vien da co san duoi dang bien toan cuc
  // [^;] khop duoc ca ky tu xuong dong, nen bat duoc import viet nhieu dong
  code = code
    .replace(/^[ \t]*import\s+[^;]*?from\s+['"][^'"]+['"]\s*;?/gm, '')
    .replace(/^[ \t]*import\s+['"][^'"]+['"]\s*;?/gm, '');

  // Bo tu khoa export nhung GIU lai phan khai bao phia sau
  code = code
    .replace(/^[ \t]*export\s+default\s+(async\s+)?function\b/gm, '$1function')
    .replace(/^[ \t]*export\s+default\s+class\b/gm, 'class')
    .replace(/^[ \t]*export\s+default\s+/gm, 'const __default = ')
    .replace(/^[ \t]*export\s+(?=(async\s+)?(const|let|var|function|class)\b)/gm, '');

  // Bo dong "export { A, B };" con sot
  code = code.replace(/^[ \t]*export\s*\{[^}]*\};?[ \t]*$/gm, '');

  if (techId === 'react') {
    // Neu bai hoc khong tu goi render thi tu gan component vao trang
    if (!/ReactDOM\s*\.\s*(render|createRoot)/.test(code)) {
      const ten = timComponentGoc(code);
      if (ten) {
        code += `\n\nReactDOM.createRoot(document.getElementById('root')).render(<${ten} />);\n`;
      }
    }
    // Bai hoc hay dung useState truc tiep thay vi React.useState
    if (/\buseState\b/.test(code) && !/React\s*\.\s*useState/.test(code)
        && !/const\s*\{[^}]*useState/.test(code)) {
      code = 'const { useState, useEffect, useRef, useMemo, useCallback, useContext } = React;\n\n' + code;
    }
  }

  if (techId === 'vue' && !/createApp\s*\(/.test(code)) {
    code = 'const { createApp, ref, reactive, computed, watch, onMounted } = Vue;\n\n' + code;
  }

  return code.replace(/\n{3,}/g, '\n\n').trim();
}

/** Tim component de gan vao trang: uu tien ten App, khong thi lay cai cuoi cung */
export function timComponentGoc(code: string): string | null {
  if (/function\s+App\b/.test(code) || /const\s+App\s*=/.test(code)) return 'App';
  const ds: string[] = [];
  const re = /(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) ds.push(m[1]);
  return ds.length ? ds[ds.length - 1] : null;
}

export function seedFilesFromLesson(lesson: { code?: string } | null | undefined, techId: string): TepIde[] | null {
  const raw = String(lesson && lesson.code || '').trim();
  if (!raw) return null;

  // Trang HTML hoan chinh thi de nguyen vao index.html
  if (/<html|<!doctype/i.test(raw)) return [{ name: 'index.html', code: raw }];

  // CSS thuan
  if (/^\s*[.#a-zA-Z][^{]*\{[^}]*:/.test(raw) && !/function|=>|const |let |import /.test(raw)) {
    return [{ name: 'style.css', code: raw }];
  }

  // Code cua bai hoc phai vao dung file entry cua cong nghe do,
  // neu khong React se nhan code vao script.js va khong chay.
  const entry = techId === 'react' ? 'App.jsx'
              : techId === 'vue' ? 'App.js'
              : techId === 'typescript' ? 'main.ts'
              : techId === 'dsa' ? 'main.js'
              : 'script.js';
  return [{ name: entry, code: adaptLessonCode(raw, techId) }];
}
