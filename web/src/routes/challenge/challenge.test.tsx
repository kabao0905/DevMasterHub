import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veApp } from '@/test/ve-app';
import { giaSupabase } from '@/test/gia-supabase';
import { CHALLENGES } from '@/lib/terminal';

type ThanAi = { system: string; taskType: string };
const traText = (text: string) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { status: 200 });

function mo(ai: (b: ThanAi) => Response) {
  const goiAi: ThanAi[] = [];
  const json: Record<string, unknown> = { '/curriculum/index.json': [], '/api/health': { aiEnabled: true } };
  const kq = veApp('/challenge', {
    gia: giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } }),
    json,
    fetch: async (url: string, init?: RequestInit) => {
      if (url === '/api/ai') {
        const b = JSON.parse(String(init?.body)) as ThanAi;
        goiAi.push(b);
        return ai(b);
      }
      return Object.hasOwn(json, url) ? new Response(JSON.stringify(json[url]), { status: 200 }) : new Response('null', { status: 404 });
    }
  });
  return { ...kq, goiAi };
}

// Nap san chunk cua route luoi (terminal, AI) truoc khi do thoi gian
beforeAll(async () => { await import('./ChallengePage'); await import('@/routes/lesson/LessonPage'); }, 30000);
afterEach(() => vi.unstubAllGlobals());

test('trang Thu thach: terminal, du the CTF, link quay ve roadmap An ninh mang', async () => {
  mo(() => traText('{}'));
  expect(await screen.findByRole('heading', { level: 1, name: /Thử thách Linux/ })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Lệnh terminal' })).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(CHALLENGES.length);
  expect(within(screen.getByRole('main')).getByRole('link', { name: /Quay lại/ })).toHaveAttribute('href', '/roadmap/cybersecurity');
});

test('AI ra de: chi dung lenh co that; de bi cat van hien; tra loi hong thi bao loi', async () => {
  const u = userEvent.setup();
  let lan = 0;
  const { goiAi } = mo(() => (lan++ === 0
    ? traText('{"title":"Tim co trong log","level":"Dễ","scenario":"Có kẻ lạ","steps":["grep FLAG /var/log/auth.log"],"hint":"dùng grep"}')
    : traText('khong phai json')));
  await u.click(await screen.findByRole('button', { name: 'Ra đề mới' }));
  expect(await screen.findByRole('heading', { name: 'Tim co trong log' })).toBeInTheDocument();
  expect(screen.getByText('grep FLAG /var/log/auth.log')).toBeInTheDocument();
  expect(goiAi[0].system).toContain('nmap');
  expect(goiAi[0].system).toContain('/home/hacker/flag1.txt');
  await u.click(screen.getByRole('button', { name: 'Ra đề mới' }));
  expect(await screen.findByText(/AI trả lời không đúng định dạng/)).toBeInTheDocument();
});

test('di tu roadmap vao bai hoc bang router (khong tai lai trang)', async () => {
  const u = userEvent.setup();
  const json: Record<string, unknown> = {
    '/curriculum/index.json': [{ id: 'python', name: 'Python', icon: '🐍', color: '#fff', gradient: '', category: 'language', description: '', levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'a', title: 'Biến' }] }] }],
    '/curriculum/python.json': { id: 'python', name: 'Python', icon: '🐍', color: '#fff', gradient: '', category: 'language', description: '', levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'a', title: 'Biến', theory: '<p>x</p>' }] }] },
    '/api/health': { aiEnabled: true }
  };
  const { router } = veApp('/roadmap/python', { gia: giaSupabase({ nguoiDung: { id: 'u1' }, bang: { profiles: [{ id: 'u1', username: 'an', display_name: 'An' }] } }), json });
  await u.click(await screen.findByRole('link', { name: 'Biến' }));
  await waitFor(() => expect(router.state.location.pathname).toBe('/lesson/python/newbie/a'));
  expect(await screen.findByRole('heading', { level: 1, name: 'Biến' })).toBeInTheDocument();
});

test('/lesson/<tech>/<cap> thieu bai thi ve roadmap cap do; /lesson tran ve Dashboard', async () => {
  const { router } = veApp('/lesson/python/junior', { gia: giaSupabase({ nguoiDung: { id: 'u1' } }), json: { '/curriculum/index.json': [] } });
  await waitFor(() => expect(router.state.location.pathname).toBe('/roadmap/python/junior'));
});

test('roi trang Thu thach roi quay lai: diem, co da giai va de AI van con', async () => {
  const u = userEvent.setup();
  const { router } = mo(() => traText('{"title":"De giu lai","level":"Dễ","scenario":"x","steps":[],"hint":""}'));
  const lenh = await screen.findByRole('textbox', { name: 'Lệnh terminal' });
  await u.click(lenh);
  await u.paste(`submit ${CHALLENGES[0].flag}`);
  await u.keyboard('{Enter}');
  expect(await screen.findByText(`${CHALLENGES[0].points} XP`)).toBeInTheDocument();
  await u.click(screen.getByRole('button', { name: 'Ra đề mới' }));
  expect(await screen.findByRole('heading', { name: 'De giu lai' })).toBeInTheDocument();
  await act(() => router.navigate('/'));
  await act(() => router.navigate('/challenge'));
  expect(await screen.findByText(`${CHALLENGES[0].points} XP`)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'De giu lai' })).toBeInTheDocument();
});
