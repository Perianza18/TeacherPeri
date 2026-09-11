import { useState } from 'react'
import { AuthContext } from './useAuth'
import AuthModal from '../components/auth/AuthModal'

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
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

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

  const value = {
    auth,
    login,
    logout,
    abrirModal: () => setModalAbierto(true),
    cerrarModal: () => setModalAbierto(false),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalAbierto && <AuthModal onClose={() => setModalAbierto(false)} onAuthSuccess={login} />}
    </AuthContext.Provider>
  )
}
