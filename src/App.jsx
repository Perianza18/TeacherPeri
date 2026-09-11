import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import EntrenamientoPage from './pages/EntrenamientoPage'
import SobreMiPage from './pages/SobreMiPage'
import RecursosPage from './pages/RecursosPage'
import ExperienciasPage from './pages/ExperienciasPage'
import EstudiaExtranjeroPage from './pages/EstudiaExtranjeroPage'
import ContactoPage from './pages/ContactoPage'
import ColaboradoresPage from './pages/ColaboradoresPage'
import CustomCursor from './components/CustomCursor'

// Este archivo solo define las rutas (+ chrome global como el cursor y,
// ahora, la sesión de usuario). No agreguen contenido de página aquí: el
// one-pager vive en /src/pages/HomePage.jsx y cada página independiente
// vive en su propio archivo dentro de /src/pages.
//
// /materiales y /problemas ya no son rutas separadas: se fusionaron en
// /entrenamiento (ver EntrenamientoPage.jsx), que muestra las 3 vistas
// como pestañas dentro de una sola página.
//
// <AuthProvider> envuelve TODA la app (adentro de BrowserRouter, para que
// pueda usar useNavigate/Link si hiciera falta) — así cualquier página,
// no solo Problemas.jsx, puede saber si hay sesión iniciada y mostrar el
// botón de login del Navbar o el formulario de Contacto.
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/entrenamiento" element={<EntrenamientoPage />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/experiencias" element={<ExperienciasPage />} />
          <Route path="/estudia-en-el-extranjero" element={<EstudiaExtranjeroPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/sobre-mi" element={<SobreMiPage />} />
          <Route path="/colaboradores" element={<ColaboradoresPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
