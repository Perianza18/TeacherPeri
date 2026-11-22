import { Navigate, useLocation, useParams } from 'react-router-dom'

// Listas now live inside Entrenamiento (tabs «Listas» and «Recursos
// externos»). Old /listas URLs (bookmarks, shared links) move there,
// keeping the list id and any query such as ?ruta=.
export default function RedirectToEntrenamientoListas() {
  const { id } = useParams()
  const { search } = useLocation()
  const target = id ? `/entrenamiento/listas/${encodeURIComponent(id)}` : '/entrenamiento/listas'
  return <Navigate to={`${target}${search}`} replace />
}
