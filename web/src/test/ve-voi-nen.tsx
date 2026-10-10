// Ve mot component voi nen toi thieu: react-query, ban dich tieng Viet va noi hien toast.
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/lib/i18n';
import { Toaster } from '@/components/ui/sonner';
import { BAN_DICH_VI } from './ban-dich-vi';

export function veVoiNen(ui: ReactElement) {
  localStorage.setItem('devmaster_hub_lang', 'vi');
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <I18nProvider taiBanDich={async () => BAN_DICH_VI}>
        {ui}
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>
  );
}
