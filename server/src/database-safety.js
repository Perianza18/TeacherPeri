// These policies are for disposable local databases only, never migrations.
// Keep validation database-free so a rejected target cannot cause a connection.
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])
const DEFAULT_TEST_URI = 'mongodb://127.0.0.1:27017/teacherperi_test'

function reject(reason) {
  throw new Error(`Database safety check failed: ${reason}`)
}

function localDatabaseTarget(uri, prefix) {
  if (typeof uri !== 'string' || uri.length === 0) {
    reject('an explicit MongoDB URI is required.')
  }
  // WHATWG URL parsing normalizes some invalid input. Reject it before parsing
  // so the MongoDB driver cannot interpret a different target from our guard.
  if (/[\s\\#]/u.test(uri) || !uri.startsWith('mongodb://')) {
    reject('use a mongodb:// URI without whitespace, backslashes, or fragments.')
  }
  const parts = /^mongodb:\/\/([^/?#]+)(\/[^?#]*)(?:\?[^#]*)?$/.exec(uri)
  if (!parts) reject('the URI must contain an explicit database path.')

  let parsed
  try {
    parsed = new URL(uri)
  } catch {
    reject('the MongoDB URI is malformed.')
  }
  if (parts[2] !== parsed.pathname) reject('the database path must not require normalization.')

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '')
  if (!LOCAL_HOSTS.has(hostname)) {
    reject('only a single loopback host (127.0.0.1, localhost, or ::1) is allowed.')
  }
  const port = parsed.port ? Number(parsed.port) : 27017
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    reject('the MongoDB port is invalid.')
  }

  // Use a literal, unencoded database path. No default database, extra path,
  // percent-decoding, or query parameter may choose the deletion target.
  const dbName = parsed.pathname.slice(1)
  const allowedName = new RegExp(`^${prefix}(?:_[a-z0-9]+)*$`)
  if (!allowedName.test(dbName) || dbName.length > 63) {
    reject(`the database must be named ${prefix} or ${prefix}_<lowercase_suffix>.`)
  }

  // Local authenticated development can use authSource. Reject every other
  // option, including dbName, replicaSet, proxyHost, and directConnection=false.
  const options = [...parsed.searchParams.entries()]
  if (options.length > 1 || options.some(([key, value]) =>
    key !== 'authSource' || !/^[a-zA-Z0-9_-]+$/.test(value))) {
    reject('only one optional authSource query parameter is allowed.')
  }

  return Object.freeze({
    uri,
    dbName,
    hostname,
    port,
    connectionOptions: Object.freeze({
      dbName,
      // Prevent a local replica member from discovering and writing remotely.
      directConnection: true,
      serverSelectionTimeoutMS: 5000,
    }),
  })
}

export function testDatabaseTarget(env = process.env) {
  if (env.NODE_ENV !== 'test') reject('database tests require NODE_ENV=test.')
  // An unset variable may use this explicitly disposable local database; an
  // explicitly empty/malformed value must fail rather than silently fall back.
  const uri = env.MONGO_TEST_URI === undefined ? DEFAULT_TEST_URI : env.MONGO_TEST_URI
  return localDatabaseTarget(uri, 'teacherperi_test')
}

export function developmentResetTarget(env = process.env) {
  if (env.NODE_ENV !== 'development') {
    reject('development reset requires NODE_ENV=development.')
  }
  // Deliberately never read MONGO_URI or supply a reset default.
  const target = localDatabaseTarget(env.MONGO_DEV_RESET_URI, 'teacherperi_dev')
  if (env.RESET_DATABASE_CONFIRM !== target.dbName) {
    reject('RESET_DATABASE_CONFIRM must exactly equal the development database name.')
  }
  return target
}

export function assertVerifiedDatabase(connection, target) {
  if (connection.readyState !== 1 ||
      connection.name !== target.dbName ||
      connection.db?.databaseName !== target.dbName) {
    reject('the active connection is not the verified database; refusing deletion.')
  }

  const clientOptions = connection.getClient()?.options
  const hosts = clientOptions?.hosts
  if (clientOptions?.directConnection !== true ||
      clientOptions.dbName !== target.dbName ||
      !Array.isArray(hosts) || hosts.length !== 1 ||
      hosts[0].host !== target.hostname || hosts[0].port !== target.port ||
      connection.host !== target.hostname || connection.port !== target.port) {
    reject('the active MongoDB client does not match the verified local target.')
  }
}
