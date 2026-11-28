import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import RedirectToEntrenamientoListas from './pages/ListasPage'

// Every page but Inicio loads on demand, so the first visit downloads only
// what Inicio needs; each page's code arrives when someone opens it.
const EntrenamientoPage = lazy(() => import('./pages/EntrenamientoPage'))
const Problemas = lazy(() => import('./pages/Problemas'))
const ExerciseListsPage = lazy(() => import('./pages/ExerciseListsPage'))
const RecursosPage = lazy(() => import('./pages/RecursosPage'))
const ExperienciasPage = lazy(() => import('./pages/ExperienciasPage'))
const EquipoPage = lazy(() => import('./pages/EquipoPage'))
const EliasPage = lazy(() => import('./pages/equipo/EliasPage'))
const EliasRecruiterPage = lazy(() => import('./pages/equipo/EliasRecruiterPage'))
const CatherinePage = lazy(() => import('./pages/equipo/CatherinePage'))
const EstudiaExtranjeroPage = lazy(() => import('./pages/EstudiaExtranjeroPage'))
const ContactoPage = lazy(() => import('./pages/ContactoPage'))
const ColaboradoresPage = lazy(() => import('./pages/ColaboradoresPage'))
const LibraryCollection = lazy(() => import('./components/training/LibraryCollection'))
const LibraryDetailPage = lazy(() => import('./pages/LibraryDetailPage'))
const RutasPage = lazy(() => import('./pages/RutasPage'))
const PathPage = lazy(() => import('./pages/PathPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ProponerProblemaPage = lazy(() => import('./pages/ProponerProblemaPage'))
const MisEnviosPage = lazy(() => import('./pages/MisEnviosPage'))
const EditarEnvioPage = lazy(() => import('./pages/MisEnviosPage').then((module) => ({ default: module.EditarEnvioPage })))
const PerfilPage = lazy(() => import('./pages/PerfilPage'))
const UserListPage = lazy(() => import('./pages/UserListPage'))
const RedirectToCollection = lazy(() => import('./pages/UserListPage').then((module) => ({ default: module.RedirectToCollection })))
// Team pages (editors and admins). The server checks every permission.
const PanelPage = lazy(() => import('./pages/panel/PanelPage'))
const ModeracionPage = lazy(() => import('./pages/panel/ModeracionPage'))
const RevisionPage = lazy(() => import('./pages/panel/RevisionPage'))
const UsuariosPage = lazy(() => import('./pages/panel/UsuariosPage'))
const CambiosPage = lazy(() => import('./pages/panel/CambiosPage'))
const CambioPage = lazy(() => import('./pages/panel/CambiosPage').then((module) => ({ default: module.CambioPage })))
const EditarProblemaPage = lazy(() => import('./pages/panel/EditarProblemaPage'))
const EditarLeccionPage = lazy(() => import('./pages/panel/EditarLeccionPage'))

// Shown for the instant a page's code is loading: the paper background, so
// the screen doesn't flash white.
function PageLoading() {
  return <div aria-busy="true" className="min-h-screen bg-tp-paper" />
}

// Dev-only test lesson with every block of the lesson format; the production
// build drops it because import.meta.env.DEV is false there.
const ProblemCardPreviewPage = import.meta.env.DEV ? lazy(() => import('./pages/ProblemCardPreviewPage')) : null
const TheoryDraftPage = import.meta.env.DEV ? lazy(() => import('./pages/TheoryDraftPage')) : null
const TheoryTestLessonPage = import.meta.env.DEV ? lazy(() => import('./pages/TheoryTestLessonPage')) : null

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {ProblemCardPreviewPage && <Route path="/dev/tarjetas-problemas" element={<ProblemCardPreviewPage />} />}
          {TheoryTestLessonPage && <Route path="/dev/teoria-prueba" element={<TheoryTestLessonPage />} />}
          {TheoryDraftPage && <Route path="/dev/teoria-borrador/:slug" element={<TheoryDraftPage />} />}
          <Route path="/rutas" element={<RutasPage />} />
          <Route path="/rutas/*" element={<PathPage />} />
          <Route path="/entrenamiento" element={<EntrenamientoPage />}>
            <Route index element={<Navigate to="problemas" replace />} />
            <Route path="problemas" element={<Problemas />} />
            <Route path="problemas/proponer" element={<ProponerProblemaPage />} />
            <Route path="problemas/:id" element={<LibraryDetailPage type="problemas" />} />
            <Route path="teoria" element={<LibraryCollection type="theory" title="Teoría" subtitle="Artículos matemáticos nativos con contenido y referencias reutilizables." />} />
            <Route path="teoria/:id" element={<LibraryDetailPage type="teoria" />} />
            <Route path="examenes" element={<LibraryCollection type="exams" title="Exámenes" subtitle="Exámenes que reutilizan Problemas existentes en su orden original." />} />
            <Route path="examenes/:id" element={<LibraryDetailPage type="examenes" />} />
            <Route path="listas" element={<ExerciseListsPage />} />
            <Route path="listas/ejercicios/:slug" element={<ExerciseListsPage />} />
            <Route path="listas/:id" element={<LibraryDetailPage type="listas" />} />
            <Route path="recursos" element={<LibraryCollection key="recursos" type="lists" source="external" title="Recursos externos" subtitle="Materiales de otras organizaciones, enlazados a su fuente original." />} />
            <Route path="recursos/:id" element={<LibraryDetailPage type="listas" />} />
          </Route>
          <Route path="/listas" element={<RedirectToEntrenamientoListas />} />
          <Route path="/listas/:id" element={<RedirectToEntrenamientoListas />} />
          <Route path="/mis-envios" element={<MisEnviosPage />} />
          <Route path="/perfil/:username" element={<PerfilPage />} />
          <Route path="/perfil/:username/colecciones/:id" element={<UserListPage />} />
          <Route path="/perfil/:username/listas/:id" element={<RedirectToCollection />} />
          <Route path="/mis-envios/:id" element={<EditarEnvioPage />} />
          <Route path="/panel" element={<PanelPage />} />
          <Route path="/panel/moderacion" element={<ModeracionPage />} />
          <Route path="/panel/revision" element={<RevisionPage />} />
          <Route path="/panel/usuarios" element={<UsuariosPage />} />
          <Route path="/panel/cambios" element={<CambiosPage />} />
          <Route path="/panel/cambios/:id" element={<CambioPage />} />
          <Route path="/panel/problemas/:id/editar" element={<EditarProblemaPage />} />
          <Route path="/panel/teoria/:id/editar" element={<EditarLeccionPage />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/experiencias" element={<ExperienciasPage />} />
          <Route path="/equipo" element={<EquipoPage />} />
          <Route path="/equipo/elias" element={<EliasPage />} />
          {/* Portfolio link Elías shares directly; not linked from the site. */}
          <Route path="/equipo/elias/recruiter" element={<EliasRecruiterPage />} />
          <Route path="/equipo/catherine" element={<CatherinePage />} />
          <Route path="/estudia-en-el-extranjero" element={<EstudiaExtranjeroPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          {/* «Sobre mí» became the team page; old links land there. */}
          <Route path="/sobre-mi" element={<Navigate to="/equipo" replace />} />
          <Route path="/colaboradores" element={<ColaboradoresPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
