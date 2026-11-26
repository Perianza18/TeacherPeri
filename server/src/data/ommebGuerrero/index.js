// ---------------------------------------------------------------------------
// OMMEB Guerrero: the state (Estatal) and selection (Selectivo) exams of the
// Olimpiada Mexicana de Matemáticas para Educación Básica in Guerrero,
// transcribed from the PDFs the team gave us (7a to 10a edición, levels 1 to
// 3). One file per exam (<year>-<estatal|selectivo>-n<level>.js) with these
// fields on top of the problem fields described in ../examCollections.js:
//   edicion, year, etapa ('Estatal' | 'Selectivo'), nivel (1 | 2 | 3), grados,
//   fecha, lugar (optional), duracionMinutos, indicaciones.
// Exams go into Exámenes › OMMEB › Guerrero › <year> › <etapa> › Nivel <n>,
// so the Exámenes page titles them «OMMEB 2025 · Guerrero · Estatal · Nivel 1».
// ---------------------------------------------------------------------------

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineCollection } from '../examCollections.js'

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
export const STAGES = ['Estatal', 'Selectivo']

export const examFolderPath = (exam) => ['OMMEB', 'Guerrero', exam.year, exam.etapa, `Nivel ${exam.nivel}`]
export const examLabel = (exam) => `${exam.edicion}a OMMEB Guerrero · ${exam.etapa === 'Estatal' ? 'Concurso Estatal' : 'Examen Selectivo'} · Nivel ${exam.nivel}`
export const problemCode = (exam, n) => `OMMEB-GRO-${exam.year}-${exam.etapa === 'Estatal' ? 'EST' : 'SEL'}-N${exam.nivel}-${String(n).padStart(2, '0')}`

function describe(exam) {
  if (!STAGES.includes(exam.etapa) || ![1, 2, 3].includes(exam.nivel) || !exam.grados) throw new Error(`${exam.year} ${exam.etapa} ${exam.nivel}: etapa, nivel o grados inválidos.`)
  return {
    folder: examFolderPath(exam),
    year: exam.year,
    label: examLabel(exam),
    heading: `${examLabel(exam)} (${exam.grados}). ${exam.lugar ? `${exam.lugar}, ` : ''}${exam.fecha}.`,
    date: exam.fecha,
    code: (n) => problemCode(exam, n),
    title: (n) => `OMMEB Guerrero · ${exam.etapa} Nivel ${exam.nivel} · ${exam.year} · Problema ${n}`,
    competition: 'OMMEB',
    round: `Guerrero · ${exam.etapa} · Nivel ${exam.nivel}`,
    difficulty: exam.nivel === 3 ? 'intermedio' : 'basico',
    organization: 'OMMEB Guerrero',
  }
}

export const OMMEB_GUERRERO = defineCollection({
  key: 'ommeb-guerrero',
  name: 'OMMEB Guerrero',
  exams: OMMEB_GUERRERO_EXAMS,
  figuresDir: FIGURES_DIR,
  describe,
})

export const examInstructions = OMMEB_GUERRERO.instructions
export const buildOmmebProblems = OMMEB_GUERRERO.buildProblems
export const validateOmmebGuerrero = OMMEB_GUERRERO.validate
