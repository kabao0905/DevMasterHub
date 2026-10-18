import './prism-thiet-lap';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-zig';

const BI_DANH: Record<string, string> = {
  html: 'markup', xml: 'markup', svg: 'markup', dockerfile: 'docker', js: 'javascript', ts: 'typescript',
  sh: 'bash', shell: 'bash', cs: 'csharp', golang: 'go', py: 'python', yml: 'yaml'
};

export function tenNgonNgu(lang?: string): string {
  const l = (lang || '').toLowerCase();
  return Object.hasOwn(BI_DANH, l) ? BI_DANH[l] : l;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function toMauCode(code: string, lang?: string): string {
  const ten = tenNgonNgu(lang);
  const ngu = Object.hasOwn(Prism.languages, ten) ? Prism.languages[ten] : undefined;
  return ngu && typeof ngu === 'object' ? Prism.highlight(code, ngu, ten) : escapeHtml(code);
}
