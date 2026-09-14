// Additive, repeatable local-development migration. It preserves each
// legacy Problem's stable identity and copies its single legacy category into
// the new many-to-many categories field. It never deletes or reseeds data.
import 'dotenv/config'
import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import { assertVerifiedDatabase, developmentMigrationTarget } from '../database-safety.js'

async function backfillProblemCategories() {
  const target = developmentMigrationTarget()
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)

  const cursor = Problem.find({ category: { $exists: true, $ne: null } })
    .select('_id category categories')
    .cursor()
  let updated = 0
  for await (const problem of cursor) {
    if (problem.categories.some((category) => category.equals(problem.category))) continue
    await Problem.updateOne({ _id: problem._id }, { $addToSet: { categories: problem.category } })
    updated += 1
  }
  console.log(`Backfilled category memberships for ${updated} problem(s) in ${target.dbName}.`)
}

backfillProblemCategories()
  .catch((error) => {
    console.error('Problem category backfill failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => mongoose.disconnect())
