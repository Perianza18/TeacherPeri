// ---------------------------------------------------------------------------
// Community problem submissions: reading a proposal from a request, filling in
// the Problem fields that the author does not choose, and describing a
// person's own submissions. Used by the submissions API and the review tools.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import ProblemSubmission from '../models/ProblemSubmission.js'
import Tag from '../models/Tag.js'
import Topic from '../models/Topic.js'
import { publishedOrLegacyProblemQuery } from '../models/content.js'
import { examPathLabel, folderPath } from './examFolders.js'
import { parseImageList } from './images.js'

const MAX_TERMS = 10
const isId = (value) => typeof value === 'string' && mongoose.isObjectIdOrHexString(value)
const unique = (values) => [...new Set(values.map(String))]

// Only these fields are read from the browser; anything else in the body
// (publicationStatus, status, author, codigo…) is ignored.
export function parseProposal(body = {}) {
  const enunciado = typeof body.enunciado === 'string' ? body.enunciado.replace(/\r\n/g, '\n').trim() : ''
  const ids = (value, label) => {
    if (value === undefined || value === null) return []
    if (!Array.isArray(value) || value.some((id) => !isId(id))) return { error: `La lista de ${label} no es válida.` }
    const list = unique(value)
    if (list.length > MAX_TERMS) return { error: `Elige como máximo ${MAX_TERMS} ${label}.` }
    return list
  }
  const topics = ids(body.topics, 'áreas')
  if (topics.error) return topics
  const tags = ids(body.tags, 'etiquetas')
  if (tags.error) return tags
  const isExam = body.isExam === true
  let examFolder = null
  let problemNumber = null
  if (isExam) {
    if (body.examFolder != null && !isId(body.examFolder)) return { error: 'La carpeta de examen no es válida.' }
    examFolder = body.examFolder ?? null
    if (body.problemNumber !== undefined && body.problemNumber !== null && body.problemNumber !== '') {
      const number = Number(body.problemNumber)
      if (!Number.isInteger(number) || number < 1 || number > 999) return { error: 'El número de problema debe ser un entero entre 1 y 999.' }
      problemNumber = number
    }
  }
  const images = parseImageList(body.images)
  if (images.error) return images
  return { proposal: { enunciado, topics, tags, isExam, examFolder, problemNumber, images: images.images } }
}

export async function vocabulary() {
  const [topics, tags] = await Promise.all([Topic.find().lean(), Tag.find().lean()])
  return {
    topics: new Map(topics.map((topic) => [String(topic._id), topic])),
    tags: new Map(tags.map((tag) => [String(tag._id), tag])),
  }
}

// Statements to compare against when the AUTHOR saves: public problems plus
// their own. (The admin review compares against every problem.)
export async function comparableProblemsFor(userId, exceptProblemId = null) {
  const filter = { $or: [publishedOrLegacyProblemQuery(), { author: userId, deletedAt: null }] }
  if (exceptProblemId) filter._id = { $ne: exceptProblemId }
  return Problem.find(filter).select('codigo enunciado').lean()
}

const YEAR = /^(19|20)\d{2}$/

// The Problem fields an author does not pick. `folders` must contain the exam
// folder and its ancestors. `current` is the live Problem when editing.
export function derivedProblemFields(proposal, { folders, topics, current = null, now = new Date() }) {
  const path = proposal.isExam && proposal.examFolder ? examPathLabel(proposal.examFolder, folders) : []
  const year = [...path].reverse().find((name) => YEAR.test(name)) || String(now.getFullYear())
  const firstTopic = proposal.topics.map((id) => topics.get(String(id))).find(Boolean)
  const keptCategories = (current?.categories || []).filter((id) => {
    const folder = (folders instanceof Map ? folders : new Map(folders.map((f) => [String(f._id), f]))).get(String(id))
    return folder ? folder.kind !== 'exam' : true
  }).map(String)
  return {
    titulo: proposal.isExam && path.length
      ? `${path.join(' · ')}${proposal.problemNumber ? ` · Problema ${proposal.problemNumber}` : ''}`
      : 'Problema propuesto',
    año: year,
    tema: firstTopic?.name || 'Por clasificar',
    tipo: proposal.isExam ? 'Examen' : 'Comunidad',
    competition: proposal.isExam && path.length ? path[0] : null,
    problemNumber: proposal.isExam ? proposal.problemNumber : null,
    categories: unique([...keptCategories, ...(proposal.isExam && proposal.examFolder ? [proposal.examFolder] : [])]),
  }
}

// Next readable code for a community problem: U-00001, U-00002, …
export async function nextCommunityCode() {
  const last = await Problem.findOne({ codigo: /^U-\d{5,}$/ }).sort({ codigo: -1 }).select('codigo').lean()
  const next = last ? Number(last.codigo.slice(2)) + 1 : 1
  return `U-${String(next).padStart(5, '0')}`
}

