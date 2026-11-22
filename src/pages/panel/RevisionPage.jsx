import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import PanelShell, { LoadState, PanelNotice } from '../../components/panel/PanelShell'
import MathText from '../../components/math/MathText'
import ReviewImages from '../../components/images/ReviewImages'
import VocabularyPicker from '../../components/submissions/VocabularyPicker'
import ExamFolderPicker from '../../components/submissions/ExamFolderPicker'
import { apiFetch } from '../../lib/api'
import { PANEL, fechaHora, useApiData } from '../../lib/panel'

const LEVEL_TONES = { error: 'bg-tp-orange-soft', warning: 'bg-tp-yellow-soft', info: 'bg-tp-sky-soft' }
const sameList = (a, b) => [...a].sort().join(',') === [...b].sort().join(',')

function Findings({ findings }) {
  if (!findings?.length) return <p className="text-sm text-tp-ink-muted">Revisiones automáticas: todo bien.</p>
  return (
    <ul className="flex flex-col gap-1.5" aria-label="Revisiones automáticas">
      {findings.map((finding) => <li key={`${finding.code}-${finding.message}`} className={`rounded-[10px] px-3 py-2 text-sm ${LEVEL_TONES[finding.level]}`}>{finding.message}</li>)}
    </ul>
  )
}

function Proposal({ data, label }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">{label}</p>}
      <MathText text={data.enunciado} className="tp-reading-text whitespace-pre-wrap break-words leading-7" />
      <ReviewImages images={data.images} />
      <p className="flex flex-wrap gap-2 text-sm">
        {data.isExam && <span className="tp-pill bg-tp-surface text-xs">{data.examFolder?.replace(/^Exámenes › /, '') ?? 'Sin carpeta'}{data.problemNumber ? ` · Problema ${data.problemNumber}` : ''}</span>}
        {data.topics.map((name) => <span key={name} className="tp-pill bg-tp-sky-soft text-xs">{name}</span>)}
        {data.tags.map((name) => <span key={name} className="tp-pill bg-tp-violet-soft text-xs">{name}</span>)}
      </p>
    </div>
  )
}

// The full review of one submission: fix áreas, tags, folder, number or
// title, then approve; or reject with a reason the author will read.
function ReviewForm({ id, token, vocab, onDone }) {
  const detail = useApiData(`/api/review/submissions/${id}`, token)
  const d = detail.data
  if (!d) return <LoadState loading={detail.loading} error={detail.error} />
  return <ReviewFields key={d.id} d={d} token={token} vocab={vocab} onDone={onDone} />
}

