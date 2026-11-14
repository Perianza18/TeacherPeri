import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { canModerate } from '../../lib/roles'
import CommentComposer from './CommentComposer'
import CommentRow from './CommentRow'

// La API regresa los comentarios ya en orden de hilo; cada comentario de
// primer nivel (depth 0) abre una tarjeta nueva con sus respuestas debajo.
function groupThreads(comments) {
  const threads = []
  for (const comment of comments) {
    if (comment.depth === 0 || threads.length === 0) threads.push([])
    threads.at(-1).push(comment)
  }
  return threads
}

// Comentarios de un problema: hilos anidados (hasta 3 niveles), responder,
// reportar y eliminar. Sin sesión se muestra `signIn` en lugar del formulario.
export default function CommentSection({ problemId, auth, onAuthExpired, signIn }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const load = useCallback(() => apiFetch(`/api/problems/${problemId}/comments`).then((data) => setComments(Array.isArray(data) ? data : [])), [problemId])

  useEffect(() => {
    let active = true
    apiFetch(`/api/problems/${problemId}/comments`)
      .then((data) => { if (active) setComments(Array.isArray(data) ? data : []) })
      .catch((err) => { if (active) setLoadError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [problemId])

  // Si la sesión ya no sirve, se cierra (vuelve a aparecer el inicio de sesión).
  const call = async (path, options) => {
    try {
      return await apiFetch(`/api/problems/${problemId}/comments${path}`, { token: auth?.token, ...options })
    } catch (err) {
      if (err.status === 401) onAuthExpired?.()
      throw err
    }
  }

  const post = async (body, parent) => {
    await call('', { method: 'POST', body: parent ? { body, parent } : { body } })
    await load()
  }
  const report = (comment, reason) => call(`/${comment._id}/reports`, { method: 'POST', body: reason })
  const remove = async (comment, reason) => {
    const placeholder = await call(`/${comment._id}`, { method: 'DELETE', body: reason })
    setComments((list) => list.map((c) => (c._id === comment._id ? { ...placeholder, depth: c.depth } : c)))
  }

  const viewer = auth ? { id: auth.user.id, canModerate: canModerate(auth.user.role) } : null
  const threads = groupThreads(comments)

  return (
    <section aria-labelledby={`comentarios-${problemId}`} className="flex flex-col gap-4">
      <h4 id={`comentarios-${problemId}`} className="text-lg font-black text-brand-900">
        Comentarios{comments.length > 0 && <span className="ml-2 text-sm font-semibold text-brand-600">({comments.filter((c) => !c.deleted).length})</span>}
      </h4>

      {loading && <p className="text-sm text-brand-600">Cargando comentarios…</p>}
      {loadError && <p role="alert" className="text-sm text-red-700">{loadError}</p>}
      {!loading && !loadError && comments.length === 0 && <p className="text-sm text-brand-600">Aún no hay comentarios. Sé la primera persona en comentar.</p>}

      {threads.length > 0 && (
        <ol className="flex flex-col gap-3">
          {threads.map((thread) => (
            <li key={thread[0]._id} className="rounded-[14px] border-2 border-black bg-white px-4 py-2">
              <ol className="divide-y divide-dashed divide-[#c4bcb2]">
                {thread.map((comment) => (
                  <CommentRow
                    key={comment._id}
                    comment={comment}
                    viewer={viewer}
                    onReply={(parent, body) => post(body, parent._id)}
                    onReport={report}
                    onDelete={remove}
                  />
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}

      {auth ? <CommentComposer label="Escribe un comentario" onSubmit={(body) => post(body)} /> : signIn}
    </section>
  )
}
