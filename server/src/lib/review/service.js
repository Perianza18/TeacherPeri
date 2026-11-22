// ---------------------------------------------------------------------------
// Review of community submissions, exam folders, flags and deleted problems.
//
// Every action takes { apply } and returns a plan: `changes` (plain lines saying
// what happens) and `findings` (the automatic checks). With apply=false
// NOTHING is written, which is what `--dry-run` prints. The same functions can
// later run automatically right after an upload.
//
// The reviewer is a User document and must have the matching permission
// (server/src/lib/permissions.js): an author who is not an admin can never
// approve anything, including their own problem.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import Category from '../../models/Category.js'
import Flag from '../../models/Flag.js'
import Notification from '../../models/Notification.js'
import Problem from '../../models/Problem.js'
import Theory from '../../models/Theory.js'
import ProblemSubmission, { REJECTION_REASON_MAX } from '../../models/ProblemSubmission.js'
import User from '../../models/User.js'
import { DIFFICULTY_LEVELS, normalizeSlug } from '../../models/content.js'
import { can, roleOf } from '../permissions.js'
import { folderPath, parseFolderName } from '../examFolders.js'
import { derivedProblemFields, proposalFromProblem, statementImages, vocabulary } from '../submissions.js'
import { imageUrl } from '../images.js'
import { examFolderMap, examFoldersOfProblem, folderAndDescendants, syncFolderExams, syncProblemExams } from '../examSync.js'
import { hasErrors, runSubmissionChecks } from './checks.js'

export class ReviewError extends Error {
  constructor(message, findings = []) {
    super(message)
    this.code = 'REVIEW_ERROR'
    this.findings = findings
  }
}

const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
// A credit written by the approval itself (current and earlier wording).
const AUTO_CREDIT = /(Propuesto por @\S+\.|en la comunidad de TeacherPeri\.)$/

export function assertReviewer(reviewer, permission) {
  if (!reviewer) throw new ReviewError('A reviewer account is required (--as <admin email or username>).')
  if (!can(reviewer, permission)) throw new ReviewError(`${reviewer.username} (${roleOf(reviewer)}) does not have permission ${permission}.`)
}

export async function findReviewer(value) {
  if (!value) return null
  const matches = await User.find({ $or: [{ email: String(value).toLowerCase() }, { username: value }] }).select('username email role').lean()
  if (matches.length !== 1) throw new ReviewError('The --as value must match exactly one account.')
  return matches[0]
}

async function reviewContext(exceptProblemId = null) {
  const [{ topics, tags }, folders, problems] = await Promise.all([
    vocabulary(),
    Category.find({ kind: 'exam' }).lean(),
    Problem.find({ deletedAt: null, ...(exceptProblemId ? { _id: { $ne: exceptProblemId } } : {}) }).select('codigo enunciado').lean(),
  ])
  return { topics, tags, folders, foldersById: new Map(folders.map((f) => [String(f._id), f])), problems }
}

const label = (map, ids, field) => ids.map((id) => map.get(String(id))?.[field] ?? `?${id}`)

// Accepts a submission id, a problem id or a problem code (U-00001).
async function findSubmission(ref, { pendingOnly = true } = {}) {
  let submission = null
  if (isId(ref)) submission = await ProblemSubmission.findOne({ _id: ref, ...(pendingOnly ? { status: 'pending' } : {}) })
  if (!submission) {
    const problem = isId(ref) ? await Problem.findById(ref).select('_id').lean() : await Problem.findOne({ codigo: String(ref).toUpperCase() }).select('_id').lean()
    if (problem) submission = await ProblemSubmission.findOne({ problem: problem._id, ...(pendingOnly ? { status: 'pending' } : {}) }).sort({ createdAt: -1 })
  }
  if (!submission) throw new ReviewError(`No ${pendingOnly ? 'pending ' : ''}submission matches «${ref}».`)
  return submission
}

