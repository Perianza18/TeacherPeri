import { describe, it, expect } from 'vitest'
import { atlasUri, databaseOf, toolEnv } from '../scripts/atlas.js'

const test = 'mongodb+srv://usuario:secreto@cluster.example.net/teacherperi?retryWrites=true'
const prod = 'mongodb+srv://usuario:secreto@cluster.example.net/teacherperi_prod?retryWrites=true'

describe('atlas wrapper', () => {
  it('reads the database name from the path', () => {
    expect(databaseOf(test)).toBe('teacherperi')
    expect(databaseOf('mongodb+srv://u:p@c.net/?x=1')).toBeNull()
  })

  it('each target needs the string that names its own database', () => {
    expect(atlasUri({ ATLAS_TEST_URI: test }, 'test').dbName).toBe('teacherperi')
    expect(atlasUri({ ATLAS_PROD_URI: prod }, 'prod').dbName).toBe('teacherperi_prod')
    expect(() => atlasUri({ ATLAS_TEST_URI: prod }, 'test')).toThrow(/must end in \/teacherperi/)
    expect(() => atlasUri({ ATLAS_PROD_URI: test }, 'prod')).toThrow(/teacherperi_prod/)
    expect(() => atlasUri({}, 'prod')).toThrow(/ATLAS_PROD_URI is missing/)
    expect(() => atlasUri({ ATLAS_TEST_URI: test }, 'staging')).toThrow(/test or prod/)
  })

  it('accepts an older single ATLAS_URI line and points it at the target database', () => {
    const old = 'mongodb+srv://usuario:secreto@cluster.example.net/?retryWrites=true'
    expect(atlasUri({ ATLAS_URI: old }, 'prod').uri).toBe(prod)
  })

  it('errors never show the string', () => {
    try { atlasUri({ ATLAS_TEST_URI: prod }, 'test') } catch (error) { expect(error.message).not.toContain('secreto') }
  })

  it('passes the string through the tool variable and confirms only with --apply', () => {
    const dry = toolEnv({ ATLAS_TEST_URI: test, PATH: '/bin' }, 'test', 'migrate', [])
    expect(dry.env.MONGO_MIGRATION_TARGET_URI).toBe(test)
    expect(dry.env.MIGRATION_TARGET_CONFIRM).toBe('')
    expect(dry.env.ATLAS_TEST_URI).toBeUndefined()
    const apply = toolEnv({ ATLAS_PROD_URI: prod }, 'prod', 'review', ['approve', 'U-00001', '--apply'])
    expect(apply.env.REVIEW_DATABASE_CONFIRM).toBe('teacherperi_prod')
    expect(() => toolEnv({ ATLAS_TEST_URI: test }, 'test', 'drop', [])).toThrow(/Unknown tool/)
  })
})
