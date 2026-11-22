// Backfill: gives every exam folder that holds published problems its Exam on
// the Exámenes page, and brings existing folder exams up to date
// (server/src/lib/examSync.js). Safe to run again: a second run changes nothing.
//   MONGO_EXAM_SYNC_URI=<uri with /teacherperi> npm run db:sync:exam-folders            → dry run
//   MONGO_EXAM_SYNC_URI=… EXAM_SYNC_CONFIRM=teacherperi npm run db:sync:exam-folders -- --apply
// On Atlas: npm run atlas:sync-exams:test (or :prod) [-- --apply].
// Never reads MONGO_URI and never prints the URI.

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectTarget, explicitTarget } from '../lib/scriptTarget.js'
import { syncAllFolderExams } from '../lib/examSync.js'

export function examSyncTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_EXAM_SYNC_URI', confirmVar: 'EXAM_SYNC_CONFIRM', apply })
}

async function run() {
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || (args.includes('--apply') && args.includes('--dry-run'))) throw Object.assign(new Error('Use --dry-run (default) or --apply.'), { code: 'TARGET_ERROR' })
  const apply = args.includes('--apply')
  const target = examSyncTarget(process.env, apply)
  await connectTarget(mongoose, target)
  const changes = await syncAllFolderExams({ apply })
  console.log([
    `Exam folders → Exámenes page · ${apply ? 'applied' : 'dry-run'} · database: ${target.dbName}`,
    ...(changes.length ? changes.map((c) => `  - ${c}`) : ['  Nothing to change.']),
    ...(apply ? [] : ['  Nothing was written.']),
  ].join('\n'))
}

if (process.argv[1]?.endsWith('/scripts/sync-exam-folders.js')) run().catch((error) => {
  const safe = error.code === 'TARGET_ERROR'
  console.error(`Exam sync stopped. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
