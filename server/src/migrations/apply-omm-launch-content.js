// Guarded additive application for OMM launch content Batch 1. Never publishes content.
import 'dotenv/config'
import mongoose from 'mongoose'
import Path from '../models/Path.js'
import PathReference from '../models/PathReference.js'
import PathSection from '../models/PathSection.js'
import Theory from '../models/Theory.js'
import Problem from '../models/Problem.js'
import Step from '../models/Step.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { assertVerifiedDatabase, developmentMigrationTarget } from '../database-safety.js'
import {
  OMM_LAUNCH_CONTENT_BATCH_1,
  validateOmmLaunchContentBatch1,
} from '../data/ommLaunchContent.js'
import { OMM_CURRICULUM } from '../data/ommCurriculum.js'
import {
  assertNoAuthoredContentConflict,
  stepMatches,
  theoryMatches,
} from '../data/ommLaunchContent.identity.js'

function theoryFields(specification) {
  return {
    title: specification.title,
    summary: specification.summary,
    content: specification.content,
    level: specification.level,
    publicationStatus: 'draft',
    topics: [],
    tags: [],
    categories: [],
  }
}

async function resolvePreflight() {
  const pathBySlug = new Map()
  const theoryByKey = new Map()
  const problemByCode = new Map()

  for (const lesson of OMM_LAUNCH_CONTENT_BATCH_1.lessons) {
    const path = await Path.findOne({ slug: lesson.pathSlug })
    if (!path) throw new Error(`Missing curriculum Path ${lesson.pathSlug}; apply the reviewed curriculum structure first.`)
    const expectedPath = OMM_CURRICULUM.paths.find((item) => item.slug === lesson.pathSlug)
    if (!expectedPath || path.title !== expectedPath.title) throw new Error(`Path identity conflict for ${lesson.pathSlug}.`)
    if (path.publicationStatus !== 'draft') throw new Error(`Batch 1 Path ${lesson.pathSlug} must remain draft.`)
    const [child, section] = await Promise.all([
      PathReference.exists({ parentPath: path._id }),
      PathSection.exists({ path: path._id }),
    ])
    if (child || section) throw new Error(`Batch 1 Path ${lesson.pathSlug} is not an empty structural leaf.`)
    pathBySlug.set(lesson.pathSlug, path)

    const theories = await Theory.find({ title: lesson.theory.title })
    if (theories.length > 1) throw new Error(`Ambiguous Theory identity ${lesson.theory.title}.`)
    if (theories[0]) {
      assertNoAuthoredContentConflict('Theory', lesson.theory.title, theoryMatches(theories[0], lesson.theory))
      theoryByKey.set(lesson.theory.key, theories[0])
    }
  }

  const usedCodes = [...new Set(OMM_LAUNCH_CONTENT_BATCH_1.lessons.flatMap((lesson) => lesson.steps.flatMap((step) => step.problemCodes)))]
  for (const code of usedCodes) {
    const matches = await Problem.find({ codigo: code, ...publishedOrLegacyProblemQuery() })
    if (matches.length !== 1) throw new Error(`Problem ${code} is missing, ambiguous, or not publicly usable; refusing to fabricate a reference.`)
    problemByCode.set(code, matches[0])
  }

  for (const lesson of OMM_LAUNCH_CONTENT_BATCH_1.lessons) {
    const existingSteps = await Step.find({ path: pathBySlug.get(lesson.pathSlug)._id }).sort({ order: 1 })
    if (!existingSteps.length) continue
    if (!theoryByKey.has(lesson.theory.key) || existingSteps.length !== lesson.steps.length) {
      throw new Error(`Step conflict for ${lesson.pathSlug}; refusing to overwrite independently authored content.`)
    }
    lesson.steps.forEach((specification, index) => {
      const expectedReferences = [
        ...specification.theoryKeys.map((key) => `Theory:${theoryByKey.get(key)._id}`),
        ...specification.problemCodes.map((code) => `Problem:${problemByCode.get(code)._id}`),
      ]
      assertNoAuthoredContentConflict('Step', `${lesson.pathSlug}:${specification.order}`, stepMatches(existingSteps[index], specification, expectedReferences))
    })
  }
  return { pathBySlug, theoryByKey, problemByCode }
}

async function applyOmmLaunchContent() {
  validateOmmLaunchContentBatch1()
  const target = developmentMigrationTarget()
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)
  const resolved = await resolvePreflight()

  for (const lesson of OMM_LAUNCH_CONTENT_BATCH_1.lessons) {
    if (resolved.theoryByKey.has(lesson.theory.key)) continue
    assertVerifiedDatabase(mongoose.connection, target)
    const theory = await Theory.create(theoryFields(lesson.theory))
    resolved.theoryByKey.set(lesson.theory.key, theory)
  }

  for (const lesson of OMM_LAUNCH_CONTENT_BATCH_1.lessons) {
    const path = resolved.pathBySlug.get(lesson.pathSlug)
    const existingSteps = await Step.find({ path: path._id })
    if (existingSteps.length) continue
    for (const specification of lesson.steps) {
      const teacherperiReferences = [
        ...specification.theoryKeys.map((key) => ({ contentType: 'Theory', target: resolved.theoryByKey.get(key)._id })),
        ...specification.problemCodes.map((code) => ({ contentType: 'Problem', target: resolved.problemByCode.get(code)._id })),
      ]
      assertVerifiedDatabase(mongoose.connection, target)
      await Step.create({
        path: path._id,
        order: specification.order,
        title: specification.title,
        description: specification.description,
        teacherperiReferences,
        extraResources: [],
      })
    }
  }
  console.log(`Applied OMM launch content Batch 1 to ${target.dbName} as draft without publishing or overwriting records.`)
}

applyOmmLaunchContent()
  .catch((error) => { console.error('OMM launch content application failed:', error.message); process.exitCode = 1 })
  .finally(async () => mongoose.disconnect())
