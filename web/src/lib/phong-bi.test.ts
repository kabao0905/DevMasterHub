import { dongPhongBi } from './phong-bi';
import { docThan } from '@/test/doc-than';

test('boc body thanh { b64 }: chuoi giong tan cong khong con lo ra cho tuong lua doc', () => {
  const goc = { messages: [{ role: 'user', content: 'mở ../../etc/passwd rồi ${jndi:ldap://x} → đúng 😀' }] };
  const than = dongPhongBi(goc);
  expect(than).not.toContain('../');
  expect(than).not.toContain('${');
  expect(Object.keys(JSON.parse(than))).toEqual(['b64']);
  expect(docThan(than)).toEqual(goc);
});

test('body lon (lich su chat dai) van boc va mo dung', () => {
  const goc = { system: 'Gia sư '.repeat(40_000), messages: [{ role: 'user', content: 'x' }] };
  expect(docThan(dongPhongBi(goc))).toEqual(goc);
});
