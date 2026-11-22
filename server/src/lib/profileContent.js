// Names and links of problems and lessons as Mi Espacio shows them. Only
// public content gets a name; anything else is left out of the result.
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { folderPath } from './examFolders.js'

export const problemHref = (id) => `/entrenamiento/problemas/${id}`
export const theoryHref = (id) => `/entrenamiento/teoria/${id}`

// «OMM Estatal › Jalisco › 2023, problema 4» for an exam problem, otherwise
// its title (or code).
export function problemLabel(problem, foldersById) {
  const examFolder = (problem.categories || []).map(String).find((id) => foldersById.get(id)?.kind === 'exam')
  if (examFolder) {
    const path = folderPath(examFolder, foldersById).slice(1)
    if (path.length) return `${path.join(' › ')}${problem.problemNumber ? `, problema ${problem.problemNumber}` : ''}`
  }
  return problem.titulo || problem.codigo
}

let folderCache = null
async function examFolders() {
  // A short cache: folders change rarely and one profile view may ask several times.
  if (folderCache && folderCache.at > Date.now() - 10_000) return folderCache.byId
  const folders = await Category.find({ kind: 'exam' }).select('name parent kind').lean()
  folderCache = { at: Date.now(), byId: new Map(folders.map((f) => [String(f._id), f])) }
  return folderCache.byId
}

// { problems: Map(id → {label, href, enunciado}), theory: Map(id → {label, href, summary}) }
export async function contentNames({ problemIds = [], theoryIds = [], includeUnpublishedProblems = false } = {}) {
  const problemFilter = includeUnpublishedProblems ? { _id: { $in: problemIds }, deletedAt: null } : { _id: { $in: problemIds }, ...publishedOrLegacyProblemQuery() }
  const [problems, lessons, foldersById] = await Promise.all([
    problemIds.length ? Problem.find(problemFilter).select('codigo titulo enunciado categories problemNumber').lean() : [],
    theoryIds.length ? Theory.find({ _id: { $in: theoryIds }, publicationStatus: 'published' }).select('title summary').lean() : [],
    examFolders(),
  ])
  return {
    problems: new Map(problems.map((p) => [String(p._id), { label: problemLabel(p, foldersById), href: problemHref(p._id), enunciado: p.enunciado, codigo: p.codigo }])),
    theory: new Map(lessons.map((t) => [String(t._id), { label: t.title, href: theoryHref(t._id), summary: t.summary }])),
  }
}

export async function publicItemExists(itemType, id) {
  if (itemType === 'problem') return Problem.exists({ _id: id, ...publishedOrLegacyProblemQuery() })
  if (itemType === 'theory') return Theory.exists({ _id: id, publicationStatus: 'published' })
  return false
}
