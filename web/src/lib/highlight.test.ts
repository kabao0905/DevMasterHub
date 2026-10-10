import { toMauCode } from './highlight';

test('code trong the bi escape, khong sinh the that', () => {
  const html = toMauCode('<script>alert(1)</script>', 'html');
  expect(html).not.toContain('<script>');
  expect(html).toContain('&lt;');
});

test('to mau theo ngon ngu cua bai, ke ca bi danh', () => {
  expect(toMauCode('def f(): pass', 'python')).toContain('token keyword');
  expect(toMauCode('FROM node:22', 'dockerfile')).toContain('token');
  expect(toMauCode('server { listen 80; }', 'nginx')).toContain('token');
});

test('ngon ngu la thi chi escape', () => {
  expect(toMauCode('a<b && c', 'khong-co')).toBe('a&lt;b &amp;&amp; c');
  expect(toMauCode('x', undefined)).toBe('x');
});
