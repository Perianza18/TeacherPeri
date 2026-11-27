import { useState } from 'react'
import { Link } from 'react-router-dom'
import MathText from '../math/MathText'
import { usePanelData } from '../../hooks/usePanelData'
import { ACTIVITY_LABELS, AREA_PILLS, BADGE_COLORS, longDate, plural, profilePath, roleName } from '../../lib/profile'
import Avatar from './Avatar'
import { FRAMES, POINTS, POINT_RULES, frameById } from '../../lib/frames'
import { EmptyCard, FeedRow, LINK, PanelStatus, SoloTu, StatusPill, TextLink } from './shared'

const base = (username) => `/api/profiles/${encodeURIComponent(username)}`

function ActivityDetail({ item }) {
  switch (item.kind) {
    case 'comment': return <>en <TextLink href={item.target.href}>{item.target.label}</TextLink></>
    case 'proposal': return <><TextLink href={item.target.href}>{item.target.label}</TextLink><StatusPill status={item.status} /></>
    case 'solution': return <>en <TextLink href={item.target.href}>{item.target.label}</TextLink><StatusPill status={item.status} /></>
    case 'suggestion': return <>en <TextLink href={item.target.href}>{item.target.label}</TextLink><StatusPill status={item.status} /></>
    case 'saved': return <><TextLink href={item.target.href}>{item.target.label}</TextLink> en <TextLink href={item.list.href}>{item.list.name}</TextLink></>
    case 'follow': return <>Empezaste a seguir a <TextLink href={item.target.href}>{item.target.label}</TextLink></>
    default: return <TextLink href={item.target.href}>{item.target.label}</TextLink>
  }
}

export function ActivityPanel({ profile, token }) {
  const { data, error, loading } = usePanelData(`${base(profile.username)}/activity`, token)
  if (loading || error) return <PanelStatus loading={loading} error={error} />
  if (!data.items.length) return <EmptyCard kicker="Sin actividad">Cuando comentes, guardes, resuelvas o propongas un problema, aparecerá aquí.</EmptyCard>
  return (
    <ul className="tp-card-soft bg-tp-surface p-5 sm:p-6">
      {data.items.map((item, index) => (
        <FeedRow key={`${item.kind}-${item.at}-${index}`} title={ACTIVITY_LABELS[item.kind]} at={item.at} kind={item.kind}><ActivityDetail item={item} /></FeedRow>
      ))}
    </ul>
  )
}

export function CommentsPanel({ profile }) {
  const [page, setPage] = useState(1)
  const [earlier, setEarlier] = useState([])
  const { data, error, loading } = usePanelData(`${base(profile.username)}/comments?page=${page}`)
  if (page === 1 && (loading || error)) return <PanelStatus loading={loading} error={error} />
  const items = [...earlier, ...(data?.items ?? [])]
  if (!items.length) return <EmptyCard kicker="Sin comentarios">{profile.isOwner ? 'Tus comentarios en los problemas aparecerán aquí.' : `@${profile.username} todavía no ha comentado.`}</EmptyCard>
  const more = data && data.page * data.pageSize < data.total
  const loadMore = () => { setEarlier(items); setPage((p) => p + 1) }
  return (
    <div className="flex flex-col gap-4">
      <ul className="tp-card-soft bg-tp-surface p-5 sm:p-6">
        {items.map((item) => (
          <FeedRow key={item.id} title="Comentario" at={item.createdAt} kind="comment">
            <p>en <TextLink href={item.target.href}>{item.target.label}</TextLink></p>
            <MathText text={item.body} className="mt-2 whitespace-pre-line break-words font-reading text-[17px] leading-[1.7] text-tp-ink" />
          </FeedRow>
        ))}
      </ul>
      {loading && page > 1 && <p className="text-tp-ink-muted">Cargando…</p>}
      {more && <button type="button" onClick={loadMore} className="tp-button self-start bg-tp-surface px-5 font-bold text-tp-ink">Ver más</button>}
      {page > 1 && error && <PanelStatus error={error} />}
    </div>
  )
}

