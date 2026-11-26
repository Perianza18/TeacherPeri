// ---------------------------------------------------------------------------
// Transcribed exam collections: official exams typed from their PDFs into
// files under server/src/data/<collection>/, one file per exam, with the
// figures cut from the PDF in <collection>/figuras/. Only DATA and pure
// helpers live here; server/src/lib/transcribedExams.js writes them.
//
// A collection is defineCollection({ key, name, exams, figuresDir, describe }).
// `describe(exam)` returns what the shared code needs to know about one exam:
//   folder       the exam folder path below «Exámenes», one name must be the
//                year, e.g. ['OMMEB', 'Guerrero', '2025', 'Estatal', 'Nivel 1']
//   year         that year
//   label        the exam's full name, for the credit and the instructions
//   heading      first line of the instructions (label, grades, place, date)
//   date         as printed on the exam («28 de junio de 2025»)
//   code(n)      the problem code, unique across every collection
//   title(n)     the problem title; it must end in «<year> · Problema <n>» so
//                the problem page shows it whole (src/lib/problemPresentation.js)
//   competition  first folder name («OMMEB», «IMC», …)
//   round        the folder names other than the competition and the year
//   difficulty   basico | intermedio | avanzado (never shown publicly)
//   organization shown on the exam page
//
// Every exam has `indicaciones` (plain text, no $) and `problemas`. Each
// problem has
//   n         its number in the exam (1, 2, 3… in order)
//   area      Álgebra, Combinatoria, Geometría or Teoría de Números
//   enunciado the statement, with $…$ for math. Money is written «53.20
//             pesos» because a lone $ would start a formula.
//   opciones  the five choices (a)–(e) of a multiple-choice problem, if any
//   respuesta the official answer (a letter, or a list of letters when the key
//             accepts several); left out for a proof, which then needs its
//             solucion; null when there is no official answer, which then
//             needs a nota
//   nota      a short clarification shown with the answer (optional)
//   solucion  the official solution, when the PDF has one
//   figuras   [{ archivo, alt, en? }]: files in figuras/, shown under the
//             statement, or inside the solution with en: 'solucion' (at most 4)
// ---------------------------------------------------------------------------

import { existsSync } from 'node:fs'
import path from 'node:path'
import katex from 'katex'
import { mathSegments } from '../lib/review/checks.js'

export const AREAS = ['Álgebra', 'Combinatoria', 'Geometría', 'Teoría de Números']
export const DIFFICULTIES = ['basico', 'intermedio', 'avanzado']
const LETTERS = ['a', 'b', 'c', 'd', 'e']
const YEAR = /^(19|20)\d{2}$/

// Estimated, never shown publicly: earlier problems are easier.
function legacyDifficulty(n, total) {
  if (n <= Math.ceil(total / 3)) return 'Fácil'
  if (n <= Math.ceil((2 * total) / 3)) return 'Media'
  return 'Difícil'
}

function statementWithChoices(problem) {
  if (!problem.opciones) return problem.enunciado
  return `${problem.enunciado}\n\n${problem.opciones.map((text, i) => `(${LETTERS[i]}) ${text}`).join('\n')}`
}

function answerText(problem) {
  if (!problem.opciones) return problem.respuesta
  return [problem.respuesta].flat().map((letter) => `(${letter}) ${problem.opciones[LETTERS.indexOf(letter)]}`).join(' o ')
}

function solutionText(problem) {
  return [
    problem.respuesta === undefined || problem.respuesta === null ? null : `Respuesta: ${answerText(problem)}`,
    problem.nota ? `Nota: ${problem.nota}` : null,
    problem.solucion ? `Solución oficial:\n\n${problem.solucion}` : null,
  ].filter(Boolean).join('\n\n')
}

export function checkMath(text, where) {
  const { formulas, unbalanced } = mathSegments(text)
  if (unbalanced) throw new Error(`${where}: hay un $ sin cerrar.`)
  for (const { source, display } of formulas) {
    try {
      katex.renderToString(source, { throwOnError: true, strict: 'error', displayMode: display })
    } catch (error) {
      throw new Error(`${where}: KaTeX no puede mostrar «${source}» (${error.message}).`, { cause: error })
    }
  }
}

