import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { fadeUp, revealProps, staggerContainer } from '../components/motion/variants'

// Página 3/8: Más Recursos. Contenido EXACTO pedido, organizado en las
// categorías dadas. Los href ahora son los reales, dados por el
// usuario (antes se dejaban en null porque yo no estaba seguro de
// adivinarlos bien). El recurso de video "Ugesaurio / Canal de Ray
// Flores" se quitó a pedido del usuario y se reemplazó por "Tomás
// Cantú" (URL también dada por el usuario).
const CATEGORIAS = [
  {
    titulo: 'Material Oficial y Revistas en Español',
    recursos: [
      {
        nombre: 'Revista Tzaloa (OMM)',
        descripcion: 'Lectura obligatoria con problemas y artículos teóricos.',
        href: 'https://www.ommenlinea.org/',
      },
      {
        nombre: 'Editorial Dinosaurio / CARMA',
        descripcion: "Material amigable como el 'Diminuto Curso de Teoría de Números'.",
        href: 'http://ommslp.blogspot.com/',
      },
    ],
  },
  {
    titulo: 'Foros y Problemas Avanzados',
    recursos: [
      {
        nombre: 'Art of Problem Solving (AoPS)',
        descripcion: 'El foro más grande del mundo para buscar exámenes pasados y soluciones alternativas.',
        href: 'https://artofproblemsolving.com/community',
      },
      {
        nombre: 'Handouts de Evan Chen (OTIS)',
        descripcion: 'Guías de estudio avanzadas en Geometría, Álgebra y Combinatoria.',
        href: 'https://web.evanchen.cc/olympiad.html',
      },
    ],
  },
  {
    titulo: 'Contenido en Video',
    recursos: [
      {
        nombre: '3Blue1Brown en Español',
        descripcion: 'Para entrenar la intuición visual detrás de conceptos complejos.',
        href: 'https://www.youtube.com/@3blue1brownespanol',
      },
      {
        nombre: 'Tomás Cantú',
        descripcion: 'Para ver el proceso de pensamiento en vivo al resolver problemas.',
        href: 'https://www.youtube.com/@Tom%C3%A1sCant%C3%BA',
      },
    ],
  },
  {
    titulo: 'Herramientas de Práctica',
    recursos: [
      {
        nombre: 'GeoGebra',
        descripcion: 'Tu mejor amigo para comprobar conjeturas de Geometría antes de demostrarlas.',
        href: 'https://www.geogebra.org/',
      },
    ],
  },
]

function RecursoCard({ recurso }) {
  const Contenido = (
    <>
      <h3 className="font-semibold text-brand-900">{recurso.nombre}</h3>
      <p className="mt-1 text-sm text-brand-600">{recurso.descripcion}</p>
      {recurso.href && (
        <span className="mt-3 inline-block text-sm font-medium text-[#B70B0D] underline underline-offset-4">
          Visitar →
        </span>
      )}
    </>
  )

  const className =
    'flex flex-col rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-sm transition-shadow hover:shadow-md'

  if (recurso.href) {
    return (
      <motion.a
        variants={fadeUp}
        href={recurso.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {Contenido}
      </motion.a>
    )
  }

  return (
    <motion.div variants={fadeUp} className={className}>
      {Contenido}
    </motion.div>
  )
}

export default function RecursosPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <motion.h1
          variants={fadeUp}
          {...revealProps}
          className="font-display mb-3 text-center text-3xl text-brand-900 sm:text-4xl"
        >
          Más Recursos
        </motion.h1>
        <motion.p
          variants={fadeUp}
          {...revealProps}
          className="mx-auto mb-16 max-w-xl text-center text-brand-600"
        >
          Una colección curada de los mejores sitios, libros y canales para seguir aprendiendo
          fuera de nuestro banco de problemas.
        </motion.p>

        <div className="flex flex-col gap-14">
          {CATEGORIAS.map((categoria) => (
            <motion.section key={categoria.titulo} variants={staggerContainer(0.1)} {...revealProps}>
              <motion.h2
                variants={fadeUp}
                className="mb-5 text-xl font-semibold text-brand-900"
              >
                {categoria.titulo}
              </motion.h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {categoria.recursos.map((recurso) => (
                  <RecursoCard key={recurso.nombre} recurso={recurso} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </>
  )
}