// Points, the frames ladder and how far the next one is. Points only come
// from what the team accepted (lib/frames.js).
function LevelCard({ profile, level }) {
  const current = frameById(level.frame)
  const next = level.next
  const from = current.min
  const progress = next ? Math.round(((level.points - from) / (next.min - from)) * 100) : 100
  const who = profile.isOwner ? 'Te faltan' : 'Le faltan'
  return (
    <section aria-labelledby="nivel-titulo" className="tp-card-soft bg-tp-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar id={profile.avatar} color={profile.avatarColor} frame={level.frame} size="picker" />
        <div className="min-w-0 flex-1">
          <h3 id="nivel-titulo" className="font-display text-[19px] font-extrabold">Marco {current.name}</h3>
          <p className="text-sm text-tp-ink-muted">{level.points} {level.points === 1 ? 'punto' : 'puntos'}{next ? ` · ${who} ${next.remaining} para ${next.name}` : ' · ¡Nivel máximo!'}</p>
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full border-2 border-tp-ink bg-tp-paper" role="progressbar" aria-label={next ? `Progreso hacia el marco ${next.name}` : 'Nivel máximo'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full rounded-full bg-tp-violet" style={{ width: `${progress}%` }} />
      </div>
      <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold" aria-label="Marcos">
        {FRAMES.map((frame) => {
          const has = level.points >= frame.min
          return <li key={frame.id} className={has ? 'text-tp-ink' : 'text-tp-ink-muted'}>{frame.name} <span className="font-normal">({frame.min})</span>{has && <span className="sr-only">, desbloqueado</span>}</li>
        })}
      </ol>
      <div className="mt-4 rounded-[12px] bg-tp-paper p-3.5 text-sm leading-6 text-tp-ink-soft">
        <p className="font-bold text-tp-ink">Cómo se ganan puntos</p>
        <ul className="mt-1">
          {POINT_RULES.map((rule) => <li key={rule.key}>{rule.label}: <span className="font-bold text-tp-ink">+{POINTS[rule.key]}</span></li>)}
        </ul>
        <p className="mt-1 text-tp-ink-muted">Solo cuenta lo que el equipo revisa y acepta.</p>
      </div>
    </section>
  )
}

export function BadgesPanel({ profile }) {
  const { data, error, loading } = usePanelData(`${base(profile.username)}/badges`)
  if (loading || error) return <PanelStatus loading={loading} error={error} />
  const missing = profile.isOwner ? 'Te faltan' : 'Le faltan'
  return (
    <div className="flex flex-col gap-4">
    {data.level && <LevelCard profile={profile} level={data.level} />}
    <ul className="grid gap-4 sm:grid-cols-2">
      {data.earned.map((badge) => (
        <li key={badge.id} className="tp-card-quiet flex flex-col items-start gap-2 bg-tp-surface p-5">
          <span className={`tp-pill ${BADGE_COLORS[badge.color] ?? 'bg-tp-yellow'}`}>{badge.name}</span>
          <p className="text-sm text-tp-ink-soft">{badge.description}</p>
          <p className="text-sm text-tp-ink-muted">Obtenida el {longDate(badge.earnedAt)}</p>
        </li>
      ))}
      {data.locked.map((badge) => (
        <li key={badge.id} className="flex flex-col items-start gap-2 rounded-[14px] border-2 border-dashed border-tp-rule bg-tp-paper p-5">
          <span className="tp-pill bg-tp-surface">{badge.name}</span>
          <p className="text-sm text-tp-ink-soft">{badge.description}</p>
          <p className="text-sm font-semibold text-tp-ink-muted">{missing} {badge.remaining}</p>
        </li>
      ))}
    </ul>
    </div>
  )
}

const SUBMISSION_STATUS = { pending: 'pending', 'published-pending': 'pending', rejected: 'rejected', 'published-rejected': 'rejected', published: 'accepted' }
const FLAG_STATUS = { open: 'pending', resolved: 'applied', dismissed: 'dismissed' }
const SOLUTION_STATUS = { pending: 'pending', approved: 'accepted', rejected: 'rejected' }

