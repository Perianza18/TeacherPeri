// Otros nombres comunes de los temas, para que el buscador de «Proponer un
// problema» encuentre «Principio de casillas» aunque alguien escriba
// «palomar». La clave es el nombre del tema (sin mayúsculas ni acentos), así
// sirve igual para «Combinatoria › Paridad» que para «Álgebra › Paridad».
// Los sinónimos que agrega la revisión al unir un tema propuesto se guardan
// en el campo `aliases` de cada Topic y se suman a estos.
import { normalizeSlug } from '../models/content.js'

export const TOPIC_ALIASES = {
  // Combinatoria
  'principio de casillas': ['palomar', 'principio del palomar', 'casillas', 'cajones', 'pichoneras', 'Dirichlet', 'pigeonhole'],
  invariantes: ['invariante', 'monovariante', 'semiinvariante'],
  paridad: ['par e impar', 'pares', 'impares'],
  conteo: ['contar', 'principio multiplicativo', 'principio de la suma', 'permutaciones', 'conteo doble'],
  combinaciones: ['coeficientes binomiales', 'binomio de Newton', 'triángulo de Pascal', 'combinatorios'],
  conjuntos: ['diagramas de Venn', 'Venn', 'inclusión-exclusión', 'inclusión exclusión'],
  grafos: ['gráficas', 'vértices', 'aristas', 'redes'],
  caminos: ['trayectorias', 'rutas', 'caminos en cuadrícula'],
  coloreos: ['colorear', 'coloración', 'colores'],
  tableros: ['ajedrez', 'cuadrícula', 'cuadriculado'],
  recubrimientos: ['teselaciones', 'embaldosados', 'mosaicos', 'fichas de dominó', 'poliominós'],
  juegos: ['estrategia ganadora', 'juegos combinatorios', 'Nim'],
  emparejamientos: ['parejas', 'apareamientos', 'biyecciones'],
  estrategias: ['estrategia'],
  transformaciones: ['rotaciones', 'reflexiones', 'simetrías', 'traslaciones'],
  optimizacion: ['máximos y mínimos', 'máximo', 'mínimo', 'extremos'],
  // Geometría
  circunferencias: ['círculos', 'círculo', 'cuerdas', 'arcos', 'potencia de un punto', 'cíclicos'],
  cuadrilateros: ['cuadrilátero cíclico', 'paralelogramos', 'trapecios', 'rombos'],
  semejanza: ['triángulos semejantes', 'Tales', 'Thales'],
  proporciones: ['razones', 'proporcionalidad', 'Tales', 'Thales'],
  areas: ['área', 'superficie'],
  angulos: ['ángulo', 'ángulos inscritos', 'ángulo central'],
  triangulos: ['triángulo', 'Pitágoras', 'teorema de Pitágoras'],
  tangencias: ['tangente', 'tangentes'],
  alturas: ['altura', 'ortocentro'],
  ortocentro: ['alturas'],
  colinealidad: ['colineales', 'puntos alineados', 'Menelao'],
  perpendicularidad: ['perpendiculares'],
  'lugares geometricos': ['lugar geométrico', 'mediatriz', 'bisectriz'],
  'geometria espacial': ['3D', 'tridimensional', 'sólidos', 'volumen', 'cubos'],
  poliedros: ['sólidos', 'cubos', 'prismas', 'pirámides'],
  poligonos: ['polígono regular', 'pentágono', 'hexágono'],
  coordenadas: ['geometría analítica', 'plano cartesiano'],
  distancias: ['distancia'],
  // Teoría de números
  congruencias: ['módulo', 'mod', 'aritmética modular', 'residuos', 'clases de residuos'],
  divisibilidad: ['divisible', 'múltiplos', 'criterios de divisibilidad'],
  divisores: ['número de divisores', 'suma de divisores'],
  'maximo comun divisor': ['MCD', 'gcd', 'algoritmo de Euclides'],
  'minimo comun multiplo': ['MCM', 'lcm'],
  'numeros primos': ['primos', 'primalidad'],
  'factorizacion prima': ['descomposición en primos', 'teorema fundamental de la aritmética'],
  digitos: ['cifras', 'bases', 'sistema decimal'],
  'cuadrados perfectos': ['cuadrados'],
  'ecuaciones diofanticas': ['soluciones enteras', 'ecuaciones en enteros'],
  potencias: ['exponentes'],
  promedios: ['media', 'media aritmética'],
  // Álgebra
  'ecuaciones funcionales': ['funcionales', 'funciones'],
  desigualdades: ['desigualdad', 'MA-MG', 'MG-MA', 'AM-GM', 'medias', 'Cauchy-Schwarz'],
  'desigualdad triangular': ['desigualdad del triángulo'],
  piso: ['parte entera', 'función piso', 'techo', 'floor'],
  recurrencias: ['recursión', 'relaciones de recurrencia'],
  sucesiones: ['secuencias'],
  'progresiones aritmeticas': ['progresión aritmética'],
  sumas: ['sumatorias', 'sumas telescópicas', 'telescópica'],
  factorizacion: ['factorizar', 'productos notables', 'diferencia de cuadrados'],
  fracciones: ['racionales', 'quebrados'],
  ecuaciones: ['sistemas de ecuaciones', 'ecuación cuadrática', 'cuadráticas'],
  // Técnicas de demostración
  contradiccion: ['reducción al absurdo', 'absurdo'],
  contraposicion: ['contrarrecíproco'],
  'demostracion por casos': ['casos', 'análisis de casos'],
  'construccion y existencia': ['construcción', 'existencia', 'dar un ejemplo'],
}

const BY_KEY = new Map(Object.entries(TOPIC_ALIASES).map(([name, aliases]) => [normalizeSlug(name), aliases]))

// Common aliases plus the ones stored on the topic, without repeats and
// without the topic's own name.
export function aliasesFor(topic) {
  const own = normalizeSlug(topic.name)
  const seen = new Set([own])
  const result = []
  for (const alias of [...(BY_KEY.get(own) || []), ...(topic.aliases || [])]) {
    const key = normalizeSlug(alias)
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push(alias)
  }
  return result
}
