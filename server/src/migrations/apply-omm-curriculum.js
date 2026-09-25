// Guarded additive application for a reviewed recursive curriculum.
// Draft v2 intentionally fails before connecting while group children remain pending.
import 'dotenv/config'
import mongoose from 'mongoose'
import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import PathSection from '../models/PathSection.js'
import { assertVerifiedDatabase, developmentMigrationTarget } from '../database-safety.js'
import { OMM_CURRICULUM, validateOmmCurriculumDefinition } from '../data/ommCurriculum.js'

function fields(specification) {
  return { slug: specification.slug, title: specification.title, description: specification.description, level: specification.level, publicationStatus: specification.publicationStatus }
}

async function existingPath(specification) {
  const matches = await Path.find({ $or: [{ slug: specification.slug }, { title: specification.title }] })
  if (matches.length > 1 || matches[0] && (matches[0].slug !== specification.slug || matches[0].title !== specification.title)) {
    throw new Error(`Path identity conflict for ${specification.title}; refusing to repurpose an existing Path.`)
  }
  return matches[0] || null
}

async function applyReferences(target, bySlug, sections) {
  for (const reference of OMM_CURRICULUM.references) {
    const parent = bySlug.get(reference.parentSlug); const child = bySlug.get(reference.childSlug)
    const section = reference.sectionKey ? sections.get(reference.sectionKey) : null
    const existing = await PathReference.findOne({ parentPath: parent._id, childPath: child._id })
    if (existing) {
      if (existing.order !== reference.order || String(existing.section || '') !== String(section?._id || '')) {
        throw new Error(`Existing reference ${reference.parentSlug} → ${reference.childSlug} conflicts with Draft v2; refusing to overwrite it.`)
      }
      continue
    }
    if (await PathReference.exists({ parentPath: parent._id, order: reference.order })) {
      throw new Error(`Parent ${reference.parentSlug} already has an unrelated reference at order ${reference.order}.`)
    }
    assertVerifiedDatabase(mongoose.connection, target)
    await PathReference.create({ parentPath: parent._id, childPath: child._id, order: reference.order, section: section?._id || null })
  }
}

async function applyOmmCurriculum() {
  validateOmmCurriculumDefinition()
  const pending = OMM_CURRICULUM.paths.filter((item) => item.childrenPending)
  if (pending.length) {
    throw new Error(`Draft v2 has unresolved Group Paths (${pending.map((item) => item.slug).join(', ')}); no database connection or mutation was attempted.`)
  }
  const target = developmentMigrationTarget()
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)
  const bySlug = new Map()
  for (const specification of OMM_CURRICULUM.paths) {
    const existing = await existingPath(specification)
    if (existing) bySlug.set(specification.slug, existing)
  }
  for (const specification of OMM_CURRICULUM.paths) {
    if (bySlug.has(specification.slug)) continue
    assertVerifiedDatabase(mongoose.connection, target)
    bySlug.set(specification.slug, await Path.create(fields(specification)))
  }
  const root = bySlug.get(OMM_CURRICULUM.root.slug); const sections = new Map()
  for (const specification of OMM_CURRICULUM.sections) {
    const matches = await PathSection.find({ path: root._id, title: specification.title })
    if (matches.length > 1) throw new Error(`Duplicate PathSection ${specification.title}.`)
    const section = matches[0] || await PathSection.create({ path: root._id, title: specification.title })
    sections.set(specification.key, section)
  }
  await applyReferences(target, bySlug, sections)
  console.log(`Applied reviewed OMM curriculum to ${target.dbName} without deleting or replacing records.`)
}
applyOmmCurriculum().catch((error) => { console.error('OMM curriculum application failed:', error.message); process.exitCode = 1 }).finally(async () => mongoose.disconnect())
