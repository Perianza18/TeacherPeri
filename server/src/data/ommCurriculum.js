const DRAFT = 'draft'

function path(title, slug, area, level, role = 'leaf', options = {}) {
  return { title, slug, area, level, role, publicationStatus: DRAFT, steps: [], children: options.children || [], childrenPending: options.childrenPending || false, description: options.description || `Ruta curricular provisional sobre ${title}.`, editorialGap: options.editorialGap || 'Requiere revisión editorial y contenido aprobado antes de publicarse.' }
}
const leaf = (title, slug, area, level = 'omm') => path(title, slug, area, level)
const group = (title, slug, area, level = 'omm', children = [], options = {}) => path(title, slug, area, level, 'group', { ...options, children })
const pendingGroup = (title, slug, area, level = 'avanzado') => group(title, slug, area, level, [], { childrenPending: true, editorialGap: 'Grupo intencional con hijos pendientes de la auditoría humana de la materia.' })

const fundamentals = group('Fundamentos para Olimpiadas', 'fundamentos-para-olimpiadas', 'orientation', 'introductorio', [
  leaf('¿Qué es la OMM?', 'que-es-la-omm', 'orientation', 'introductorio'), leaf('¿Por qué hacer Olimpiadas de Matemáticas?', 'por-que-hacer-olimpiadas-de-matematicas', 'orientation', 'introductorio'), leaf('¿Cómo entrenar para una Olimpiada?', 'como-entrenar-para-una-olimpiada', 'orientation', 'introductorio'), leaf('¿Cómo abordar un problema?', 'como-abordar-un-problema', 'strategy', 'introductorio'), leaf('Introducción a las Demostraciones', 'introduccion-a-las-demostraciones', 'proof', 'introductorio'), leaf('¿Cómo escribir una solución?', 'como-escribir-una-solucion', 'proof', 'introductorio'),
])
const startAdvice = group('Consejos para Empezar a Entrenar', 'consejos-para-empezar-a-entrenar', 'orientation', 'introductorio', [
  leaf('Cómo Organizar tu Entrenamiento', 'como-organizar-tu-entrenamiento', 'orientation', 'introductorio'), leaf('Qué Hacer Cuando no Puedes Resolver un Problema', 'que-hacer-cuando-no-puedes-resolver-un-problema', 'strategy', 'introductorio'), leaf('Cómo Aprender de una Solución', 'como-aprender-de-una-solucion', 'strategy', 'introductorio'), leaf('Cómo Usar Listas, Libros y Bancos de Problemas', 'como-usar-listas-libros-y-bancos-de-problemas', 'orientation', 'introductorio'), leaf('Cómo Revisar tus Soluciones y Detectar Errores', 'como-revisar-tus-soluciones-y-detectar-errores', 'proof', 'introductorio'), leaf('Cómo Elegir Qué Estudiar', 'como-elegir-que-estudiar', 'orientation', 'introductorio'),
])
const proofTechniques = group('Técnicas de Demostración', 'tecnicas-de-demostracion', 'proof', 'introductorio', [
  leaf('Demostración Directa', 'demostracion-directa', 'proof', 'introductorio'), leaf('Demostración por Casos', 'demostracion-por-casos', 'proof', 'introductorio'), leaf('Contraposición', 'contraposicion', 'proof', 'introductorio'), leaf('Contradicción', 'contradiccion', 'proof', 'introductorio'), leaf('Inducción Matemática', 'induccion-matematica', 'proof', 'introductorio'), leaf('Construcción, Existencia y Unicidad', 'construccion-existencia-y-unicidad', 'proof', 'introductorio'),
])

