import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import PanelShell, { CloseActions, LoadState, Segmented } from '../../components/panel/PanelShell'
import MathText from '../../components/math/MathText'
import { apiFetch } from '../../lib/api'
import { MODERATION_REASONS, REASON_NOTE_MAX } from '../../lib/moderation'
import { editLessonPath, editProblemPath, fechaHora, useApiData } from '../../lib/panel'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Abiertos' },
  { value: 'resolved', label: 'Resueltos' },
  { value: 'dismissed', label: 'Descartados' },
]
const STATUS_LABEL = { resolved: 'Resuelto', dismissed: 'Descartado' }
const reasonLabel = (value) => MODERATION_REASONS.find((reason) => reason.value === value)?.label || value

// A problem or a lesson reported as inappropriate («Reportar»).
function ContentReportCard({ report, token, onDone }) {
  const isProblem = report.targetType === 'problem'
  const href = isProblem ? `/entrenamiento/problemas/${report.target}` : `/entrenamiento/teoria/${report.target}`
  const close = (status) => async (note) => {
    await apiFetch(`/api/reports/content/${report.id}/status`, { method: 'POST', token, body: { status, note } })
    onDone()
  }
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`tp-pill text-xs ${isProblem ? 'bg-tp-sky-soft' : 'bg-tp-mint-soft'}`}>{isProblem ? 'Problema' : 'Lección'}</span>
        {report.status !== 'open' && <span className="tp-pill bg-tp-surface text-xs">{STATUS_LABEL[report.status]}</span>}
        <span className="text-sm text-tp-ink-muted">{fechaHora(report.createdAt)} · @{report.reporter ?? 'cuenta eliminada'}</span>
      </div>
      <h3 className="font-display text-[19px] font-extrabold leading-snug">
        <Link to={href} className="underline-offset-4 hover:text-tp-violet hover:underline">{report.targetName}</Link>
      </h3>
      <p className="leading-7"><strong>{reasonLabel(report.reason)}</strong>{report.note ? `: ${report.note}` : ''}</p>
      <div className="flex flex-wrap gap-4 text-sm font-bold">
        <Link to={href} className="min-h-11 content-center text-tp-violet underline underline-offset-2">Ver {isProblem ? 'problema' : 'lección'}</Link>
        <Link to={isProblem ? editProblemPath(report.target) : editLessonPath(report.target)} className="min-h-11 content-center text-tp-violet underline underline-offset-2">{isProblem ? 'Editar problema' : 'Editar lección'}</Link>
      </div>
      {report.status === 'open'
        ? <CloseActions placeholder="Por ejemplo: quité el enlace" actions={[
          { label: 'Marcar como resuelto', tone: 'bg-tp-mint text-tp-ink', run: close('resolved') },
          { label: 'Descartar', tone: 'bg-tp-surface text-tp-ink', run: close('dismissed') },
        ]} />
        : <p className="text-sm text-tp-ink-muted">{STATUS_LABEL[report.status]} por @{report.handledBy ?? '—'}{report.handledAt ? ` el ${fechaHora(report.handledAt)}` : ''}{report.handledNote ? `: ${report.handledNote}` : ''}</p>}
    </article>
  )
}

