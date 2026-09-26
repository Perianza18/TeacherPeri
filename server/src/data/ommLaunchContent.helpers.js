const DRAFT = 'draft'

export function theoryArticle({ introduction, ideas, example, mistakes, practice, summary }) {
  return `${introduction}

IDEAS CLAVE
${ideas}

EJEMPLO TRABAJADO
${example}

ERRORES FRECUENTES
${mistakes}

PRACTICA
${practice}

EN RESUMEN
${summary}`
}

export function defineLesson({ pathSlug, area, title, summary, level = 'basico', article, steps }) {
  const theoryKey = `${pathSlug}-guia`
  return {
    pathSlug,
    area,
    theory: {
      key: theoryKey,
      title,
      summary,
      level,
      publicationStatus: DRAFT,
      content: theoryArticle(article),
    },
    steps: steps.map((step, index) => ({
      order: index + 1,
      title: step.title,
      description: step.description,
      theoryKeys: step.theory === false ? [] : [theoryKey],
      problemCodes: step.problemCodes || [],
    })),
  }
}
