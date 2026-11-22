import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import PanelShell, { LoadState, Segmented } from '../../components/panel/PanelShell'
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

// Note box + buttons for closing one item. `actions` are { label, tone, run(note) }.
function CloseActions({ actions, noteLabel = 'Nota (opcional)' }) {
  const id = useId()
  const [note, setNote] = useState('')
  const [state, setState] = useState({ busy: false, error: null })
  const go = async (action) => {
    setState({ busy: true, error: null })
    try {
      await action.run(note.trim())
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  return (
    <div className="flex flex-col gap-2 border-t-2 border-dashed border-tp-rule pt-4">
      <label htmlFor={id} className="text-sm font-bold">{noteLabel}</label>
      <input id={id} value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="Por ejemplo: corregido en el enunciado" className="tp-input" />
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <button key={action.label} type="button" disabled={state.busy} onClick={() => go(action)} className={`tp-button px-4 text-sm font-bold disabled:opacity-60 ${action.tone}`}>{action.label}</button>
        ))}
      </div>
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
    </div>
  )
}

function FlagCard({ flag, token, onDone }) {
  const isProblem = flag.targetType === 'problem'
  const href = isProblem ? `/entrenamiento/problemas/${flag.target}` : `/entrenamiento/teoria/${flag.target}`
  const close = (status) => async (note) => {
    await apiFetch(`/api/flags/${flag.id}/status`, { method: 'POST', token, body: { status, note } })
    onDone()
  }
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`tp-pill text-xs ${isProblem ? 'bg-tp-sky-soft' : 'bg-tp-mint-soft'}`}>{isProblem ? 'Problema' : 'Lección'}</span>
        {flag.status !== 'open' && <span className="tp-pill bg-tp-surface text-xs">{STATUS_LABEL[flag.status]}</span>}
        <span className="text-sm text-tp-ink-muted">{fechaHora(flag.createdAt)} · @{flag.reporter ?? 'cuenta eliminada'}</span>
      </div>
      <h3 className="font-display text-[19px] font-extrabold leading-snug">
        <Link to={href} className="underline-offset-4 hover:text-tp-violet hover:underline">{flag.targetName}</Link>
      </h3>
      <p className="whitespace-pre-wrap break-words leading-7">{flag.message}</p>
      <div className="flex flex-wrap gap-4 text-sm font-bold">
        <Link to={href} className="min-h-11 content-center text-tp-violet underline underline-offset-2">Ver {isProblem ? 'problema' : 'lección'}</Link>
        <Link to={isProblem ? editProblemPath(flag.target) : editLessonPath(flag.target)} className="min-h-11 content-center text-tp-violet underline underline-offset-2">Editar</Link>
      </div>
      {flag.status === 'open'
        ? <CloseActions actions={[
          { label: 'Marcar como resuelto', tone: 'bg-tp-mint text-tp-ink', run: close('resolved') },
          { label: 'Descartar', tone: 'bg-tp-surface text-tp-ink', run: close('dismissed') },
        ]} />
        : <p className="text-sm text-tp-ink-muted">{STATUS_LABEL[flag.status]} por @{flag.handledBy ?? '—'}{flag.handledAt ? ` el ${fechaHora(flag.handledAt)}` : ''}{flag.handledNote ? `: ${flag.handledNote}` : ''}</p>}
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

// /panel/moderacion — every comment report and error report (editors and admins).
export default function ModeracionPage() {
  return (
    <PanelShell title="Moderación" lead="Comentarios reportados por la comunidad y errores reportados en problemas y lecciones.">
      {(auth) => <Moderacion token={auth.token} />}
    </PanelShell>
  )
}

function Moderacion({ token }) {
  const [tab, setTab] = useState('flags')
  const [status, setStatus] = useState('open')
  const flags = useApiData(`/api/flags?status=${status}`, token)
  const reports = useApiData(`/api/reports?status=${status}`, token)
  const current = tab === 'flags' ? flags : reports
  const items = current.data || []
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented label="Tipo de reporte" value={tab} onChange={setTab} options={[
          { value: 'flags', label: `Errores${flags.data && status === 'open' ? ` (${flags.data.length})` : ''}` },
          { value: 'comments', label: `Comentarios${reports.data && status === 'open' ? ` (${reports.data.length})` : ''}` },
        ]} />
        <Segmented label="Estado" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
      </div>
      <LoadState loading={current.loading && !current.data} error={current.error} empty={!current.loading && items.length === 0} emptyText={status === 'open' ? 'No hay reportes abiertos.' : 'No hay reportes con este estado.'} />
      <div className="grid gap-5 lg:grid-cols-2">
        {tab === 'flags' && items.map((flag) => <FlagCard key={flag.id} flag={flag} token={token} onDone={flags.reload} />)}
        {tab === 'comments' && items.map((group) => <CommentReportCard key={group.comment._id} group={group} status={status} token={token} onDone={reports.reload} />)}
      </div>
    </div>
  )
}
