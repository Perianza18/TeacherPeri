import { describe, it, expect } from 'vitest'
import User from '../models/User.js'
import { setUserRole } from '../scripts/promote-user.js'

async function crearCuenta(username, email) {
  return User.create({ username, email, passwordHash: 'hash-de-prueba' })
}

describe('setUserRole', () => {
  it('en modo de prueba muestra el cambio pero no escribe nada', async () => {
    await crearCuenta('ana', 'ana@test.com')
    const result = await setUserRole({ user: 'ana@test.com', role: 'admin', apply: false })
    expect(result).toMatchObject({ mode: 'dry-run', username: 'ana', from: 'user', to: 'admin', changed: false })
    expect((await User.findOne({ username: 'ana' })).role).toBe('user')
  })

  it('con --apply cambia solo el rol de esa cuenta', async () => {
    await crearCuenta('ana', 'ana@test.com')
    await crearCuenta('beto', 'beto@test.com')
    const result = await setUserRole({ user: 'ANA@test.com', role: 'admin', apply: true })
    expect(result).toMatchObject({ mode: 'applied', from: 'user', to: 'admin', changed: true })
    expect((await User.findOne({ username: 'ana' })).role).toBe('admin')
    expect((await User.findOne({ username: 'beto' })).role).toBe('user')
  })

  it('también encuentra la cuenta por username', async () => {
    await crearCuenta('ana', 'ana@test.com')
    await setUserRole({ user: 'ana', role: 'editor', apply: true })
    expect((await User.findOne({ username: 'ana' })).role).toBe('editor')
  })

  it('reescribe un rol antiguo equivalente al valor nuevo', async () => {
    await User.collection.insertOne({ username: 'elias', email: 'elias@test.com', passwordHash: 'h', role: 'teacherperi' })
    const result = await setUserRole({ user: 'elias', role: 'admin', apply: true })
    expect(result).toMatchObject({ from: 'admin', stored: 'teacherperi', to: 'admin', changed: true })
    expect((await User.findOne({ username: 'elias' })).role).toBe('admin')
  })

  it('se niega si no hay cuenta o si el valor coincide con dos cuentas distintas', async () => {
    await expect(setUserRole({ user: 'nadie@test.com', role: 'admin', apply: true })).rejects.toThrow(/No account/)

    await crearCuenta('ana@test.com', 'otra@test.com') // username igual al correo de otra cuenta
    await crearCuenta('ana', 'ana@test.com')
    await expect(setUserRole({ user: 'ana@test.com', role: 'admin', apply: true })).rejects.toThrow(/more than one/)
    expect(await User.countDocuments({ role: 'admin' })).toBe(0)
  })
})
