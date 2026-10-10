const { test } = require('node:test');
const assert = require('node:assert');
const { hopCat, napFile } = require('./helper.js');

// Nap CareerAdvisor voi AuthService/fetch gia. jobs la danh sach /api/jobs tra ve.
function napCoVan({ jobs, tongBai = 0, kyNang = [] }) {
  const sb = hopCat();
  sb.URLSearchParams = URLSearchParams;
  sb.I18n = { t: k => k, getLang: () => 'vi' };
  sb.AuthService = {
    getUserStats: async () => ({
      techBreakdown: kyNang.map(tech => ({ tech, completed: 1 })),
      totalLessonsCompleted: tongBai,
      projects: []
    })
  };
  sb.fetch = async () => ({ ok: true, json: async () => ({ jobs }) });
  return napFile(sb, 'career-advisor.js', 'CareerAdvisor');
}

test('nguoi moi chua hoc bai nao van nhan duoc danh sach viec lam', async () => {
  const CA = napCoVan({
    jobs: [{ title: 'Senior Java Developer', tags: ['java'], description_snippet: 'spring' }]
  });
  const ds = await CA.searchJobs('java');
  assert.strictEqual(ds.length, 1);
  assert.strictEqual(ds[0].status, 'target');
});

test('tin nhan tim viec o "đà nẵng" gan dung dia diem vao tu khoa tim kiem', async () => {
  const sb = hopCat();
  sb.URLSearchParams = URLSearchParams;
  sb.AbortController = AbortController;
  sb.I18n = { t: k => k, getLang: () => 'vi' };
  sb.AuthService = {
    isConfigured: () => false,
    getUserStats: async () => ({ techBreakdown: [], totalLessonsCompleted: 0, projects: [] })
  };
  const timKiem = [];
  sb.fetch = async url => {
    if (url === '/api/ai') return { ok: true, status: 200, json: async () => ({ content: [{ text: 'Bạn nên học thêm.' }] }) };
    timKiem.push(new URL(url, 'http://x').searchParams.get('search'));
    return { ok: true, json: async () => ({ jobs: [] }) };
  };
  const CA = napFile(sb, 'career-advisor.js', 'CareerAdvisor');
  await CA.sendMessage('tìm việc react ở đà nẵng');
  assert.strictEqual(timKiem.length, 1);
  assert.match(timKiem[0], /Đà Nẵng$/);
});

test('mot viec khong khop ky nang khong lam mat ca danh sach', async () => {
  const CA = napCoVan({
    tongBai: 20,
    kyNang: ['python'],
    jobs: [
      { title: 'Python Intern', tags: ['python'], description_snippet: '' },
      { title: 'Golang Engineer', tags: ['go'], description_snippet: 'kubernetes' }
    ]
  });
  const ds = await CA.searchJobs('developer');
  assert.strictEqual(ds.length, 2);
});
