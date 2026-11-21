// ---------------------------------------------------------------------------
// Editors and admins change any problem or lesson directly (no review).
//
// GET  /api/editor/problems/:id      editor+: what the edit form starts from (any status)
// PUT  /api/editor/problems/:id      editor+: { titulo, enunciado, hint, solution, topics,
//                                    tags, examFolder, problemNumber, baseUpdatedAt }
// GET  /api/editor/theory/:id        editor+: { title, summary, content, … }
// PUT  /api/editor/theory/:id        editor+: { title, summary, content, baseUpdatedAt }
// GET  /api/editor/revisions         admin: latest changes (?targetType=&target= to filter)
// GET  /api/editor/revisions/:id     admin: one change with every field before and after
//
// Every save is stored as a ContentRevision and notifies the other admins
// (server/src/lib/contentEdits.js). `baseUpdatedAt` stops a save that would
// overwrite someone else's newer change (409).
// ---------------------------------------------------------------------------

import { Router } from 'express'
import mongoose from 'mongoose'
import ContentRevision, { REVISION_TARGETS } from '../models/ContentRevision.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'
import {
  EditError, applyProblemEdit, applyTheoryEdit, parseProblemEdit, parseTheoryEdit,
  problemEditView, recordRevision, revisionView, theoryEditView,
} from '../lib/contentEdits.js'

const router = Router()
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)

router.use(requireAuth)

function sendEditError(res, error) {
  if (!(error instanceof EditError)) throw error
  return res.status(error.status).json({ error: error.message, ...(error.checks.length ? { checks: error.checks } : {}) })
}

router.get('/problems/:id', requirePermission('content:edit-any'), async (req, res) => {
  const problem = isId(req.params.id) ? await Problem.findById(req.params.id).lean() : null
  if (!problem) return res.status(404).json({ error: 'Ese problema no existe.' })
  res.json(await problemEditView(problem))
})

router.put('/problems/:id', requirePermission('content:edit-any'), async (req, res) => {
  const problem = isId(req.params.id) ? await Problem.findById(req.params.id) : null
  if (!problem) return res.status(404).json({ error: 'Ese problema no existe.' })
  if (problem.deletedAt) return res.status(409).json({ error: 'Este problema fue eliminado. Un admin puede restaurarlo.' })
  try {
    const edit = parseProblemEdit(req.body)
    const changes = await applyProblemEdit(problem, edit, { baseUpdatedAt: req.body?.baseUpdatedAt })
    if (!changes.length) return res.status(400).json({ error: 'No hay cambios que guardar.' })
    await problem.save()
    const revision = await recordRevision({ targetType: 'problem', target: problem._id, targetLabel: `${problem.codigo} «${problem.titulo}»`, editorId: req.userId, changes })
    res.json({ item: await problemEditView(problem.toObject()), revision: revision._id, changed: changes.map((change) => change.field) })
  } catch (error) {
    return sendEditError(res, error)
  }
})

router.get('/theory/:id', requirePermission('content:edit-any'), async (req, res) => {
  const lesson = isId(req.params.id) ? await Theory.findById(req.params.id).lean() : null
  if (!lesson) return res.status(404).json({ error: 'Esa lección no existe.' })
  res.json(theoryEditView(lesson))
})

router.put('/theory/:id', requirePermission('content:edit-any'), async (req, res) => {
  const lesson = isId(req.params.id) ? await Theory.findById(req.params.id) : null
  if (!lesson) return res.status(404).json({ error: 'Esa lección no existe.' })
  try {
    const edit = parseTheoryEdit(req.body)
    const changes = applyTheoryEdit(lesson, edit, { baseUpdatedAt: req.body?.baseUpdatedAt })
    if (!changes.length) return res.status(400).json({ error: 'No hay cambios que guardar.' })
    await lesson.save()
    const revision = await recordRevision({ targetType: 'theory', target: lesson._id, targetLabel: `«${lesson.title}»`, editorId: req.userId, changes })
    res.json({ item: theoryEditView(lesson.toObject()), revision: revision._id, changed: changes.map((change) => change.field) })
  } catch (error) {
    return sendEditError(res, error)
  }
})

router.get('/revisions', requirePermission('activity:notified'), async (req, res) => {
  const filter = {}
  if (req.query.targetType) {
    if (!REVISION_TARGETS.includes(req.query.targetType)) return res.status(400).json({ error: 'Tipo de contenido no válido.' })
    filter.targetType = req.query.targetType
  }
  if (req.query.target) {
    if (!isId(req.query.target)) return res.status(400).json({ error: 'Identificador no válido.' })
    filter.target = req.query.target
  }
  const revisions = await ContentRevision.find(filter).sort({ createdAt: -1 }).limit(100).populate('editor', 'username').lean()
  // The list shows which fields changed; the full before/after is in the detail.
  res.json(revisions.map((revision) => ({ ...revisionView(revision), changes: revision.changes.map(({ field, label }) => ({ field, label })) })))
})

router.get('/revisions/:id', requirePermission('activity:notified'), async (req, res) => {
  const revision = isId(req.params.id) ? await ContentRevision.findById(req.params.id).populate('editor', 'username').lean() : null
  if (!revision) return res.status(404).json({ error: 'Ese cambio no existe.' })
  res.json(revisionView(revision))
})

export default router
