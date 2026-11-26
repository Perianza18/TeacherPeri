// Adds a transcribed exam collection (server/src/data/examCollections.js) to a
// database that already has content. See server/src/lib/transcribedExams.js.
//   MONGO_TRANSCRIBED_IMPORT_URI=<uri with /db> npm run content:import-transcribed -- <collection>              → dry run
//   ... TRANSCRIBED_IMPORT_CONFIRM=<db> npm run content:import-transcribed -- <collection> --apply [--owner <username>]
// Collections: ommeb-guerrero, examenes-entrenamiento.
// On Atlas: npm run atlas:import-transcribed:test (or :prod) -- <collection> [--apply].
// Never reads MONGO_URI and never prints the URI.

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectTarget, explicitTarget } from '../lib/scriptTarget.js'
import { COLLECTIONS, importCollection } from '../lib/transcribedExams.js'

export function transcribedImportTarget(env = process.env, apply = false) {
  return explicitTarget(env, { uriVar: 'MONGO_TRANSCRIBED_IMPORT_URI', confirmVar: 'TRANSCRIBED_IMPORT_CONFIRM', apply })
}

const usage = () => Object.assign(new Error(`Give a collection (${Object.keys(COLLECTIONS).join(', ')}), then --dry-run (default) or --apply, and optionally --owner <username>.`), { code: 'TARGET_ERROR' })

export function parseTranscribedArgs(args) {
  let apply = false, dryRun = false, owner = null, collection = null
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--apply') apply = true
    else if (args[i] === '--dry-run') dryRun = true
    else if (args[i] === '--owner' && /^[A-Za-z0-9_.-]{1,40}$/.test(args[i + 1] || '')) { owner = args[i + 1]; i += 1 }
    else if (!collection && COLLECTIONS[args[i]]) collection = args[i]
    else throw usage()
  }
  if (!collection || (apply && dryRun)) throw usage()
  return { collection, apply, owner }
}

export function importReport(name, dbName, result) {
  const done = result.applied
  const list = (codes) => (codes.length > 12 ? `${codes.slice(0, 12).join(', ')} … (+${codes.length - 12})` : codes.join(', ') || 'none')
  return [
    `${name} · ${done ? 'applied' : 'dry-run'} · database: ${dbName}`,
    `  ${result.exams} exams, ${result.problems} problems in the transcription`,
    `  Folders ${done ? 'created' : 'to create'} (${result.foldersToCreate.length}): ${list(result.foldersToCreate)}`,
    `  Problems ${done ? 'created' : 'to create'} (${result.create.length}, with ${result.images} figures): ${list(result.create)}`,
    `  Problems already there (${result.keep.length})`,
    ...(result.differs.length ? [`  Problems that differ from the transcription, left as they are (${result.differs.length}):`, ...result.differs.map((d) => `    ${d.codigo}: ${d.fields.join(', ')}`)] : []),
    ...(done ? [`  Exams page: ${result.examChanges.length ? '' : 'nothing to change'}`, ...result.examChanges.map((c) => `    - ${c}`)] : ['  Each exam folder gets its exam on the Exámenes page when applied.', '  Nothing was written.']),
  ].join('\n')
}

async function run() {
  const { collection, apply, owner } = parseTranscribedArgs(process.argv.slice(2))
  const target = transcribedImportTarget(process.env, apply)
  await connectTarget(mongoose, target)
  const result = await importCollection(COLLECTIONS[collection], { apply, owner })
  console.log(importReport(COLLECTIONS[collection].name, target.dbName, result))
}

if (process.argv[1]?.endsWith('/scripts/import-transcribed-exams.js')) run().catch((error) => {
  const safe = error.code === 'TARGET_ERROR' || /^(TRANSCRIBED_|CONTENT_)/.test(error.code || '')
  console.error(`Import stopped. ${safe ? error.message : 'Check the connection and the target database; credentials are never printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
