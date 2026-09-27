import { Link } from 'react-router-dom'

const LINKS = [
  ['Rutas', '/rutas'],
  ['Zona de Entrenamiento', '/entrenamiento'],
  ['Universidad', '/estudia-en-el-extranjero'],
  ['Experiencias', '/experiencias'],
  ['Sobre mí', '/sobre-mi'],
  ['Contacto', '/contacto'],
]

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0F] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-[-0.04em]">
            Teacher<span className="tp-gradient-text">Peri</span>
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
