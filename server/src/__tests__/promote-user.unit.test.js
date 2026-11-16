import { describe, it, expect } from 'vitest'
import { parseRoleArgs, roleChangeTarget } from '../scripts/promote-user.js'

describe('roleChangeTarget', () => {
  const uri = 'mongodb+srv://usuario:secreto@cluster.example.net/teacherperi?retryWrites=true'

  it('exige una URI propia y explícita, sin usar MONGO_URI', () => {
    expect(() => roleChangeTarget({})).toThrow(/MONGO_ROLE_URI/)
    expect(() => roleChangeTarget({ MONGO_URI: uri })).toThrow(/MONGO_ROLE_URI/)
  })

  it('exige un nombre de base que no sea del sistema y sin dbName en opciones', () => {
    expect(() => roleChangeTarget({ MONGO_ROLE_URI: 'mongodb://127.0.0.1:27017' })).toThrow(/database name/)
    expect(() => roleChangeTarget({ MONGO_ROLE_URI: 'mongodb://127.0.0.1:27017/admin' })).toThrow(/database name/)
    expect(() => roleChangeTarget({ MONGO_ROLE_URI: 'mongodb://127.0.0.1:27017/teacherperi?dbName=otra' })).toThrow(/override/)
  })

  it('el modo de prueba no pide confirmación; --apply exige el nombre exacto de la base', () => {
    expect(roleChangeTarget({ MONGO_ROLE_URI: uri })).toEqual({ uri, dbName: 'teacherperi' })
    expect(() => roleChangeTarget({ MONGO_ROLE_URI: uri }, true)).toThrow(/ROLE_CHANGE_CONFIRM/)
    expect(() => roleChangeTarget({ MONGO_ROLE_URI: uri, ROLE_CHANGE_CONFIRM: 'teacherperi_dev' }, true)).toThrow(/ROLE_CHANGE_CONFIRM/)
    expect(roleChangeTarget({ MONGO_ROLE_URI: uri, ROLE_CHANGE_CONFIRM: 'teacherperi' }, true).dbName).toBe('teacherperi')
  })

  it('nunca incluye la URI (ni la contraseña) en sus mensajes de error', () => {
    try {
      roleChangeTarget({ MONGO_ROLE_URI: uri }, true)
    } catch (error) {
      expect(error.message).not.toContain('secreto')
      expect(error.message).not.toContain('cluster.example.net')
    }
  })
})

describe('parseRoleArgs', () => {
  it('lee --user y --role; por defecto solo muestra (dry-run)', () => {
    expect(parseRoleArgs(['--user', 'ana@test.com', '--role', 'admin'])).toEqual({ user: 'ana@test.com', role: 'admin', apply: false })
    expect(parseRoleArgs(['--user', 'ana', '--role', 'editor', '--apply']).apply).toBe(true)
  })

  it('rechaza roles inventados, argumentos faltantes o desconocidos y modos mezclados', () => {
    expect(() => parseRoleArgs(['--user', 'ana', '--role', 'superusuario'])).toThrow(/--role/)
    expect(() => parseRoleArgs(['--user', 'ana', '--role', 'teacherperi'])).toThrow(/--role/)
    expect(() => parseRoleArgs(['--user', 'ana', '--role', 'moderador'])).toThrow(/--role/)
    expect(() => parseRoleArgs(['--role', 'admin'])).toThrow(/--user/)
    expect(() => parseRoleArgs(['--user', '--role', 'admin'])).toThrow(/needs a value/)
    expect(() => parseRoleArgs(['--user', 'ana', '--role', 'admin', '--force'])).toThrow(/Unknown argument/)
    expect(() => parseRoleArgs(['--user', 'ana', '--role', 'admin', '--apply', '--dry-run'])).toThrow(/not both/)
  })
})
