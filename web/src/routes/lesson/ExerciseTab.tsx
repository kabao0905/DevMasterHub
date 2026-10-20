import { useMemo, useState, type ReactNode } from 'react';
import { CircleCheck, CircleX, Lightbulb, Loader2, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import { useT } from '@/lib/i18n';
import { khoaBai } from '@/lib/progress';
import { useDanhDauXong } from '@/lib/use-progress';
import type { NhanXet } from '@/lib/ai';
import { timLab } from '@/lib/lab';
import { escapeHtml } from '@/lib/highlight';
import { presetFor, PRESETS } from '@/lib/sandpack-doc';
import { seedFilesFromLesson, TECH_FRONTEND } from '@/lib/exercise-seed';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { useXacNhan } from '@/components/XacNhan';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { LabPanel } from '@/components/tools/LabPanel';
import { LiveIde } from '@/components/tools/LiveIde';
import { Terminal } from '@/components/tools/Terminal';
import { ChayThuJs } from '@/components/tools/ChayThuJs';
import { ChayCode } from '@/components/tools/ChayCode';
import { ngonNguChay } from '@/lib/chay-code';
import { useTerminal } from '@/components/tools/use-terminal';
import { cn } from '@/lib/utils';
import { CodeArea } from './CodeArea';
import { useDichNoiDung } from './use-dich-noi-dung';
import type { BaiTapBai } from './use-bai-tap';
import type { BaiDangMo } from './use-quiz-bai';

type Props = { bai: BaiDangMo; baiTap: BaiTapBai; aiEnabled: boolean | undefined };

export function ExerciseTab({ bai, baiTap, aiEnabled }: Props) {
  const danhDauXong = useDanhDauXong();
  const lab = timLab(khoaBai(bai.tech.id, bai.level.id, bai.lesson.id));
  if (lab) return <LabPanel lab={lab} onHoanThanh={() => danhDauXong(bai.tech.id, bai.level.id, bai.lesson.id)} />;
  if (bai.tech.id === 'cybersecurity') return <TerminalBaiHoc bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
  if (TECH_FRONTEND.includes(bai.tech.id)) return <IdeBaiHoc bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
  return <BaiTapSoan bai={bai} baiTap={baiTap} aiEnabled={aiEnabled} />;
}

function DeBaiGoc({ text }: { text?: string }) {
  const { t, lang } = useT();
  const html = useMemo(() => (text ? `<p>${escapeHtml(text)}</p>` : ''), [text]);
  const dich = useDichNoiDung(html, lang);
  if (!text) return <p className="text-muted-foreground">{t('noExerciseYet')}</p>;
  return <div className="noi-dung-bai whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: dich.html }} />;
}

function TerminalBaiHoc({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const kenh = useTerminal();
  return (
    <div className="space-y-4">
      <TheDeBai tieuDe={t('practiceTerminal')}>
        <DeBaiGoc text={bai.lesson.exercise} />
      </TheDeBai>
      <Terminal kenh={kenh} />
      <CodeArea id={ID_O_TRA_LOI} describedBy={ID_NHAC} value={baiTap.traLoi} onChange={baiTap.datTraLoi} label={t('terminalAnswerLabel')} />
      <NopChamAi baiTap={baiTap} aiEnabled={aiEnabled} baiLam={baiTap.traLoi} lang={bai.lesson.lang} idO={ID_O_TRA_LOI} />
    </div>
  );
}

function IdeBaiHoc({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const { tech, lesson } = bai;
  const playground = lesson.playground;
  const seed = useMemo(() => (playground ? null : seedFilesFromLesson(lesson, tech.id)), [playground, lesson, tech.id]);
  const macDinh = useMemo(() => {
    if (playground) return playground.files;
    const p = PRESETS[presetFor(tech.id)] ?? PRESETS.html;
    return { ...p.files, ...Object.fromEntries((seed ?? []).map(f => [f.name, f.code])) };
  }, [playground, seed, tech.id]);
  const tepDau = playground ? tepChinh(playground.files, tech.id) : seed?.[0]?.name;
  return (
    <div className="space-y-4">
      <TheDeBai tieuDe={t('practiceLive')}>
        <DeBaiGoc text={lesson.exercise} />
      </TheDeBai>
      <LiveIde techId={tech.id} files={baiTap.kho.files ?? macDinh} macDinh={macDinh} onFilesChange={baiTap.datFiles} tepDau={tepDau} libs={playground?.libs} />
      <NopChamAi baiTap={baiTap} aiEnabled={aiEnabled} baiLam={gopTep(baiTap.kho.files ?? macDinh)} lang={lesson.lang} />
    </div>
  );
}

function tepChinh(files: Record<string, string>, techId: string): string | undefined {
  const entry = PRESETS[presetFor(techId)]?.entry;
  if (techId !== 'htmlcss' && techId !== 'tailwind' && entry && entry in files) return entry;
  return 'index.html' in files ? 'index.html' : Object.keys(files)[0];
}

const ID_O_TRA_LOI = 'o-tra-loi-bai-tap';
const ID_NHAC = 'nhac-o-tra-loi';
const LOP_MAU = 'mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-code p-3 font-mono text-xs text-[#e6edf3]';

function TheDeBai({ tieuDe, children }: { tieuDe: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-card p-6 shadow-soft">
      <h2 className="mb-2 font-display text-xl font-extrabold tracking-tight">{tieuDe}</h2>
      {children}
    </div>
  );
}

function NutChamAi({ dangCham, onCham }: { dangCham: boolean; onCham: () => void }) {
  const { t } = useT();
  return (
    <Button className="rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" onClick={onCham} disabled={dangCham}>
      {dangCham ? <><Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> {t('grading')}</> : <><Sparkles aria-hidden="true" /> {t('gradeWithAi')}</>}
    </Button>
  );
}

function NhacTrong({ id, hien }: { id?: string; hien: boolean }) {
  const { t } = useT();
  return <p id={id} role="alert" className="text-sm font-medium text-destructive empty:hidden">{hien ? t('emptyInputHint') : ''}</p>;
}

function BaoLoi({ children }: { children: ReactNode }) {
  return <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-sm break-words text-destructive">{children}</p>;
}

const gopTep = (files: Record<string, string>) => Object.entries(files).map(([ten, code]) => `--- ${ten} ---\n${code}`).join('\n');

function NopChamAi({ baiTap, aiEnabled, baiLam, lang, idO }: { baiTap: BaiTapBai; aiEnabled: boolean | undefined; baiLam: string; lang?: string; idO?: string }) {
  const { t } = useT();
  const [nhacTrong, datNhacTrong] = useState(false);
  if (aiEnabled === false) return null;
  function bamCham() {
    if (!baiLam.trim()) {
      datNhacTrong(true);
      if (idO) document.getElementById(idO)?.focus();
      return;
    }
    datNhacTrong(false);
    baiTap.cham(baiLam);
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <NutChamAi dangCham={baiTap.dangCham} onCham={bamCham} />
        <NhacTrong id={idO ? ID_NHAC : undefined} hien={nhacTrong && !baiLam.trim()} />
      </div>
      {baiTap.loiCham && <BaoLoi>{t('gradeFailed', { error: baiTap.loiCham.message })}</BaoLoi>}
      {baiTap.nhanXet && <KetQuaCham nhanXet={baiTap.nhanXet} lang={lang} />}
    </div>
  );
}

function BaiTapSoan({ bai, baiTap, aiEnabled }: Props) {
  const { t } = useT();
  const [hoi, hopXacNhan] = useXacNhan();
  const [nhacTrong, datNhacTrong] = useState(false);
  const { kho, deHienTai, traLoi, nhanXet, coSan, soCoSan, deCoSan } = baiTap;
  const idx = kho.activeExIdx;
  const laJs = /^(javascript|js)$/i.test(bai.lesson.lang || '');
  const nhieuCoSan = coSan.length > 1;

  const nut = (j: number, nhan: string) => (
    <Button key={j} size="sm" variant="outline" aria-pressed={idx === j} onClick={() => baiTap.chon(j)}
      className={cn('rounded-full', idx === j && 'border-transparent bg-lavender text-lavender-ink hover:bg-lavender hover:text-lavender-ink')}>{nhan}</Button>
  );
  const nutAi = (i: number) => {
    const loai = kho.aiExercises[i].loai;
    const thuTu = kho.aiExercises.slice(0, i + 1).filter(x => x.loai === loai).length;
    return nut(soCoSan + i, loai ? `${loai} · ${t('aiExerciseTab', { n: thuTu })}` : t('aiExerciseTab', { n: thuTu }));
  };
  const chiSoAi = kho.aiExercises.map((_, i) => i);
  const loaiCoSan = new Set(coSan.map(bt => bt.title));

  function bamCham() {
    if (!traLoi.trim()) {
      datNhacTrong(true);
      document.getElementById(ID_O_TRA_LOI)?.focus();
      return;
    }
    datNhacTrong(false);
    baiTap.cham();
  }

  async function xoaBaiLam() {
    if (!(await hoi(t('clearAnswerConfirm'), t('delete')))) return;
    baiTap.xoaTraLoi();
  }

  return (
    <div className="space-y-5">
      {(nhieuCoSan || kho.aiExercises.length > 0) && (
        <div role="group" className="flex flex-wrap gap-2" aria-label={t('tabLabelExercise')}>
          {nhieuCoSan ? (
            <>
              {coSan.flatMap((bt, j) => [nut(j, bt.title), ...chiSoAi.filter(i => kho.aiExercises[i].loai === bt.title).map(nutAi)])}
              {chiSoAi.filter(i => !loaiCoSan.has(kho.aiExercises[i].loai ?? '')).map(nutAi)}
            </>
          ) : (
            <>
              {nut(0, t('originalExercise'))}
              {chiSoAi.map(nutAi)}
            </>
          )}
        </div>
      )}

      <div className="rounded-3xl bg-card p-6 shadow-soft">
        {deHienTai ? (
          <div className="space-y-3">
            <h2 className="font-display text-xl font-extrabold tracking-tight break-words">{deHienTai.title}</h2>
            <div className="leading-relaxed"><ChatMarkdown text={deHienTai.description} /></div>
            {deHienTai.sampleInput && (
              <div><p className="text-xs font-semibold text-muted-foreground">{t('sampleInputLabel')}</p><pre translate="no" className={LOP_MAU}>{deHienTai.sampleInput}</pre></div>
            )}
            {deHienTai.expectedOutput && (
              <div><p className="text-xs font-semibold text-muted-foreground">{t('expectedOutputLabel')}</p><pre translate="no" className={LOP_MAU}>{deHienTai.expectedOutput}</pre></div>
            )}
          </div>
        ) : deCoSan && coSan.length > 1 ? (
          <div className="space-y-3">
            <h2 className="font-display text-xl font-extrabold tracking-tight break-words">{deCoSan.title}</h2>
            <DeBaiGoc text={deCoSan.description} />
          </div>
        ) : (
          <DeBaiGoc text={deCoSan?.description ?? bai.lesson.exercise} />
        )}
      </div>

      {deHienTai && (deHienTai.hints.length > 0 || deHienTai.solution) && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {deHienTai.hints.length > 0 && (
              <Button variant="outline" size="sm" className="rounded-full" aria-expanded={!!kho.hienGoiY[idx]} onClick={baiTap.doiGoiY}>
                <Lightbulb aria-hidden="true" />
                {kho.hienGoiY[idx] ? t('hideHints') : `${t('showHintsBtn')} (${deHienTai.hints.length})`}
              </Button>
            )}
            {deHienTai.solution && (
              <Button variant="outline" size="sm" className="rounded-full" aria-expanded={!!kho.hienLoiGiai[idx]} onClick={baiTap.doiLoiGiai}>{kho.hienLoiGiai[idx] ? t('hideSolution') : t('showSolutionBtn')}</Button>
            )}
          </div>
          {kho.hienGoiY[idx] && (
            <ul className="space-y-1.5 rounded-3xl bg-butter p-5 text-sm text-foreground">
              {deHienTai.hints.map(h => <li key={h} className="flex gap-2"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-butter-ink" aria-hidden="true" /><span className="min-w-0 break-words"><ChatMarkdown text={h} /></span></li>)}
            </ul>
          )}
          {kho.hienLoiGiai[idx] && deHienTai.solution && <CodeBlock code={deHienTai.solution} lang={deHienTai.solutionLang || bai.lesson.lang} />}
        </div>
      )}

      {deCoSan?.starter && !deHienTai && !traLoi.trim() && (
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => baiTap.datTraLoi(deCoSan.starter!)}>{t('useStarterCode')}</Button>
      )}
      <div className="space-y-2">
        <CodeArea id={ID_O_TRA_LOI} describedBy={ID_NHAC} value={traLoi} onChange={baiTap.datTraLoi} label={t('answerPlaceholder')} />
        <NhacTrong id={ID_NHAC} hien={nhacTrong && !traLoi.trim()} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {aiEnabled !== false && <NutChamAi dangCham={baiTap.dangCham} onCham={bamCham} />}
        <Button variant="ghost" className="rounded-full" onClick={() => { void xoaBaiLam(); }} disabled={!traLoi}>
          <Trash2 aria-hidden="true" /> {t('clearAnswer')}
        </Button>
        {aiEnabled !== false && (
          <Button variant="outline" className="ml-auto rounded-full" onClick={baiTap.taoMoi} disabled={baiTap.dangTao}>
            {baiTap.dangTao ? <><Loader2 className="motion-safe:animate-spin" aria-hidden="true" /> {t('generatingExercise')}</> : <><Sparkles aria-hidden="true" /> {t('newAiExercise')}</>}
          </Button>
        )}
      </div>
      {laJs && <ChayThuJs code={traLoi} nhan={t('runCode')} idO={ID_O_TRA_LOI} />}
      {ngonNguChay(bai.lesson.lang) && <ChayCode key={idx} lang={bai.lesson.lang ?? ''} code={traLoi} stdinMacDinh={deHienTai?.sampleInput} idO={ID_O_TRA_LOI} />}

      {baiTap.loiTao && <BaoLoi>{t('exerciseFailed', { error: baiTap.loiTao.message })}</BaoLoi>}
      {baiTap.loiCham && <BaoLoi>{t('gradeFailed', { error: baiTap.loiCham.message })}</BaoLoi>}

      {nhanXet && <KetQuaCham nhanXet={nhanXet} lang={bai.lesson.lang} />}
      {hopXacNhan}
    </div>
  );
}

function KetQuaCham({ nhanXet, lang }: { nhanXet: NhanXet; lang?: string }) {
  const { t } = useT();
  return (
    <section aria-label={t('scoreOutOf', { score: nhanXet.score })} className={cn('space-y-3 rounded-3xl p-6 text-foreground',
      nhanXet.status === 'correct' ? 'bg-mint' : nhanXet.status === 'partial' ? 'bg-butter' : 'bg-destructive/10')}>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl font-extrabold tracking-tight tabular-nums">{t('scoreOutOf', { score: nhanXet.score })}</p>
        <p className={cn('inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold',
          nhanXet.status === 'correct' ? 'text-mint-ink' : nhanXet.status === 'partial' ? 'text-butter-ink' : 'text-destructive')}>
          {nhanXet.status === 'correct' ? <CircleCheck className="size-4" aria-hidden="true" />
            : nhanXet.status === 'partial' ? <TriangleAlert className="size-4" aria-hidden="true" />
            : <CircleX className="size-4" aria-hidden="true" />}
          {t(nhanXet.status === 'correct' ? 'answerCorrect' : nhanXet.status === 'partial' ? 'answerPartial' : 'answerWrong')}
        </p>
      </div>
      {nhanXet.feedback && <div className="leading-relaxed"><ChatMarkdown text={nhanXet.feedback} /></div>}
      {nhanXet.errors.length > 0 && (
        <div><p className="text-sm font-medium">{t('errorsLabel')}</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{nhanXet.errors.map(x => <li key={x}><ChatMarkdown text={x} /></li>)}</ul></div>
      )}
      {nhanXet.suggestions.length > 0 && (
        <div><p className="text-sm font-medium">{t('suggestionsLabel')}</p><ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{nhanXet.suggestions.map(x => <li key={x}><ChatMarkdown text={x} /></li>)}</ul></div>
      )}
      {nhanXet.correctedCode && (
        <div className="space-y-1"><p className="text-sm font-medium">{t('correctedCodeLabel')}</p><CodeBlock code={nhanXet.correctedCode} lang={lang} /></div>
      )}
    </section>
  );
}
