import { Link } from 'react-router-dom'

const LINKS = [
  ['Rutas', '/rutas'],
  ['Entrenamiento', '/entrenamiento'],
  ['Listas', '/listas'],
  ['Experiencias', '/experiencias'],
  ['Equipo', '/equipo'],
  ['Universidad', '/estudia-en-el-extranjero'],
  ['Sobre mí', '/sobre-mi'],
  ['Contacto', '/contacto'],
]

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-[#111111] text-white">
      <div className="tp-container flex flex-col gap-8 py-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link to="/" className="tp-logo inline-flex min-h-11 items-center">
            TeacherPeri
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
            Matemáticas olímpicas y orientación universitaria, organizadas para que puedas encontrar un camino y seguir explorando por tu cuenta.
          </p>
        </div>
        <nav className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-sm text-white/65">
          {LINKS.map(([label, to]) => (
            <Link key={to} to={to} className="transition hover:text-white">{label}</Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/35">
        TeacherPeri
      </div>
    </footer>
  )
}
