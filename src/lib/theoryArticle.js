// Turns a Theory record's plain-text `content` into display blocks for the
// theory page. The stored format: blocks separated by a blank line, `$...$`
// for math, and ALL-CAPS heading lines at the start of a block. The fixed
// lesson sections (IDEAS CLAVE, EJEMPLO TRABAJADO, ...) become h2s; any other
// caps line becomes an h3. Nothing here changes the stored text.

const MATH = /\$[^$]+\$/g
const HEADING = /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9 —:–,¿?()./-]+$/
const SECTIONS = new Set(['IDEAS CLAVE', 'EJEMPLO TRABAJADO', 'ERRORES FRECUENTES', 'PRACTICA', 'EN RESUMEN', 'AMPLIACIÓN Y COMPROBACIONES'])
const ANSWERS = /^Respuestas de control:\s*/i
const NUMBERED = /^(\d+)\.\s+/

// Words that keep their own capitals when a heading is shown in sentence case.
const KEEP_CASE = { mcd: 'MCD', mcm: 'MCM', omm: 'OMM', tales: 'Tales', euclides: 'Euclides', 'bézout': 'Bézout', 'pitágoras': 'Pitágoras' }

const LEVELS = { basico: 'básico', intermedio: 'intermedio', avanzado: 'avanzado' }

export function levelLabel(level) {
  return LEVELS[level] ? `Nivel ${LEVELS[level]}` : ''
}

// «EJEMPLO 1: UNA PRUEBA» → «Ejemplo 1: una prueba». Math stays as written.
export function sentenceCase(heading) {
  let first = true
  return String(heading).split(/(\$[^$]+\$)/).map((part) => {
    if (part.length > 1 && part.startsWith('$') && part.endsWith('$')) { first = false; return part }
    return part.replace(/\p{L}+/gu, (word) => {
      const lower = word.toLocaleLowerCase('es')
      const shown = KEEP_CASE[lower] || lower
      if (!first) return shown
      first = false
      return shown.charAt(0).toLocaleUpperCase('es') + shown.slice(1)
    })
  }).join('')
}

export function isHeadingLine(line) {
  const text = line.replace(MATH, 'X').trim()
  return text.length < 110 && /[A-ZÁÉÍÓÚÜÑ]{3,}/.test(text) && HEADING.test(text)
}

// About 180 words a minute for math reading; formulas count as one word.
export function readingMinutes(content) {
  const words = String(content || '').replace(MATH, ' x ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

function textBlock(text) {
  const answers = ANSWERS.exec(text)
  if (answers) return { type: 'answers', text: text.slice(answers[0].length) }
  const lines = text.split('\n')
  if (lines.filter((line) => NUMBERED.test(line)).length >= 2 && NUMBERED.test(lines[0])) {
    const items = []
    for (const line of lines) {
      if (NUMBERED.test(line)) items.push(line.replace(NUMBERED, ''))
      else items[items.length - 1] += `\n${line}`
    }
    return { type: 'list', start: Number(NUMBERED.exec(lines[0])[1]), items }
  }
  return { type: 'paragraph', text }
}

// Returns { lead, items }. Items: h2 {id, number, title, key}, h3 {title},
// paragraph, list, answers, example {number, title, children} and
// mistakes {children}.
export function parseTheoryContent(content) {
  const tokens = []
  for (const block of String(content || '').split(/\n{2,}/)) {
    const lines = block.split('\n')
    while (lines.length && isHeadingLine(lines[0])) {
      const raw = lines.shift().trim()
      tokens.push({ kind: SECTIONS.has(raw) ? 'h2' : 'h3', raw })
    }
    const text = lines.join('\n').trim()
    if (text) tokens.push({ kind: 'text', text })
  }

  const lead = tokens[0]?.kind === 'text' ? tokens.shift().text : null
  const items = []
  let section = null
  let group = null
  let underPlainH3 = false
  let h2Count = 0
  let exampleCount = 0
  const openExample = (title) => {
    exampleCount += 1
    group = { type: 'example', number: exampleCount, title, children: [] }
    items.push(group)
  }

  for (const token of tokens) {
    if (token.kind === 'h2') {
      h2Count += 1
      section = token.raw
      group = null
      underPlainH3 = false
      items.push({ type: 'h2', key: token.raw, id: `seccion-${h2Count}`, number: h2Count, title: token.raw === 'PRACTICA' ? 'Práctica' : sentenceCase(token.raw) })
      if (section === 'ERRORES FRECUENTES') { group = { type: 'mistakes', children: [] }; items.push(group) }
    } else if (token.kind === 'h3') {
      group = null
      underPlainH3 = !/^EJEMPLO\b/.test(token.raw)
      if (!underPlainH3) openExample(sentenceCase(token.raw.replace(/^EJEMPLO(\s+\d+)?\s*:?\s*/, '')))
      else items.push({ type: 'h3', title: sentenceCase(token.raw) })
    } else {
      if (!group && section === 'EJEMPLO TRABAJADO' && !underPlainH3) openExample('')
      ;(group ? group.children : items).push(textBlock(token.text))
    }
  }
  return { lead, items }
}
