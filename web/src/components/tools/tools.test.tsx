import { useState } from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { veVoiNen } from '@/test/ve-voi-nen';
import { giaSupabase } from '@/test/gia-supabase';
import { CHALLENGES } from '@/lib/terminal';
import { LABS_NGINX } from '@/lib/labs-nginx';
import { PRESETS } from '@/lib/sandpack-doc';
import { Terminal } from './Terminal';
import { CtfPanel } from './CtfPanel';
import { LabPanel } from './LabPanel';
import { LiveIde } from './LiveIde';
import { useTerminal } from './use-terminal';

function MotTerminal({ ten = 'Terminal' }: { ten?: string }) {
  const kenh = useTerminal();
  return <section aria-label={ten}><Terminal kenh={kenh} /></section>;
}

function TerminalVaCtf() {
  const kenh = useTerminal();
  return <><Terminal kenh={kenh} /><CtfPanel kenh={kenh} /></>;
}

const goLenh = async (u: ReturnType<typeof userEvent.setup>, khung: HTMLElement, lenh: string) => {
  await u.type(within(khung).getByRole('textbox', { name: 'Lệnh terminal' }), lenh + '{Enter}');
};

describe('Terminal', () => {
  test('chay lenh, hien ket qua (bo ma mau ANSI), ↑ goi lai lenh cu, clear xoa man hinh', async () => {
    const u = userEvent.setup();
    veVoiNen(<MotTerminal />);
    const khung = await screen.findByRole('region', { name: 'Terminal' });
    await goLenh(u, khung, 'ls');
    expect(within(khung).getByText(/flag1\.txt/)).toBeInTheDocument();
    expect(khung.textContent).not.toContain('\u001b');
    await goLenh(u, khung, 'cd /etc');
    await goLenh(u, khung, 'pwd');
    expect(within(khung).getAllByText('/etc').length).toBeGreaterThan(0);
    const o = within(khung).getByRole('textbox', { name: 'Lệnh terminal' });
    await u.type(o, '{ArrowUp}');
    expect(o).toHaveValue('pwd');
    await u.clear(o);
    await goLenh(u, khung, 'clear');
    expect(within(khung).queryByText(/flag1\.txt/)).not.toBeInTheDocument();
  });

  test('dien thoai: o lenh nam trong form (phim Enter/Di cua ban phim ao gui duoc), co nut Chay lenh, tat tu sua chinh ta', async () => {
    const u = userEvent.setup();
    veVoiNen(<MotTerminal />);
    const khung = await screen.findByRole('region', { name: 'Terminal' });
    const o = within(khung).getByRole('textbox', { name: 'Lệnh terminal' });
    expect(o).toHaveAttribute('autocorrect', 'off');
    expect(o).toHaveAttribute('autocapitalize', 'off');
    expect(o).toHaveAttribute('enterkeyhint', 'go');
    expect(o.closest('form')).not.toBeNull();
    await u.type(o, 'whoami');
    await u.click(within(khung).getByRole('button', { name: 'Chạy lệnh' }));
    expect(within(khung).getByText(/uid=1000 gid=1000/)).toBeInTheDocument();
    expect(o).toHaveValue('');
  });

  test('hai terminal tren mot trang doc lap', async () => {
    const u = userEvent.setup();
    veVoiNen(<><MotTerminal ten="A" /><MotTerminal ten="B" /></>);
    const a = await screen.findByRole('region', { name: 'A' });
    const b = screen.getByRole('region', { name: 'B' });
    await goLenh(u, a, 'mkdir /home/hacker/rieng');
    await goLenh(u, b, 'ls /home/hacker');
    expect(b.textContent).not.toContain('rieng');
  });

  test('nano mo hop soan thao; Luu thi cat thay noi dung moi', async () => {
    const u = userEvent.setup();
    veVoiNen(<MotTerminal />);
    const khung = await screen.findByRole('region', { name: 'Terminal' });
    await goLenh(u, khung, 'nano /home/hacker/ghi.txt');
    const hop = await screen.findByRole('dialog');
    await u.type(within(hop).getByRole('textbox'), 'xin chao nano');
    await u.click(within(hop).getByRole('button', { name: /Lưu/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await goLenh(u, khung, 'cat /home/hacker/ghi.txt');
    expect(within(khung).getByText('xin chao nano')).toBeInTheDocument();
  });
});

describe('CtfPanel', () => {
  test('nop co dung o o nhap: bao chinh xac, cong diem, the chuyen da giai; nop qua terminal cung cap nhat', async () => {
    const u = userEvent.setup();
    veVoiNen(<TerminalVaCtf />);
    const o = await screen.findByRole('textbox', { name: 'Cờ (FLAG{...})' });
    // Dan chu: userEvent.type hieu "{...}" la phim dac biet
    await u.click(o);
    await u.paste(CHALLENGES[0].flag);
    await u.click(screen.getByRole('button', { name: 'Nộp cờ' }));
    expect(await screen.findByText(/CHÍNH XÁC/)).toBeInTheDocument();
    expect(screen.getByText(`${CHALLENGES[0].points} XP`)).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: new RegExp('Challenge 1') })).getByText('Đã giải')).toBeInTheDocument();
    const lenh = screen.getByRole('textbox', { name: 'Lệnh terminal' });
    await u.click(lenh);
    await u.paste(`submit ${CHALLENGES[1].flag}`);
    await u.keyboard('{Enter}');
    expect(await screen.findByText(`${CHALLENGES[0].points + CHALLENGES[1].points} XP`)).toBeInTheDocument();
  });
});

