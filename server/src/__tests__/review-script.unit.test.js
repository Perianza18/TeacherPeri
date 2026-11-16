import { describe, it, expect } from 'vitest'
import { fixesFrom, formatResult, parseReviewArgs, reviewTarget } from '../scripts/review-submissions.js'
import { migrationTarget } from '../scripts/migrate-roles-users.js'
import { examFolderNames } from '../migrations/migrate-roles-users.js'

const uri = 'mongodb+srv://usuario:secreto@cluster.example.net/teacherperi_prod?retryWrites=true'

describe('review target', () => {
  it('needs its own URI with a database, never MONGO_URI', () => {
    expect(() => reviewTarget({ MONGO_URI: uri })).toThrow(/MONGO_REVIEW_URI/)
    expect(() => reviewTarget({ MONGO_REVIEW_URI: 'mongodb://127.0.0.1:27017' })).toThrow(/database name/)
    expect(reviewTarget({ MONGO_REVIEW_URI: uri })).toEqual({ uri, dbName: 'teacherperi_prod' })
  })

  it('--apply needs the exact database name confirmed, and errors never show the URI', () => {
    expect(() => reviewTarget({ MONGO_REVIEW_URI: uri }, true)).toThrow(/REVIEW_DATABASE_CONFIRM/)
    expect(() => reviewTarget({ MONGO_REVIEW_URI: uri, REVIEW_DATABASE_CONFIRM: 'teacherperi' }, true)).toThrow(/REVIEW_DATABASE_CONFIRM/)
    expect(reviewTarget({ MONGO_REVIEW_URI: uri, REVIEW_DATABASE_CONFIRM: 'teacherperi_prod' }, true).dbName).toBe('teacherperi_prod')
    try { reviewTarget({ MONGO_REVIEW_URI: uri }, true) } catch (error) { expect(error.message).not.toContain('secreto') }
  })

  it('the migration uses its own variables', () => {
    expect(() => migrationTarget({ MONGO_REVIEW_URI: uri })).toThrow(/MONGO_MIGRATION_TARGET_URI/)
    expect(() => migrationTarget({ MONGO_MIGRATION_TARGET_URI: uri }, true)).toThrow(/MIGRATION_TARGET_CONFIRM/)
    expect(migrationTarget({ MONGO_MIGRATION_TARGET_URI: uri, MIGRATION_TARGET_CONFIRM: 'teacherperi_prod' }, true).dbName).toBe('teacherperi_prod')
  })
})

describe('review arguments', () => {
  it('reads a command, a reference and options; dry run by default', () => {
    expect(parseReviewArgs(['list'])).toMatchObject({ command: 'list', apply: false })
    const args = parseReviewArgs(['approve', 'U-00001', '--as', 'E_perianza', '--topics', 'Álgebra, Geometría', '--folder', 'OMM › 2024', '--number', '3'])
    expect(args).toMatchObject({ command: 'approve', ref: 'U-00001', apply: false, options: { as: 'E_perianza' } })
    expect(fixesFrom(args.options)).toEqual({ topics: ['Álgebra', 'Geometría'], folder: 'OMM › 2024', number: 3 })
    expect(parseReviewArgs(['reject', 'U-00001', '--reason', 'Duplicado', '--apply']).apply).toBe(true)
  })

  it('refuses unknown commands and options, missing values and mixed modes', () => {
    expect(() => parseReviewArgs(['borrar'])).toThrow(/Unknown command/)
    expect(() => parseReviewArgs(['approve'])).toThrow(/needs an id/)
    expect(() => parseReviewArgs(['approve', 'x', '--force'])).toThrow(/Unknown option/)
    expect(() => parseReviewArgs(['reject', 'x', '--reason'])).toThrow(/needs a value/)
    expect(() => parseReviewArgs(['approve', 'x', '--apply', '--dry-run'])).toThrow(/not both/)
    expect(() => parseReviewArgs(['list', '--apply'])).toThrow(/only reads/)
    expect(() => fixesFrom({ folder: 'OMM', 'not-exam': true })).toThrow(/not both/)
    expect(() => fixesFrom({ number: '0' })).toThrow(/--number/)
  })

  it('prints a dry run clearly', () => {
    const text = formatResult('approve', { mode: 'dry-run', changes: ['publish U-00001 «Problema propuesto»'], findings: [] })
    expect(text).toContain('DRY RUN')
    expect(text).toContain('publish U-00001')
  })
})

describe('migration folder names', () => {
  it('puts TeacherPeri practice exams under «Prácticas TeacherPeri»', () => {
    expect(examFolderNames({ competition: 'TeacherPeri', year: '2026', round: 'Ciclo 1 · Práctica A' })).toEqual(['Prácticas TeacherPeri', 'Ciclo 1 · Práctica A'])
    expect(examFolderNames({ competition: 'OMM', year: '2024', round: 'Concurso nacional' })).toEqual(['OMM', '2024', 'Concurso nacional'])
  })
})