const sections = [
  { key: 'cycle-1', title: 'Ciclo 1 — Primeros Pasos', paths: [
    group('Geometría Básica para Olimpiadas', 'geometria-basica-para-olimpiadas', 'geometry', 'introductorio', [leaf('Ángulos, Paralelas y Perpendiculares', 'angulos-paralelas-y-perpendiculares', 'geometry', 'introductorio'), leaf('Semejanza y Congruencia', 'semejanza-y-congruencia', 'geometry', 'introductorio'), leaf('Áreas y Razones', 'areas-y-razones', 'geometry', 'introductorio'), leaf('Teorema de Pitágoras', 'teorema-de-pitagoras', 'geometry', 'introductorio')]),
    group('Álgebra Básica para Olimpiadas', 'algebra-basica-para-olimpiadas', 'algebra', 'introductorio', [leaf('Factorización e Identidades', 'factorizacion-e-identidades', 'algebra', 'introductorio'), leaf('Manipulaciones y Sustituciones Algebraicas', 'manipulaciones-y-sustituciones-algebraicas', 'algebra', 'introductorio'), leaf('Ecuaciones Algebraicas', 'ecuaciones-algebraicas', 'algebra', 'introductorio')]),
    group('Divisibilidad y Primos', 'divisibilidad-y-primos', 'number-theory', 'introductorio', [leaf('Divisibilidad y Criterios de Divisibilidad', 'divisibilidad-y-criterios-de-divisibilidad', 'number-theory', 'introductorio'), leaf('Primos y Factorización', 'primos-y-factorizacion', 'number-theory', 'introductorio'), leaf('MCD, MCM y Algoritmo de Euclides', 'mcd-mcm-y-algoritmo-de-euclides', 'number-theory', 'introductorio'), leaf('Bézout y Combinaciones Lineales', 'bezout-y-combinaciones-lineales', 'number-theory', 'introductorio')]),
    group('Conteo Básico', 'conteo-basico', 'combinatorics', 'introductorio', [leaf('Principio Aditivo y Multiplicativo', 'principio-aditivo-y-multiplicativo', 'combinatorics', 'introductorio'), leaf('Permutaciones y Combinaciones', 'permutaciones-y-combinaciones', 'combinatorics', 'introductorio')]),
    leaf('Principio de Casillas', 'principio-de-casillas', 'combinatorics', 'introductorio'),
    group('Dígitos y Sistemas de Numeración', 'digitos-y-sistemas-de-numeracion', 'number-theory', 'introductorio', [leaf('Representación en Distintas Bases', 'representacion-en-distintas-bases', 'number-theory', 'introductorio'), leaf('Problemas de Dígitos', 'problemas-de-digitos', 'number-theory', 'introductorio')]),
    leaf('Entrenamiento Mixto — Ciclo 1', 'entrenamiento-mixto-ciclo-1', 'mixed', 'introductorio'),
  ] },
  { key: 'cycle-2', title: 'Ciclo 2 — Herramientas Fundamentales', paths: [
    group('Triángulos I — Estructura y Razones', 'triangulos-1-estructura-y-razones', 'geometry', 'omm', [leaf('Rectas y Puntos Notables', 'rectas-y-puntos-notables', 'geometry'), leaf('Bisectrices, Incentro y Excentros', 'bisectrices-incentro-y-excentros', 'geometry'), leaf('Áreas y Razones en Triángulos', 'areas-y-razones-en-triangulos', 'geometry')]),
    group('Aritmética Modular y Congruencias', 'aritmetica-modular-y-congruencias', 'number-theory', 'omm', [leaf('Aritmética Modular', 'aritmetica-modular', 'number-theory'), leaf('Inversos y Congruencias Lineales', 'inversos-y-congruencias-lineales', 'number-theory')]),
    group('Desigualdades Fundamentales I', 'desigualdades-fundamentales-1', 'algebra', 'omm', [leaf('Desigualdades y Medias Fundamentales', 'desigualdades-y-medias-fundamentales', 'algebra'), leaf('La Desigualdad Útil', 'la-desigualdad-util', 'algebra')]),
    group('Técnicas de Conteo', 'tecnicas-de-conteo', 'combinatorics', 'omm', [leaf('Coeficientes Binomiales y Triángulo de Pascal', 'coeficientes-binomiales-y-triangulo-de-pascal', 'combinatorics'), leaf('Doble Conteo', 'doble-conteo', 'combinatorics'), leaf('Inclusión-Exclusión', 'inclusion-exclusion', 'combinatorics')]),
    leaf('Ceva y Menelao', 'ceva-y-menelao', 'geometry'),
    group('Desigualdades Fundamentales II', 'desigualdades-fundamentales-2', 'algebra', 'omm', [leaf('Cauchy-Schwarz y Técnicas Clásicas', 'cauchy-schwarz-y-tecnicas-clasicas', 'algebra'), leaf('Homogeneización y Sustituciones', 'homogeneizacion-y-sustituciones', 'algebra')]),
    leaf('Entrenamiento Mixto — Ciclo 2', 'entrenamiento-mixto-ciclo-2', 'mixed'),
  ] },
  { key: 'cycle-3', title: 'Ciclo 3 — Construyendo Técnica', paths: [
    group('Circunferencias I', 'circunferencias-1', 'geometry', 'omm', [leaf('Ángulos en Circunferencias', 'angulos-en-circunferencias', 'geometry'), leaf('Cuadriláteros Cíclicos', 'cuadrilateros-ciclicos', 'geometry')]),
    group('Ecuaciones Diofánticas I', 'ecuaciones-diofanticas-1', 'number-theory', 'omm', [leaf('Ecuaciones Diofánticas Lineales', 'ecuaciones-diofanticas-lineales', 'number-theory'), leaf('Diofánticas por Factorización', 'diofanticas-por-factorizacion', 'number-theory')]),
    group('Principios Combinatorios I', 'principios-combinatorios-1', 'combinatorics', 'omm', [leaf('Principio Extremal', 'principio-extremal', 'combinatorics'), leaf('Coloraciones', 'coloraciones', 'combinatorics')]),
    leaf('Potencia de un Punto', 'potencia-de-un-punto', 'geometry'),
    group('Polinomios para Olimpiadas', 'polinomios-para-olimpiadas', 'algebra', 'omm', [leaf('Raíces, Factores y Divisibilidad', 'raices-factores-y-divisibilidad', 'algebra'), leaf('Relaciones de Vieta', 'relaciones-de-vieta', 'algebra'), leaf('Polinomios en Problemas Olímpicos', 'polinomios-en-problemas-olimpicos', 'algebra')]),
    leaf('Ecuaciones Diofánticas con Congruencias', 'ecuaciones-diofanticas-con-congruencias', 'number-theory'), leaf('Invariantes y Monovariantes', 'invariantes-y-monovariantes', 'combinatorics'), leaf('Entrenamiento Mixto — Ciclo 3', 'entrenamiento-mixto-ciclo-3', 'mixed'),
  ] },
  { key: 'cycle-4', title: 'Ciclo 4 — Ampliando Herramientas', paths: [
    leaf('Eje Radical', 'eje-radical', 'geometry', 'avanzado'),
    group('Teoremas Modulares', 'teoremas-modulares', 'number-theory', 'avanzado', [leaf('Pequeño Teorema de Fermat y Teorema de Euler', 'pequeno-teorema-de-fermat-y-teorema-de-euler', 'number-theory', 'avanzado'), leaf('Teorema Chino del Residuo', 'teorema-chino-del-residuo', 'number-theory', 'avanzado')]),
    leaf('Sucesiones y Recurrencias', 'sucesiones-y-recurrencias', 'algebra', 'avanzado'),
    group('Transformaciones Geométricas', 'transformaciones-geometricas', 'geometry', 'avanzado', [leaf('Homotecia', 'homotecia', 'geometry', 'avanzado'), leaf('Rotaciones y Reflexiones', 'rotaciones-y-reflexiones', 'geometry', 'avanzado')]),
    group('Funciones Aritméticas y Valuaciones', 'funciones-aritmeticas-y-valuaciones', 'number-theory', 'avanzado', [leaf('Número y Suma de Divisores', 'numero-y-suma-de-divisores', 'number-theory', 'avanzado'), leaf('Función Phi de Euler', 'funcion-phi-de-euler', 'number-theory', 'avanzado'), leaf('Valuaciones Básicas', 'valuaciones-basicas', 'number-theory', 'avanzado')]),
    group('Biyecciones y Conteo Recursivo', 'biyecciones-y-conteo-recursivo', 'combinatorics', 'avanzado', [leaf('Biyecciones y Construcciones', 'biyecciones-y-construcciones', 'combinatorics', 'avanzado'), leaf('Fibonacci y Conteo Recursivo', 'fibonacci-y-conteo-recursivo', 'combinatorics', 'avanzado')]),
    group('Ecuaciones Funcionales I', 'ecuaciones-funcionales-1', 'algebra', 'omm', [leaf('Introducción a las Ecuaciones Funcionales', 'introduccion-a-las-ecuaciones-funcionales', 'algebra'), leaf('Sustituciones y Valores Especiales', 'sustituciones-y-valores-especiales', 'algebra')]),
    leaf('Juegos y Estrategias', 'juegos-y-estrategias', 'strategy', 'omm'), leaf('Entrenamiento Mixto — Ciclo 4', 'entrenamiento-mixto-ciclo-4', 'mixed', 'avanzado'),
  ] },
  { key: 'cycle-5', title: 'Ciclo 5 — Integración y Estrategia', paths: [
    leaf('Semejanza Espiral', 'semejanza-espiral', 'geometry', 'avanzado'),
    group('Ecuaciones Funcionales II', 'ecuaciones-funcionales-2', 'algebra', 'avanzado', [leaf('Inyectividad y Suprayectividad', 'inyectividad-y-suprayectividad', 'algebra', 'avanzado'), leaf('Estructura y Estrategias en Ecuaciones Funcionales', 'estructura-y-estrategias-en-ecuaciones-funcionales', 'algebra', 'avanzado')]),
    leaf('Trigonometría Olímpica', 'trigonometria-olimpica', 'geometry', 'avanzado'),
    group('Grafos para Olimpiadas', 'grafos-para-olimpiadas', 'combinatorics', 'avanzado', [leaf('Fundamentos de Grafos', 'fundamentos-de-grafos', 'combinatorics', 'avanzado'), leaf('Caminos, Ciclos y Conectividad', 'caminos-ciclos-y-conectividad', 'combinatorics', 'avanzado'), leaf('Árboles', 'arboles', 'combinatorics', 'avanzado'), leaf('Caminos Eulerianos', 'caminos-eulerianos', 'combinatorics', 'avanzado')]),
    group('Construcciones Auxiliares y Estrategias Geométricas', 'construcciones-auxiliares-y-estrategias-geometricas', 'geometry', 'avanzado', [leaf('Construcciones Auxiliares', 'construcciones-auxiliares', 'geometry', 'avanzado'), leaf('Estrategias Geométricas', 'estrategias-geometricas', 'geometry', 'avanzado')]),
    group('Estrategias de Teoría de Números', 'estrategias-de-teoria-de-numeros', 'number-theory', 'avanzado', [leaf('Descenso Infinito', 'descenso-infinito', 'number-theory', 'avanzado'), leaf('Salto de Vieta', 'salto-de-vieta', 'number-theory', 'avanzado')]),
    pendingGroup('Estrategias de Desigualdades', 'estrategias-de-desigualdades', 'algebra'), pendingGroup('Estrategias Algebraicas', 'estrategias-algebraicas', 'algebra'), pendingGroup('Estrategias Combinatorias', 'estrategias-combinatorias', 'combinatorics'),
    leaf('Entrenamiento Mixto — Ciclo 5', 'entrenamiento-mixto-ciclo-5', 'mixed', 'avanzado'),
  ] },
]
const competeAdvice = group('Consejos para Competir', 'consejos-para-competir', 'orientation', 'avanzado', [leaf('Cómo Prepararte Antes de una Competencia', 'como-prepararte-antes-de-una-competencia', 'orientation', 'avanzado'), leaf('Estrategia Durante una Olimpiada', 'estrategia-durante-una-olimpiada', 'strategy', 'avanzado'), leaf('Cómo Aprender Después de una Competencia', 'como-aprender-despues-de-una-competencia', 'orientation', 'avanzado')])
const simulations = group('Simulacros para la OMM', 'simulacros-para-la-omm', 'simulation', 'avanzado', [pendingGroup('Simulacros de Entrenamiento', 'simulacros-de-entrenamiento', 'simulation', 'avanzado'), leaf('Cómo Aprovechar un Simulacro', 'como-aprovechar-un-simulacro', 'strategy', 'avanzado'), pendingGroup('Simulacros Completos — Nivel OMM', 'simulacros-completos-nivel-omm', 'simulation', 'avanzado')])
const root = group('Preparación para la OMM', 'preparacion-para-la-omm', 'curriculum', 'omm', [])