function describeProposal(proposal, ctx) {
  return {
    enunciado: proposal.enunciado,
    topics: label(ctx.topics, proposal.topics || [], 'name'),
    tags: label(ctx.tags, proposal.tags || [], 'label'),
    isExam: Boolean(proposal.isExam),
    examFolder: proposal.examFolder ? folderPath(proposal.examFolder, ctx.foldersById).join(' › ') : null,
    examFolderStatus: proposal.examFolder ? ctx.foldersById.get(String(proposal.examFolder))?.reviewStatus ?? 'missing' : null,
    problemNumber: proposal.problemNumber ?? null,
    images: statementImages(proposal.images).map((entry) => ({ ...entry, url: imageUrl(entry.image) })),
  }
}

export async function listPending() {
  const [submissions, folders, openFlags] = await Promise.all([
    ProblemSubmission.find({ status: 'pending' }).sort({ createdAt: 1 }).populate('author', 'username').populate('problem', 'codigo publicationStatus').lean(),
    Category.find({ kind: 'exam', reviewStatus: 'pending' }).sort({ createdAt: 1 }).populate('createdBy', 'username').lean(),
    Flag.countDocuments({ status: 'open' }),
  ])
  const ctx = await reviewContext()
  const usage = await ProblemSubmission.aggregate([{ $match: { status: 'pending', 'proposed.examFolder': { $ne: null } } }, { $group: { _id: '$proposed.examFolder', count: { $sum: 1 } } }])
  const usageById = new Map(usage.map((u) => [String(u._id), u.count]))
  return {
    submissions: submissions.map((submission) => {
      const findings = runSubmissionChecks(submission.proposed, { ...ctx, problems: ctx.problems.filter((p) => String(p._id) !== String(submission.problem?._id)) })
      return {
        id: String(submission._id),
        codigo: submission.problem?.codigo,
        kind: submission.kind,
        author: submission.author?.username ?? null,
        createdAt: submission.createdAt,
        ...describeProposal(submission.proposed, ctx),
        findings,
      }
    }),
    folders: folders.map((folder) => ({ id: String(folder._id), path: folderPath(folder._id, ctx.foldersById).join(' › '), createdBy: folder.createdBy?.username ?? null, createdAt: folder.createdAt, pendingSubmissions: usageById.get(String(folder._id)) || 0 })),
    openFlags,
  }
}

export async function showSubmission(ref) {
  const submission = await findSubmission(ref, { pendingOnly: false })
  const problem = await Problem.findById(submission.problem).lean()
  const author = await User.findById(submission.author).select('username').lean()
  const ctx = await reviewContext(problem?._id)
  const proposed = describeProposal(submission.proposed, ctx)
  const live = problem?.publicationStatus === 'published' ? describeProposal(proposalFromProblem(problem, ctx.foldersById), ctx) : null
  const changedFields = live ? Object.keys(proposed).filter((key) => JSON.stringify(proposed[key]) !== JSON.stringify(live[key])) : []
  return {
    id: String(submission._id),
    status: submission.status,
    reason: submission.reason,
    kind: submission.kind,
    codigo: problem?.codigo,
    problemId: problem ? String(problem._id) : null,
    author: author?.username ?? null,
    createdAt: submission.createdAt,
    proposed,
    // The same proposal with ids, for the review screen's pickers.
    proposedIds: {
      topics: (submission.proposed.topics || []).map(String),
      tags: (submission.proposed.tags || []).map(String),
      isExam: Boolean(submission.proposed.isExam),
      examFolder: submission.proposed.examFolder ? String(submission.proposed.examFolder) : null,
      problemNumber: submission.proposed.problemNumber ?? null,
    },
    titulo: problem?.titulo ?? null,
    live,
    changedFields,
    findings: runSubmissionChecks(submission.proposed, ctx),
  }
}

// --- fixes the reviewer can apply before approving -------------------------

