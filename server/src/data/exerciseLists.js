import { THEORY_REWRITES } from './theory/index.js'
import { MVP_LESSONS } from './mvpLessons.js'

// Additional direct applications found outside the lesson exercise boxes.
// The keys are lesson slugs; ordering is deliberate and codes may recur.
const additional = {
  'angulos-paralelas-y-perpendiculares': ['TP-G01','TP-G02','TP-G13','TP-G16'],
  'semejanza-y-congruencia': ['TP-G03','TP-G04','TP-G23','TP-G24','TP-G25','TP-G26'],
  'areas-y-razones': ['TP-G05','TP-G06','TP-G33','TP-G34','TP-G35','TP-G36'],
  'factorizacion-e-identidades': ['TP-A03','TP-A04','TP-A11','TP-A12','TP-A13','TP-A14','TP-A21','TP-A22'],
  'teorema-de-pitagoras': ['TP-G07','TP-G08','TP-G43','TP-G44','TP-G45'],
  'manipulaciones-y-sustituciones-algebraicas': ['TP-A03','TP-A04','TP-A21','TP-A22','TP-A23','TP-A24','TP-A25','TP-A26'],
  'ecuaciones-algebraicas': ['TP-A05','TP-A06','TP-A31','TP-A32','TP-A33','TP-A34','TP-A35','TP-A36'],
  'divisibilidad-y-criterios-de-divisibilidad': ['TP-N01','TP-N02','TP-N13','TP-N14','TP-N15','TP-N16','TP-N18'],
  'primos-y-factorizacion': ['TP-N03','TP-N04','TP-N23','TP-N24','TP-N26','TP-N27'],
  'mcd-mcm-y-algoritmo-de-euclides': ['TP-N05','TP-N06','TP-N33','TP-N34','TP-N35'],
  'bezout-y-combinaciones-lineales': ['TP-N07','TP-N08','TP-N43','TP-N44','TP-N45','TP-N46'],
  'principio-aditivo-y-multiplicativo': ['TP-C01','TP-C02','TP-C21','TP-C22','TP-C23','TP-C24','TP-C25'],
  'principio-de-casillas': ['TP-C05','TP-C11','TP-C13'],
  'permutaciones-y-combinaciones': ['TP-C03','TP-C04','TP-C31','TP-C32','TP-C33','TP-C34','TP-C35','TP-C36'],
  'demostracion-directa': ['TP-P05','TP-P06','TP-P07','TP-P08','TP-P10'],
  'demostracion-por-casos': ['TP-P15','TP-P16','TP-P17','TP-P18','TP-P20'],
  'contraposicion': ['TP-P25','TP-P26','TP-P27','TP-P28','TP-P30'],
  'contradiccion': ['TP-P35','TP-P36','TP-P37','TP-P38'],
  'induccion-matematica': ['TP-P45','TP-P46','TP-P47','TP-P48','TP-P49','TP-P50','TP-P51','TP-P52'],
  'construccion-existencia-y-unicidad': ['TP-P57','TP-P58','TP-P59','TP-P60'],
  'representacion-en-distintas-bases': ['TP-D01','TP-D02','TP-D09','TP-D10','TP-D11','TP-D12'],
  'problemas-de-digitos': ['TP-D03','TP-D04','TP-D19','TP-D20','TP-D21','TP-D22'],
  'aritmetica-modular': ['TP-M01','TP-M09','TP-M10','TP-M11','TP-M12'],
  'inversos-y-congruencias-lineales': ['TP-M03','TP-M04','TP-M19','TP-M20','TP-M21','TP-M22','TP-M23'],
  'rectas-y-puntos-notables': ['TP-G53','TP-G56','TP-G58'],
  'bisectrices-incentro-y-excentros': ['TP-G65','TP-G66','TP-G68','TP-G69'],
  'areas-y-razones-en-triangulos': ['TP-G53','TP-G68'],
  'desigualdades-y-medias-fundamentales': ['TP-A41','TP-A42','TP-A43','TP-A44','TP-A46','TP-A77','TP-A78'],
  'la-desigualdad-util': ['TP-A53','TP-A54','TP-A55','TP-A56','TP-A57','TP-A58','TP-A60'],
  'coeficientes-binomiales-y-triangulo-de-pascal': ['TP-C41','TP-C44','TP-C45','TP-C46'],
  'doble-conteo': ['TP-C53','TP-C54','TP-C55','TP-C58'],
  'inclusion-exclusion': ['TP-C65','TP-C66','TP-C67','TP-C68','TP-C70'],
  'cauchy-schwarz-y-tecnicas-clasicas': ['TP-A42','TP-A55','TP-A65','TP-A66','TP-A67','TP-A68','TP-A69','TP-A70'],
  'homogeneizacion-y-sustituciones': ['TP-A77','TP-A78','TP-A79'],
}

export const EXERCISE_LISTS = Object.entries(THEORY_REWRITES).map(([slug, lesson]) => {
  const source = MVP_LESSONS.find((entry) => entry.pathSlug === slug)
  const boxes = Object.values(lesson.collections).flatMap((kinds) => kinds.ejercicios || [])
  return { slug, title: source.theory.title, area: source.area, codes: [...new Set([...boxes, ...(additional[slug] || [])])] }
}).filter((list) => list.codes.length)

export const EXERCISE_CODES = [...new Set(EXERCISE_LISTS.flatMap((list) => list.codes))]
