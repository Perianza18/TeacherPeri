import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TABS = [
  { path: 'problemas', label: 'Problemas' },
  { path: 'teoria', label: 'Teoría' },
  { path: 'listas', label: 'Listas' },
  { path: 'examenes', label: 'Exámenes' },
]

export default function EntrenamientoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-50 pt-20">
        <div className="sticky top-[65px] z-30 border-b border-brand-200 bg-[#FAF8F5]/95 backdrop-blur-xl">
          <nav aria-label="Bibliotecas de entrenamiento" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {TABS.map((tab) => (
              <NavLink key={tab.path} to={`/entrenamiento/${tab.path}`} className={({ isActive }) => `whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-white hover:text-brand-900'}`}>
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
