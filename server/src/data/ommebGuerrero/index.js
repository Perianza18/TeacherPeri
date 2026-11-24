// ---------------------------------------------------------------------------
// OMMEB Guerrero: the state and selection exams of the Olimpiada Mexicana de
// Matemáticas para Educación Básica in Guerrero, transcribed from the PDFs the
// team gave us (7a to 10a edición, levels 1 to 3). Only DATA and pure helpers
// live here; server/src/scripts/import-ommeb-guerrero.js writes them.
//
// One file per exam (<year>-<estatal|selectivo>-n<level>.js). Each problem has
//   n         its number in the exam
//   area      Álgebra, Combinatoria, Geometría or Teoría de Números
//   enunciado the statement, with $…$ for math. Money is written «53.20 pesos»
//             because a lone $ would start a formula.
//   opciones  the five choices (a)–(e) of a multiple-choice problem, if any
//   respuesta the official answer (a letter for multiple choice, or a list
//             of letters when the key accepts several); left out
//             for a proof, which then needs its solucion; null when the
//             official key has none, which then needs a nota
//   nota      a short clarification shown after the answer (optional)
//   solucion  the official solution, when the PDF has one (only the problems
//             «de redacción»; their grading criteria are not copied)
//   figuras   [{ archivo, alt, en? }]: PNGs in ./figuras cut from the PDF,
//             shown under the statement, or inside the solution with
//             en: 'solucion' (at most 4 per problem)
//
// Exams go into the exam folders Exámenes › OMMEB › Guerrero › <year> ›
// <Estatal|Selectivo> › Nivel <n>, so the Exámenes page titles them
// «OMMEB 2025 · Guerrero · Estatal · Nivel 1» (server/src/lib/examSync.js).
// ---------------------------------------------------------------------------

import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import katex from 'katex'
import { mathSegments } from '../../lib/review/checks.js'

import e2023EstatalN1 from './2023-estatal-n1.js'
import e2023EstatalN2 from './2023-estatal-n2.js'
import e2023EstatalN3 from './2023-estatal-n3.js'
import e2023SelectivoN1 from './2023-selectivo-n1.js'
import e2023SelectivoN2 from './2023-selectivo-n2.js'
import e2023SelectivoN3 from './2023-selectivo-n3.js'
import e2024EstatalN1 from './2024-estatal-n1.js'
import e2024EstatalN2 from './2024-estatal-n2.js'
import e2024EstatalN3 from './2024-estatal-n3.js'
import e2024SelectivoN1 from './2024-selectivo-n1.js'
import e2024SelectivoN2 from './2024-selectivo-n2.js'
import e2024SelectivoN3 from './2024-selectivo-n3.js'
import e2025EstatalN1 from './2025-estatal-n1.js'
import e2025EstatalN2 from './2025-estatal-n2.js'
import e2025EstatalN3 from './2025-estatal-n3.js'
import e2025SelectivoN1 from './2025-selectivo-n1.js'
import e2025SelectivoN2 from './2025-selectivo-n2.js'
import e2025SelectivoN3 from './2025-selectivo-n3.js'
import e2026EstatalN1 from './2026-estatal-n1.js'
import e2026EstatalN2 from './2026-estatal-n2.js'
import e2026EstatalN3 from './2026-estatal-n3.js'
import e2026SelectivoN1 from './2026-selectivo-n1.js'
import e2026SelectivoN2 from './2026-selectivo-n2.js'
import e2026SelectivoN3 from './2026-selectivo-n3.js'

// Every exam, oldest year first. Add the import of a new exam file here.
export const OMMEB_GUERRERO_EXAMS = [
  e2023EstatalN1,
  e2023EstatalN2,
  e2023EstatalN3,
  e2023SelectivoN1,
  e2023SelectivoN2,
  e2023SelectivoN3,
  e2024EstatalN1,
  e2024EstatalN2,
  e2024EstatalN3,
  e2024SelectivoN1,
  e2024SelectivoN2,
  e2024SelectivoN3,
  e2025EstatalN1,
  e2025EstatalN2,
  e2025EstatalN3,
  e2025SelectivoN1,
  e2025SelectivoN2,
  e2025SelectivoN3,
  e2026EstatalN1,
  e2026EstatalN2,
  e2026EstatalN3,
  e2026SelectivoN1,
  e2026SelectivoN2,
  e2026SelectivoN3,
]

export const FIGURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'figuras')
export const AREAS = ['Álgebra', 'Combinatoria', 'Geometría', 'Teoría de Números']
export const STAGES = ['Estatal', 'Selectivo']
const LETTERS = ['a', 'b', 'c', 'd', 'e']

export const examFolderPath = (exam) => ['OMMEB', 'Guerrero', exam.year, exam.etapa, `Nivel ${exam.nivel}`]
export const examLabel = (exam) => `${exam.edicion}a OMMEB Guerrero · ${exam.etapa === 'Estatal' ? 'Concurso Estatal' : 'Examen Selectivo'} · Nivel ${exam.nivel}`
export const problemCode = (exam, n) => `OMMEB-GRO-${exam.year}-${exam.etapa === 'Estatal' ? 'EST' : 'SEL'}-N${exam.nivel}-${String(n).padStart(2, '0')}`