// The proposal a Problem currently represents (what the edit form starts from
// when nothing is pending).
export function proposalFromProblem(problem, folders) {
  const byId = folders instanceof Map ? folders : new Map(folders.map((f) => [String(f._id), f]))
  const examFolder = (problem.categories || []).map(String).find((id) => byId.get(id)?.kind === 'exam') || null
  return {
    enunciado: problem.enunciado,
    topics: (problem.topics || []).map(String),
    tags: (problem.tags || []).map(String),
    isExam: Boolean(examFolder),
    examFolder,
    problemNumber: examFolder ? problem.problemNumber ?? null : null,
    images: statementImages(problem.images),
  }
}

// The statement pictures of a problem or proposal, as plain values.
export function statementImages(images = []) {
  return (images || []).filter((entry) => (entry.placement ?? 'statement') === 'statement').map((entry) => ({ image: String(entry.image), alt: entry.alt, placement: 'statement' }))
}

// What the author sees in «Mis envíos».
//   pending            → new problem, waiting for review
//   rejected           → new problem, rejected (reason shown)
//   published          → live, nothing waiting
//   published-pending  → live, a change is waiting for review
//   published-rejected → live, the last change was rejected
export function submissionState(problem, latest) {
  if (problem.publicationStatus === 'published') {
    if (latest?.status === 'pending') return 'published-pending'
    if (latest?.status === 'rejected' && latest.kind === 'edit') return 'published-rejected'
    return 'published'
  }
  if (latest?.status === 'rejected') return 'rejected'
  return 'pending'
}

export async function ownSubmissionViews(userId, problemIds = null) {
  const filter = { author: userId, deletedAt: null }
  if (problemIds) filter._id = { $in: problemIds }
  const problems = await Problem.find(filter).sort({ updatedAt: -1 }).lean()
  if (!problems.length) return []
  const [submissions, folders, { topics, tags }] = await Promise.all([
    ProblemSubmission.find({ problem: { $in: problems.map((p) => p._id) }, status: { $in: ['pending', 'approved', 'rejected'] } }).sort({ createdAt: -1 }).lean(),
    Category.find({ kind: 'exam' }).lean(),
    vocabulary(),
  ])
  const latestByProblem = new Map()
  for (const submission of submissions) if (!latestByProblem.has(String(submission.problem))) latestByProblem.set(String(submission.problem), submission)
  const byId = new Map(folders.map((folder) => [String(folder._id), folder]))
  return problems.map((problem) => {
    const latest = latestByProblem.get(String(problem._id)) || null
    const pending = latest?.status === 'pending' ? latest : null
    const live = proposalFromProblem(problem, byId)
    const proposal = pending ? { ...pending.proposed, topics: pending.proposed.topics.map(String), tags: pending.proposed.tags.map(String), examFolder: pending.proposed.examFolder ? String(pending.proposed.examFolder) : null, images: statementImages(pending.proposed.images) } : live
    const folder = proposal.examFolder ? byId.get(String(proposal.examFolder)) : null
    return {
      _id: problem._id,
      codigo: problem.codigo,
      titulo: problem.titulo,
      state: submissionState(problem, latest),
      isPublic: problem.publicationStatus === 'published',
      enunciado: problem.enunciado,
      proposal,
      examFolderPath: folder ? folderPath(folder._id, byId) : [],
      examFolderPending: folder?.reviewStatus === 'pending',
      topics: proposal.topics.map((id) => topics.get(id)).filter(Boolean).map((t) => ({ _id: t._id, name: t.name })),
      tags: proposal.tags.map((id) => tags.get(id)).filter(Boolean).map((t) => ({ _id: t._id, label: t.label })),
      latest: latest ? { kind: latest.kind, status: latest.status, reason: latest.reason, reviewedAt: latest.reviewedAt, createdAt: latest.createdAt, checks: latest.checks } : null,
      createdAt: problem.createdAt,
      updatedAt: problem.updatedAt,
    }
  })
}

export function sameProposal(a, b) {
  const sorted = (list) => [...(list || [])].map(String).sort().join(',')
  return a.enunciado === b.enunciado && sorted(a.topics) === sorted(b.topics) && sorted(a.tags) === sorted(b.tags) &&
    Boolean(a.isExam) === Boolean(b.isExam) && String(a.examFolder ?? '') === String(b.examFolder ?? '') && (a.problemNumber ?? null) === (b.problemNumber ?? null) &&
    JSON.stringify(statementImages(a.images)) === JSON.stringify(statementImages(b.images))
}
