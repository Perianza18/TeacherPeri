// Markup the lesson editor toolbar inserts (EditarLeccionPage). Same syntax
// as src/lib/theoryArticle.js and docs/CONTENT.md, so what the toolbar writes
// is exactly what an author would type. Pure functions, unit tested.

// Every `:::` block the lesson renderer draws, in the order the toolbar lists
// them. `title` is the placeholder for the text after `:::kind`; `body` the
// placeholder inside when nothing is selected.
export const LESSON_BLOCKS = [
  { kind: 'definition', label: 'Definición', group: 'Cajas', title: 'Nombre', body: 'Texto de la definición, con $matemáticas$.' },
  { kind: 'theorem', label: 'Teorema', group: 'Cajas', title: 'Nombre', body: 'Enunciado del teorema.' },
  { kind: 'lemma', label: 'Lema', group: 'Cajas', title: '', body: 'Enunciado del lema.' },
  { kind: 'corollary', label: 'Corolario', group: 'Cajas', title: '', body: 'Enunciado del corolario.' },
  { kind: 'proposition', label: 'Proposición', group: 'Cajas', title: '', body: 'Enunciado de la proposición.' },
  { kind: 'proof', label: 'Demostración', group: 'Cajas', title: '', body: 'Argumento completo.' },
  { kind: 'example', label: 'Ejemplo', group: 'Cajas', title: 'Título del ejemplo', body: 'Enunciado del ejemplo.\n\nSolución (queda detrás de «Ver solución»).' },
  { kind: 'try', label: 'Inténtalo', group: 'Cajas', title: 'Pregunta para el lector', body: 'Respuesta (queda oculta hasta que la abren).' },
  { kind: 'tip', label: 'Consejo', group: 'Cajas', title: 'Título del consejo', body: 'Consejo de olimpiada.' },
  { kind: 'mistake', label: 'Error común', group: 'Cajas', title: 'Título del error', body: 'Qué se hace mal y cómo evitarlo.' },
  { kind: 'reveal', label: 'Desplegable', group: 'Cajas', title: 'Pista', body: 'Texto que se despliega (va dentro de otra caja).' },
]

export const PROBLEM_BOX_KINDS = [
  { value: 'ejercicios', label: 'Ejercicios' },
  { value: 'practice', label: 'Práctica' },
  { value: 'dificiles', label: 'Reto' },
]

// Puts `text` where the selection is. A block snippet (`block: true`) gets a
// blank line before and after, so the parser sees it as its own block.
// `select` is the range to select afterwards, relative to `text`.
// Returns { value, start, end } for the textarea.
export function insertSnippet(value, start, end, { text, select = [text.length, text.length], block = false }) {
  const before = value.slice(0, start)
  const after = value.slice(end)
  let lead = ''
  let trail = ''
  if (block) {
    lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
    trail = after === '' || after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n'
  }
  return {
    value: `${before}${lead}${text}${trail}${after}`,
    start: before.length + lead.length + select[0],
    end: before.length + lead.length + select[1],
  }
}

// `:::kind Título` … `:::`. The selected text becomes the body; otherwise the
// placeholder is inserted and selected so the author types over it.
export function blockSnippet(kind, selected = '') {
  const info = LESSON_BLOCKS.find((item) => item.kind === kind)
  if (!info) throw new Error(`Unknown block ${kind}`)
  const head = info.title ? `:::${kind} ${info.title}` : `:::${kind}`
  const body = selected.trim() || info.body
  const text = `${head}\n${body}\n:::`
  // Select the title when there is one to fill, else the body placeholder.
  const select = info.title
    ? [`:::${kind} `.length, head.length]
    : selected.trim() ? [text.length, text.length] : [head.length + 1, head.length + 1 + body.length]
  return { text, select, block: true }
}

export function headingSnippet(level, selected = '') {
  const marks = level === 3 ? '###' : '##'
  const title = selected.trim().split('\n')[0] || (level === 3 ? 'Subsección' : 'Sección')
  const text = `${marks} ${title}`
  return { text, select: [marks.length + 1, text.length], block: true }
}

export function mathSnippet(selected = '') {
  if (selected) return { text: `$${selected}$`, select: [1, selected.length + 1] }
  return { text: '$x$', select: [1, 2] }
}

export function figureSnippet() {
  const text = '![Descripción de la figura](figuras/nombre.svg "Pie de figura")'
  return { text, select: [2, 2 + 'Descripción de la figura'.length], block: true }
}

export function tableSnippet() {
  const text = '| Columna 1 | Columna 2 |\n| --- | --- |\n| Dato | Dato |'
  return { text, select: [2, 2 + 'Columna 1'.length], block: true }
}

// `[[problems:TP-A01,TP-G08:ejercicios]]`: the picked problems, in order.
export function problemsSnippet(codes, kind = 'ejercicios') {
  const text = `[[problems:${codes.join(',')}:${kind}]]`
  return { text, block: true }
}
