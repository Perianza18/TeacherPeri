import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import MathText from '../components/math/MathText'
import Avatar from '../components/profile/Avatar'
import { LINK, SoloTu } from '../components/profile/shared'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import { apiFetch } from '../lib/api'
import { plural, profilePath, userListPath } from '../lib/profile'
import { ProfileShell } from './PerfilPage'

const TYPE_LABEL = { problem: 'Problema', theory: 'Teoría' }

// Old links (/perfil/:username/listas/:id) keep working.
export function RedirectToCollection() {
  const { username, id } = useParams()
  return <Navigate to={userListPath(username, id)} replace />
}

// One collection (a personal list in the code): /perfil/:username/colecciones/:id.
// The old /perfil/:username/listas/:id redirects here. A private one answers
// 404 to anyone but its owner (the server checks).
export default function UserListPage() {
  const { username, id } = useParams()
  const { auth } = useAuth()
  const token = auth?.token
  const [state, setState] = useState({ key: null, list: null, error: null })
  const [reload, setReload] = useState(0)
  const key = `${id}|${token ?? ''}|${reload}`

  useEffect(() => {
    let active = true
    apiFetch(`/api/my-lists/${id}`, { token })
      .then((list) => { if (active) setState({ key, list, error: null }) })
      .catch((error) => { if (active) setState({ key, list: null, error: error.status === 404 ? 'Esta colección no existe o es privada.' : error.message, notFound: error.status === 404 }) })
    return () => { active = false }
  }, [key, id, token])

  const list = state.key === key || state.list ? state.list : null
  usePageMeta({ title: list?.name ?? 'Colección', noindex: list ? !list.isPublic : state.key === key && Boolean(state.notFound) })
  const back = <Link to={`${profilePath(list?.owner.username ?? username)}?tab=guardados`} className="text-sm font-bold underline underline-offset-2 hover:text-tp-violet">← Volver a los guardados de @{list?.owner.username ?? username}</Link>

  const remove = async (item) => {
    await apiFetch(`/api/my-lists/${list.id}/items/${item.itemType}/${item.item}`, { method: 'DELETE', token })
    setReload((n) => n + 1)
  }

  if (!list) {
    return <ProfileShell>{back}<div className="mt-6">{state.error ? <div className="tp-card-soft max-w-[640px] bg-tp-surface p-6"><span className="tp-kicker">Colección</span><p className="mt-3">{state.error}</p></div> : <p className="text-tp-ink-muted">Cargando colección…</p>}</div></ProfileShell>
  }

  return (
    <ProfileShell>
      <div className="mx-auto flex max-w-[840px] flex-col gap-6">
        {back}
        <header className="tp-card flex flex-col gap-3 bg-tp-surface p-6 sm:p-7">
          <span className="tp-kicker self-start bg-tp-coral">Colección</span>
          <h1 className="break-words font-display text-[34px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[44px]">{list.name}</h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-tp-ink-muted">
            <Avatar id={list.owner.avatar} color={list.owner.avatarColor} size="sm" />
            <Link to={profilePath(list.owner.username)} className={LINK}>@{list.owner.username}</Link>
            <span>· {plural(list.count, 'elemento', 'elementos')}</span>
            {list.isPublic ? <span>· Pública</span> : <SoloTu />}
          </p>
        </header>
        {list.items.length === 0
          ? <div className="tp-card-soft bg-tp-surface p-6"><span className="tp-kicker">Colección vacía</span><p className="mt-3 leading-7 text-tp-ink-soft">{list.isOwner ? 'Usa «Guardar» en un problema o una lección de teoría para agregarlo aquí.' : 'Esta colección todavía no tiene elementos.'}</p></div>
          : (
            <ul className="flex flex-col gap-4">
              {list.items.map((item) => (
                <li key={`${item.itemType}-${item.item}`} className="tp-card-soft flex flex-col gap-2 bg-tp-surface p-5">
                  <span className={`tp-pill self-start text-xs ${item.itemType === 'theory' ? 'bg-tp-sky-soft' : 'bg-tp-yellow-soft'}`}>{TYPE_LABEL[item.itemType]}</span>
                  <Link to={item.href} className="break-words font-display text-[19px] font-extrabold leading-tight hover:text-tp-violet">{item.label}</Link>
                  {item.preview && <MathText text={item.preview} className="line-clamp-3 font-reading leading-7 text-tp-ink-soft" />}
                  {list.isOwner && <button type="button" onClick={() => remove(item)} className="min-h-11 self-start text-sm font-semibold text-tp-ink-muted underline underline-offset-2 hover:text-tp-ink">Quitar de la colección</button>}
                </li>
              ))}
            </ul>
          )}
      </div>
    </ProfileShell>
  )
}