function resolveTerms(values, map, fields) {
  return values.map((value) => {
    const wanted = normalizeSlug(value)
    const match = [...map.values()].find((doc) => String(doc._id) === value || fields.some((field) => normalizeSlug(doc[field] || '') === wanted))
    if (!match) throw new ReviewError(`«${value}» is not an existing ${fields.includes('label') ? 'tag' : 'topic'}.`)
    return String(match._id)
  })
}

function resolveFolder(value, ctx) {
  if (isId(value) && ctx.foldersById.has(String(value))) return String(value)
  const wanted = String(value).split(/›|>|\//).map((part) => normalizeSlug(part)).filter(Boolean)
  const match = ctx.folders.find((folder) => {
    const path = folderPath(folder._id, ctx.foldersById).map((name) => normalizeSlug(name))
    const tail = path.slice(-wanted.length)
    return folder.reviewStatus !== 'rejected' && tail.length === wanted.length && tail.every((part, i) => part === wanted[i])
  })
  if (!match) throw new ReviewError(`No exam folder matches «${value}».`)
  return String(match._id)
}

export function applyFixes(proposal, fixes, ctx) {
  const next = { ...proposal, topics: (proposal.topics || []).map(String), tags: (proposal.tags || []).map(String), examFolder: proposal.examFolder ? String(proposal.examFolder) : null }
  if (fixes.topics) next.topics = resolveTerms(fixes.topics, ctx.topics, ['name', 'slug'])
  if (fixes.tags) next.tags = resolveTerms(fixes.tags, ctx.tags, ['label', 'slug', 'name'])
  if (fixes.notExam) Object.assign(next, { isExam: false, examFolder: null, problemNumber: null })
  if (fixes.folder) Object.assign(next, { isExam: true, examFolder: resolveFolder(fixes.folder, ctx) })
  if (fixes.number !== undefined) next.problemNumber = fixes.number
  if (fixes.statement !== undefined) next.enunciado = fixes.statement
  return next
}

function pendingAncestors(folderId, ctx) {
  const chain = []
  let cursor = folderId ? ctx.foldersById.get(String(folderId)) : null
  const seen = new Set()
  while (cursor && !seen.has(String(cursor._id))) {
    seen.add(String(cursor._id))
    if (cursor.reviewStatus === 'pending') chain.unshift(cursor)
    cursor = cursor.parent ? ctx.foldersById.get(String(cursor.parent)) : null
  }
  return chain
}

async function notify(userId, type, problem, message) {
  await Notification.create({ user: userId, type, problem: problem._id, message })
}

// --- approve / reject ---------------------------------------------------------

export async function approveSubmission({ ref, reviewer, fixes = {}, apply = false }) {
  assertReviewer(reviewer, 'submissions:review')
  const submission = await findSubmission(ref)
  const problem = await Problem.findById(submission.problem)
  if (!problem || problem.deletedAt) throw new ReviewError('The problem was deleted; nothing to approve.')
  const ctx = await reviewContext(problem._id)
  const proposal = applyFixes(submission.proposed.toObject(), fixes, ctx)
  if (fixes.difficulty && !DIFFICULTY_LEVELS.includes(fixes.difficulty)) throw new ReviewError(`--difficulty must be one of ${DIFFICULTY_LEVELS.join(', ')}.`)

  // A pending folder is approved together with the problem (listed in
  // `changes`), so its «still in review» note does not apply here.
  const findings = runSubmissionChecks(proposal, ctx).filter((finding) => finding.code !== 'exam-folder-pending')
  if (!proposal.topics.length) findings.push({ level: 'error', code: 'no-topic', message: 'Add at least one área (--topics) before approving.' })
  if (hasErrors(findings)) throw new ReviewError('Fix the errors before approving.', findings)

  const author = await User.findById(submission.author).select('username').lean()
  const derived = derivedProblemFields(proposal, { folders: ctx.foldersById, topics: ctx.topics, current: problem.toObject() })
  const path = proposal.isExam ? folderPath(proposal.examFolder, ctx.foldersById).slice(1).join(' › ') : ''
  // The automatic credit («Propuesto por @usuario», after the exam path) follows
  // the folder; a credit an admin wrote by hand stays.
  const autoCredit = `${path ? `${path}. ` : ''}Propuesto por @${author?.username ?? 'comunidad'}.`
  const keepCredit = problem.sourceAttribution && !AUTO_CREDIT.test(problem.sourceAttribution)
  const update = {
    enunciado: proposal.enunciado,
    topics: proposal.topics,
    tags: proposal.tags,
    // The statement pictures come from the proposal; pictures an editor put in
    // the solution stay.
    images: [...statementImages(proposal.images), ...(problem.images || []).filter((entry) => entry.placement === 'solution').map((entry) => ({ image: entry.image, alt: entry.alt, placement: 'solution' }))],
    ...derived,
    ...(fixes.title ? { titulo: fixes.title } : {}),
    ...(fixes.difficulty ? { difficulty: fixes.difficulty } : {}),
    sourceAttribution: fixes.attribution || (keepCredit ? problem.sourceAttribution : autoCredit),
    publicationStatus: 'published',
    approvedAt: problem.approvedAt || new Date(),
  }
  const folders = pendingAncestors(proposal.examFolder, ctx)
  const before = problem.toObject()
  const examFolderIds = [...examFoldersOfProblem(before, ctx.foldersById), ...(proposal.isExam && proposal.examFolder ? [String(proposal.examFolder)] : [])]
  const changes = [
    ...folders.map((folder) => `approve exam folder «${folderPath(folder._id, ctx.foldersById).join(' › ')}»`),
    `${submission.kind === 'edit' ? 'apply the change to' : 'publish'} ${problem.codigo} «${update.titulo}»`,
    ...Object.entries(fixes).filter(([, value]) => value !== undefined && value !== false).map(([key, value]) => `reviewer fix ${key}: ${Array.isArray(value) ? value.join(', ') : value}`),
    ...[...new Set(examFolderIds)].map((id) => `update the Exámenes card of «${folderPath(id, ctx.foldersById).join(' › ')}»`),
    `mark submission ${submission._id} approved and notify ${author?.username ?? 'the author'}`,
  ]
  if (apply) {
    const now = new Date()
    for (const folder of folders) await Category.updateOne({ _id: folder._id, reviewStatus: 'pending' }, { reviewStatus: 'approved', reviewedBy: reviewer._id, reviewedAt: now })
    problem.set(update)
    await problem.save()
    await syncProblemExams(before, problem)
    submission.set({ status: 'approved', proposed: proposal, reviewedBy: reviewer._id, reviewedAt: now, checks: findings })
    await submission.save()
    await notify(submission.author, 'submission-approved', problem, submission.kind === 'edit' ? `Tus cambios a ${problem.codigo} ya están publicados.` : `Tu problema ${problem.codigo} fue aprobado y ya está publicado.`)
  }
  return { mode: apply ? 'applied' : 'dry-run', codigo: problem.codigo, problemId: String(problem._id), changes, findings }
}

export async function rejectSubmission({ ref, reviewer, reason, apply = false }) {
  assertReviewer(reviewer, 'submissions:review')
  const text = typeof reason === 'string' ? reason.trim() : ''
  if (text.length < 5) throw new ReviewError('A rejection needs a reason (--reason "…", at least 5 characters). The author will read it.')
  if (text.length > REJECTION_REASON_MAX) throw new ReviewError(`The reason cannot exceed ${REJECTION_REASON_MAX} characters.`)
  const submission = await findSubmission(ref)
  const problem = await Problem.findById(submission.problem).select('codigo publicationStatus').lean()
  const changes = [
    `reject submission ${submission._id} (${problem?.codigo}) with reason: ${text}`,
    problem?.publicationStatus === 'published' ? 'the published version stays as it is' : 'the problem stays unpublished; the author can edit and resend it',
  ]
  if (apply) {
    submission.set({ status: 'rejected', reason: text, reviewedBy: reviewer._id, reviewedAt: new Date() })
    await submission.save()
    await notify(submission.author, 'submission-rejected', problem, `${submission.kind === 'edit' ? `Tus cambios a ${problem.codigo}` : `Tu problema ${problem.codigo}`} no se aprobaron: ${text}`)
  }
  return { mode: apply ? 'applied' : 'dry-run', codigo: problem?.codigo, changes }
}

// --- exam folders ---------------------------------------------------------------

async function findFolder(ref) {
  const ctx = await reviewContext()
  const id = resolveFolder(ref, { ...ctx, folders: ctx.folders.filter((folder) => folder.reviewStatus !== 'rejected') })
  return { folder: ctx.foldersById.get(id), ctx }
}

export async function approveFolder({ ref, reviewer, apply = false }) {
  assertReviewer(reviewer, 'folders:review')
  const { folder, ctx } = await findFolder(ref)
  const chain = pendingAncestors(folder._id, ctx)
  if (!chain.length) throw new ReviewError(`«${folderPath(folder._id, ctx.foldersById).join(' › ')}» is not pending.`)
  const changes = chain.map((f) => `approve exam folder «${folderPath(f._id, ctx.foldersById).join(' › ')}»`)
  if (apply) {
    const now = new Date()
    for (const f of chain) await Category.updateOne({ _id: f._id, reviewStatus: 'pending' }, { reviewStatus: 'approved', reviewedBy: reviewer._id, reviewedAt: now })
  }
  return { mode: apply ? 'applied' : 'dry-run', changes }
}

export async function rejectFolder({ ref, reviewer, reason, apply = false }) {
  assertReviewer(reviewer, 'folders:review')
  const text = typeof reason === 'string' ? reason.trim() : ''
  if (text.length < 5) throw new ReviewError('A rejection needs a reason (--reason "…").')
  const { folder, ctx } = await findFolder(ref)
  if (folder.reviewStatus !== 'pending') throw new ReviewError('Only pending folders can be rejected.')
  const [children, inUse, problems] = await Promise.all([
    Category.countDocuments({ parent: folder._id, reviewStatus: { $ne: 'rejected' } }),
    ProblemSubmission.countDocuments({ status: 'pending', 'proposed.examFolder': folder._id }),
    Problem.countDocuments({ categories: folder._id, deletedAt: null }),
  ])
  if (children || inUse || problems) throw new ReviewError(`The folder still has ${children} subfolder(s), ${inUse} pending submission(s) and ${problems} problem(s). Move them first (approve --folder or reject the submissions).`)
  const changes = [`reject exam folder «${folderPath(folder._id, ctx.foldersById).join(' › ')}» with reason: ${text}`]
  if (apply) await Category.updateOne({ _id: folder._id, reviewStatus: 'pending' }, { reviewStatus: 'rejected', reviewReason: text, reviewedBy: reviewer._id, reviewedAt: new Date() })
  return { mode: apply ? 'applied' : 'dry-run', changes }
}

export async function renameFolder({ ref, name, reviewer, apply = false }) {
  assertReviewer(reviewer, 'folders:review')
  const parsed = parseFolderName(name)
  if (parsed.error) throw new ReviewError(parsed.error)
  const { folder, ctx } = await findFolder(ref)
  const before = folderPath(folder._id, ctx.foldersById).join(' › ')
  const changes = [`rename «${before}» to «${parsed.name}»`, 'titles of problems already published in this folder keep their old text until they are edited', 'the Exámenes cards of this folder and the ones inside it take the new name']
  if (apply) {
    const doc = await Category.findById(folder._id)
    doc.name = parsed.name
    await doc.save()
    const map = await examFolderMap()
    await syncFolderExams(folderAndDescendants(folder._id, map), { foldersById: map })
  }
  return { mode: apply ? 'applied' : 'dry-run', changes }
}

// --- flags ------------------------------------------------------------------------

export async function listFlags(status = 'open') {
  const flags = await Flag.find({ status }).sort({ createdAt: status === 'open' ? 1 : -1 }).limit(500).populate('reporter', 'username').populate('handledBy', 'username').lean()
  const problemIds = flags.filter((f) => f.targetType === 'problem').map((f) => f.target)
  const theoryIds = flags.filter((f) => f.targetType === 'theory').map((f) => f.target)
  const [problems, lessons] = await Promise.all([
    Problem.find({ _id: { $in: problemIds } }).select('codigo titulo').lean(),
    Theory.find({ _id: { $in: theoryIds } }).select('title').lean(),
  ])
  const names = new Map([...problems.map((p) => [String(p._id), `${p.codigo} «${p.titulo}»`]), ...lessons.map((t) => [String(t._id), `«${t.title}»`])])
  return flags.map((flag) => ({ id: String(flag._id), targetType: flag.targetType, target: String(flag.target), targetName: names.get(String(flag.target)) ?? '(no longer exists)', message: flag.message, reporter: flag.reporter?.username ?? null, createdAt: flag.createdAt, status: flag.status, handledBy: flag.handledBy?.username ?? null, handledAt: flag.handledAt ?? null, handledNote: flag.handledNote ?? null }))
}

export async function setFlagStatus({ ref, status, note, reviewer, apply = false }) {
  assertReviewer(reviewer, 'flags:view')
  if (!['resolved', 'dismissed'].includes(status)) throw new ReviewError('Status must be resolved or dismissed.')
  const flag = isId(ref) ? await Flag.findOne({ _id: ref, status: 'open' }) : null
  if (!flag) throw new ReviewError(`No open flag matches «${ref}».`)
  const changes = [`mark flag ${flag._id} ${status}${note ? ` (${note})` : ''}`]
  if (apply) {
    flag.set({ status, handledBy: reviewer._id, handledAt: new Date(), handledNote: note || null })
    await flag.save()
  }
  return { mode: apply ? 'applied' : 'dry-run', changes }
}

// --- deleted problems -------------------------------------------------------------

export async function listDeleted() {
  const problems = await Problem.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 }).populate('deletedBy', 'username').populate('author', 'username').select('codigo titulo deletedAt deletedBy author approvedAt').lean()
  return problems.map((p) => ({ id: String(p._id), codigo: p.codigo, titulo: p.titulo, author: p.author?.username ?? null, deletedBy: p.deletedBy?.username ?? null, deletedAt: p.deletedAt, wasPublished: Boolean(p.approvedAt) }))
}

