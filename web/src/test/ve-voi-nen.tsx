import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';
import { BAN_DICH_VI } from './ban-dich-vi';
import { giaSupabase } from './gia-supabase';

export function veVoiNen(ui: ReactElement, { gia = giaSupabase({ nguoiDung: { id: 'u1' } }) } = {}) {
  localStorage.setItem('devmaster_hub_lang', 'vi');
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return {
    gia,
    ...render(
      <QueryClientProvider client={qc}>
        <I18nProvider taiBanDich={async () => BAN_DICH_VI}>
          <AuthProvider client={gia.client}>
            {ui}
            <Toaster />
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    )
  };
}
