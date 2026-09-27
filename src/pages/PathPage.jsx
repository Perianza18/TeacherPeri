import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'

const LEVEL_LABELS = { introductorio: 'Introductorio', omm: 'OMM', avanzado: 'Avanzado' }

function joinedPath(slugs) {
  return `/rutas/${slugs.map(encodeURIComponent).join('/')}`
}

function ChildPathCard({ child, slugs }) {
  if (!child.available) {
    return <div className="rounded-2xl border border-brand-200 bg-white p-5 text-sm text-brand-500">Este tramo de la Ruta no está disponible públicamente.</div>
  }

  return (
    <Link to={joinedPath([...slugs, child.slug])} className="group block rounded-2xl border border-brand-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-purple-soft text-xs font-bold text-violet-700">{child.order}</span>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-brand-900">{child.title}</h3>
          {child.description && <p className="mt-2 text-sm leading-6 text-brand-600">{child.description}</p>}
          <span className="mt-4 inline-block text-sm font-semibold text-brand-800 transition group-hover:translate-x-1">Abrir Ruta →</span>
        </div>
      </div>
    </Link>
  )
}

export default function PathPage() {
  const location = useLocation()
  const { auth, abrirModal } = useAuth()
  const slugs = useMemo(() => location.pathname.split('/').filter(Boolean).slice(1).map(decodeURIComponent), [location.pathname])
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
      if (!cancelled) setDetailState({ traversalKey, detail: result, error: null })
    }).catch((requestError) => {
      if (!cancelled) setDetailState({
        traversalKey,
        detail: null,
        error: requestError.status === 404 ? 'Esta Ruta no existe en ese recorrido público.' : requestError.message,
      })
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
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">
          {loading && <p className="text-brand-500">Cargando Ruta…</p>}
          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}

          {path && (
            <>
              <nav aria-label="Migas de pan" className="flex flex-wrap gap-2 text-sm text-brand-500">
                {detail.breadcrumbs.map((crumb, index) => (
                  <span key={crumb.slug} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">›</span>}
                    {index === detail.breadcrumbs.length - 1
                      ? <span className="font-medium text-brand-900">{crumb.title}</span>
                      : <Link to={joinedPath(detail.breadcrumbs.slice(0, index + 1).map((entry) => entry.slug))} className="hover:text-violet-700">{crumb.title}</Link>}
                  </span>
                ))}
              </nav>

              <header className="mt-6 rounded-[2rem] border border-brand-200 bg-white p-6 shadow-[0_12px_40px_rgba(17,17,19,.045)] sm:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">Ruta</span>
                  {path.level && <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600">{LEVEL_LABELS[path.level]}</span>}
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-brand-900 sm:text-5xl">{path.title}</h1>
                {path.description && <p className="mt-5 max-w-3xl text-lg leading-8 text-brand-600">{path.description}</p>}
                {path.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{path.tags.map((tag) => <span key={tag._id} className="rounded-full bg-accent-purple-soft px-2.5 py-1 text-xs text-violet-700">{tag.label}</span>)}</div>}

                {visibleProgress && (
                  <div className="mt-7 max-w-xl">
                    <div className="flex items-center justify-between text-sm font-medium text-brand-600">
                      <span>Progreso</span>
                      <span>{visibleProgress.percentage}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
                      <div className="tp-gradient h-full rounded-full" style={{ width: `${visibleProgress.percentage}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-brand-500">{visibleProgress.completedLeaves} de {visibleProgress.totalLeaves} Rutas hoja</p>
                  </div>
                )}

                {path.kind === 'leaf' && (
                  <button
                    type="button"
                    onClick={() => setCompletion(!completed)}
                    disabled={updating}
                    className="mt-7 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {!auth ? 'Inicia sesión para marcarla completa' : completed ? 'Marcar como pendiente' : 'Marcar Ruta completa'}
                  </button>
                )}
              </header>

              {path.kind === 'parent' && (
                <section className="mt-10">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Recorrido</p>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Siguientes Rutas</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {path.presentation.map((item, index) => (
                      item.type === 'section'
                        ? (
                          <div key={`${item.section._id}-${index}`} className="pt-6 first:pt-0">
                            <div className="flex items-center gap-3">
                              <span className="h-px flex-1 bg-gradient-to-r from-violet-300 to-transparent" />
                              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">{item.section.title}</h3>
                              <span className="h-px flex-1 bg-gradient-to-l from-blue-300 to-transparent" />
                            </div>
                          </div>
                        )
                        : <ChildPathCard key={item.child.order} child={item.child} slugs={slugs} />
                    ))}
                  </div>
                </section>
              )}

              {path.kind === 'leaf' && (
                <section className="mt-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Ruta hoja</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-900">Pasos</h2>
                  <div className="mt-6 space-y-4">
                    {path.steps.map((step) => (
                      <article key={step._id} className="rounded-3xl border border-brand-200 bg-white p-6">
                        <div className="flex items-start gap-4">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-900 text-xs font-bold text-white">{step.order}</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-brand-900">{step.title}</h3>
                            {step.description && <p className="mt-3 whitespace-pre-wrap leading-7 text-brand-600">{step.description}</p>}
                            {step.teacherperiReferences.length > 0 && (
                              <div className="mt-5">
                                <h4 className="text-sm font-semibold text-brand-900">Material de TeacherPeri</h4>
                                <div className="mt-2 space-y-2">
                                  {step.teacherperiReferences.map((reference) => (
                                    reference.available
                                      ? <Link key={`${reference.contentType}-${reference.targetId}`} className="block rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800 transition hover:border-violet-300 hover:text-violet-700" to={reference.href}>{reference.title}</Link>
                                      : <div key={`${reference.contentType}-${reference.targetId}`} className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-500">Material actualmente no disponible.</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {step.extraResources.length > 0 && (
                              <div className="mt-5">
                                <h4 className="text-sm font-semibold text-brand-900">Recursos adicionales</h4>
                                <ul className="mt-2 space-y-2 text-sm">
                                  {step.extraResources.map((resource) => <li key={resource.url}><a className="font-medium text-violet-700 hover:text-blue-700" href={resource.url} target="_blank" rel="noreferrer">{resource.label} ↗</a>{resource.description && <span className="text-brand-500"> · {resource.description}</span>}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {path.relatedPaths.length > 0 && (
                <aside className="mt-10 rounded-3xl border border-brand-200 bg-[#F5F2ED] p-6">
                  <h2 className="text-xl font-bold text-brand-900">Rutas relacionadas</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {path.relatedPaths.map((related) => (
                      related.available ? (
                        <Link key={`${related.relationshipType}-${related.targetPath}`} to={`/rutas/${related.slug}`} className="rounded-2xl border border-brand-200 bg-white p-4 transition hover:border-violet-300">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{related.label}</p>
                          <h3 className="mt-1 font-semibold text-brand-900">{related.title}</h3>
                          {related.description && <p className="mt-2 text-sm text-brand-600">{related.description}</p>}
                        </Link>
                      ) : <div key={`${related.relationshipType}-${related.targetPath}`} className="rounded-2xl border border-brand-200 bg-white p-4 text-sm text-brand-500">{related.label}: esta Ruta no está disponible públicamente.</div>
                    ))}
                  </div>
                </aside>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
