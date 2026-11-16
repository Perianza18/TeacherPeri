// Guard shared by the scripts that may run against Atlas (review, migration).
// Same rules as the content importer and the theory revision: the target is
// never read from MONGO_URI, the URI must name its database in the path, and
// writing (--apply) also needs <confirmVar> set to that exact database name.
// Error messages never contain the URI.
export class TargetError extends Error {
  constructor(message) {
    super(message)
    this.code = 'TARGET_ERROR'
  }
}

export function explicitTarget(env, { uriVar, confirmVar, apply = false }) {
  const uri = env[uriVar]
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri) || /[\s#]/.test(uri)) throw new TargetError(`Set ${uriVar} with an explicit database path.`)
  const dbName = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)(?:\?.*)?$/.exec(uri)?.[1]
  if (!dbName || !/^[a-zA-Z0-9_-]+$/.test(dbName) || ['admin', 'local', 'config'].includes(dbName)) throw new TargetError('An explicit non-system database name is required.')
  if (/[?&]dbName=/i.test(uri)) throw new TargetError('Do not override the database with URI options.')
  if (apply && env[confirmVar] !== dbName) throw new TargetError(`${confirmVar} must equal the exact database name for --apply.`)
  return { uri, dbName }
}

export async function connectTarget(mongoose, target) {
  await mongoose.connect(target.uri, { dbName: target.dbName, serverSelectionTimeoutMS: 10000, autoIndex: false, autoCreate: false })
  if (mongoose.connection.name !== target.dbName || mongoose.connection.db.databaseName !== target.dbName) throw new TargetError('Connected database does not match the explicit target.')
}
