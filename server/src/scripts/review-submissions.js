// ---------------------------------------------------------------------------
// Daily review of community submissions (procedure: docs/SUBMISSIONS.md).
//
//   npm run review -- list                       pending problems, pending folders, open flags
//   npm run review -- show <id|U-00001>          one submission in full (with the diff for edits)
//   npm run review -- approve <id> --as <editor or admin> [--topics "Álgebra,Geometría"] [--tags "Paridad"]
//        [--folder "OMM › 2024" | --not-exam] [--number 3] [--title "…"] [--difficulty basico]
//        [--attribution "…"]
//   npm run review -- reject <id> --as <editor or admin> --reason "…"
//   npm run review -- folders | approve-folder <id|path> | reject-folder <id|path> --reason "…"
//        | rename-folder <id|path> --name "…"
//   npm run review -- flags [--status open] | resolve-flag <id> [--note "…"] | dismiss-flag <id> [--note "…"]
//   npm run review -- deleted | restore <id|U-00001>
//
// Reading commands never write. Changing commands are a DRY RUN by default
// (also with --dry-run) and print exactly what would change. --apply writes,
// and needs REVIEW_DATABASE_CONFIRM=<database name>. The target comes only
// from MONGO_REVIEW_URI (never MONGO_URI), which must name the database.
// Add --json for machine-readable output.
// ---------------------------------------------------------------------------

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectTarget, explicitTarget } from '../lib/scriptTarget.js'
import {
  ReviewError, approveFolder, approveSubmission, findReviewer, listDeleted, listFlags, listPending,
  rejectFolder, rejectSubmission, renameFolder, restoreProblem, setFlagStatus, showSubmission,
} from '../lib/review/service.js'

const READ_COMMANDS = ['list', 'show', 'folders', 'flags', 'deleted']
const WRITE_COMMANDS = ['approve', 'reject', 'approve-folder', 'reject-folder', 'rename-folder', 'resolve-flag', 'dismiss-flag', 'restore']
const NEEDS_REF = ['show', ...WRITE_COMMANDS]
const VALUE_OPTIONS = ['as', 'reason', 'topics', 'tags', 'folder', 'number', 'title', 'difficulty', 'attribution', 'name', 'note', 'status']
const FLAG_OPTIONS = ['apply', 'dry-run', 'json', 'not-exam']

export function reviewTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_REVIEW_URI', confirmVar: 'REVIEW_DATABASE_CONFIRM', apply })
}

function fail(message) {
  return new ReviewError(message)
}

export function parseReviewArgs(argv) {
  const [command, ...rest] = argv
  if (![...READ_COMMANDS, ...WRITE_COMMANDS].includes(command)) throw fail(`Unknown command «${command ?? ''}». Use one of: ${[...READ_COMMANDS, ...WRITE_COMMANDS].join(', ')}.`)
  const args = { command, ref: null, options: {}, apply: false, json: false }
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i]
    if (arg.startsWith('--')) {
      const name = arg.slice(2)
      if (FLAG_OPTIONS.includes(name)) { args.options[name] = true; continue }
      if (!VALUE_OPTIONS.includes(name)) throw fail(`Unknown option ${arg}.`)
      const value = rest[i + 1]
      if (value === undefined || value.startsWith('--')) throw fail(`${arg} needs a value.`)
      args.options[name] = value
      i += 1
    } else if (!args.ref) args.ref = arg
    else throw fail(`Unexpected argument «${arg}».`)
  }
  if (args.options.apply && args.options['dry-run']) throw fail('Use --dry-run (default) or --apply, not both.')
  if (args.options.apply && READ_COMMANDS.includes(command)) throw fail(`«${command}» only reads; --apply does nothing here.`)
  if (NEEDS_REF.includes(command) && !args.ref) throw fail(`«${command}» needs an id (or a code like U-00001).`)
  args.apply = Boolean(args.options.apply)
  args.json = Boolean(args.options.json)
  return args
}

const list = (value) => value.split(',').map((item) => item.trim()).filter(Boolean)

export function fixesFrom(options) {
  const fixes = {}
  if (options.topics) fixes.topics = list(options.topics)
  if (options.tags !== undefined) fixes.tags = list(options.tags)
  if (options.folder && options['not-exam']) throw fail('Use --folder or --not-exam, not both.')
  if (options.folder) fixes.folder = options.folder
  if (options['not-exam']) fixes.notExam = true
  if (options.number !== undefined) {
    const number = Number(options.number)
    if (!Number.isInteger(number) || number < 1 || number > 999) throw fail('--number must be an integer from 1 to 999.')
    fixes.number = number
  }
  if (options.title) fixes.title = options.title
  if (options.difficulty) fixes.difficulty = options.difficulty
  if (options.attribution) fixes.attribution = options.attribution
  return fixes
}

// --- text output -----------------------------------------------------------------

function findingLines(findings = []) {
  if (!findings.length) return ['    checks: all clear']
  return findings.map((f) => `    ${f.level.toUpperCase()} ${f.code}: ${f.message}`)
}

function indent(text, prefix = '      ') {
  return String(text).split('\n').map((line) => `${prefix}${line}`).join('\n')
}

