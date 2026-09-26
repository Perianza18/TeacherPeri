import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'

const LEVEL_LABELS = { introductorio: 'Introductorio', omm: 'OMM', avanzado: 'Avanzado' }

function joinedPath(slugs) {
  return `/rutas/${slugs.map(encodeURIComponent).join('/')}`
}

export function ChildPathCard({ child, slugs }) {
  if (child.available) return (
    <Link to={joinedPath([...slugs, child.slug])} className="block rounded-xl border border-brand-200 bg-white p-5 transition hover:border-[#E57505]">
        <p className="text-xs font-semibold text-brand-500">Paso {child.order}</p>
        <h3 className="mt-1 text-lg font-semibold text-brand-900">{child.title}</h3>
        {child.description && <p className="mt-2 text-sm text-brand-600">{child.description}</p>}
    </Link>
  )
  if (child.plannedPreview) return (
    <article
      aria-disabled="true"
      aria-label={`${child.title} — Próximamente`}
      className="rounded-xl border border-brand-200 bg-brand-50 p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-brand-500">Paso {child.order}</p>
          <h3 className="mt-1 text-lg font-semibold text-brand-800">{child.title}</h3>
        </div>
        <span className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700">Próximamente</span>
      </div>
    </article>
  )
  return <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-600">Este tramo de la Ruta no está disponible públicamente.</div>
}

