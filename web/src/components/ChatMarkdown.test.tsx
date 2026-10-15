import { ChatMarkdown } from './ChatMarkdown';
import { veVoiNen } from '@/test/ve-voi-nen';
import { within } from '@testing-library/react';

async function ve(text: string) {
  const kq = veVoiNen(<div data-testid="md"><ChatMarkdown text={text} /></div>);
  return { ...kq, el: await within(kq.container).findByTestId('md') };
}

test('khoi code giu nguyen xuong dong va dau *, khong lot <br>/<em> vao trong', async () => {
  const { el } = await ve('Xem:\n```cpp\nint *a = *b;\nreturn 0;\n```\nXong');
  const code = el.querySelector('pre code')!;
  expect(code.textContent).toBe('int *a = *b;\nreturn 0;');
  expect(code.className).toContain('language-cpp');
  expect(el.querySelector('pre em, pre br')).toBeNull();
  expect(el.firstChild?.textContent).toBe('Xem:');
  expect(el.textContent?.endsWith('Xong')).toBe(true);
});

test('the HTML trong cau tra loi cua AI hien ra nhu chu, khong thanh phan tu that', async () => {
  const { el } = await ve('Thẻ <img src=x onerror=alert(1)> và <div> chưa đóng');
  expect(el.querySelector('img, div div')).toBeNull();
  expect(el.textContent).toContain('<img src=x onerror=alert(1)>');
});

test('dam, nghieng, code dong; "2 * 3 * 4" giu nguyen', async () => {
  const { el } = await ve('**đậm** và *nghiêng* với `a<b>` và `*p`');
  expect(el.querySelector('strong')?.textContent).toBe('đậm');
  expect(el.querySelector('em')?.textContent).toBe('nghiêng');
  expect([...el.querySelectorAll('code')].map(c => c.textContent)).toEqual(['a<b>', '*p']);

  const { el: el2 } = await ve('2 * 3 * 4');
  expect(el2.querySelector('em')).toBeNull();
});

test('khoi code chua dong giu nguyen chu; bo ky tu NUL', async () => {
  const { el } = await ve('```js\nx = 1\u0000');
  expect(el.querySelector('pre')).toBeNull();
  expect(el.textContent).toBe('```jsx = 1');
});

test('dam boc ca code dong (AI hay viet **Hàm `print()` ...**) khong con lo dau **', async () => {
  const { el } = await ve('1. **Hàm `print()` nhận biểu thức:** Python tính trước\nKết quả là **`True`**, còn đây ** `False` **.');
  const dam = [...el.querySelectorAll('strong')];
  expect(dam.map(d => d.textContent)).toEqual(['Hàm print() nhận biểu thức:', 'True', 'False']);
  expect(dam[0].querySelector('code')?.textContent).toBe('print()');
  expect(el.textContent).not.toContain('**');
});

test('LaTeX cua AI thanh ky tu doc duoc; trong code thi giu nguyen', async () => {
  const { el } = await ve('ky_tu là "u" $\\rightarrow$ **True**, độ phức tạp $O(n^2)$; code `x = "$\\rightarrow$"`');
  expect(el.textContent).toContain('ky_tu là "u" → True');
  expect(el.textContent).toContain('O(n²)');
  expect(el.querySelector('code')?.textContent).toBe('x = "$\\rightarrow$"');
});

test('`x**2 + y**2` trong code dong khong bi bien thanh chu dam', async () => {
  const { el } = await ve('Tính `x**2 + y**2` nhé');
  expect(el.querySelector('strong')).toBeNull();
  expect(el.querySelector('code')?.textContent).toBe('x**2 + y**2');
});
