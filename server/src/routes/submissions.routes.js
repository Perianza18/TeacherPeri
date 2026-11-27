// ---------------------------------------------------------------------------
// Community problem submissions (every route needs a session).
//
// GET    /api/submissions/folders        exam folders you can use (approved + your pending ones)
// POST   /api/submissions/folders        propose an exam subfolder (stays pending)
// GET    /api/submissions/topics         temas you can use (approved + your pending ones)
// POST   /api/submissions/topics         propose a subtema inside an área (stays pending)
// POST   /api/submissions                propose a new problem (stays a draft, pending review)
// GET    /api/submissions/mine           your problems with their review state («Mis envíos»)
// GET    /api/submissions/mine/:id       one of them, with what the edit form starts from
// PUT    /api/submissions/mine/:id       change it (a published problem keeps its live
//                                        version until the change is approved)
// DELETE /api/submissions/mine/:id       soft delete (an admin can restore it)
//
// Approving and rejecting are NOT endpoints: an admin does it with the review
// script (server/src/scripts/review-submissions.js). See docs/SUBMISSIONS.md.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Topic from '../models/Topic.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { ensureExamRoot, examFoldersVisibleTo, folderPath, parseFolderName } from '../lib/examFolders.js'
import { hasErrors, runSubmissionChecks } from '../lib/review/checks.js'
import { PROPOSABLE_ROOT_SLUGS, existingTopicNamed, freeTopicSlug, parseTopicName, topicView, topicsVisibleTo } from '../lib/topics.js'
import { ImageError, assertUsableImages, deleteIfUnused } from '../lib/images.js'
import { syncProblemExams } from '../lib/examSync.js'
import { comparableProblemsFor, derivedProblemFields, nextCommunityCode, ownSubmissionViews, parseProposal, proposalFromProblem, sameProposal, vocabulary } from '../lib/submissions.js'

const router = Router()
const MAX_PENDING_FOLDERS = 20
const MAX_PENDING_TOPICS = 20
const MAX_PENDING_PROBLEMS = 30
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

// The person's usable exam folders (for the checks) and every exam folder
// (to name paths and tell exam folders apart when deriving fields).
async function folderContext(userId) {
  await ensureExamRoot()
  const [folders, allExam] = await Promise.all([examFoldersVisibleTo(userId), Category.find({ kind: 'exam' }).lean()])
  return { folders, byId: new Map(folders.map((folder) => [String(folder._id), folder])), allById: new Map(allExam.map((folder) => [String(folder._id), folder])) }
}

// Checks the images a proposal uses; answers and returns false when one is not allowed.
async function imagesOk(res, proposal, userId, problemId = null) {
  try {
    await assertUsableImages(proposal.images, { userId, problemId })
    return true
  } catch (error) {
    if (!(error instanceof ImageError)) throw error
    res.status(error.status).json({ error: error.message })
    return false
  }
}

function invalid(res, checks) {
  const first = checks.find((check) => check.level === 'error')
  return res.status(422).json({ error: first.message, checks })
}

// Loads one of the person's own problems, answering 404/403 when it isn't.
async function ownProblem(req, res) {
  const { id } = req.params
  const problem = isId(id) ? await Problem.findOne({ _id: id, deletedAt: null }) : null
  if (!problem) { res.status(404).json({ error: 'Ese problema no existe.' }); return null }
  if (String(problem.author) !== req.userId) { res.status(403).json({ error: 'Solo puedes cambiar los problemas que tú propusiste.' }); return null }
  return problem
}

router.get('/folders', requirePermission('folders:propose'), async (req, res) => {
  const { folders } = await folderContext(req.userId)
  res.json(folders.map((folder) => ({ _id: folder._id, name: folder.name, parent: folder.parent, reviewStatus: folder.reviewStatus ?? 'approved', mine: String(folder.createdBy) === req.userId })))
})

