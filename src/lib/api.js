// ---------------------------------------------------------------------------
// apiFetch centraliza las 3 cosas que se repetirían en cada llamada a la
// API: mandar el body como JSON, agregar el token de sesión si existe, y
// convertir una respuesta de error en un Error de JavaScript normal que se
// pueda atrapar con try/catch.
//
// Extraído de Problemas.jsx (donde vivía como una función local sin
// exportar) para que AuthContext, AuthModal y ContactForm puedan usar la
// misma lógica en vez de reinventarla — Problemas.jsx ahora importa esto
// también, en vez de tener su propia copia.
// ---------------------------------------------------------------------------

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.error || 'Error de red inesperado.')
    error.status = res.status
    throw error
  }
  return data
}