function SubmissionRow({ title, href, status, editHref, reason }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-t-2 border-dashed border-tp-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
      <p className="break-words leading-7"><TextLink href={href}>{title}</TextLink><StatusPill status={status} /></p>
      <div className="mt-1 flex flex-wrap gap-x-4 text-sm">
        {editHref && <Link to={editHref} className={`${LINK} inline-flex min-h-11 items-center`}>Editar</Link>}
        {reason && <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={`${LINK} min-h-11`}>Ver motivo</button>}
      </div>
      {open && reason && <p className="tp-card-quiet mt-2 bg-tp-coral-soft p-3 text-sm leading-6">{reason}</p>}
    </li>
  )
}

export function SubmissionsPanel({ token }) {
  const problems = usePanelData('/api/submissions/mine', token)
  const flags = usePanelData('/api/flags/mine', token)
  const solutions = usePanelData('/api/solutions/mine', token)
  const loading = problems.loading || flags.loading || solutions.loading
  const error = problems.error || flags.error || solutions.error
  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-tp-ink-muted"><SoloTu /> Tus propuestas, soluciones y sugerencias; nadie más las ve aquí.</p>
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : (
        <>
          <section aria-labelledby="envios-problemas" className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            <h3 id="envios-problemas" className="mb-3 font-display text-[19px] font-extrabold">Problemas propuestos</h3>
            {problems.data.length
              ? <ul>{problems.data.map((item) => (
                <SubmissionRow
                  key={item._id}
                  title={item.examFolderPath.length > 1 ? `${item.examFolderPath.slice(1).join(' › ')}${item.proposal.problemNumber ? `, problema ${item.proposal.problemNumber}` : ''}` : (item.titulo || item.codigo)}
                  href={item.isPublic ? `/entrenamiento/problemas/${item._id}` : `/mis-envios/${item._id}`}
                  status={SUBMISSION_STATUS[item.state]}
                  editHref={`/mis-envios/${item._id}`}
                  reason={SUBMISSION_STATUS[item.state] === 'rejected' ? item.latest?.reason : null}
                />))}</ul>
              : <p className="text-tp-ink-soft">Aún no propones problemas. <Link to="/entrenamiento/problemas/proponer" className={LINK}>Proponer un problema</Link></p>}
          </section>
          <section aria-labelledby="envios-soluciones" className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            <h3 id="envios-soluciones" className="mb-3 font-display text-[19px] font-extrabold">Soluciones propuestas</h3>
            {solutions.data.length
              ? <ul>{solutions.data.map((item) => (
                <SubmissionRow key={item.id} title={item.problem?.label ?? 'Problema'} href={item.problem?.href} status={SOLUTION_STATUS[item.status]} reason={item.status === 'rejected' ? item.reason : null} />
              ))}</ul>
              : <p className="text-tp-ink-soft">Cuando uses «Proponer una solución» en un problema, aparecerá aquí.</p>}
          </section>
          <section aria-labelledby="envios-sugerencias" className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            <h3 id="envios-sugerencias" className="mb-3 font-display text-[19px] font-extrabold">Sugerencias de cambio</h3>
            {flags.data.length
              ? <ul>{flags.data.map((flag) => (
                <SubmissionRow key={flag.id} title={`${flag.targetType === 'theory' ? 'Teoría' : 'Problema'}: ${flag.target.label}`} href={flag.target.href} status={FLAG_STATUS[flag.status]} reason={flag.status === 'dismissed' ? flag.note : null} />
              ))}</ul>
              : <p className="text-tp-ink-soft">Cuando uses «Sugerir un cambio» en un problema o una lección, aparecerá aquí.</p>}
          </section>
        </>
      )}
    </div>
  )
}

// Title + «Volver» above the lists that replace the tabs' panel.
function SidePanel({ id, title, onBack, children }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-[24px] font-extrabold tracking-[-0.02em]">{title}</h2>
        <button type="button" onClick={onBack} className={`${LINK} min-h-11`}>Volver</button>
      </div>
      {children}
    </section>
  )
}

