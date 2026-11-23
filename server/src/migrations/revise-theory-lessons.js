import mongoose from 'mongoose'
import { createHash } from 'node:crypto'
import Category from '../models/Category.js'
import Topic from '../models/Topic.js'
import Tag from '../models/Tag.js'
import Problem from '../models/Problem.js'
import ProblemCollection from '../models/ProblemCollection.js'
import Theory from '../models/Theory.js'
import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import Step from '../models/Step.js'
import { buildMvpManifest, contentId } from '../data/mvpManifest.js'
import { NEW_THEORY_SLUGS, PREVIOUS_THEORY } from '../data/mvpLessons.js'
import { OMM_CURRICULUM } from '../data/ommCurriculum.js'
import { THEORY_REWRITES } from '../data/theory/index.js'
import { EARLIER_THEORY } from '../data/theory/earlier.js'
import { matches } from './import-mvp-content.js'

// Publishes the theory lessons of data/theory to a database that already
// holds the imported content, one lesson at a time.
//
// Rewritten lessons (they have a PREVIOUS_THEORY): the Theory summary and
// text and the Path description change only if the record still holds the
// exact previous text, or an earlier published rewrite (data/theory/earlier.js).
// New lessons (NEW_THEORY_SLUGS, no earlier text): the Theory and its Steps
// are created, and the lesson's Path and the groups above it go from the
// checked-in draft to published.
//
// Other people edit lessons on the live site. A lesson whose live records
// hold anything else is never overwritten: it is reported with a fingerprint
// of what it holds and a summary of the differences, and skipped. It is
// changed only if the caller accepts that exact live version with
// `acceptLive: { slug: fingerprint }`, after reviewing the report. The other
// lessons go ahead. Problems and boxes are only ever added; a problem edited
// on the live site is left as it is.
// Idempotent: a second run finds everything up to date and writes nothing.

mongoose.set('transactionAsyncLocalStorage', true)

const MODELS = { Category, Topic, Tag, Problem, ProblemCollection, Theory, Path, Step }
const LESSONS = Object.values(THEORY_REWRITES)
const NEW = new Set(NEW_THEORY_SLUGS)
const REVISED = new Set(LESSONS.filter((lesson) => PREVIOUS_THEORY[lesson.pathSlug]).map((lesson) => lesson.pathSlug))

// Which lessons own or point to each problem and box, so a skipped lesson
// does not leave half of its content behind, while a problem that another
// lesson's box needs is still added.
const PROBLEM_LESSONS = new Map()
const BOX_LESSON = new Map()
for (const lesson of LESSONS) {
  for (const problem of lesson.problems) PROBLEM_LESSONS.set(problem.codigo, new Set([...(PROBLEM_LESSONS.get(problem.codigo) || []), lesson.pathSlug]))
  for (const [slug, kinds] of Object.entries(lesson.collections)) {
    for (const [kind, codes] of Object.entries(kinds)) {
      BOX_LESSON.set(`${slug}:${kind}`, lesson.pathSlug)
      for (const code of codes) PROBLEM_LESSONS.set(code, new Set([...(PROBLEM_LESSONS.get(code) || []), lesson.pathSlug]))
    }
  }
}
const NEW_CODES = new Set(LESSONS.flatMap((lesson) => lesson.problems.map((problem) => problem.codigo)))

// The groups above a new lesson that the release publishes with it.
const PARENTS = new Map(OMM_CURRICULUM.references.map((reference) => [reference.childSlug, reference.parentSlug]))
const ancestors = (slug) => { const list = []; for (let parent = PARENTS.get(slug); parent; parent = PARENTS.get(parent)) list.push(parent); return list }
const GROUP_LESSONS = new Map()
for (const slug of NEW) for (const group of ancestors(slug)) GROUP_LESSONS.set(group, new Set([...(GROUP_LESSONS.get(group) || []), slug]))

