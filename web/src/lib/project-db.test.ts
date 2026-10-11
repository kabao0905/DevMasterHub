// Supabase cho Project Lab: dung cot nhu auth-service.js cu, bao loi thay vi nuot.
import { giaSupabase } from '@/test/gia-supabase';
import { luuBaiNop, luuYTuong, taiBaiNop, taiYTuong, xoaYTuong, type YTuongDaLuu } from './project-db';
import { chuanHoaKetQua, taoBanNop } from './project-ai';

const YT: YTuongDaLuu = {
  id: 'abc', savedAt: '2026-10-11T08:30:00.000Z', source: 'topic', topic: 'Game', level: null,
  idea: { name: 'Snake', description: 'Rắn', difficulty: 'mid', techStack: [], requirements: [], steps: [], bonusFeatures: [], estimatedTime: '' }
};

test('luu idea: upsert dung cot saved_ideas (saved_at, khong phai savedAt) va gan user_id', async () => {
  const g = giaSupabase();
  await luuYTuong(g.client, 'u1', YT);
  expect(g.truyVan[0]).toMatchObject({ bang: 'saved_ideas', op: 'upsert' });
  expect(g.truyVan[0].payload).toEqual({ id: 'abc', user_id: 'u1', idea: YT.idea, source: 'topic', topic: 'Game', level: null, saved_at: YT.savedAt });
});

test('tai idea: doi saved_at thanh savedAt (ban cu hien "Invalid Date"), bo dong hong, chi cua minh', async () => {
  const g = giaSupabase({ bang: { saved_ideas: [
    { id: 'abc', user_id: 'u1', idea: YT.idea, source: 'topic', topic: 'Game', level: null, saved_at: YT.savedAt },
    { id: 'x', user_id: 'u1', idea: { khong: 'co ten' }, source: 'level', saved_at: YT.savedAt },
    { id: 'y', user_id: 'u1', idea: { name: 'Blog', difficulty: 'senior' }, source: 'level', level: 'senior', saved_at: '2026-10-10T00:00:00Z' }
  ] } });
  const ds = await taiYTuong(g.client, 'u1');
  expect(ds.map(d => d.id)).toEqual(['abc', 'y']);
  expect(ds[0]).toEqual(YT);
  expect(ds[1]).toMatchObject({ source: 'level', level: 'senior', topic: null });
  expect(g.truyVan[0].dieuKien).toEqual([['user_id', 'u1']]);
});

test('xoa idea loc ca id lan user_id; Supabase bao loi thi nem loi (ban cu nuot)', async () => {
  const g = giaSupabase();
  await xoaYTuong(g.client, 'u1', 'abc');
  expect(g.truyVan[0]).toMatchObject({ bang: 'saved_ideas', op: 'delete', dieuKien: [['id', 'abc'], ['user_id', 'u1']] });
  const hong = giaSupabase({ loiGhi: { saved_ideas: 'mất mạng' } });
  await expect(xoaYTuong(hong.client, 'u1', 'abc')).rejects.toThrow('mất mạng');
  await expect(luuYTuong(hong.client, 'u1', YT)).rejects.toThrow('mất mạng');
});

test('luu bai nop: insert dung cot project_submissions', async () => {
  const g = giaSupabase();
  const ban = taoBanNop({
    review: chuanHoaKetQua({ score: 78, summary: 'Ổn', criteria: [{ name: 'Code quality', score: 16 }], strengths: ['Gọn'] }),
    idea: YT.idea, files: [{ name: 'a.js', lang: 'javascript', code: 'x' }], difficulty: 'mid', topic: 'Game'
  });
  await luuBaiNop(g.client, 'u1', ban);
  const d = g.truyVan[0].payload as Record<string, unknown>;
  expect(g.truyVan[0]).toMatchObject({ bang: 'project_submissions', op: 'insert' });
  expect(d).toMatchObject({
    user_id: 'u1', project_name: 'Snake', project_description: 'Rắn', difficulty_level: 'mid', topic: 'Game',
    score_overall: 78, ai_feedback: 'Ổn', ai_strengths: ['Gọn'], ai_improvements: [], languages_used: ['javascript']
  });
  expect(d.files).toEqual([{ name: 'a.js', lang: 'javascript', code: 'x' }]);
  await expect(luuBaiNop(giaSupabase({ loiGhi: { project_submissions: 'violates' } }).client, 'u1', ban)).rejects.toThrow('violates');
});

test('tai bai nop: chuan hoa cot null/sai kieu de giao dien khong vo', async () => {
  const g = giaSupabase({ bang: { project_submissions: [
    { id: 7, user_id: 'u1', project_name: '<b>X</b>', project_description: null, difficulty_level: 'mid', files: null, score_overall: 81,
      ai_feedback: null, ai_strengths: null, ai_improvements: ['a', { b: 1 }], languages_used: ['js'], submitted_at: '2026-10-11T00:00:00Z' }
  ] } });
  const ds = await taiBaiNop(g.client, 'u1');
  expect(ds[0]).toMatchObject({ id: '7', project_name: '<b>X</b>', project_description: '', files: [], ai_feedback: '', ai_strengths: [], ai_improvements: ['a'] });
  expect(g.truyVan[0].dieuKien).toEqual([['user_id', 'u1']]);
});
