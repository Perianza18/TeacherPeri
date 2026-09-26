import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import RelatedPath from '../models/RelatedPath.js'
import PathSection from '../models/PathSection.js'
import Step from '../models/Step.js'
import PathCompletion from '../models/PathCompletion.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import List from '../models/List.js'
import Exam from '../models/Exam.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { textSearch } from './library.utils.js'

const CONTENT_MODELS = { Problem, Theory, List, Exam }

function displayTitle(contentType, item) {
  if (contentType === 'Problem') return item.titulo || item.codigo
  if (contentType === 'Exam') return [item.competition, item.year, item.round].filter(Boolean).join(' · ')
  return item.title
}

function contentLink(contentType, id) {
  const library = { Problem: 'problemas', Theory: 'teoria', List: 'listas', Exam: 'examenes' }[contentType]
  return `/entrenamiento/${library}/${id}`
}

export async function pathStructure(pathIds) {
  const ids = pathIds.filter(Boolean)
  if (!ids.length) return new Map()
  const [children, steps] = await Promise.all([
    PathReference.aggregate([
      { $match: { parentPath: { $in: ids } } },
      { $group: { _id: '$parentPath', count: { $sum: 1 } } },
    ]),
    Step.aggregate([
      { $match: { path: { $in: ids } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
    ]),
  ])
  const result = new Map(ids.map((id) => [id.toString(), { childCount: 0, stepCount: 0 }]))
  children.forEach(({ _id, count }) => { result.get(_id.toString()).childCount = count })
  steps.forEach(({ _id, count }) => { result.get(_id.toString()).stepCount = count })
  return result
}

export function structureKind(structure) {
  if (structure.childCount && !structure.stepCount) return 'parent'
  if (structure.stepCount && !structure.childCount) return 'leaf'
  return 'invalid'
}

export async function publishedPath(pathOrSlug) {
  const filter = typeof pathOrSlug === 'string' ? { slug: pathOrSlug } : { _id: pathOrSlug }
  const path = await Path.findOne({ ...filter, publicationStatus: 'published' }).populate('tags', 'name slug label').lean()
  if (!path) return null
  const structure = await pathStructure([path._id])
  const kind = structureKind(structure.get(path._id.toString()))
  return kind === 'invalid' ? null : { ...path, kind }
}

async function publicContentReference(reference) {
  const Model = CONTENT_MODELS[reference.contentType]
  if (!Model) return { contentType: reference.contentType, targetId: reference.target, available: false }
  const filter = reference.contentType === 'Problem'
    ? { _id: reference.target, ...publishedOrLegacyProblemQuery() }
    : { _id: reference.target, publicationStatus: 'published' }
  const item = await Model.findOne(filter).lean()
  if (!item) return { contentType: reference.contentType, targetId: reference.target, available: false }
  return {
    contentType: reference.contentType,
    targetId: reference.target,
    available: true,
    title: displayTitle(reference.contentType, item),
    href: contentLink(reference.contentType, item._id),
  }
}

const RELATED_PATH_LABELS = {
  prerequisite: 'Repasa primero',
  deeper: 'Profundiza',
  related: 'También te puede interesar',
}

async function publicRelatedPath(reference, kinds) {
  const target = await Path.findOne({ _id: reference.targetPath, publicationStatus: 'published' }).lean()
  const kind = target && kinds.get(target._id.toString())
    ? structureKind(kinds.get(target._id.toString()))
    : 'invalid'
  if (!target || kind === 'invalid') {
    return {
      targetPath: reference.targetPath,
      relationshipType: reference.relationshipType,
      label: RELATED_PATH_LABELS[reference.relationshipType],
      available: false,
    }
  }
  return {
    targetPath: target._id,
    slug: target.slug,
    title: target.title,
    description: target.description,
    level: target.level,
    kind,
    relationshipType: reference.relationshipType,
    label: RELATED_PATH_LABELS[reference.relationshipType],
    available: true,
  }
}

async function publicChildReference(reference, kinds) {
  const child = await Path.findOne({ _id: reference.childPath, publicationStatus: 'published' }).lean()
  const kind = child && kinds.get(child._id.toString())
    ? structureKind(kinds.get(child._id.toString()))
    : 'invalid'
  if (!child || kind === 'invalid') {
    const unavailable = { childPath: reference.childPath, order: reference.order, section: reference.section, available: false }
    if (!reference.previewWhenUnavailable) return unavailable
    const preview = await Path.findById(reference.childPath).select('title').lean()
    return preview
      ? { ...unavailable, title: preview.title, plannedPreview: true, state: 'coming-soon' }
      : unavailable
  }
  return {
    childPath: child._id,
    slug: child.slug,
    title: child.title,
    description: child.description,
    order: reference.order,
    section: reference.section,
    kind,
    available: true,
  }
}

export async function publicPathDetail(path) {
  const [references, steps, relatedReferences, sections] = await Promise.all([
    PathReference.find({ parentPath: path._id }).sort({ order: 1 }).lean(),
    Step.find({ path: path._id }).sort({ order: 1 }).lean(),
    RelatedPath.find({ sourcePath: path._id }).sort({ relationshipType: 1 }).lean(),
    PathSection.find({ path: path._id }).lean(),
  ])

  const relatedTargets = await Path.find({ _id: { $in: relatedReferences.map((reference) => reference.targetPath) } }).select('_id').lean()
  const children = path.kind === 'parent'
    ? await Path.find({ _id: { $in: references.map((reference) => reference.childPath) } }).select('_id').lean()
    : []
  const structures = await pathStructure([...children, ...relatedTargets].map((child) => child._id))
  const relatedPaths = await Promise.all(relatedReferences.map((reference) => publicRelatedPath(reference, structures)))

  if (path.kind === 'parent') {
    const sectionById = new Map(sections.map((section) => [section._id.toString(), section]))
    const childPaths = (await Promise.all(references.map((reference) => publicChildReference(reference, structures))))
      .map((child) => child.section && !sectionById.has(child.section.toString()) ? { ...child, section: null } : child)
    const childrenBySection = new Map()
    childPaths.forEach((child) => {
      if (!child.section) return
      const key = child.section.toString()
      if (!childrenBySection.has(key)) childrenBySection.set(key, [])
      childrenBySection.get(key).push(child)
    })
    let previousSectionId = null
    const presentation = childPaths.flatMap((child) => {
      const section = child.section ? sectionById.get(child.section.toString()) : null
      const sectionId = section?._id.toString() || null
      const heading = section && sectionId !== previousSectionId
        ? [{
            type: 'section',
            section: {
              _id: section._id,
              title: section.title,
              ...(childrenBySection.get(sectionId)?.every((item) => item.plannedPreview)
                ? { state: 'under-construction' }
                : {}),
            },
          }]
        : []
      previousSectionId = sectionId
      return [...heading, { type: 'child', child }]
    })
    return {
      ...path,
      childPaths,
      presentation,
      steps: [],
      relatedPaths,
    }
  }

  return {
    ...path,
    childPaths: [],
    presentation: [],
    relatedPaths,
    steps: await Promise.all(steps.map(async (step) => ({
      ...step,
      teacherperiReferences: await Promise.all(step.teacherperiReferences.map(publicContentReference)),
    }))),
  }
}

export async function publishedPathDiscovery(query, tags = []) {
  const filter = { publicationStatus: 'published' }
  if (tags.length) filter.tags = { $in: tags }
  if (query) {
    const search = textSearch(query)
    filter.$or = [{ title: search }, { description: search }]
  }
  const paths = await Path.find(filter).populate('tags', 'name slug label').sort({ title: 1 }).lean()
  const structures = await pathStructure(paths.map((path) => path._id))
  return paths
    .map((path) => ({ ...path, kind: structureKind(structures.get(path._id.toString())) }))
    .filter((path) => path.kind !== 'invalid')
}

export async function validTraversal(slugs) {
  if (!Array.isArray(slugs) || !slugs.length || slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) return null
  const paths = await Promise.all(slugs.map(publishedPath))
  if (paths.some((path) => !path)) return null

  for (let index = 1; index < paths.length; index += 1) {
    const edge = await PathReference.exists({ parentPath: paths[index - 1]._id, childPath: paths[index]._id })
    if (!edge) return null
  }

  return paths
}

export async function descendantLeafIds(rootPath) {
  const leaves = new Set()
  const visited = new Set()
  let frontier = [rootPath._id]

  while (frontier.length) {
    const ids = frontier.filter((id) => {
      const key = id.toString()
      if (visited.has(key)) return false
      visited.add(key)
      return true
    })
    if (!ids.length) break

    const [paths, references, steps] = await Promise.all([
      Path.find({ _id: { $in: ids }, publicationStatus: 'published' }).select('_id').lean(),
      PathReference.find({ parentPath: { $in: ids } }).select('parentPath childPath').lean(),
      Step.find({ path: { $in: ids } }).select('path').lean(),
    ])
    const publicIds = new Set(paths.map((path) => path._id.toString()))
    const childParents = new Set(references.map((reference) => reference.parentPath.toString()))
    const stepPaths = new Set(steps.map((step) => step.path.toString()))
    paths.forEach((path) => {
      const key = path._id.toString()
      if (!childParents.has(key) && stepPaths.has(key)) leaves.add(key)
    })
    frontier = references
      .filter((reference) => publicIds.has(reference.parentPath.toString()))
      .map((reference) => reference.childPath)
  }

  return leaves
}

export async function progressForUser(path, userId) {
  const leafIds = await descendantLeafIds(path)
  if (!leafIds.size) return { totalLeaves: 0, completedLeaves: 0, percentage: 0 }
  const completedLeaves = await PathCompletion.countDocuments({
    user: userId,
    path: { $in: [...leafIds] },
  })
  return {
    totalLeaves: leafIds.size,
    completedLeaves,
    percentage: Math.round((completedLeaves / leafIds.size) * 100),
  }
}
