import 'dotenv/config'
import mongoose from 'mongoose'
import { reviseTheoryLessons } from '../migrations/revise-theory-lessons.js'
import { validateMvpContent } from '../data/validateMvpContent.js'

// Publishes the rewritten theory lessons to an existing database.
//   npm run content:revise-theory              → dry run (default): reports, writes nothing
//   npm run content:revise-theory -- --apply   → writes, in one transaction
//   ... --accept-live <slug>@<fingerprint>     → also replace one live-edited lesson,
//                                               only if it still holds the reviewed version
// The target is never read from MONGO_URI: MONGO_REVISION_URI must name the
// database in its path, and --apply also needs REVISION_DATABASE_CONFIRM set
// to that exact database name.
export function revisionTarget(env = process.env, apply = false) {
  const uri = env.MONGO_REVISION_URI
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri) || /[\s#]/.test(uri)) throw new Error('Set MONGO_REVISION_URI with an explicit database path.')
  const dbName = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)(?:\?.*)?$/.exec(uri)?.[1]
  if (!dbName || !/^[a-zA-Z0-9_-]+$/.test(dbName) || ['admin', 'local', 'config'].includes(dbName)) throw new Error('An explicit non-system database name is required.')
  if (/[?&]dbName=/i.test(uri)) throw new Error('Do not override the database with URI options.')
  if (apply && env.REVISION_DATABASE_CONFIRM !== dbName) throw new Error('REVISION_DATABASE_CONFIRM must equal the exact database name for --apply.')
  return { uri, dbName }
}

// --apply / --dry-run, and any number of --accept-live <slug>@<fingerprint>.
export function parseRevisionArgs(args) {
  const acceptLive = {}
  let apply = false, dryRun = false
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--apply') apply = true
    else if (args[i] === '--dry-run') dryRun = true
    else if (args[i] === '--accept-live' && /^[a-z0-9-]+@[0-9a-f]{12}$/.test(args[i + 1] || '')) { const [slug, print] = args[i + 1].split('@'); acceptLive[slug] = print; i += 1 }
    else throw new Error('Use --dry-run (default) or --apply, and optionally --accept-live <lesson-slug>@<fingerprint> for each live-edited lesson to replace.')
  }
  if (apply && dryRun) throw new Error('Use --dry-run (default) or --apply, not both.')
  return { apply, acceptLive }
}

export function report(mode, dbName, result) {
  const lines = [`Theory revision · ${mode} · database: ${dbName}`]
  const done = mode === 'applied'
  const word = { revise: done ? 'CHANGED' : 'WILL CHANGE', create: done ? 'CREATED' : 'WILL BE CREATED', promote: done ? 'PUBLISHED' : 'WILL BE PUBLISHED', overwrite: done ? 'REPLACED' : 'WILL BE REPLACED', keep: 'already up to date', skip: 'not touched' }
  for (const lesson of result.lessons) {
    const parts = [`text ${word[lesson.text]}`, `Ruta ${word[lesson.ruta]}`]
    if (lesson.steps.length) parts.push(`${lesson.steps.length} Steps ${word[lesson.steps[0]]}`)
    lines.push(`  ${lesson.kind === 'new' ? 'New lesson' : 'Lesson'} «${lesson.title}» (${lesson.slug}): ${parts.join('; ')}`)
    if (lesson.status === 'skipped' || lesson.status === 'accepted') {
      lines.push(`    ${lesson.status === 'skipped' ? 'SKIPPED: edited on the live site' : 'ACCEPTED: the reviewed live version is replaced'} · fingerprint ${lesson.fingerprint}`)
      for (const live of lesson.live) {
        const count = (n) => `${n} line${n === 1 ? '' : 's'}`
        lines.push(`    ${live.model}: ${count(live.changes.added)} only on the live site, ${count(live.changes.removed)} only in the version this revision expected`)
        for (const example of live.changes.examples) lines.push(`      ${example}`)
      }
      if (lesson.status === 'skipped') lines.push(`    To replace exactly this live version after reviewing it: --accept-live ${lesson.slug}@${lesson.fingerprint}`)
    }
  }
  if (result.groupsPublished.length) lines.push(`  Ruta groups ${done ? 'published' : 'to publish'}: ${result.groupsPublished.join(', ')}`)
  if (result.groupsSkipped.length) lines.push(`  Ruta groups not touched: ${result.groupsSkipped.join(', ')}`)
  lines.push(`  Problems ${done ? 'added' : 'to add'} (${result.problemsAdded.length}): ${result.problemsAdded.join(', ') || 'none'}`)
  if (result.problemsAlreadyThere.length) lines.push(`  Problems already there (${result.problemsAlreadyThere.length}): ${result.problemsAlreadyThere.join(', ')}`)
  if (result.problemsEditedLive.length) lines.push(`  Problems edited on the live site, left as they are (${result.problemsEditedLive.length}): ${result.problemsEditedLive.join(', ')}`)
  lines.push(`  Collections ${done ? 'created' : 'to create'} (${result.collectionsCreated.length}): ${result.collectionsCreated.join(', ') || 'none'}`)
  if (result.collectionsAlreadyThere.length) lines.push(`  Collections already there (${result.collectionsAlreadyThere.length}): ${result.collectionsAlreadyThere.join(', ')}`)
  if (result.collectionsEditedLive.length) lines.push(`  Collections edited on the live site, left as they are (${result.collectionsEditedLive.length}): ${result.collectionsEditedLive.join(', ')}`)
  if (mode === 'dry-run') lines.push('  Nothing was written.')
  return lines.join('\n')
}

async function run() {
  const { apply, acceptLive } = parseRevisionArgs(process.argv.slice(2))
  const target = revisionTarget(process.env, apply)
  validateMvpContent()
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  if (mongoose.connection.name !== target.dbName || mongoose.connection.db.databaseName !== target.dbName) throw new Error('Connected database does not match the explicit target.')
  const result = await reviseTheoryLessons({ apply, acceptLive })
  console.log(report(apply ? 'applied' : 'dry-run', target.dbName, result))
}

// Importing the guard for unit tests must not connect or write.
if (process.argv[1]?.endsWith('/scripts/revise-theory-lessons.js')) run().catch((error) => {
  // Conflicts name only content keys; connection errors could carry the URI, so they are not printed.
  const safe = ['THEORY_REVISION_CONFLICT', 'CONTENT_REPLICA_SET_REQUIRED'].includes(error.code) || /^(Set MONGO_REVISION_URI|An explicit|Do not override|REVISION_DATABASE_CONFIRM|Use --dry-run|Connected database)/.test(error.message)
  console.error(`Theory revision stopped. Nothing was written. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
