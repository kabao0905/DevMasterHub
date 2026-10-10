import { Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n';
import type { BaiDayDu } from '@/lib/curriculum';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuizBai } from './use-quiz-bai';

const SO_CAU = 4;
const chuCai = (i: number) => String.fromCharCode(65 + i);

export function QuizTab({ lesson, quizBai, aiEnabled }: { lesson: BaiDayDu; quizBai: QuizBai; aiEnabled: boolean | undefined }) {
  const { t, translateTitle } = useT();
  const { quiz, dangTao, loi, tao, chon, nop } = quizBai;

  if (dangTao) {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-card p-6 text-muted-foreground" aria-live="polite">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" /> {t('generatingQuiz')}
      </div>
    );
  }

  const baoLoi = loi && (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p>{t('quizFailed', { error: loi.message })}</p>
      <Button variant="outline" size="sm" onClick={tao}>{t('retry')}</Button>
    </div>
  );

  if (!quiz) {
    return (
      <div className="space-y-4">
        {baoLoi}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">{t('knowledgeCheck')}</h2>
          <p className="mt-1 text-muted-foreground">{t('quizIntro', { n: SO_CAU, title: translateTitle(lesson.title) })}</p>
          {aiEnabled === false
            ? <p className="mt-4 text-sm text-muted-foreground">{t('aiDisabled')}</p>
            : !loi && (
              <Button className="mt-5 bg-brand text-white hover:opacity-90" onClick={tao}>
                <Sparkles aria-hidden="true" /> {t('generateQuizAi')}
              </Button>
            )}
        </div>
      </div>
    );
  }

  const tong = quiz.questions.length;
  const daTraLoi = Object.keys(quiz.answers).length;
  const diem = quiz.questions.filter((q, i) => quiz.answers[i] === q.correct).length;
  const phanTram = Math.round((diem / tong) * 100);

  return (
    <div className="space-y-6">
      {baoLoi}
      {quiz.questions.map((q, i) => {
        const daChon = quiz.answers[i];
        const dung = daChon === q.correct;
        return (
          <fieldset key={i} className={cn('rounded-xl border bg-card p-5', quiz.submitted && (dung ? 'border-level-newbie/50' : 'border-destructive/50'))}>
            <legend className="px-1 text-sm font-medium text-muted-foreground">{t('quizQuestion', { n: i + 1 })}</legend>
            <div className="font-medium leading-relaxed"><ChatMarkdown text={q.question} /></div>
            {q.code && <CodeBlock code={q.code} lang={lesson.lang} className="mt-3" />}
            <div className="mt-4 space-y-2">
              {q.options.map((o, j) => {
                const laDapAnDung = quiz.submitted && j === q.correct;
                const chonSai = quiz.submitted && j === daChon && !dung;
                return (
                  <label key={j} className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    !quiz.submitted && 'hover:bg-accent/50',
                    !quiz.submitted && daChon === j && 'border-primary bg-primary/10',
                    laDapAnDung && 'border-level-newbie bg-level-newbie/10',
                    chonSai && 'border-destructive bg-destructive/10',
                    quiz.submitted && 'cursor-default'
                  )}>
                    <input type="radio" name={`cau-${i}`} className="sr-only" checked={daChon === j} disabled={quiz.submitted} onChange={() => chon(i, j)} />
                    <span className="font-mono text-sm font-semibold text-muted-foreground">{chuCai(j)}.</span>
                    <span className="min-w-0 flex-1"><ChatMarkdown text={o} /></span>
                  </label>
                );
              })}
            </div>
            {quiz.submitted && (
              <div className="mt-4 space-y-2 text-sm">
                <p className="font-medium">{t(dung ? 'answerCorrect' : 'answerWrong')}</p>
                <p className="text-muted-foreground"><span className="font-medium text-foreground">{t('explanation')}:</span> <span>{q.explanation}</span></p>
              </div>
            )}
          </fieldset>
        );
      })}

      {quiz.submitted ? (
        <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
          <div>
            <p className="text-2xl font-semibold tabular-nums">{t('quizScore', { score: diem, total: tong, pct: phanTram })}</p>
            <p className="text-muted-foreground">{t(phanTram >= 80 ? 'scoreExcellent' : phanTram >= 50 ? 'scoreGood' : 'scoreNeedsReview')}</p>
          </div>
          <Button variant="outline" onClick={tao}><RotateCcw aria-hidden="true" /> {t('newQuiz')}</Button>
        </div>
      ) : (
        <Button size="lg" className="bg-brand text-white hover:opacity-90" disabled={daTraLoi < tong} onClick={nop}>
          {t('submitQuizCount', { done: daTraLoi, total: tong })}
        </Button>
      )}
    </div>
  );
}
