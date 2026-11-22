import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MathText from '../components/math/MathText'
import PageHero from '../components/PageHero'
import { Celebration, Highlight } from '../components/decor/Decor'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'
import { usePageMeta } from '../hooks/usePageMeta'

const LEVEL_LABELS = { introductorio: 'Introductorio', omm: 'OMM', avanzado: 'Avanzado' }

function joinedPath(slugs) {
  return `/rutas/${slugs.map(encodeURIComponent).join('/')}`
}

export function ChildPathCard({ child, slugs }) {
  if (!child.available && child.plannedPreview) return (
    <article aria-disabled="true" aria-label={`${child.title} — Próximamente`} className="rounded-[14px] border-2 border-dashed border-tp-rule bg-tp-paper p-5">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-dashed border-tp-rule font-display text-lg font-extrabold text-tp-ink-muted">{child.order}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-tp-ink-muted">Tramo {child.order}</p>
          <h3 className="mt-1 font-display text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-tp-ink-soft">{child.title}</h3>
          <span className="tp-pill mt-3 bg-tp-surface text-xs">Próximamente</span>
        </div>
      </div>
    </article>
  )
  if (!child.available) {
    return <div className="rounded-[14px] border-2 border-dashed border-tp-rule bg-tp-surface p-5 text-sm text-tp-ink-muted">Este tramo de la Ruta no está disponible públicamente.</div>
  }

  return (
    <Link to={joinedPath([...slugs, child.slug])} className="tp-card-soft tp-lift group block bg-tp-surface p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-yellow font-display text-lg font-extrabold text-tp-ink shadow-[2px_2px_0_var(--tp-ink)]">{child.order}</span>
        <div>
          <h3 className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.025em] text-tp-ink">{child.title}</h3>
          {child.description && <p className="mt-2 text-[15px] leading-6 text-tp-ink-muted">{child.description}</p>}
          <span className="mt-3 inline-block text-sm font-bold text-tp-ink">Abrir Ruta<span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">{' →'}</span></span>
        </div>
      </div>
    </Link>
  )
}

const SECTION_COLORS = ['var(--tp-yellow)', 'var(--tp-sky)', 'var(--tp-mint)', 'var(--tp-orange)', 'var(--tp-tint-violet)']

export function PathSectionHeading({ section, index = 0 }) {
  return <div className="pb-1 pt-10 first:pt-0">
    <h3 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-tp-ink sm:text-[34px]"><Highlight color={SECTION_COLORS[index % SECTION_COLORS.length]}>{section.title}</Highlight></h3>
    {section.state === 'under-construction' && <><span className="tp-sticker mt-4 -rotate-2 bg-tp-yellow">En construcción</span><p className="mt-3 text-[15px] text-tp-ink-muted">Estamos preparando y organizando el contenido de este ciclo.</p></>}
  </div>
}

