const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { lessonHash } = require('../lib/quiz-bank');
const SEED = require('../data/quiz-bank/python/newbie/intro.vi.json');
let validateBank, drawQuiz, prepare, inventory, importResults, xuatDuLieu;
before(async () => {
  ({ validateBank, drawQuiz } = await import('../shared/quiz-bank.mjs'));
  ({ prepare, inventory, importResults } = await import('../scripts/quiz-bank.mjs'));
  ({ xuatDuLieu } = await import('../scripts/xuat-du-lieu.mjs'));
});
const clone = x => structuredClone(x);
function temp(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz-bank-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function fixture(t) {
  const root = temp(t);
  fs.mkdirSync(path.join(root, 'curriculum'));
  const tech = clone(require('../data/curriculum/python.json'));
  tech.levels = [tech.levels[0]];
  tech.levels[0].lessons = [tech.levels[0].lessons[0]];
  fs.writeFileSync(path.join(root, 'curriculum/python.json'), JSON.stringify(tech));
  fs.copyFileSync(path.join(__dirname, '../data/i18n.json'), path.join(root, 'i18n.json'));
  return root;
}
function resultsFor(spec) {
  return spec.items.map((item, index) => {
    const start = index * 20;
    return { custom_id: item.id, result: { type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ questions: SEED.questions.slice(start, start + 20) }) }] } } };
  });
}

test('real seed is bound to current lesson, has 80 distinct questions and exact 20/40/20 counts', () => {
  const lesson = require('../data/curriculum/python.json').levels[0].lessons[0];
  assert.deepEqual(validateBank(SEED, { tech: 'python', level: 'newbie', lesson: 'intro', language: 'vi', sourceHash: lessonHash(lesson) }), []);
  assert.deepEqual(SEED.questions.reduce((acc, q) => { acc[q.difficulty]++; return acc; }, { easy: 0, medium: 0, hard: 0 }), { easy: 20, medium: 40, hard: 20 });
  assert.match(SEED.review, /thủ công/);
});

test('validation rejects wrong ratios, duplicate choices/questions, blank rationale and stale content', () => {
  for (const [change, pattern] of [
    [b => { b.questions[0].difficulty = 'medium'; }, /easy: expected 20/],
    [b => { b.questions[0].options[1] = b.questions[0].options[0]; }, /duplicate options/],
    [b => { b.questions[1] = { ...b.questions[0], id: 'another' }; }, /duplicate question/],
    [b => { b.questions[0].explanation = ' '; }, /explanation is required/],
    [b => { b.questions[0].correct = 4; }, /correct must/],
    [b => { b.questions.pop(); }, /exactly 80/],
    [b => { b.review = ''; }, /review note/]
  ]) {
    const b = clone(SEED); change(b);
    assert.match(validateBank(b).join('\n'), pattern);
  }
  assert.match(validateBank(SEED, { sourceHash: 'a'.repeat(64) }).join('\n'), /Lesson changed/);
  // Existing curriculum IDs such as Zig c_interop are valid path segments.
  assert.deepEqual(validateBank({ ...SEED, lesson: 'c_interop' }, { lesson: 'c_interop' }), []);
  for (const lesson of ['../c_interop', 'a/b', 'a\\b', 'a%2fb', '.', '']) {
    assert.match(validateBank({ ...SEED, lesson }).join('\n'), /Invalid lesson/);
  }
  // Programming alternatives may differ only in case.
  assert.deepEqual(validateBank(SEED), []);
});

test('20 consecutive quizzes exhaust bank without repeats; options keep correct answer when shuffled', () => {
  let state = 42;
  const random = () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  let seen = [], used = new Set();
  for (let i = 0; i < 20; i++) {
    const next = drawQuiz(SEED, seen, random);
    assert.equal(next.questions.length, 4);
    assert.deepEqual(next.questions.reduce((a, q) => { a[q.difficulty]++; return a; }, { easy: 0, medium: 0, hard: 0 }), { easy: 1, medium: 2, hard: 1 });
    for (const q of next.questions) {
      assert.equal(used.has(q.id), false);
      used.add(q.id);
      const original = SEED.questions.find(x => x.id === q.id);
      assert.equal(q.options[q.correct], original.options[original.correct]);
    }
    seen = next.seen;
  }
  assert.equal(used.size, 80);
  assert.equal(drawQuiz(SEED, seen, random).seen.length, 4);
  assert.throws(() => drawQuiz({ ...SEED, status: 'draft' }), /not approved/);
});

test('export publishes only approved valid banks, includes source metadata, rejects stale questions', t => {
  const root = fixture(t), dest = temp(t);
  const dir = path.join(root, 'quiz-bank/python/newbie');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'intro.vi.json');
  fs.writeFileSync(file, JSON.stringify(SEED));
  xuatDuLieu({ thuMucDuLieu: root, thuMucRa: dest });
  let lesson = JSON.parse(fs.readFileSync(path.join(dest, 'curriculum/python.json'))).levels[0].lessons[0];
  const metadata = lesson.quizBanks.vi;
  assert.equal(metadata.count, 80);
  assert.equal(metadata.sourceHash, SEED.sourceHash);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dest, metadata.url))), SEED);
  fs.writeFileSync(file, JSON.stringify({ ...SEED, status: 'draft' }));
  xuatDuLieu({ thuMucDuLieu: root, thuMucRa: dest });
  lesson = JSON.parse(fs.readFileSync(path.join(dest, 'curriculum/python.json'))).levels[0].lessons[0];
  assert.equal(lesson.quizBanks, undefined);
  fs.writeFileSync(file, JSON.stringify({ ...SEED, sourceHash: 'a'.repeat(64) }));
  assert.throws(() => xuatDuLieu({ thuMucDuLieu: root, thuMucRa: dest }), /Lesson changed/);
});