router.post('/folders', requirePermission('folders:propose'), async (req, res) => {
  const parsed = parseFolderName(req.body?.name)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { byId } = await folderContext(req.userId)
  const parent = isId(req.body?.parent) ? byId.get(String(req.body.parent)) : null
  if (!parent) return res.status(400).json({ error: 'Elige dentro de qué carpeta va la nueva.' })
  if (await Category.countDocuments({ createdBy: req.userId, reviewStatus: 'pending' }) >= MAX_PENDING_FOLDERS) {
    return res.status(429).json({ error: 'Tienes muchas carpetas en revisión. Espera a que se revisen antes de crear más.' })
  }
  try {
    const folder = await Category.create({ name: parsed.name, parent: parent._id, kind: 'exam', reviewStatus: 'pending', createdBy: req.userId })
    res.status(201).json({ _id: folder._id, name: folder.name, parent: folder.parent, reviewStatus: 'pending', mine: true, path: folderPath(folder._id, new Map([...byId, [String(folder._id), folder.toObject()]])) })
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(409).json({ error: error.errors.name?.message || 'No se pudo crear la carpeta.' })
    throw error
  }
})

router.get('/topics', requirePermission('topics:propose'), async (req, res) => {
  res.json((await topicsVisibleTo(req.userId)).map((topic) => topicView(topic, req.userId)))
})

// { name, parent }: parent is one of the four áreas (or «Demostraciones»).
// When the área already has a topic with that name or that other name
// («palomar» → «Principio de casillas»), answers 409 with `existing`, so the
// form can offer it instead of creating a copy.
router.post('/topics', requirePermission('topics:propose'), async (req, res) => {
  const parsed = parseTopicName(req.body?.name)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const visible = await topicsVisibleTo(req.userId)
  const parent = isId(req.body?.parent) ? visible.find((topic) => String(topic._id) === String(req.body.parent) && !topic.parent && PROPOSABLE_ROOT_SLUGS.includes(topic.slug)) : null
  if (!parent) return res.status(400).json({ error: 'Elige dentro de cuál tema va (Geometría, Álgebra, Teoría de Números o Combinatoria).' })
  const everyone = await Topic.find({ parent: parent._id, reviewStatus: { $ne: 'rejected' } }).lean()
  const existing = existingTopicNamed(parsed.name, parent._id, everyone)
  if (existing) {
    const usable = visible.some((topic) => String(topic._id) === String(existing._id))
    return res.status(409).json({
      error: usable ? `Ya existe: «${existing.name}» en ${parent.name}.` : `Alguien ya propuso «${existing.name}» en ${parent.name}; está en revisión.`,
      ...(usable ? { existing: topicView(existing, req.userId) } : {}),
    })
  }
  if (await Topic.countDocuments({ createdBy: req.userId, reviewStatus: 'pending' }) >= MAX_PENDING_TOPICS) {
    return res.status(429).json({ error: 'Tienes muchos temas en revisión. Espera a que se revisen antes de proponer más.' })
  }
  const topic = await Topic.create({ name: parsed.name, slug: await freeTopicSlug(parsed.name, parent), parent: parent._id, reviewStatus: 'pending', createdBy: req.userId })
  res.status(201).json(topicView(topic.toObject(), req.userId))
})

