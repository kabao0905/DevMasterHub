const { createHash } = require('node:crypto');

// Include all teaching content, preserving literal code and HTML.
function lessonHash(lesson) {
  const fields = ['id', 'title', 'theory', 'code', 'lang', 'keyPoints', 'exercise', 'exercises', 'output'];
  return createHash('sha256').update(JSON.stringify(Object.fromEntries(fields.map(k => [k, lesson[k] ?? null])))).digest('hex');
}

module.exports = { lessonHash };
