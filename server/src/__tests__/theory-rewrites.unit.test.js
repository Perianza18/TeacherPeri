import { describe, expect, it } from 'vitest'
import { decide } from '../migrations/revise-theory-lessons.js'
import { revisionTarget } from '../scripts/revise-theory-lessons.js'

describe('Theory revision guard', () => {
  it('needs an explicit target and the exact database name to apply', () => {
    expect(() => revisionTarget({ MONGO_URI: 'mongodb://localhost/teacherperi' })).toThrow('MONGO_REVISION_URI')
    expect(revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi' }).dbName).toBe('teacherperi')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi' }, true)).toThrow('REVISION_DATABASE_CONFIRM')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi_prod', REVISION_DATABASE_CONFIRM: 'teacherperi' }, true)).toThrow('REVISION_DATABASE_CONFIRM')
    expect(revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi_prod', REVISION_DATABASE_CONFIRM: 'teacherperi_prod' }, true).dbName).toBe('teacherperi_prod')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/admin' })).toThrow('non-system')
    expect(() => revisionTarget({ MONGO_REVISION_URI: 'mongodb://localhost/teacherperi?dbName=other' })).toThrow('override')
  })

  it('changes only the exact previous text', () => {
    const desired = [['content', 'nuevo']]
    const previous = [['content', 'viejo']]
    expect(decide({ content: 'nuevo' }, desired, previous)).toBe('keep')
    expect(decide({ content: 'viejo' }, desired, previous)).toBe('revise')
    expect(decide({ content: 'viejo con un cambio' }, desired, previous)).toBeNull()
  })
})
