import { Link, useParams } from 'react-router-dom'
import PanelShell, { LoadState } from '../../components/panel/PanelShell'
import { PANEL, ROLE_NAMES, editLessonPath, editProblemPath, fechaHora, useApiData } from '../../lib/panel'

const shown = (value) => {
  if (value === null || value === undefined || value === '') return '(vacío)'
  return Array.isArray(value) ? (value.length ? value.join(', ') : '(ninguna)') : String(value)
}

// /panel/cambios — every direct change by editors and admins, newest first.
export default function CambiosPage() {
  return (
    <PanelShell title="Cambios de editores" lead="Cada cambio que un editor o admin guarda en un problema o una lección." minimum="admin">
      {(auth) => <Lista token={auth.token} />}
    </PanelShell>
  )
}

function Lista({ token }) {
  const revisions = useApiData('/api/editor/revisions', token)
  return (
    <div className="flex max-w-[840px] flex-col gap-4">
      <LoadState loading={revisions.loading && !revisions.data} error={revisions.error} empty={revisions.data?.length === 0} emptyText="Todavía nadie ha editado contenido desde el sitio." />
      {revisions.data?.length > 0 && (
        <ol className="flex flex-col gap-3">
          {revisions.data.map((revision) => (
            <li key={revision._id}>
              <Link to={`${PANEL.cambios}/${revision._id}`} className="tp-card-soft tp-lift flex flex-col gap-2 bg-tp-surface p-4 sm:p-5">
                <span className="text-sm text-tp-ink-muted">{fechaHora(revision.createdAt)} · @{revision.editor ?? '—'} ({ROLE_NAMES[revision.editorRole] ?? revision.editorRole})</span>
                <span className="font-bold">{revision.targetType === 'problem' ? 'Problema' : 'Lección'} {revision.targetLabel}</span>
                <span className="flex flex-wrap gap-2">{revision.changes.map((change) => <span key={change.field} className="tp-pill bg-tp-violet-soft text-xs">{change.label}</span>)}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

// /panel/cambios/:id — one change, field by field, before and after.
export function CambioPage() {
  const { id } = useParams()
  return (
    <PanelShell title="Detalle del cambio" minimum="admin" back={{ to: PANEL.cambios, label: 'Cambios de editores' }}>
      {(auth) => <Detalle id={id} token={auth.token} />}
    </PanelShell>
  )
}

function Detalle({ id, token }) {
  const revision = useApiData(`/api/editor/revisions/${id}`, token)
  const r = revision.data
  if (!r) return <LoadState loading={revision.loading} error={revision.error} />
  return (
    <div className="flex max-w-[1120px] flex-col gap-6">
      <section className="tp-card-soft flex flex-col gap-2 bg-tp-surface p-5 sm:p-6">
        <p className="text-sm text-tp-ink-muted">{fechaHora(r.createdAt)} · @{r.editor ?? '—'} ({ROLE_NAMES[r.editorRole] ?? r.editorRole})</p>
        <h2 className="font-display text-[22px] font-extrabold leading-tight">{r.targetType === 'problem' ? 'Problema' : 'Lección'} {r.targetLabel}</h2>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <Link to={r.href} className="min-h-11 content-center text-tp-violet underline underline-offset-2">Ver {r.targetType === 'problem' ? 'problema' : 'lección'}</Link>
          <Link to={r.targetType === 'problem' ? editProblemPath(r.target) : editLessonPath(r.target)} className="min-h-11 content-center text-tp-violet underline underline-offset-2">Editar</Link>
        </div>
      </section>
      {r.changes.map((change) => (
        <section key={change.field} aria-labelledby={`campo-${change.field}`} className="flex flex-col gap-3">
          <h3 id={`campo-${change.field}`} className="tp-eyebrow">{change.label}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="tp-card-quiet min-w-0 bg-tp-orange-soft p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.12em]">Antes</p>
              <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6">{shown(change.before)}</pre>
            </div>
            <div className="tp-card-quiet min-w-0 bg-tp-mint-soft p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.12em]">Después</p>
              <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6">{shown(change.after)}</pre>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
