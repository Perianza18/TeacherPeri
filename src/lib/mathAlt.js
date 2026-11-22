// Plain text for an image's `alt` attribute. Descriptions may contain $…$
// math (the writer and reviewers see it rendered with KaTeX), but a screen
// reader gets text: the $ signs go away and common LaTeX becomes readable,
//   «$\angle ABC = 90^\circ$» → «ángulo ABC = 90°»
//   «$\frac{a}{b}$»           → «a/b»
// Anything not listed here is left as written, without backslashes or braces.

const WORDS = {
  angle: 'ángulo ', measuredangle: 'ángulo ', triangle: 'triángulo ', square: 'cuadrado ',
  parallel: ' paralela a ', perp: ' perpendicular a ', cong: ' ≅ ', sim: ' ∼ ',
  cdot: ' · ', times: ' × ', div: ' ÷ ', pm: ' ± ', mp: ' ∓ ',
  le: ' ≤ ', leq: ' ≤ ', ge: ' ≥ ', geq: ' ≥ ', ne: ' ≠ ', neq: ' ≠ ', approx: ' ≈ ', equiv: ' ≡ ',
  to: ' → ', rightarrow: ' → ', Rightarrow: ' ⇒ ', iff: ' ⇔ ', in: ' ∈ ', notin: ' ∉ ',
  subset: ' ⊂ ', subseteq: ' ⊆ ', cup: ' ∪ ', cap: ' ∩ ', infty: '∞', circ: '°', degree: '°',
  ldots: '…', cdots: '…', dots: '…', mid: ' | ',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', theta: 'θ', lambda: 'λ',
  mu: 'μ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Omega: 'Ω',
}
// Commands that only style their argument: keep the argument.
const WRAPPERS = new Set(['text', 'textrm', 'textit', 'textbf', 'mathrm', 'mathit', 'mathbf', 'mathbb', 'mathcal', 'operatorname', 'overline', 'overrightarrow', 'overleftrightarrow', 'widehat', 'hat', 'vec', 'bar', 'boldsymbol'])
const SPACES = new Set([',', ';', ':', '!', ' ', 'quad', 'qquad'])
const SUPERSCRIPT = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' }

// Reads one {…} group (or a single character) starting at `i`.
function group(source, i) {
  while (source[i] === ' ') i += 1
  if (source[i] === '\\') {
    const name = /^\\([A-Za-z]+|.)/.exec(source.slice(i))?.[0] ?? '\\'
    return { body: name, end: i + name.length }
  }
  if (source[i] !== '{') return { body: source[i] ?? '', end: i + 1 }
  let depth = 0
  for (let j = i; j < source.length; j += 1) {
    if (source[j] === '{') depth += 1
    else if (source[j] === '}' && (depth -= 1) === 0) return { body: source.slice(i + 1, j), end: j + 1 }
  }
  return { body: source.slice(i + 1), end: source.length }
}

const wrap = (text) => (/^[\p{L}\p{N}]+$/u.test(text) ? text : `(${text})`)

export function latexToText(source) {
  let out = ''
  let i = 0
  while (i < source.length) {
    const char = source[i]
    if (char === '\\') {
      const name = /^[A-Za-z]+/.exec(source.slice(i + 1))?.[0] ?? source[i + 1] ?? ''
      i += 1 + name.length
      if (['frac', 'dfrac', 'tfrac'].includes(name)) {
        const top = group(source, i)
        const bottom = group(source, top.end)
        out += `${wrap(latexToText(top.body))}/${wrap(latexToText(bottom.body))}`
        i = bottom.end
      } else if (name === 'sqrt') {
        const arg = group(source, i)
        out += `√${wrap(latexToText(arg.body))}`
        i = arg.end
      } else if (WRAPPERS.has(name)) {
        const arg = group(source, i)
        out += latexToText(arg.body)
        i = arg.end
      } else if (['left', 'right', 'displaystyle'].includes(name)) {
        // \left( reads as «(»: drop the command, keep what follows.
      } else if (SPACES.has(name)) out += ' '
      else if (Object.hasOwn(WORDS, name)) out += WORDS[name]
      // \log → «log», \{ → «{»: the name itself.
      else out += name
    } else if (char === '^') {
      const arg = group(source, i + 1)
      const text = latexToText(arg.body).trim()
      out += text === '°' ? '°' : /^\d$/.test(text) ? SUPERSCRIPT[text] : `^${wrap(text)}`
      i = arg.end
    } else if (char === '_') {
      const arg = group(source, i + 1)
      out += `_${wrap(latexToText(arg.body).trim())}`
      i = arg.end
    } else if (char === '{' || char === '}') i += 1
    else if (char === '~') { out += ' '; i += 1 }
    else { out += char; i += 1 }
  }
  return out
}

// Same split as MathText: $$…$$ blocks, then $…$ inside the rest.
export function plainMathText(text) {
  const parts = String(text || '').split(/(\$\$[\s\S]+?\$\$)/g).flatMap((block) => {
    if (block.startsWith('$$') && block.endsWith('$$') && block.length > 4) return [latexToText(block.slice(2, -2))]
    return block.split(/(\$[^$]+\$)/g).map((part) => (part.startsWith('$') && part.endsWith('$') && part.length > 1 ? latexToText(part.slice(1, -1)) : part))
  })
  return parts.join('').replace(/\$/g, '').replace(/\s+/g, ' ').replace(/\s+([,.;:)])/g, '$1').replace(/\(\s+/g, '(').trim()
}

// True when a $ is left without its pair (the server refuses it too).
export function hasLoneDollar(text) {
  return String(text || '').split(/\$\$[\s\S]+?\$\$/g).some((block) => block.replace(/\$[^$]+\$/g, '').includes('$'))
}
