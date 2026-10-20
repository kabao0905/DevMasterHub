import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { canhBaoChay, ngonNguChay } from './chay-code';

type Bai = { id?: string; lang?: string; code?: string };
const THU_MUC = join(__dirname, '..', '..', '..', 'data', 'curriculum');
const tatCaBai: Record<string, Bai> = {};
for (const tep of readdirSync(THU_MUC)) {
  const ds: Bai[] = [];
  const duyet = (o: unknown): void => {
    if (Array.isArray(o)) return o.forEach(duyet);
    if (o && typeof o === 'object') {
      const b = o as Bai;
      if (typeof b.code === 'string' && b.lang) ds.push(b);
      Object.values(o).forEach(duyet);
    }
  };
  duyet(JSON.parse(readFileSync(join(THU_MUC, tep), 'utf8')));
  for (const b of ds) tatCaBai[`${tep.replace('.json', '')}/${b.id}`] = b;
}
const bai = (k: string) => {
  const b = tatCaBai[k];
  if (!b) throw new Error('khong co bai ' + k);
  return b;
};

test('ngonNguChay: nhan bi danh, biet chay o trinh duyet hay may chu', () => {
  expect(ngonNguChay('Python')).toMatchObject({ id: 'python', noi: 'trinh-duyet', duPhong: true });
  expect(ngonNguChay('sql')).toMatchObject({ id: 'sql', noi: 'trinh-duyet', duPhong: false });
  expect(ngonNguChay('c#')).toMatchObject({ id: 'csharp', noi: 'may-chu' });
  expect(ngonNguChay('golang')?.id).toBe('go');
  expect(ngonNguChay('yaml')).toBeNull();
  expect(ngonNguChay('constructor')).toBeNull();
  expect(ngonNguChay(undefined)).toBeNull();
});

test('moi ngon ngu lap trinh trong giao trinh deu co cach chay', () => {
  const khongChay = new Set(['javascript', 'typescript', 'css', 'html', 'markup', 'yaml', 'nginx', 'dockerfile', 'graphql']);
  const thieu = [...new Set(Object.values(tatCaBai).map(b => b.lang!))].filter(l => !khongChay.has(l) && !ngonNguChay(l));
  expect(thieu).toEqual([]);
});

test('canhBaoChay: bai mau chay doc lap thi khong canh bao', () => {
  for (const k of ['csharp/collections', 'python/intro', 'java/intro', 'go/intro', 'rust/intro', 'csharp/intro', 'kotlin/intro', 'dart/intro', 'scala/intro', 'zig/intro', 'php/intro', 'ruby/intro', 'lua/intro', 'sql/joins']) {
    const b = bai(k);
    expect(canhBaoChay(b.lang, b.code!), k).toBeNull();
  }
});

test('canhBaoChay: bai mau can framework hoac thieu main thi noi ro', () => {
  expect(canhBaoChay('java', bai('java/spring-boot').code!)).toEqual({ loai: 'thu-vien', ten: 'Spring Boot' });
  expect(canhBaoChay('python', bai('python/web-frameworks').code!)).toEqual({ loai: 'thu-vien', ten: 'FastAPI' });
  expect(canhBaoChay('dart', bai('dart/flutter-ui').code!)).toEqual({ loai: 'thu-vien', ten: 'Flutter' });
  expect(canhBaoChay('php', bai('php/laravel').code!)).toEqual({ loai: 'thu-vien', ten: 'Laravel' });
  expect(canhBaoChay('ruby', bai('ruby/rails').code!)).toEqual({ loai: 'thu-vien', ten: 'Ruby on Rails' });
  expect(canhBaoChay('rust', bai('rust/web').code!)).toMatchObject({ loai: 'thu-vien' });
  expect(canhBaoChay('go', 'package main\nimport "fmt"\nfunc helper() {}')).toEqual({ loai: 'thieu-main' });
  expect(canhBaoChay('csharp', 'Console.WriteLine("top-level");')).toBeNull();
  expect(canhBaoChay('csharp', 'public class A {\n    public int X() { return 1; }\n}')).toEqual({ loai: 'thieu-main' });
});
