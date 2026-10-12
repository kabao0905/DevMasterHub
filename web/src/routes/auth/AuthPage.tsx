import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { TIEU_DE_TRANG_CHU, usePageMeta } from '@/lib/page-meta';
import { BrandMark } from '@/components/BrandMark';
import { MAU_CAP } from '@/components/LevelLadder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { doManhMatKhau, type DoManh } from '@/lib/mat-khau';

type CheDo = 'login' | 'register';

/** bac: so vach sang (0..2) tren thanh do manh */
const MUC_MANH: Record<DoManh, { bac: number; nen: string; chu: string; khoa: string }> = {
  yeu: { bac: 0, nen: 'bg-destructive', chu: 'text-destructive', khoa: 'pwWeak' },
  trungBinh: { bac: 1, nen: 'bg-amber-400', chu: 'text-amber-400', khoa: 'pwMedium' },
  manh: { bac: 2, nen: 'bg-level-newbie', chu: 'text-level-newbie', khoa: 'pwStrong' }
};

/** Chi quay lai duong dan noi bo ("/x"), khong phai "//host" hay URL ngoai */
function noiQuayLai(state: unknown): string {
  const tu = (state as { from?: unknown } | null)?.from;
  return typeof tu === 'string' && /^\/(?![/\\])/.test(tu) ? tu : '/';
}

// Thang cap do tu duoi len: Newbie o day, Master o dinh
const CAC_CAP = [
  { id: 'master', ten: 'Master', khoa: 'levelMaster' },
  { id: 'senior', ten: 'Senior', khoa: 'levelSenior' },
  { id: 'mid', ten: 'Mid', khoa: 'levelMid' },
  { id: 'junior', ten: 'Junior', khoa: 'levelJunior' },
  { id: 'newbie', ten: 'Newbie', khoa: 'levelNewbie' }
];

export function AuthPage() {
  const { t } = useT();
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const quayLai = noiQuayLai(location.state);
  const [cheDo, datCheDo] = useState<CheDo>('login');
  const [ten, datTen] = useState('');
  const [matKhau, datMatKhau] = useState('');
  const [nhapLai, datNhapLai] = useState('');
  const [loi, datLoi] = useState('');
  const [dangGui, datDangGui] = useState(false);
  const [hienMk, datHienMk] = useState(false);
  // Chi cham khi dang ky: luc dang nhap mat khau da dat tu truoc, cham khong giup gi
  const doManh = cheDo === 'register' ? doManhMatKhau(matKhau) : null;

  // Nguoi chua dang nhap (ca may tim kiem) mo / se thay trang nay: giu tieu de trang chu
  usePageMeta({ title: TIEU_DE_TRANG_CHU });

  if (!loading && user && !dangGui) return <Navigate to={quayLai} replace />;

  async function gui(e: FormEvent) {
    e.preventDefault();
    datLoi('');
    if (!ten.trim() || !matKhau) return datLoi(t('fillAllFields'));
    if (cheDo === 'register' && matKhau !== nhapLai) return datLoi(t('passwordMismatch'));
    datDangGui(true);
    try {
      await (cheDo === 'login' ? login(ten, matKhau) : register(ten, matKhau));
      navigate(quayLai, { replace: true });
    } catch (err) {
      datLoi(err instanceof Error ? err.message : String(err));
      datDangGui(false);
    }
  }

  const nhanNut = dangGui
    ? t(cheDo === 'login' ? 'loggingIn' : 'registering')
    : t(cheDo === 'login' ? 'authLogin' : 'authRegister');

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden border-r bg-sidebar px-12 py-10 lg:flex">
        <BrandMark />
        <div>
          <h1 className="max-w-md text-4xl leading-tight font-bold tracking-tight text-balance">{t('authSubtitle')}</h1>
          <ol className="mt-10 space-y-3" aria-label={t('dashboardSubtitle')}>
            {CAC_CAP.map((cap, i) => (
              <li key={cap.id} className="flex items-center gap-4" style={{ paddingLeft: `${(CAC_CAP.length - 1 - i) * 1.25}rem` }}>
                <span className={cn('size-3 shrink-0 rounded-full ring-4 ring-sidebar', MAU_CAP[cap.id])} aria-hidden="true" />
                <span className="font-semibold">{cap.ten}</span>
                <span className="text-sm text-muted-foreground">{t(cap.khoa)}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-sm text-muted-foreground">{t('dashboardSubtitle')}</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <BrandMark />
            <p className="mt-3 text-sm text-muted-foreground">{t('authSubtitle')}</p>
          </div>

          <Tabs value={cheDo} onValueChange={v => { datCheDo(v as CheDo); datLoi(''); }}>
            {/* Cao 40px: tab mac dinh chi 25px, kho bam tren dien thoai */}
            <TabsList className="w-full group-data-horizontal/tabs:h-10">
              <TabsTrigger value="login" className="flex-1">{t('authLogin')}</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">{t('authRegister')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={gui} className="mt-6 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="ten-dang-nhap">{t('authUsername')}</Label>
              <Input id="ten-dang-nhap" autoComplete="username" placeholder={t('authUsernamePlaceholder')}
                value={ten} onChange={e => datTen(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-khau">{t('authPassword')}</Label>
              <div className="relative">
                <Input id="mat-khau" type={hienMk ? 'text' : 'password'} autoComplete={cheDo === 'login' ? 'current-password' : 'new-password'}
                  placeholder={t('authPasswordPlaceholder')} value={matKhau} onChange={e => datMatKhau(e.target.value)} required
                  className="pr-10" aria-describedby={doManh ? 'do-manh-mk' : undefined} />
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => datHienMk(v => !v)}
                  aria-label={t(hienMk ? 'hidePassword' : 'showPassword')} title={t(hienMk ? 'hidePassword' : 'showPassword')}
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground">
                  {hienMk ? <EyeOff /> : <Eye />}
                </Button>
              </div>
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
                <Input id="nhap-lai" type={hienMk ? 'text' : 'password'} autoComplete="new-password" placeholder={t('authConfirmPasswordPlaceholder')}
                  value={nhapLai} onChange={e => datNhapLai(e.target.value)} required />
              </div>
            )}

            {loi && (
              <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {loi}
              </p>
            )}

            <Button type="submit" size="lg" className="h-10 w-full bg-brand text-white hover:opacity-90" disabled={dangGui}>
              {dangGui && <Loader2 className="animate-spin" />}
              {nhanNut}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
