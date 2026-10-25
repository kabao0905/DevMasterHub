import fs from 'node:fs';
import path from 'node:path';
import curriculum from '../lib/curriculum.js';
import { lessonHash } from '../lib/quiz-bank.js';
import { validateBank } from '../shared/quiz-bank.mjs';

// Serialization only. Every question, distractor and rationale is authored explicitly.
// No model, network request, question template expansion or count padding.
export function authorBank(tech, level, lesson, review) {
  const source = curriculum.napGiaoTrinh()[tech]?.levels.find(l => l.id === level)?.lessons.find(s => s.id === lesson);
  if (!source) throw new Error(`Unknown lesson ${tech}/${level}/${lesson}`);
  const questions = [];
  function add(difficulty, objective, question, options, explanation, code) {
    const correct = questions.length % 4;
    const order = [...options.slice(4 - correct), ...options.slice(0, 4 - correct)];
    questions.push({ id: `${difficulty}-${String(questions.length + 1).padStart(2, '0')}`, difficulty, objective, question,
      ...(code ? { code } : {}), options: order, correct, explanation });
  }
  return {
    easy: (...args) => add('easy', ...args),
    medium: (...args) => add('medium', ...args),
    hard: (...args) => add('hard', ...args),
    save() {
      const bank = { version: 1, tech, level, lesson, language: 'vi', sourceHash: lessonHash(source), status: 'approved', review, questions };
      const errors = validateBank(bank);
      if (errors.length) throw new Error(`${tech}/${level}/${lesson}: ${errors.join('; ')}`);
      const file = path.resolve('data/quiz-bank', tech, level, `${lesson}.vi.json`);
      if (fs.existsSync(file)) throw new Error(`Refusing to overwrite ${file}`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(bank, null, 2) + '\n');
      console.log(`${tech}/${level}/${lesson}: ${questions.length} authored questions`);
      return bank;
    }
  };
}
