import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { cacRoute } from '@/router';
import { AuthProvider } from '@/lib/auth';
import { I18nProvider } from '@/lib/i18n';
import { BAN_DICH_VI } from './ban-dich-vi';
import { Toaster } from '@/components/ui/sonner';
import type { giaSupabase } from './gia-supabase';

export function veApp(duongDan: string, { gia, json = {}, lang = 'vi', fetch }: {
  gia: ReturnType<typeof giaSupabase>; json?: Record<string, unknown>; lang?: string;
  fetch?: (url: string, init?: RequestInit) => Promise<unknown>;
}) {
  vi.stubGlobal('fetch', vi.fn(fetch ?? (async (url: string) => {
    const v = json[url];
    return v === undefined
      ? { ok: false, status: 404, json: async () => null }
      : { ok: true, status: 200, json: async () => v };
  })));
  localStorage.setItem('devmaster_hub_lang', lang);
  if (!sessionStorage.getItem('react-router-scroll-positions')) sessionStorage.setItem('react-router-scroll-positions', '{}');
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(cacRoute, { initialEntries: [duongDan] });
  const kq = render(
    <QueryClientProvider client={qc}>
      <I18nProvider taiBanDich={async () => BAN_DICH_VI}>
        <AuthProvider client={gia.client}>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
  return { ...kq, router, qc };
}
