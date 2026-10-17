// O soan code cho cau tra loi bai tap (chep hanh vi enhanceCodeEditor cua app cu):
// Tab/Shift+Tab thut le, tu dong dong ngoac va dau nhay, Enter giu thut le, Backspace xoa ca cap ngoac rong.
import { type KeyboardEvent } from 'react';

const CAP: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
const DONG = new Set([')', ']', '}']);

/** Chen chu tai con tro: uu tien execCommand de trinh duyet giu lich su Hoan tac (Ctrl+Z) */
function chen(el: HTMLTextAreaElement, text: string) {
  el.focus();
  const ok = typeof document.execCommand === 'function' && document.execCommand('insertText', false, text);
  if (!ok) {
    el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function thayGiaTri(el: HTMLTextAreaElement, giaTri: string, conTro: number, cuoi = conTro) {
  el.setRangeText(giaTri, 0, el.value.length, 'preserve');
  el.selectionStart = conTro;
  el.selectionEnd = cuoi;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

/** id: de nut Cham / Chay dua con tro ve o khi o con trong; describedBy: dong nhac ngay duoi o */
type Props = { value: string; onChange: (v: string) => void; label: string; className?: string; id?: string; describedBy?: string };

export function CodeArea({ value, onChange, label, className, id, describedBy }: Props) {
  function khiGo(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const el = e.currentTarget;
    const { selectionStart: a, selectionEnd: b, value: v } = el;
    const chon = v.slice(a, b);

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const dauDong = v.lastIndexOf('\n', a - 1) + 1;
        const dong = v.slice(dauDong, b);
        const bo = dong.replace(/^ {1,2}/, '');
        thayGiaTri(el, v.slice(0, dauDong) + bo + v.slice(b), Math.max(dauDong, a - (dong.length - bo.length)));
      } else {
        chen(el, '  ');
      }
      return;
    }

    if (Object.hasOwn(CAP, e.key) && !e.ctrlKey && !e.metaKey) {
      const mo = e.key;
      const dong = CAP[mo];
      e.preventDefault();
      if (chon) {
        thayGiaTri(el, v.slice(0, a) + mo + chon + dong + v.slice(b), a + 1, b + 1);
      } else if ((mo === '"' || mo === "'" || mo === '`') && v[a] === mo) {
        el.selectionStart = el.selectionEnd = a + 1;
      } else {
        chen(el, mo + dong);
        el.selectionStart = el.selectionEnd = a + 1;
      }
      return;
    }

    if (DONG.has(e.key) && v[a] === e.key && a === b) {
      e.preventDefault();
      el.selectionStart = el.selectionEnd = a + 1;
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const dauDong = v.lastIndexOf('\n', a - 1) + 1;
      const thut = /^(\s*)/.exec(v.slice(dauDong, a))?.[1] ?? '';
      const truoc = v[a - 1];
      const sau = v[a];
      if ((truoc === '{' && sau === '}') || (truoc === '(' && sau === ')')) {
        chen(el, '\n' + thut + '  \n' + thut);
        el.selectionStart = el.selectionEnd = a + 1 + thut.length + 2;
      } else if (truoc === '{' || truoc === ':') {
        chen(el, '\n' + thut + '  ');
      } else {
        chen(el, '\n' + thut);
      }
      return;
    }

    if (e.key === 'Backspace' && a === b && a > 0 && Object.hasOwn(CAP, v[a - 1]) && CAP[v[a - 1]] === v[a]) {
      e.preventDefault();
      thayGiaTri(el, v.slice(0, a - 1) + v.slice(a + 1), a - 1);
    }
  }

  // Mat code luon toi: khung bo goc lon, bong mem; chu goi y xam sang de doc duoc tren nen toi
  return (
    <textarea
      id={id}
      aria-describedby={describedBy}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={khiGo}
      aria-label={label}
      placeholder={label}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      translate="no"
      className={className ?? 'min-h-48 w-full resize-y rounded-2xl bg-code p-4 font-mono text-[13px] leading-6 text-[#e6edf3] shadow-soft outline-none placeholder:text-[#8b949e] focus-visible:ring-2 focus-visible:ring-ring'}
    />
  );
}
