import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth'
import AuthModal from '../components/auth/AuthModal'
import { apiFetch } from '../lib/api'

// Antes, la sesión (login) vivía solo DENTRO de Problemas.jsx, en su
// propio useState — nadie más en el sitio sabía si había alguien logueado.
// Ahora que el Navbar necesita mostrar un botón de "Iniciar sesión" y la
// página Contacto necesita saber quién eres para autocompletar el
// formulario, la sesión tiene que ser GLOBAL: un solo lugar que cualquier
// componente pueda leer (useAuth(), en ./useAuth.js) o cambiar
// (login/logout), sin importar en qué página esté.
//
// Es como una variable global de Python, pero con permiso: en vez de un
// `auth = None` suelto en algún módulo, React usa "Context" — un Provider
// que envuelve toda la app (ver App.jsx) y un hook que cualquier
// componente hijo puede llamar para leer/cambiar ese valor compartido.
const AUTH_STORAGE_KEY = 'teacherperi_auth'

export function AuthProvider({ children }) {
  // Arranca leyendo lo que haya guardado en localStorage, para que si ya
  // habías iniciado sesión antes, sigas logueado después de recargar la
  // página. Mismo truco que Problemas.jsx ya hacía por su cuenta.
  const [auth, setAuth] = useState(() => {
    try {
      const guardado = localStorage.getItem(AUTH_STORAGE_KEY)
      const data = guardado ? JSON.parse(guardado) : null
      return data && typeof data.token === 'string' && data.user?.id ? data : null
    } catch {
      return null
    }
  })

  // false (cerrado), 'login' o 'signup': el modo con el que abre el modal.
  const [modalAbierto, setModalAbierto] = useState(false)

  const login = (data) => {
    setAuth(data)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    setModalAbierto(false)
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  useEffect(() => {
    const expire = () => { setAuth(null); localStorage.removeItem(AUTH_STORAGE_KEY) }
    window.addEventListener('teacherperi:auth-expired', expire)
    return () => window.removeEventListener('teacherperi:auth-expired', expire)
  }, [])

  // Al cargar el sitio, pide la cuenta al servidor para tener el rol al día
  // (por ejemplo, si te nombraron moderador después de iniciar sesión). Si el
  // token ya no sirve, apiFetch avisa con 'teacherperi:auth-expired' y la
  // sesión se cierra arriba; cualquier otro error deja la sesión como estaba.
  const token = auth?.token
  useEffect(() => {
    if (!token) return
    let vigente = true
    apiFetch('/api/auth/me', { token })
      .then((data) => {
        if (!vigente || !data?.user) return
        setAuth((actual) => {
          if (actual?.token !== token) return actual
          const siguiente = { ...actual, user: data.user }
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(siguiente))
          return siguiente
        })
      })
      .catch(() => {})
    return () => { vigente = false }
  }, [token])

  const value = {
    auth,
    login,
    logout,
    // abrirModal('signup') abre directo en «Crear cuenta». Cualquier otro
    // argumento (o el evento de un onClick={abrirModal}) abre en «Iniciar sesión».
    abrirModal: (modo) => setModalAbierto(modo === 'signup' ? 'signup' : 'login'),
    cerrarModal: () => setModalAbierto(false),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalAbierto && <AuthModal initialMode={modalAbierto} onClose={() => setModalAbierto(false)} onAuthSuccess={login} />}
    </AuthContext.Provider>
  )
}
