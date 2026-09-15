const DRAFT = 'draft'

function curriculumPath(title, slug, area, level = 'omm', options = {}) {
  return {
    title,
    slug,
    area,
    level,
    publicationStatus: DRAFT,
    description: options.description || `Ruta temática provisional sobre ${title}. Requiere desarrollo y revisión editorial antes de publicarse.`,
    steps: options.steps || [],
    editorialGap: options.editorialGap || 'Necesita Steps y referencias a contenido TeacherPeri aprobado.',
  }
}

function mixedSteps(cycle, emphasis) {
  return [
    {
      order: 1,
      title: 'Reconoce',
      description: `Identifica qué áreas y herramientas conocidas podrían servir en los problemas de este bloque. ${emphasis.recognize}`,
    },
    {
      order: 2,
      title: 'Resuelve',
      description: `Trabaja la selección sin depender de una etiqueta temática explícita. ${emphasis.solve}`,
    },
    {
      order: 3,
      title: 'Mezcla',
      description: `Busca conexiones entre técnicas del Ciclo ${cycle} y herramientas aprendidas anteriormente. ${emphasis.mix}`,
    },
    {
      order: 4,
      title: 'Reflexiona',
      description: `Revisa tus soluciones, identifica intentos improductivos y registra qué señales ayudaron a elegir un enfoque. ${emphasis.reflect}`,
    },
  ]
}

function mixedPath(cycle, level, emphasis) {
  return curriculumPath(
    `Entrenamiento Mixto — Ciclo ${cycle}`,
    `entrenamiento-mixto-ciclo-${cycle}`,
    'mixed',
    level,
    {
      description: `Punto de integración del Ciclo ${cycle}: práctica mixta para reconocer, seleccionar y combinar las herramientas estudiadas.`,
      steps: mixedSteps(cycle, emphasis),
      editorialGap: 'Necesita una selección revisada de problemas existentes; los Steps actuales solo definen el ritmo de trabajo.',
    },
  )
}

const preCyclePaths = [
  curriculumPath('Fundamentos de la Olimpiada', 'fundamentos-de-la-olimpiada', 'orientation', 'introductorio', {
    description: 'Orientación inicial sobre la matemática olímpica, las expectativas de entrenamiento y el uso de TeacherPeri.',
    editorialGap: 'Necesita contenido de orientación aprobado antes de publicarse.',
  }),
  curriculumPath('Técnicas de Demostración', 'tecnicas-de-demostracion', 'proof', 'introductorio', {
    description: 'Fundamentos tempranos para leer, construir y comunicar demostraciones matemáticas completas.',
    editorialGap: 'Necesita una secuencia revisada de técnicas y ejemplos de demostración.',
  }),
  curriculumPath('Consejos para Empezar a Entrenar', 'consejos-para-empezar-a-entrenar', 'orientation', 'introductorio', {
    description: 'Consejos iniciales para comenzar una rutina de entrenamiento sostenible y usar el recorrido con criterio.',
    editorialGap: 'Título y contenido siguen siendo provisionales y requieren revisión editorial.',
  }),
]