function ReviewFields({ d, token, vocab, onDone }) {
  const formId = useId()
  const original = d.proposedIds
  const [form, setForm] = useState({ ...original, problemNumber: original.problemNumber ?? '', title: '' })
  const [reason, setReason] = useState('')
  const [state, setState] = useState({ busy: false, error: null, checks: [] })
  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const act = async (path, body) => {
    setState({ busy: true, error: null, checks: [] })
    try {
      await apiFetch(path, { method: 'POST', token, body })
      onDone()
    } catch (error) {
      setState({ busy: false, error: error.message, checks: error.data?.checks || [] })
    }
  }
  const approve = () => {
    const fixes = {}
    if (!sameList(form.topics, original.topics)) fixes.topics = form.topics
    if (!sameList(form.tags, original.tags)) fixes.tags = form.tags
    if (!form.isExam && original.isExam) fixes.notExam = true
    if (form.isExam && form.examFolder && form.examFolder !== original.examFolder) fixes.folder = form.examFolder
    const number = form.isExam && form.problemNumber !== '' ? Number(form.problemNumber) : null
    if (form.isExam && number !== (original.problemNumber ?? null) && number !== null) fixes.number = number
    if (form.title.trim()) fixes.title = form.title.trim()
    return act(`/api/review/submissions/${d.id}/approve`, { fixes })
  }

  return (
    <div className="flex flex-col gap-5 border-t-2 border-dashed border-tp-rule pt-5">
      {d.live && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="tp-card-quiet bg-tp-paper p-4"><Proposal data={d.live} label="Publicado ahora" /></div>
          <div className="tp-card-quiet bg-tp-yellow-soft p-4"><Proposal data={d.proposed} label={`Propuesto · cambia: ${d.changedFields.join(', ') || 'nada'}`} /></div>
        </div>
      )}
      <Findings findings={d.findings} />
      <label className="flex flex-col gap-2 text-sm font-bold">
        Título (opcional)
        <input value={form.title} onChange={(event) => set('title', event.target.value)} maxLength={200} placeholder={d.titulo || 'Se calcula solo'} className="tp-input font-normal" />
        <span className="font-normal text-tp-ink-muted">Déjalo vacío para usar «{d.titulo}» (los problemas de examen toman el nombre de su carpeta).</span>
      </label>
      <VocabularyPicker topics={vocab.topics} tags={vocab.tags} value={{ topics: form.topics, tags: form.tags }} onChange={(next) => setForm((current) => ({ ...current, ...next }))} allowReserved />
      <div className="flex flex-col gap-3">
        <label className="inline-flex min-h-11 items-center gap-3 text-sm font-bold">
          <input type="checkbox" checked={form.isExam} onChange={(event) => set('isExam', event.target.checked)} className="h-5 w-5 accent-tp-violet" />
          Es un problema de examen
        </label>
        {form.isExam && (
          <>
            <ExamFolderPicker token={token} folders={vocab.folders} value={form.examFolder} onChange={(folderId) => set('examFolder', folderId)} onFolderCreated={vocab.addFolder} />
            <label className="max-w-xs text-sm font-semibold">
              Número de problema (opcional)
              <input type="number" min={1} max={999} inputMode="numeric" value={form.problemNumber} onChange={(event) => set('problemNumber', event.target.value)} className="tp-input mt-1 font-normal" />
            </label>
          </>
        )}
      </div>
      {state.error && (
        <div role="alert" className="tp-card-quiet bg-tp-orange-soft p-4 text-sm leading-6">
          <p className="font-bold">{state.error}</p>
          {state.checks.length > 0 && <ul className="mt-2 list-disc pl-5">{state.checks.filter((check) => check.level === 'error').map((check) => <li key={`${check.code}-${check.message}`}>{check.message}</li>)}</ul>}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={state.busy} onClick={approve} className="tp-button bg-tp-mint px-5 font-bold text-tp-ink disabled:opacity-60">{d.kind === 'edit' ? 'Aprobar cambios' : 'Aprobar y publicar'}</button>
      </div>
      <div className="flex flex-col gap-2 border-t-2 border-dashed border-tp-rule pt-4">
        <label htmlFor={`${formId}-motivo`} className="text-sm font-bold">Motivo del rechazo (la persona autora lo leerá)</label>
        <textarea id={`${formId}-motivo`} value={reason} onChange={(event) => setReason(event.target.value)} rows={2} maxLength={1000} placeholder="Por ejemplo: falta decir que $n$ es entero positivo." className="tp-input" />
        <div><button type="button" disabled={state.busy || reason.trim().length < 5} onClick={() => act(`/api/review/submissions/${d.id}/reject`, { reason })} className="tp-button bg-tp-orange px-4 text-sm font-bold text-tp-ink disabled:opacity-60">Rechazar</button></div>
      </div>
    </div>
  )
}

function SubmissionCard({ item, token, vocab, onDone }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-tp-violet">{item.codigo}</span>
        <span className={`tp-pill text-xs ${item.kind === 'edit' ? 'bg-tp-sky-soft' : 'bg-tp-yellow-soft'}`}>{item.kind === 'edit' ? 'Cambio a un problema publicado' : 'Problema nuevo'}</span>
        {item.examFolderStatus === 'pending' && <span className="tp-pill bg-tp-yellow-soft text-xs">Carpeta en revisión</span>}
        <span className="text-sm text-tp-ink-muted">@{item.author ?? '—'} · {fechaHora(item.createdAt)}</span>
      </div>
      {!open && <Proposal data={item} />}
      {!open && item.findings.some((f) => f.level !== 'info') && <Findings findings={item.findings.filter((f) => f.level !== 'info')} />}
      {open && !item.live && <Proposal data={item} />}
      <div>
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="tp-button bg-tp-surface px-4 text-sm font-bold">{open ? 'Cerrar' : 'Revisar'}</button>
      </div>
      {open && <ReviewForm id={item.id} token={token} vocab={vocab} onDone={onDone} />}
    </article>
  )
}