describe('LabPanel', () => {
  const lab = LABS_NGINX['nginx.newbie.intro'];

  test('tra loi dung: nhiem vu xong va luu tien do; sai thi bao; goi y mo dan; chu dang go o nhiem vu khac van con', async () => {
    const u = userEvent.setup();
    veVoiNen(<LabPanel lab={lab} />);
    const nv1 = await screen.findByRole('group', { name: /Tệp cấu hình chính/ });
    const nv2 = screen.getByRole('group', { name: /cổng nào/ });
    await u.type(within(nv2).getByRole('textbox'), '8');
    await u.type(within(nv1).getByRole('textbox'), '/etc/sai.conf');
    await u.click(within(nv1).getByRole('button', { name: 'Kiểm tra' }));
    expect(within(nv1).getByText(/Chưa đúng/)).toBeInTheDocument();
    await u.click(within(nv1).getByRole('button', { name: /Gợi ý 1\/2/ }));
    expect(within(nv1).getByText(/thường nằm trong \/etc/)).toBeInTheDocument();
    await u.clear(within(nv1).getByRole('textbox'));
    await u.type(within(nv1).getByRole('textbox'), '/etc/nginx/nginx.conf{Enter}');
    expect(await within(nv1).findByText(/Đã hoàn thành|\/etc\/nginx\/nginx\.conf/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('dmh_lab_progress')!)).toEqual({ 'nginx.newbie.intro': ['nginx-intro-1'] });
    expect(within(nv2).getByRole('textbox')).toHaveValue('8');
    expect(screen.getByText(/1\/4 nhiệm vụ/)).toBeInTheDocument();
  });

  test('nhiem vu kiem trang thai doc he thong tep cua terminal lab', async () => {
    const u = userEvent.setup();
    veVoiNen(<LabPanel lab={lab} />);
    const nv4 = await screen.findByRole('group', { name: /Tạo trang riêng/ });
    await u.click(within(nv4).getByRole('button', { name: 'Kiểm tra' }));
    expect(within(nv4).getByText(/Chưa thấy tệp/)).toBeInTheDocument();
    const o = screen.getByRole('textbox', { name: 'Lệnh terminal' });
    await u.type(o, 'mkdir -p /var/www/site{Enter}');
    await u.type(o, 'echo "<h1>Hi</h1>" > /var/www/site/index.html{Enter}');
    await u.click(within(nv4).getByRole('button', { name: 'Kiểm tra' }));
    expect(within(nv4).getByText(/root \/var\/www\/site/)).toBeInTheDocument();
  });
});

function IdeCoTrangThai({ onDoi }: { onDoi?: (f: Record<string, string>) => void }) {
  const [files, datFiles] = useState(PRESETS.html.files);
  return <LiveIde techId="htmlcss" files={files} macDinh={PRESETS.html.files} onFilesChange={f => { datFiles(f); onDoi?.(f); }} />;
}

const khungXem = () => document.querySelector('iframe') as HTMLIFrameElement;
const tokenCua = () => /__sandpack: '([^']+)'/.exec(khungXem().getAttribute('srcdoc') || '')?.[1];