export const OMM_SECTIONS = [
  {
    key: 'cycle-1',
    title: 'Ciclo 1 — Primeros Pasos',
    goal: 'Aprender el lenguaje de la matemática olímpica y resolver problemas elementales no rutinarios con apoyo.',
    paths: [
      curriculumPath('Ángulos, Triángulos y Configuraciones Básicas', 'angulos-triangulos-y-configuraciones-basicas', 'geometry', 'introductorio'),
      curriculumPath('Divisibilidad y Números Primos', 'divisibilidad-y-numeros-primos', 'number-theory', 'introductorio'),
      curriculumPath('Identidades y Manipulación Algebraica', 'identidades-y-manipulacion-algebraica', 'algebra', 'introductorio'),
      curriculumPath('Conteo Básico', 'conteo-basico', 'combinatorics', 'introductorio'),
      curriculumPath('Congruencia y Semejanza de Triángulos', 'congruencia-y-semejanza-de-triangulos', 'geometry', 'introductorio'),
      curriculumPath('Máximo Común Divisor y Algoritmo de Euclides', 'maximo-comun-divisor-y-algoritmo-de-euclides', 'number-theory', 'introductorio'),
      curriculumPath('Factorización y Ecuaciones Elementales', 'factorizacion-y-ecuaciones-elementales', 'algebra', 'introductorio'),
      curriculumPath('Principio del Palomar', 'principio-del-palomar', 'combinatorics', 'introductorio'),
      mixedPath(1, 'introductorio', {
        recognize: 'Prioriza reconocer el área general y las herramientas recién estudiadas.',
        solve: 'Escribe soluciones breves pero completas para problemas accesibles.',
        mix: 'Compara problemas de las cuatro áreas sin asumir que aparecerán agrupados.',
        reflect: 'Comprueba que cada argumento tenga una conclusión explícita.',
      }),
    ],
  },
  {
    key: 'cycle-2',
    title: 'Ciclo 2 — Herramientas Fundamentales',
    goal: 'Construir el repertorio esencial y empezar a decidir qué herramienta conviene usar.',
    paths: [
      curriculumPath('Círculos: Ángulos y Propiedades Fundamentales', 'circulos-angulos-y-propiedades-fundamentales', 'geometry'),
      curriculumPath('Congruencias y Residuos', 'congruencias-y-residuos', 'number-theory'),
      curriculumPath('Desigualdades Fundamentales', 'desigualdades-fundamentales', 'algebra'),
      curriculumPath('Permutaciones y Combinaciones', 'permutaciones-y-combinaciones', 'combinatorics'),
      curriculumPath('Potencia de un Punto', 'potencia-de-un-punto', 'geometry'),
      curriculumPath('Ecuaciones Diofánticas Básicas', 'ecuaciones-diofanticas-basicas', 'number-theory'),
      curriculumPath('Principio de Inclusión-Exclusión', 'principio-de-inclusion-exclusion', 'combinatorics'),
      curriculumPath('Sucesiones: Primeros Patrones', 'sucesiones-primeros-patrones', 'algebra'),
      mixedPath(2, 'omm', {
        recognize: 'Distingue entre varias técnicas conocidas antes de comprometerte con una.',
        solve: 'Acepta argumentos un poco más largos y problemas sin una pista temática evidente.',
        mix: 'Combina herramientas recientes con fundamentos del Ciclo 1.',
        reflect: 'Explica por qué la técnica elegida fue adecuada.',
      }),
    ],
  },
  {
    key: 'cycle-3',
    title: 'Ciclo 3 — Construyendo Técnica',
    goal: 'Pasar de conocer herramientas aisladas a seleccionarlas y combinarlas deliberadamente.',
    paths: [
      curriculumPath('Ceva y Menelao', 'ceva-y-menelao', 'geometry'),
      curriculumPath('Polinomios y Raíces', 'polinomios-y-raices', 'algebra'),
      curriculumPath('Teoremas Clásicos de Aritmética Modular', 'teoremas-clasicos-de-aritmetica-modular', 'number-theory'),
      curriculumPath('Invariantes', 'invariantes', 'combinatorics'),
      curriculumPath('Desigualdades: Técnicas Intermedias', 'desigualdades-tecnicas-intermedias', 'algebra'),
      curriculumPath('Ecuaciones Diofánticas: Técnicas Intermedias', 'ecuaciones-diofanticas-tecnicas-intermedias', 'number-theory'),
      curriculumPath('Doble Conteo', 'doble-conteo', 'combinatorics'),
      curriculumPath('Configuraciones de Círculos', 'configuraciones-de-circulos', 'geometry'),
      curriculumPath('Recurrencias', 'recurrencias', 'algebra'),
      mixedPath(3, 'omm', {
        recognize: 'Busca señales menos explícitas y considera más de un enfoque inicial.',
        solve: 'Desarrolla argumentos de varias etapas con mayor independencia.',
        mix: 'Combina técnicas dentro de un mismo problema cuando una sola no baste.',
        reflect: 'Analiza por qué un primer enfoque pudo fallar y cómo cambiarlo.',
      }),
    ],
  },
  {
    key: 'cycle-4',
    title: 'Ciclo 4 — Ampliando Herramientas',
    goal: 'Ampliar el repertorio y aprender a cambiar de punto de vista ante problemas menos transparentes.',
    paths: [
      curriculumPath('Transformaciones Geométricas', 'transformaciones-geometricas', 'geometry', 'avanzado'),
      curriculumPath('Sucesiones y Recurrencias Avanzadas', 'sucesiones-y-recurrencias-avanzadas', 'algebra', 'avanzado'),
      curriculumPath('Órdenes y Estructura Modular', 'ordenes-y-estructura-modular', 'number-theory', 'avanzado'),
      curriculumPath('Principio Extremal', 'principio-extremal', 'combinatorics', 'omm'),
      curriculumPath('Desigualdades: Herramientas Avanzadas', 'desigualdades-herramientas-avanzadas', 'algebra', 'avanzado'),
      curriculumPath('Valuaciones y Exponentes en Teoría de Números', 'valuaciones-y-exponentes-en-teoria-de-numeros', 'number-theory', 'avanzado'),
      curriculumPath('Grafos para Olimpiadas', 'grafos-para-olimpiadas', 'combinatorics', 'omm'),
      curriculumPath('Polinomios: Técnicas Avanzadas', 'polinomios-tecnicas-avanzadas', 'algebra', 'avanzado'),
      curriculumPath('Introducción a Ecuaciones Funcionales', 'introduccion-a-ecuaciones-funcionales', 'algebra', 'omm'),
      mixedPath(4, 'avanzado', {
        recognize: 'Considera qué punto de vista vuelve visible la estructura del problema.',
        solve: 'Trabaja con pocas pistas y justifica decisiones intermedias.',
        mix: 'Integra herramientas antiguas y nuevas aunque la clasificación inicial sea difícil.',
        reflect: 'Compara enfoques y evalúa cuál produce una solución más clara.',
      }),
    ],
  },
  {
    key: 'cycle-5',
    title: 'Ciclo 5 — Integración y Estrategia',
    goal: 'Seguir aprendiendo matemática importante mientras domina la integración, la estrategia y la práctica difícil.',
    paths: [
      curriculumPath('Geometría Sintética Avanzada', 'geometria-sintetica-avanzada', 'geometry', 'avanzado'),
      curriculumPath('Descenso Infinito y Salto de Vieta', 'descenso-infinito-y-salto-de-vieta', 'number-theory', 'avanzado'),
      curriculumPath('Ecuaciones Funcionales: Técnicas Intermedias', 'ecuaciones-funcionales-tecnicas-intermedias', 'algebra', 'avanzado'),
      curriculumPath('Combinatoria Avanzada: Coloraciones y Estructuras', 'combinatoria-avanzada-coloraciones-y-estructuras', 'combinatorics', 'avanzado'),
      curriculumPath('Teoría de Números: Problemas de Integración', 'teoria-de-numeros-problemas-de-integracion', 'number-theory', 'avanzado'),
      curriculumPath('Desigualdades Avanzadas', 'desigualdades-avanzadas', 'algebra', 'avanzado'),
      curriculumPath('Transformaciones y Configuraciones Geométricas Avanzadas', 'transformaciones-y-configuraciones-geometricas-avanzadas', 'geometry', 'avanzado'),
      curriculumPath('Estrategias de Ataque de Problemas', 'estrategias-de-ataque-de-problemas', 'strategy', 'avanzado'),
      curriculumPath('Redacción y Pulido de Soluciones', 'redaccion-y-pulido-de-soluciones', 'proof', 'avanzado'),
      curriculumPath('Problemas de Síntesis', 'problemas-de-sintesis', 'mixed', 'avanzado'),
      mixedPath(5, 'avanzado', {
        recognize: 'Evalúa estructura, dificultad y costo de distintos enfoques antes de elegir.',
        solve: 'Trabaja problemas difíciles y redacta demostraciones completas con ritmo de concurso.',
        mix: 'Sintetiza herramientas de todo el recorrido y experimenta estratégicamente.',
        reflect: 'Practica abandonar enfoques improductivos y pulir la solución final.',
      }),
    ],
  },
]

