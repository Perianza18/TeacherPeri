import { describe, expect, it } from 'vitest'
import {
  assertVerifiedDatabase,
  developmentResetTarget,
  testDatabaseTarget,
} from '../database-safety.js'

function testTarget(uri) {
  return testDatabaseTarget({ NODE_ENV: 'test', MONGO_TEST_URI: uri })
}

function developmentEnv(overrides = {}) {
  return {
    NODE_ENV: 'development',
    MONGO_DEV_RESET_URI: 'mongodb://127.0.0.1:27017/teacherperi_dev',
    RESET_DATABASE_CONFIRM: 'teacherperi_dev',
    ...overrides,
  }
}

// A plain object, not a Mongoose client: these tests never connect to MongoDB.
function connectedDatabase(target) {
  return {
    readyState: 1,
    name: target.dbName,
    db: { databaseName: target.dbName },
    host: target.hostname,
    port: target.port,
    getClient: () => ({
      options: {
        dbName: target.dbName,
        directConnection: true,
        hosts: [{ host: target.hostname, port: target.port }],
      },
    }),
  }
}

describe('disposable test database policy', () => {
  it('defaults only an unset URI to the explicitly disposable local test database', () => {
    const target = testDatabaseTarget({ NODE_ENV: 'test', MONGO_URI: 'mongodb://remote/production' })
    expect(target.uri).toBe('mongodb://127.0.0.1:27017/teacherperi_test')
    expect(target.dbName).toBe('teacherperi_test')
    expect(target.connectionOptions).toMatchObject({ dbName: target.dbName, directConnection: true })
  })

  it.each([
    'mongodb://127.0.0.1:27018/teacherperi_test_ci',
    'mongodb://localhost/teacherperi_test',
    'mongodb://[::1]:27019/teacherperi_test_2026_09',
    'mongodb://test_user:test_password@localhost/teacherperi_test?authSource=admin',
  ])('permits a single explicit local disposable target: %s', (uri) => {
    expect(testTarget(uri).dbName).toMatch(/^teacherperi_test/)
  })

  it.each([undefined, '', 'development', 'production', 'TEST'])('refuses NODE_ENV=%s', (NODE_ENV) => {
    expect(() => testDatabaseTarget({ NODE_ENV })).toThrow('NODE_ENV=test')
  })

  it.each([
    '',
    'mongodb://localhost/teacherperi',
    'mongodb://localhost/teacherperi_dev',
    'mongodb://localhost/axioma_test',
    'mongodb://localhost/admin',
    'mongodb://localhost/local',
    'mongodb://localhost/config',
    'mongodb://localhost/test',
    'mongodb://localhost/teacherperi_testbackup',
    'mongodb://localhost/teacherperi_test_',
    'mongodb://localhost/teacherperi_test_CI',
    `mongodb://localhost/teacherperi_test_${'x'.repeat(50)}`,
    'mongodb://localhost',
    'mongodb://localhost/',
    'mongodb://localhost/teacherperi_test/other',
    'mongodb://localhost/real/../teacherperi_test',
    'mongodb://localhost/%74eacherperi_test',
    'mongodb://localhost/teacherperi_test%2fproduction',
    'mongodb://localhost/teacherperi_test#production',
    'mongodb://localhost/teacherperi_test?dbName=production',
    'mongodb://localhost/teacherperi_test?DBNAME=production',
    'mongodb://localhost/teacherperi_test?%64bName=production',
    'mongodb://localhost/teacherperi_test?authSource=admin&dbName=production',
    'mongodb://localhost/teacherperi_test?authSource=admin&authSource=other',
    'mongodb://localhost/teacherperi_test?authSource=',
    'mongodb://localhost/teacherperi_test?directConnection=false',
    'mongodb://localhost/teacherperi_test?replicaSet=production',
    'mongodb://localhost/teacherperi_test?proxyHost=remote.example',
    'mongodb://remote.example/teacherperi_test',
    'mongodb+srv://localhost/teacherperi_test',
    'mongodb://localhost,remote.example/teacherperi_test',
    'mongodb://localhost,127.0.0.1/teacherperi_test',
    'mongodb://localhost.example/teacherperi_test',
    'mongodb://127.1/teacherperi_test',
    'mongodb://0.0.0.0/teacherperi_test',
    'mongodb://%2Ftmp%2Fmongodb.sock/teacherperi_test',
    'mongodb://localhost:0/teacherperi_test',
    'mongodb://localhost:65536/teacherperi_test',
    'mongodb://localhost:abc/teacherperi_test',
    ' mongodb://localhost/teacherperi_test',
    'mongodb://local\nhost/teacherperi_test',
    'mongodb://localhost\\remote/teacherperi_test',
    'not a MongoDB URI',
    null,
    42,
  ])('fails closed for unsafe or ambiguous URI: %s', (uri) => {
    expect(() => testTarget(uri)).toThrow('Database safety check failed')
  })

  it('does not disclose URI credentials in validation errors', () => {
    try {
      testTarget('mongodb://private_user:private_password@remote.example/teacherperi_test')
      throw new Error('Expected the guard to reject this URI')
    } catch (error) {
      expect(error.message).toContain('Database safety check failed')
      expect(error.message).not.toContain('private_user')
      expect(error.message).not.toContain('private_password')
    }
  })
})

