import Navbar from './Navbar'

// Placeholder deliberadamente simple (sin MeshGradient/animaciones) para
// las páginas nuevas que todavía no tienen contenido real — esto es la
// fase de ESTRUCTURA, el diseño visual final llega en una fase aparte.
// Cuando llegue el contenido de una página, su archivo deja de usar este
// componente y construye su propio JSX (como ya hacen HomePage/Problemas/
// SobreMiPage).
export default function PagePlaceholder({ title }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-32 text-center sm:px-6">
        <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-brand-600">
          Contenido pendiente — esta página todavía no tiene contenido definitivo.
        </p>
      </main>
    </>
  )
}