function DeleteComment({ group, token, onDone }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [state, setState] = useState({ busy: false, error: null })
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="tp-button bg-tp-orange px-4 text-sm font-bold text-tp-ink">Eliminar comentario</button>
  const submit = async (event) => {
    event.preventDefault()
    if (!reason) return setState({ busy: false, error: 'Elige un motivo.' })
    if (reason === 'otro' && !note.trim()) return setState({ busy: false, error: 'Escribe el motivo.' })
    setState({ busy: true, error: null })
    try {
      await apiFetch(`/api/problems/${group.problem._id}/comments/${group.comment._id}`, { method: 'DELETE', token, body: { reason, note: note.trim() || undefined } })
      onDone()
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  return (
    <form onSubmit={submit} className="tp-card-quiet flex w-full flex-col gap-2 bg-tp-orange-soft p-4">
      <label htmlFor={`${id}-motivo`} className="text-sm font-bold">Motivo para eliminarlo</label>
      <select id={`${id}-motivo`} value={reason} onChange={(event) => setReason(event.target.value)} className="tp-input">
        <option value="">Elige un motivo…</option>
        {MODERATION_REASONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <label htmlFor={`${id}-nota`} className="text-sm font-bold">{reason === 'otro' ? '¿Cuál es el motivo?' : 'Nota (opcional)'}</label>
      <input id={`${id}-nota`} value={note} onChange={(event) => setNote(event.target.value)} maxLength={REASON_NOTE_MAX} className="tp-input" />
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={state.busy} className="tp-button bg-tp-ink px-4 text-sm font-bold text-white disabled:opacity-60">{state.busy ? 'Eliminando…' : 'Eliminar comentario'}</button>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-1 text-sm font-semibold underline">Cancelar</button>
      </div>
    </form>
  )
}

function CommentReportCard({ group, status, token, onDone }) {
  const href = `/entrenamiento/problemas/${group.problem._id}`
  const dismiss = async (note) => {
    await apiFetch(`/api/reports/comments/${group.comment._id}/dismiss`, { method: 'POST', token, body: { note } })
    onDone()
  }
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="tp-pill bg-tp-orange-soft text-xs">{group.count} {group.count === 1 ? 'reporte' : 'reportes'}</span>
        {group.comment.status === 'deleted' && <span className="tp-pill bg-tp-surface text-xs">Comentario eliminado</span>}
        <span className="text-sm text-tp-ink-muted">En <Link to={href} className="font-semibold text-tp-violet underline underline-offset-2">{group.problem.codigo ? `${group.problem.codigo} «${group.problem.titulo}»` : 'un problema'}</Link></span>
      </div>
      <blockquote className="rounded-[10px] border-2 border-dashed border-tp-rule p-4">
        <p className="text-sm font-bold">@{group.comment.author?.username ?? 'cuenta eliminada'} · <span className="font-normal text-tp-ink-muted">{fechaHora(group.comment.createdAt)}</span></p>
        <MathText text={group.comment.body} className="mt-2 whitespace-pre-wrap break-words leading-7" />
      </blockquote>
      <ul className="flex flex-col gap-1.5 text-sm">
        {group.reports.map((report) => (
          <li key={report._id}>
            <strong>{reasonLabel(report.reason)}</strong>{report.note ? `: ${report.note}` : ''} <span className="text-tp-ink-muted">· @{report.reporter?.username ?? '—'} · {fechaHora(report.createdAt)}</span>
            {report.handledNote && <span className="block text-tp-ink-muted">Nota: {report.handledNote}</span>}
          </li>
        ))}
      </ul>
      {status === 'open' && group.comment.status !== 'deleted' && (
        <>
          <CloseActions noteLabel="Nota al descartar (opcional)" actions={[{ label: 'Descartar reportes (el comentario se queda)', tone: 'bg-tp-surface text-tp-ink', run: dismiss }]} />
          <div className="flex flex-wrap"><DeleteComment group={group} token={token} onDone={onDone} /></div>
        </>
      )}
    </article>
  )
}

// /panel/moderacion — reports of inappropriate content only: comments,
// problems and lessons (editors and admins). Content corrections are
// suggestions and live in Revisión.
export default function ModeracionPage() {
  return (
    <PanelShell title="Moderación" lead="Reportes de contenido inapropiado: comentarios, problemas y lecciones. Las correcciones de contenido llegan a Revisión como sugerencias.">
      {(auth) => <Moderacion token={auth.token} />}
    </PanelShell>
  )
}

function Moderacion({ token }) {
  const [tab, setTab] = useState('comments')
  const [status, setStatus] = useState('open')
  const comments = useApiData(`/api/reports?status=${status}`, token)
  const content = useApiData(`/api/reports/content?status=${status}`, token)
  const current = tab === 'content' ? content : comments
  const items = current.data || []
  const count = (source) => (source.data && status === 'open' ? ` (${source.data.length})` : '')
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented label="Tipo de reporte" value={tab} onChange={setTab} options={[
          { value: 'comments', label: `Comentarios${count(comments)}` },
          { value: 'content', label: `Problemas y lecciones${count(content)}` },
        ]} />
        <Segmented label="Estado" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
      </div>
      <LoadState loading={current.loading && !current.data} error={current.error} empty={!current.loading && items.length === 0} emptyText={status === 'open' ? 'No hay reportes abiertos.' : 'No hay reportes con este estado.'} />
      <div className="grid gap-5 lg:grid-cols-2">
        {tab === 'content' && items.map((report) => <ContentReportCard key={report.id} report={report} token={token} onDone={content.reload} />)}
        {tab === 'comments' && items.map((group) => <CommentReportCard key={group.comment._id} group={group} status={status} token={token} onDone={comments.reload} />)}
      </div>
    </div>
  )
}