// Instructions for the Exam page.
export function examInstructions(exam) {
  return [
    `${examLabel(exam)} (${exam.grados}). ${exam.lugar ? `${exam.lugar}, ` : ''}${exam.fecha}.`,
    ...exam.indicaciones.map((line) => `• ${line}`),
  ].join('\n')
}

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

// A multiple-choice key may accept more than one letter, e.g. ['b', 'c'].
function answerText(problem) {
  if (!problem.opciones) return problem.respuesta
  return [problem.respuesta].flat().map((letter) => `(${letter}) ${problem.opciones[LETTERS.indexOf(letter)]}`).join(' o ')
}

// Proof problems have no short answer, only the official solution.
function solutionText(problem) {
  return [
    problem.respuesta === undefined || problem.respuesta === null ? null : `Respuesta: ${answerText(problem)}`,
    problem.nota ? `Nota: ${problem.nota}` : null,
    problem.solucion ? `Solución oficial:\n\n${problem.solucion}` : null,
  ].filter(Boolean).join('\n\n')
}

// The Problem fields for every problem, with the folder path it belongs in.
export function buildOmmebProblems(exams = OMMEB_GUERRERO_EXAMS) {
  return exams.flatMap((exam) => {
    const folder = examFolderPath(exam)
    const difficulty = exam.nivel === 3 ? 'intermedio' : 'basico'
    return exam.problemas.map((problem) => ({
      folder,
      figures: (problem.figuras || []).map((figure) => ({ file: figure.archivo, alt: figure.alt, placement: figure.en === 'solucion' ? 'solution' : 'statement' })),
      fields: {
        codigo: problemCode(exam, problem.n),
        // Ends in «<year> · Problema <n>» so the problem page shows it whole
        // (src/lib/problemPresentation.js): «OMMEB Guerrero · Estatal Nivel 1 · 2025 · Problema 3».
        titulo: `OMMEB Guerrero · ${exam.etapa} Nivel ${exam.nivel} · ${exam.year} · Problema ${problem.n}`,
        enunciado: statementWithChoices(problem),
        solution: solutionText(problem),
        sourceAttribution: `${examLabel(exam)} · ${exam.fecha}`,
        competition: 'OMMEB',
        round: folder.slice(1).filter((name) => name !== exam.year).join(' · '),
        problemNumber: problem.n,
        año: exam.year,
        tema: problem.area,
        tipo: 'Examen',
        dificultad: legacyDifficulty(problem.n, exam.problemas.length),
        difficulty,
        publicationStatus: 'published',
      },
    }))
  })
}

function checkMath(text, where) {
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

// Throws on the first problem found; returns a summary when all is well.
export function validateOmmebGuerrero(exams = OMMEB_GUERRERO_EXAMS) {
  const seen = new Set()
  for (const exam of exams) {
    const where = examLabel(exam)
    if (!/^20\d\d$/.test(exam.year) || !STAGES.includes(exam.etapa) || ![1, 2, 3].includes(exam.nivel)) throw new Error(`${where}: año, etapa o nivel inválidos.`)
    const key = examFolderPath(exam).join('/')
    if (seen.has(key)) throw new Error(`${where}: examen repetido.`)
    seen.add(key)
    if (!exam.fecha || !exam.grados || !exam.indicaciones?.length) throw new Error(`${where}: faltan fecha, grados o indicaciones.`)
    // The Exam page shows the instructions as plain text: no $…$ there.
    exam.indicaciones.forEach((line, i) => { if (line.includes('$')) throw new Error(`${where}, indicación ${i + 1}: las indicaciones son texto plano, sin $.`) })
    exam.problemas.forEach((problem, i) => {
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
        if (!existsSync(path.join(FIGURES_DIR, figure.archivo))) throw new Error(`${at}: no existe la figura ${figure.archivo}.`)
        if (figure.en !== undefined && figure.en !== 'solucion') throw new Error(`${at}: «en» solo puede ser 'solucion'.`)
        if (figure.en === 'solucion' && !problem.solucion) throw new Error(`${at}: figura de solución sin solución.`)
        if (!figure.alt || figure.alt.length < 5 || figure.alt.length > 300) throw new Error(`${at}: la descripción de ${figure.archivo} debe tener de 5 a 300 caracteres.`)
        checkMath(figure.alt, `${at} (descripción de ${figure.archivo})`)
      }
    })
  }
  const problems = buildOmmebProblems(exams)
  const codes = new Set(problems.map((p) => p.fields.codigo))
  if (codes.size !== problems.length) throw new Error('Hay códigos de problema repetidos.')
  return { exams: exams.length, problems: problems.length, figures: problems.reduce((sum, p) => sum + p.figures.length, 0) }
}