const postCyclePaths = [
  curriculumPath('Simulacros OMM', 'simulacros-omm', 'simulation', 'avanzado', {
    description: 'Transición posterior al recorrido principal hacia simulaciones completas con condiciones cercanas a concurso.',
    editorialGap: 'Título y estructura interna son provisionales; deben revisarse contra los Exámenes existentes antes de añadir contenido.',
  }),
  curriculumPath('Consejos para Competir', 'consejos-para-competir', 'orientation', 'avanzado', {
    description: 'Consejos para la etapa de competencia, distintos de la orientación previa al entrenamiento estructurado.',
    editorialGap: 'Título y contenido siguen siendo provisionales y requieren revisión editorial.',
  }),
]

const orderedEntries = [
  ...preCyclePaths.map((path) => ({ placement: 'pre', sectionKey: null, path })),
  ...OMM_SECTIONS.flatMap((section) => section.paths.map((path) => ({
    placement: 'cycle',
    sectionKey: section.key,
    path,
  }))),
  ...postCyclePaths.map((path) => ({ placement: 'post', sectionKey: null, path })),
].map((entry, index) => ({ ...entry, order: index + 1 }))

export const OMM_CURRICULUM = Object.freeze({
  root: Object.freeze(curriculumPath(
    'Preparación para la OMM',
    'preparacion-para-la-omm',
    'curriculum',
    'omm',
    {
      description: 'Recorrido cronológico recomendado para construir fundamentos, ampliar herramientas y desarrollar estrategia olímpica.',
      editorialGap: 'El recorrido permanece en borrador hasta que sus Paths tengan contenido aprobado y se revise la secuencia completa.',
    },
  )),
  sections: Object.freeze(OMM_SECTIONS),
  entries: Object.freeze(orderedEntries),
})

