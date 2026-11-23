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
import contradiccion from './contradiccion.js'
import induccion from './induccion-matematica.js'
import construccion from './construccion-existencia-y-unicidad.js'
import omm from './que-es-la-omm.js'
import porQue from './por-que-hacer-olimpiadas-de-matematicas.js'
import entrenar from './como-entrenar-para-una-olimpiada.js'
import abordar from './como-abordar-un-problema.js'
import introduccionPruebas from './introduccion-a-las-demostraciones.js'
import escribir from './como-escribir-una-solucion.js'
import organizar from './como-organizar-tu-entrenamiento.js'
import atasco from './que-hacer-cuando-no-puedes-resolver-un-problema.js'
import aprender from './como-aprender-de-una-solucion.js'
import recursos from './como-usar-listas-libros-y-bancos-de-problemas.js'
import revisar from './como-revisar-tus-soluciones-y-detectar-errores.js'
import elegir from './como-elegir-que-estudiar.js'
import bases from './representacion-en-distintas-bases.js'
import digitos from './problemas-de-digitos.js'
import mixto from './entrenamiento-mixto-ciclo-1.js'
import modular from './aritmetica-modular.js'
import inversos from './inversos-y-congruencias-lineales.js'
import puntosNotables from './rectas-y-puntos-notables.js'
import bisectrices from './bisectrices-incentro-y-excentros.js'
import areasTriangulos from './areas-y-razones-en-triangulos.js'
import medias from './desigualdades-y-medias-fundamentales.js'
import desigualdadUtil from './la-desigualdad-util.js'
import binomiales from './coeficientes-binomiales-y-triangulo-de-pascal.js'
import dobleConteo from './doble-conteo.js'
import inclusionExclusion from './inclusion-exclusion.js'
import cevaMenelao from './ceva-y-menelao.js'
import cauchySchwarz from './cauchy-schwarz-y-tecnicas-clasicas.js'
import homogeneizacion from './homogeneizacion-y-sustituciones.js'
import mixtoCiclo2 from './entrenamiento-mixto-ciclo-2.js'

// Lessons rewritten in the lesson format of the theory page (spec «Página de
// teoría», Part 2). Each file holds the new summary and text of one lesson,
// the new banco problems it introduces and the problem collections its boxes
// point to. mvpLessons.js applies them as the last layer.
const LESSONS = [angulos, casillas, semejanza, areas, factorizacion, pitagoras, manipulaciones, ecuaciones, divisibilidad, primos, mcd, bezout, conteo, permutaciones, directa, casos, contraposicion, contradiccion, induccion, construccion, omm, porQue, entrenar, abordar, introduccionPruebas, escribir, organizar, atasco, aprender, recursos, revisar, elegir, bases, digitos, mixto, modular, inversos, puntosNotables, bisectrices, areasTriangulos, medias, desigualdadUtil, binomiales, dobleConteo, inclusionExclusion, cevaMenelao, cauchySchwarz, homogeneizacion, mixtoCiclo2]

export const THEORY_REWRITES = Object.freeze(Object.fromEntries(LESSONS.map((lesson) => [lesson.pathSlug, lesson])))

export const THEORY_PROBLEMS = LESSONS.flatMap((lesson) => lesson.problems)

export const THEORY_COLLECTIONS = LESSONS.flatMap((lesson) => Object.entries(lesson.collections)
  .flatMap(([slug, kinds]) => Object.entries(kinds).map(([kind, problemCodes]) => ({ slug, kind, problemCodes }))))
