// Runs one guarded database script against one Atlas database, reading the
// connection strings from a private file that is never printed:
//
//   npm run atlas:<tool>:<test|prod> [-- <arguments>]
//
// The npm scripts start Node with --env-file=$HOME/.config/teacherperi/atlas.env,
// which holds two lines:
//   ATLAS_TEST_URI=mongodb+srv://…/teacherperi?…        (test database)
//   ATLAS_PROD_URI=mongodb+srv://…/teacherperi_prod?…   (live database)
//
// Every tool is a dry run unless «--apply» is passed. This wrapper only checks
// that each string names the database its target expects, then hands the
// string to the tool through the tool's own variable. The tool keeps all of its
// own checks. Nothing here prints a connection string.
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const TARGETS = {
  test: { envVar: 'ATLAS_TEST_URI', dbName: 'teacherperi' },
  prod: { envVar: 'ATLAS_PROD_URI', dbName: 'teacherperi_prod' },
}

export const TOOLS = {
  migrate: { script: 'migrate-roles-users.js', uriVar: 'MONGO_MIGRATION_TARGET_URI', confirmVar: 'MIGRATION_TARGET_CONFIRM' },
  review: { script: 'review-submissions.js', uriVar: 'MONGO_REVIEW_URI', confirmVar: 'REVIEW_DATABASE_CONFIRM' },
  'set-role': { script: 'promote-user.js', uriVar: 'MONGO_ROLE_URI', confirmVar: 'ROLE_CHANGE_CONFIRM' },
  'revise-theory': { script: 'revise-theory-lessons.js', uriVar: 'MONGO_REVISION_URI', confirmVar: 'REVISION_DATABASE_CONFIRM' },
  import: { script: 'import-mvp-content.js', uriVar: 'MONGO_CONTENT_IMPORT_URI', confirmVar: 'CONTENT_IMPORT_CONFIRM' },
  'sync-exams': { script: 'sync-exam-folders.js', uriVar: 'MONGO_EXAM_SYNC_URI', confirmVar: 'EXAM_SYNC_CONFIRM' },
  'import-ommeb': { script: 'import-ommeb-guerrero.js', uriVar: 'MONGO_OMMEB_IMPORT_URI', confirmVar: 'OMMEB_IMPORT_CONFIRM' },
  'import-exams': { script: 'import-exam-problems.js', uriVar: 'MONGO_EXAM_IMPORT_URI', confirmVar: 'EXAM_IMPORT_CONFIRM' },
}

export class AtlasError extends Error {}

const ATLAS_VARS = ['ATLAS_TEST_URI', 'ATLAS_PROD_URI', 'ATLAS_URI']

// Database name in the path of a MongoDB URI, or null.
export function databaseOf(uri) {
  return /^mongodb(?:\+srv)?:\/\/[^/?]+\/([^?]+)(?:\?.*)?$/.exec(uri ?? '')?.[1] ?? null
}

// Picks the string for a target. Falls back to an older single ATLAS_URI line
// (any database path), replacing its path with the target database.
export function atlasUri(env, targetName) {
  const target = TARGETS[targetName]
  if (!target) throw new AtlasError(`First word must be ${Object.keys(TARGETS).join(' or ')}.`)
  let uri = env[target.envVar]
  if (!uri && env.ATLAS_URI) {
    const m = /^(mongodb(?:\+srv)?:\/\/[^/?]+)(\/[^?]*)?(\?.*)?$/.exec(env.ATLAS_URI)
    if (m) uri = `${m[1]}/${target.dbName}${m[3] ?? ''}`
  }
  if (!uri) throw new AtlasError(`${target.envVar} is missing from ~/.config/teacherperi/atlas.env.`)
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri) || /\s/.test(uri)) throw new AtlasError(`${target.envVar} does not look like a MongoDB connection string.`)
  const dbName = databaseOf(uri)
  if (dbName !== target.dbName) throw new AtlasError(`${target.envVar} must end in /${target.dbName} (before any «?»). It names ${dbName ? `«${dbName}»` : 'no database'}.`)
  return { uri, dbName }
}

// Builds the child process environment for one run.
export function toolEnv(env, targetName, toolName, args) {
  const tool = TOOLS[toolName]
  if (!tool) throw new AtlasError(`Unknown tool «${toolName ?? ''}». Use one of: ${Object.keys(TOOLS).join(', ')}.`)
  const { uri, dbName } = atlasUri(env, targetName)
  const apply = args.includes('--apply')
  const childEnv = { ...env, [tool.uriVar]: uri, [tool.confirmVar]: apply ? dbName : '' }
  for (const name of ATLAS_VARS) delete childEnv[name]
  return { tool, dbName, apply, env: childEnv }
}

function run() {
  const [targetName, toolName, ...args] = process.argv.slice(2)
  const { tool, dbName, apply, env } = toolEnv(process.env, targetName, toolName, args)
  console.log(`Atlas · ${toolName} · database ${dbName} · ${apply ? 'APPLY (writes)' : 'dry run or read only'}`)
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), tool.script)
  const child = spawn(process.execPath, [script, ...args], { env, stdio: 'inherit' })
  child.on('exit', (code) => { process.exitCode = code ?? 1 })
}

if (process.argv[1]?.endsWith('/scripts/atlas.js')) {
  try { run() } catch (error) {
    console.error(`Stopped before connecting. ${error instanceof AtlasError ? error.message : 'Unexpected error.'}`)
    process.exitCode = 1
  }
}
