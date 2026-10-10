import { render, screen } from '@testing-library/react';
import { cn } from '@/lib/utils';

test('render duoc component React, alias @ va matcher jest-dom hoat dong', () => {
  render(<p className={cn('a', false && 'b', 'px-2 px-4')}>Xin chào</p>);
  const p = screen.getByText('Xin chào');
  expect(p).toBeInTheDocument();
  // tailwind-merge gop class trung: px-4 thang px-2
  expect(p.className).toBe('a px-4');
});