const cycleOffset = (section) => sections.slice(0, sections.indexOf(section)).reduce((sum, item) => sum + item.paths.length, 0)
const rootEntries = [...[fundamentals, startAdvice, proofTechniques].map((child, index) => ({ parentSlug: root.slug, child, order: index + 1, placement: 'pre', sectionKey: null })), ...sections.flatMap((section) => section.paths.map((child, index) => ({ parentSlug: root.slug, child, order: 4 + cycleOffset(section) + index, placement: 'cycle', sectionKey: section.key }))), ...[competeAdvice, simulations].map((child, index) => ({ parentSlug: root.slug, child, order: 45 + index, placement: 'post', sectionKey: null }))]
function collect(item, paths, references) { if (paths.has(item.slug)) throw new Error(`Duplicate Path slug ${item.slug}.`); paths.set(item.slug, item); item.children.forEach((child, index) => { references.push({ parentSlug: item.slug, childSlug: child.slug, order: index + 1, sectionKey: null }); collect(child, paths, references) }) }
const paths = new Map(); const nestedReferences = []; collect(root, paths, nestedReferences); for (const entry of rootEntries) if (!paths.has(entry.child.slug)) collect(entry.child, paths, nestedReferences)
const references = [...rootEntries.map(({ parentSlug, child, order, sectionKey }) => ({ parentSlug, childSlug: child.slug, order, sectionKey })), ...nestedReferences]
export const OMM_CURRICULUM = Object.freeze({ root, sections, paths: [...paths.values()], rootEntries, references })

