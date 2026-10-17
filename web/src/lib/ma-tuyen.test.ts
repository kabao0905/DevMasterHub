import { maTuyen, chuTrenNen } from './ma-tuyen';

test('moi cong nghe co ma tuyen ngan (toi da 3 ky tu) de bien luon tron deu', () => {
  expect(maTuyen({ id: 'python', name: 'Python' })).toBe('PY');
  expect(maTuyen({ id: 'cpp', name: 'C++' })).toBe('C++');
  expect(maTuyen({ id: 'kubernetes', name: 'Kubernetes' })).toBe('K8S');
  for (const id of ['java', 'nodejs', 'htmlcss', 'jest', 'docker', 'swift', 'dart']) {
    expect(maTuyen({ id, name: id }).length).toBeLessThanOrEqual(3);
  }
});

test('cong nghe moi chua co ma thi lay chu cai dau cua ten, khong qua 3 ky tu', () => {
  expect(maTuyen({ id: 'elixir', name: 'Elixir' })).toBe('EL');
  expect(maTuyen({ id: 'web-assembly', name: 'Web Assembly' })).toBe('WA');
  expect(maTuyen({ id: 'x', name: '' })).toBe('X');
});

test('chu tren bien: nen sang (React xanh nhat, Zig vang) dung chu toi; nen dam dung chu trang', () => {
  expect(chuTrenNen('#61DAFB')).toBe('toi');
  expect(chuTrenNen('#F7A41D')).toBe('toi');
  expect(chuTrenNen('#00599C')).toBe('trang');
  expect(chuTrenNen('#363636')).toBe('trang');
  expect(chuTrenNen('khong-phai-mau')).toBe('trang');
});
