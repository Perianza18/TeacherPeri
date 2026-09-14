import { NavLink, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

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
      <main>
        <nav aria-label="Bibliotecas de entrenamiento" className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 pb-2 pt-20 sm:px-6">
          {TABS.map((tab) => <NavLink key={tab.path} to={`/entrenamiento/${tab.path}`} className={({ isActive }) => `rounded-full border px-5 py-2 text-sm font-semibold ${isActive ? 'border-transparent bg-brand-900 text-white' : 'border-brand-300 bg-white text-brand-600 hover:text-brand-900'}`}>{tab.label}</NavLink>)}
        </nav>
        <Outlet />
      </main>
    </>
  )
}
