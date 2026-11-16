// Lesson text → display blocks for ArticleText (spec «Página de teoría»,
// Part 2). Pure data, no React and no HTML, so it can be unit tested.
//
// New markup: `:::<type> <título>` … `:::` blocks (one nested level), `##` /
// `###` headings, lists, GFM tables, figures, `[[collection:<slug>:<kind>]]`,
// `[[practice]]`, `[[source:…]]`. Inline markup is left in the text for
// RichText. Older lessons keep working: ALL-CAPS heading lines, `### Ejemplo`,
// «EJEMPLO TRABAJADO» / «ERRORES FRECUENTES» sections and `practice|challenge`.
// The stored text is never changed.
//
// Blocks: heading {level, title, id?, number?} · paragraph {text, lead?} ·
// list {ordered, start, items} · table {header, align, rows} ·
// figures {images: [{alt, src, title}]} · answers {text} ·
// collection {slug, kind} · practice · source {url} · cultural {items} ·
// box {kind, title, number?, children} · example {number, title, statement,
// hidden, shown}.

import { plainText } from './inlineMarkup.js'

const MATH = /\$\$[\s\S]+?\$\$|\$[^$\n]+\$/g
const HEADING = /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9 —:–,¿?()./-]+$/
const MD_HEADING = /^(#{2,3})\s+(.+)$/
const SECTIONS = new Set(['IDEAS CLAVE', 'EJEMPLO TRABAJADO', 'ERRORES FRECUENTES', 'PRACTICA', 'EN RESUMEN', 'AMPLIACIÓN Y COMPROBACIONES'])
const FENCE_OPEN = /^:::([a-z]+)(?:[ \t]+(.*?))?\s*$/
const FENCE_CLOSE = /^:::\s*$/
const BOXES = new Set(['definition', 'theorem', 'lemma', 'corollary', 'proposition', 'proof', 'example', 'try', 'tip', 'mistake', 'reveal'])
const NUMBERED_BOXES = new Set(['lemma', 'corollary', 'proposition'])
const COLLECTION = /^\[\[collection:([a-z0-9-]+):(ejercicios|practice|dificiles|challenge)\]\]$/
const PRACTICE = /^\[\[practice\]\]$/
const SOURCE = /^\[\[source:(https:\/\/[^\s\]]+)\]\]$/
const IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g
const ONLY_IMAGES = /^(?:\s*!\[[^\]]*\]\([^)\s]+(?:\s+"[^"]*")?\)\s*)+$/
const TABLE_SEPARATOR = /^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?$/
const BULLET = /^[-*]\s+/
const NUMBERED = /^(\d+)\.\s+/
const ANSWERS = /^Respuestas de control:\s*/i

// Words that keep their own capitals when a heading is shown in sentence case.
const KEEP_CASE = { mcd: 'MCD', mcm: 'MCM', omm: 'OMM', tales: 'Tales', euclides: 'Euclides', 'bézout': 'Bézout', 'pitágoras': 'Pitágoras' }
const LEVELS = { basico: 'básico', intermedio: 'intermedio', avanzado: 'avanzado' }

// `figuras/x.svg` → `/figuras/x.svg` (public/figuras). Anything else (other
// folders, other sites) is not loaded: the figure shows its alt text instead.
export function figureUrl(src) {
  return /^figuras\/[\w.-]+$/.test(src) && !src.includes('..') ? `/${src}` : null
}

// Distinct collection slugs the lesson text points to, in order, so the
// page can load each slug's boxes once.
export function collectionSlugs(content) {
  const slugs = String(content || '').split(/\r\n?|\n/).map((line) => COLLECTION.exec(line.trim())?.[1]).filter(Boolean)
  return [...new Set(slugs)]
}

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

// About 200 words a minute (spec Part 2); markup and formulas count as one word.
export function readingMinutes(content) {
  const words = plainText(String(content || '')
    .replace(/^:::.*$/gm, ' ')
    .replace(/\[\[[^\]]*\]\]/g, ' ')
    .replace(IMAGE, ' '))
    .split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length
  return Math.max(1, Math.round(words / 200))
}

