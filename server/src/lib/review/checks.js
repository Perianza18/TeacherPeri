// ---------------------------------------------------------------------------
// Automatic checks for a proposed problem. PURE functions: everything they
// need comes in as arguments, so the same checks run when the author saves
// (submissions API), when an admin reviews (review script) and, later, in an
// automatic review on upload.
//
// Each finding is { level, code, message }:
//   error   → must be fixed before saving / approving
//   warning → the reviewer must look at it (possible duplicate, spam, …)
//   info    → context for the reviewer (folder still pending, …)
// Messages are in Spanish because authors see them in the form.
// ---------------------------------------------------------------------------

import katex from 'katex'
import { normalizeSlug } from '../../models/content.js'

export const STATEMENT_MIN = 20
export const STATEMENT_MAX = 5000
export const SOLUTION_MAX = 20000
// Tags only staff may apply: a community problem is not TeacherPeri material.
export const RESERVED_TAG_SLUGS = ['teacherperi-original']
const SIMILARITY_WARNING = 0.75

// Same split as src/components/math/MathText.jsx: $$…$$ blocks first, then
// $…$ inside the rest. Returns the formulas plus any text left with a lone $.
export function mathSegments(text) {
  const formulas = []
  let leftover = ''
  for (const block of String(text || '').split(/(\$\$[\s\S]+?\$\$)/g)) {
    if (block.startsWith('$$') && block.endsWith('$$') && block.length > 4) {
      formulas.push({ source: block.slice(2, -2), display: true })
      continue
    }
    for (const part of block.split(/(\$[^$]+\$)/g)) {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 1) formulas.push({ source: part.slice(1, -1), display: false })
      else leftover += part
    }
  }
  return { formulas, unbalanced: leftover.includes('$') }
}

export function mathFindings(text) {
  const findings = []
  const { formulas, unbalanced } = mathSegments(text)
  if (unbalanced) findings.push({ level: 'error', code: 'math-unbalanced', message: 'Hay un signo $ sin cerrar. Cada fórmula va entre $…$ (o $$…$$ para una fórmula aparte).' })
  for (const { source, display } of formulas) {
    try {
      katex.renderToString(source, { throwOnError: true, displayMode: display })
    } catch {
      const shown = source.length > 60 ? `${source.slice(0, 60)}…` : source
      findings.push({ level: 'error', code: 'math-error', message: `Una fórmula no se puede mostrar: $${shown}$. Revisa que cada { tenga su } y que los comandos estén bien escritos.` })
    }
  }
  return findings
}

