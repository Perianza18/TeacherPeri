import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const NAV_LINKS = [
  { path: '/', label: 'Inicio' },
  { path: '/rutas', label: 'Rutas' },
  { path: '/entrenamiento', label: 'Zona de Entrenamiento' },
  { path: '/estudia-en-el-extranjero', label: 'Universidad' },
  { path: '/experiencias', label: 'Experiencias' },
  { path: '/sobre-mi', label: 'Sobre mí' },
]

function AuthButton({ dark }) {
  const { auth, logout, abrirModal } = useAuth()

  if (auth) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <span className={`hidden text-sm sm:inline ${dark ? 'text-white/70' : 'text-brand-600'}`}>
          {auth.user.username}
        </span>
        <button
          type="button"
          onClick={logout}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-brand-200 text-brand-700 hover:border-brand-300 hover:bg-white'}`}
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={abrirModal}
      className="tp-gradient shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/10 transition hover:-translate-y-0.5 active:translate-y-0"
    >
      Iniciar sesión
    </button>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const isHome = location.pathname === '/'
  const dark = isHome && !isScrolled

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setIsOpen(false), [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${dark ? 'bg-transparent py-2' : 'border-b border-black/5 bg-[#FAF8F5]/92 py-0 shadow-[0_1px_18px_rgba(17,17,19,0.04)] backdrop-blur-xl'}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <span className={`text-xl font-extrabold tracking-[-0.04em] sm:text-2xl ${dark ? 'text-white' : 'text-brand-900'}`}>
            Teacher<span className="tp-gradient-text">Peri</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-5 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${dark
                      ? isActive ? 'text-white' : 'text-white/65 hover:text-white'
                      : isActive ? 'text-brand-900' : 'text-brand-600 hover:text-brand-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <AuthButton dark={dark} />

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            className={`grid h-10 w-10 place-items-center rounded-xl lg:hidden ${dark ? 'text-white hover:bg-white/10' : 'text-brand-900 hover:bg-white'}`}
          >
            <span className="text-xl leading-none">{isOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-brand-200 bg-[#FAF8F5]/98 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
          <ul className="mx-auto max-w-7xl space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-accent-purple-soft text-accent-violet' : 'text-brand-700 hover:bg-white'}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li><Link to="/contacto" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-brand-700 hover:bg-white">Contacto</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}
