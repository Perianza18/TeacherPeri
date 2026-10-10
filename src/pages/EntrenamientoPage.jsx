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
        <div className="sticky top-[65px] z-30 border-b-2 border-black bg-[#FAF8F5]/95 backdrop-blur-xl">
          <nav aria-label="Bibliotecas de entrenamiento" className="mx-auto grid max-w-7xl grid-cols-4 gap-1 px-2 sm:flex sm:gap-2 sm:px-4 py-3 sm:px-6 lg:px-8">
            {TABS.map((tab) => (
              <NavLink key={tab.path} to={`/entrenamiento/${tab.path}`} className={({ isActive }) => `whitespace-nowrap border-2 border-transparent px-1 py-2 text-center text-xs font-black sm:px-4 sm:text-sm transition ${isActive ? 'border-black bg-accent-yellow text-brand-900 shadow-[3px_3px_0_#111]' : 'text-brand-600 hover:border-black hover:bg-white hover:text-brand-900'}`}>
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