// Text used to compare statements: no accents, no case, no spacing noise.
export function normalizeStatement(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\\[,;:! ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function shingles(text) {
  const words = normalizeStatement(text).split(/[^a-z0-9]+/).filter(Boolean)
  if (words.length < 3) return new Set(words)
  const set = new Set()
  for (let i = 0; i + 2 < words.length; i += 1) set.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
  return set
}

export function similarity(a, b) {
  const left = shingles(a)
  const right = shingles(b)
  if (!left.size || !right.size) return 0
  let shared = 0
  for (const item of left) if (right.has(item)) shared += 1
  return shared / (left.size + right.size - shared)
}

export function duplicateFindings(text, problems = []) {
  const findings = []
  const normalized = normalizeStatement(text)
  for (const problem of problems) {
    if (normalizeStatement(problem.enunciado) === normalized) {
      findings.push({ level: 'error', code: 'duplicate', message: `Ya existe un problema con el mismo enunciado (${problem.codigo}).` })
      continue
    }
    const score = similarity(text, problem.enunciado)
    if (score >= SIMILARITY_WARNING) findings.push({ level: 'warning', code: 'similar', message: `Se parece mucho a ${problem.codigo} (${Math.round(score * 100)} % de coincidencia).` })
  }
  return findings
}

export function spamFindings(text) {
  const findings = []
  const value = String(text || '')
  if (/(https?:\/\/|www\.)/i.test(value)) findings.push({ level: 'warning', code: 'link', message: 'El enunciado contiene un enlace.' })
  if (/(.)\1{7,}/u.test(value.replace(/\s/g, ''))) findings.push({ level: 'warning', code: 'repeated-characters', message: 'El enunciado repite muchas veces el mismo carácter.' })
  const letters = value.replace(/\$[^$]*\$/g, '').match(/\p{L}/gu) || []
  const upper = letters.filter((letter) => letter !== letter.toLowerCase())
  if (letters.length >= 20 && upper.length / letters.length > 0.6) findings.push({ level: 'warning', code: 'all-caps', message: 'El enunciado está casi todo en mayúsculas.' })
  return findings
}

export function statementFindings(text) {
  const value = String(text || '').trim()
  if (!value) return [{ level: 'error', code: 'statement-empty', message: 'Escribe el enunciado.' }]
  if (value.length < STATEMENT_MIN) return [{ level: 'error', code: 'statement-short', message: `El enunciado es muy corto (mínimo ${STATEMENT_MIN} caracteres).` }]
  if (value.length > STATEMENT_MAX) return [{ level: 'error', code: 'statement-long', message: `El enunciado no puede pasar de ${STATEMENT_MAX} caracteres.` }]
  if (!/[\p{L}\p{N}]/u.test(value)) return [{ level: 'error', code: 'statement-empty', message: 'El enunciado no tiene texto.' }]
  return []
}

// topics/tags: Maps id → document. folders: every Category the person may use.
export function vocabularyFindings(proposal, { topics = new Map(), tags = new Map() } = {}) {
  const findings = []
  for (const id of proposal.topics || []) {
    const topic = topics.get(String(id))
    if (!topic) findings.push({ level: 'error', code: 'unknown-topic', message: 'Uno de los temas elegidos no existe.' })
    else if (topic.reviewStatus === 'pending') findings.push({ level: 'info', code: 'topic-pending', message: `El tema «${topic.name}» también está en revisión.` })
  }
  for (const id of proposal.tags || []) {
    const tag = tags.get(String(id))
    if (!tag) findings.push({ level: 'error', code: 'unknown-tag', message: 'Una de las etiquetas elegidas no existe.' })
    else if (RESERVED_TAG_SLUGS.includes(tag.slug)) findings.push({ level: 'error', code: 'reserved-tag', message: `La etiqueta «${tag.label}» solo la usa el equipo de TeacherPeri.` })
  }
  if (!(proposal.topics || []).length) findings.push({ level: 'warning', code: 'no-topic', message: 'Sin tema: elige de qué tema es (Geometría, Álgebra, Teoría de Números o Combinatoria).' })
  return findings
}

export function folderFindings(proposal, folders = []) {
  if (!proposal.isExam) return []
  if (!proposal.examFolder) return [{ level: 'error', code: 'exam-folder-missing', message: 'Elige la carpeta del examen.' }]
  const byId = new Map(folders.map((folder) => [String(folder._id), folder]))
  const folder = byId.get(String(proposal.examFolder))
  if (!folder || folder.kind !== 'exam' || folder.reviewStatus === 'rejected') return [{ level: 'error', code: 'exam-folder-invalid', message: 'La carpeta de examen elegida no existe.' }]
  if (!folder.parent) return [{ level: 'error', code: 'exam-folder-root', message: 'Elige una carpeta dentro de «Exámenes» (por ejemplo, OMM › 2024).' }]
  const findings = []
  if (folders.some((other) => String(other.parent) === String(folder._id) && other.reviewStatus !== 'rejected')) findings.push({ level: 'warning', code: 'exam-folder-not-leaf', message: `«${folder.name}» tiene subcarpetas: ¿falta elegir el año o la etapa?` })
  let cursor = folder
  const seen = new Set()
  while (cursor && !seen.has(String(cursor._id))) {
    seen.add(String(cursor._id))
    if (cursor.reviewStatus === 'pending') { findings.push({ level: 'info', code: 'exam-folder-pending', message: `La carpeta «${cursor.name}» también está en revisión.` }); break }
    cursor = cursor.parent ? byId.get(String(cursor.parent)) : null
  }
  return findings
}

// Everything at once. `problems` are the existing statements to compare with
// (never the problem being edited itself).
export function runSubmissionChecks(proposal, { topics, tags, folders, problems } = {}) {
  const statement = statementFindings(proposal.enunciado)
  return [
    ...statement,
    ...(statement.length ? [] : mathFindings(proposal.enunciado)),
    ...vocabularyFindings(proposal, { topics, tags }),
    ...folderFindings(proposal, folders),
    ...(statement.length ? [] : duplicateFindings(proposal.enunciado, problems)),
    ...spamFindings(proposal.enunciado),
    ...solutionFindings(proposal.solution),
  ]
}

// The optional solution or answer: only its length and its formulas.
export function solutionFindings(text) {
  const value = String(text || '').trim()
  if (!value) return []
  if (value.length > SOLUTION_MAX) return [{ level: 'error', code: 'solution-long', message: `La solución no puede pasar de ${SOLUTION_MAX} caracteres.` }]
  return mathFindings(value).map((finding) => ({ ...finding, message: `Solución: ${finding.message}` }))
}

export function hasErrors(findings) {
  return findings.some((finding) => finding.level === 'error')
}

export function sameFolderName(a, b) {
  return normalizeSlug(a) === normalizeSlug(b)
}