export async function restoreProblem({ ref, reviewer, apply = false }) {
  assertReviewer(reviewer, 'content:restore')
  const problem = isId(ref) ? await Problem.findOne({ _id: ref, deletedAt: { $ne: null } }) : await Problem.findOne({ codigo: String(ref).toUpperCase(), deletedAt: { $ne: null } })
  if (!problem) throw new ReviewError(`No deleted problem matches «${ref}».`)
  const status = problem.approvedAt ? 'published' : 'draft'
  // The deletion withdrew whatever was waiting for review; put it back.
  const [withdrawn, pending] = await Promise.all([
    ProblemSubmission.findOne({ problem: problem._id, status: 'withdrawn' }).sort({ createdAt: -1 }),
    ProblemSubmission.exists({ problem: problem._id, status: 'pending' }),
  ])
  const reopen = withdrawn && !pending ? withdrawn : null
  const changes = [`restore ${problem.codigo} as ${status}`, ...(reopen ? [`put submission ${reopen._id} back in the review queue`] : [])]
  if (apply) {
    problem.set({ deletedAt: null, deletedBy: null, publicationStatus: status })
    await problem.save()
    await syncProblemExams(null, problem)
    if (reopen) {
      reopen.status = 'pending'
      await reopen.save()
    }
  }
  return { mode: apply ? 'applied' : 'dry-run', changes }
}
