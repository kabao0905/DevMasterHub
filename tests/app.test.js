const { test } = require('node:test');
const vm = require('node:vm');
const assert = require('node:assert');
const { napApp, giaSupabase, choXong } = require('./helper.js');

const baiHoc = (techId, them = {}) => ({
  [techId]: {
    id: techId, name: techId, icon: '📦', color: '#fff', gradient: '#000', category: 'language',
    levels: [{ id: 'newbie', name: 'Newbie', lessons: [{ id: 'l1', title: 'Bài 1', theory: '<p>lý thuyết</p>', lang: 'python', ...them }] }]
  }
});

// AuthService toi gian cho cac bai khong can dang nhap
const authTat = { init: () => false, isConfigured: () => false };

async function moVaDangNhap({ duLieu = {}, ...tuyChon } = {}) {
  const db = giaSupabase({ profiles: [{ id: 'u1', username: 'an' }], ...duLieu });
  const a = napApp({ ...tuyChon, supabase: db.client });
  a.App.init();
  await choXong();          // nhu that: getSession tra ve null truoc, roi nguoi dung moi dang nhap
  db.dangNhap({ id: 'u1' });
  await choXong();
  return { ...a, db };
}

test('dang nhap xong thi vao Dashboard, khong ket o man hinh dang nhap', async () => {
  const a = await moVaDangNhap();
  assert.ok(a.main.innerHTML.includes('dashboardTitle'), a.main.innerHTML.slice(0, 120));
});

test('My Projects chua co bai nop chi tai danh sach mot lan, khong goi Supabase vo han', async () => {
  const a = await moVaDangNhap({ duLieu: { project_submissions: [] } });
  a.App.goToMyProjects();
  await choXong(30);
  const soLan = a.db.doc.filter(q => q.bang === 'project_submissions').length;
  assert.strictEqual(soLan, 1);
});

test('dang nhap sai mat khau: hien loi va tra nut ve trang thai binh thuong', async () => {
  const a = napApp({
    dichVu: {
      AuthService: {
        init: () => true, isConfigured: () => true, onAuthChange() {}, getSession: async () => null,
        login: async () => { throw new Error('Sai tên đăng nhập hoặc mật khẩu'); }
      }
    }
  });
  a.App.init();
  a.tao('auth-username').value = 'an';
  a.tao('auth-password').value = 'sai';
  const loi = a.tao('auth-error');
  const nut = a.tao('auth-submit-btn');

  await a.App.handleAuth({ preventDefault() {} });

  assert.strictEqual(loi.textContent, 'Sai tên đăng nhập hoặc mật khẩu');
  assert.strictEqual(nut.disabled, false);
  assert.strictEqual(nut.textContent, 'authLogin');
});

const IDEA_A = { id: 'a', idea: { name: 'Idea A', description: 'mô tả' }, savedAt: '2026-01-01T00:00:00Z', source: 'topic', topic: 'game' };

test('xoa idea thi cache localStorage cung mat idea do', () => {
  const a = napApp({ dichVu: { AuthService: authTat }, luuTru: { devmaster_hub_ideas_cache: [IDEA_A] } });
  a.App.init();
  a.App.deleteSavedIdea('a');
  const cache = JSON.parse(a.sb.localStorage.getItem('devmaster_hub_ideas_cache') || '[]');
  assert.deepStrictEqual(cache.map(x => x.id), []);
});

test('server khong con idea nao thi cache cu khong duoc hoi sinh idea da xoa', async () => {
  const a = await moVaDangNhap({ duLieu: { saved_ideas: [] }, luuTru: { devmaster_hub_ideas_cache: [IDEA_A] } });
  a.App.goToSavedIdeas();
  assert.ok(!a.main.innerHTML.includes('Idea A'), 'idea da xoa van hien');
});

test('tick mot bai chi ghi dung mot dong, khong ghi de completed_at cua cac bai cu', async () => {
  const cu = ['l1', 'l2', 'l3'].map(id => ({ tech_id: 'py', level_id: 'newbie', lesson_id: id, completed: true }));
  const a = await moVaDangNhap({ duLieu: { lesson_progress: cu } });
  a.db.ghi.length = 0;

  a.App.markComplete('py', 'newbie', 'l4');
  await choXong();

  const dong = a.db.ghi
    .filter(g => g.bang === 'lesson_progress')
    .flatMap(g => (Array.isArray(g.payload) ? g.payload : [g.payload]));
  assert.deepStrictEqual(dong.map(d => d.lesson_id), ['l4']);
});