export default function PathPage() {
  const location = useLocation()
  const { auth, abrirModal } = useAuth()
  const slugs = useMemo(() => location.pathname.split('/').filter(Boolean).slice(1).map(decodeURIComponent), [location.pathname])
  const traversalKey = slugs.join('/')
  const [detailState, setDetailState] = useState({ traversalKey: null, detail: null, error: null })
  const [progressState, setProgressState] = useState({ progressKey: null, progress: null })
  const [updating, setUpdating] = useState(false)
  // Bumped each time the reader marks the Ruta complete, to replay «¡Listo!».
  const [celebration, setCelebration] = useState(0)

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
      if (completed && result.progress?.percentage === 100) setCelebration((count) => count + 1)
    } catch (requestError) {
      setDetailState((current) => current.traversalKey === traversalKey ? { ...current, error: requestError.message } : current)
    } finally {
      setUpdating(false)
    }
  }

  const path = detail?.path
  usePageMeta({ title: path?.title, description: path?.description, noindex: Boolean(error) })
  const visibleProgress = progressKey === progressState.progressKey ? progressState.progress : null
  const completed = visibleProgress?.percentage === 100

  const lessonReferences = path?.kind === 'leaf' ? path.steps.flatMap((step) => step.teacherperiReferences).filter((ref) => ref.available) : []
  const theories = [...new Map(lessonReferences.filter((ref) => ref.contentType === 'Theory').map((ref) => [ref.targetId, ref])).values()]
  if (theories.length === 1 && lessonReferences.every((ref) => ['Theory', 'Problem'].includes(ref.contentType))) {
    return <Navigate replace to={`${theories[0].href}?ruta=${encodeURIComponent(slugs.join('/'))}`} />
  }

  // Section headings take turns with the highlight colors.
  let sectionIndex = -1
  const crumbsNav = detail && (
    <nav aria-label="Migas de pan" className="flex flex-wrap gap-2 text-[13px] font-semibold">
      {detail.breadcrumbs.map((crumb, index) => (
        <span key={crumb.slug} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {index === detail.breadcrumbs.length - 1
            ? <span aria-current="page">{crumb.title}</span>
            : <Link to={joinedPath(detail.breadcrumbs.slice(0, index + 1).map((entry) => entry.slug))} className="underline underline-offset-2 hover:text-tp-violet">{crumb.title}</Link>}
        </span>
      ))}
    </nav>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        {(loading || error) && (
          <div className="tp-container py-12">
            {loading && <p className="text-tp-ink-muted">Cargando Ruta…</p>}
            {error && <p className="tp-card-quiet bg-tp-orange-soft p-5">{error}</p>}
          </div>
        )}

        {path && (
          <>
            <PageHero
              id="ruta-titulo"
              tone={path.kind === 'parent' ? 'sky' : 'violet'}
              title={path.title}
              lead={path.description}
              before={<>
                {crumbsNav}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="tp-sticker -rotate-2 bg-tp-yellow">Ruta</span>
                  {path.level && <span className="tp-pill bg-tp-surface text-xs">{LEVEL_LABELS[path.level]}</span>}
                </div>
              </>}
            >
              {path.tags?.length > 0 && <div className="flex flex-wrap gap-2">{path.tags.map((tag) => <span key={tag._id} className="tp-pill bg-tp-surface text-xs">{tag.label}</span>)}</div>}

              {visibleProgress && (
                <div className="w-full max-w-xl pt-1">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Progreso</span>
                    <span>{visibleProgress.percentage}%</span>
                  </div>
                  <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-tp-ink bg-tp-surface">
                    <div className="h-full bg-tp-violet" style={{ width: `${visibleProgress.percentage}%` }} />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-tp-ink-soft">{visibleProgress.completedLeaves} de {visibleProgress.totalLeaves} Rutas hoja</p>
                </div>
              )}

              {path.kind === 'leaf' && (
                <span className="relative inline-flex">
                  {celebration > 0 && <Celebration key={celebration} status="Ruta completada" />}
                  <button
                    type="button"
                    onClick={() => setCompletion(!completed)}
                    disabled={updating}
                    className="tp-button bg-tp-ink px-5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {!auth ? 'Inicia sesión para marcarla completa' : completed ? 'Marcar como pendiente' : 'Marcar Ruta completa'}
                  </button>
                </span>
              )}
            </PageHero>

            <div className="tp-container pb-24 pt-14 lg:pt-16">
              {path.kind === 'parent' && (
                <section aria-labelledby="recorrido-titulo" className="max-w-[880px]">
                  <div className="flex flex-col items-start gap-4">
                    <span className="tp-sticker -rotate-2 bg-tp-surface">Recorrido</span>
                    <h2 id="recorrido-titulo" className="tp-section-title">Continúa tu recorrido</h2>
                  </div>

                  <div className="relative mt-10 space-y-4 border-l-3 border-dashed border-tp-ink pl-5 sm:pl-9">
                    {path.presentation.map((item, index) => {
                      if (item.type !== 'section') return <ChildPathCard key={item.child.order} child={item.child} slugs={slugs} />
                      sectionIndex += 1
                      return <PathSectionHeading key={`${item.section._id}-${index}`} section={item.section} index={sectionIndex} />
                    })}
                  </div>
                </section>
              )}

              {path.kind === 'leaf' && (
                <section aria-labelledby="pasos-titulo" className="max-w-[880px]">
                  <div className="flex flex-col items-start gap-4">
                    <span className="tp-sticker -rotate-2 bg-tp-surface">Ruta hoja</span>
                    <h2 id="pasos-titulo" className="tp-section-title">Pasos</h2>
                  </div>
                  <div className="mt-10 space-y-5">
                    {path.steps.map((step) => (
                      <article key={step._id} className="tp-card-soft bg-tp-surface p-6">
                        <div className="flex items-start gap-4">
                          <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-tp-ink bg-tp-ink font-display text-lg font-extrabold text-white">{step.order}</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-[22px] font-extrabold leading-tight tracking-[-0.02em]">{step.title}</h3>
                            {step.description && <MathText className="mt-3 whitespace-pre-wrap leading-7 text-tp-ink-soft" text={step.description} />}
                            {step.teacherperiReferences.length > 0 && (
                              <div className="mt-5">
                                <h4 className="tp-eyebrow">Material de TeacherPeri</h4>
                                <div className="mt-2 space-y-2">
                                  {step.teacherperiReferences.map((reference) => (
                                    reference.available
                                      ? <Link key={`${reference.contentType}-${reference.targetId}`} className="flex items-center justify-between gap-3 rounded-xl border-2 border-tp-ink bg-tp-paper px-4 py-2.5 text-[15px] font-semibold transition-colors hover:bg-tp-yellow" to={`${reference.href}?ruta=${encodeURIComponent(slugs.join('/'))}`}>{reference.title}<span aria-hidden="true">→</span></Link>
                                      : <div key={`${reference.contentType}-${reference.targetId}`} className="rounded-xl border-2 border-dashed border-tp-rule bg-tp-paper px-4 py-2.5 text-sm text-tp-ink-muted">Material actualmente no disponible.</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {step.extraResources.length > 0 && (
                              <div className="mt-5">
                                <h4 className="tp-eyebrow">Recursos adicionales</h4>
                                <ul className="mt-2 space-y-2 text-sm">
                                  {step.extraResources.map((resource) => <li key={resource.url}><a className="font-bold text-tp-violet underline underline-offset-2 hover:text-tp-ink" href={resource.url} target="_blank" rel="noreferrer">{resource.label} ↗</a>{resource.description && <span className="text-tp-ink-muted"> · {resource.description}</span>}</li>)}
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
                <aside className="tp-card-quiet mt-14 max-w-[880px] bg-tp-yellow-soft p-6">
                  <h2 className="font-display text-[26px] font-extrabold tracking-[-0.02em]">Rutas relacionadas</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {path.relatedPaths.map((related) => (
                      related.available ? (
                        <Link key={`${related.relationshipType}-${related.targetPath}`} to={`/rutas/${related.slug}`} className="tp-card-soft tp-lift bg-tp-surface p-4">
                          <p className="tp-eyebrow text-tp-violet">{related.label}</p>
                          <h3 className="mt-1 font-bold">{related.title}</h3>
                          {related.description && <p className="mt-2 text-sm text-tp-ink-muted">{related.description}</p>}
                        </Link>
                      ) : <div key={`${related.relationshipType}-${related.targetPath}`} className="rounded-[14px] border-2 border-dashed border-tp-rule bg-tp-surface p-4 text-sm text-tp-ink-muted">{related.label}: esta Ruta no está disponible públicamente.</div>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