export function validateOmmCurriculumDefinition(curriculum = OMM_CURRICULUM) {
  const errors = []
  const expectedSectionTitles = [
    'Ciclo 1 — Primeros Pasos',
    'Ciclo 2 — Herramientas Fundamentales',
    'Ciclo 3 — Construyendo Técnica',
    'Ciclo 4 — Ampliando Herramientas',
    'Ciclo 5 — Integración y Estrategia',
  ]
  const sectionKeys = new Set(curriculum.sections.map(({ key }) => key))
  const slugs = curriculum.entries.map(({ path }) => path.slug)
  const titles = curriculum.entries.map(({ path }) => path.title)

  if (curriculum.root.slug !== 'preparacion-para-la-omm') errors.push('The root Path slug is incorrect.')
  if (curriculum.root.steps.length) errors.push('The root Path cannot own Steps.')
  if (curriculum.sections.length !== 5) errors.push('The curriculum must contain five PathSections.')
  if (sectionKeys.size !== curriculum.sections.length) errors.push('PathSection keys must be unique.')
  if (curriculum.sections.map(({ title }) => title).join('|') !== expectedSectionTitles.join('|')) {
    errors.push('The five PathSection titles or their order are incorrect.')
  }
  if (new Set(slugs).size !== slugs.length) errors.push('Child Path slugs must be unique.')
  if (new Set(titles).size !== titles.length) errors.push('Child Path titles must be unique.')
  if (slugs.includes(curriculum.root.slug)) errors.push('The root Path cannot reference itself.')

  curriculum.entries.forEach((entry, index) => {
    if (entry.order !== index + 1) errors.push(`PathReference order is not contiguous at ${entry.path.slug}.`)
    if (entry.sectionKey && !sectionKeys.has(entry.sectionKey)) errors.push(`Unknown PathSection ${entry.sectionKey}.`)
    if (entry.placement === 'cycle' && !entry.sectionKey) errors.push(`Cycle entry ${entry.path.slug} needs a PathSection.`)
    if (entry.placement !== 'cycle' && entry.sectionKey) errors.push(`Unsectioned entry ${entry.path.slug} has a PathSection.`)
    if (entry.path.publicationStatus !== DRAFT) errors.push(`Provisional Path ${entry.path.slug} must default to draft.`)
    if (/ciclo-[1-5]/.test(entry.path.slug) && !entry.path.slug.startsWith('entrenamiento-mixto-ciclo-')) {
      errors.push(`Reusable topic Path ${entry.path.slug} contains cycle-specific naming.`)
    }
  })

  curriculum.sections.forEach((section, index) => {
    const entries = curriculum.entries.filter(({ sectionKey }) => sectionKey === section.key)
    const expectedMixedSlug = `entrenamiento-mixto-ciclo-${index + 1}`
    if (entries.at(-1)?.path.slug !== expectedMixedSlug) errors.push(`${section.title} must end with ${expectedMixedSlug}.`)
    const areas = new Set(entries.map(({ path }) => path.area))
    for (const requiredArea of ['geometry', 'algebra', 'number-theory', 'combinatorics']) {
      if (!areas.has(requiredArea)) errors.push(`${section.title} is missing ${requiredArea}.`)
    }
    const mixed = entries.at(-1)?.path
    if (!mixed?.steps.length) errors.push(`${expectedMixedSlug} must be a leaf definition with Steps.`)
    const stepOrders = mixed?.steps.map(({ order }) => order) || []
    if (new Set(stepOrders).size !== stepOrders.length || stepOrders.some((order, stepIndex) => order !== stepIndex + 1)) {
      errors.push(`${expectedMixedSlug} Step order must be unique and contiguous.`)
    }
  })

  const firstCycleIndex = curriculum.entries.findIndex(({ placement }) => placement === 'cycle')
  const firstPostIndex = curriculum.entries.findIndex(({ placement }) => placement === 'post')
  if (firstCycleIndex !== preCyclePaths.length) errors.push('Pre-cycle Paths must appear before Ciclo 1.')
  if (firstPostIndex === -1) {
    errors.push('Post-cycle Paths are missing.')
  } else if (curriculum.entries.slice(firstPostIndex).some(({ placement }) => placement !== 'post')) {
    errors.push('Post-cycle Paths must appear after Ciclo 5.')
  }

  if (errors.length) throw new Error(`Invalid OMM curriculum definition:\n- ${errors.join('\n- ')}`)
  return true
}

