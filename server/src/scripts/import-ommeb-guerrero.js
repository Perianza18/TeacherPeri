// Adds the OMMEB Guerrero exams (server/src/data/ommebGuerrero) to a database
// that already has content. See server/src/lib/ommebImport.js.
//   MONGO_OMMEB_IMPORT_URI=<uri with /db> npm run content:import-ommeb-guerrero                → dry run
//   MONGO_OMMEB_IMPORT_URI=… OMMEB_IMPORT_CONFIRM=<db> npm run content:import-ommeb-guerrero -- --apply [--owner <username>]
// On Atlas: npm run atlas:import-ommeb:test (or :prod) [-- --apply].
// Never reads MONGO_URI and never prints the URI. The figures are stored as
// images owned by --owner (default: the oldest admin account).

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectTarget, explicitTarget } from '../lib/scriptTarget.js'
import { importOmmebGuerrero } from '../lib/ommebImport.js'

export function ommebImportTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_OMMEB_IMPORT_URI', confirmVar: 'OMMEB_IMPORT_CONFIRM', apply })
}

export function parseOmmebArgs(args) {
  let apply = false, dryRun = false, owner = null
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--apply') apply = true
    else if (args[i] === '--dry-run') dryRun = true
    else if (args[i] === '--owner' && /^[A-Za-z0-9_.-]{1,40}$/.test(args[i + 1] || '')) { owner = args[i + 1]; i += 1 }
    else throw Object.assign(new Error('Use --dry-run (default) or --apply, and optionally --owner <username>.'), { code: 'TARGET_ERROR' })
  }
  if (apply && dryRun) throw Object.assign(new Error('Use --dry-run (default) or --apply, not both.'), { code: 'TARGET_ERROR' })
  return { apply, owner }
}

export function ommebReport(dbName, result) {
  const done = result.applied
  const list = (codes) => (codes.length > 12 ? `${codes.slice(0, 12).join(', ')} … (+${codes.length - 12})` : codes.join(', ') || 'none')
  return [
    `OMMEB Guerrero · ${done ? 'applied' : 'dry-run'} · database: ${dbName}`,
    `  ${result.exams} exams, ${result.problems} problems in the transcription`,
    `  Folders ${done ? 'created' : 'to create'} (${result.foldersToCreate.length}): ${list(result.foldersToCreate)}`,
    `  Problems ${done ? 'created' : 'to create'} (${result.create.length}, with ${result.images} figures): ${list(result.create)}`,
    `  Problems already there (${result.keep.length})`,
    ...(result.differs.length ? [`  Problems that differ from the transcription, left as they are (${result.differs.length}):`, ...result.differs.map((d) => `    ${d.codigo}: ${d.fields.join(', ')}`)] : []),
    ...(done ? [`  Exams page: ${result.examChanges.length ? '' : 'nothing to change'}`, ...result.examChanges.map((c) => `    - ${c}`)] : ['  Each exam folder gets its exam on the Exámenes page when applied.', '  Nothing was written.']),
  ].join('\n')
}

async function run() {
  const { apply, owner } = parseOmmebArgs(process.argv.slice(2))
  const target = ommebImportTarget(process.env, apply)
  await connectTarget(mongoose, target)
  const result = await importOmmebGuerrero({ apply, owner })
  console.log(ommebReport(target.dbName, result))
}

if (process.argv[1]?.endsWith('/scripts/import-ommeb-guerrero.js')) run().catch((error) => {
  const safe = error.code === 'TARGET_ERROR' || /^(OMMEB_|CONTENT_)/.test(error.code || '')
  console.error(`OMMEB import stopped. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
