import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

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

// Logged-in account: a round avatar (first letter of the username until
// preset avatars exist) that opens a small panel with «Cerrar sesión».
function AccountMenu({ user, logout }) {
  const [open, setOpen] = useState(false)
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
        aria-label={`Cuenta de ${user.username}`}
        className="grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-accent-purple-soft text-lg font-black text-brand-900"
      >
        <span aria-hidden="true">{initial}</span>
      </button>
      {open && (
        <div id="tp-account-panel" className="tp-card-soft absolute right-0 top-full z-50 mt-3 w-64 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-brand-600">Sesión iniciada como</p>
          <p className="mt-1 truncate text-base font-bold text-brand-900">{user.username}</p>
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
  if (auth) return <AccountMenu user={auth.user} logout={logout} />
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
          <Link to="/" className="tp-logo inline-flex min-h-11 shrink-0 items-center text-tp-ink">
            Teacher<span className="text-tp-violet">Peri</span>
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
