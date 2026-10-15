import { latexSangChu } from './latex-sang-chu';

test('mui ten LaTeX trong $...$ thanh ky tu that (loi hay gap cua gia su AI)', () => {
  expect(latexSangChu('ky_tu là "u" $\\rightarrow$ True')).toBe('ky_tu là "u" → True');
  expect(latexSangChu('$\\Rightarrow$ kết luận, $\\leftarrow$ quay lại, $\\to$ tiếp')).toBe('⇒ kết luận, ← quay lại, → tiếp');
  expect(latexSangChu('$$a \\leftrightarrow b$$')).toBe('a ↔ b');
});

test('so sanh viet theo kieu lap trinh (>=, <=, !=) — site day code, khong dung ≥ ≤ ≠', () => {
  expect(latexSangChu('$x \\geq 5$ và $y \\le 3$, $a \\neq b$')).toBe('x >= 5 và y <= 3, a != b');
});

test('phan so, can, mu, \\text, \\log', () => {
  expect(latexSangChu('$O(n^2)$ và $O(n \\log n)$')).toBe('O(n²) và O(n log n)');
  expect(latexSangChu('$\\frac{a+b}{2}$, $\\sqrt{n}$, $2^{10}$')).toBe('(a+b)/2, √n, 2^10');
  expect(latexSangChu('$\\text{tổng} = 3 \\times 4$')).toBe('tổng = 3 × 4');
});

test('lenh LaTeX tran khong co $ cung doi', () => {
  expect(latexSangChu('True \\rightarrow in ra')).toBe('True → in ra');
});

test('tien do la va chu thuong giu nguyen', () => {
  expect(latexSangChu('Giá $5 và $10, tổng $15')).toBe('Giá $5 và $10, tổng $15');
  expect(latexSangChu('echo $HOME và $PATH')).toBe('echo $HOME và $PATH');
  expect(latexSangChu('đường dẫn C:\\Users\\Admin')).toBe('đường dẫn C:\\Users\\Admin');
});