function needed(entry) {
  if (['Category', 'Topic', 'Tag'].includes(entry.model)) return true
  if (entry.model === 'Problem') return PROBLEM_LESSONS.has(entry.key)
  if (entry.model === 'ProblemCollection') return BOX_LESSON.has(entry.key)
  if (entry.model === 'Theory') { const slug = entry.key.replace(/-guia$/, ''); return REVISED.has(slug) || NEW.has(slug) }
  if (entry.model === 'Path') return REVISED.has(entry.key) || NEW.has(entry.key) || GROUP_LESSONS.has(entry.key)
  if (entry.model === 'Step') return NEW.has(entry.key.split(':')[0])
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

// A short fingerprint of what a lesson holds on the live site. Accepting a
// live version names this fingerprint, so a later edit is never overwritten
// by an acceptance given for an earlier one.
export function fingerprint(records) {
  return createHash('sha256').update(JSON.stringify(records.map((record) => record ?? null))).digest('hex').slice(0, 12)
}

// Lines that only one of two texts has, to show what a live edit changed.
export function lineChanges(live = '', reference = '') {
  const liveLines = live.split('\n').map((line) => line.trim()).filter(Boolean)
  const referenceLines = reference.split('\n').map((line) => line.trim()).filter(Boolean)
  const referenceSet = new Set(referenceLines), liveSet = new Set(liveLines)
  const short = (line) => (line.length > 110 ? `${line.slice(0, 107)}…` : line)
  const onlyLive = liveLines.filter((line) => !referenceSet.has(line))
  const onlyReference = referenceLines.filter((line) => !liveSet.has(line))
  return { added: onlyLive.length, removed: onlyReference.length, examples: [...onlyLive.slice(0, 3).map((line) => `+ ${short(line)}`), ...onlyReference.slice(0, 3).map((line) => `- ${short(line)}`)] }
}

function conflict(message) {
  const error = new Error(message)
  error.code = 'THEORY_REVISION_CONFLICT'
  return error
}

function originalDraftPath(existing, slug) {
  const original = OMM_CURRICULUM.paths.find((path) => path.slug === slug)
  return Boolean(original) && matches(existing, { slug: original.slug, title: original.title, level: original.level, description: original.description, tags: [], publicationStatus: 'draft' })
}

// Same identity rules as the content importer: existing records keep their ids.
export async function planTheoryRevision({ acceptLive = {} } = {}) {
  const ids = new Map()
  const resolve = (model, key) => ids.get(`${model}:${key}`) || contentId(model, key)
  const found = []
  for (const initial of buildMvpManifest().filter(needed)) {
    const entry = buildMvpManifest(resolve).find((e) => e.model === initial.model && e.key === initial.key)
    const Model = MODELS[entry.model]
    const records = await Model.find({ $or: [{ _id: entry._id }, entry.identity] }).lean()
    if (records.length > 1) throw conflict(`Ambiguous identity: ${entry.model}/${entry.key}.`)
    const existing = records[0]
    if (existing && !matches(existing, entry.identity)) throw conflict(`Identity collision: ${entry.model}/${entry.key}.`)
    if (existing) ids.set(`${entry.model}:${entry.key}`, String(existing._id))
    found.push({ entry, existing })
  }

  const lessons = new Map()
  const lessonOf = (slug) => {
    if (!lessons.has(slug)) lessons.set(slug, { slug, kind: NEW.has(slug) ? 'new' : 'revised', title: THEORY_REWRITES[slug].lesson?.title, rows: [], problems: [], live: [] })
    return lessons.get(slug)
  }
  const rows = []

  // Lesson records: Theory, the lesson's own Path and, for new lessons, its Steps.
  for (const { entry, existing } of found) {
    const Model = MODELS[entry.model]
    if (entry.model === 'Theory' || (entry.model === 'Path' && (REVISED.has(entry.key) || NEW.has(entry.key))) || entry.model === 'Step') {
      const slug = entry.model === 'Theory' ? entry.key.replace(/-guia$/, '') : entry.key.split(':')[0]
      const lesson = lessonOf(slug)
      if (entry.model === 'Theory') lesson.title = existing?.title ?? entry.data.title
      const row = { model: entry.model, key: entry.key, _id: existing?._id || entry._id, existing, lesson: slug }
      if (REVISED.has(slug)) {
        if (!existing) throw conflict(`Missing ${entry.model}/${entry.key}: import the base content first.`)
        const versions = [PREVIOUS_THEORY[slug], ...(EARLIER_THEORY[slug] ?? [])]
        const desired = entry.model === 'Theory' ? [['summary', entry.data.summary], ['content', entry.data.content]] : [['description', entry.data.description]]
        const accepted = versions.map((version) => (entry.model === 'Theory' ? [['summary', version.summary], ['content', version.content]] : [['description', version.summary]]))
        const action = decide(existing, desired, ...accepted)
        Object.assign(row, { action: action ?? 'live', filter: Object.fromEntries(heldPrevious(existing, ...accepted) ?? desired.map(([field]) => [field, existing[field]])), set: Object.fromEntries(desired) })
        if (!action) lesson.live.push({ model: entry.model, changes: entry.model === 'Theory' ? lineChanges(existing.content, versions[0].content) : lineChanges(existing.description, versions[0].summary) })
      } else {
        const fields = new Model(entry.data).toObject()
        const keys = Object.keys(entry.data)
        const same = existing && matches(existing, fields, keys)
        const promote = existing && !same && entry.model === 'Path' && originalDraftPath(existing, entry.key)
        Object.assign(row, { action: !existing ? 'create' : same ? 'keep' : promote ? 'promote' : 'live', data: entry.data })
        if (promote) row.filter = { publicationStatus: 'draft', description: existing.description }
        if (row.action === 'live') { row.filter = Object.fromEntries(keys.map((key) => [key, existing[key]])); lesson.live.push({ model: entry.model, changes: entry.model === 'Theory' ? lineChanges(existing.content, entry.data.content) : { added: 0, removed: 0, examples: [`${entry.model} ${entry.key} differs from the checked-in version`] } }) }
      }
      lesson.rows.push(row)
      rows.push(row)
    }
  }

  // A new lesson's Path must hold no structure that the release does not manage.
  for (const lesson of lessons.values()) {
    if (lesson.kind !== 'new') continue
    const path = lesson.rows.find((row) => row.model === 'Path')
    const [edges, steps] = await Promise.all([PathReference.find({ parentPath: path._id }).lean(), Step.find({ path: path._id }).lean()])
    const ours = new Set(lesson.rows.filter((row) => row.model === 'Step').map((row) => String(row._id)))
    if (edges.length || steps.some((step) => !ours.has(String(step._id)))) lesson.live.push({ model: 'Path', changes: { added: 0, removed: 0, examples: ['The Ruta of this lesson holds Steps or children added on the live site'] } })
  }

  // Groups above new lessons: published by the release, or the original draft to promote.
  const groups = []
  for (const { entry, existing } of found.filter(({ entry }) => entry.model === 'Path' && GROUP_LESSONS.has(entry.key) && !NEW.has(entry.key))) {
    if (!existing) throw conflict(`Missing Path/${entry.key}: import the base content first.`)
    // An already published group needs nothing, even if its text was edited on the live site.
    const action = existing.publicationStatus === 'published' ? 'keep' : originalDraftPath(existing, entry.key) ? 'promote' : 'live'
    const row = { model: 'Path', key: entry.key, _id: existing._id, existing, action, data: entry.data, filter: { publicationStatus: existing.publicationStatus, description: existing.description }, group: true, lessons: GROUP_LESSONS.get(entry.key) }
    // A group edited on the live site is left alone, and so are the new lessons under it.
    if (action === 'live') for (const slug of row.lessons) lessonOf(slug).live.push({ model: 'Path', changes: { added: 0, removed: 0, examples: [`The group «${existing.title}» was edited on the live site`] } })
    groups.push(row)
    rows.push(row)
  }

  // Decide each lesson: go ahead, already up to date, or skipped because of live edits.
  for (const lesson of lessons.values()) {
    const records = lesson.rows.filter((row) => row.model !== 'Step').map((row) => row.existing && { summary: row.existing.summary, content: row.existing.content, description: row.existing.description, publicationStatus: row.existing.publicationStatus })
    lesson.fingerprint = fingerprint(records)
    lesson.accepted = lesson.live.length > 0 && acceptLive[lesson.slug] === lesson.fingerprint
    lesson.skipped = lesson.live.length > 0 && !lesson.accepted
    for (const row of lesson.rows) {
      if (lesson.skipped) row.action = row.action === 'keep' ? 'keep' : 'skip'
      else if (row.action === 'live') row.action = REVISED.has(lesson.slug) ? 'revise' : row.existing ? 'overwrite' : 'create'
    }
  }
  for (const row of groups) {
    const go = [...row.lessons].some((slug) => !lessons.get(slug)?.skipped)
    if (row.action === 'live' || !go) row.action = row.action === 'keep' ? 'keep' : 'skip'
  }
  const skipped = (slugs) => [...slugs].every((slug) => lessons.get(slug)?.skipped)

  // Problems and boxes are only added. A problem edited on the live site stays as it is.
  for (const { entry, existing } of found.filter(({ entry }) => ['Problem', 'ProblemCollection'].includes(entry.model))) {
    const Model = MODELS[entry.model]
    const owners = entry.model === 'Problem' ? PROBLEM_LESSONS.get(entry.key) : new Set([BOX_LESSON.get(entry.key)])
    if (entry.model === 'Problem' && !NEW_CODES.has(entry.key)) {
      if (!existing) throw conflict(`Missing Problem/${entry.key}: import the base content first.`)
      continue
    }
    const fields = new Model(entry.data).toObject()
    const action = !existing ? (skipped(owners) ? 'skip' : 'create') : matches(existing, fields, Object.keys(entry.data)) ? 'keep' : 'live'
    rows.push({ model: entry.model, key: entry.key, _id: existing?._id || entry._id, action, data: entry.data, owners })
  }
  return { rows, lessons: [...lessons.values()] }
}

export function summarize({ rows, lessons }) {
  const by = (model, action) => rows.filter((row) => row.model === model && (!action || row.action === action))
  const changes = ['revise', 'create', 'promote', 'overwrite']
  return {
    lessons: lessons.map((lesson) => {
      const theory = lesson.rows.find((row) => row.model === 'Theory')
      const path = lesson.rows.find((row) => row.model === 'Path')
      const status = lesson.skipped ? 'skipped' : lesson.rows.every((row) => row.action === 'keep') ? 'keep' : lesson.accepted ? 'accepted' : 'change'
      return { slug: lesson.slug, title: lesson.title, kind: lesson.kind, status, text: theory?.action, ruta: path?.action, steps: lesson.rows.filter((row) => row.model === 'Step').map((row) => row.action), fingerprint: lesson.live.length ? lesson.fingerprint : undefined, live: lesson.live }
    }),
    groupsPublished: by('Path').filter((row) => row.group && row.action === 'promote').map((row) => row.key),
    groupsSkipped: by('Path').filter((row) => row.group && row.action === 'skip').map((row) => row.key),
    problemsAdded: by('Problem', 'create').map((row) => row.key),
    problemsAlreadyThere: by('Problem', 'keep').map((row) => row.key),
    problemsEditedLive: by('Problem', 'live').map((row) => row.key),
    collectionsCreated: by('ProblemCollection', 'create').map((row) => `${row.key} (${row.data.problems.length})`),
    collectionsAlreadyThere: by('ProblemCollection', 'keep').map((row) => row.key),
    collectionsEditedLive: by('ProblemCollection', 'live').map((row) => row.key),
    writes: rows.filter((row) => changes.includes(row.action)).length,
  }
}

export async function reviseTheoryLessons({ apply = false, acceptLive = {} } = {}) {
  if (!apply) return summarize(await planTheoryRevision({ acceptLive }))
  const hello = await mongoose.connection.db.admin().command({ hello: 1 })
  if (!hello.setName && hello.msg !== 'isdbgrid') {
    const error = new Error('The revision requires a replica set (MongoDB Atlas supports this). Nothing was written.')
    error.code = 'CONTENT_REPLICA_SET_REQUIRED'
    throw error
  }
  const preview = summarize(await planTheoryRevision({ acceptLive }))
  if (preview.writes === 0) return preview
  // The unique slug + kind index must exist before collections are written.
  await ProblemCollection.createCollection()
  await ProblemCollection.createIndexes()
  return mongoose.connection.transaction(async () => {
    const plan = await planTheoryRevision({ acceptLive })
    const order = ['Problem', 'ProblemCollection', 'Theory', 'Path', 'Step']
    for (const row of [...plan.rows].sort((a, b) => order.indexOf(a.model) - order.indexOf(b.model))) {
      const Model = MODELS[row.model]
      if (row.action === 'create') await new Model({ _id: row._id, ...row.data }).save()
      if (['revise', 'promote', 'overwrite'].includes(row.action)) {
        // Compare-and-set: the record must still hold exactly what the plan saw.
        const result = await Model.updateOne({ _id: row._id, ...row.filter }, { $set: row.set ?? row.data }, { runValidators: true })
        if (result.modifiedCount !== 1) throw conflict(`${row.model}/${row.key} changed during the revision; nothing was written.`)
      }
    }
    return summarize(plan)
  })
}