function checkProblem(problem, i, where, figuresDir) {
  const at = `${where}, problema ${problem.n}`
  if (problem.n !== i + 1) throw new Error(`${at}: los problemas deben ir numerados 1, 2, 3… en orden.`)
  if (!AREAS.includes(problem.area)) throw new Error(`${at}: área desconocida «${problem.area}».`)
  if (!problem.enunciado?.trim()) throw new Error(`${at}: falta el enunciado.`)
  if (problem.respuesta === null ? !problem.nota?.trim() : problem.respuesta === undefined ? !problem.solucion?.trim() : !String(problem.respuesta).trim()) throw new Error(`${at}: falta la respuesta (o, en una demostración, la solución; o, sin respuesta oficial, una nota).`)
  if (problem.opciones && (problem.opciones.length !== 5 || (problem.respuesta !== null && ![problem.respuesta].flat().every((letter) => LETTERS.includes(letter))))) throw new Error(`${at}: opción múltiple con 5 opciones y respuesta a–e.`)
  if (!problem.opciones && (Array.isArray(problem.respuesta) || LETTERS.includes(problem.respuesta))) throw new Error(`${at}: respuesta de letra sin opciones.`)
  for (const [field, text] of [['enunciado', problem.enunciado], ['respuesta', problem.opciones ? undefined : problem.respuesta ?? undefined], ['nota', problem.nota], ['solucion', problem.solucion], ...(problem.opciones || []).map((o, j) => [`opción ${LETTERS[j]}`, o])]) {
    if (text !== undefined) checkMath(String(text), `${at} (${field})`)
  }
  const figures = problem.figuras || []
  if (figures.length > 4) throw new Error(`${at}: más de 4 figuras.`)
  for (const figure of figures) {
    if (!existsSync(path.join(figuresDir, figure.archivo))) throw new Error(`${at}: no existe la figura ${figure.archivo}.`)
    if (figure.en !== undefined && figure.en !== 'solucion') throw new Error(`${at}: «en» solo puede ser 'solucion'.`)
    if (figure.en === 'solucion' && !problem.solucion) throw new Error(`${at}: figura de solución sin solución.`)
    if (!figure.alt || figure.alt.length < 5 || figure.alt.length > 300) throw new Error(`${at}: la descripción de ${figure.archivo} debe tener de 5 a 300 caracteres.`)
    checkMath(figure.alt, `${at} (descripción de ${figure.archivo})`)
  }
}

export function defineCollection({ key, name, exams, figuresDir, describe }) {
  const folderPath = (exam) => describe(exam).folder

  // Instructions for the Exam page (plain text).
  const instructions = (exam) => [`${describe(exam).heading}`, ...exam.indicaciones.map((line) => `• ${line}`)].join('\n')

  // The Problem fields for every problem, with the folder path it belongs in.
  function buildProblems(list = exams) {
    return list.flatMap((exam) => {
      const info = describe(exam)
      return exam.problemas.map((problem) => ({
        folder: info.folder,
        figures: (problem.figuras || []).map((figure) => ({ file: figure.archivo, alt: figure.alt, placement: figure.en === 'solucion' ? 'solution' : 'statement' })),
        fields: {
          codigo: info.code(problem.n),
          titulo: info.title(problem.n),
          enunciado: statementWithChoices(problem),
          solution: solutionText(problem),
          sourceAttribution: `${info.label} · ${info.date}`,
          competition: info.competition,
          round: info.round,
          problemNumber: problem.n,
          año: info.year,
          tema: problem.area,
          tipo: 'Examen',
          dificultad: legacyDifficulty(problem.n, exam.problemas.length),
          difficulty: info.difficulty,
          publicationStatus: 'published',
        },
      }))
    })
  }

  // Throws on the first problem found; returns a summary when all is well.
  function validate(list = exams) {
    const seen = new Set()
    for (const exam of list) {
      const info = describe(exam)
      const where = info.label
      if (!YEAR.test(info.year) || !info.folder.includes(info.year) || info.folder[0] !== info.competition) throw new Error(`${where}: la carpeta debe empezar con la competencia e incluir el año.`)
      if (!DIFFICULTIES.includes(info.difficulty)) throw new Error(`${where}: dificultad inválida.`)
      const folderKey = info.folder.join('/')
      if (seen.has(folderKey)) throw new Error(`${where}: examen repetido.`)
      seen.add(folderKey)
      if (!info.date || !exam.indicaciones?.length) throw new Error(`${where}: faltan fecha o indicaciones.`)
      // The Exam page shows the instructions as plain text: no $…$ there.
      exam.indicaciones.forEach((line, i) => { if (line.includes('$')) throw new Error(`${where}, indicación ${i + 1}: las indicaciones son texto plano, sin $.`) })
      exam.problemas.forEach((problem, i) => checkProblem(problem, i, where, figuresDir))
      const sample = info.title(exam.problemas.length)
      if (!/\b(19|20)\d{2} · Problema \d+$/.test(sample) || sample.length > 100) throw new Error(`${where}: el título debe terminar en «<año> · Problema <n>».`)
    }
    const problems = buildProblems(list)
    const codes = new Set(problems.map((p) => p.fields.codigo))
    if (codes.size !== problems.length) throw new Error('Hay códigos de problema repetidos.')
    return { exams: list.length, problems: problems.length, figures: problems.reduce((sum, p) => sum + p.figures.length, 0) }
  }

  const examFields = (exam) => {
    const info = describe(exam)
    return { durationMinutes: exam.duracionMinutos, instructions: instructions(exam), organization: info.organization, country: 'México' }
  }

  return { key, name, exams, figuresDir, describe, folderPath, instructions, buildProblems, validate, examFields }
}
