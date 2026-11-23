import mongoose from 'mongoose'
import { writeFile } from 'node:fs/promises'
import { atlasUri } from './atlas.js'
import { contentId } from '../data/mvpManifest.js'
import { NEW_PROOF_TOPICS, PROBLEM_SUBTOPICS, REMOVE_PISO_FROM, REPLACE_NARROW_TOPICS, TEST_TOPIC_PREREQUISITES } from '../data/problemSubtopicRevisions.js'

// Dry run by default. Apply requires a new backup file and an explicit target.
async function run() {
  const [targetName, ...args] = process.argv.slice(2)
  if (!['test', 'prod'].includes(targetName) || args.some((x) => !['--apply'].includes(x))) throw new Error('Invalid arguments')
  const apply = args.includes('--apply')
  const { uri, dbName } = atlasUri(process.env, targetName)
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  const db = mongoose.connection.db
  if (db.databaseName !== dbName) throw new Error('Unexpected database')
  const problems = db.collection('problems')
  const topics = db.collection('topics')
  const allTopics = await topics.find({}).toArray()
  const bySlug = new Map(allTopics.map((t) => [t.slug, t]))
  const byId = new Map(allTopics.map((t) => [String(t._id), t]))
  const proof = bySlug.get('omm-proof')
  if (!proof) throw new Error('Missing proof area')
  const newTopics = NEW_PROOF_TOPICS.filter((t) => !bySlug.has(t.slug)).map((t) => ({ ...t, _id: new mongoose.Types.ObjectId(contentId('Topic', t.slug)), parent: proof._id }))
  if (targetName === 'test') for (const [rootSlug, name, slug] of TEST_TOPIC_PREREQUISITES) {
    if (bySlug.has(slug)) continue
    const root = bySlug.get(rootSlug)
    if (!root) throw new Error(`Missing topic ${rootSlug}`)
    newTopics.push({ name, slug, _id: new mongoose.Types.ObjectId(contentId('Topic', slug)), parent: root._id })
  }
  for (const topic of newTopics) bySlug.set(topic.slug, topic)
  for (const topic of NEW_PROOF_TOPICS) if (String(bySlug.get(topic.slug)?.parent) !== String(proof._id)) throw new Error(`Unexpected parent for ${topic.slug}`)
  const piso = bySlug.get('omm-algebra-piso')
  const codes = [...Object.keys(PROBLEM_SUBTOPICS), ...REMOVE_PISO_FROM, ...REPLACE_NARROW_TOPICS.map((item) => item.code)]
  const records = await problems.find({ codigo: { $in: codes } }).toArray()
  const found = new Map(records.map((p) => [p.codigo, p]))
  if (found.size !== records.length) throw new Error('Duplicate problem code')
  const changes = []
  for (const [code, slug] of Object.entries(PROBLEM_SUBTOPICS)) {
    const p = found.get(code)
    if (!p) continue
    const topic = bySlug.get(slug)
    if (!topic) throw new Error(`Missing topic ${slug}`)
    const root = byId.get(String(topic.parent))
    if (!root || root.name !== p.tema) throw new Error(`Area mismatch for ${code}`)
    const current = p.topics || []
    if (current.some((id) => byId.get(String(id))?.parent)) continue
    changes.push({ code, before: current, after: [...current, topic._id], id: p._id })
  }
  for (const code of REMOVE_PISO_FROM) {
    const p = found.get(code)
    if (!p || !piso || !(p.topics || []).some((id) => String(id) === String(piso._id))) continue
    const after = p.topics.filter((id) => String(id) !== String(piso._id))
    if (!after.some((id) => byId.get(String(id))?.parent)) throw new Error(`Removing Piso would leave ${code} without a subtopic`)
    changes.push({ code, before: p.topics, after, id: p._id })
  }
  for (const { code, from, to } of REPLACE_NARROW_TOPICS) {
    const p = found.get(code)
    const oldTopic = bySlug.get(from)
    const replacement = bySlug.get(to)
    if (!p || !oldTopic || !(p.topics || []).some((id) => String(id) === String(oldTopic._id))) continue
    if (!replacement || String(replacement.parent) !== String(oldTopic.parent)) throw new Error(`Unexpected parent for ${to}`)
    const replaced = p.topics.map((id) => String(id) === String(oldTopic._id) ? replacement._id : id)
    const after = replaced.filter((id, index) => replaced.findIndex((other) => String(other) === String(id)) === index)
    changes.push({ code, before: p.topics, after, id: p._id })
  }
  const missing = codes.filter((code) => !found.has(code))
  console.log(`${dbName}: ${changes.length} problem updates, ${newTopics.length} new topics, ${missing.length} absent codes`)
  if (targetName === 'prod' && missing.length) throw new Error('Production records missing; review the plan')
  if (!apply) { console.log('Dry run: nothing written.'); return }
  if (!process.env.PROBLEM_TOPIC_BACKUP || !process.env.PROBLEM_TOPIC_BACKUP.startsWith('/private/tmp/')) throw new Error('A backup path in /private/tmp/ is required')
  await writeFile(process.env.PROBLEM_TOPIC_BACKUP, JSON.stringify({ database: dbName, createdAt: new Date().toISOString(), records: records.filter((p) => changes.some((c) => String(c.id) === String(p._id))), newTopics }, null, 2), { flag: 'wx', mode: 0o600 })
  await mongoose.connection.transaction(async (session) => {
    if (newTopics.length) await topics.insertMany(newTopics.map((t) => ({ ...t, createdAt: new Date(), updatedAt: new Date() })), { session })
    for (const change of changes) {
      const result = await problems.updateOne({ _id: change.id, topics: { $eq: change.before } }, { $set: { topics: change.after, updatedAt: new Date() } }, { session })
      if (result.matchedCount !== 1) throw new Error(`Concurrent change to ${change.code}`)
    }
  })
  console.log('Applied atomically. Backup saved.')
}
run().catch((error) => {
  const safe = /^(Invalid arguments|Unexpected database|Missing proof area|Unexpected parent for |Duplicate problem code|Missing topic |Area mismatch for |Removing Piso would|Production records missing|A backup path|Concurrent change to )/.test(error.message)
  console.error(`Problem subtopic update stopped. ${safe ? error.message : 'Check the target and backup; connection details are not printed.'}`)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