function FolderCard({ folder, token, onDone }) {
  const id = useId()
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [state, setState] = useState({ busy: false, error: null })
  const act = async (path, body) => {
    setState({ busy: true, error: null })
    try {
      await apiFetch(path, { method: 'POST', token, body })
      setState({ busy: false, error: null })
      setName('')
      onDone()
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  return (
    <article className="tp-card-soft flex flex-col gap-3 bg-tp-surface p-5">
      <h3 className="font-bold">{folder.path.replace(/^Exámenes › /, '')}</h3>
      <p className="text-sm text-tp-ink-muted">@{folder.createdBy ?? '—'} · {fechaHora(folder.createdAt)} · {folder.pendingSubmissions} {folder.pendingSubmissions === 1 ? 'envío la usa' : 'envíos la usan'}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={state.busy} onClick={() => act(`/api/review/folders/${folder.id}/approve`)} className="tp-button bg-tp-mint px-4 text-sm font-bold text-tp-ink disabled:opacity-60">Aprobar carpeta</button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label htmlFor={`${id}-nombre`} className="flex-1 text-sm font-bold">Nuevo nombre
          <input id={`${id}-nombre`} value={name} onChange={(event) => setName(event.target.value)} maxLength={80} className="tp-input mt-1 font-normal" />
        </label>
        <button type="button" disabled={state.busy || !name.trim()} onClick={() => act(`/api/review/folders/${folder.id}/rename`, { name })} className="tp-button bg-tp-surface px-4 text-sm font-bold disabled:opacity-60">Renombrar</button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label htmlFor={`${id}-motivo`} className="flex-1 text-sm font-bold">Motivo del rechazo
          <input id={`${id}-motivo`} value={reason} onChange={(event) => setReason(event.target.value)} maxLength={300} className="tp-input mt-1 font-normal" />
        </label>
        <button type="button" disabled={state.busy || reason.trim().length < 5} onClick={() => act(`/api/review/folders/${folder.id}/reject`, { reason })} className="tp-button bg-tp-orange px-4 text-sm font-bold text-tp-ink disabled:opacity-60">Rechazar</button>
      </div>
      {state.error && <p role="alert" className="text-sm font-semibold text-red-700">{state.error}</p>}
    </article>
  )
}

// Áreas, tags and every exam folder (pending ones too), loaded once.
function useVocabulary(token) {
  const [vocab, setVocab] = useState({ topics: [], tags: [], folders: [] })
  useEffect(() => {
    let cancelled = false
    Promise.all([apiFetch('/api/topics'), apiFetch('/api/tags'), apiFetch('/api/review/folders', { token })])
      .then(([topics, tags, folders]) => { if (!cancelled) setVocab({ topics, tags, folders }) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token])
  return { ...vocab, addFolder: (folder) => setVocab((current) => ({ ...current, folders: [...current.folders, folder] })) }
}

// /panel/revision — admins review what the community proposed.
export default function RevisionPage() {
  return (
    <PanelShell title="Revisión" lead="Problemas y carpetas de examen que propuso la comunidad. Al aprobar se publican y la persona autora recibe un aviso." minimum="admin">
      {(auth) => <Revision token={auth.token} />}
    </PanelShell>
  )
}

function Revision({ token }) {
  const queue = useApiData('/api/review', token)
  const vocab = useVocabulary(token)
  const data = queue.data
  if (!data) return <LoadState loading={queue.loading} error={queue.error} />
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="envios-titulo" className="flex max-w-[840px] flex-col gap-4">
        <h2 id="envios-titulo" className="tp-section-title">Problemas ({data.submissions.length})</h2>
        {data.submissions.length === 0 && <PanelNotice kicker="Al día" text="No hay problemas esperando revisión." />}
        {data.submissions.map((item) => <SubmissionCard key={item.id} item={item} token={token} vocab={vocab} onDone={queue.reload} />)}
      </section>
      <section aria-labelledby="carpetas-titulo" className="flex flex-col gap-4">
        <h2 id="carpetas-titulo" className="tp-section-title">Carpetas de examen ({data.folders.length})</h2>
        {data.folders.length === 0 && <PanelNotice kicker="Al día" text="No hay carpetas esperando revisión." />}
        <div className="grid gap-5 lg:grid-cols-2">{data.folders.map((folder) => <FolderCard key={folder.id} folder={folder} token={token} onDone={queue.reload} />)}</div>
      </section>
      {data.openFlags > 0 && <p className="text-sm"><Link to={PANEL.moderacion} className="font-bold text-tp-violet underline underline-offset-2">{data.openFlags} {data.openFlags === 1 ? 'reporte de error abierto' : 'reportes de error abiertos'} en Moderación →</Link></p>}
    </div>
  )
}
