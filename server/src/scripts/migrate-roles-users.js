// Runs server/src/migrations/migrate-roles-users.js against an explicit database.
//   MONGO_MIGRATION_TARGET_URI=<uri with /teacherperi> npm run db:migrate:roles-users            → dry run
//   MONGO_MIGRATION_TARGET_URI=… MIGRATION_TARGET_CONFIRM=teacherperi npm run db:migrate:roles-users -- --apply
// Never reads MONGO_URI and never prints the URI.

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectTarget, explicitTarget } from '../lib/scriptTarget.js'
import { migrateRolesUsers } from '../migrations/migrate-roles-users.js'

export function migrationTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_MIGRATION_TARGET_URI', confirmVar: 'MIGRATION_TARGET_CONFIRM', apply })
}

async function run() {
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || (args.includes('--apply') && args.includes('--dry-run'))) throw Object.assign(new Error('Use --dry-run (default) or --apply.'), { code: 'TARGET_ERROR' })
  const apply = args.includes('--apply')
  const target = migrationTarget(process.env, apply)
  await connectTarget(mongoose, target)
  const result = await migrateRolesUsers({ apply })
  console.log([`Roles and exam folders migration · ${result.mode} · database: ${target.dbName}`, ...(result.changes.length ? result.changes.map((c) => `  - ${c}`) : ['  Nothing to change.']), ...(apply ? [] : ['  Nothing was written.'])].join('\n'))
}

if (process.argv[1]?.endsWith('/scripts/migrate-roles-users.js')) run().catch((error) => {
  const safe = error.code === 'TARGET_ERROR'
  console.error(`Migration stopped. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
