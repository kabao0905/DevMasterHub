import { docCacheDich, ghiCacheDich } from './use-dich-noi-dung';

test('cache dich may giu toi da 60 muc moi ngon ngu, bo muc cu nhat; ngon ngu khac khong anh huong', () => {
  ghiCacheDich('ja', 'giu', 'ban giu');
  for (let i = 0; i < 61; i++) ghiCacheDich('en', 'k' + i, 'ban ' + i);
  const khoaEn = Object.keys(localStorage).filter(k => k.startsWith('devmaster_hub_dich_en_') && !k.endsWith('__ds'));
  expect(khoaEn).toHaveLength(60);
  expect(docCacheDich('en', 'k0')).toBeNull();
  expect(docCacheDich('en', 'k60')).toBe('ban 60');
  expect(docCacheDich('ja', 'giu')).toBe('ban giu');
});

test('doc lai mot muc thi no thanh moi nhat (khong bi bo truoc)', () => {
  for (let i = 0; i < 60; i++) ghiCacheDich('fr', 'k' + i, 'ban ' + i);
  expect(docCacheDich('fr', 'k0')).toBe('ban 0');
  ghiCacheDich('fr', 'moi', 'ban moi');
  expect(docCacheDich('fr', 'k0')).toBe('ban 0');
  expect(docCacheDich('fr', 'k1')).toBeNull();
});
