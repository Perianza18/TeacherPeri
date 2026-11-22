import { useState } from 'react'
import { Link } from 'react-router-dom'
import MathText from '../math/MathText'
import { usePanelData } from '../../hooks/usePanelData'
import { ACTIVITY_LABELS, BADGE_COLORS, longDate, profilePath } from '../../lib/profile'
import Avatar from './Avatar'
import { EmptyCard, FeedRow, LINK, PanelStatus, SoloTu, StatusPill, TextLink } from './shared'

const base = (username) => `/api/profiles/${encodeURIComponent(username)}`

function ActivityDetail({ item }) {
  switch (item.kind) {
    case 'comment': return <>en <TextLink href={item.target.href}>{item.target.label}</TextLink></>
    case 'proposal': return <><TextLink href={item.target.href}>{item.target.label}</TextLink><StatusPill status={item.status} /></>
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
        <FeedRow key={`${item.kind}-${item.at}-${index}`} title={ACTIVITY_LABELS[item.kind]} at={item.at}><ActivityDetail item={item} /></FeedRow>
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
          <FeedRow key={item.id} title="Comentario" at={item.createdAt}>
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

export function BadgesPanel({ profile }) {
  const { data, error, loading } = usePanelData(`${base(profile.username)}/badges`)
  if (loading || error) return <PanelStatus loading={loading} error={error} />
  const missing = profile.isOwner ? 'Te faltan' : 'Le faltan'
  return (
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
  )
}

const SUBMISSION_STATUS = { pending: 'pending', 'published-pending': 'pending', rejected: 'rejected', 'published-rejected': 'rejected', published: 'accepted' }
const FLAG_STATUS = { open: 'pending', resolved: 'applied', dismissed: 'dismissed' }

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
  const loading = problems.loading || flags.loading
  const error = problems.error || flags.error
  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-wrap items-center gap-2 text-sm text-tp-ink-muted"><SoloTu /> Tus propuestas y sugerencias; nadie más las ve aquí.</p>
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

export function PeoplePanel({ profile, which, onBack }) {
  const path = `${base(profile.username)}/${which === 'seguidores' ? 'followers' : 'following'}`
  const { data, error, loading } = usePanelData(path)
  const title = which === 'seguidores' ? `Seguidores de @${profile.username}` : `@${profile.username} sigue a`
  return (
    <section aria-labelledby="personas-titulo" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="personas-titulo" className="font-display text-[24px] font-extrabold tracking-[-0.02em]">{title}</h2>
        <button type="button" onClick={onBack} className={`${LINK} min-h-11`}>Volver</button>
      </div>
      {(loading || error) ? <PanelStatus loading={loading} error={error} /> : data.items.length === 0
        ? <EmptyCard kicker="Nadie todavía">{which === 'seguidores' ? 'Aún no tiene seguidores.' : 'Aún no sigue a nadie.'}</EmptyCard>
        : (
          <ul className="tp-card-soft bg-tp-surface p-5 sm:p-6">
            {data.items.map((person) => (
              <li key={person.username} className="flex items-center gap-3 border-t-2 border-dashed border-tp-rule py-3 first:border-t-0 first:pt-0 last:pb-0">
                <Avatar id={person.avatar} />
                <span className="min-w-0 flex-1 truncate font-bold">@{person.username}</span>
                <Link to={profilePath(person.username)} className={`${LINK} inline-flex min-h-11 items-center text-sm`}>Ver perfil</Link>
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}
