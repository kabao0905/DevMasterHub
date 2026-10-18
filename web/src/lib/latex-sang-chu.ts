const KY_HIEU: Readonly<Record<string, string>> = {
  rightarrow: '→', to: '→', longrightarrow: '→', Rightarrow: '⇒', Longrightarrow: '⇒', implies: '⇒',
  leftarrow: '←', gets: '←', longleftarrow: '←', Leftarrow: '⇐', leftrightarrow: '↔', Leftrightarrow: '⇔', iff: '⇔',
  mapsto: '↦', uparrow: '↑', downarrow: '↓',
  leq: '<=', le: '<=', geq: '>=', ge: '>=', neq: '!=', ne: '!=',
  times: '×', div: '÷', cdot: '·', pm: '±', approx: '≈', equiv: '≡', infty: '∞',
  ldots: '…', dots: '…', cdots: '…',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', cup: '∪', cap: '∩', emptyset: '∅', forall: '∀', exists: '∃',
  land: '∧', wedge: '∧', lor: '∨', vee: '∨', lnot: '¬', neg: '¬', oplus: '⊕',
  sum: 'Σ', prod: 'Π', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', epsilon: 'ε',
  theta: 'θ', lambda: 'λ', mu: 'μ', pi: 'π', sigma: 'σ', Sigma: 'Σ', omega: 'ω', Omega: 'Ω',
  log: 'log', ln: 'ln', max: 'max', min: 'min', mod: 'mod', bmod: 'mod',
  lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', langle: '⟨', rangle: '⟩',
  quad: ' ', qquad: '  ', left: '', right: ''
};

const LENH_TRAN = /\\(rightarrow|Rightarrow|leftarrow|Leftarrow|leftrightarrow|Leftrightarrow|longrightarrow|implies|leq|geq|neq|times)(?![a-zA-Z])/g;

const MU: Readonly<Record<string, string>> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ', i: 'ⁱ' };

const boc = (s: string) => (/[+\-*/ ]/.test(s.trim()) ? `(${s.trim()})` : s.trim());

function doiToan(s: string): string {
  return s
    .replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit|operatorname)\{([^{}]*)\}/g, '$1')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, tu: string, mau: string) => `${boc(tu)}/${boc(mau)}`)
    .replace(/\\sqrt\{([^{}]*)\}/g, (_, x: string) => `√${boc(x)}`)
    .replace(/\^([0-9ni])(?![0-9a-zA-Z])/g, (_, x: string) => MU[x])
    .replace(/\^\{([^{}]*)\}/g, (_, x: string) => (MU[x] ?? `^${x}`))
    .replace(/_\{([^{}]*)\}/g, '_$1')
    .replace(/\\([{}%$_&#])/g, '$1')
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\\([a-zA-Z]+)/g, (goc, ten: string) => KY_HIEU[ten] ?? goc)
    .replace(/ {2,}/g, ' ')
    .trim();
}

const CONG_THUC = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
const laToan = (s: string) => /\\[a-zA-Z]|\^|_\{/.test(s);

export function latexSangChu(s: string): string {
  if (!s.includes('\\') && !s.includes('$')) return s;
  return s
    .replace(CONG_THUC, (goc, khoi?: string, dong?: string) => {
      const trong = khoi ?? dong ?? '';
      return laToan(trong) ? doiToan(trong) : goc;
    })
    .replace(LENH_TRAN, (_, ten: string) => KY_HIEU[ten]);
}