describe('explicit development reset policy', () => {
  it('requires a separate local development target and its exact-name confirmation', () => {
    const target = developmentResetTarget(developmentEnv({
      MONGO_DEV_RESET_URI: 'mongodb://127.0.0.1:27018/teacherperi_dev_preview',
      RESET_DATABASE_CONFIRM: 'teacherperi_dev_preview',
    }))
    expect(target.dbName).toBe('teacherperi_dev_preview')
    expect(target.port).toBe(27018)
  })

  it('never falls back to the application database or an implicit reset target', () => {
    expect(() => developmentResetTarget(developmentEnv({
      MONGO_DEV_RESET_URI: undefined,
      MONGO_URI: 'mongodb://127.0.0.1/teacherperi_dev',
    }))).toThrow('explicit MongoDB URI')
  })

  it.each([
    { NODE_ENV: undefined },
    { NODE_ENV: 'test' },
    { NODE_ENV: 'production' },
    { RESET_DATABASE_CONFIRM: undefined },
    { RESET_DATABASE_CONFIRM: 'yes' },
    { RESET_DATABASE_CONFIRM: 'teacherperi_dev_other' },
    { MONGO_DEV_RESET_URI: '' },
    { MONGO_DEV_RESET_URI: 'mongodb://localhost/teacherperi' },
    { MONGO_DEV_RESET_URI: 'mongodb://localhost/teacherperi_test' },
    { MONGO_DEV_RESET_URI: 'mongodb://remote.example/teacherperi_dev' },
    { MONGO_DEV_RESET_URI: 'mongodb://localhost/teacherperi_dev?dbName=production' },
  ])('refuses incomplete or unsafe reset configuration: %j', (overrides) => {
    expect(() => developmentResetTarget(developmentEnv(overrides))).toThrow('Database safety check failed')
  })
})

describe('active connection verification before deletion', () => {
  const target = testTarget('mongodb://127.0.0.1:27018/teacherperi_test_verification')

  it('accepts the matching connected database and direct local client', () => {
    expect(() => assertVerifiedDatabase(connectedDatabase(target), target)).not.toThrow()
  })

  it.each([
    { readyState: 0 },
    { readyState: 2 },
    { name: 'production' },
    { db: { databaseName: 'production' } },
    { db: undefined },
    { host: 'remote.example' },
    { port: 27017 },
    { getClient: () => ({ options: { dbName: 'production' } }) },
    { getClient: () => ({ options: { directConnection: false } }) },
  ])('refuses cleanup when connection state no longer matches: %j', (overrides) => {
    expect(() => assertVerifiedDatabase({ ...connectedDatabase(target), ...overrides }, target))
      .toThrow('Database safety check failed')
  })

  it.each([
    { dbName: 'production' },
    { directConnection: false },
    { hosts: [{ host: 'remote.example', port: target.port }] },
    { hosts: [{ host: target.hostname, port: 27017 }] },
    { hosts: [{ host: target.hostname, port: target.port }, { host: 'remote.example', port: 27017 }] },
    { hosts: [] },
  ])('refuses a client pointing elsewhere despite a matching connection name: %j', (overrides) => {
    const connection = connectedDatabase(target)
    const options = connection.getClient().options
    connection.getClient = () => ({ options: { ...options, ...overrides } })
    expect(() => assertVerifiedDatabase(connection, target)).toThrow('Database safety check failed')
  })
})
