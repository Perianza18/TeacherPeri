import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Frame for the Listas page: the library (/listas) or one list (/listas/:id)
// renders inside <Outlet />.
export default function ListasPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-tp-paper pt-[72px] text-tp-ink">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Old /entrenamiento/listas URLs (bookmarks and Ruta step links) move to
// /listas, keeping the list id and any query such as ?ruta=.
export function RedirectToListas() {
  const { id } = useParams()
  const { search } = useLocation()
  const target = id ? `/listas/${encodeURIComponent(id)}` : '/listas'
  return <Navigate to={`${target}${search}`} replace />
}
