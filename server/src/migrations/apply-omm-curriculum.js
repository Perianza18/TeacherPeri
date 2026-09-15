// Additive, repeatable local-development curriculum application.
// It never deletes Paths, references, Steps, sections, content, users, or progress.
import 'dotenv/config'
import mongoose from 'mongoose'
import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import PathSection from '../models/PathSection.js'
import Step from '../models/Step.js'
import { assertVerifiedDatabase, developmentMigrationTarget } from '../database-safety.js'
import { OMM_CURRICULUM, validateOmmCurriculumDefinition } from '../data/ommCurriculum.js'

function pathFields(specification) {
  return {
    slug: specification.slug,
    title: specification.title,
    description: specification.description,
    level: specification.level,
    publicationStatus: specification.publicationStatus,
  }
}

function sameId(first, second) {
  return first?.toString() === second?.toString()
}

async function resolveExistingPath(specification) {
  const matches = await Path.find({
    $or: [{ slug: specification.slug }, { title: specification.title }],
  })
  if (matches.length > 1) {
    throw new Error(`Path identity conflict for ${specification.title}: its title and slug resolve to different records.`)
  }
  const existing = matches[0] || null
  if (existing && (existing.slug !== specification.slug || existing.title !== specification.title)) {
    throw new Error(`Path identity conflict for ${specification.title}: review the existing title/slug instead of repurposing it.`)
  }
  return existing
}

async function preflight(existingBySlug) {
  const root = existingBySlug.get(OMM_CURRICULUM.root.slug)
  if (root && await Step.exists({ path: root._id })) {
    throw new Error('Preparación para la OMM already owns Steps and cannot receive child Path references.')
  }

  const mixedEntries = OMM_CURRICULUM.entries.filter(({ path }) => path.steps.length)
  for (const { path: specification } of mixedEntries) {
    const path = existingBySlug.get(specification.slug)
    if (!path) continue
    const [childReference, section, steps] = await Promise.all([
      PathReference.exists({ parentPath: path._id }),
      PathSection.exists({ path: path._id }),
      Step.find({ path: path._id }).sort({ order: 1 }),
    ])
    if (childReference || section) {
      throw new Error(`${specification.title} must remain a leaf Path and cannot own child references or sections.`)
    }
    for (const step of steps) {
      const expected = specification.steps.find(({ order }) => order === step.order)
      if (expected && expected.title !== step.title) {
        throw new Error(`${specification.title} has authored Step ${step.order}; refusing to overwrite it with ${expected.title}.`)
      }
    }
  }

  if (!root) return
  for (const specification of OMM_CURRICULUM.sections) {
    if (await PathSection.countDocuments({ path: root._id, title: specification.title }) > 1) {
      throw new Error(`Duplicate PathSections found for ${specification.title}.`)
    }
  }
  const expectedExistingIds = new Set(
    OMM_CURRICULUM.entries
      .map(({ path }) => existingBySlug.get(path.slug)?._id.toString())
      .filter(Boolean),
  )
  const rootReferences = await PathReference.find({ parentPath: root._id })
  const unmanagedCollision = rootReferences.find((reference) =>
    reference.order <= OMM_CURRICULUM.entries.length &&
    !expectedExistingIds.has(reference.childPath.toString()))
  if (unmanagedCollision) {
    throw new Error(`Existing unrelated root reference occupies managed order ${unmanagedCollision.order}; review it manually.`)
  }
}

async function createMissingPaths(target, existingBySlug, report) {
  const specifications = [OMM_CURRICULUM.root, ...OMM_CURRICULUM.entries.map(({ path }) => path)]
  for (const specification of specifications) {
    if (existingBySlug.has(specification.slug)) {
      report.pathsReused += 1
      continue
    }
    assertVerifiedDatabase(mongoose.connection, target)
    const created = await Path.create(pathFields(specification))
    existingBySlug.set(specification.slug, created)
    report.pathsCreated += 1
  }
}

async function resolveSections(target, root, report) {
  const sectionByKey = new Map()
  for (const specification of OMM_CURRICULUM.sections) {
    const matches = await PathSection.find({ path: root._id, title: specification.title })
    if (matches.length > 1) throw new Error(`Duplicate PathSections found for ${specification.title}.`)
    let section = matches[0]
    if (!section) {
      assertVerifiedDatabase(mongoose.connection, target)
      section = await PathSection.create({ path: root._id, title: specification.title })
      report.sectionsCreated += 1
    } else {
      report.sectionsReused += 1
    }
    sectionByKey.set(specification.key, section)
  }
  return sectionByKey
}