function proposalLines(p) {
  return [
    `    areas: ${p.topics.join(', ') || '(none)'} · tags: ${p.tags.join(', ') || '(none)'}`,
    `    exam: ${p.isExam ? `${p.examFolder ?? '(no folder)'}${p.examFolderStatus && p.examFolderStatus !== 'approved' ? ` [folder ${p.examFolderStatus}]` : ''}${p.problemNumber ? ` · problem ${p.problemNumber}` : ''}` : 'no'}`,
    ...(p.images?.length ? [`    images: ${p.images.map((image) => `${image.url} («${image.alt}»)`).join(' · ')}`] : []),
    '    statement:',
    indent(p.enunciado),
  ]
}

export function formatResult(command, result) {
  if (command === 'list') {
    const lines = [`Pending submissions: ${result.submissions.length} · pending folders: ${result.folders.length} · open flags: ${result.openFlags}`]
    for (const s of result.submissions) lines.push('', `[${s.id}] ${s.codigo} · ${s.kind === 'edit' ? 'EDIT of a published problem' : 'new problem'} · by ${s.author} · ${new Date(s.createdAt).toISOString().slice(0, 16).replace('T', ' ')}`, ...proposalLines(s), ...findingLines(s.findings))
    if (result.folders.length) lines.push('', 'Pending folders:', ...result.folders.map((f) => `  [${f.id}] ${f.path} · by ${f.createdBy} · used by ${f.pendingSubmissions} pending submission(s)`))
    return lines.join('\n')
  }
  if (command === 'show') {
    const lines = [`[${result.id}] ${result.codigo} · ${result.kind} · status ${result.status}${result.reason ? ` (${result.reason})` : ''} · by ${result.author}`, 'PROPOSED', ...proposalLines(result.proposed)]
    if (result.live) lines.push('LIVE (published now)', ...proposalLines(result.live), `CHANGED: ${result.changedFields.join(', ') || 'nothing'}`)
    lines.push(...findingLines(result.findings))
    return lines.join('\n')
  }
  if (command === 'folders') return result.folders.length ? result.folders.map((f) => `[${f.id}] ${f.path} · by ${f.createdBy} · used by ${f.pendingSubmissions}`).join('\n') : 'No pending folders.'
  if (command === 'flags') return result.length ? result.map((f) => `[${f.id}] ${f.targetType} ${f.targetName} · by ${f.reporter} · ${new Date(f.createdAt).toISOString().slice(0, 10)}\n${indent(f.message)}`).join('\n\n') : 'No flags with that status.'
  if (command === 'deleted') return result.length ? result.map((p) => `[${p.id}] ${p.codigo} «${p.titulo}» · author ${p.author} · deleted by ${p.deletedBy} on ${new Date(p.deletedAt).toISOString().slice(0, 10)}${p.wasPublished ? ' · was published' : ''}`).join('\n') : 'No deleted problems.'
  const lines = [`${result.mode === 'applied' ? 'APPLIED' : 'DRY RUN (nothing written; add --apply to write)'}`, ...result.changes.map((change) => `  - ${change}`)]
  if (result.findings?.length) lines.push(...findingLines(result.findings))
  return lines.join('\n')
}

// --- run -------------------------------------------------------------------------

export async function runReviewCommand(args) {
  const { command, ref, options, apply } = args
  if (command === 'list') return listPending()
  if (command === 'show') return showSubmission(ref)
  if (command === 'folders') return listPending()
  if (command === 'flags') return listFlags(options.status || 'open')
  if (command === 'deleted') return listDeleted()
  const reviewer = await findReviewer(options.as)
  if (command === 'approve') return approveSubmission({ ref, reviewer, fixes: fixesFrom(options), apply })
  if (command === 'reject') return rejectSubmission({ ref, reviewer, reason: options.reason, apply })
  if (command === 'approve-folder') return approveFolder({ ref, reviewer, apply })
  if (command === 'reject-folder') return rejectFolder({ ref, reviewer, reason: options.reason, apply })
  if (command === 'rename-folder') return renameFolder({ ref, reviewer, name: options.name, apply })
  if (command === 'resolve-flag' || command === 'dismiss-flag') return setFlagStatus({ ref, reviewer, status: command === 'resolve-flag' ? 'resolved' : 'dismissed', note: options.note, apply })
  if (command === 'restore') return restoreProblem({ ref, reviewer, apply })
  throw fail(`Unknown command ${command}.`)
}

async function run() {
  const args = parseReviewArgs(process.argv.slice(2))
  const target = reviewTarget(process.env, args.apply)
  await connectTarget(mongoose, target)
  const result = await runReviewCommand(args)
  console.log(args.json ? JSON.stringify({ database: target.dbName, command: args.command, result }, null, 2) : `Database: ${target.dbName}\n${formatResult(args.command, result)}`)
}

// Importing this file in tests must not connect or write.
if (process.argv[1]?.endsWith('/scripts/review-submissions.js')) run().catch((error) => {
  const safe = ['REVIEW_ERROR', 'TARGET_ERROR'].includes(error.code) || error.name === 'ValidationError'
  console.error(`Review stopped. Nothing was written. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  if (error.findings?.length) console.error(findingLines(error.findings).join('\n'))
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
