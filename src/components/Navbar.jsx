import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'
import { MY_SUBMISSIONS_PATH, PROPOSE_PATH } from '../lib/submissions'
import { PANEL_PATH, canEdit } from '../lib/panel'
import Avatar from './profile/Avatar'
import { profilePath } from '../lib/profile'

// Main navigation, in the order set by the design guide (DESIGN §6).
// Universidad, Sobre mí and Contacto stay reachable from the Footer.
const NAV_LINKS = [
  { path: '/', label: 'Inicio' },
  { path: '/rutas', label: 'Rutas' },
  { path: '/entrenamiento', label: 'Entrenamiento' },
  { path: '/experiencias', label: 'Experiencias' },
  { path: '/equipo', label: 'Equipo' },
]

// The active item gets a hand-drawn violet squiggle; the rest use muted ink.
// `big` is the poster-sized version for the mobile menu panel.
const linkClass = ({ isActive }, big = false) => big
  ? `font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] transition-colors ${isActive ? 'tp-squiggle text-tp-ink' : 'text-tp-ink hover:text-tp-violet'}`
  : `font-semibold transition-colors ${isActive ? 'tp-squiggle text-tp-ink' : 'text-tp-ink-muted hover:text-tp-ink'}`

// Secondary pages, only in the mobile menu (desktop reaches them from the Footer).
const MORE_LINKS = [
  { path: '/estudia-en-el-extranjero', label: 'Universidad' },
  { path: '/sobre-mi', label: 'Sobre mí' },
  { path: '/contacto', label: 'Contacto' },
]

// A page can pick the active item when its URL alone can't: a lesson opened
// from a Ruta lives under /entrenamiento but belongs to Rutas.
function NavItem({ link, activePath, className, onClick, big = false }) {
  if (!activePath) {
    return <NavLink to={link.path} end={link.path === '/'} onClick={onClick} className={(state) => `${className} ${linkClass(state, big)}`}>{link.label}</NavLink>
  }
  const isActive = link.path === activePath
  return <Link to={link.path} onClick={onClick} aria-current={isActive ? 'true' : undefined} className={`${className} ${linkClass({ isActive }, big)}`}>{link.label}</Link>
}

// Calls onClose when Escape is pressed while `active` is true.
function useEscape(active, onClose) {
  useEffect(() => {
    if (!active) return
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, onClose])
}

// In-site notifications (a submission was approved or rejected). Loaded once
// per session token and again whenever the menu opens.
function useNotifications(token, open) {
  const [data, setData] = useState({ unread: 0, items: [] })
  useEffect(() => {
    if (!token) return
    let cancelled = false
    apiFetch('/api/notifications', { token })
      .then((result) => { if (!cancelled) setData(result) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token, open])
  const markRead = () => {
    apiFetch('/api/notifications/read', { method: 'POST', token })
      .then(() => setData((current) => ({ unread: 0, items: current.items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })) })))
      .catch(() => {})
  }
  return { ...data, markRead }
}

const fecha = (value) => new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })

