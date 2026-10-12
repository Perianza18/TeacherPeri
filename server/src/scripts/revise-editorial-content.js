import 'dotenv/config'
import mongoose from 'mongoose'
import Theory from '../models/Theory.js'
import { importTarget } from './import-mvp-content.js'
import { MVP_LESSONS, PREVIOUS_EDITORIAL_THEORY } from '../data/mvpLessons.js'
import { validateMvpContent } from '../data/validateMvpContent.js'

// Only exact known article text can be revised. Never overwrites independent edits.
async function run() {
  const args = process.argv.slice(2)
  if (args.some((arg) => !['--apply', '--dry-run'].includes(arg)) || args.length > 1) throw new Error('Use --dry-run or --apply.')
  const apply = args.includes('--apply')
  const { uri, dbName } = importTarget(process.env, apply)
  validateMvpContent()
  await mongoose.connect(uri, { dbName, autoIndex: false, autoCreate: false, serverSelectionTimeoutMS: 10000 })
  const revisions = MVP_LESSONS.filter((lesson) => lesson.theory.engagement)
  async function plan(session) {
    const changes = []
    for (const { theory } of revisions) {
      const found = await Theory.find({ title: theory.title }).session(session || null).lean()
      if (found.length !== 1) throw new Error('Missing or ambiguous lesson; import the base content first.')
      const current = found[0]
      if (current.content === theory.content && current.engagement === theory.engagement) continue
      const previous = PREVIOUS_EDITORIAL_THEORY[theory.key]
      if (current.content !== previous.content || current.engagement != null) throw new Error('Independent editorial changes detected; no lessons changed.')
      changes.push({ current, theory })
    }
    return changes
  }
  const preview = await plan()
  if (apply && preview.length) {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 })
    if (!hello.setName && hello.msg !== 'isdbgrid') throw new Error('Replica set required.')
    await mongoose.connection.transaction(async (session) => {
      for (const { current, theory } of await plan(session)) {
        const result = await Theory.updateOne({ _id: current._id, content: current.content, engagement: null }, { $set: { content: theory.content, engagement: theory.engagement } }, { session, runValidators: true })
        if (result.modifiedCount !== 1) throw new Error('Concurrent edit detected; transaction cancelled.')
      }
    })
  }
  console.log(JSON.stringify({ mode: apply ? 'applied' : 'dry-run', database: dbName, revise: preview.length, keep: revisions.length - preview.length }))
}
run().catch(() => {
  console.error('Editorial revision stopped. Check connectivity, explicit target, and exact baseline content. No credentials are logged; no partial revision is committed.')
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