router.post('/', requirePermission('problems:submit'), async (req, res) => {
  const parsed = parseProposal(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { proposal } = parsed
  if (!await imagesOk(res, proposal, req.userId)) return
  if (await ProblemSubmission.countDocuments({ author: req.userId, status: 'pending' }) >= MAX_PENDING_PROBLEMS) {
    return res.status(429).json({ error: 'Tienes muchos problemas en revisión. Espera a que se revisen antes de enviar más.' })
  }
  const [{ folders, allById }, { topics, tags }, problems] = await Promise.all([folderContext(req.userId), vocabulary({ userId: req.userId }), comparableProblemsFor(req.userId)])
  const checks = runSubmissionChecks(proposal, { topics, tags, folders, problems })
  if (hasErrors(checks)) return invalid(res, checks)

  const fields = derivedProblemFields(proposal, { folders: allById, topics })
  let problem = null
  for (let attempt = 0; attempt < 5 && !problem; attempt += 1) {
    try {
      problem = await Problem.create({
        codigo: await nextCommunityCode(),
        enunciado: proposal.enunciado,
        ...(proposal.solution ? { solution: proposal.solution } : {}),
        topics: proposal.topics,
        tags: proposal.tags,
        ...(proposal.images.length ? { images: proposal.images } : {}),
        ...fields,
        dificultad: 'Media', // campo antiguo obligatorio; no se muestra
        author: req.userId,
        publicationStatus: 'draft',
      })
    } catch (error) {
      if (error.code !== 11000) throw error // otro envío tomó el mismo código: intenta el siguiente
    }
  }
  if (!problem) return res.status(503).json({ error: 'No se pudo guardar el problema. Intenta de nuevo.' })
  await ProblemSubmission.create({ problem: problem._id, author: req.userId, kind: 'create', proposed: proposal, checks })
  const [view] = await ownSubmissionViews(req.userId, [problem._id])
  res.status(201).json(view)
})

router.get('/mine', async (req, res) => {
  res.json(await ownSubmissionViews(req.userId))
})

router.get('/mine/:id', async (req, res) => {
  const problem = await ownProblem(req, res)
  if (!problem) return
  const [view] = await ownSubmissionViews(req.userId, [problem._id])
  res.json(view)
})

router.put('/mine/:id', requirePermission('problems:edit-own'), async (req, res) => {
  const problem = await ownProblem(req, res)
  if (!problem) return
  const parsed = parseProposal(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { proposal } = parsed
  if (!await imagesOk(res, proposal, req.userId, problem._id)) return
  const before = [...(problem.images || []).map((entry) => String(entry.image))]
  const [{ folders, allById }, { topics, tags }, problems] = await Promise.all([folderContext(req.userId), vocabulary({ userId: req.userId }), comparableProblemsFor(req.userId, problem._id)])
  const checks = runSubmissionChecks(proposal, { topics, tags, folders, problems })
  if (hasErrors(checks)) return invalid(res, checks)

  const pending = await ProblemSubmission.findOne({ problem: problem._id, status: 'pending' })
  const isLive = problem.publicationStatus === 'published'
  if (isLive && !pending && sameProposal(proposal, proposalFromProblem(problem.toObject(), allById))) {
    return res.status(400).json({ error: 'No hay cambios respecto a la versión publicada.' })
  }

  if (!isLive) {
    // Nunca aprobado: el borrador se actualiza en su lugar.
    problem.set({ enunciado: proposal.enunciado, solution: proposal.solution || undefined, topics: proposal.topics, tags: proposal.tags, images: proposal.images.length ? proposal.images : undefined, ...derivedProblemFields(proposal, { folders: allById, topics, current: problem.toObject() }) })
    await problem.save()
  }
  if (pending) {
    pending.set({ proposed: proposal, checks })
    await pending.save()
  } else {
    // Publicado → cambio en revisión; rechazado → se vuelve a enviar.
    await ProblemSubmission.create({ problem: problem._id, author: req.userId, kind: isLive ? 'edit' : 'create', proposed: proposal, checks })
  }
  // A picture taken out of a draft that nothing else uses is deleted.
  if (!isLive) await deleteIfUnused(before.filter((id) => !proposal.images.some((entry) => entry.image === id)))
  const [view] = await ownSubmissionViews(req.userId, [problem._id])
  res.json(view)
})

router.delete('/mine/:id', requirePermission('problems:delete-own'), async (req, res) => {
  const problem = await ownProblem(req, res)
  if (!problem) return
  problem.set({ deletedAt: new Date(), deletedBy: req.userId, publicationStatus: 'archived' })
  await problem.save()
  // Its exam card loses it (and is unpublished if it was the last one).
  await syncProblemExams(problem, null)
  await ProblemSubmission.updateMany({ problem: problem._id, status: 'pending' }, { status: 'withdrawn' })
  res.json({ deleted: true, _id: problem._id })
})

export default router
