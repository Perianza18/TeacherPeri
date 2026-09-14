// Each integration-test file uses a verified disposable local database.
// Unit tests have a separate config and never import this setup file.
import { beforeAll, afterAll, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { assertVerifiedDatabase, testDatabaseTarget } from './database-safety.js'

process.env.JWT_SECRET = 'clave-de-prueba-no-usar-en-produccion'

// Validate before registering hooks or opening any connection. Never load the
// application's MONGO_URI from .env for tests.
const target = testDatabaseTarget()
let verified = false

beforeAll(async () => {
  await mongoose.connect(target.uri, target.connectionOptions)
  assertVerifiedDatabase(mongoose.connection, target)
  verified = true
})

afterEach(async () => {
  if (!verified) return
  assertVerifiedDatabase(mongoose.connection, target)
  const collections = mongoose.connection.collections
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})))
})

afterAll(async () => {
  try {
    // A failed setup must never trigger cleanup against an unverified target.
    if (verified) {
      assertVerifiedDatabase(mongoose.connection, target)
      await mongoose.connection.dropDatabase()
    }
  } finally {
    verified = false
    await mongoose.disconnect()
  }
})
