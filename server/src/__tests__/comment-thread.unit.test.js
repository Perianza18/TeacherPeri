import { describe, it, expect } from 'vitest'
import { orderCommentThread, publicComment } from '../lib/commentThread.js'

let minute = 0
const c = (id, parent = null, extra = {}) => ({ _id: id, parent, createdAt: new Date(2026, 0, 1, 0, minute++), ...extra })
const view = (list) => orderCommentThread(list).map(({ comment, depth }) => `${comment._id}@${depth}`)

describe('orderCommentThread', () => {
  it('pone cada respuesta debajo de su padre, en orden de llegada', () => {
    const a = c('a'); const b = c('b'); const a1 = c('a1', 'a'); const a2 = c('a2', 'a'); const a1x = c('a1x', 'a1')
    expect(view([a2, b, a1x, a, a1])).toEqual(['a@0', 'a1@1', 'a1x@2', 'a2@1', 'b@0'])
  })

  it('no pasa del nivel 3 aunque la cadena de respuestas sea más larga', () => {
    const list = [c('n0'), c('n1', 'n0'), c('n2', 'n1'), c('n3', 'n2'), c('n4', 'n3'), c('n5', 'n4')]
    expect(view(list)).toEqual(['n0@0', 'n1@1', 'n2@2', 'n3@3', 'n4@3', 'n5@3'])
  })

  it('muestra como primer nivel un comentario cuyo padre ya no está', () => {
    const list = [c('x'), c('huerfano', 'no-existe'), c('hijo', 'huerfano')]
    expect(view(list)).toEqual(['x@0', 'huerfano@0', 'hijo@1'])
  })

  it('trata comentarios antiguos sin parent como primer nivel', () => {
    expect(view([c('viejo', undefined)])).toEqual(['viejo@0'])
  })
})

describe('publicComment', () => {
  const author = { _id: 'u1', username: 'ana', role: 'editor', email: 'ana@test.com', passwordHash: 'h' }

  it('expone texto, autor y rol, pero nunca el correo ni el hash', () => {
    const out = publicComment({ ...c('a'), body: 'Hola', status: 'visible', author }, 0)
    expect(out).toMatchObject({ deleted: false, body: 'Hola', depth: 0, author: { username: 'ana', role: 'editor' } })
    expect(out.author.email).toBeUndefined()
    expect(out.author.passwordHash).toBeUndefined()
  })

  it('un comentario eliminado conserva su lugar sin texto ni autor', () => {
    const out = publicComment({ ...c('a'), body: 'Texto original', status: 'deleted', deletedAs: 'moderacion', deletedReason: 'spam', author }, 2)
    expect(out).toMatchObject({ deleted: true, deletedAs: 'moderacion', body: null, author: null, depth: 2 })
    expect(out.deletedReason).toBeUndefined()
  })
})
