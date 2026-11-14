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

// The active item gets a 3px violet underline; the rest use muted ink.
const linkClass = ({ isActive }) =>
  `font-semibold underline-offset-[10px] decoration-[3px] transition-colors ${isActive ? 'text-brand-900 underline decoration-accent-violet' : 'text-brand-600 hover:text-brand-900'}`

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
        <div id="tp-account-panel" className="absolute right-0 top-full z-50 mt-3 w-64 rounded-[14px] border-2 border-black bg-white p-5 shadow-[4px_4px_0_#111]">
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
      className="tp-button min-h-11 shrink-0 bg-accent-violet px-5 py-2 text-sm font-black text-white"
    >
      Entrar
    </button>
  )
}

export default function Navbar() {
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
        <div className="mx-auto flex h-[69px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="shrink-0">
            <span className="text-xl font-extrabold tracking-[-0.04em] text-brand-900 sm:text-2xl">
              Teacher<span className="text-accent-violet">Peri</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 lg:gap-7">
            <ul className="hidden items-center gap-6 text-[15px] lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} end={link.path === '/'} className={(state) => `py-2 ${linkClass(state)}`}>
                    {link.label}
                  </NavLink>
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
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={(state) => `flex min-h-11 items-center px-2 text-base ${linkClass(state)}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
