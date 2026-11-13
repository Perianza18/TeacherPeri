import { describe, it, expect } from 'vitest'
import { DEFAULT_ROLE, ROLES, roleOf } from '../lib/permissions.js'

describe('roles', () => {
  it('lista los seis roles de menos a más poder', () => {
    expect(ROLES).toEqual(['usuario', 'moderador', 'editor_junior', 'editor_senior', 'admin', 'teacherperi'])
    expect(DEFAULT_ROLE).toBe('usuario')
  })

  it('trata una cuenta sin rol guardado (o con uno desconocido) como usuario', () => {
    expect(roleOf({})).toBe('usuario')
    expect(roleOf(null)).toBe('usuario')
    expect(roleOf({ role: 'superusuario' })).toBe('usuario')
    expect(roleOf({ role: 'moderador' })).toBe('moderador')
  })
})