async function applyRootReferences(target, root, pathBySlug, sectionByKey, report) {
  const references = await PathReference.find({ parentPath: root._id })
  const referenceByChild = new Map(references.map((reference) => [reference.childPath.toString(), reference]))
  const expectedIds = new Set(OMM_CURRICULUM.entries.map(({ path }) => pathBySlug.get(path.slug)._id.toString()))
  const unmanagedCollision = references.find((reference) =>
    reference.order <= OMM_CURRICULUM.entries.length && !expectedIds.has(reference.childPath.toString()))
  if (unmanagedCollision) {
    throw new Error(`Existing unrelated root reference occupies managed order ${unmanagedCollision.order}; review it manually.`)
  }

  const desiredEntryByChild = new Map(OMM_CURRICULUM.entries.map((entry) => [
    pathBySlug.get(entry.path.slug)._id.toString(),
    entry,
  ]))
  const changedOrderReferences = references.filter((reference) => {
    const desired = desiredEntryByChild.get(reference.childPath.toString())
    return desired && reference.order !== desired.order
  })

  const maximumOrder = references.reduce((maximum, reference) => Math.max(maximum, reference.order), 0)
  for (const [index, reference] of changedOrderReferences.entries()) {
    assertVerifiedDatabase(mongoose.connection, target)
    await PathReference.updateOne({ _id: reference._id }, { $set: { order: maximumOrder + 1000 + index } })
    reference.order = maximumOrder + 1000 + index
  }

  for (const entry of OMM_CURRICULUM.entries) {
    const child = pathBySlug.get(entry.path.slug)
    const section = entry.sectionKey ? sectionByKey.get(entry.sectionKey) : null
    let reference = referenceByChild.get(child._id.toString())
    if (!reference) {
      assertVerifiedDatabase(mongoose.connection, target)
      reference = await PathReference.create({
        parentPath: root._id,
        childPath: child._id,
        order: entry.order,
        section: section?._id || null,
      })
      referenceByChild.set(child._id.toString(), reference)
      report.referencesCreated += 1
      continue
    }

    if (reference.order === entry.order && sameId(reference.section, section?._id)) {
      report.referencesReused += 1
      continue
    }
    reference.order = entry.order
    reference.section = section?._id || null
    assertVerifiedDatabase(mongoose.connection, target)
    await reference.save()
    report.referencesUpdated += 1
  }

  report.unrelatedRootReferencesPreserved = references.filter((reference) =>
    !expectedIds.has(reference.childPath.toString())).length
}

async function applyMixedSteps(target, pathBySlug, report) {
  const mixedEntries = OMM_CURRICULUM.entries.filter(({ path }) => path.steps.length)
  for (const { path: specification } of mixedEntries) {
    const path = pathBySlug.get(specification.slug)
    const existingSteps = await Step.find({ path: path._id })
    const existingByOrder = new Map(existingSteps.map((step) => [step.order, step]))
    for (const stepSpecification of specification.steps) {
      const existing = existingByOrder.get(stepSpecification.order)
      if (existing) {
        if (existing.title !== stepSpecification.title) {
          throw new Error(`${specification.title} has authored Step ${existing.order}; refusing to overwrite it.`)
        }
        report.stepsReused += 1
        continue
      }
      assertVerifiedDatabase(mongoose.connection, target)
      await Step.create({
        path: path._id,
        order: stepSpecification.order,
        title: stepSpecification.title,
        description: stepSpecification.description,
      })
      report.stepsCreated += 1
    }
  }
}

async function applyOmmCurriculum() {
  validateOmmCurriculumDefinition()
  const target = developmentMigrationTarget()
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)

  const report = {
    pathsCreated: 0,
    pathsReused: 0,
    sectionsCreated: 0,
    sectionsReused: 0,
    referencesCreated: 0,
    referencesUpdated: 0,
    referencesReused: 0,
    stepsCreated: 0,
    stepsReused: 0,
    unrelatedRootReferencesPreserved: 0,
  }
  const pathSpecifications = [OMM_CURRICULUM.root, ...OMM_CURRICULUM.entries.map(({ path }) => path)]
  const existingBySlug = new Map()
  for (const specification of pathSpecifications) {
    const existing = await resolveExistingPath(specification)
    if (existing) existingBySlug.set(specification.slug, existing)
  }

  await preflight(existingBySlug)
  await createMissingPaths(target, existingBySlug, report)
  const root = existingBySlug.get(OMM_CURRICULUM.root.slug)
  const sectionByKey = await resolveSections(target, root, report)
  await applyRootReferences(target, root, existingBySlug, sectionByKey, report)
  await applyMixedSteps(target, existingBySlug, report)

  console.log(`Applied the OMM curriculum definition to ${target.dbName}.`)
  Object.entries(report).forEach(([key, value]) => console.log(`- ${key}: ${value}`))
  console.log('All newly created Paths remain draft; existing publication status and editorial fields were preserved.')
}

applyOmmCurriculum()
  .catch((error) => {
    console.error('OMM curriculum application failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => mongoose.disconnect())
