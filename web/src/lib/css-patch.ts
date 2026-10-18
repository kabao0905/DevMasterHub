// @ts-nocheck
export type QuyTacCss = { selector: string; body: string; atRule: boolean; start: number; end: number; bodyStart: number; bodyEnd: number };
export type KhaiBaoCss = { prop: string; value: string } & Record<string, unknown>;


export function parseRules(css: string): QuyTacCss[] {
  const rules = [];
  let i = 0;
  const n = css.length;

  while (i < n) {
    while (i < n && /\s/.test(css[i])) i++;
    if (i >= n) break;

    if (css[i] === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }

    const start = i;

    let depth = 0;
    let bodyStart = -1;
    while (i < n) {
      if (css[i] === '{') { bodyStart = i; break; }
      if (css[i] === ';' && depth === 0) { break; }
      i++;
    }

    if (bodyStart === -1) {
      while (i < n && css[i] !== ';') i++;
      i++;
      continue;
    }

    const selector = css.slice(start, bodyStart).trim();

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

    const bodyEnd = j - 1;
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

export function parseDeclarations(body: string): KhaiBaoCss[] {
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

function sameSelector(a, b) {
  const norm = s => String(s).replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').trim().toLowerCase();
  return norm(a) === norm(b);
}

function detectIndent(css) {
  const m = css.match(/\n([ \t]+)[a-zA-Z-]+\s*:/);
  return m ? m[1] : '  ';
}

export function setProperties(css: string, selector: string, props: Record<string, string | null | undefined>): { css: string; changed: boolean; created: boolean } {
  const entries = Object.entries(props || {});
  if (!entries.length) return { css, changed: false, created: false };

  const indent = detectIndent(css);
  const rules = parseRules(css);
  const target = rules.find(r => !r.atRule && sameSelector(r.selector, selector));

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
      const tail = body.slice(trimmed.length);
      body = trimmed + (needsSemi ? ';' : '') + `\n${indent}${prop}: ${value};` + (tail || '\n');
    }
  }

  return {
    css: css.slice(0, target.bodyStart) + body + css.slice(target.bodyEnd),
    changed: body !== target.body,
    created: false
  };
}

export function getProperty(css: string, selector: string, prop: string): string | null {
  const rule = parseRules(css).find(r => !r.atRule && sameSelector(r.selector, selector));
  if (!rule) return null;
  const d = parseDeclarations(rule.body).find(x => x.prop.toLowerCase() === prop.toLowerCase());
  return d ? d.value : null;
}

export function listSelectors(css: string): string[] {
  return parseRules(css).filter(r => !r.atRule).map(r => r.selector);
}

