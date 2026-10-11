import mongoose from 'mongoose'
import { mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createServer } from 'node:net'

// Dedicated loopback instance: never reconfigure the user's existing MongoDB.
const directory = resolve(dirname(fileURLToPath(import.meta.url)), '../../..', '.local/mongodb')
const port = 27018
const replicaSet = 'teacherperiLocal'
const uri = `mongodb://127.0.0.1:${port}/teacherperi_dev?directConnection=true`

async function portIsFree() {
  const server = createServer()
  return new Promise((accept, reject) => {
    server.once('error', (error) => error.code === 'EADDRINUSE' ? accept(false) : reject(error))
    server.listen(port, '127.0.0.1', () => server.close(() => accept(true)))
  })
}

async function start() {
  if (await portIsFree()) {
    await mkdir(directory, { recursive: true })
    const result = spawnSync('mongod', [
      '--replSet', replicaSet, '--bind_ip', '127.0.0.1', '--port', String(port),
      '--dbpath', directory, '--logpath', resolve(directory, 'mongod.log'), '--fork',
    ], { encoding: 'utf8', timeout: 20000 })
    if (result.error?.code === 'ENOENT') throw new Error('mongod is not in PATH. Use your existing MongoDB installation (on macOS, open a terminal with Homebrew in PATH).')
    if (result.error || result.status !== 0) throw new Error('Local MongoDB could not start. Inspect .local/mongodb/mongod.log; the existing instance on port 27017 was not changed.')
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, autoCreate: false, autoIndex: false })
  const admin = mongoose.connection.db.admin()
  const config = await admin.command({ getCmdLineOpts: 1 })
  const options = config.parsed
  if (resolve(options.storage?.dbPath || '') !== directory || (options.replication?.replSetName || options.replication?.replSet) !== replicaSet || options.net?.bindIp !== '127.0.0.1') {
    throw new Error('Port 27018 belongs to a different MongoDB configuration. Refusing to initialize or change it.')
  }
  try {
    await admin.command({ replSetGetStatus: 1 })
  } catch (error) {
    if (error.code !== 94) throw error
    await admin.command({ replSetInitiate: { _id: replicaSet, members: [{ _id: 0, host: `127.0.0.1:${port}` }] } })
  }
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    const hello = await admin.command({ hello: 1 })
    if (hello.isWritablePrimary && hello.setName === replicaSet) {
      console.log('Local replica set ready (persistent data in .local/mongodb). Existing MongoDB on port 27017 is unchanged.')
      console.log(`Set MONGO_URI and MONGO_CONTENT_IMPORT_URI in your private .env to: ${uri}`)
      console.log('Next: npm run content:import -- --dry-run, then CONTENT_IMPORT_CONFIRM=teacherperi_dev npm run content:import -- --apply. See docs/LOCAL_MVP.md.')
      return
    }
    await new Promise((accept) => setTimeout(accept, 250))
  }
  throw new Error('Local replica set has not elected a primary yet. Inspect .local/mongodb/mongod.log and rerun this command.')
}

start().catch((error) => {
  // Driver errors are never printed; they may contain connection details.
  console.error(error instanceof mongoose.mongo.MongoError ? 'Cannot inspect the local replica set. Check port 27018 and .local/mongodb/mongod.log.' : error.message)
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
