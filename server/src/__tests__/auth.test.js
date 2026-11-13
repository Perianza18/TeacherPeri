// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/auth.routes.js
//
// SKELETON de cómo se ve cualquier prueba con vitest + supertest:
//
//   describe('grupo de pruebas', () => {
//     it('hace algo específico', async () => {
//       const res = await request(app).post('/una/ruta').send({ ... })
//       expect(res.status).toBe(200)          // "espero que pase esto"
//     })
//   })
//
// request(app) le manda una petición HTTP falsa directo al app de Express
// (sin necesitar un puerto real ni un navegador) — así se puede probar la
// API exactamente como la usaría el frontend.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'

describe('User.role', () => {
  it('una cuenta nueva empieza con el rol usuario', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const user = await User.findOne({ email: 'ana@test.com' })
    expect(user.role).toBe('usuario')
  })

  it('ignora un rol enviado en el registro', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'colado',
      email: 'colado@test.com',
      password: 'clave12345',
      role: 'admin',
    })

    expect(res.status).toBe(201)
    const user = await User.findOne({ email: 'colado@test.com' })
    expect(user.role).toBe('usuario')
  })

  it('rechaza un rol que no existe', async () => {
    const user = new User({ username: 'x', email: 'x@test.com', passwordHash: 'h', role: 'superusuario' })
    await expect(user.validate()).rejects.toThrow()
  })
})

describe('POST /api/auth/signup', () => {
  it('crea una cuenta nueva y regresa un token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeTypeOf('string')
    expect(res.body.user.username).toBe('ana')
  })

  it('rechaza una contraseña demasiado corta', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'corta',
    })
    expect(res.status).toBe(400)
  })

  it('rechaza un correo que ya está registrado', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/signup').send({
      username: 'otra_persona',
      email: 'ana@test.com', // mismo correo, username distinto
      password: 'clave12345',
    })

    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/login', () => {
  it('inicia sesión con la contraseña correcta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'clave12345',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeTypeOf('string')
  })

  it('rechaza una contraseña incorrecta', async () => {
    await request(app).post('/api/auth/signup').send({
      username: 'ana',
      email: 'ana@test.com',
      password: 'clave12345',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'ana@test.com',
      password: 'esta-no-es',
    })

    expect(res.status).toBe(401)
  })

  it('el límite de intentos no bloquea las pruebas (NODE_ENV=test lo desactiva)', async () => {
    // app.js apaga el rate limiter cuando NODE_ENV==='test' -- 20 sería el
    // límite real en producción, así que 25 intentos seguidos aquí prueban
    // justamente que ese apagado funciona. Si esto alguna vez regresara un
    // 429, sería una señal de que el rate limiter se está aplicando también
    // en pruebas por error.
    for (let i = 0; i < 25; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nadie@test.com', password: 'lo-que-sea' })
      expect(res.status).not.toBe(429)
    }
  })

  it('rechaza un correo que no existe, sin decir que "no existe"', async () => {
    // No revisamos el mensaje exacto, solo que se rechace igual que una
    // contraseña incorrecta (401) -- ver el comentario en auth.routes.js
    // sobre por qué ambos casos responden lo mismo.
    const res = await request(app).post('/api/auth/login').send({
      email: 'nadie@test.com',
      password: 'lo-que-sea',
    })
    expect(res.status).toBe(401)
  })
})
