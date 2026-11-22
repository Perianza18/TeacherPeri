import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useMatch } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TABS = [
  { path: 'problemas', label: 'Problemas' },
  { path: 'teoria', label: 'Teoría' },
  { path: 'examenes', label: 'Exámenes' },
  { path: 'listas', label: 'Listas' },
  { path: 'recursos', label: 'Recursos externos' },
]

export default function EntrenamientoPage() {
  // A lesson page (TheoryView) draws its own Navbar, header band and
  // Footer: it can be opened from a Ruta, so it has no library tab bar.
  const lesson = useMatch('/entrenamiento/teoria/:id')
  const { pathname } = useLocation()
  const tabs = useRef(null)
  // On a phone the five tabs scroll sideways: keep the open one in view.
  useEffect(() => {
    const active = tabs.current?.querySelector('[aria-current="page"]')
    if (active && tabs.current.scrollWidth > tabs.current.clientWidth) tabs.current.scrollLeft = active.offsetLeft - tabs.current.offsetLeft - 16
  }, [pathname])
  if (lesson) return <Outlet />

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        {/* Sticky right below the fixed Navbar (72px). */}
        <div className="sticky top-[72px] z-30 border-b-3 border-tp-ink bg-tp-surface/95 backdrop-blur-xl">
          <nav ref={tabs} aria-label="Bibliotecas de entrenamiento" className="tp-container flex items-center gap-2 overflow-x-auto py-2.5 sm:gap-3">
            <span className="tp-eyebrow mr-2 hidden sm:inline">Entrenamiento</span>
            {TABS.map((tab) => (
              <NavLink key={tab.path} to={`/entrenamiento/${tab.path}`} className={({ isActive }) => `flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border-2 px-3 text-sm font-bold transition-colors sm:px-5 ${isActive ? 'border-tp-ink bg-tp-yellow text-tp-ink shadow-[3px_3px_0_var(--tp-ink)]' : 'border-transparent text-tp-ink-muted hover:border-tp-ink hover:bg-tp-paper hover:text-tp-ink'}`}>
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
