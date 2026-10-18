import { useRef, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Bot, Eye, EyeOff, Loader2, Map, Rocket } from 'lucide-react';
import { laMaLoiAuth, useAuth, type MaLoiAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { TIEU_DE_TRANG_CHU, usePageMeta } from '@/lib/page-meta';
import { BrandMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { doManhMatKhau, type DoManh } from '@/lib/mat-khau';

type CheDo = 'login' | 'register';
type Truong = 'ten' | 'matKhau' | 'nhapLai' | null;
type Loi = { truong: Truong; thongBao: string };

const MUC_MANH: Record<DoManh, { bac: number; nen: string; chu: string; khoa: string }> = {
  yeu: { bac: 0, nen: 'bg-destructive', chu: 'text-destructive', khoa: 'pwWeak' },
  trungBinh: { bac: 1, nen: 'bg-butter-ink', chu: 'text-butter-ink', khoa: 'pwMedium' },
  manh: { bac: 2, nen: 'bg-mint-ink', chu: 'text-mint-ink', khoa: 'pwStrong' }
};

const TRUONG_CUA_MA: Record<MaLoiAuth, Truong> = {
  authWrongCredentials: null,
  authUsernameShort: 'ten',
  authUsernameLong: 'ten',
  authUsernameChars: 'ten',
  authUsernameTaken: 'ten',
  authPasswordShort: 'matKhau'
};

const DIEM_NOI_BAT = [
  { Icon: Map, khoa: 'welcomePoint1', nen: 'bg-mint', muc: 'text-mint-ink', rong: 'col-span-2' },
  { Icon: Bot, khoa: 'welcomePoint2', nen: 'bg-lavender', muc: 'text-lavender-ink', rong: '' },
  { Icon: Rocket, khoa: 'welcomePoint3', nen: 'bg-butter', muc: 'text-butter-ink', rong: '' }
] as const;

function noiQuayLai(state: unknown): string {
  const tu = (state as { from?: unknown } | null)?.from;
  return typeof tu === 'string' && /^\/(?![/\\])/.test(tu) ? tu : '/';
}

function GioiThieu() {
  const { t } = useT();
  return (
    <section className="hidden flex-col justify-between gap-10 px-12 py-10 lg:flex">
      <BrandMark />
      <div className="max-w-xl">
        <h1 className="font-display text-5xl leading-tight font-extrabold tracking-tight text-balance">{t('authSubtitle')}</h1>
        <ul className="mt-10 grid grid-cols-2 gap-4">
          {DIEM_NOI_BAT.map(({ Icon, khoa, nen, muc, rong }) => (
            <li key={khoa} className={cn('rounded-3xl p-6 text-foreground', nen, rong)}>
              <span className={cn('grid size-10 place-items-center rounded-2xl bg-card', muc)} aria-hidden="true"><Icon className="size-5" /></span>
              <p className="mt-4 font-semibold text-pretty">{t(khoa)}</p>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-muted-foreground">{t('dashboardSubtitle')}</p>
    </section>
  );
}

function LoiTruong({ id, loi }: { id: string; loi: string }) {
  return <p id={id} role="alert" className="text-sm font-medium text-destructive">{loi}</p>;
}

export function AuthPage() {
  const { t } = useT();
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [thamSo, datThamSo] = useSearchParams();
  const quayLai = noiQuayLai(location.state);
  const cheDo: CheDo = thamSo.get('mode') === 'register' ? 'register' : 'login';
  const [ten, datTen] = useState('');
  const [matKhau, datMatKhau] = useState('');
  const [nhapLai, datNhapLai] = useState('');
  const [loi, datLoi] = useState<Loi | null>(null);
  const [dangGui, datDangGui] = useState(false);
  const [hienMk, datHienMk] = useState(false);
  const oTen = useRef<HTMLInputElement>(null);
  const oMatKhau = useRef<HTMLInputElement>(null);
  const oNhapLai = useRef<HTMLInputElement>(null);
  const doManh = cheDo === 'register' ? doManhMatKhau(matKhau) : null;

  usePageMeta({ title: TIEU_DE_TRANG_CHU });

  if (!loading && user && !dangGui) return <Navigate to={quayLai} replace />;

  function baoLoi(truong: Truong, thongBao: string) {
    datLoi({ truong, thongBao });
    const o = { ten: oTen, matKhau: oMatKhau, nhapLai: oNhapLai }[truong ?? 'matKhau'];
    o.current?.focus();
  }

  function doiCheDo(v: string) {
    datThamSo(v === 'register' ? { mode: 'register' } : {}, { replace: true, state: location.state });
    datLoi(null);
  }

  async function gui(e: FormEvent) {
    e.preventDefault();
    datLoi(null);
    if (!ten.trim()) return baoLoi('ten', t('fillAllFields'));
    if (!matKhau) return baoLoi('matKhau', t('fillAllFields'));
    if (cheDo === 'register' && matKhau !== nhapLai) return baoLoi('nhapLai', t('passwordMismatch'));
    datDangGui(true);
    try {
      await (cheDo === 'login' ? login(ten, matKhau) : register(ten, matKhau));
      navigate(quayLai, { replace: true });
    } catch (err) {
      datDangGui(false);
      const thongBao = err instanceof Error ? err.message : String(err);
      if (laMaLoiAuth(thongBao)) baoLoi(TRUONG_CUA_MA[thongBao], t(thongBao));
      else baoLoi(null, thongBao);
    }
  }

  const loiO = (truong: Exclude<Truong, null>) => (loi?.truong === truong ? loi.thongBao : '');
  const moTa = (...ids: (string | false)[]) => ids.filter(Boolean).join(' ') || undefined;
  const nhanNut = dangGui
    ? t(cheDo === 'login' ? 'loggingIn' : 'registering')
    : t(cheDo === 'login' ? 'authLogin' : 'authRegister');

  const form = (
    <form onSubmit={gui} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="ten-dang-nhap">{t('authUsername')}</Label>
        <Input id="ten-dang-nhap" ref={oTen} name="username" autoComplete="username" spellCheck={false}
          autoCapitalize="none" autoCorrect="off" placeholder={t('authUsernamePlaceholder')} className="h-10 rounded-xl"
          value={ten} onChange={e => datTen(e.target.value)} required
          aria-invalid={!!loiO('ten') || undefined} aria-describedby={moTa(!!loiO('ten') && 'loi-ten')} />
        {loiO('ten') && <LoiTruong id="loi-ten" loi={loiO('ten')} />}
      </div>
      <div className="space-y-2">
        <Label htmlFor="mat-khau">{t('authPassword')}</Label>
        <div className="relative">
          <Input id="mat-khau" ref={oMatKhau} name="password" type={hienMk ? 'text' : 'password'}
            autoComplete={cheDo === 'login' ? 'current-password' : 'new-password'}
            placeholder={t('authPasswordPlaceholder')} value={matKhau} onChange={e => datMatKhau(e.target.value)} required
            className="h-10 rounded-xl pr-10" aria-invalid={!!loiO('matKhau') || undefined}
            aria-describedby={moTa(!!loiO('matKhau') && 'loi-mat-khau', !!doManh && 'do-manh-mk')} />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => datHienMk(v => !v)} aria-pressed={hienMk}
            aria-label={t(hienMk ? 'hidePassword' : 'showPassword')} title={t(hienMk ? 'hidePassword' : 'showPassword')}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground">
            {hienMk ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </Button>
        </div>
        {loiO('matKhau') && <LoiTruong id="loi-mat-khau" loi={loiO('matKhau')} />}
        {doManh && (
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= MUC_MANH[doManh].bac ? MUC_MANH[doManh].nen : 'bg-muted')} />
              ))}
            </div>
            <p id="do-manh-mk" aria-live="polite" className={cn('text-xs font-medium', MUC_MANH[doManh].chu)}>
              {t('pwStrength', { level: t(MUC_MANH[doManh].khoa) })}
            </p>
            {doManh !== 'manh' && <p className="text-xs text-muted-foreground">{t('pwTip')}</p>}
          </div>
        )}
      </div>
      {cheDo === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="nhap-lai">{t('authConfirmPassword')}</Label>
          <Input id="nhap-lai" ref={oNhapLai} name="confirm-password" type={hienMk ? 'text' : 'password'} autoComplete="new-password"
            placeholder={t('authConfirmPasswordPlaceholder')} className="h-10 rounded-xl"
            value={nhapLai} onChange={e => datNhapLai(e.target.value)} required
            aria-invalid={!!loiO('nhapLai') || undefined} aria-describedby={moTa(!!loiO('nhapLai') && 'loi-nhap-lai')} />
          {loiO('nhapLai') && <LoiTruong id="loi-nhap-lai" loi={loiO('nhapLai')} />}
        </div>
      )}

      {loi && loi.truong === null && (
        <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{loi.thongBao}</p>
      )}

      <Button type="submit" size="lg" className="h-11 w-full rounded-full bg-signal text-signal-foreground hover:bg-signal hover:brightness-105" disabled={dangGui}>
        {dangGui && <Loader2 className="motion-safe:animate-spin" aria-hidden="true" />}
        {nhanNut}
      </Button>
    </form>
  );

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <GioiThieu />

      <main className="flex items-center justify-center px-4 py-10 sm:px-5 sm:py-12">
        <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-soft sm:p-8">
          <div className="mb-6 lg:hidden">
            <BrandMark />
            <h1 className="mt-4 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance">{t('authSubtitle')}</h1>
          </div>

          <Tabs value={cheDo} onValueChange={doiCheDo}>
            <TabsList className="w-full rounded-full p-1 group-data-horizontal/tabs:h-11">
              <TabsTrigger value="login" className="flex-1 rounded-full">{t('authLogin')}</TabsTrigger>
              <TabsTrigger value="register" className="flex-1 rounded-full">{t('authRegister')}</TabsTrigger>
            </TabsList>
            {(['login', 'register'] as const).map(v => (
              <TabsContent key={v} value={v} className="mt-4 rounded-2xl">{v === cheDo && form}</TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
