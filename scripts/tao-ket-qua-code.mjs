import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const THU_MUC = 'data/curriculum';
const THOI_GIAN_TOI_DA = 10_000;
const DO_DAI_TOI_DA = 2000;
const EXE = process.platform === 'win32' ? '.exe' : '';
const CHAY_DUOC = new Set(['python', 'javascript', 'typescript', 'cpp', 'c', 'go', 'rust', 'java']);

const KHONG_CHAY_DUOC = /\b(document|window|localStorage|navigator)\.|from ['"]react|require\(['"](express|react|axios)|app\.listen|createServer|\bfetch\(|import (React|express|axios)|requests\.|urllib|socket\.|flask|django|tkinter/;
const PHU_THUOC_MAY = /process\.(version|versions|platform|arch|argv|pid|cwd|env)\b|\bos\.(cpus|platform|hostname|totalmem|freemem|homedir|arch)\b|__dirname|__filename|sys\.(version|platform|argv)|platform\.|os\.getcwd|getpid/;

function cachChay(lang, code, dir) {
  const tep = ten => { const p = join(dir, ten); writeFileSync(p, code); return p; };
  const a = join(dir, 'a' + EXE);
  switch (lang) {
    case 'python': return [['python', ['-X', 'utf8', tep('main.py')]]];
    case 'javascript': return [['node', [tep(/^\s*(import|export)\s/m.test(code) ? 'main.mjs' : 'main.js')]]];
    case 'typescript': return [['node', [tep('main.ts')]]];
    case 'cpp': return [['g++', ['-std=c++20', tep('main.cpp'), '-o', a]], [a, []]];
    case 'c': return [['gcc', [tep('main.c'), '-o', a]], [a, []]];
    case 'go': return [['go', ['run', tep('main.go')]]];
    case 'rust': return [['rustc', ['--edition', '2021', tep('main.rs'), '-o', a]], [a, []]];
    case 'java': {
      const lop = code.match(/public\s+(?:final\s+)?class\s+(\w+)/)?.[1];
      if (!lop) return null;
      return [['javac', ['-encoding', 'UTF-8', tep(`${lop}.java`)]], ['java', ['-Dfile.encoding=UTF-8', '-cp', dir, lop]]];
    }
    default: return null;
  }
}

function chayMotLan(lang, code) {
  const dir = mkdtempSync(join(tmpdir(), 'dmh-ketqua-'));
  try {
    const buoc = cachChay(lang, code, dir);
    if (!buoc) return null;
    let ra = '';
    for (const [lenh, args] of buoc) {
      ra = execFileSync(lenh, args, {
        cwd: dir, input: '', timeout: THOI_GIAN_TOI_DA, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONIOENCODING: 'utf-8', NO_COLOR: '1', FORCE_COLOR: '0' }, windowsHide: true
      });
    }
    return ra.replace(/\r\n/g, '\n').replace(/\s+$/, '');
  } catch {
    return null;
  } finally {
    try { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
  }
}

function ketQuaTinDuoc(lang, code) {
  if (KHONG_CHAY_DUOC.test(code) || PHU_THUOC_MAY.test(code)) return null;
  const a = chayMotLan(lang, code);
  if (!a || a.length > DO_DAI_TOI_DA) return null;
  const b = chayMotLan(lang, code);
  return a === b ? a : null;
}

const chon = process.argv.slice(2);
const tepDs = readdirSync(THU_MUC).filter(f => f.endsWith('.json') && f !== 'index.json' && (!chon.length || chon.includes(f.replace('.json', ''))));
const thongKe = { co: 0, khong: 0 };
for (const f of tepDs) {
  const duong = join(THU_MUC, f);
  const goc = readFileSync(duong, 'utf8');
  const d = JSON.parse(goc);
  let doi = false;
  for (const lv of d.levels ?? []) {
    for (const b of lv.lessons ?? []) {
      const lang = b.lang || d.lang;
      if (!b.code || !CHAY_DUOC.has(lang)) continue;
      const kq = ketQuaTinDuoc(lang, b.code);
      if (kq) { thongKe.co++; if (b.output !== kq) { b.output = kq; doi = true; } }
      else { thongKe.khong++; if ('output' in b) { delete b.output; doi = true; } }
      console.log(`${kq ? '✓' : '·'} ${f.replace('.json', '')}/${lv.id}/${b.id} (${lang})`);
    }
  }
  if (doi) writeFileSync(duong, JSON.stringify(d, null, 2) + (goc.endsWith('\n') ? '\n' : ''));
}
console.log(`\n${thongKe.co} bai co ket qua, ${thongKe.khong} bai khong chay duoc / khong on dinh (bo qua).`);
