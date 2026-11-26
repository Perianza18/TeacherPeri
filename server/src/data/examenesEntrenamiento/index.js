// ---------------------------------------------------------------------------
// Exámenes de entrenamiento: selection and training exams that came as loose
// PDFs (Archive 3), transcribed one file per exam. None of the PDFs has
// answers, so every problem carries a note instead.
//
// On top of the problem fields described in ../examCollections.js, each file
// sets:
//   carpeta          the folder path below «Exámenes», including the year
//   year             that year
//   nombre           the exam's full name (credit and instructions)
//   fecha            as printed on the exam
//   codigo           code prefix of its problems («IMC-MX-2021-SEL1»)
//   tituloProblemas  start of every problem title, before «<year> · Problema <n>»
//   dificultad       basico | intermedio | avanzado (never shown publicly)
//   organizacion     shown on the exam page
//   duracionMinutos, indicaciones (plain text, no $)
// ---------------------------------------------------------------------------

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineCollection } from '../examCollections.js'

import imc2021Examen1 from './imc-2021-selectivo-1.js'
import imc2021Examen2 from './imc-2021-selectivo-2.js'
import imc2021Examen3 from './imc-2021-selectivo-3.js'
import imc2021Examen5 from './imc-2021-selectivo-5.js'
import pagmo2021Examen1 from './pagmo-2021-selectivo-1.js'
import ommGuerrero2026Estatal from './omm-guerrero-2026-estatal.js'

// Every exam. Add the import of a new exam file here.
export const EXAMENES_ENTRENAMIENTO_EXAMS = [
  imc2021Examen1,
  imc2021Examen2,
  imc2021Examen3,
  imc2021Examen5,
  pagmo2021Examen1,
  ommGuerrero2026Estatal,
]

export const FIGURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'figuras')

export { SIN_RESPUESTA } from './comun.js'

function describe(exam) {
  return {
    folder: exam.carpeta,
    year: exam.year,
    label: exam.nombre,
    heading: `${exam.nombre} · ${exam.fecha}.`,
    date: exam.fecha,
    code: (n) => `${exam.codigo}-${String(n).padStart(2, '0')}`,
    title: (n) => `${exam.tituloProblemas} · ${exam.year} · Problema ${n}`,
    competition: exam.carpeta[0],
    round: exam.carpeta.slice(1).filter((name) => name !== exam.year).join(' · '),
    difficulty: exam.dificultad,
    organization: exam.organizacion,
  }
}

export const EXAMENES_ENTRENAMIENTO = defineCollection({
  key: 'examenes-entrenamiento',
  name: 'Exámenes de entrenamiento',
  exams: EXAMENES_ENTRENAMIENTO_EXAMS,
  figuresDir: FIGURES_DIR,
  describe,
})
