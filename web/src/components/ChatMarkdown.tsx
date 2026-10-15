// Markdown toi gian cho tin nhan AI (ban React cua HtmlUtils.formatChatMarkdown):
// ```khoi code```, `code dong`, **dam**, *nghieng*, xuong dong. Sinh phan tu React, khong chen HTML,
// nen chu AI viet ra khong bao gio thanh the hay thuoc tinh that.
import type { ReactNode } from 'react';
import { CodeBlock } from '@/components/CodeBlock';
import { latexSangChu } from '@/lib/latex-sang-chu';

const KHOI = /```([\w+#.-]*)[^\n`]*\n?([\s\S]*?)```/g;
// Code dong HOAC chu dam (chu dam duoc chua code dong: AI hay viet **Hàm `print()`...** va ** `True` **).
// Chung mot regex quet trai sang phai: `x**2 + y**2` gap dau ` truoc nen la code, khong thanh chu dam.
const DONG_HOAC_DAM = /`([^`\n]+)`|\*\*(?: (?=`))?(?=\S)((?:`[^`\n]+`|[^*\n`])+?)(?<=\S)(?:(?<=`) )?\*\*/g;
// Dau * chi la nghieng khi dinh lien chu ben trong, nhu Markdown: "2 * 3 * 4" giu nguyen
const NGHIENG = /(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])/g;

type Bien = (s: string, k: string) => ReactNode[];

/** Cat chuoi theo `re`: doan khop qua `khop`, phan con lai qua buoc tiep theo `conLai` */
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
// LaTeX ($\rightarrow$, $O(n^2)$...) chi doi o chu thuong — trong code giu nguyen van
const chu: Bien = (s, k) => nghieng(latexSangChu(s), k);
const codeDong: Bien = (s, k) => tach(s, DONG_HOAC_DAM, (m, kk) => (m[1] !== undefined
  ? <code key={kk} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{m[1]}</code>
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
