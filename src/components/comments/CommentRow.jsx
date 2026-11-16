import { useState } from 'react'
import MathText from '../math/MathText'
import RoleBadge from '../RoleBadge'
import CommentComposer from './CommentComposer'
import ReasonForm from './ReasonForm'

const AVATAR_FILLS = ['#e8ddff', '#d9f1ff', '#ffdfd6', '#d8f5e8']

function avatarFill(name) {
  let sum = 0
  for (const char of name) sum += char.charCodeAt(0)
  return AVATAR_FILLS[sum % AVATAR_FILLS.length]
}

function formatDate(value) {
  return new Date(value).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const actionClass = 'inline-flex min-h-11 items-center px-1 text-sm font-semibold text-brand-600 hover:text-brand-900 hover:underline'

// Una fila del hilo. `panel` decide qué se abre debajo: responder, reportar,
// eliminar (con motivo si eres editor o admin) o confirmar tu propia eliminación.
export default function CommentRow({ comment, viewer, onReply, onReport, onDelete }) {
  const [panel, setPanel] = useState(null)
  const [notice, setNotice] = useState(null)
  const indent = { '--depth': comment.depth }
  const indentClass = 'pl-[calc(var(--depth)*1.25rem)] sm:pl-[calc(var(--depth)*3.25rem)]'

  if (comment.deleted) {
    return (
      <li className={`py-2 ${indentClass}`} style={indent}>
        <p className="text-sm italic text-brand-600">
          {comment.deletedAs === 'moderacion' ? 'Comentario eliminado por moderación' : 'Comentario eliminado por su autor'}
        </p>
      </li>
    )
  }

  const username = comment.author?.username || 'Usuario'
  const isOwn = Boolean(viewer && comment.author?._id === viewer.id)
  const canDelete = Boolean(viewer && (isOwn || viewer.canModerate))
  const close = () => setPanel(null)

  // Las formas muestran sus propios errores; aquí solo se cierra al terminar bien.
  const run = async (action) => {
    await action()
    close()
  }

  return (
    <li className={`py-2 ${indentClass}`} style={indent}>
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black text-sm font-black text-brand-900"
          style={{ backgroundColor: avatarFill(username) }}
        >
          {username.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <strong className="font-bold text-brand-900">{username}</strong>
            <RoleBadge role={comment.author?.role} />
            <time dateTime={comment.createdAt} className="text-brand-600">{formatDate(comment.createdAt)}</time>
          </p>
          <MathText text={comment.body} className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-brand-800" />

          {viewer && (
            <div className="mt-1 flex flex-wrap gap-x-3">
              <button type="button" className={actionClass} aria-expanded={panel === 'reply'} onClick={() => setPanel(panel === 'reply' ? null : 'reply')}>Responder</button>
              {!isOwn && <button type="button" className={actionClass} aria-expanded={panel === 'report'} onClick={() => setPanel(panel === 'report' ? null : 'report')}>Reportar</button>}
              {canDelete && <button type="button" className={`${actionClass} text-red-700 hover:text-red-800`} aria-expanded={panel === 'delete'} onClick={() => setPanel(panel === 'delete' ? null : 'delete')}>Eliminar</button>}
            </div>
          )}
          {notice && <p role="status" className="text-sm font-semibold text-brand-700">{notice}</p>}

          {panel === 'reply' && (
            <div className="mt-2">
              <CommentComposer
                label={`Tu respuesta a ${username}`}
                submitLabel="Responder"
                autoFocus
                onCancel={close}
                onSubmit={(body) => run(() => onReply(comment, body))}
              />
            </div>
          )}
          {panel === 'report' && (
            <ReasonForm
              title="¿Por qué reportas este comentario?"
              confirmLabel="Reportar"
              onCancel={close}
              onSubmit={async (reason) => {
                await run(() => onReport(comment, reason))
                setNotice('Gracias. La moderación revisará este comentario.')
              }}
            />
          )}
          {panel === 'delete' && isOwn && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[10px] border-2 border-black bg-[#ffe4e1] p-3">
              <p className="text-sm font-bold text-brand-900">¿Eliminar tu comentario?</p>
              <div className="ml-auto flex gap-2">
                <button type="button" onClick={close} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-brand-600 hover:text-brand-900">Cancelar</button>
                <button type="button" onClick={() => run(() => onDelete(comment)).catch((err) => setNotice(err.message))} className="tp-button min-h-11 bg-brand-900 px-4 text-sm font-black text-white">Eliminar</button>
              </div>
            </div>
          )}
          {panel === 'delete' && !isOwn && (
            <ReasonForm
              title="Eliminar como moderación: elige el motivo"
              confirmLabel="Eliminar"
              onCancel={close}
              onSubmit={(reason) => run(() => onDelete(comment, reason))}
            />
          )}
        </div>
      </div>
    </li>
  )
}