test('nhan xet AI cua bai tap duoc escape, con de bai goc tu giao trinh giu HTML', async () => {
  const a = napApp({
    curriculum: baiHoc('python', { exercise: 'Viết hàm <code>tong()</code>' }),
    dichVu: {
      AuthService: authTat,
      AIService: {
        checkHealth: async () => ({ aiEnabled: true }),
        checkAnswer: async () => ({
          score: 40, status: 'partial',
          feedback: 'Thiếu <img src=x onerror=alert(1)>',
          errors: ['<b>sai cú pháp</b>'],
          suggestions: ['Đóng thẻ <div>']
        })
      }
    }
  });
  a.App.init();
  a.App.openLesson('python', 'newbie', 'l1');
  a.tao('answer-editor').value = 'print(1)';
  const khung = a.tao('exercise-container');

  await a.App.checkAnswer('python.newbie.l1');

  assert.ok(!khung.innerHTML.includes('<img src=x'), 'feedback chua escape');
  assert.ok(!khung.innerHTML.includes('<b>sai'), 'errors chua escape');
  assert.ok(!khung.innerHTML.includes('Đóng thẻ <div>'), 'suggestions chua escape');
  assert.ok(khung.innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(khung.innerHTML.includes('Viết hàm <code>tong()</code>'), 'de bai giao trinh bi escape nham');
});

test('the viec lam khong nhung link javascript: hay thuoc tinh la tu du lieu ben thu ba', async () => {
  const a = napApp({
    dichVu: {
      AuthService: authTat,
      CareerAdvisor: {
        loadChat: async () => [],
        searchJobs: async () => [{
          title: 'Dev', company_name: 'C', url: 'javascript:alert(1)',
          company_logo: 'x" onerror="alert(1)', location: 'Remote', tags: [], status: 'ready'
        }]
      }
    }
  });
  a.App.init();
  a.sb.prompt = () => 'react';
  a.App.goToCareer();
  await a.App.searchCareerJobs();

  assert.ok(a.main.innerHTML.includes('Dev'), 'the viec lam phai duoc ve');
  assert.ok(!a.main.innerHTML.includes('javascript:'), 'con link javascript:');
  assert.ok(!a.main.innerHTML.includes('onerror="alert(1)"'), 'logo pha vo thuoc tinh src');
});

test('khoi code trong chat AI Tutor giu nguyen xuong dong', async () => {
  const a = napApp({
    curriculum: baiHoc('python'),
    dichVu: {
      AuthService: authTat,
      AIService: { checkHealth: async () => ({ aiEnabled: true }), chatAboutLesson: async () => 'Ví dụ:\n```cpp\nint *a;\nreturn 0;\n```' }
    }
  });
  a.App.init();
  a.App.openLesson('python', 'newbie', 'l1');
  a.tao('lesson-chat-theory-input').value = 'cho ví dụ';
  const hop = a.tao('lesson-chat-theory-messages');

  await a.App.sendLessonChat('python.newbie.l1', 'theory');

  assert.ok(hop.innerHTML.includes('int *a;\nreturn 0;'), hop.innerHTML);
});

test('goi y chat co dau nhay (tieng Phap) van la JS hop le trong onclick', () => {
  const dich = { moreExamples: "Donne-moi plus d'exemples de code concrets" };
  const a = napApp({
    curriculum: baiHoc('python'),
    dichVu: {
      AuthService: authTat,
      I18n: { t: k => dich[k] || k, getLang: () => 'fr', translateTitle: t => t, getTechDesc: (i, d) => d || '', translateDynamic: async t => t }
    }
  });
  a.App.init();
  a.App.openLesson('python', 'newbie', 'l1');
  const giaiMa = s => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const handler = [...a.main.innerHTML.matchAll(/onclick="(App\.sendLessonChat[^"]*)"/g)].map(m => giaiMa(m[1]));
  assert.ok(handler.length >= 3, 'khong thay nut goi y');
  // Chi bien dich de kiem cu phap, khong chay
  for (const js of handler) assert.doesNotThrow(() => new vm.Script(js), js);
});

test('bai React: chi mo Sandpack khi vao tab Bai tap, va chi mo mot lan', () => {
  const lan = [];
  const a = napApp({
    curriculum: baiHoc('react', { code: 'function App() { return <p>Hi</p>; }' }),
    dichVu: { AuthService: authTat, SandpackLive: { renderStudio: (...x) => lan.push(x) } }
  });
  a.App.init();
  a.App.openLesson('react', 'newbie', 'l1');
  a.chayHenGio();
  assert.strictEqual(lan.length, 0, 'dang o tab Ly thuyet ma da tai Sandpack');

  a.App.switchTab('exercise');
  a.chayHenGio();
  a.App.switchTab('theory');
  a.App.switchTab('exercise');
  a.chayHenGio();
  assert.strictEqual(lan.length, 1);
});

test('bai An ninh mang: terminal chi ve mot lan, doi tab khong xoa man hinh', () => {
  const lan = [];
  const a = napApp({
    curriculum: baiHoc('cybersecurity'),
    dichVu: { AuthService: authTat, CyberTerminal: { renderStudio: id => lan.push(id) } }
  });
  a.App.init();
  a.App.openLesson('cybersecurity', 'newbie', 'l1');
  a.chayHenGio();
  a.App.switchTab('exercise');
  a.chayHenGio();
  a.App.switchTab('quiz');
  a.App.switchTab('exercise');
  a.chayHenGio();
  assert.deepStrictEqual(lan, ['lesson-cyber-terminal-mount']);
});

test('dang xuat roi nguoi khac dang nhap thi khong thay chat tu van cua nguoi truoc', async () => {
  const chat = [[{ role: 'user', content: 'Bí mật của An' }], []];
  const db = giaSupabase({ profiles: [{ id: 'u1', username: 'an' }] });
  const a = napApp({
    supabase: db.client,
    dichVu: { CareerAdvisor: { loadChat: async () => chat.shift() || [], rewindChat() {} } }
  });
  a.App.init();
  await choXong();
  db.dangNhap({ id: 'an' });
  await choXong();
  a.App.goToCareer();
  await choXong();
  assert.ok(a.main.innerHTML.includes('Bí mật của An'), 'chuan bi: chat cua An phai hien');

  await a.Auth.logout();
  await choXong();
  db.dangNhap({ id: 'binh' });
  await choXong();
  a.App.goToCareer();
  await choXong();
  assert.ok(!a.main.innerHTML.includes('Bí mật của An'), 'Binh thay chat cua An');
});

test('co app React: mo link sau khi chua dang nhap thi dang nhap ngay tai cho, xong quay lai dung bai', async () => {
  const db = giaSupabase({ profiles: [{ id: 'u1', username: 'an' }] });
  const a = napApp({
    curriculum: baiHoc('python'),
    supabase: db.client,
    duongDan: '/lesson/python/newbie/l1',
    dichVu: { __REACT_VIEWS: ['dashboard', 'auth'] }
  });
  const diToi = [];
  a.sb.location.assign = u => diToi.push(u);

  a.App.init();
  await choXong();
  // Tai trang sang /auth thi mat link sau, Back quay lai bi day di tiep, va may tim kiem
  // coi moi trang bai hoc la chuyen huong toi /auth
  assert.deepStrictEqual(diToi, []);
  assert.ok(a.main.innerHTML.includes('auth-form'), 'phai hien man dang nhap ngay tai cho');

  db.dangNhap({ id: 'u1' });
  await choXong();
  assert.ok(a.main.innerHTML.includes('Bài 1'), 'dang nhap xong phai quay lai bai dang mo');
  assert.deepStrictEqual(diToi, []);
});

test('co app React: Dashboard va dang xuat tai trang moi sang React, view khac van o lai app cu', async () => {
  const db = giaSupabase({ profiles: [{ id: 'u1', username: 'an' }] });
  const a = napApp({
    curriculum: baiHoc('python'),
    supabase: db.client,
    duongDan: '/roadmap/python',
    dichVu: { __REACT_VIEWS: ['dashboard', 'auth'] }
  });
  const diToi = [];
  a.sb.location.assign = u => diToi.push(u);
  a.App.init();
  await choXong();
  db.dangNhap({ id: 'u1' });
  await choXong();

  a.App.goToDashboard();
  a.App.openRoadmap('python');
  assert.ok(a.main.innerHTML.includes('python'), 'roadmap phai do app cu ve');
  await a.Auth.logout();
  await choXong();

  assert.deepStrictEqual(diToi, ['/', '/auth']);
});
