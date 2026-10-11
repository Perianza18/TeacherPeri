import 'dotenv/config'
import mongoose from 'mongoose'
import { importTarget } from './import-mvp-content.js'

async function check() {
  const target = importTarget({ MONGO_CONTENT_IMPORT_URI: process.env.MONGO_URI })
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 5000, autoCreate: false, autoIndex: false })
  const db = mongoose.connection.db
  const hello = await db.admin().command({ hello: 1 })
  const root = await db.collection('paths').findOne({ slug: 'preparacion-para-la-omm' }, { projection: { publicationStatus: 1 } })
  console.log(JSON.stringify({ database: target.dbName, atomicImportSupported: Boolean(hello.setName || hello.msg === 'isdbgrid'), ommRoot: root?.publicationStatus || 'missing' }))
  if (!root || root.publicationStatus !== 'published') {
    console.log('OMM is not published in the database used by the API. A dry-run only previews changes. Follow docs/LOCAL_MVP.md to apply content.')
    process.exitCode = 1
  } else {
    console.log('Published OMM root found. Restart the API after any .env change and open http://localhost:5173/rutas/preparacion-para-la-omm. Check that the frontend uses your local API on port 4000.')
  }
  if (!hello.setName && hello.msg !== 'isdbgrid') console.log('This MongoDB is standalone. Atomic import needs a replica set; npm run db:local:start prepares an isolated local instance.')
  if (process.env.MONGO_CONTENT_IMPORT_URI && process.env.MONGO_CONTENT_IMPORT_URI !== process.env.MONGO_URI) {
    console.log('MONGO_URI and MONGO_CONTENT_IMPORT_URI differ. Verify that the API and importer point to the same host and database; credentials are not displayed.')
  }
}

check().catch(() => {
  console.error('Cannot check application content. Set an explicit MONGO_URI in your private .env and ensure MongoDB is running. Credentials are not displayed.')
  process.exitCode = 1
}).finally(() => mongoose.disconnect())
