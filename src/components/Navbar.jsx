import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Las 9 páginas del sitio (todas rutas reales de React Router ahora —
// ya no hay un "one-pager" con secciones ancladas por scroll, así que
// ya no hace falta la lógica de goToSection/scrollTo que había antes
// (ver useActiveSection.js, borrado: solo lo usaba este archivo).
// NavLink (en vez de Link) le agrega automáticamente una clase/estado
// "activo" cuando la ruta actual coincide, sin necesidad de un hook de
// scroll-spy para saberlo.
const NAV_LINKS = [
  { path: '/', label: 'Inicio' },
  { path: '/recursos', label: 'Más Recursos' },
  { path: '/experiencias', label: 'Experiencias' },
  { path: '/estudia-en-el-extranjero', label: 'Estudia en el Extranjero' },
  { path: '/contacto', label: 'Contacto' },
  { path: '/materiales', label: 'Materiales' },
  { path: '/problemas', label: 'Banco de Problemas' },
  { path: '/sobre-mi', label: 'Sobre mí' },
  { path: '/colaboradores', label: 'Colaboradores' },
]

// NOTA: 9 links en una sola barra horizontal es mucho — para pantallas
// angostas esto se resuelve con el menú hamburguesa de abajo, pero en
// desktop todavía no hay un diseño real para tantos items (dropdown,
// menú agrupado, etc.). Eso es trabajo de la fase de frontend, no de
// esta fase de estructura — por ahora usa flex-wrap para que al menos
// no se corte ni se desborde.
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-900' : 'text-brand-600 hover:text-brand-900'
    }`

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-brand-[#FFB401]/90 backdrop-blur transition-[padding] duration-300 ${
        isScrolled ? 'py-0' : 'py-1.5'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex shrink-0 items-center">
          {/* Sin logo en imagen todavía (el archivo real es de Axioma) —
              wordmark en texto por ahora, mismo gradiente de marca que
              el resto del sitio. Reemplazar por un <img> cuando exista
              un logo real de TeacherPeri. */}
          <span
            className="font-display bg-clip-text text-2xl text-transparent sm:text-3xl"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-accent-gold) 0%, var(--color-accent-orange) 45%, var(--color-accent-red) 100%)',
            }}
          >
            TeacherPeri
          </span>
        </Link>

        <ul className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} end={link.path === '/'} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-700 md:hidden"
          aria-label="Abrir menú de navegación"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Menú</span>
          <div className="flex h-5 w-6 flex-col justify-between">
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
            <span className="h-0.5 w-full bg-current" />
          </div>
        </button>
      </nav>

      {isOpen && (
        <ul className="flex flex-col gap-1 bg-brand-[#FFB401]/90 backdrop-blur px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium hover:bg-brand-100 ${
                    isActive ? 'text-brand-900' : 'text-brand-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
