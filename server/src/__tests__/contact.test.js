// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/contact.routes.js — el formulario de la
// página Contacto. Mismo patrón que comments.test.js: demuestra que
// "necesitas iniciar sesión para contactarnos" lo exige el backend, no solo
// el frontend.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

async function crearUsuarioYObtenerToken(email = 'contacto@test.com', username = 'quiencontacta') {
  const res = await request(app).post('/api/auth/signup').send({
    username,
    email,
    password: 'clave12345',
  })
  return res.body.token
}

describe('POST /api/contact', () => {
  it('rechaza enviar el formulario sin sesión iniciada', async () => {
    const res = await request(app).post('/api/contact').send({
      perfil: 'Estudiante de Secundaria/Prepa',
      motivo: 'Sugerir un recurso',
      mensaje: 'Deberían agregar tal recurso.',
    })
    expect(res.status).toBe(401)
  })

  it('permite enviar el formulario con sesión iniciada', async () => {
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post('/api/contact')
      .set('Authorization', `Bearer ${token}`)
      .send({
        perfil: 'Exolímpico/Entrenador',
        motivo: 'Compartir experiencia',
        mensaje: 'Quiero compartir mi experiencia en la OMM.',
      })

    expect(res.status).toBe(201)
    expect(res.body.perfil).toBe('Exolímpico/Entrenador')
    expect(res.body.motivo).toBe('Compartir experiencia')
    expect(res.body.mensaje).toBe('Quiero compartir mi experiencia en la OMM.')
  })

  it('rechaza un perfil que no es una de las opciones válidas', async () => {
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post('/api/contact')
      .set('Authorization', `Bearer ${token}`)
      .send({
        perfil: 'Astronauta',
        motivo: 'Feedback general',
        mensaje: 'Mensaje válido.',
      })

    expect(res.status).toBe(400)
  })

  it('rechaza un mensaje vacío', async () => {
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post('/api/contact')
      .set('Authorization', `Bearer ${token}`)
      .send({
        perfil: 'Padre/Madre',
        motivo: 'Duda sobre extranjero',
        mensaje: '   ',
      })

    expect(res.status).toBe(400)
  })
})
