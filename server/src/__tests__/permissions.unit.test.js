import { describe, it, expect } from 'vitest'
import { DEFAULT_ROLE, LEGACY_ROLES, PERMISSIONS, ROLES, can, canAssignRole, roleOf } from '../lib/permissions.js'

describe('roles', () => {
  it('lista los tres roles de menos a más poder', () => {
    expect(ROLES).toEqual(['user', 'editor', 'admin'])
    expect(DEFAULT_ROLE).toBe('user')
  })

  it('trata una cuenta sin rol guardado (o con uno desconocido) como user', () => {
    expect(roleOf({})).toBe('user')
    expect(roleOf(null)).toBe('user')
    expect(roleOf({ role: 'superusuario' })).toBe('user')
    expect(roleOf({ role: 'editor' })).toBe('editor')
  })

  it('traduce los roles antiguos sin migrar la base', () => {
    expect(roleOf({ role: 'usuario' })).toBe('user')
    expect(roleOf({ role: 'moderador' })).toBe('user')
    expect(roleOf({ role: 'editor_junior' })).toBe('editor')
    expect(roleOf({ role: 'editor_senior' })).toBe('editor')
    expect(roleOf({ role: 'teacherperi' })).toBe('admin')
    for (const target of Object.values(LEGACY_ROLES)) expect(ROLES).toContain(target)
  })
})

const as = (role) => ({ role })

describe('can()', () => {
  it('da a todos lo básico: comentar, reportar, proponer y cuidar lo propio', () => {
    for (const permission of ['comments:create', 'comments:report', 'flags:create', 'problems:submit', 'problems:edit-own', 'problems:delete-own', 'folders:propose']) {
      for (const role of ROLES) expect(can(as(role), permission)).toBe(true)
    }
  })

  it('reserva moderar, ver reportes y editar todo para editor en adelante', () => {
    for (const permission of ['comments:moderate', 'flags:view', 'content:edit-any']) {
      expect(can(as('user'), permission)).toBe(false)
      expect(can(as('editor'), permission)).toBe(true)
      expect(can(as('admin'), permission)).toBe(true)
    }
  })

  it('reserva revisar envíos, restaurar y nombrar editores para admin', () => {
    for (const permission of ['submissions:review', 'folders:review', 'content:restore', 'roles:assign-editor', 'activity:notified']) {
      expect(can(as('user'), permission)).toBe(false)
      expect(can(as('editor'), permission)).toBe(false)
      expect(can(as('admin'), permission)).toBe(true)
    }
  })

  it('la cuenta antigua `teacherperi` (Elias) puede todo lo de admin', () => {
    for (const permission of Object.keys(PERMISSIONS)) expect(can(as('teacherperi'), permission)).toBe(true)
  })

  it('un `moderador` antiguo pasa a user y pierde la moderación', () => {
    expect(can(as('moderador'), 'comments:moderate')).toBe(false)
  })

  it('niega por defecto: permisos desconocidos, sin usuario o rol inventado', () => {
    expect(can(as('admin'), 'algo:que-no-existe')).toBe(false)
    expect(can(null, 'comments:moderate')).toBe(false)
    expect(can(as('superusuario'), 'comments:moderate')).toBe(false)
  })

  it('cada permiso apunta a un rol que existe', () => {
    for (const minimum of Object.values(PERMISSIONS)) expect(ROLES).toContain(minimum)
  })
})

describe('canAssignRole()', () => {
  it('un admin nombra editores o los regresa a user, pero no nombra admins', () => {
    expect(canAssignRole(as('admin'), 'editor')).toBe(true)
    expect(canAssignRole(as('admin'), 'user')).toBe(true)
    expect(canAssignRole(as('admin'), 'admin')).toBe(false)
    expect(canAssignRole(as('admin'), 'superusuario')).toBe(false)
  })

  it('un editor o un user no asignan roles', () => {
    expect(canAssignRole(as('editor'), 'editor')).toBe(false)
    expect(canAssignRole(as('user'), 'user')).toBe(false)
  })
})
