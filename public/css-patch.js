/**
 * CssPatch — doc, sua va ghi lai CSS ma GIU NGUYEN phan con lai cua file.
 *
 * Day la loi cua che do "code la goc": khi hoc vien keo tha tren trang that,
 * he thong khong sinh lai ca file CSS (lam mat code ho tu go) ma chi
 * chen dung mot khai bao vao dung mot rule.
 *
 * Khong dung eval, khong dung thu vien ngoai.
 */
const CssPatch = (() => {
  'use strict';

  /**
   * Tach CSS thanh danh sach rule o muc cao nhat.
   * Tra ve [{ selector, body, start, end, bodyStart, bodyEnd, atRule }]
   * start/end la chi so ky tu trong chuoi goc, dung de cat/dan chinh xac.
   */
  function parseRules(css) {
    const rules = [];
    let i = 0;
    const n = css.length;

    while (i < n) {
      // bo qua khoang trang
      while (i < n && /\s/.test(css[i])) i++;
      if (i >= n) break;

      // bo qua comment
      if (css[i] === '/' && css[i + 1] === '*') {
        const end = css.indexOf('*/', i + 2);
        i = end === -1 ? n : end + 2;
        continue;
      }

      const start = i;

      // doc selector cho toi dau {
      let depth = 0;
      let bodyStart = -1;
      while (i < n) {
        if (css[i] === '{') { bodyStart = i; break; }
        if (css[i] === ';' && depth === 0) { break; }   // at-rule khong than, vd @import
        i++;
      }

      if (bodyStart === -1) {
        // @import ...;  hoac rac
        while (i < n && css[i] !== ';') i++;
        i++;
        continue;
      }

      const selector = css.slice(start, bodyStart).trim();

      // tim dau } khop, co dem long nhau cho @media
      depth = 1;
      let j = bodyStart + 1;
      while (j < n && depth > 0) {
        if (css[j] === '{') depth++;
        else if (css[j] === '}') depth--;
        else if (css[j] === '/' && css[j + 1] === '*') {
          const e = css.indexOf('*/', j + 2);
          j = e === -1 ? n : e + 1;
        }
        j++;
      }

      const bodyEnd = j - 1;   // vi tri dau }
      rules.push({
        selector,
        body: css.slice(bodyStart + 1, bodyEnd),
        start,
        end: j,
        bodyStart: bodyStart + 1,
        bodyEnd,
        atRule: selector.startsWith('@')
      });
      i = j;
    }

    return rules;
  }

  /** Tach than rule thanh cac khai bao, giu ca vi tri de sua tai cho */
  function parseDeclarations(body) {
    const decls = [];
    let i = 0;
    const n = body.length;

    while (i < n) {
      while (i < n && /[\s;]/.test(body[i])) i++;
      if (i >= n) break;

      if (body[i] === '/' && body[i + 1] === '*') {
        const e = body.indexOf('*/', i + 2);
        i = e === -1 ? n : e + 2;
        continue;
      }

      const start = i;
      const colon = body.indexOf(':', i);
      if (colon === -1) break;

      // gia tri co the chua dau ; trong ngoac, vd url(...) hay gradient
      let j = colon + 1;
      let paren = 0;
      while (j < n) {
        const c = body[j];
        if (c === '(') paren++;
        else if (c === ')') paren--;
        else if (c === ';' && paren === 0) break;
        else if (c === '"' || c === "'") {
          const q = c; j++;
          while (j < n && body[j] !== q) { if (body[j] === '\\') j++; j++; }
        }
        j++;
      }

      const prop = body.slice(start, colon).trim();
      const value = body.slice(colon + 1, j).trim();
      if (prop && !prop.startsWith('/')) {
        decls.push({ prop, value, start, end: j });
      }
      i = j + 1;
    }

    return decls;
  }

  /** So sanh selector bo qua khac biet ve khoang trang */
  function sameSelector(a, b) {
    const norm = s => String(s).replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').trim().toLowerCase();
    return norm(a) === norm(b);
  }

  /** Doan thut dau dong dang dung trong file de code sinh ra khong lech */
  function detectIndent(css) {
    const m = css.match(/\n([ \t]+)[a-zA-Z-]+\s*:/);
    return m ? m[1] : '  ';
  }

  /**
   * Chen hoac cap nhat cac thuoc tinh cho mot selector.
   * @param {string} css     noi dung file CSS hien tai
   * @param {string} selector  vd '.card' hoac '#btn'
   * @param {object} props   { 'background-color': '#fff', ... }
   *                         gia tri null/'' nghia la XOA thuoc tinh do
   * @returns {{ css: string, changed: boolean, created: boolean }}
   */
  function setProperties(css, selector, props) {
    const entries = Object.entries(props || {});
    if (!entries.length) return { css, changed: false, created: false };

    const indent = detectIndent(css);
    const rules = parseRules(css);
    // chi tim rule o muc cao nhat, khong chui vao @media de tranh sua nham
    const target = rules.find(r => !r.atRule && sameSelector(r.selector, selector));

    // ── Chua co rule: them moi vao cuoi file ──
    if (!target) {
      const lines = entries
        .filter(([, v]) => v !== null && v !== '')
        .map(([k, v]) => `${indent}${k}: ${v};`);
      if (!lines.length) return { css, changed: false, created: false };

      const sep = css.length && !css.endsWith('\n') ? '\n\n' : (css.length ? '\n' : '');
      return {
        css: css + sep + `${selector} {\n${lines.join('\n')}\n}\n`,
        changed: true,
        created: true
      };
    }

    // ── Da co rule: sua tai cho ──
    let body = target.body;
    for (const [prop, value] of entries) {
      const decls = parseDeclarations(body);
      const found = decls.find(d => d.prop.toLowerCase() === prop.toLowerCase());

      if (value === null || value === '') {
        if (found) {
          let cut = body.slice(found.end, found.end + 1) === ';' ? found.end + 1 : found.end;
          body = body.slice(0, found.start) + body.slice(cut);
        }
        continue;
      }

      if (found) {
        body = body.slice(0, found.start) + `${prop}: ${value}` + body.slice(found.end);
      } else {
        const trimmed = body.replace(/\s+$/, '');
        const needsSemi = trimmed.length && !trimmed.endsWith(';');
        const tail = body.slice(trimmed.length);           // giu nguyen xuong dong cuoi
        body = trimmed + (needsSemi ? ';' : '') + `\n${indent}${prop}: ${value};` + (tail || '\n');
      }
    }

    return {
      css: css.slice(0, target.bodyStart) + body + css.slice(target.bodyEnd),
      changed: body !== target.body,
      created: false
    };
  }

  /** Doc gia tri hien tai cua mot thuoc tinh trong mot selector (neu co) */
  function getProperty(css, selector, prop) {
    const rule = parseRules(css).find(r => !r.atRule && sameSelector(r.selector, selector));
    if (!rule) return null;
    const d = parseDeclarations(rule.body).find(x => x.prop.toLowerCase() === prop.toLowerCase());
    return d ? d.value : null;
  }

  /** Liet ke selector dang co, dung de goi y va de biet phan tu da co rule chua */
  function listSelectors(css) {
    return parseRules(css).filter(r => !r.atRule).map(r => r.selector);
  }

  return { parseRules, parseDeclarations, setProperties, getProperty, listSelectors };
})();

if (typeof window !== 'undefined') window.CssPatch = CssPatch;
if (typeof module !== 'undefined' && module.exports) module.exports = CssPatch;
