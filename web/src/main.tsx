import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router/dom';
import { taoRouter } from './router';
import { AuthProvider } from './lib/auth';
import { I18nProvider } from './lib/i18n';
import { duongDanTuHashCu } from './lib/legacy-hash';
import { ganTaiLaiKhiLoiChunk } from './lib/tai-lai-chunk';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

const tuHash = duongDanTuHashCu(window.location.hash);
if (tuHash) {
  window.location.replace(tuHash);
} else {
  ganTaiLaiKhiLoiChunk();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } }
  });

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AuthProvider>
            <RouterProvider router={taoRouter()} />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
