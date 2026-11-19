import { NavLink, Outlet, useMatch } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TABS = [
  { path: 'problemas', label: 'Problemas' },
  { path: 'teoria', label: 'Teoría' },
  { path: 'examenes', label: 'Exámenes' },
]

export default function EntrenamientoPage() {
  // A lesson page (TheoryView) draws its own Navbar, header band and
  // Footer: it can be opened from a Ruta, so it has no library tab bar.
  const lesson = useMatch('/entrenamiento/teoria/:id')
  if (lesson) return <Outlet />

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        {/* Sticky right below the fixed Navbar (72px). */}
        <div className="sticky top-[72px] z-30 border-b-3 border-tp-ink bg-tp-surface/95 backdrop-blur-xl">
          <nav aria-label="Bibliotecas de entrenamiento" className="tp-container flex items-center gap-2 py-2.5 sm:gap-3">
            <span className="tp-eyebrow mr-2 hidden sm:inline">Entrenamiento</span>
            {TABS.map((tab) => (
              <NavLink key={tab.path} to={`/entrenamiento/${tab.path}`} className={({ isActive }) => `flex min-h-10 flex-1 items-center justify-center whitespace-nowrap rounded-xl border-2 px-3 text-sm font-bold transition-colors sm:flex-none sm:px-5 ${isActive ? 'border-tp-ink bg-tp-yellow text-tp-ink shadow-[3px_3px_0_var(--tp-ink)]' : 'border-transparent text-tp-ink-muted hover:border-tp-ink hover:bg-tp-paper hover:text-tp-ink'}`}>
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
