// ---------------------------------------------------------------------------
// Pruebas de server/src/routes/comments.routes.js -- estas son las que
// realmente demuestran que "necesitas iniciar sesión para comentar" no es
// solo un botón escondido en el frontend, sino algo que el backend exige.
// ---------------------------------------------------------------------------

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import Category from '../models/Category.js'
import Problem from '../models/Problem.js'
import Comment from '../models/Comment.js'

// Pequeño helper: crea un problema real en la base de prueba, para tener
// algo válido sobre lo cual comentar en cada prueba.
async function crearProblemaDePrueba() {
  const categoria = await Category.create({ name: 'Categoría de prueba' })
  return Problem.create({
    codigo: 'TEST-1',
    titulo: 'Problema de prueba',
    enunciado: 'Enunciado de prueba.',
    category: categoria._id,
    año: '2024',
    tema: 'Álgebra',
    tipo: 'Colección interna',
    dificultad: 'Media',
    exito: 50,
  })
}

// Otro helper: registra un usuario nuevo y regresa su token, listo para
// usarse en el encabezado Authorization de una prueba. Se le puede pedir un
// email distinto para simular a una SEGUNDA persona (ver las pruebas de
// borrado más abajo, donde importa que dos usuarios sean gente distinta).
async function crearUsuarioYObtenerToken(email = 'comentarista@test.com', username = 'comentarista') {
  const res = await request(app).post('/api/auth/signup').send({
    username,
    email,
    password: 'clave12345',
  })
  return res.body.token
}

describe('GET /api/problems/:id/comments', () => {
  it('deja leer los comentarios sin haber iniciado sesión', async () => {
    const problema = await crearProblemaDePrueba()
    const res = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('POST /api/problems/:id/comments', () => {
  it('rechaza publicar un comentario sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .send({ body: 'Intento de comentario sin sesión.' })

    expect(res.status).toBe(401)
  })

  it('rechaza un token inventado (no firmado por nosotros)', async () => {
    const problema = await crearProblemaDePrueba()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', 'Bearer esto-no-es-un-token-real')
      .send({ body: 'Intento con token falso.' })

    expect(res.status).toBe(401)
  })

  it('permite comentar con sesión iniciada, y el comentario aparece después al leer', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const publicar = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Este problema tiene una solución elegante con AM-GM.' })

    expect(publicar.status).toBe(201)
    // El autor debe venir "poblado" (username visible), no solo un ID crudo.
    expect(publicar.body.author.username).toBe('comentarista')

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.status).toBe(200)
    expect(leer.body).toHaveLength(1)
    expect(leer.body[0].body).toBe('Este problema tiene una solución elegante con AM-GM.')
  })

  it('rechaza un comentario vacío, incluso con sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: '   ' }) // solo espacios

    expect(res.status).toBe(400)
  })

  it('rechaza un comentario más largo que el límite del modelo (2000 caracteres)', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const res = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'x'.repeat(2001) })

    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/problems/:id/comments/:commentId', () => {
  it('rechaza borrar sin sesión iniciada', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Un comentario.' })

    const res = await request(app).delete(
      `/api/problems/${problema._id}/comments/${comentario.body._id}`,
    )
    expect(res.status).toBe(401)
  })

  it('rechaza borrar el comentario de OTRA persona', async () => {
    const problema = await crearProblemaDePrueba()
    const tokenAutor = await crearUsuarioYObtenerToken('autor@test.com', 'autor')
    const tokenOtraPersona = await crearUsuarioYObtenerToken('otra@test.com', 'otra_persona')

    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${tokenAutor}`)
      .send({ body: 'Comentario del autor original.' })

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${comentario.body._id}`)
      .set('Authorization', `Bearer ${tokenOtraPersona}`)

    expect(res.status).toBe(403)
  })

  it('deja al autor borrar su propio comentario, y desaparece de la lista', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const comentario = await request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Lo voy a borrar yo mismo.' })

    const borrar = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${comentario.body._id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(borrar.status).toBe(204)

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.body).toHaveLength(0)
  })

  it('regresa 404 si el comentario no existe', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const idQueNoExiste = '000000000000000000000000' // un ObjectId con forma válida, pero inventado

    const res = await request(app)
      .delete(`/api/problems/${problema._id}/comments/${idQueNoExiste}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})

describe('Respuestas anidadas', () => {
  async function publicar(problema, token, body, parent) {
    return request(app)
      .post(`/api/problems/${problema._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send(parent ? { body, parent } : { body })
  }

  it('responder a una respuesta de una respuesta llega al nivel 3, y la cuarta se queda en 3', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const n0 = await publicar(problema, token, 'Nivel 0')
    const n1 = await publicar(problema, token, 'Nivel 1', n0.body._id)
    const n2 = await publicar(problema, token, 'Nivel 2', n1.body._id)
    const n3 = await publicar(problema, token, 'Nivel 3', n2.body._id)
    const n4 = await publicar(problema, token, 'Cuarta respuesta', n3.body._id)

    expect([n0, n1, n2, n3, n4].map((r) => r.status)).toEqual([201, 201, 201, 201, 201])
    expect([n0, n1, n2, n3, n4].map((r) => r.body.depth)).toEqual([0, 1, 2, 3, 3])
    expect(n4.body.parent).toBe(n3.body._id) // recuerda a quién respondió
    expect(n4.body.root).toBe(n0.body._id)
  })

  it('regresa los hilos en orden, con cada respuesta debajo de su padre y el rol del autor', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()

    const a = await publicar(problema, token, 'Hilo A')
    const b = await publicar(problema, token, 'Hilo B')
    await publicar(problema, token, 'Respuesta a A', a.body._id)
    await publicar(problema, token, 'Respuesta a B', b.body._id)

    const leer = await request(app).get(`/api/problems/${problema._id}/comments`)
    expect(leer.body.map((c) => [c.body, c.depth])).toEqual([
      ['Hilo A', 0], ['Respuesta a A', 1], ['Hilo B', 0], ['Respuesta a B', 1],
    ])
    expect(leer.body[0].author).toMatchObject({ username: 'comentarista', role: 'usuario' })
    expect(leer.body[0].author.email).toBeUndefined()
  })

  it('rechaza responder a un comentario de otro problema o que no existe', async () => {
    const problema = await crearProblemaDePrueba()
    const otro = await Problem.create({ codigo: 'TEST-2', titulo: 'Otro', enunciado: 'Otro.', category: problema.category, año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media', exito: 50 })
    const token = await crearUsuarioYObtenerToken()
    const ajeno = await publicar(otro, token, 'En otro problema')

    expect((await publicar(problema, token, 'Respuesta', ajeno.body._id)).status).toBe(404)
    expect((await publicar(problema, token, 'Respuesta', '000000000000000000000000')).status).toBe(404)
    expect((await publicar(problema, token, 'Respuesta', 'no-es-un-id')).status).toBe(404)
  })

  it('rechaza responder a un comentario eliminado', async () => {
    const problema = await crearProblemaDePrueba()
    const token = await crearUsuarioYObtenerToken()
    const c = await publicar(problema, token, 'Será eliminado')
    await Comment.updateOne({ _id: c.body._id }, { status: 'deleted', deletedAs: 'autor', deletedBy: c.body.author._id, deletedAt: new Date() })

    const res = await publicar(problema, token, 'Respuesta', c.body._id)
    expect(res.status).toBe(409)
  })

  it('rechaza comentar en un problema que no existe', async () => {
    const token = await crearUsuarioYObtenerToken()
    const res = await request(app)
      .post('/api/problems/000000000000000000000000/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Hola' })
    expect(res.status).toBe(404)
  })
})
