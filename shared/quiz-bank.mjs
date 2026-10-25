export const BANK_COUNTS = Object.freeze({ easy: 20, medium: 40, hard: 20 });
export const QUIZ_COUNTS = Object.freeze({ easy: 1, medium: 2, hard: 1 });
const text = x => typeof x === 'string' && x.trim().length > 0;
const normalized = x => x.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const slug = x => typeof x === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(x);
const lessonSlug = x => typeof x === 'string' && /^[a-z0-9][a-z0-9_-]*$/.test(x);

// Structural checks cannot establish factual correctness or semantic uniqueness.
export function validateBank(bank, expected = {}) {
  const errors = [];
  if (!bank || typeof bank !== 'object') return ['Bank must be an object'];
  if (bank.version !== 1) errors.push('Unsupported bank version');
  for (const key of ['tech', 'level', 'lesson', 'language']) {
    if (!(key === 'lesson' ? lessonSlug(bank[key]) : slug(bank[key]))) errors.push(`Invalid ${key}`);
    if (expected[key] !== undefined && bank[key] !== expected[key]) errors.push(`${key} mismatch`);
  }
  if (!/^[a-f0-9]{64}$/.test(bank.sourceHash || '')) errors.push('Invalid sourceHash');
  if (expected.sourceHash && bank.sourceHash !== expected.sourceHash) errors.push('Lesson changed: sourceHash mismatch');
  if (!['draft', 'approved'].includes(bank.status)) errors.push('Invalid status');
  if (bank.status === 'approved' && !text(bank.review)) errors.push('Approved banks require a review note');
  if (!Array.isArray(bank.questions) || bank.questions.length !== 80) errors.push('Bank must contain exactly 80 questions');
  const ids = new Set(), fingerprints = new Set();
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const [i, q] of (Array.isArray(bank.questions) ? bank.questions : []).entries()) {
    const fail = msg => errors.push(`Question ${i + 1}: ${msg}`);
    if (!q || typeof q !== 'object') { fail('must be an object'); continue; }
    if (!slug(q.id) || ids.has(q.id)) fail('invalid or duplicate id');
    ids.add(q.id);
    if (Object.hasOwn(counts, q.difficulty)) counts[q.difficulty]++;
    else fail('invalid difficulty');
    for (const key of ['question', 'explanation', 'objective']) if (!text(q[key])) fail(`${key} is required`);
    if (q.code !== undefined && !text(q.code)) fail('invalid code');
    if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every(text)) fail('exactly 4 nonempty options required');
    // Case and internal whitespace are meaningful in programming answers (True/true).
    else if (new Set(q.options.map(o => o.normalize('NFKC').trim())).size !== 4) fail('duplicate options');
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) fail('correct must be an option index (0–3)');
    const fp = normalized(String(q.question)) + '\n' + String(q.code || '').trim();
    if (fingerprints.has(fp)) fail('duplicate question and code');
    fingerprints.add(fp);
  }
  for (const [difficulty, count] of Object.entries(BANK_COUNTS)) {
    if (counts[difficulty] !== count) errors.push(`${difficulty}: expected ${count}, received ${counts[difficulty]}`);
  }
  return errors;
}

function shuffled(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const r = random();
    if (!(r >= 0 && r < 1)) throw new Error('Random source must return [0, 1)');
    const j = Math.floor(r * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A full cycle is 20 quizzes. Reset all tiers together, keeping the ratio exact.
export function drawQuiz(bank, seen = [], random = Math.random) {
  const errors = validateBank(bank);
  if (errors.length || bank.status !== 'approved') throw new Error(errors.join('; ') || 'Bank is not approved');
  const previous = new Set(seen);
  const cycleComplete = Object.entries(QUIZ_COUNTS).some(([d, n]) => bank.questions.filter(q => q.difficulty === d && !previous.has(q.id)).length < n);
  if (cycleComplete) previous.clear();
  const selected = Object.entries(QUIZ_COUNTS).flatMap(([d, n]) =>
    shuffled(bank.questions.filter(q => q.difficulty === d && !previous.has(q.id)), random).slice(0, n));
  const questions = shuffled(selected, random).map(q => {
    const order = shuffled([0, 1, 2, 3], random);
    return { ...q, options: order.map(i => q.options[i]), correct: order.indexOf(q.correct) };
  });
  return { questions, seen: [...previous, ...selected.map(q => q.id)] };
}
