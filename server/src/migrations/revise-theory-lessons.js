import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Topic from '../models/Topic.js'
import Tag from '../models/Tag.js'
import Problem from '../models/Problem.js'
import ProblemCollection from '../models/ProblemCollection.js'
import Theory from '../models/Theory.js'
import Path from '../models/Path.js'
import { buildMvpManifest, contentId } from '../data/mvpManifest.js'
import { PREVIOUS_THEORY } from '../data/mvpLessons.js'
import { THEORY_REWRITES } from '../data/theory/index.js'
import { EARLIER_THEORY } from '../data/theory/earlier.js'
import { matches } from './import-mvp-content.js'

// Publishes the rewritten lessons (data/theory) to a database that already
// holds the imported content. It changes only what the rewrite touches:
//   - Theory summary and text, and the lesson Path's description;
//   - adds the new banco problems and the lesson problem collections.
// Compare-and-set: a lesson changes only if it still holds the exact previous
// text, or an earlier published rewrite listed in data/theory/earlier.js (or
// already holds the new one). Anything else stops the whole run.
// Idempotent: a second run finds everything up to date and writes nothing.

mongoose.set('transactionAsyncLocalStorage', true)

const MODELS = { Category, Topic, Tag, Problem, ProblemCollection, Theory, Path }
// Only lessons that replace an earlier text are revised here. Lessons that
// are new in the release (no PREVIOUS_THEORY) reach a database through the
// additive content import, together with their problems and boxes.
const REVISED = Object.values(THEORY_REWRITES).filter((lesson) => PREVIOUS_THEORY[lesson.pathSlug])
const REWRITTEN = new Set(REVISED.map((lesson) => lesson.pathSlug))
const NEW_CODES = new Set(REVISED.flatMap((lesson) => lesson.problems.map((problem) => problem.codigo)))
const BOXES = REVISED.flatMap((lesson) => Object.entries(lesson.collections).flatMap(([slug, kinds]) => Object.entries(kinds).map(([kind, problemCodes]) => ({ slug, kind, problemCodes }))))
const BOX_CODES = new Set(BOXES.flatMap((collection) => collection.problemCodes))
const BOX_KEYS = new Set(BOXES.map(({ slug, kind }) => `${slug}:${kind}`))

function needed(entry) {
  if (['Category', 'Topic', 'Tag'].includes(entry.model)) return true
  if (entry.model === 'Problem') return BOX_CODES.has(entry.key) || NEW_CODES.has(entry.key)
  if (entry.model === 'ProblemCollection') return BOX_KEYS.has(entry.key)
  if (entry.model === 'Theory') return REWRITTEN.has(entry.key.replace(/-guia$/, ''))
  if (entry.model === 'Path') return REWRITTEN.has(entry.key)
  return false
}

const holds = (current, pairs) => pairs.every(([field, value]) => current[field] === value)

// The first accepted previous version the record holds exactly, or null.
export function heldPrevious(current, ...previousVersions) {
  return previousVersions.find((pairs) => holds(current, pairs)) ?? null
}

// keep: already up to date · revise: holds one accepted previous version exactly · null: neither.
export function decide(current, desired, ...previousVersions) {
  if (holds(current, desired)) return 'keep'
  if (heldPrevious(current, ...previousVersions)) return 'revise'
  return null
}

function conflict(message) {
  const error = new Error(message)
  error.code = 'THEORY_REVISION_CONFLICT'
  return error
}

