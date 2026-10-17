// AI Career Advisor: chat tu van nghe nghiep theo ho so hoc that, tu tim viec va danh gia do phu hop.
import { useXacNhan } from '@/components/XacNhan';
import { memo, useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { Banknote, Briefcase, Building2, ChevronDown, Clock, Globe, Lightbulb, MapPin, Pencil, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { usePageMeta } from '@/lib/page-meta';
import { baoDaHoiAi } from '@/lib/dong-ho-hoc';
import { useKho } from '@/lib/use-kho';
import { useCurriculumIndex } from '@/lib/use-curriculum';
import type { TinNhan } from '@/lib/ai';
import { taoCoVan, type CoVan, type ViecLam } from '@/lib/career';
import { luuChat, taiChat, taiThongKe } from '@/lib/career-db';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type KhoCareer = {
  chat: TinNhan[]; jobs: ViecLam[]; keyword: string; moViec: boolean; nhap: string;
  dangGui?: boolean; loi?: string;
  /** Da tai lich su tu server (moi duoc ghi len server, tranh ghi de lich su chua tai) */
  daNap?: boolean;
  /** Tai lich su loi: van chat duoc trong phien nhung khong ghi len server */
  loiNap?: boolean;
  /** Tang khi sua cau hoi / tra loi lai / xoa chat: tra loi cu ve muon thi bo */
  phien?: number;
};
const RONG: KhoCareer = { chat: [], jobs: [], keyword: '', moViec: false, nhap: '' };
const loiChu = (e: unknown) => (e instanceof Error ? e.message : String(e));
const CHIP = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
const NUT_TIN = 'h-7 rounded-full text-xs text-peach-ink hover:bg-card/70 hover:text-peach-ink';

/**
 * Cac tin da gui. memo: mang chat giu nguyen tham chieu khi go o nhap, nen khong dung lai
 * markdown + khoi code cua ca cuoc tro chuyen moi phim (onSua / onTraLoiLai on dinh)
 */
const CacTin = memo(function CacTin({ chat, onSua, onTraLoiLai }: {
  chat: TinNhan[]; onSua: (i: number) => void; onTraLoiLai: (i: number) => void;
}) {
  const { t } = useT();
  return chat.map((m, i) => (
    <li key={i} className={cn('flex flex-col gap-1', m.role === 'user' ? 'items-end' : 'items-start')}>
      <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
        m.role === 'user' ? 'whitespace-pre-wrap break-words bg-lavender text-foreground [overflow-wrap:anywhere]' : 'min-w-0 bg-card text-foreground shadow-soft')}>
        {m.role === 'user' ? m.content : <ChatMarkdown text={m.content} />}
      </div>
      {m.role === 'user'
        ? <Button variant="ghost" size="sm" className={NUT_TIN} onClick={() => onSua(i)}><Pencil aria-hidden="true" /> {t('editQuestion')}</Button>
        : <Button variant="ghost" size="sm" className={NUT_TIN} onClick={() => onTraLoiLai(i)}><RefreshCw aria-hidden="true" /> {t('regenerateAnswer')}</Button>}
    </li>
  ));
});

