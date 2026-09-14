// DESTRUCTIVE DEVELOPMENT RESET — npm run db:reset:dev, never a migration.
// Replaces category/problem IDs using the existing problem fixture. Only an
// explicitly confirmed local teacherperi_dev database may be reset. Refuses
// databases containing comments so legacy discussion history is preserved.
import 'dotenv/config'
import mongoose from 'mongoose'
import Category from './models/Category.js'
import Problem from './models/Problem.js'
import Comment from './models/Comment.js'
import { categorias, problemas } from './data/problemasReales.js'
import { assertVerifiedDatabase, developmentResetTarget } from './database-safety.js'

async function resetDevelopmentDatabase() {
  const target = developmentResetTarget()
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)

  if (await Comment.exists({})) {
    throw new Error('Development reset refused: comments exist. Preserve their history and use a new disposable development database.')
  }
  // Reset is only for an offline disposable development database. Users and
  // contact messages remain; comments are never deleted by this command.
  assertVerifiedDatabase(mongoose.connection, target)
  await Category.deleteMany({})
  assertVerifiedDatabase(mongoose.connection, target)
  await Problem.deleteMany({})

  // Las carpetas están en orden padre-antes-que-hijo dentro del archivo de
  // datos, así que creándolas en ese mismo orden garantiza que, cuando le
  // toca a una subcarpeta, su padre ya tiene un _id real que podemos usar.
  const idPorKey = new Map()
  for (const c of categorias) {
    const doc = await Category.create({
      name: c.name,
      parent: c.parent ? idPorKey.get(c.parent) : null,
    })
    idPorKey.set(c.key, doc._id)
  }

  await Problem.insertMany(
    problemas.map(({ categoriaKey, ...resto }) => ({
      ...resto,
      category: idPorKey.get(categoriaKey),
    })),
  )

  console.log(`Development reset of ${target.dbName}: ${categorias.length} categorías y ${problemas.length} problemas creados.`)
}

resetDevelopmentDatabase()
  .catch((err) => {
    console.error('Development reset failed:', err.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
