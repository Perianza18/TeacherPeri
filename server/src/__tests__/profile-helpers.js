// Shared setup for the Mi Espacio database tests (not a test file itself).
import request from 'supertest'
import app from '../app.js'
import Problem from '../models/Problem.js'
import Theory from '../models/Theory.js'
import User from '../models/User.js'

export const as = (token) => ({ Authorization: `Bearer ${token}` })
const legacy = { año: '2024', tema: 'Álgebra', tipo: 'Colección interna', dificultad: 'Media' }

export async function account(username, role = 'user') {
  const res = await request(app).post('/api/auth/signup').send({ username, email: `${username}@test.com`, password: 'clave12345' })
  if (role !== 'user') await User.updateOne({ username }, { role })
  return { token: res.body.token, user: await User.findOne({ username }).lean() }
}

export async function content() {
  const problem = await Problem.create({ codigo: 'P-1', titulo: 'Casillas', enunciado: 'Enunciado público.', ...legacy })
  const other = await Problem.create({ codigo: 'P-2', titulo: 'Paridad', enunciado: 'Otro enunciado.', ...legacy })
  const draft = await Problem.create({ codigo: 'P-3', titulo: 'Borrador', enunciado: 'Borrador.', ...legacy, publicationStatus: 'draft' })
  const lesson = await Theory.create({ title: 'Principio de casillas', summary: 'Resumen.', content: 'Texto.', level: 'basico', publicationStatus: 'published' })
  const hiddenLesson = await Theory.create({ title: 'Oculta', summary: 'Resumen.', content: 'Texto.', level: 'basico' })
  return { problem, other, draft, lesson, hiddenLesson }
}