// Table cells: split on `|` outside math, so `$a|b$` stays in one cell.
function tableCells(line) {
  const cells = ['']
  let inMath = false
  const body = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index]
    if (char === '$') inMath = !inMath
    if (char === '|' && !inMath && body[index - 1] !== '\\') cells.push('')
    else cells[cells.length - 1] += char === '|' ? '|' : char
  }
  return cells.map((cell) => cell.replace(/\\\|/g, '|').trim())
}

function parseTable(lines) {
  const header = tableCells(lines[0])
  const align = tableCells(lines[1]).map((cell) => (cell.startsWith(':') && cell.endsWith(':') ? 'center' : cell.endsWith(':') ? 'right' : cell.startsWith(':') ? 'left' : null))
  const rows = lines.slice(2).filter((line) => line.trim().startsWith('|')).map((line) => {
    const cells = tableCells(line)
    return header.map((_, index) => cells[index] ?? '')
  })
  return { type: 'table', header, align, rows }
}

function parseList(lines) {
  const ordered = NUMBERED.test(lines[0])
  const marker = ordered ? NUMBERED : BULLET
  const items = []
  for (const line of lines) {
    if (marker.test(line)) items.push(line.replace(marker, ''))
    else items[items.length - 1] += `\n${line.trim()}`
  }
  return { type: 'list', ordered, start: ordered ? Number(NUMBERED.exec(lines[0])[1]) : 1, items }
}

function contentBlocks(lines) {
  const text = lines.join('\n').trim()
  let match
  if ((match = COLLECTION.exec(text))) return [{ type: 'collection', slug: match[1], kind: match[2] === 'challenge' ? 'dificiles' : match[2] }]
  if (PRACTICE.test(text)) return [{ type: 'practice' }]
  if ((match = SOURCE.exec(text))) return [{ type: 'source', url: match[1] }]
  if (ONLY_IMAGES.test(text)) return [{ type: 'figures', images: [...text.matchAll(IMAGE)].map(([, alt, src, title]) => ({ alt: alt.trim(), src, title: title || '' })) }]
  if (lines.length >= 2 && lines[0].trim().startsWith('|') && TABLE_SEPARATOR.test(lines[1].trim())) return [parseTable(lines)]
  if (ANSWERS.test(text)) return [{ type: 'answers', text: text.replace(ANSWERS, '') }]
  // A paragraph may run straight into a list without a blank line.
  const listStart = lines.findIndex((line) => BULLET.test(line) || NUMBERED.test(line))
  if (listStart === 0) return [parseList(lines)]
  if (listStart > 0) return [{ type: 'paragraph', text: lines.slice(0, listStart).join('\n').trim() }, parseList(lines.slice(listStart))]
  return [{ type: 'paragraph', text }]
}

function groupBlocks(lines) {
  const blocks = []
  const rest = [...lines]
  while (rest.length) {
    const first = rest[0].trim()
    const markdown = MD_HEADING.exec(first)
    if (markdown) blocks.push({ type: 'heading', level: markdown[1].length, raw: markdown[2].trim(), caps: false })
    else if (isHeadingLine(first)) blocks.push({ type: 'heading', level: SECTIONS.has(first) ? 2 : 3, raw: first, caps: true })
    else break
    rest.shift()
  }
  if (!rest.length) return blocks
  const nextHeading = rest.findIndex((line, index) => index > 0 && MD_HEADING.test(line.trim()))
  if (nextHeading > 0) return [...blocks, ...contentBlocks(rest.slice(0, nextHeading)), ...groupBlocks(rest.slice(nextHeading))]
  return [...blocks, ...contentBlocks(rest)]
}

function textBlocks(lines) {
  const blocks = []
  let group = []
  for (const line of [...lines, '']) {
    if (line.trim()) group.push(line)
    else if (group.length) { blocks.push(...groupBlocks(group)); group = [] }
  }
  return blocks
}

function fenceBlock(type, title, body) {
  const inner = parseBody(body)
  if (type === 'example') return { type: 'example', title, statement: inner[0] || null, hidden: inner.slice(1), shown: [] }
  return { type: 'box', kind: type, title, children: inner }
}