export function ommCurriculumTree(curriculum = OMM_CURRICULUM) {
  const lines = [curriculum.root.title]
  const pre = curriculum.entries.filter(({ placement }) => placement === 'pre')
  const post = curriculum.entries.filter(({ placement }) => placement === 'post')
  pre.forEach(({ path }) => lines.push(`├── ${path.title}`))
  lines.push('│')
  curriculum.sections.forEach((section) => {
    lines.push(`[PathSection] ${section.title}`)
    const paths = curriculum.entries.filter(({ sectionKey }) => sectionKey === section.key)
    paths.forEach(({ path }, index) => lines.push(`${index === paths.length - 1 ? '└──' : '├──'} ${path.title}`))
    lines.push('│')
  })
  post.forEach(({ path }, index) => lines.push(`${index === post.length - 1 ? '└──' : '├──'} ${path.title}`))
  return lines.join('\n')
}

export function ommCurriculumTable(curriculum = OMM_CURRICULUM) {
  const sectionByKey = new Map(curriculum.sections.map((section) => [section.key, section.title]))
  const rows = [
    '| Orden | Path | Slug | PathSection | Nivel | Estado nuevo | Origen | Steps | Referencias | Supuesto / brecha editorial |',
    '| ---: | --- | --- | --- | --- | --- | --- | ---: | --- | --- |',
  ]
  curriculum.entries.forEach((entry) => {
    const path = entry.path
    rows.push(`| ${entry.order} | ${path.title} | \`${path.slug}\` | ${sectionByKey.get(entry.sectionKey) || '—'} | ${path.level} | ${path.publicationStatus} | Nueva definición; reutilizar coincidencia exacta | ${path.steps.length} | 0 | ${path.editorialGap} |`)
  })
  return rows.join('\n')
}
