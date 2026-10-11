import { adaptLessonCode, seedFilesFromLesson, TECH_FRONTEND } from './exercise-seed';
import { parseJsonLoose } from './json-loose';

test('trang HTML day du vao index.html; CSS thuan vao style.css; bai khong co code thi null', () => {
  expect(seedFilesFromLesson({ code: '<!DOCTYPE html><html><body>x</body></html>' }, 'htmlcss')).toEqual([{ name: 'index.html', code: '<!DOCTYPE html><html><body>x</body></html>' }]);
  expect(seedFilesFromLesson({ code: '.card { color: red; }' }, 'htmlcss')).toEqual([{ name: 'style.css', code: '.card { color: red; }' }]);
  expect(seedFilesFromLesson({ code: '   ' }, 'react')).toBeNull();
  expect(seedFilesFromLesson(undefined, 'react')).toBeNull();
});

test('React: bo import/export, tu gan component vao trang, them useState tu React', () => {
  const r = seedFilesFromLesson({ code: "import React, { useState } from 'react';\nexport default function Dem() {\n  const [n, setN] = useState(0);\n  return <b>{n}</b>;\n}" }, 'react')!;
  expect(r[0].name).toBe('App.jsx');
  expect(r[0].code).not.toMatch(/^\s*import /m);
  expect(r[0].code).not.toMatch(/export/);
  expect(r[0].code).toContain('function Dem()');
  expect(r[0].code).toContain("ReactDOM.createRoot(document.getElementById('root')).render(<Dem />);");
  expect(r[0].code.startsWith('const { useState')).toBe(true);
});

test('Vue them const {createApp...} = Vue; TS vao main.ts; dsa vao main.js', () => {
  expect(adaptLessonCode('const app = 1;', 'vue').startsWith('const { createApp')).toBe(true);
  expect(adaptLessonCode('createApp({}).mount("#app")', 'vue').startsWith('const {')).toBe(false);
  expect(seedFilesFromLesson({ code: 'let x: number = 1;' }, 'typescript')![0].name).toBe('main.ts');
  expect(seedFilesFromLesson({ code: 'console.log(1)' }, 'dsa')![0].name).toBe('main.js');
  expect(TECH_FRONTEND).toEqual(['htmlcss', 'react', 'vue', 'tailwind', 'typescript', 'dsa']);
});

describe('parseJsonLoose', () => {
  test('doc JSON boc trong ``` hoac co chu thua phia truoc', () => {
    expect(parseJsonLoose('```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(parseJsonLoose('Day la de: {"title":"X","hints":["a"]}')).toEqual({ title: 'X', hints: ['a'] });
  });

  test('JSON bi cat ngang (AI het token) van giu duoc phan da sinh ra', () => {
    expect(parseJsonLoose('{"title":"Bai tap","description":"Viet ham cong hai so","hints":["dung +", "kiem tra')).toMatchObject({ title: 'Bai tap', description: 'Viet ham cong hai so' });
  });

  test('khong co doi tuong JSON thi null; mang khong duoc coi la doi tuong', () => {
    expect(parseJsonLoose('xin loi, toi khong the')).toBeNull();
    expect(parseJsonLoose('["a","b"]')).toBeNull();
    expect(parseJsonLoose(undefined)).toBeNull();
  });
});
