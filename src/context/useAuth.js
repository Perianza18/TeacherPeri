import { createContext, useContext } from 'react'

// El objeto Context y el hook viven en un archivo .js aparte (sin JSX) —
// AuthContext.jsx solo puede exportar el componente <AuthProvider> (regla
// de eslint react-refresh/only-export-components: un archivo de componente
// que también exporta funciones sueltas rompe el Fast Refresh de Vite).
export const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() debe usarse dentro de <AuthProvider> (ver App.jsx).')
  }
  return ctx
}
