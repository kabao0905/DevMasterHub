export type TepIde = { name: string; code: string };

export const TECH_FRONTEND = ['htmlcss', 'react', 'vue', 'tailwind', 'typescript'];

export function adaptLessonCode(raw: string | null | undefined, techId: string): string {
  let code = String(raw || '');

  code = code
    .replace(/^[ \t]*import\s+[^;]*?from\s+['"][^'"]+['"]\s*;?/gm, '')
    .replace(/^[ \t]*import\s+['"][^'"]+['"]\s*;?/gm, '');

  code = code
    .replace(/^[ \t]*export\s+default\s+(async\s+)?function\b/gm, '$1function')
    .replace(/^[ \t]*export\s+default\s+class\b/gm, 'class')
    .replace(/^[ \t]*export\s+default\s+/gm, 'const __default = ')
    .replace(/^[ \t]*export\s+(?=(async\s+)?(const|let|var|function|class)\b)/gm, '');

  code = code.replace(/^[ \t]*export\s*\{[^}]*\};?[ \t]*$/gm, '');

  if (techId === 'react') {
    if (!/ReactDOM\s*\.\s*(render|createRoot)/.test(code)) {
      const ten = timComponentGoc(code);
      if (ten) {
        code += `\n\nReactDOM.createRoot(document.getElementById('root')).render(<${ten} />);\n`;
      }
    }
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

  if (/<html|<!doctype/i.test(raw)) return [{ name: 'index.html', code: raw }];

  if (/^\s*[.#a-zA-Z][^{]*\{[^}]*:/.test(raw) && !/function|=>|const |let |import /.test(raw)) {
    return [{ name: 'style.css', code: raw }];
  }

  const entry = techId === 'react' ? 'App.jsx'
              : techId === 'vue' ? 'App.js'
              : techId === 'typescript' ? 'main.ts'
              : 'script.js';
  return [{ name: entry, code: adaptLessonCode(raw, techId) }];
}
