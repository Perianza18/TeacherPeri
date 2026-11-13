import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import { parseReason } from '../lib/moderation.js'

const id = () => new mongoose.Types.ObjectId()
const base = () => ({ problem: id(), author: id(), body: 'Hola' })
const errorsOf = (data) => Object.keys(new Comment(data).validateSync()?.errors ?? {})

describe('Comment: anidado', () => {
  it('un comentario nuevo es de primer nivel, visible y sin padre', () => {
    const comment = new Comment(base())
    expect(comment.validateSync()).toBeUndefined()
    expect(comment).toMatchObject({ depth: 0, status: 'visible', parent: null, root: null })
  })

  it('acepta respuestas de nivel 1 a 3 con parent y root', () => {
    for (const depth of [1, 2, 3]) expect(errorsOf({ ...base(), depth, parent: id(), root: id() })).toEqual([])
  })

  it('rechaza profundidad fuera de 0..3 o no entera', () => {
    expect(errorsOf({ ...base(), depth: 4, parent: id(), root: id() })).toContain('depth')
    expect(errorsOf({ ...base(), depth: -1 })).toContain('depth')
    expect(errorsOf({ ...base(), depth: 1.5, parent: id(), root: id() })).toContain('depth')
  })

  it('rechaza una respuesta sin parent/root, o un primer nivel con parent', () => {
    expect(errorsOf({ ...base(), depth: 1 })).toContain('parent')
    expect(errorsOf({ ...base(), depth: 1, parent: id() })).toContain('root')
    expect(errorsOf({ ...base(), depth: 0, parent: id(), root: id() })).toContain('parent')
  })
})

describe('Comment: eliminación suave', () => {
  const deleted = (extra) => ({ ...base(), status: 'deleted', deletedBy: id(), deletedAt: new Date(), ...extra })

  it('acepta una eliminación del autor sin motivo', () => {
    expect(errorsOf(deleted({ deletedAs: 'autor' }))).toEqual([])
  })

  it('exige motivo cuando elimina la moderación, y nota si el motivo es «otro»', () => {
    expect(errorsOf(deleted({ deletedAs: 'moderacion' }))).toContain('deletedReason')
    expect(errorsOf(deleted({ deletedAs: 'moderacion', deletedReason: 'spam' }))).toEqual([])
    expect(errorsOf(deleted({ deletedAs: 'moderacion', deletedReason: 'otro' }))).toContain('deletedReasonNote')
    expect(errorsOf(deleted({ deletedAs: 'moderacion', deletedReason: 'otro', deletedReasonNote: 'Duplicado' }))).toEqual([])
  })

  it('exige quién y cuándo, y rechaza estados o motivos inventados', () => {
    expect(errorsOf({ ...base(), status: 'deleted', deletedAs: 'autor' })).toContain('deletedAs')
    expect(errorsOf({ ...base(), status: 'oculto' })).toContain('status')
    expect(errorsOf(deleted({ deletedAs: 'moderacion', deletedReason: 'me_cae_mal' }))).toContain('deletedReason')
  })
})

describe('parseReason', () => {
  it('acepta un motivo de la lista y limpia la nota', () => {
    expect(parseReason({ reason: 'spam' })).toEqual({ reason: 'spam', note: null })
    expect(parseReason({ reason: 'otro', note: '  Repetido  ' })).toEqual({ reason: 'otro', note: 'Repetido' })
  })

  it('rechaza motivos inventados, «otro» sin nota y notas demasiado largas', () => {
    expect(parseReason({ reason: 'x' }).error).toBeTruthy()
    expect(parseReason({}).error).toBeTruthy()
    expect(parseReason({ reason: 'otro', note: '   ' }).error).toBeTruthy()
    expect(parseReason({ reason: 'spam', note: 'a'.repeat(301) }).error).toBeTruthy()
  })
})
