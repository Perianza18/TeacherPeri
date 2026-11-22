import angulos from './angulos-paralelas-y-perpendiculares.js'
import casillas from './principio-de-casillas.js'
import semejanza from './semejanza-y-congruencia.js'
import areas from './areas-y-razones.js'
import factorizacion from './factorizacion-e-identidades.js'
import pitagoras from './teorema-de-pitagoras.js'
import manipulaciones from './manipulaciones-y-sustituciones-algebraicas.js'
import ecuaciones from './ecuaciones-algebraicas.js'
import divisibilidad from './divisibilidad-y-criterios-de-divisibilidad.js'
import primos from './primos-y-factorizacion.js'
import mcd from './mcd-mcm-y-algoritmo-de-euclides.js'
import bezout from './bezout-y-combinaciones-lineales.js'
import conteo from './principio-aditivo-y-multiplicativo.js'
import permutaciones from './permutaciones-y-combinaciones.js'
import directa from './demostracion-directa.js'
import casos from './demostracion-por-casos.js'
import contraposicion from './contraposicion.js'

// Lessons rewritten in the lesson format of the theory page (spec «Página de
// teoría», Part 2). Each file holds the new summary and text of one lesson,
// the new banco problems it introduces and the problem collections its boxes
// point to. mvpLessons.js applies them as the last layer.
const LESSONS = [angulos, casillas, semejanza, areas, factorizacion, pitagoras, manipulaciones, ecuaciones, divisibilidad, primos, mcd, bezout, conteo, permutaciones, directa, casos, contraposicion]

export const THEORY_REWRITES = Object.freeze(Object.fromEntries(LESSONS.map((lesson) => [lesson.pathSlug, lesson])))

export const THEORY_PROBLEMS = LESSONS.flatMap((lesson) => lesson.problems)

export const THEORY_COLLECTIONS = LESSONS.flatMap((lesson) => Object.entries(lesson.collections)
  .flatMap(([slug, kinds]) => Object.entries(kinds).map(([kind, problemCodes]) => ({ slug, kind, problemCodes }))))
