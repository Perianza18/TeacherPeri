// ---------------------------------------------------------------------------
// Community problem submissions (every route needs a session).
//
// GET    /api/submissions/folders        exam folders you can use (approved + your pending ones)
// POST   /api/submissions/folders        propose an exam subfolder (stays pending)
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
import ProblemSubmission from '../models/ProblemSubmission.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import { ensureExamRoot, examFoldersVisibleTo, folderPath, parseFolderName } from '../lib/examFolders.js'
import { hasErrors, runSubmissionChecks } from '../lib/review/checks.js'
import { comparableProblemsFor, derivedProblemFields, nextCommunityCode, ownSubmissionViews, parseProposal, proposalFromProblem, sameProposal, vocabulary } from '../lib/submissions.js'

const router = Router()
const MAX_PENDING_FOLDERS = 20
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

router.post('/', requirePermission('problems:submit'), async (req, res) => {
  const parsed = parseProposal(req.body)
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const { proposal } = parsed
  if (await ProblemSubmission.countDocuments({ author: req.userId, status: 'pending' }) >= MAX_PENDING_PROBLEMS) {
    return res.status(429).json({ error: 'Tienes muchos problemas en revisión. Espera a que se revisen antes de enviar más.' })
  }
  const [{ folders, allById }, { topics, tags }, problems] = await Promise.all([folderContext(req.userId), vocabulary(), comparableProblemsFor(req.userId)])
  const checks = runSubmissionChecks(proposal, { topics, tags, folders, problems })
  if (hasErrors(checks)) return invalid(res, checks)

  const fields = derivedProblemFields(proposal, { folders: allById, topics })
  let problem = null
  for (let attempt = 0; attempt < 5 && !problem; attempt += 1) {
    try {
      problem = await Problem.create({
        codigo: await nextCommunityCode(),
        enunciado: proposal.enunciado,
        topics: proposal.topics,
        tags: proposal.tags,
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
  const [{ folders, allById }, { topics, tags }, problems] = await Promise.all([folderContext(req.userId), vocabulary(), comparableProblemsFor(req.userId, problem._id)])
  const checks = runSubmissionChecks(proposal, { topics, tags, folders, problems })
  if (hasErrors(checks)) return invalid(res, checks)

  const pending = await ProblemSubmission.findOne({ problem: problem._id, status: 'pending' })
  const isLive = problem.publicationStatus === 'published'
  if (isLive && !pending && sameProposal(proposal, proposalFromProblem(problem.toObject(), allById))) {
    return res.status(400).json({ error: 'No hay cambios respecto a la versión publicada.' })
  }

  if (!isLive) {
    // Nunca aprobado: el borrador se actualiza en su lugar.
    problem.set({ enunciado: proposal.enunciado, topics: proposal.topics, tags: proposal.tags, ...derivedProblemFields(proposal, { folders: allById, topics, current: problem.toObject() }) })
    await problem.save()
  }
  if (pending) {
    pending.set({ proposed: proposal, checks })
    await pending.save()
  } else {
    // Publicado → cambio en revisión; rechazado → se vuelve a enviar.
    await ProblemSubmission.create({ problem: problem._id, author: req.userId, kind: isLive ? 'edit' : 'create', proposed: proposal, checks })
  }
  const [view] = await ownSubmissionViews(req.userId, [problem._id])
  res.json(view)
})

router.delete('/mine/:id', requirePermission('problems:delete-own'), async (req, res) => {
  const problem = await ownProblem(req, res)
  if (!problem) return
  problem.set({ deletedAt: new Date(), deletedBy: req.userId, publicationStatus: 'archived' })
  await problem.save()
  await ProblemSubmission.updateMany({ problem: problem._id, status: 'pending' }, { status: 'withdrawn' })
  res.json({ deleted: true, _id: problem._id })
})

export default router