describe('LiveIde', () => {
  test('sua code thi bao ra ngoai va khung xem truoc cap nhat; sandbox khong co allow-same-origin', async () => {
    const onDoi = vi.fn();
    veVoiNen(<IdeCoTrangThai onDoi={onDoi} />);
    const soan = await screen.findByRole('textbox', { name: /Soạn index\.html/ });
    fireEvent.change(soan, { target: { value: '<h1 id="moi">Trang moi $&</h1>' } });
    expect(onDoi).toHaveBeenLastCalledWith(expect.objectContaining({ 'index.html': '<h1 id="moi">Trang moi $&</h1>' }));
    await waitFor(() => expect(khungXem().getAttribute('srcdoc')).toContain('Trang moi $&'));
    expect(khungXem().getAttribute('sandbox')).toBe('allow-scripts allow-modals allow-forms allow-popups');
  });

  test('console chi nhan tin tu dung khung xem truoc va dung token', async () => {
    veVoiNen(<IdeCoTrangThai />);
    await screen.findByRole('textbox', { name: /Soạn index\.html/ });
    await waitFor(() => expect(tokenCua()).toBeTruthy());
    act(() => {
      window.dispatchEvent(new MessageEvent('message', { data: { __sandpack: tokenCua(), level: 'log', args: ['tu khung la'] }, source: window }));
      window.dispatchEvent(new MessageEvent('message', { data: { __sandpack: 'token-cu', level: 'log', args: ['token cu'] }, source: khungXem().contentWindow }));
      window.dispatchEvent(new MessageEvent('message', { data: { __sandpack: tokenCua(), level: 'error', args: ['loi that'] }, source: khungXem().contentWindow }));
    });
    expect(await screen.findByText('loi that')).toBeInTheDocument();
    expect(screen.queryByText('tu khung la')).not.toBeInTheDocument();
    expect(screen.queryByText('token cu')).not.toBeInTheDocument();
  });

  test('che do Thiet ke: chon phan tu trong khung, doi mau thi style.css doi', async () => {
    const u = userEvent.setup();
    const onDoi = vi.fn();
    veVoiNen(<IdeCoTrangThai onDoi={onDoi} />);
    await u.click(await screen.findByRole('button', { name: /Thiết kế/ }));
    await waitFor(() => expect(khungXem().getAttribute('srcdoc')).toContain('__design'));
    const token = /__design: '([^']+)'/.exec(khungXem().getAttribute('srcdoc') || '')?.[1];
    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        data: { __design: token, type: 'select', selector: '.card', tag: 'main', text: 'Xin chao', computed: { color: 'rgb(226, 232, 240)' } },
        source: khungXem().contentWindow
      }));
    });
    const mauChu = await screen.findByRole('textbox', { name: 'Màu chữ' });
    expect(mauChu).toHaveValue('#e2e8f0');
    // Dang go do dang ("re") khong ghi; go xong (roi o / Enter) moi ghi
    onDoi.mockClear();
    fireEvent.change(mauChu, { target: { value: 're' } });
    expect(mauChu).toHaveValue('re');
    expect(onDoi).not.toHaveBeenCalled();
    fireEvent.change(mauChu, { target: { value: '#ff0000' } });
    fireEvent.blur(mauChu);
    expect(onDoi).toHaveBeenLastCalledWith(expect.objectContaining({ 'style.css': expect.stringMatching(/\.card\s*\{[^}]*color:\s*#ff0000/) }));
  });

  test('che do Thiet ke: go code trong luc AI dang sua van giu; Hoan tac tra lai tep truoc khi AI sua', async () => {
    const u = userEvent.setup();
    let tha!: () => void;
    const gia = giaSupabase({ nguoiDung: { id: 'u1' } });
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url !== '/api/ai') return new Response('null', { status: 404 });
      await new Promise<void>(r => { tha = r; });
      return new Response(JSON.stringify({ content: [{ type: 'text', text: '{"edits":[{"type":"css","selector":".card","props":{"color":"#123456"}}],"explain":"Doi mau"}' }] }), { status: 200 });
    }));
    const onDoi = vi.fn();
    veVoiNen(<IdeCoTrangThai onDoi={onDoi} />, { gia });
    await u.click(await screen.findByRole('button', { name: /Thiết kế/ }));
    await u.type(screen.getByRole('textbox', { name: 'Nhờ AI sửa giao diện' }), 'doi mau chu');
    await u.click(screen.getByRole('button', { name: /Sửa/ }));
    const soan = screen.getByRole('textbox', { name: /Soạn index\.html/ });
    fireEvent.change(soan, { target: { value: '<p>dang go</p>' } });
    await act(async () => { tha(); });
    expect(await screen.findByText(/Doi mau \(1 thay đổi\)/)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Soạn index\.html/ })).toHaveValue('<p>dang go</p>');
    expect(onDoi).toHaveBeenLastCalledWith(expect.objectContaining({ 'index.html': '<p>dang go</p>', 'style.css': expect.stringContaining('#123456') }));
    await u.click(screen.getByRole('button', { name: /Hoàn tác/ }));
    expect(onDoi).toHaveBeenLastCalledWith(expect.objectContaining({ 'style.css': expect.not.stringContaining('#123456') }));
    vi.unstubAllGlobals();
  });
});
