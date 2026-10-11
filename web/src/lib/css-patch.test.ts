import { getProperty, listSelectors, setProperties } from './css-patch';

const CSS = `/* tieu de */
.card {
  padding: 8px;
  color: red;
}

@media (max-width: 600px) {
  .card { padding: 4px; }
}

h1 { margin: 0; }`;

test('sua mot thuoc tinh dang co, giu nguyen phan con lai cua tep', () => {
  const r = setProperties(CSS, '.card', { color: 'blue' });
  expect(r.changed).toBe(true);
  expect(r.created).toBe(false);
  expect(getProperty(r.css, '.card', 'color')).toBe('blue');
  expect(r.css).toContain('/* tieu de */');
  expect(r.css).toContain('@media (max-width: 600px)');
  expect(r.css).toContain('h1 { margin: 0; }');
  expect(getProperty(r.css, '.card', 'padding')).toBe('8px');
});

test('them thuoc tinh moi va tao rule moi khi selector chua co', () => {
  const r = setProperties(CSS, '#btn', { 'border-radius': '6px' });
  expect(r.created).toBe(true);
  expect(getProperty(r.css, '#btn', 'border-radius')).toBe('6px');
  expect(listSelectors(r.css)).toEqual(expect.arrayContaining(['.card', 'h1', '#btn']));
});

test('gia tri rong la xoa thuoc tinh; khong doi gi thi changed = false', () => {
  const r = setProperties(CSS, '.card', { color: '' });
  expect(getProperty(r.css, '.card', 'color')).toBeNull();
  expect(setProperties(CSS, '.card', {}).changed).toBe(false);
});