export function CareerPage() {
  const { t, lang } = useT();
  const { client, user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const khoa = useMemo<QueryKey>(() => ['career', uid], [uid]);
  const { kho, dat, doc } = useKho<KhoCareer>(khoa, RONG);
  const { data: congNghe = [] } = useCurriculumIndex();
  const tenCongNghe = useMemo(() => Object.fromEntries(congNghe.map(c => [c.id, c.name])), [congNghe]);
  const cvRef = useRef<CoVan | null>(null);
  const [hoi, hopXacNhan] = useXacNhan();
  const oNhapRef = useRef<HTMLTextAreaElement>(null);
  const dsRef = useRef<HTMLOListElement>(null);
  const [moTim, datMoTim] = useState(false);
  const [tuKhoaTim, datTuKhoaTim] = useState('');
  // Cau dang go giu o day (khong ghi kho moi phim, khong ve lai ca trang); roi trang thi ghi vao kho
  const [nhap, datNhap] = useState(() => doc(khoa).nhap);
  const [nhacRong, datNhacRong] = useState(false);
  const nhapRef = useRef(nhap);
  useEffect(() => { nhapRef.current = nhap; }, [nhap]);
  useEffect(() => () => dat(khoa, x => ({ ...x, nhap: nhapRef.current })), [khoa]); // eslint-disable-line react-hooks/exhaustive-deps
  usePageMeta({ title: `${t('careerTitle')} | DevMaster Hub`, description: t('careerSubtitle') });

  // Lan dau mo trang trong phien: nap lich su chat da luu (chi khi chua co gi)
  useEffect(() => {
    if (!uid || doc(khoa).daNap) return;
    taiChat(client, uid)
      // Tin vua chat khi lan tai truoc bi loi chua tung duoc luu: ghep sau lich su that
      .then(ds => dat(khoa, x => (x.daNap ? x : { ...x, daNap: true, loiNap: false, chat: [...ds, ...x.chat] })))
      .catch(() => dat(khoa, x => ({ ...x, loiNap: true })));
  }, [uid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = dsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [kho.chat.length, kho.dangGui]);

  const luu = (k: QueryKey, chat: TinNhan[]) => {
    // Chua tai duoc lich su (hoac da dang xuat: kho bi xoa) thi khong ghi — ghi la xoa mat lich su that
    if (!uid || !doc(k).daNap) return;
    luuChat(client, uid, chat).catch((e: unknown) => toast.error(t('careerChatSaveFailed', { error: loiChu(e) })));
  };

  async function coVanMoi(): Promise<CoVan> {
    // Ho so hoc tap moi nhat (ban cu tinh lai moi lan gui); loi thi tu van nhu nguoi moi
    const thongKe = uid
      ? await qc.fetchQuery({ queryKey: ['careerStats', uid], queryFn: () => taiThongKe(client, uid), staleTime: 60_000 }).catch(() => null)
      : null;
    const cv = taoCoVan(client, { t, lang, thongKe, tenCongNghe });
    cvRef.current = cv;
    return cv;
  }

  /** Hoi AI voi lich su `truoc` + cau `tin` (tin nguoi hoc da nam cuoi chat) */
  async function chay(k: QueryKey, truoc: TinNhan[], tin: string, xoaViecNeuRong: boolean) {
    dat(k, x => ({ ...x, dangGui: true, loi: undefined }));
    baoDaHoiAi();
    const phien = doc(k).phien;
    try {
      const kq = await (await coVanMoi()).gui(truoc, tin);
      if (!kq || doc(k).phien !== phien) return;
      // Tin co link doc duoc: bao da doc trang / bao nhieu viec. Khong doc duoc thi cau tra loi trong chat da noi, khong bao loi them
      if (kq.link?.ok && kq.link.soTrang) toast.success(t('careerListRead', { pages: kq.link.soTrang, jobs: kq.link.tongViec ?? 0 }));
      else if (kq.link?.ok) toast.success(t('careerLinkRead', { title: kq.link.title || kq.link.url }));
      let chat: TinNhan[] = [];
      dat(k, x => {
        chat = [...x.chat, { role: 'assistant', content: kq.text }];
        const jobs = kq.jobs && kq.jobs.length > 0 ? kq.jobs : kq.searchKeyword && xoaViecNeuRong ? [] : x.jobs;
        return { ...x, chat, dangGui: false, jobs, keyword: kq.searchKeyword || x.keyword };
      });
      luu(k, chat);
    } catch (e) {
      if (doc(k).phien === phien) dat(k, x => ({ ...x, dangGui: false, loi: loiChu(e) }));
    }
  }

  function gui() {
    const s = doc(khoa);
    if (s.dangGui || !(s.daNap || s.loiNap)) return;
    const tin = nhap.trim();
    if (!tin) {
      // O trong: nhac ngay duoi o, dua con tro ve o nhap
      datNhacRong(true);
      oNhapRef.current?.focus();
      return;
    }
    dat(khoa, x => ({ ...x, chat: [...x.chat, { role: 'user', content: tin }], nhap: '' }));
    datNhap('');
    void chay(khoa, s.chat, tin, true);
  }

  function guiLai() {
    const s = doc(khoa);
    const cuoi = s.chat.at(-1);
    if (s.dangGui || cuoi?.role !== 'user') return;
    void chay(khoa, s.chat.slice(0, -1), cuoi.content, true);
  }

  /** Dung cau tra loi dang cho, bat dau phien moi */
  const dungLai = (x: KhoCareer): KhoCareer => ({ ...x, dangGui: false, loi: undefined, phien: (x.phien ?? 0) + 1 });

  /** Sua cau hoi: xoa cau nay va moi tin sau no; con tin phia sau thi hoi truoc */
  async function suaCauHoi(i: number) {
    const truoc = doc(khoa);
    if (!truoc.chat[i]) return;
    if (i < truoc.chat.length - 1 && !(await hoi(t('careerEditConfirm')))) return;
    cvRef.current?.huy();
    const s = doc(khoa);
    const cau = s.chat[i];
    if (!cau) return;
    const chat = s.chat.slice(0, i);
    dat(khoa, x => ({ ...dungLai(x), chat, nhap: cau.content }));
    datNhap(cau.content);
    datNhacRong(false);
    luu(khoa, chat);
    setTimeout(() => {
      const o = oNhapRef.current;
      if (o) { o.focus(); o.setSelectionRange(o.value.length, o.value.length); }
    }, 0);
  }

  /** Tra loi lai: bo cau tra loi nay va moi tin sau no; con tin phia sau thi hoi truoc */
  async function traLoiLai(i: number) {
    if (i < doc(khoa).chat.length - 1 && !(await hoi(t('careerRegenerateConfirm')))) return;
    cvRef.current?.huy();
    const s = doc(khoa);
    let j = i - 1;
    while (j >= 0 && s.chat[j].role !== 'user') j--;
    if (j < 0) return;
    const chat = s.chat.slice(0, j + 1);
    dat(khoa, x => ({ ...dungLai(x), chat }));
    void chay(khoa, chat.slice(0, -1), chat[j].content, false);
  }

  async function xoaChat() {
    if (!(await hoi(t('clearCareerChatConfirm'), t('clearChat')))) return;
    cvRef.current?.huy();
    dat(khoa, x => ({ ...dungLai(x), ...RONG, daNap: true, phien: (x.phien ?? 0) + 1 }));
    datNhap('');
    luu(khoa, []);
  }

  async function timTay(e: FormEvent) {
    e.preventDefault();
    const q = tuKhoaTim.trim();
    if (!q) return;
    datMoTim(false);
    datTuKhoaTim('');
    const k = khoa;
    try {
      const jobs = await (await coVanMoi()).timViec(q);
      dat(k, x => ({ ...x, jobs, keyword: q }));
    } catch (err) {
      toast.error(t('careerJobSearchFailed', { error: loiChu(err) }));
    }
  }

  // Ham on dinh cho danh sach tin (memo): luon goi ban moi nhat qua ref
  const hanhDongRef = useRef({ suaCauHoi, traLoiLai });
  useEffect(() => { hanhDongRef.current = { suaCauHoi, traLoiLai }; });
  const onSua = useCallback((i: number) => { void hanhDongRef.current.suaCauHoi(i); }, []);
  const onTraLoiLai = useCallback((i: number) => { void hanhDongRef.current.traLoiLai(i); }, []);

  function khiGo(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      gui();
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">{t('careerTitle')}</h1>
        <p className="text-muted-foreground">{t('careerSubtitle')}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => datMoTim(true)}><Search aria-hidden="true" /> {t('careerSearchJobsBtn')}</Button>
          <Button variant="ghost" className="rounded-full text-muted-foreground" onClick={() => { void xoaChat(); }}><Trash2 aria-hidden="true" /> {t('clearChat')}</Button>
        </div>
      </header>

      <section className="overflow-hidden rounded-3xl bg-card shadow-soft">
        <ol ref={dsRef} aria-live="polite" className="max-h-[32rem] min-h-48 space-y-4 overflow-y-auto overscroll-contain bg-muted/60 px-5 py-5 text-foreground">
          {kho.chat.length === 0 && !kho.dangGui && <li>{t('careerGreeting')}</li>}
          <CacTin chat={kho.chat} onSua={onSua} onTraLoiLai={onTraLoiLai} />
          {kho.dangGui && <li className="text-sm text-peach-ink motion-safe:animate-pulse">{t('thinkingShort')}…</li>}
          {kho.loi && !kho.dangGui && (
            <li role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-2.5 text-sm text-destructive shadow-soft">
              <span>{t('careerFailed', { error: kho.loi })}</span>
              <Button variant="outline" size="sm" className="rounded-full" onClick={guiLai}>{t('resend')}</Button>
            </li>
          )}
        </ol>
        <form onSubmit={e => { e.preventDefault(); gui(); }} className="space-y-1.5 p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={oNhapRef}
              name="message"
              value={nhap}
              onChange={e => { datNhap(e.target.value); if (nhacRong) datNhacRong(false); }}
              onKeyDown={khiGo}
              rows={2}
              autoComplete="off"
              aria-label={t('searchJobsPlaceholder')}
              aria-invalid={nhacRong || undefined}
              aria-describedby={nhacRong ? 'career-nhac' : undefined}
              placeholder={t('searchJobsPlaceholder')}
              className="field-sizing-content max-h-40 min-h-12 min-w-0 flex-1 resize-none rounded-2xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" className="rounded-full" disabled={!!kho.dangGui || !(kho.daNap || kho.loiNap)}><Send aria-hidden="true" /> {t('sendMsg')}</Button>
          </div>
          {nhacRong && <p id="career-nhac" role="alert" className="px-3 text-xs text-destructive">{t('emptyInputHint')}</p>}
        </form>
      </section>

      <ViecLamGoiY kho={kho} doiMo={() => dat(khoa, x => ({ ...x, moViec: !x.moViec }))} />

      {hopXacNhan}
      <Dialog open={moTim} onOpenChange={datMoTim}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t('careerSearchJobsBtn')}</DialogTitle></DialogHeader>
          <form onSubmit={e => { void timTay(e); }} className="flex gap-2">
            <input name="q" autoComplete="off" value={tuKhoaTim} onChange={e => datTuKhoaTim(e.target.value)} aria-label={t('jobSearchPlaceholder2')} placeholder={t('jobSearchPlaceholder2')}
              className="h-10 min-w-0 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <Button type="submit" size="icon-lg" className="size-10 rounded-full" aria-label={t('careerSearchJobsBtn')} disabled={!tuKhoaTim.trim()}><Search aria-hidden="true" /></Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Khoa i18n cua loai hinh viec */
const LOAI_VIEC: Record<string, string> = { FULLTIME: 'jobFullTime', PARTTIME: 'jobPartTime', CONTRACTOR: 'jobContract', INTERN: 'jobIntern' };
/** Chip do phu hop theo trang thai: san sang = mint, con thieu = butter, muc tieu xa = peach */
const MAU_TRANG_THAI: Record<ViecLam['status'], string> = {
  ready: 'bg-mint text-mint-ink',
  gap: 'bg-butter text-butter-ink',
  target: 'bg-peach text-peach-ink'
};
const VN = /vietnam|việt nam|\bvn\b|hồ chí minh|hà nội|đà nẵng/i;

function ViecLamGoiY({ kho, doiMo }: { kho: KhoCareer; doiMo: () => void }) {
  const { t } = useT();
  if (kho.jobs.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-peach px-4 py-3 text-sm text-foreground">
        <span className="inline-flex flex-wrap items-center gap-1.5"><Briefcase className="size-4 text-peach-ink" aria-hidden="true" />{t('jobsSuggestedBar')} (0): <em>{kho.keyword ? t('careerNoJobsFor', { keyword: kho.keyword }) : t('noJobsFound')}</em></span>
        <span className="text-xs">{t('autoTriggerChat')}</span>
      </div>
    );
  }
  return (
    <section className="space-y-3">
      <button type="button" aria-expanded={kho.moViec} aria-controls="ds-viec-lam" onClick={doiMo}
        className="flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl bg-peach px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-peach/80 focus-visible:outline-2 focus-visible:outline-ring">
        <span className="flex flex-wrap items-center gap-2 font-medium">
          <ChevronDown className={cn('size-4 text-peach-ink transition-transform motion-reduce:transition-none', !kho.moViec && '-rotate-90')} aria-hidden="true" />
          <Briefcase className="size-4 text-peach-ink" aria-hidden="true" />{t('jobsSuggestedBar')} (<strong className="text-peach-ink">{kho.jobs.length}</strong>): <span className="font-semibold text-peach-ink">“{kho.keyword}”</span>
        </span>
        <span className="text-xs font-semibold text-peach-ink">{kho.moViec ? t('collapseJobList') : `${t('openJobList')} (${kho.jobs.length})`}</span>
      </button>
      {kho.moViec && (
        <ul id="ds-viec-lam" className="grid gap-3 md:grid-cols-2">
          {kho.jobs.map((j, i) => (
            <li key={i}>
              <a href={j.url} target="_blank" rel="noopener noreferrer"
                className="the-noi flex h-full flex-col gap-2 rounded-3xl bg-card p-4 shadow-soft focus-visible:outline-2 focus-visible:outline-ring">
                {j.badgeText && <span className={cn(CHIP, 'self-start', MAU_TRANG_THAI[j.status])}>{j.badgeText}</span>}
                <span className="flex items-center gap-3">
                  {j.company_logo
                    ? <img src={j.company_logo} alt="" width={36} height={36} loading="lazy" className="size-9 rounded-xl bg-white object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    : <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-peach"><Building2 className="size-4 text-peach-ink" /></span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{j.company_name}</span>
                    <span className="block text-xs text-muted-foreground">{j.source}</span>
                  </span>
                </span>
                <span className="font-semibold">{j.title}</span>
                {j.fitRecommendation && (
                  <span className="flex gap-2 rounded-2xl bg-background px-3 py-2 text-xs leading-relaxed text-foreground"><Lightbulb className="mt-px size-3.5 shrink-0" aria-hidden="true" /><span><strong>{t('careerSkillAssessment')}</strong> {j.fitRecommendation}</span></span>
                )}
                <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {/* Chi hien noi lam viec khi tin co ghi; khong biet thi bo trong, khong tu dien "Remote" */}
                  {(j.location || j.is_remote) && (
                    <span className="inline-flex items-center gap-1">
                      {j.is_remote && !VN.test(j.location) ? <Globe className="size-3.5" aria-hidden="true" /> : <MapPin className="size-3.5" aria-hidden="true" />}
                      {j.location || t('jobRemote')}
                    </span>
                  )}
                  {j.employment_type && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />{LOAI_VIEC[j.employment_type] ? t(LOAI_VIEC[j.employment_type]) : j.employment_type}</span>}
                  {j.salary && <span className="inline-flex items-center gap-1"><Banknote className="size-3.5" aria-hidden="true" />{j.salary}</span>}
                </span>
                {j.tags.length > 0 && (
                  <span translate="no" className="flex flex-wrap gap-1.5">{j.tags.slice(0, 3).map((x, k) => <span key={k} className={cn(CHIP, 'bg-muted font-mono font-medium text-muted-foreground')}>{x}</span>)}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
