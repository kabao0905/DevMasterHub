/**
 * SQL Engine — bo phan tich va thuc thi SQL that, chay hoan toan trong trinh duyet.
 *
 * Ho tro: SELECT (cot, *, alias, aggregate), FROM, INNER/LEFT JOIN, WHERE
 * (= != <> < > <= >= LIKE IN AND OR NOT, ngoac don), GROUP BY, HAVING,
 * ORDER BY (nhieu cot, ASC/DESC), LIMIT/OFFSET, DISTINCT.
 *
 * Khong dung eval. Moi truy van deu duoc tokenize -> parse -> execute tren du lieu that,
 * nen ket qua doi theo dung cau lenh nguoi hoc go.
 */
const SqlEngine = (() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // TOKENIZER
  // ─────────────────────────────────────────────────────────────
  const KEYWORDS = new Set([
    'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT',
    'LIKE', 'IN', 'IS', 'NULL', 'ASC', 'DESC', 'DISTINCT', 'COUNT', 'SUM',
    'AVG', 'MIN', 'MAX', 'BETWEEN'
  ]);

  class SqlError extends Error {
    constructor(message, position) {
      super(message);
      this.name = 'SqlError';
      this.position = position;
    }
  }

  function tokenize(sql) {
    const tokens = [];
    let i = 0;
    const n = sql.length;

    while (i < n) {
      const ch = sql[i];

      // khoang trang
      if (/\s/.test(ch)) { i++; continue; }

      // comment -- den het dong
      if (ch === '-' && sql[i + 1] === '-') {
        while (i < n && sql[i] !== '\n') i++;
        continue;
      }
      // comment /* ... */
      if (ch === '/' && sql[i + 1] === '*') {
        i += 2;
        while (i < n && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
        i += 2;
        continue;
      }

      // chuoi 'abc' (dau nhay doi ben trong duoc escape bang '')
      if (ch === "'" || ch === '"') {
        const quote = ch;
        let start = i;
        i++;
        let value = '';
        while (i < n) {
          if (sql[i] === quote) {
            if (sql[i + 1] === quote) { value += quote; i += 2; continue; }
            break;
          }
          value += sql[i++];
        }
        if (i >= n) throw new SqlError('Chuỗi chưa được đóng bằng ' + quote, start);
        i++;
        tokens.push({ type: 'string', value, pos: start });
        continue;
      }

      // so
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(sql[i + 1] || ''))) {
        let start = i;
        while (i < n && /[0-9.]/.test(sql[i])) i++;
        tokens.push({ type: 'number', value: parseFloat(sql.slice(start, i)), pos: start });
        continue;
      }

      // toan tu 2 ky tu
      const two = sql.slice(i, i + 2);
      if (['<=', '>=', '<>', '!='].includes(two)) {
        tokens.push({ type: 'op', value: two === '!=' ? '<>' : two, pos: i });
        i += 2;
        continue;
      }

      // toan tu 1 ky tu / dau cau
      if ('=<>(),*.;+-/%'.includes(ch)) {
        tokens.push({ type: 'op', value: ch, pos: i });
        i++;
        continue;
      }

      // dinh danh / tu khoa
      if (/[A-Za-z_]/.test(ch)) {
        let start = i;
        while (i < n && /[A-Za-z0-9_]/.test(sql[i])) i++;
        const raw = sql.slice(start, i);
        const upper = raw.toUpperCase();
        tokens.push({
          type: KEYWORDS.has(upper) ? 'keyword' : 'ident',
          value: KEYWORDS.has(upper) ? upper : raw,
          raw,
          pos: start
        });
        continue;
      }

      throw new SqlError(`Ký tự không hợp lệ: "${ch}"`, i);
    }

    tokens.push({ type: 'eof', value: null, pos: n });
    return tokens;
  }

  // ─────────────────────────────────────────────────────────────
  // PARSER
  // ─────────────────────────────────────────────────────────────
  function parse(sql) {
    const tokens = tokenize(sql);
    let p = 0;

    const peek = (k = 0) => tokens[Math.min(p + k, tokens.length - 1)];
    const at = (type, value) => {
      const t = peek();
      return t.type === type && (value === undefined || t.value === value);
    };
    const atKw = (...kws) => peek().type === 'keyword' && kws.includes(peek().value);
    const next = () => tokens[p++];
    const expect = (type, value) => {
      if (!at(type, value)) {
        const t = peek();
        throw new SqlError(
          `Cần ${value || 'tên cột hoặc bảng'} ở đây, nhưng gặp "${t.value === null ? 'hết câu lệnh' : t.value}"`,
          t.pos
        );
      }
      return next();
    };

    // ---- bieu thuc dieu kien ----
    function parseCondition() { return parseOr(); }

    function parseOr() {
      let left = parseAnd();
      while (atKw('OR')) { next(); left = { kind: 'or', left, right: parseAnd() }; }
      return left;
    }

    function parseAnd() {
      let left = parseNot();
      while (atKw('AND')) { next(); left = { kind: 'and', left, right: parseNot() }; }
      return left;
    }

    function parseNot() {
      if (atKw('NOT')) { next(); return { kind: 'not', expr: parseNot() }; }
      return parseComparison();
    }

    function parseComparison() {
      if (at('op', '(')) {
        next();
        const inner = parseOr();
        expect('op', ')');
        return inner;
      }

      const left = parseValue();

      if (atKw('IS')) {
        next();
        let negate = false;
        if (atKw('NOT')) { next(); negate = true; }
        expect('keyword', 'NULL');
        return { kind: 'isnull', expr: left, negate };
      }

      if (atKw('IN')) {
        next();
        expect('op', '(');
        const list = [];
        if (!at('op', ')')) {
          list.push(parseValue());
          while (at('op', ',')) { next(); list.push(parseValue()); }
        }
        expect('op', ')');
        return { kind: 'in', expr: left, list };
      }

      if (atKw('BETWEEN')) {
        next();
        const lo = parseValue();
        expect('keyword', 'AND');
        const hi = parseValue();
        return { kind: 'between', expr: left, lo, hi };
      }

      if (atKw('LIKE')) {
        next();
        return { kind: 'like', expr: left, pattern: parseValue() };
      }

      if (at('op')) {
        const op = peek().value;
        if (['=', '<', '>', '<=', '>=', '<>'].includes(op)) {
          next();
          return { kind: 'cmp', op, left, right: parseValue() };
        }
      }

      throw new SqlError('Điều kiện WHERE không hợp lệ', peek().pos);
    }

    // ---- gia tri / cot / ham gop ----
    function parseValue() {
      const t = peek();

      if (t.type === 'string') { next(); return { kind: 'lit', value: t.value }; }
      if (t.type === 'number') { next(); return { kind: 'lit', value: t.value }; }
      if (t.type === 'keyword' && t.value === 'NULL') { next(); return { kind: 'lit', value: null }; }

      // ham gop: COUNT(*) / SUM(col) ...
      if (t.type === 'keyword' && ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(t.value)) {
        const fn = next().value;
        expect('op', '(');
        let arg = null;
        let distinct = false;
        if (atKw('DISTINCT')) { next(); distinct = true; }
        if (at('op', '*')) { next(); arg = { kind: 'star' }; }
        else arg = parseValue();
        expect('op', ')');
        return { kind: 'agg', fn, arg, distinct };
      }

      if (t.type === 'ident') {
        next();
        // dang table.column
        if (at('op', '.')) {
          next();
          if (at('op', '*')) { next(); return { kind: 'star', table: t.raw }; }
          const col = expect('ident');
          return { kind: 'col', table: t.raw, name: col.raw };
        }
        return { kind: 'col', table: null, name: t.raw };
      }

      if (at('op', '*')) { next(); return { kind: 'star' }; }

      throw new SqlError(`Không hiểu giá trị "${t.value}"`, t.pos);
    }

    // ---- cau lenh SELECT ----
    expect('keyword', 'SELECT');

    let distinct = false;
    if (atKw('DISTINCT')) { next(); distinct = true; }

    const columns = [];
    do {
      if (columns.length) next(); // an dau phay
      const expr = parseValue();
      let alias = null;
      if (atKw('AS')) { next(); alias = expect('ident').raw; }
      else if (at('ident')) alias = next().raw;
      columns.push({ expr, alias });
    } while (at('op', ','));

    expect('keyword', 'FROM');
    const fromTok = expect('ident');
    const from = { table: fromTok.raw, alias: fromTok.raw };
    if (atKw('AS')) { next(); from.alias = expect('ident').raw; }
    else if (at('ident')) from.alias = next().raw;

    // ---- JOIN ----
    const joins = [];
    while (atKw('JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER')) {
      let type = 'INNER';
      if (atKw('LEFT')) { next(); type = 'LEFT'; if (atKw('OUTER')) next(); }
      else if (atKw('RIGHT')) { next(); type = 'RIGHT'; if (atKw('OUTER')) next(); }
      else if (atKw('INNER')) { next(); }
      expect('keyword', 'JOIN');

      const tTok = expect('ident');
      const j = { type, table: tTok.raw, alias: tTok.raw, on: null };
      if (atKw('AS')) { next(); j.alias = expect('ident').raw; }
      else if (at('ident')) j.alias = next().raw;

      expect('keyword', 'ON');
      j.on = parseCondition();
      joins.push(j);
    }

    let where = null;
    if (atKw('WHERE')) { next(); where = parseCondition(); }

    let groupBy = [];
    if (atKw('GROUP')) {
      next(); expect('keyword', 'BY');
      do {
        if (groupBy.length) next();
        groupBy.push(parseValue());
      } while (at('op', ','));
    }

    let having = null;
    if (atKw('HAVING')) { next(); having = parseCondition(); }

    let orderBy = [];
    if (atKw('ORDER')) {
      next(); expect('keyword', 'BY');
      do {
        if (orderBy.length) next();
        const expr = parseValue();
        let dir = 'ASC';
        if (atKw('ASC')) next();
        else if (atKw('DESC')) { next(); dir = 'DESC'; }
        orderBy.push({ expr, dir });
      } while (at('op', ','));
    }

    let limit = null, offset = 0;
    if (atKw('LIMIT')) { next(); limit = expect('number').value; }
    if (atKw('OFFSET')) { next(); offset = expect('number').value; }

    if (at('op', ';')) next();
    if (!at('eof')) {
      throw new SqlError(`Thừa nội dung sau câu lệnh: "${peek().value}"`, peek().pos);
    }

    return { distinct, columns, from, joins, where, groupBy, having, orderBy, limit, offset };
  }

  // ─────────────────────────────────────────────────────────────
  // EXECUTOR
  // ─────────────────────────────────────────────────────────────

  // Mot "row" trung gian la { alias: {cot: gia tri}, ... } de phan biet users.id vs orders.id
  function resolveCol(row, table, name) {
    if (table) {
      const t = row[table];
      if (!t) throw new SqlError(`Không tìm thấy bảng hoặc alias "${table}"`);
      if (!(name in t)) throw new SqlError(`Bảng "${table}" không có cột "${name}"`);
      return t[name];
    }
    const hits = [];
    for (const alias of Object.keys(row)) {
      if (row[alias] && name in row[alias]) hits.push(row[alias][name]);
    }
    if (hits.length === 0) throw new SqlError(`Không tìm thấy cột "${name}"`);
    if (hits.length > 1) throw new SqlError(`Cột "${name}" có ở nhiều bảng — hãy ghi rõ dạng bảng.cột`);
    return hits[0];
  }

  function evalValue(node, row) {
    switch (node.kind) {
      case 'lit': return node.value;
      case 'col': return resolveCol(row, node.table, node.name);
      case 'agg': throw new SqlError('Hàm gộp chỉ dùng được ở SELECT hoặc HAVING');
      default: throw new SqlError('Biểu thức không hợp lệ');
    }
  }

  function likeToRegex(pattern) {
    const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('^' + escaped.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
  }

  function compare(a, b) {
    if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
    if (b === null || b === undefined) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), 'vi');
  }

  function evalCondition(node, row, aggRow) {
    switch (node.kind) {
      case 'and': return evalCondition(node.left, row, aggRow) && evalCondition(node.right, row, aggRow);
      case 'or': return evalCondition(node.left, row, aggRow) || evalCondition(node.right, row, aggRow);
      case 'not': return !evalCondition(node.expr, row, aggRow);
      case 'isnull': {
        const v = resolveOrAgg(node.expr, row, aggRow);
        const isNull = v === null || v === undefined;
        return node.negate ? !isNull : isNull;
      }
      case 'in': {
        const v = resolveOrAgg(node.expr, row, aggRow);
        return node.list.some(item => v === evalValue(item, row));
      }
      case 'between': {
        const v = resolveOrAgg(node.expr, row, aggRow);
        return compare(v, evalValue(node.lo, row)) >= 0 && compare(v, evalValue(node.hi, row)) <= 0;
      }
      case 'like': {
        const v = resolveOrAgg(node.expr, row, aggRow);
        return likeToRegex(evalValue(node.pattern, row)).test(String(v ?? ''));
      }
      case 'cmp': {
        const l = resolveOrAgg(node.left, row, aggRow);
        const r = resolveOrAgg(node.right, row, aggRow);
        const c = compare(l, r);
        switch (node.op) {
          case '=': return c === 0;
          case '<>': return c !== 0;
          case '<': return c < 0;
          case '>': return c > 0;
          case '<=': return c <= 0;
          case '>=': return c >= 0;
        }
        return false;
      }
      default: throw new SqlError('Điều kiện không hợp lệ');
    }
  }

  // Trong HAVING, ham gop da duoc tinh san va gan vao aggRow theo khoa chuoi
  function resolveOrAgg(node, row, aggRow) {
    if (node.kind === 'agg' && aggRow) {
      const key = aggKey(node);
      if (key in aggRow) return aggRow[key];
      throw new SqlError(`Hàm gộp ${key} chưa được tính — hãy thêm nó vào SELECT`);
    }
    return evalValue(node, row);
  }

  function aggKey(node) {
    const arg = node.arg.kind === 'star'
      ? '*'
      : (node.arg.table ? node.arg.table + '.' : '') + node.arg.name;
    return `${node.fn}(${node.distinct ? 'DISTINCT ' : ''}${arg})`;
  }

  function computeAgg(node, rows) {
    let values = rows.map(r => (node.arg.kind === 'star' ? 1 : evalValue(node.arg, r)));
    if (node.fn !== 'COUNT') values = values.filter(v => v !== null && v !== undefined);
    else if (node.arg.kind !== 'star') values = values.filter(v => v !== null && v !== undefined);
    if (node.distinct) values = [...new Set(values)];

    switch (node.fn) {
      case 'COUNT': return values.length;
      case 'SUM': return values.reduce((s, v) => s + Number(v), 0);
      case 'AVG': return values.length ? values.reduce((s, v) => s + Number(v), 0) / values.length : null;
      case 'MIN': return values.length ? values.reduce((m, v) => (compare(v, m) < 0 ? v : m)) : null;
      case 'MAX': return values.length ? values.reduce((m, v) => (compare(v, m) > 0 ? v : m)) : null;
    }
    return null;
  }

  function columnLabel(c) {
    if (c.alias) return c.alias;
    if (c.expr.kind === 'col') return c.expr.name;
    if (c.expr.kind === 'agg') return aggKey(c.expr);
    if (c.expr.kind === 'lit') return String(c.expr.value);
    return '?';
  }

  /**
   * Thuc thi truy van tren schema { tenBang: { columns:[{name,type,pk,fk}], rows:[...] } }
   * Tra ve { columns: [ten cot], rows: [[gia tri]], rowCount, ms }
   */
  function execute(sql, schema) {
    const t0 = performance.now();
    const ast = parse(sql);

    const getTable = (name) => {
      const key = Object.keys(schema).find(k => k.toLowerCase() === name.toLowerCase());
      if (!key) {
        throw new SqlError(
          `Không có bảng "${name}". Các bảng hiện có: ${Object.keys(schema).join(', ')}`
        );
      }
      return schema[key];
    };

    // FROM
    let rows = getTable(ast.from.table).rows.map(r => ({ [ast.from.alias]: r }));

    // JOIN
    for (const j of ast.joins) {
      const right = getTable(j.table).rows;
      const out = [];
      const emptyRight = Object.fromEntries(
        getTable(j.table).columns.map(c => [c.name, null])
      );

      if (j.type === 'RIGHT') {
        // dao chieu: giu moi dong ben phai
        const matchedLeft = new Set();
        for (const rr of right) {
          let matched = false;
          for (let li = 0; li < rows.length; li++) {
            const candidate = { ...rows[li], [j.alias]: rr };
            if (evalCondition(j.on, candidate)) { out.push(candidate); matched = true; matchedLeft.add(li); }
          }
          if (!matched) out.push({ [j.alias]: rr });
        }
      } else {
        for (const lr of rows) {
          let matched = false;
          for (const rr of right) {
            const candidate = { ...lr, [j.alias]: rr };
            if (evalCondition(j.on, candidate)) { out.push(candidate); matched = true; }
          }
          if (!matched && j.type === 'LEFT') out.push({ ...lr, [j.alias]: emptyRight });
        }
      }
      rows = out;
    }

    // WHERE
    if (ast.where) rows = rows.filter(r => evalCondition(ast.where, r));

    // mo rong SELECT * thanh danh sach cot that
    const selectCols = [];
    for (const c of ast.columns) {
      if (c.expr.kind === 'star') {
        const aliases = c.expr.table ? [c.expr.table] : [ast.from.alias, ...ast.joins.map(j => j.alias)];
        for (const alias of aliases) {
          const tableName = alias === ast.from.alias
            ? ast.from.table
            : (ast.joins.find(j => j.alias === alias) || {}).table;
          if (!tableName) throw new SqlError(`Không tìm thấy bảng cho alias "${alias}"`);
          for (const col of getTable(tableName).columns) {
            selectCols.push({ expr: { kind: 'col', table: alias, name: col.name }, alias: null });
          }
        }
      } else {
        selectCols.push(c);
      }
    }

    const hasAgg = selectCols.some(c => c.expr.kind === 'agg') || ast.groupBy.length > 0;
    let resultRows;

    if (hasAgg) {
      // gom nhom
      const groups = new Map();
      for (const r of rows) {
        const key = ast.groupBy.length
          ? JSON.stringify(ast.groupBy.map(g => evalValue(g, r)))
          : '__all__';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(r);
      }
      if (!groups.size && !ast.groupBy.length) groups.set('__all__', []);

      resultRows = [];
      for (const bucket of groups.values()) {
        const sample = bucket[0] || {};
        const aggRow = {};
        for (const c of selectCols) {
          if (c.expr.kind === 'agg') aggRow[aggKey(c.expr)] = computeAgg(c.expr, bucket);
        }
        if (ast.having) {
          for (const node of collectAggs(ast.having)) {
            if (!(aggKey(node) in aggRow)) aggRow[aggKey(node)] = computeAgg(node, bucket);
          }
          if (!evalCondition(ast.having, sample, aggRow)) continue;
        }
        resultRows.push({ _row: sample, _agg: aggRow });
      }
    } else {
      resultRows = rows.map(r => ({ _row: r, _agg: null }));
    }

    // Tinh gia tri dau ra truoc khi sap xep: SQL cho phep ORDER BY tro toi alias
    // cua SELECT (vi du "SUM(total) AS tong ... ORDER BY tong"), ma alias do khong
    // ton tai trong bang nguon.
    const labels = selectCols.map(columnLabel);
    const aliasIndex = new Map();
    labels.forEach((label, i) => {
      if (!aliasIndex.has(label.toLowerCase())) aliasIndex.set(label.toLowerCase(), i);
    });

    for (const rr of resultRows) {
      rr._out = selectCols.map(c =>
        c.expr.kind === 'agg' ? rr._agg[aggKey(c.expr)] : evalValue(c.expr, rr._row)
      );
    }

    // ORDER BY
    if (ast.orderBy.length) {
      const sortValue = (rr, expr) => {
        if (expr.kind === 'col' && !expr.table) {
          const idx = aliasIndex.get(expr.name.toLowerCase());
          if (idx !== undefined) return rr._out[idx];
        }
        if (expr.kind === 'agg') {
          const key = aggKey(expr);
          if (rr._agg && key in rr._agg) return rr._agg[key];
          const idx = aliasIndex.get(key.toLowerCase());
          if (idx !== undefined) return rr._out[idx];
        }
        return evalValue(expr, rr._row);
      };

      resultRows.sort((a, b) => {
        for (const o of ast.orderBy) {
          const c = compare(sortValue(a, o.expr), sortValue(b, o.expr));
          if (c !== 0) return o.dir === 'DESC' ? -c : c;
        }
        return 0;
      });
    }

    let out = resultRows.map(rr => rr._out);

    if (ast.distinct) {
      const seen = new Set();
      out = out.filter(r => {
        const k = JSON.stringify(r);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }

    if (ast.offset) out = out.slice(ast.offset);
    if (ast.limit !== null) out = out.slice(0, ast.limit);

    return {
      columns: labels,
      rows: out,
      rowCount: out.length,
      scanned: rows.length,
      ms: Math.max(0.01, performance.now() - t0)
    };
  }

  function collectAggs(node, acc = []) {
    if (!node || typeof node !== 'object') return acc;
    if (node.kind === 'agg') { acc.push(node); return acc; }
    for (const k of ['left', 'right', 'expr', 'pattern', 'lo', 'hi']) {
      if (node[k]) collectAggs(node[k], acc);
    }
    if (Array.isArray(node.list)) node.list.forEach(x => collectAggs(x, acc));
    return acc;
  }

  return { execute, parse, tokenize, SqlError };
})();

if (typeof window !== 'undefined') window.SqlEngine = SqlEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = SqlEngine;
