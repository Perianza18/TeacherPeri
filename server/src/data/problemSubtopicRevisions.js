// Curated subtopics for published problems that only had an area in November 2026.
// Values are topic slugs; existing classifications are preserved.
const groups = {
  'omm-algebra-desigualdades': 'TP-A84 TP-A83 TP-A81 TP-A80 TP-A72 TP-A71 TP-A59 TP-A48 TP-A47 TP-A45',
  'omm-algebra-fracciones': 'TP-A82',
  'omm-algebra-factorizacion': 'TP-A16 TP-A15 TP-A01 TP-A02',
  'omm-geometria-triangulos': 'TP-G96 TP-G95 TP-G94 TP-G93 TP-G92 TP-G91 TP-G90 TP-G89 TP-G72 TP-G71 TP-G70 TP-G67 TP-G60 TP-G59 TP-G57 TP-G55 TP-G54 TP-G48 TP-G47 TP-G46',
  'omm-geometria-areas': 'TP-G84 TP-G83 TP-G82 TP-G81 TP-G80 TP-G79 TP-G78 TP-G77 TP-G38 TP-G37',
  'omm-geometria-semejanza': 'TP-G28 TP-G27',
  'omm-geometria-angulos': 'TP-G18 TP-G17 TP-G15 TP-G14',
  'omm-combinatoria-conteo': 'TP-C72 TP-C71 TP-C69 TP-C60 TP-C59 TP-C57 TP-C56 TP-C48 TP-C47 TP-C43 TP-C42 TP-C26',
  'omm-combinatoria-principio-de-casillas': 'TP-C06 TP-C16 TP-C15 TP-C14 TP-C12',
  'omm-teoria-de-numeros-congruencias': 'TP-M24 TP-M14 TP-M13 TP-M02',
  'omm-teoria-de-numeros-digitos': 'TP-D24 TP-D23 TP-D14 TP-D13',
  'omm-teoria-de-numeros-maximo-comun-divisor': 'TP-N48 TP-N47 TP-N38 TP-N37 TP-N36',
  'omm-teoria-de-numeros-divisores': 'TP-N28 TP-N25',
  'omm-teoria-de-numeros-divisibilidad': 'TP-N17',
  'omm-demostraciones-construccion': 'TP-P62 TP-P61',
  'omm-demostraciones-contradiccion': 'TP-P40 TP-P39',
  'omm-demostraciones-contraposicion': 'TP-P29',
  'omm-demostraciones-casos': 'TP-P19',
  'omm-demostraciones-directa': 'TP-P09',
}

export const PROBLEM_SUBTOPICS = Object.fromEntries(Object.entries(groups).flatMap(([slug, codes]) => codes.split(' ').map((code) => [code, slug])))
export const NEW_PROOF_TOPICS = [
  { name: 'Construcción y existencia', slug: 'omm-demostraciones-construccion' },
  { name: 'Contradicción', slug: 'omm-demostraciones-contradiccion' },
  { name: 'Contraposición', slug: 'omm-demostraciones-contraposicion' },
  { name: 'Demostración por casos', slug: 'omm-demostraciones-casos' },
  { name: 'Demostración directa', slug: 'omm-demostraciones-directa' },
]
// The test database predates the contest topic tree present in production.
export const TEST_TOPIC_PREREQUISITES = [
  ['omm-algebra', 'Desigualdades', 'omm-algebra-desigualdades'],
  ['omm-algebra', 'Fracciones', 'omm-algebra-fracciones'],
  ['omm-algebra', 'Factorización', 'omm-algebra-factorizacion'],
  ['omm-geometry', 'Triángulos', 'omm-geometria-triangulos'],
  ['omm-geometry', 'Áreas', 'omm-geometria-areas'],
  ['omm-geometry', 'Semejanza', 'omm-geometria-semejanza'],
  ['omm-geometry', 'Ángulos', 'omm-geometria-angulos'],
  ['omm-combinatorics', 'Conteo', 'omm-combinatoria-conteo'],
  ['omm-combinatorics', 'Principio de casillas', 'omm-combinatoria-principio-de-casillas'],
  ['omm-number-theory', 'Congruencias', 'omm-teoria-de-numeros-congruencias'],
  ['omm-number-theory', 'Dígitos', 'omm-teoria-de-numeros-digitos'],
  ['omm-number-theory', 'Máximo común divisor', 'omm-teoria-de-numeros-maximo-comun-divisor'],
  ['omm-number-theory', 'Divisores', 'omm-teoria-de-numeros-divisores'],
  ['omm-number-theory', 'Divisibilidad', 'omm-teoria-de-numeros-divisibilidad'],
]
export const REMOVE_PISO_FROM = ['OMM-2005-P2', 'OMM-2016-P3']
export const REPLACE_NARROW_TOPICS = [
  { code: 'OMM-2017-P4', from: 'omm-algebra-desigualdad-triangular', to: 'omm-algebra-desigualdades' },
]