// Rows of people: seguidores, siguiendo and «Buscar usuarios».
function PeopleRows({ people }) {
  return (
    <ul className="tp-card-soft bg-tp-surface p-5 sm:p-6">
      {people.map((person) => (
        <li key={person.username} className="flex items-center gap-3 border-t-2 border-dashed border-tp-rule py-3 first:border-t-0 first:pt-0 last:pb-0">
          <Avatar id={person.avatar} color={person.avatarColor} frame={person.frame} />
          <span className="min-w-0 flex-1 truncate font-bold">@{person.username}</span>
          <span className="tp-pill shrink-0 bg-tp-violet-soft text-xs">{roleName(person.role)}</span>
          <Link to={profilePath(person.username)} className={`${LINK} inline-flex min-h-11 shrink-0 items-center text-sm`}>Ver perfil</Link>
        </li>
      ))}
    </ul>
  )
}

export function PeoplePanel({ profile, which, onBack }) {
  const path = `${base(profile.username)}/${which === 'seguidores' ? 'followers' : 'following'}`
  const { data, error, loading } = usePanelData(path)
  const title = which === 'seguidores' ? `Seguidores de @${profile.username}` : `@${profile.username} sigue a`
  return (
    <SidePanel id="personas-titulo" title={title} onBack={onBack}>
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : data.items.length === 0
        ? <EmptyCard kicker="Nadie todavía">{which === 'seguidores' ? 'Aún no tiene seguidores.' : 'Aún no sigue a nadie.'}</EmptyCard>
        : <PeopleRows people={data.items} />}
    </SidePanel>
  )
}

// «Buscar usuarios» results. `query` is already trimmed and long enough.
export function SearchPanel({ query, onBack }) {
  const { data, error, loading } = usePanelData(`/api/profiles?q=${encodeURIComponent(query)}`)
  const count = data?.items.length ?? 0
  return (
    <SidePanel id="buscar-titulo" title="Buscar usuarios" onBack={onBack}>
      <p aria-live="polite" className="sr-only">{loading ? '' : error ? error : count ? plural(count, 'resultado', 'resultados') : 'No encontramos a nadie con ese usuario.'}</p>
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : count === 0
        ? <EmptyCard kicker="Sin resultados">No encontramos a nadie con ese usuario.</EmptyCard>
        : <PeopleRows people={data.items} />}
    </SidePanel>
  )
}

const CHIP = 'tp-pill min-h-11 cursor-pointer px-4 text-sm font-bold'

// «Problemas resueltos» (owner only; the server answers 404 to anyone else).
export function SolvedPanel({ profile, token, onBack }) {
  const { data, error, loading } = usePanelData(`${base(profile.username)}/solved`, token)
  const [area, setArea] = useState(null)
  const items = data?.items ?? []
  const areas = [...new Set(items.map((item) => item.area).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
  const shown = area ? items.filter((item) => item.area === area) : items
  return (
    <SidePanel id="resueltos-titulo" title="Problemas resueltos" onBack={onBack}>
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : items.length === 0
        ? <EmptyCard kicker="Ninguno todavía">Marca «Lo resolví» en un problema y aparecerá aquí.</EmptyCard>
        : <>
          {areas.length > 1 && (
            <fieldset className="flex flex-wrap gap-2">
              <legend className="mb-2 text-sm font-bold">Filtrar por área</legend>
              {[null, ...areas].map((value) => (
                <label key={value ?? 'todas'} className={`${CHIP} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${area === value ? (AREA_PILLS[value] ?? 'bg-tp-yellow') : 'bg-tp-surface'}`}>
                  <input type="radio" name="area-resueltos" className="sr-only" checked={area === value} onChange={() => setArea(value)} />
                  {value ?? 'Todas'}
                </label>
              ))}
            </fieldset>
          )}
          <ul className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            {shown.map((item) => (
              <li key={item.id} className="border-t-2 border-dashed border-tp-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
                <Link to={item.href} className="group block rounded-[10px] focus-visible:outline-offset-4">
                  <MathText text={item.preview} className="line-clamp-3 break-words font-reading text-[17px] leading-[1.7] text-tp-ink group-hover:text-tp-violet" />
                </Link>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-tp-ink-muted">
                  {item.area && <span className={`tp-pill text-xs text-tp-ink ${AREA_PILLS[item.area] ?? 'bg-tp-surface'}`}>{item.area}</span>}
                  <span>Resuelto el <time dateTime={item.solvedAt}>{longDate(item.solvedAt)}</time></span>
                </p>
              </li>
            ))}
          </ul>
        </>}
    </SidePanel>
  )
}