// Splits on `:::` blocks (with nesting), then parses the text between them.
function parseBody(lines) {
  const blocks = []
  let buffer = []
  for (let index = 0; index < lines.length; index += 1) {
    const open = FENCE_OPEN.exec(lines[index].trim())
    if (!open || !BOXES.has(open[1])) { buffer.push(lines[index]); continue }
    blocks.push(...textBlocks(buffer))
    buffer = []
    let depth = 1
    let end = index + 1
    for (; end < lines.length; end += 1) {
      const line = lines[end].trim()
      if (FENCE_CLOSE.test(line)) { depth -= 1; if (depth === 0) break }
      else if (BOXES.has(FENCE_OPEN.exec(line)?.[1])) depth += 1
    }
    blocks.push(fenceBlock(open[1], (open[2] || '').trim(), lines.slice(index + 1, end)))
    index = end
  }
  blocks.push(...textBlocks(buffer))
  return blocks
}

const isCulturalSection = (heading) => /^agregados culturales$/i.test(heading.raw.trim())
const exampleTitle = (heading) => {
  const title = heading.raw.replace(/^ejemplo(\s+\d+)?\s*[:.—–-]?\s*/i, '')
  return heading.caps ? sentenceCase(title) : title.charAt(0).toLocaleUpperCase('es') + title.slice(1)
}

// Old-lesson sections and `### Ejemplo` become boxes; culture bullets become cards.
function structure(blocks) {
  const out = []
  let section = null
  let group = null
  let underPlainH3 = false
  for (const block of blocks) {
    if (block.type === 'heading') {
      group = null
      if (block.level === 2) {
        section = block
        underPlainH3 = false
        out.push(block)
        if (block.caps && block.raw === 'ERRORES FRECUENTES') { group = { type: 'box', kind: 'mistake', title: '', children: [] }; out.push(group) }
      } else if (/^ejemplo\b/i.test(block.raw)) {
        underPlainH3 = false
        group = { type: 'example', title: exampleTitle(block), statement: null, hidden: [], shown: [] }
        out.push(group)
      } else {
        underPlainH3 = true
        out.push(block)
      }
      continue
    }
    // Old-format groups hold text, lists, tables, figures and `:::reveal`;
    // any other `:::` block (new markup) ends the group.
    if (block.type === 'box' && block.kind !== 'reveal') group = null
    const nests = !['collection', 'practice', 'source'].includes(block.type) && !(block.type === 'box' && block.kind !== 'reveal')
    if (!group && nests && section?.caps && section.raw === 'EJEMPLO TRABAJADO' && !underPlainH3) {
      group = { type: 'example', title: '', statement: null, hidden: [], shown: [] }
      out.push(group)
    }
    if (group && nests) (group.type === 'example' ? group.shown : group.children).push(block)
    else if (section && isCulturalSection(section) && block.type === 'list') out.push({ type: 'cultural', items: block.items })
    else out.push(block)
  }
  return out.filter((block) => block.type !== 'box' || block.children.length || block.kind !== 'mistake')
}

function children(block) {
  if (block.type === 'example') return [block.statement, ...block.hidden, ...block.shown].filter(Boolean)
  return block.type === 'box' ? block.children : []
}

export function parseArticle(content) {
  const blocks = structure(parseBody(String(content || '').replace(/\r\n?/g, '\n').split('\n')))
  const counters = { example: 0, lemma: 0, corollary: 0, proposition: 0 }
  let h2 = 0
  let hasPracticeMarker = false
  const walk = (list) => list.forEach((block) => {
    if (block.type === 'heading') {
      block.title = block.caps ? (block.raw === 'PRACTICA' ? 'Práctica' : sentenceCase(block.raw)) : block.raw
      if (block.level === 2 && list === blocks) { h2 += 1; block.number = h2; block.id = `seccion-${h2}` }
    }
    if (block.type === 'example') block.number = ++counters.example
    if (block.type === 'box' && NUMBERED_BOXES.has(block.kind)) block.number = ++counters[block.kind]
    if (block.type === 'practice' || (block.type === 'collection' && block.kind === 'practice')) hasPracticeMarker = true
    walk(children(block))
  })
  walk(blocks)
  if (blocks[0]?.type === 'paragraph') blocks[0].lead = true
  const summaryIndex = blocks.findIndex((block) => block.type === 'heading' && block.level === 2 && /^(en )?resumen$/i.test(block.title))
  return { blocks, sections: blocks.filter((block) => block.number && block.type === 'heading'), hasPracticeMarker, summaryIndex }
}