export function validateOmmCurriculumDefinition(curriculum = OMM_CURRICULUM) {
  const errors = []; const bySlug = new Map(curriculum.paths.map((item) => [item.slug, item]))
  if (curriculum.root.slug !== 'preparacion-para-la-omm' || curriculum.sections.length !== 5) errors.push('The root and five PathSections are required.')
  if (new Set(curriculum.paths.map((item) => item.slug)).size !== curriculum.paths.length || new Set(curriculum.paths.map((item) => item.title)).size !== curriculum.paths.length) errors.push('Path slugs and titles must be globally unique.')
  for (const item of curriculum.paths) { if (item.publicationStatus !== DRAFT || item.steps.length) errors.push(`${item.slug} must remain a draft without authored Steps.`); if (item.role === 'leaf' && (item.children.length || item.childrenPending)) errors.push(`${item.slug} is an invalid leaf.`); if (item.role === 'group' && item.childrenPending && item.children.length) errors.push(`${item.slug} cannot have both children and pending children.`) }
  const keys = new Set(); for (const reference of curriculum.references) { const key = `${reference.parentSlug}:${reference.childSlug}`; if (!bySlug.has(reference.parentSlug) || !bySlug.has(reference.childSlug) || reference.sectionKey && reference.parentSlug !== curriculum.root.slug || keys.has(key)) errors.push(`Invalid reference ${key}.`); keys.add(key) }
  const rootReferences = curriculum.references.filter((item) => item.parentSlug === curriculum.root.slug).sort((a, b) => a.order - b.order)
  if (rootReferences.length !== 46 || rootReferences.some((item, index) => item.order !== index + 1)) errors.push('Root chronology must contain 46 contiguous references.')
  const mixed = ['entrenamiento-mixto-ciclo-1', 'entrenamiento-mixto-ciclo-2', 'entrenamiento-mixto-ciclo-3', 'entrenamiento-mixto-ciclo-4', 'entrenamiento-mixto-ciclo-5']
  curriculum.sections.forEach((section, index) => { if (rootReferences.filter((item) => item.sectionKey === section.key).at(-1)?.childSlug !== mixed[index]) errors.push(`${section.title} must end with mixed training.`) })
  if (rootReferences.slice(0, 3).some((item) => item.sectionKey) || rootReferences.slice(-2).some((item) => item.sectionKey)) errors.push('Pre/post Paths cannot have root PathSections.')
  if (bySlug.get('estrategias-de-teoria-de-numeros')?.children.map((item) => item.slug).join('|') !== 'descenso-infinito|salto-de-vieta') errors.push('Number Theory strategies children are incorrect.')
  for (const slug of ['estrategias-de-desigualdades', 'estrategias-algebraicas', 'estrategias-combinatorias']) if (!bySlug.get(slug)?.childrenPending) errors.push(`${slug} must remain pending review.`)
  if (bySlug.get('simulacros-para-la-omm')?.children.map((item) => item.slug).join('|') !== 'simulacros-de-entrenamiento|como-aprovechar-un-simulacro|simulacros-completos-nivel-omm') errors.push('Simulation structure is incorrect.')
  if (errors.length) throw new Error(`Invalid OMM curriculum definition:\n- ${errors.join('\n- ')}`); return true
}
export function ommCurriculumTree(curriculum = OMM_CURRICULUM) {
  const bySlug = new Map(curriculum.paths.map((item) => [item.slug, item])); const children = new Map(); curriculum.references.forEach((reference) => { if (!children.has(reference.parentSlug)) children.set(reference.parentSlug, []); children.get(reference.parentSlug).push(reference) }); children.forEach((items) => items.sort((a, b) => a.order - b.order)); const lines = [curriculum.root.title]
  function render(parentSlug, prefix = '') { const items = children.get(parentSlug) || []; let previousSection = null; items.forEach((reference, index) => { const item = bySlug.get(reference.childSlug); const last = index === items.length - 1; if (parentSlug === curriculum.root.slug && reference.sectionKey && reference.sectionKey !== previousSection) lines.push(`\n[PathSection] ${curriculum.sections.find((section) => section.key === reference.sectionKey).title}`); previousSection = reference.sectionKey; lines.push(`${prefix}${last ? '└──' : '├──'} ${item.title} [${item.role === 'group' ? item.childrenPending ? 'Group pending review' : 'Group Path' : 'Intended Leaf'}]`); render(item.slug, `${prefix}${last ? '    ' : '│   '}`) }) }
  render(curriculum.root.slug); return lines.join('\n')
}
export function curriculumCounts(curriculum = OMM_CURRICULUM) { const groups = curriculum.paths.filter((item) => item.role === 'group'); return { paths: curriculum.paths.length, rootReferences: curriculum.rootEntries.length, nestedReferences: curriculum.references.length - curriculum.rootEntries.length, groups: groups.length, intendedLeaves: curriculum.paths.length - groups.length, unresolvedGroups: groups.filter((item) => item.childrenPending).length, sections: curriculum.sections.length, authoredSteps: 0, educationalReferences: 0 } }
