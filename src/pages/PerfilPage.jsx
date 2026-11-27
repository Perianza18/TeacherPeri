import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProfileCard, { NumbersCard } from '../components/profile/ProfileCard'
import ProfileTabs from '../components/profile/ProfileTabs'
import ListsPanel from '../components/profile/ListsPanel'
import UserSearch from '../components/profile/UserSearch'
import { ActivityPanel, BadgesPanel, CommentsPanel, PeoplePanel, SearchPanel, SolvedPanel, SubmissionsPanel } from '../components/profile/panels'
import { useAuth } from '../context/useAuth'
import { usePageMeta } from '../hooks/usePageMeta'
import { apiFetch } from '../lib/api'
import { tabsFor, userQuery } from '../lib/profile'

export function ProfileShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-tp-paper px-4 pb-24 pt-28 text-tp-ink sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </main>
      <Footer />
    </>
  )
}

const PEOPLE = ['seguidores', 'siguiendo']
// Old links used ?tab=listas for what is now «Guardados».
const TAB_ALIASES = { listas: 'guardados' }

// Mi Espacio: /perfil/:username. The owner sees five tabs; visitors see
// Comentarios, Guardados and Insignias. The server decides what each one gets.
// The right column shows a tab's panel, or (with no tab selected) seguidores /
// siguiendo (?ver=), the owner's «Problemas resueltos» (?ver=resueltos) or the
// «Buscar usuarios» results (?buscar=).
export default function PerfilPage() {
  const { username } = useParams()
  const [params, setParams] = useSearchParams()
  const { auth, abrirModal, updateUser } = useAuth()
  const token = auth?.token
  const [result, setResult] = useState({ key: null, profile: null, error: null })
  // What the search box starts with: the URL's ?buscar= on first load, empty
  // after «Volver» or on another profile (a new `n` remounts the box).
  const [searchSeed, setSearchSeed] = useState(() => ({ n: 0, user: username, value: userQuery(params.get('buscar')) }))
  const hasSearch = params.has('buscar')
  const onSearch = useCallback((query) => {
    setParams(query ? { buscar: query } : {}, { replace: hasSearch })
  }, [hasSearch, setParams])
  const key = `${username}|${token ?? ''}`

  useEffect(() => {
    let active = true
    apiFetch(`/api/profiles/${encodeURIComponent(username)}`, { token })
      .then((profile) => { if (active) setResult({ key, profile, error: null }) })
      .catch((error) => { if (active) setResult({ key, profile: null, error: error.status === 404 ? 'Ese perfil no existe.' : error.message, notFound: error.status === 404 }) })
    return () => { active = false }
  }, [key, username, token])

  const current = result.key === key
  const profile = current ? result.profile : null
  usePageMeta({ title: profile ? `@${profile.username}` : 'Perfil', description: profile?.bio || undefined, noindex: current && Boolean(result.notFound) })

  if (!profile) {
    return (
      <ProfileShell>
        {current && result.error
          ? <div className="tp-card-soft max-w-[640px] bg-tp-surface p-6"><span className="tp-kicker">Perfil</span><p className="mt-3 leading-7">{result.error}</p><Link to="/" className="mt-3 inline-flex min-h-11 items-center font-bold underline decoration-tp-violet decoration-2 underline-offset-4">Ir a Inicio</Link></div>
          : <p className="text-tp-ink-muted">Cargando perfil…</p>}
      </ProfileShell>
    )
  }

  const tabs = tabsFor(profile.isOwner)
  const search = userQuery(params.get('buscar'))
  const ver = params.get('ver')
  const people = PEOPLE.includes(ver) ? ver : null
  const solved = profile.isOwner && ver === 'resueltos'
  const side = Boolean(search || people || solved)
  const tabParam = params.get('tab')
  const active = side ? null : (tabs.find((tab) => tab.id === (TAB_ALIASES[tabParam] ?? tabParam)) ?? tabs[0]).id
  const back = () => setParams({}, { replace: false })
  const select = (id) => setParams({ tab: id }, { replace: true })
  const setProfile = (changes) => setResult((r) => ({ ...r, profile: { ...r.profile, ...changes } }))

  const panels = {
    actividad: () => <ActivityPanel profile={profile} token={token} />,
    comentarios: () => <CommentsPanel profile={profile} />,
    guardados: () => <ListsPanel profile={profile} token={token} />,
    envios: () => <SubmissionsPanel token={token} />,
    insignias: () => <BadgesPanel profile={profile} />,
  }

  return (
    <ProfileShell>
      <div className="grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <ProfileCard
            profile={profile}
            auth={auth}
            onSignIn={() => abrirModal()}
            onChange={setProfile}
            onShowPeople={(which) => setParams({ ver: which })}
            onBought={(result) => setProfile({ unlockedAvatars: result.unlockedAvatars, level: { ...profile.level, balance: result.balance } })}
            onProfileSaved={(saved) => { setProfile({ avatar: saved.avatar, avatarColor: saved.avatarColor, frame: saved.frame, bio: saved.bio }); updateUser({ avatar: saved.avatar, avatarColor: saved.avatarColor, frame: saved.frame, bio: saved.bio }) }}
          />
          <UserSearch key={`${username}|${searchSeed.n}`} initial={searchSeed.user === username ? searchSeed.value : ''} onSearch={onSearch} />
          <NumbersCard stats={profile.stats} onShowSolved={profile.isOwner ? () => setParams({ ver: 'resueltos' }) : null} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <ProfileTabs tabs={tabs} activeId={active} onSelect={select} />
          {search
            ? <SearchPanel query={search} onBack={() => { setSearchSeed((seed) => ({ n: seed.n + 1, user: username, value: '' })); back() }} />
            : people
              ? <PeoplePanel key={people} profile={profile} which={people} onBack={back} />
              : solved
                ? <SolvedPanel profile={profile} token={token} onBack={back} />
                : <div role="tabpanel" id={`perfil-panel-${active}`} aria-labelledby={`perfil-tab-${active}`} tabIndex={0} className="focus-visible:outline-offset-4">
              {panels[active]()}
            </div>}
        </div>
      </div>
    </ProfileShell>
  )
}
