import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from './CodeBlock';
import { veVoiNen } from '@/test/ve-voi-nen';

afterEach(() => vi.restoreAllMocks());

test('chep code: ghi dung noi dung vao clipboard va bao da chep', async () => {
  const u = userEvent.setup();
  const ghi = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
  veVoiNen(<CodeBlock code={'print("hi")\n'} lang="python" />);
  await u.click(await screen.findByRole('button', { name: /Copy code|Sao chép/ }));
  expect(ghi).toHaveBeenCalledWith('print("hi")\n');
  expect(await screen.findByRole('button', { name: 'Đã chép' })).toBeInTheDocument();
  expect(document.querySelector('pre code .token')).not.toBeNull();
});

test('clipboard loi thi bao khong chep duoc', async () => {
  const u = userEvent.setup();
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('bi chan'));
  veVoiNen(<CodeBlock code="x" lang="python" />);
  await u.click(await screen.findByRole('button', { name: /Copy code|Sao chép/ }));
  expect(await screen.findByText('Không chép được')).toBeInTheDocument();
});