// Logged-in account: the preset avatar, which opens a small panel with the account links,
// notifications and «Cerrar sesión».
function AccountMenu({ user, token, logout }) {
  const [open, setOpen] = useState(false)
  const notifications = useNotifications(token, open)
  const wrapper = useRef(null)
  const button = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    button.current?.focus()
  }, [])
  useEscape(open, close)

  useEffect(() => {
    if (!open) return
    const onPointer = (event) => { if (!wrapper.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  return (
    <div ref={wrapper} className="relative shrink-0">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="tp-account-panel"
        aria-label={`Cuenta de ${user.username}${notifications.unread ? `, ${notifications.unread} ${notifications.unread === 1 ? 'notificación nueva' : 'notificaciones nuevas'}` : ''}`}
        className="relative grid h-11 w-11 place-items-center rounded-full"
      >
        <Avatar id={user.avatar} color={user.avatarColor} />
        {notifications.unread > 0 && <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-tp-ink bg-tp-orange px-1 text-[11px] font-black leading-none text-tp-ink">{notifications.unread > 9 ? '9+' : notifications.unread}</span>}
      </button>
      {open && (
        <div id="tp-account-panel" className="tp-card-soft absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-32px)] bg-tp-surface p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">Sesión iniciada como</p>
          <p className="mt-1 truncate text-base font-bold text-tp-ink">{user.username}</p>
          <nav aria-label="Tu cuenta" className="mt-3 flex flex-col">
            <Link to={profilePath(user.username)} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-tp-ink hover:text-tp-violet">Mi Espacio</Link>
            <Link to={MY_SUBMISSIONS_PATH} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-tp-ink hover:text-tp-violet">Mis envíos</Link>
            <Link to={PROPOSE_PATH} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-tp-ink hover:text-tp-violet">Proponer un problema</Link>
            {canEdit({ user }) && <Link to={PANEL_PATH} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-tp-ink hover:text-tp-violet">Panel del equipo</Link>}
          </nav>
          {notifications.items.length > 0 && (
            <section aria-labelledby="tp-avisos" className="mt-3 border-t-2 border-dashed border-tp-rule pt-3">
              <div className="flex items-center justify-between gap-2">
                <h2 id="tp-avisos" className="text-xs font-black uppercase tracking-[0.12em] text-tp-ink-muted">Notificaciones</h2>
                {notifications.unread > 0 && <button type="button" onClick={notifications.markRead} className="min-h-11 text-xs font-semibold text-tp-violet underline">Marcar como leídas</button>}
              </div>
              <ul className="mt-1 flex max-h-56 flex-col gap-2 overflow-y-auto">
                {notifications.items.slice(0, 5).map((item) => (
                  <li key={item._id} className={`rounded-lg p-2 text-sm leading-5 ${item.readAt ? 'text-tp-ink-muted' : 'bg-tp-yellow-soft text-tp-ink'}`}>
                    <Link to={item.link || MY_SUBMISSIONS_PATH} onClick={() => setOpen(false)} className="hover:underline">{item.message}</Link>
                    <span className="mt-0.5 block text-xs text-tp-ink-muted">{fecha(item.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); logout() }}
            className="tp-button mt-4 min-h-11 w-full bg-tp-surface px-4 py-2 text-sm font-bold text-tp-ink"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

function AuthControl() {
  const { auth, logout, abrirModal } = useAuth()
  if (auth) return <AccountMenu user={auth.user} token={auth.token} logout={logout} />
  return (
    <button
      type="button"
      onClick={abrirModal}
      className="tp-button shrink-0 bg-tp-mint px-4 font-bold text-tp-ink"
    >
      Entrar
    </button>
  )
}

export default function Navbar({ activePath } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuButton = useRef(null)
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    menuButton.current?.focus()
  }, [])
  useEscape(isOpen, closeMenu)

  // While the full-screen mobile menu is open the page behind it doesn't
  // scroll; growing the window to desktop width closes the menu.
  useEffect(() => {
    if (!isOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = (event) => { if (event.matches) setIsOpen(false) }
    desktop.addEventListener('change', onChange)
    return () => {
      document.body.style.overflow = previous
      desktop.removeEventListener('change', onChange)
    }
  }, [isOpen])

  // Fixed height (69px row + 3px border = 72px). EntrenamientoPage's sticky
  // tab bar sits right below it, so keep both values in sync.
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-3 border-tp-ink bg-tp-surface">
      <nav aria-label="Principal">
        <div className="tp-container flex h-[69px] items-center justify-between gap-4">
          {/* The logo mark is Peri, the penguin with the graph on its back
              (src/assets/penguin.webp), from its head down to the graph on
              the blue seal (public/logo-seal.svg). The favicon is the whole
              penguin. */}
          <Link to="/" className="tp-logo group inline-flex min-h-11 shrink-0 items-center gap-2.5 text-tp-ink">
            <span aria-hidden="true" className="block size-11 shrink-0 -rotate-3 overflow-hidden rounded-[12px] border-[2.5px] border-tp-ink bg-tp-blue shadow-[2.5px_2.5px_0_var(--tp-ink)] transition-transform duration-200 group-hover:rotate-3 motion-reduce:transition-none">
              <img src="/logo-seal.svg" alt="" width="44" height="44" className="block size-full" />
            </span>
            <span>Teacher<span className="text-tp-blue">Peri</span></span>
          </Link>

          <div className="flex items-center gap-3 lg:gap-7">
            <ul className="hidden items-center gap-6 text-[15px] lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavItem link={link} activePath={activePath} className="pb-1.5 pt-2" />
                </li>
              ))}
            </ul>

            <AuthControl />

            <button
              ref={menuButton}
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="tp-mobile-menu"
              className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-tp-ink text-tp-ink shadow-[2px_2px_0_var(--tp-ink)] lg:hidden ${isOpen ? 'bg-tp-yellow' : 'bg-tp-surface'}`}
            >
              <span aria-hidden="true" className="text-xl leading-none">{isOpen ? '×' : '☰'}</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="tp-mobile-menu" className="tp-graph fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-tp-yellow lg:hidden">
            <div className="tp-container flex min-h-full flex-col gap-8 pb-10 pt-8">
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <NavItem
                      link={link}
                      activePath={activePath}
                      big
                      onClick={() => setIsOpen(false)}
                      className="inline-flex min-h-14 items-center pb-1.5"
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-4 border-t-2 border-dashed border-tp-ink pt-6">
                <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[15px] font-bold">
                  {MORE_LINKS.map((link) => (
                    <li key={link.path}><Link to={link.path} onClick={() => setIsOpen(false)} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">{link.label}</Link></li>
                  ))}
                </ul>
                <p aria-hidden="true" className="tp-hand -rotate-2 text-[26px] text-tp-violet">¡Nos vemos en la olimpiada!</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