// Same identity rules as the content importer: existing records keep their ids.
export async function planTheoryRevision() {
  const ids = new Map()
  const resolve = (model, key) => ids.get(`${model}:${key}`) || contentId(model, key)
  const rows = []
  for (const initial of buildMvpManifest().filter(needed)) {
    const entry = buildMvpManifest(resolve).find((e) => e.model === initial.model && e.key === initial.key)
    const Model = MODELS[entry.model]
    const found = await Model.find({ $or: [{ _id: entry._id }, entry.identity] }).lean()
    if (found.length > 1) throw conflict(`Ambiguous identity: ${entry.model}/${entry.key}.`)
    const existing = found[0]
    if (existing && !matches(existing, entry.identity)) throw conflict(`Identity collision: ${entry.model}/${entry.key}.`)
    if (existing) ids.set(`${entry.model}:${entry.key}`, String(existing._id))
    const isNew = entry.model === 'ProblemCollection' || (entry.model === 'Problem' && NEW_CODES.has(entry.key))
    if (!existing && !isNew) throw conflict(`Missing ${entry.model}/${entry.key}: import the base content first.`)

    if (entry.model === 'Theory' || entry.model === 'Path') {
      const slug = entry.model === 'Theory' ? entry.key.replace(/-guia$/, '') : entry.key
      const versions = [PREVIOUS_THEORY[slug], ...(EARLIER_THEORY[slug] ?? [])]
      const desired = entry.model === 'Theory'
        ? [['summary', entry.data.summary], ['content', entry.data.content]]
        : [['description', entry.data.description]]
      const accepted = versions.map((version) => (entry.model === 'Theory'
        ? [['summary', version.summary], ['content', version.content]]
        : [['description', version.summary]]))
      const action = decide(existing, desired, ...accepted)
      if (!action) throw conflict(`${entry.model}/${entry.key} holds text that is neither a previous nor the new version.`)
      const filter = Object.fromEntries(heldPrevious(existing, ...accepted) ?? accepted[0])
      rows.push({ model: entry.model, key: entry.key, _id: existing._id, title: existing.title, action, filter, set: Object.fromEntries(desired) })
    } else if (isNew) {
      const fields = new Model(entry.data).toObject()
      const action = !existing ? 'create' : matches(existing, fields, Object.keys(entry.data)) ? 'keep' : null
      if (!action) throw conflict(`${entry.model}/${entry.key} already exists with different content.`)
      rows.push({ model: entry.model, key: entry.key, _id: existing?._id || entry._id, action, data: entry.data })
    }
  }
  return rows
}

export function summarize(rows) {
  const by = (model, action) => rows.filter((row) => row.model === model && (!action || row.action === action))
  return {
    lessons: by('Theory').map((row) => ({ title: row.title, text: row.action, ruta: by('Path').find((path) => `${path.key}-guia` === row.key)?.action })),
    problemsAdded: by('Problem', 'create').map((row) => row.key),
    problemsAlreadyThere: by('Problem', 'keep').map((row) => row.key),
    collectionsCreated: by('ProblemCollection', 'create').map((row) => `${row.key} (${row.data.problems.length})`),
    collectionsAlreadyThere: by('ProblemCollection', 'keep').map((row) => row.key),
  }
}

export async function reviseTheoryLessons({ apply = false } = {}) {
  if (!apply) return summarize(await planTheoryRevision())
  const hello = await mongoose.connection.db.admin().command({ hello: 1 })
  if (!hello.setName && hello.msg !== 'isdbgrid') {
    const error = new Error('The revision requires a replica set (MongoDB Atlas supports this). Nothing was written.')
    error.code = 'CONTENT_REPLICA_SET_REQUIRED'
    throw error
  }
  const preview = await planTheoryRevision()
  if (preview.every((row) => row.action === 'keep')) return summarize(preview)
  // The unique slug + kind index must exist before collections are written.
  await ProblemCollection.createCollection()
  await ProblemCollection.createIndexes()
  return mongoose.connection.transaction(async () => {
    const rows = await planTheoryRevision()
    const order = ['Problem', 'ProblemCollection', 'Theory', 'Path']
    for (const row of [...rows].sort((a, b) => order.indexOf(a.model) - order.indexOf(b.model))) {
      const Model = MODELS[row.model]
      if (row.action === 'create') await new Model({ _id: row._id, ...row.data }).save()
      if (row.action === 'revise') {
        const result = await Model.updateOne({ _id: row._id, ...row.filter }, { $set: row.set }, { runValidators: true })
        if (result.modifiedCount !== 1) throw conflict(`${row.model}/${row.key} changed during the revision; nothing was written.`)
      }
    }
    return summarize(rows)
  })
}
