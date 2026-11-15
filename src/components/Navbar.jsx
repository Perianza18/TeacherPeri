import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { apiFetch } from '../lib/api'
import { MY_SUBMISSIONS_PATH, PROPOSE_PATH } from '../lib/submissions'

// Main navigation, in the order set by the design guide (DESIGN §6).
// Universidad, Sobre mí and Contacto stay reachable from the Footer.
const NAV_LINKS = [
  { path: '/', label: 'Inicio' },
  { path: '/rutas', label: 'Rutas' },
  { path: '/entrenamiento', label: 'Entrenamiento' },
  { path: '/listas', label: 'Listas' },
  { path: '/experiencias', label: 'Experiencias' },
  { path: '/equipo', label: 'Equipo' },
]

// The active item gets a 3px violet underline; the rest use muted ink.
const linkClass = ({ isActive }) =>
  `font-semibold underline-offset-[10px] decoration-[3px] transition-colors ${isActive ? 'text-brand-900 underline decoration-accent-violet' : 'text-brand-600 hover:text-brand-900'}`

// A page can pick the active item when its URL alone can't: a lesson opened
// from a Ruta lives under /entrenamiento but belongs to Rutas.
function NavItem({ link, activePath, className, onClick }) {
  if (!activePath) {
    return <NavLink to={link.path} end={link.path === '/'} onClick={onClick} className={(state) => `${className} ${linkClass(state)}`}>{link.label}</NavLink>
  }
  const isActive = link.path === activePath
  return <Link to={link.path} onClick={onClick} aria-current={isActive ? 'true' : undefined} className={`${className} ${linkClass({ isActive })}`}>{link.label}</Link>
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

// Logged-in account: a round avatar (first letter of the username until
// preset avatars exist) that opens a small panel with the account links,
// notifications and «Cerrar sesión».
function AccountMenu({ user, token, logout }) {
  const [open, setOpen] = useState(false)
  const notifications = useNotifications(token, open)
  const wrapper = useRef(null)
  const button = useRef(null)
  const initial = (user.username || '?').trim().charAt(0).toUpperCase() || '?'

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
        className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-accent-purple-soft text-lg font-black text-brand-900"
      >
        <span aria-hidden="true">{initial}</span>
        {notifications.unread > 0 && <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-black bg-tp-coral px-1 text-[11px] font-black leading-none text-tp-ink">{notifications.unread > 9 ? '9+' : notifications.unread}</span>}
      </button>
      {open && (
        <div id="tp-account-panel" className="tp-card-soft absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-32px)] bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-600">Sesión iniciada como</p>
          <p className="mt-1 truncate text-base font-bold text-brand-900">{user.username}</p>
          <nav aria-label="Tu cuenta" className="mt-3 flex flex-col">
            <Link to={MY_SUBMISSIONS_PATH} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-brand-900 hover:text-violet-700">Mis envíos</Link>
            <Link to={PROPOSE_PATH} onClick={() => setOpen(false)} className="flex min-h-11 items-center font-semibold text-brand-900 hover:text-violet-700">Proponer un problema</Link>
          </nav>
          {notifications.items.length > 0 && (
            <section aria-labelledby="tp-avisos" className="mt-3 border-t-2 border-dashed border-tp-rule pt-3">
              <div className="flex items-center justify-between gap-2">
                <h2 id="tp-avisos" className="text-xs font-black uppercase tracking-[0.12em] text-brand-600">Notificaciones</h2>
                {notifications.unread > 0 && <button type="button" onClick={notifications.markRead} className="min-h-11 text-xs font-semibold text-violet-700 underline">Marcar como leídas</button>}
              </div>
              <ul className="mt-1 flex max-h-56 flex-col gap-2 overflow-y-auto">
                {notifications.items.slice(0, 5).map((item) => (
                  <li key={item._id} className={`rounded-lg p-2 text-sm leading-5 ${item.readAt ? 'text-brand-600' : 'bg-tp-yellow-soft text-brand-900'}`}>
                    <Link to={MY_SUBMISSIONS_PATH} onClick={() => setOpen(false)} className="hover:underline">{item.message}</Link>
                    <span className="mt-0.5 block text-xs text-tp-ink-muted">{fecha(item.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); logout() }}
            className="tp-button mt-4 min-h-11 w-full bg-white px-4 py-2 text-sm font-bold text-brand-900"
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

  // Fixed height (69px row + 3px border = 72px). EntrenamientoPage's sticky
  // tab bar sits right below it, so keep both values in sync.
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-3 border-black bg-white">
      <nav aria-label="Principal">
        <div className="tp-container flex h-[69px] items-center justify-between gap-4">
          <Link to="/" className="tp-logo inline-flex min-h-11 shrink-0 items-center text-tp-ink">
            TeacherPeri
          </Link>

          <div className="flex items-center gap-3 lg:gap-7">
            <ul className="hidden items-center gap-6 text-[15px] lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavItem link={link} activePath={activePath} className="py-2" />
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
              className="grid h-11 w-11 place-items-center rounded-xl border-2 border-black bg-white text-brand-900 lg:hidden"
            >
              <span aria-hidden="true" className="text-xl leading-none">{isOpen ? '×' : '☰'}</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="tp-mobile-menu" className="border-t-2 border-black bg-white px-4 pb-3 pt-2 sm:px-6 lg:hidden">
            <ul className="mx-auto max-w-7xl">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavItem
                    link={link}
                    activePath={activePath}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-11 items-center px-2 text-base"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
