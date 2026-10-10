import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Topic from '../models/Topic.js'
import Tag from '../models/Tag.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import List from '../models/List.js'
import Exam from '../models/Exam.js'
import Path from '../models/Path.js'
import PathSection from '../models/PathSection.js'
import PathReference from '../models/PathReference.js'
import Step from '../models/Step.js'
import { buildMvpManifest, contentId } from '../data/mvpManifest.js'
import { OMM_CURRICULUM } from '../data/ommCurriculum.js'
import { OMM_LAUNCH_CONTENT_BATCH_1 } from '../data/ommLaunchContent.js'

export const CONTENT_MODELS = { Category, Topic, Tag, Problem, Theory, List, Exam, Path, PathSection, PathReference, Step }
mongoose.set('transactionAsyncLocalStorage', true)

function normalized(value) {
  if (value instanceof mongoose.Types.ObjectId) return String(value)
  if (Array.isArray(value)) return value.map(normalized)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key)).map(([key, value]) => [key, normalized(value)]))
  return value
}
function matches(existing, expected, keys = Object.keys(expected)) {
  return keys.every((key) => JSON.stringify(normalized(existing[key])) === JSON.stringify(normalized(expected[key])))
}
function originalDraft(entry, existing) {
  // Only the exact checked-in draft can be promoted. Independent edits conflict.
  if (existing.publicationStatus !== 'draft') return false
  if (entry.model === 'Path') {
    const original = OMM_CURRICULUM.paths.find((p) => p.slug === entry.key)
    return original && matches(existing, { slug: original.slug, title: original.title, level: original.level, description: original.description, tags: [], publicationStatus: 'draft' })
  }
  if (entry.model === 'Theory') {
    const original = OMM_LAUNCH_CONTENT_BATCH_1.lessons.find((l) => l.theory.key === entry.key)?.theory
    if (!original) return false
    const fields = { ...original }; delete fields.key
    return matches(existing, { ...fields, topics: [], tags: [], categories: [] })
  }
  return false
}

export async function planMvpImport() {
  const ids = new Map()
  const resolve = (model, key) => ids.get(`${model}:${key}`) || contentId(model, key)
  const plan = []
  // Resolve existing natural identities before constructing dependent references.
  for (const initial of buildMvpManifest()) {
    const entry = buildMvpManifest(resolve).find((e) => e.model === initial.model && e.key === initial.key)
    const Model = CONTENT_MODELS[entry.model]
    const found = await Model.find({ $or: [{ _id: entry._id }, entry.identity] }).lean()
    if (found.length > 1) throw new Error(`Ambiguous identity: ${entry.model}/${entry.key}`)
    const existing = found[0]
    if (existing && !matches(existing, entry.identity)) throw new Error(`Identity collision: ${entry.model}/${entry.key}`)
    if (existing) ids.set(`${entry.model}:${entry.key}`, String(existing._id))
    const fields = new Model(entry.data).toObject()
    const keys = Object.keys(entry.data)
    if (existing && !matches(existing, fields, keys) && !originalDraft(entry, existing)) throw new Error(`Content conflict: ${entry.model}/${entry.key}. Existing content was not modified.`)
    plan.push({ ...entry, _id: existing?._id || entry._id, fields: entry.data, action: !existing ? 'create' : matches(existing, fields, keys) ? 'keep' : 'promote', existing })
  }
  // Reject incompatible independently added structure before any writes.
  for (const row of plan.filter((r) => r.model === 'Path')) {
    const expectedChildren = plan.filter((r) => r.model === 'PathReference' && String(r.fields.parentPath) === String(row._id))
    const expectedSteps = plan.filter((r) => r.model === 'Step' && String(r.fields.path) === String(row._id))
    const [edges, steps, sections] = await Promise.all([PathReference.find({ parentPath: row._id }).lean(), Step.find({ path: row._id }).lean(), PathSection.find({ path: row._id }).lean()])
    if (expectedSteps.length && (edges.length || sections.length) || expectedChildren.length && steps.length) throw new Error(`Structure conflict: ${row.key}`)
    if (edges.some((edge) => !expectedChildren.some((r) => String(r._id) === String(edge._id))) || steps.some((step) => !expectedSteps.some((r) => String(r._id) === String(step._id)))) throw new Error(`Unmanaged structure: ${row.key}`)
  }
  return plan
}

export async function importMvpContent({ apply = false } = {}) {
  const summary = (plan) => ({ create: plan.filter((r) => r.action === 'create').length, promote: plan.filter((r) => r.action === 'promote').length, keep: plan.filter((r) => r.action === 'keep').length })
  if (!apply) return summary(await planMvpImport())
  const hello = await mongoose.connection.db.admin().command({ hello: 1 })
  if (!hello.setName && hello.msg !== 'isdbgrid') throw new Error('Atomic content import requires a replica set (MongoDB Atlas supports this). No content was written.')
  for (const Model of Object.values(CONTENT_MODELS)) { await Model.createCollection(); await Model.createIndexes() }
  return mongoose.connection.transaction(async () => {
    const plan = await planMvpImport()
    for (const row of plan) {
      if (row.action === 'keep') continue
      const Model = CONTENT_MODELS[row.model]
      if (row.action === 'create') await new Model({ _id: row._id, ...row.fields }).save()
      else {
        const doc = await Model.findById(row._id)
        doc.set(row.fields)
        await doc.save()
      }
    }
    return summary(plan)
  })
}
