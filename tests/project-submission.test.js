const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile, giaSupabase } = require('./helper.js');

// Dung dung hinh dang ma AIService.reviewProject tra ve
const REVIEW = {
  score: 78,
  status: 'good',
  summary: 'Code gọn, thiếu xử lý lỗi.',
  criteria: [
    { name: 'Cấu trúc project', score: 14, comment: '' },
    { name: 'Code quality', score: 16, comment: '' },
    { name: 'Logic & Algorithm', score: 15, comment: '' },
    { name: 'Error handling', score: 10, comment: '' },
    { name: 'Bonus & Creativity', score: 12, comment: '' }
  ],
  strengths: ['Đặt tên rõ ràng'],
  improvements: ['Thêm try/catch'],
  tips: []
};

function napHaiDichVu() {
  const sb = hopCat();
  const db = giaSupabase();
  sb.supabase = { createClient: () => db.client };
  const AuthService = napFile(sb, 'auth-service.js', 'AuthService');
  const AIService = napFile(sb, 'ai-service.js', 'AIService');
  AuthService.init();
  db.dangNhap({ id: 'u1' });
  return { AuthService, AIService, db };
}

test('bai nop luu duoc va mang dung diem/nhan xet tu ket qua cham', async () => {
  const { AuthService, AIService, db } = napHaiDichVu();
  const banNop = AIService.buildSubmission({
    review: REVIEW,
    idea: { name: 'Todo App', description: 'Quản lý việc cần làm' },
    files: [{ name: 'app.js', lang: 'javascript', code: 'let a = 1;' }, { name: 'index.html', lang: 'html', code: '<p>' }],
    difficulty: 'mid',
    topic: 'web'
  });
  await AuthService.saveProjectSubmission(banNop);

  const dong = db.ghi.find(g => g.bang === 'project_submissions' && g.op === 'insert').payload;
  assert.strictEqual(dong.project_name, 'Todo App');
  assert.strictEqual(dong.project_description, 'Quản lý việc cần làm');
  assert.strictEqual(dong.difficulty_level, 'mid');
  assert.strictEqual(dong.score_overall, 78);
  assert.strictEqual(dong.score_code_quality, 80);   // 16/20
  assert.strictEqual(dong.score_functionality, 75);  // Logic 15/20
  assert.strictEqual(dong.score_best_practices, 60); // trung binh cau truc 14 + xu ly loi 10
  assert.strictEqual(dong.score_creativity, 60);     // 12/20
  assert.strictEqual(dong.ai_feedback, 'Code gọn, thiếu xử lý lỗi.');
  assert.deepStrictEqual([...dong.ai_strengths], ['Đặt tên rõ ràng']);
  assert.deepStrictEqual([...dong.ai_improvements], ['Thêm try/catch']);
  assert.deepStrictEqual([...dong.languages_used], ['javascript', 'html']);
  assert.strictEqual(dong.files.length, 2);
});

test('AI doi ten tieu chi thi van map theo vi tri, khong de null', () => {
  const { AIService } = napHaiDichVu();
  const review = { ...REVIEW, criteria: REVIEW.criteria.map((c, i) => ({ ...c, name: 'Tiêu chí ' + i })) };
  const b = AIService.buildSubmission({ review, idea: { name: 'X' }, files: [] });
  assert.strictEqual(b.scoreCodeQuality, 80);
  assert.strictEqual(b.scoreCreativity, 60);
});
