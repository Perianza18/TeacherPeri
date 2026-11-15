import 'dotenv/config'
import mongoose from 'mongoose'
import { reviseTheoryLessons } from '../migrations/revise-theory-lessons.js'
import { validateMvpContent } from '../data/validateMvpContent.js'

// Publishes the rewritten theory lessons to an existing database.
//   npm run content:revise-theory              → dry run (default): reports, writes nothing
//   npm run content:revise-theory -- --apply   → writes, in one transaction
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

function report(mode, dbName, result) {
  const lines = [`Theory revision · ${mode} · database: ${dbName}`]
  const change = mode === 'applied' ? 'CHANGED' : 'WILL CHANGE'
  for (const lesson of result.lessons) lines.push(`  Lesson «${lesson.title}»: text ${lesson.text === 'revise' ? change : 'already up to date'}; Ruta description ${lesson.ruta === 'revise' ? change : 'already up to date'}`)
  lines.push(`  Problems ${mode === 'applied' ? 'added' : 'to add'} (${result.problemsAdded.length}): ${result.problemsAdded.join(', ') || 'none'}`)
  if (result.problemsAlreadyThere.length) lines.push(`  Problems already there (${result.problemsAlreadyThere.length}): ${result.problemsAlreadyThere.join(', ')}`)
  lines.push(`  Collections ${mode === 'applied' ? 'created' : 'to create'} (${result.collectionsCreated.length}): ${result.collectionsCreated.join(', ') || 'none'}`)
  if (result.collectionsAlreadyThere.length) lines.push(`  Collections already there (${result.collectionsAlreadyThere.length}): ${result.collectionsAlreadyThere.join(', ')}`)
  if (mode === 'dry-run') lines.push('  Nothing was written.')
  return lines.join('\n')
}

async function run() {
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || (args.includes('--apply') && args.includes('--dry-run'))) throw new Error('Use --dry-run (default) or --apply.')
  const apply = args.includes('--apply')
  const target = revisionTarget(process.env, apply)
  validateMvpContent()
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  if (mongoose.connection.name !== target.dbName || mongoose.connection.db.databaseName !== target.dbName) throw new Error('Connected database does not match the explicit target.')
  const result = await reviseTheoryLessons({ apply })
  console.log(report(apply ? 'applied' : 'dry-run', target.dbName, result))
}

// Importing the guard for unit tests must not connect or write.
if (process.argv[1]?.endsWith('/scripts/revise-theory-lessons.js')) run().catch((error) => {
  // Conflicts name only content keys; connection errors could carry the URI, so they are not printed.
  const safe = ['THEORY_REVISION_CONFLICT', 'CONTENT_REPLICA_SET_REQUIRED'].includes(error.code) || /^(Set MONGO_REVISION_URI|An explicit|Do not override|REVISION_DATABASE_CONFIRM|Use --dry-run|Connected database)/.test(error.message)
  console.error(`Theory revision stopped. Nothing was written. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
