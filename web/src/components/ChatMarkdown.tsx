import type { ReactNode } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { latexSangChu } from '@/lib/latex-sang-chu';

const KHOI = /```([\w+#.-]*)[^\n`]*\n?([\s\S]*?)```/g;
const DONG_HOAC_DAM = /`([^`\n]+)`|\*\*(?: (?=`))?(?=\S)((?:`[^`\n]+`|[^*\n`])+?)(?<=\S)(?:(?<=`) )?\*\*/g;
const NGHIENG = /(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])/g;

type Bien = (s: string, k: string) => ReactNode[];

function tach(s: string, re: RegExp, khop: (m: RegExpMatchArray, k: string) => ReactNode, conLai: Bien, k: string): ReactNode[] {
  const ra: ReactNode[] = [];
  let i = 0;
  for (const m of s.matchAll(re)) {
    const vt = m.index ?? 0;
    if (vt > i) ra.push(...conLai(s.slice(i, vt), `${k}-${i}`));
    ra.push(khop(m, `${k}-m${vt}`));
    i = vt + m[0].length;
  }
  if (i < s.length) ra.push(...conLai(s.slice(i), `${k}-${i}`));
  return ra;
}

const xuongDong: Bien = (s, k) => s.split('\n').flatMap((dong, j) => (j ? [<br key={`${k}-br${j}`} />, dong] : [dong]));
const nghieng: Bien = (s, k) => tach(s, NGHIENG, (m, kk) => <em key={kk}>{m[1]}</em>, xuongDong, k);
const chu: Bien = (s, k) => nghieng(latexSangChu(s), k);
const codeDong: Bien = (s, k) => tach(s, DONG_HOAC_DAM, (m, kk) => (m[1] !== undefined
  ? <code key={kk} translate="no" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{m[1]}</code>
  : <strong key={kk}>{codeDong(m[2], kk)}</strong>
), chu, k);

export function ChatMarkdown({ text }: { text: string }) {
  const s = text.replace(/\u0000/g, '');
  return (
    <>
      {tach(s, KHOI, (m, k) => (
        <CodeBlock key={k} code={m[2].replace(/^\n+|\s+$/g, '')} lang={m[1] || undefined} className="my-2" />
      ), codeDong, 'md')}
    </>
  );
}
