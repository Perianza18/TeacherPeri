import 'dotenv/config'
import mongoose from 'mongoose'
import { importMvpContent } from '../migrations/import-mvp-content.js'
import { validateMvpContent } from '../data/validateMvpContent.js'

// This is an additive transaction, not a reset. No fallback to application URI.
export function importTarget(env = process.env, apply = false) {
  const uri = env.MONGO_CONTENT_IMPORT_URI
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri) || /[\s#]/.test(uri)) throw new Error('Set an explicit MONGO_CONTENT_IMPORT_URI with a database path.')
  const path = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)(?:\?.*)?$/.exec(uri)
  const dbName = path?.[1]
  if (!dbName || !/^[a-zA-Z0-9_-]+$/.test(dbName) || ['admin', 'local', 'config'].includes(dbName)) throw new Error('An explicit non-system database name is required.')
  if (/[?&]dbName=/i.test(uri)) throw new Error('Do not override the database with URI options.')
  if (apply && env.CONTENT_IMPORT_CONFIRM !== dbName) throw new Error('CONTENT_IMPORT_CONFIRM must equal the exact database name for --apply.')
  return { uri, dbName }
}

async function run() {
  validateMvpContent()
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || args.includes('--apply') && args.includes('--dry-run')) throw new Error('Use --dry-run (default) or --apply.')
  const apply = args.includes('--apply')
  const target = importTarget(process.env, apply)
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  if (mongoose.connection.name !== target.dbName || mongoose.connection.db.databaseName !== target.dbName) throw new Error('Connected database does not match the explicit import target.')
  const result = await importMvpContent({ apply })
  console.log(JSON.stringify({ mode: apply ? 'applied' : 'dry-run', database: target.dbName, ...result }))
}

// Importing the guard for unit tests must not connect or mutate.
if (process.argv[1]?.endsWith('/scripts/import-mvp-content.js')) run().catch(() => {
  console.error('Content import failed. Check the explicit target, replica-set support, and content conflicts; credentials are never logged.')
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
