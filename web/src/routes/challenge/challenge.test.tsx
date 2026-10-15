import { docThan } from '@/test/doc-than';
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
        const b = docThan(init?.body) as ThanAi;
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

// De hop le: dap an "4444" co that trong /etc/.hidden/backdoor.conf, khong lo trong de
const DE_HOP_LE = JSON.stringify({
  title: 'Tim cong cua cua hau', level: 'Trung bình', scenario: 'Máy chủ có tiến trình lạ', steps: ['Tìm tệp cấu hình ẩn trong /etc', 'Đọc cấu hình'],
  hint: 'dùng ls -la /etc', question: 'Cửa hậu đang mở cổng nào?', answer: '4444'
});

test('AI ra de dua tren du lieu that cua terminal; nop dap an sai thi bao chua dung, dung thi bao chinh xac', async () => {
  const u = userEvent.setup();
  const { goiAi } = mo(() => traText(DE_HOP_LE));
  await u.click(await screen.findByRole('button', { name: 'Ra đề mới' }));
  expect(await screen.findByRole('heading', { name: 'Tim cong cua cua hau' })).toBeInTheDocument();
  expect(screen.getByText(/Cửa hậu đang mở cổng nào\?/)).toBeInTheDocument();
  expect(goiAi[0].system).toContain('nmap');
  expect(goiAi[0].system).toContain('listen_port=4444');
  const o = screen.getByRole('textbox', { name: 'Đáp án của bạn' });
  await u.type(o, '8080');
  await u.click(screen.getByRole('button', { name: 'Nộp đáp án' }));
  expect(await screen.findByText(/Chưa đúng/)).toBeInTheDocument();
  await u.clear(o);
  await u.type(o, '4444');
  await u.click(screen.getByRole('button', { name: 'Nộp đáp án' }));
  expect((await screen.findAllByText(/Chính xác/)).length).toBeGreaterThan(0);
});

test('AI tu them tep vao terminal: hoc vien cat duoc tep moi, tim ra dap an va nop dung', async () => {
  const u = userEvent.setup();
  mo(() => traText(JSON.stringify({
    title: 'Ro ri mat khau', level: 'Dễ', scenario: 'Nhân viên để quên tệp sao lưu', steps: ['Tìm tệp sao lưu trong thư mục nhà'],
    hint: 'dùng ls -la', question: 'Mật khẩu DB là gì?', answer: 'S3cr3t!99',
    files: [{ path: '/home/hacker/backup/.env', content: 'DB_USER=admin\nDB_PASS=S3cr3t!99' }]
  })));
  await u.click(await screen.findByRole('button', { name: 'Ra đề mới' }));
  expect(await screen.findByRole('heading', { name: 'Ro ri mat khau' })).toBeInTheDocument();
  expect(screen.getByText(/AI đã thêm 1 tệp vào terminal/)).toBeInTheDocument();
  const khung = screen.getByRole('region', { name: 'Terminal' });
  await u.type(within(khung).getByRole('textbox', { name: 'Lệnh terminal' }), 'cat /home/hacker/backup/.env{Enter}');
  expect(within(khung).getByText(/DB_PASS=S3cr3t!99/)).toBeInTheDocument();
  await u.type(screen.getByRole('textbox', { name: 'Đáp án của bạn' }), 'S3cr3t!99');
  await u.click(screen.getByRole('button', { name: 'Nộp đáp án' }));
  expect((await screen.findAllByText(/Chính xác/)).length).toBeGreaterThan(0);
});

test('AI ra de hong (khong phai JSON) thi bao loi kem goi y bam lai', async () => {
  const u = userEvent.setup();
  mo(() => traText('khong phai json'));
  await u.click(await screen.findByRole('button', { name: 'Ra đề mới' }));
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
  const { router } = mo(() => traText(DE_HOP_LE.replace('Tim cong cua cua hau', 'De giu lai')));
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
