import { SquareTerminal } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { BaiDayDu } from '@/lib/curriculum';
import { CodeBlock } from '@/components/CodeBlock';
import { ChayCpp } from '@/components/tools/ChayCpp';
import { laCpp } from '@/lib/chay-cpp';

export function CodeTab({ lesson }: { lesson: BaiDayDu }) {
  const { t } = useT();
  if (!lesson.code) return <p className="text-muted-foreground">{t('noCodeExample')}</p>;
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{t('codeExample')}</h2>
      <CodeBlock code={lesson.code} lang={lesson.lang || 'javascript'} />
      {/* Ket qua that khi chay code mau: nguoi hoc doi chieu tung dong code voi dong in ra */}
      {lesson.output && (
        <section aria-labelledby="ket-qua-code" className="overflow-hidden rounded-xl border border-level-newbie/30 bg-code">
          <h3 id="ket-qua-code" className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs font-medium text-level-newbie">
            <SquareTerminal className="size-3.5" aria-hidden="true" /> {t('codeOutputTitle')}
          </h3>
          <pre className="max-h-80 overflow-auto px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre-wrap text-[#e6edf3]">{lesson.output}</pre>
        </section>
      )}
      {/* Bai C++: chay thu code mau ngay trong trang (qua may chu bien dich) */}
      {laCpp(lesson.lang) && <ChayCpp code={lesson.code} />}
    </div>
  );
}