export function PathSectionHeading({ section, index }) {
  return (
    <div key={`${section._id}-${index}`} className="pt-3">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-800">{section.title}</h3>
        {section.state === 'under-construction' && <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">En construcción</span>}
      </div>
      {section.state === 'under-construction' && <p className="mt-1 text-sm text-brand-600">Estamos preparando y organizando el contenido de este ciclo.</p>}
    </div>
  )
}

export default function PathPage() {
  const location = useLocation()
  const { auth, abrirModal } = useAuth()
  const slugs = useMemo(
    () => location.pathname.split('/').filter(Boolean).slice(1).map(decodeURIComponent),
    [location.pathname],
  )
  const traversalKey = slugs.join('/')
  const [detailState, setDetailState] = useState({ traversalKey: null, detail: null, error: null })
  const [progressState, setProgressState] = useState({ progressKey: null, progress: null })
  const [updating, setUpdating] = useState(false)
  const loading = detailState.traversalKey !== traversalKey
  const detail = loading ? null : detailState.detail
  const error = loading ? null : detailState.error

  useEffect(() => {
    let cancelled = false
    const request = slugs.length === 1
      ? apiFetch(`/api/paths/${encodeURIComponent(slugs[0])}`)
      : apiFetch(`/api/paths?traversal=${encodeURIComponent(slugs.join('/'))}`)
    request.then((result) => {
      if (cancelled) return
      setDetailState({ traversalKey, detail: result, error: null })
    }).catch((requestError) => {
      if (cancelled) return
      setDetailState({ traversalKey, detail: null, error: requestError.status === 404 ? 'Esta Ruta no existe en ese recorrido público.' : requestError.message })
    })
    return () => { cancelled = true }
  }, [slugs, traversalKey])

  const pathSlug = detail?.path?.slug
  const progressKey = auth && pathSlug ? `${auth.user.id}\u0000${pathSlug}` : null

  useEffect(() => {
    let cancelled = false
    if (!auth || !pathSlug || !progressKey) return undefined
    apiFetch(`/api/paths/${encodeURIComponent(pathSlug)}/progress`, { token: auth.token })
      .then((result) => !cancelled && setProgressState({ progressKey, progress: result }))
      .catch(() => !cancelled && setProgressState({ progressKey, progress: null }))
    return () => { cancelled = true }
  }, [auth, pathSlug, progressKey])

  async function setCompletion(completed) {
    if (!auth) {
      abrirModal()
      return
    }
    setUpdating(true)
    try {
      const result = await apiFetch(`/api/paths/${encodeURIComponent(detail.path.slug)}/completion`, {
        method: 'PUT',
        body: { completed },
        token: auth.token,
      })
      setProgressState({ progressKey, progress: result.progress })
    } catch (requestError) {
      setDetailState((current) => current.traversalKey === traversalKey ? { ...current, error: requestError.message } : current)
    } finally {
      setUpdating(false)
    }
  }

  const path = detail?.path
  const visibleProgress = progressKey === progressState.progressKey ? progressState.progress : null
  const completed = visibleProgress?.percentage === 100

  return (
    <main className="min-h-screen bg-[#FFFBF5]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        {loading && <p className="text-brand-600">Cargando Ruta…</p>}
        {error && <p className="rounded-xl bg-red-50 p-5 text-red-700">{error}</p>}
        {path && (
          <>
            <nav aria-label="Migas de pan" className="flex flex-wrap gap-2 text-sm text-brand-600">
              {detail.breadcrumbs.map((crumb, index) => (
                <span key={crumb.slug} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">›</span>}
                  {index === detail.breadcrumbs.length - 1
                    ? <span className="text-brand-900">{crumb.title}</span>
                    : <Link to={joinedPath(detail.breadcrumbs.slice(0, index + 1).map((entry) => entry.slug))} className="underline">{crumb.title}</Link>}
                </span>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Ruta</p>
              <h1 className="mt-2 font-display text-4xl text-brand-900">{path.title}</h1>
              {path.description && <p className="mt-4 max-w-3xl text-brand-600">{path.description}</p>}
              {path.level && <p className="mt-4 text-sm font-medium text-brand-700">Nivel: {LEVEL_LABELS[path.level]}</p>}
              {path.tags?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{path.tags.map((tag) => <span key={tag._id} className="rounded-full bg-brand-100 px-2 py-1 text-xs text-brand-700">{tag.label}</span>)}</div>}
              {visibleProgress && <p className="mt-5 text-sm font-medium text-brand-700">Progreso: {visibleProgress.completedLeaves} de {visibleProgress.totalLeaves} Rutas hoja · {visibleProgress.percentage}%</p>}
              {path.kind === 'leaf' && (
                <button
                  type="button"
                  onClick={() => setCompletion(!completed)}
                  disabled={updating}
                  className="mt-5 rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {!auth ? 'Inicia sesión para marcarla completa' : completed ? 'Marcar como pendiente' : 'Marcar Ruta completa'}
                </button>
              )}
            </div>

            {path.kind === 'parent' && (
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold text-brand-900">Siguientes Rutas</h2>
                {path.presentation.map((item, index) => (
                  item.type === 'section'
                    ? <PathSectionHeading key={`${item.section._id}-${index}`} section={item.section} index={index} />
                    : <ChildPathCard key={item.child.order} child={item.child} slugs={slugs} />
                ))}
              </div>
            )}

            {path.kind === 'leaf' && (
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold text-brand-900">Pasos</h2>
                {path.steps.map((step) => (
                  <article key={step._id} className="rounded-xl border border-brand-200 bg-white p-5">
                    <p className="text-xs font-semibold text-brand-500">Paso {step.order}</p>
                    <h3 className="mt-1 text-lg font-semibold text-brand-900">{step.title}</h3>
                    {step.description && <p className="mt-2 whitespace-pre-wrap text-brand-600">{step.description}</p>}
                    {step.teacherperiReferences.length > 0 && <div className="mt-4"><h4 className="text-sm font-semibold text-brand-800">Material de TeacherPeri</h4><ul className="mt-2 space-y-1 text-sm">{step.teacherperiReferences.map((reference) => <li key={`${reference.contentType}-${reference.targetId}`}>{reference.available ? <Link className="text-brand-700 underline" to={reference.href}>{reference.title}</Link> : <span className="text-brand-500">Material actualmente no disponible.</span>}</li>)}</ul></div>}
                    {step.extraResources.length > 0 && <div className="mt-4"><h4 className="text-sm font-semibold text-brand-800">Recursos adicionales</h4><ul className="mt-2 space-y-1 text-sm">{step.extraResources.map((resource) => <li key={resource.url}><a className="text-brand-700 underline" href={resource.url} target="_blank" rel="noreferrer">{resource.label}</a>{resource.description && <span className="text-brand-600"> · {resource.description}</span>}</li>)}</ul></div>}
                  </article>
                ))}
              </div>
            )}

            {path.relatedPaths.length > 0 && (
              <aside className="mt-8 rounded-2xl border border-brand-200 bg-white p-5">
                <h2 className="text-xl font-semibold text-brand-900">Rutas relacionadas</h2>
                <div className="mt-4 space-y-3">
                  {path.relatedPaths.map((related) => (
                    related.available ? (
                      <Link key={`${related.relationshipType}-${related.targetPath}`} to={`/rutas/${related.slug}`} className="block rounded-xl border border-brand-100 p-4 transition hover:border-[#E57505]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{related.label}</p>
                        <h3 className="mt-1 font-semibold text-brand-900">{related.title}</h3>
                        {related.description && <p className="mt-1 text-sm text-brand-600">{related.description}</p>}
                      </Link>
                    ) : <div key={`${related.relationshipType}-${related.targetPath}`} className="rounded-xl border border-brand-100 p-4 text-sm text-brand-600">{related.label}: esta Ruta no está disponible públicamente.</div>
                  ))}
                </div>
              </aside>
            )}
          </>
        )}
      </section>
    </main>
  )
}