test('offline jobs cover missing lessons in four shards, preserve explicit model and token settings', t => {
  const root = fixture(t), output = path.join(temp(t), 'prepared');
  assert.throws(() => prepare({ output, dataRoot: root }), /explicitly chosen/);
  const summary = prepare({ output, dataRoot: root, model: 'claude-test-only', params: { max_tokens: 18000, thinking: { type: 'enabled', budget_tokens: 4000 } } });
  assert.equal(summary.requests, 4);
  assert.equal(summary.questions, 80);
  assert.equal(summary.maximumOutputTokens, 72000);
  assert.equal(summary.submitted, false);
  const spec = JSON.parse(fs.readFileSync(path.join(output, 'spec.json')));
  assert.equal(spec.model, 'claude-test-only');
  assert.equal(spec.params.thinking.budget_tokens, 4000);
  assert.ok(spec.items.every(i => i.prompt.includes('Hello World') && i.prompt.includes('Your name:')));
  assert.throws(() => prepare({ output, dataRoot: root, model: 'claude-test-only' }), /already exists/);
});

test('import requires all complete shard outputs and validates before saving drafts; never auto-publishes', t => {
  const root = fixture(t), job = path.join(temp(t), 'job'), out = path.join(temp(t), 'drafts');
  prepare({ output: job, dataRoot: root, model: 'claude-test-only' });
  const spec = JSON.parse(fs.readFileSync(path.join(job, 'spec.json')));
  const results = resultsFor(spec);
  const file = path.join(job, 'results.jsonl');
  const save = rs => fs.writeFileSync(file, rs.map(x => JSON.stringify(x)).join('\n'));
  save(results.slice(0, 3));
  assert.throws(() => importResults({ prepared: job, results: file, output: out, dataRoot: root }), /Missing results/);
  assert.equal(fs.existsSync(out), false);
  const truncated = clone(results); truncated[0].result.message.stop_reason = 'max_tokens'; save(truncated);
  assert.throws(() => importResults({ prepared: job, results: file, output: out, dataRoot: root }), /Incomplete/);
  const repeated = [...results, results[0]]; save(repeated);
  assert.throws(() => importResults({ prepared: job, results: file, output: out, dataRoot: root }), /duplicate result/);
  const crossShard = clone(results);
  crossShard[2].result.message.content = crossShard[1].result.message.content;
  save(crossShard);
  assert.throws(() => importResults({ prepared: job, results: file, output: out, dataRoot: root }), /duplicate question/);
  save(results);
  assert.deepEqual(importResults({ prepared: job, results: file, output: out, dataRoot: root }), { importedDrafts: 1, questions: 80, published: 0 });
  const draft = JSON.parse(fs.readFileSync(path.join(out, 'python/newbie/intro.vi.json')));
  assert.equal(draft.status, 'draft');
  assert.deepEqual(validateBank(draft), []);
  assert.throws(() => importResults({ prepared: job, results: file, output: out, dataRoot: root }), /overwrite/);
});

test('inventory reports remaining work accurately', () => {
  const { summary } = inventory();
  assert.equal(summary.requiredQuestions, summary.lessons * 80);
  assert.ok(summary.approved >= 1);
  assert.equal(summary.approved + summary.draft + summary.missing, summary.lessons);
  assert.deepEqual(summary.invalid, []);
});

test('every published bank uses all 80 questions over 20 stratified quizzes without repeats or answer drift', () => {
  const { rows } = inventory();
  for (const row of rows.filter(row => row.status === 'approved')) {
    const bank = JSON.parse(fs.readFileSync(row.file, 'utf8'));
    const original = new Map(bank.questions.map(q => [q.id, q]));
    let seen = [];
    const used = new Set();
    for (let round = 0; round < 20; round++) {
      const result = drawQuiz(bank, seen);
      assert.deepEqual(result.questions.reduce((counts, q) => { counts[q.difficulty]++; return counts; }, { easy: 0, medium: 0, hard: 0 }),
        { easy: 1, medium: 2, hard: 1 }, row.file);
      for (const q of result.questions) {
        assert.equal(used.has(q.id), false, `${row.file}: repeated ${q.id}`);
        used.add(q.id);
        const source = original.get(q.id);
        assert.equal(q.options[q.correct], source.options[source.correct], `${row.file}: answer changed for ${q.id}`);
      }
      seen = result.seen;
    }
    assert.equal(used.size, 80, row.file);
  }
});

test('all published source banks are exported with the same questions and source binding', t => {
  const dest = temp(t);
  xuatDuLieu({ thuMucRa: dest });
  const { rows } = inventory();
  for (const row of rows.filter(row => row.status === 'approved')) {
    const tech = JSON.parse(fs.readFileSync(path.join(dest, 'curriculum', `${row.tech}.json`)));
    const lesson = tech.levels.find(l => l.id === row.level).lessons.find(s => s.id === row.lesson);
    const metadata = lesson.quizBanks.vi;
    assert.equal(metadata.count, 80);
    assert.equal(metadata.sourceHash, row.sourceHash);
    const exported = JSON.parse(fs.readFileSync(path.join(dest, metadata.url)));
    assert.deepEqual(exported, JSON.parse(fs.readFileSync(row.file)), row.file);
  }
});
