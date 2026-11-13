import { describe, it, expect } from 'vitest'
import { DEFAULT_ROLE, PERMISSIONS, ROLES, can, canAssignRole, roleOf } from '../lib/permissions.js'

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

const as = (role) => ({ role })

describe('can()', () => {
  it('da a todos los usuarios lo básico: comentar, reportar, listas, sugerir cambios', () => {
    for (const permission of ['comments:create', 'comments:report', 'lists:manage', 'edits:suggest']) {
      for (const role of ROLES) expect(can(as(role), permission)).toBe(true)
    }
  })

  it('reserva moderar comentarios para moderador en adelante', () => {
    expect(can(as('usuario'), 'comments:moderate')).toBe(false)
    for (const role of ['moderador', 'editor_junior', 'editor_senior', 'admin', 'teacherperi']) {
      expect(can(as(role), 'comments:moderate')).toBe(true)
    }
  })

  it('sigue la tabla de herencia para editar, publicar y dar roles', () => {
    expect(can(as('moderador'), 'content:edit')).toBe(false)
    expect(can(as('editor_junior'), 'content:edit')).toBe(true)
    expect(can(as('editor_junior'), 'content:publish')).toBe(false)
    expect(can(as('editor_senior'), 'content:publish')).toBe(true)
    expect(can(as('editor_senior'), 'roles:grant')).toBe(false)
    expect(can(as('admin'), 'roles:grant')).toBe(true)
    expect(can(as('admin'), 'roles:assign-any')).toBe(false)
    expect(can(as('teacherperi'), 'roles:assign-any')).toBe(true)
  })

  it('niega por defecto: permisos desconocidos, sin usuario o rol inventado', () => {
    expect(can(as('teacherperi'), 'algo:que-no-existe')).toBe(false)
    expect(can(null, 'comments:moderate')).toBe(false)
    expect(can(as('superusuario'), 'comments:moderate')).toBe(false)
  })

  it('cada permiso apunta a un rol que existe', () => {
    for (const minimum of Object.values(PERMISSIONS)) expect(ROLES).toContain(minimum)
  })
})

describe('canAssignRole()', () => {
  it('un admin asigna roles por debajo de admin, pero no admin ni teacherperi', () => {
    expect(canAssignRole(as('admin'), 'moderador')).toBe(true)
    expect(canAssignRole(as('admin'), 'editor_senior')).toBe(true)
    expect(canAssignRole(as('admin'), 'admin')).toBe(false)
    expect(canAssignRole(as('admin'), 'teacherperi')).toBe(false)
  })

  it('teacherperi asigna cualquier rol; los demás ninguno', () => {
    for (const role of ROLES) expect(canAssignRole(as('teacherperi'), role)).toBe(true)
    expect(canAssignRole(as('editor_senior'), 'usuario')).toBe(false)
    expect(canAssignRole(as('teacherperi'), 'superusuario')).toBe(false)
  })
})
