// ---------------------------------------------------------------------------
// Ordena los comentarios de un problema para mostrarlos como hilos:
// cada hilo (comentario de primer nivel) en orden de llegada, y debajo de cada
// comentario sus respuestas, también en orden de llegada (recorrido en
// profundidad). La profundidad se recalcula al recorrer, sin pasar de
// MAX_COMMENT_DEPTH, así que un comentario cuyo padre ya no existe se muestra
// como primer nivel en vez de perderse.
// ---------------------------------------------------------------------------

import { MAX_COMMENT_DEPTH } from './moderation.js'
import { roleOf } from './permissions.js'
import { avatarOf } from './profile.js'

const key = (id) => (id == null ? null : String(id))
const byCreatedAt = (a, b) => new Date(a.createdAt) - new Date(b.createdAt) || key(a._id).localeCompare(key(b._id))

export function orderCommentThread(comments) {
  const ids = new Set(comments.map((c) => key(c._id)))
  const children = new Map()
  const tops = []
  for (const comment of comments) {
    const parent = key(comment.parent)
    if (parent && ids.has(parent) && parent !== key(comment._id)) {
      if (!children.has(parent)) children.set(parent, [])
      children.get(parent).push(comment)
    } else {
      tops.push(comment)
    }
  }

  const ordered = []
  const visit = (comment, depth) => {
    ordered.push({ comment, depth: Math.min(depth, MAX_COMMENT_DEPTH) })
    for (const child of (children.get(key(comment._id)) ?? []).sort(byCreatedAt)) visit(child, depth + 1)
  }
  for (const top of tops.sort(byCreatedAt)) visit(top, 0)
  return ordered
}

// Lo que el público ve de un comentario. Uno eliminado conserva su lugar en
// el hilo, pero sin texto ni autor.
export function publicComment(comment, depth) {
  const shared = {
    _id: comment._id,
    problem: comment.problem,
    parent: comment.parent ?? null,
    root: comment.root ?? null,
    depth,
    createdAt: comment.createdAt,
  }
  if (comment.status === 'deleted') {
    return { ...shared, deleted: true, deletedAs: comment.deletedAs, body: null, author: null }
  }
  const author = comment.author && typeof comment.author === 'object'
    ? { _id: comment.author._id, username: comment.author.username, role: roleOf(comment.author), avatar: avatarOf(comment.author) }
    : null
  return { ...shared, deleted: false, body: comment.body, author }
}
