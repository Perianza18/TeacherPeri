import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { requireAuth, requirePermission } from '../middleware/auth.js'

// Una app mínima con una ruta solo para editores (moderar comentarios), para probar el
// middleware sin depender de ninguna ruta real.
const testApp = express()
testApp.get('/solo-moderadores', requireAuth, requirePermission('comments:moderate'), (req, res) => {
  res.json({ ok: true, role: req.userRole })
})

async function signupToken(username) {
  const res = await request(app).post('/api/auth/signup').send({
    username,
    email: `${username}@test.com`,
    password: 'clave12345',
  })
  return res.body.token
}

describe('requirePermission', () => {
  it('responde 401 sin sesión', async () => {
    const res = await request(testApp).get('/solo-moderadores')
    expect(res.status).toBe(401)
  })

  it('responde 403 a un usuario normal', async () => {
    const token = await signupToken('normal')
    const res = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it('deja pasar a un editor y a un admin', async () => {
    const token = await signupToken('moder')
    for (const role of ['editor', 'admin']) {
      await User.updateOne({ username: 'moder' }, { role })
      const res = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
      expect(res.status).toBe(200)
      expect(res.body.role).toBe(role)
    }
  })

  it('traduce los roles antiguos: teacherperi es admin; moderador ya no modera', async () => {
    const token = await signupToken('antiguo')
    await User.collection.updateOne({ username: 'antiguo' }, { $set: { role: 'teacherperi' } })
    const admin = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
    expect(admin.status).toBe(200)
    expect(admin.body.role).toBe('admin')
    await User.collection.updateOne({ username: 'antiguo' }, { $set: { role: 'moderador' } })
    expect((await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)).status).toBe(403)
  })

  it('aplica un cambio de rol de inmediato, con el mismo token', async () => {
    const token = await signupToken('cambiante')
    await User.updateOne({ username: 'cambiante' }, { role: 'editor' })
    const antes = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
    expect(antes.status).toBe(200)

    await User.updateOne({ username: 'cambiante' }, { role: 'user' })
    const despues = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
    expect(despues.status).toBe(403)
  })

  it('trata una cuenta antigua sin rol guardado como user', async () => {
    const token = await signupToken('antigua')
    await User.collection.updateOne({ username: 'antigua' }, { $unset: { role: '' } })
    const res = await request(testApp).get('/solo-moderadores').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})
