// Lessons rewritten in the lesson format of the theory page (spec «Página de
// teoría», Part 2). Each file holds the new summary and text of one lesson,
// the new banco problems it introduces and the problem collections its boxes
// point to. mvpLessons.js applies them as the last layer.
const LESSONS = []

export const THEORY_REWRITES = Object.freeze(Object.fromEntries(LESSONS.map((lesson) => [lesson.pathSlug, lesson])))

export const THEORY_PROBLEMS = LESSONS.flatMap((lesson) => lesson.problems)

export const THEORY_COLLECTIONS = LESSONS.flatMap((lesson) => Object.entries(lesson.collections)
  .flatMap(([slug, kinds]) => Object.entries(kinds).map(([kind, problemCodes]) => ({ slug, kind, problemCodes }))))
