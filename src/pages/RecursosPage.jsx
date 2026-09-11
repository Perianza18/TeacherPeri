import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { fadeUp, revealProps, staggerContainer } from '../components/motion/variants'

// Página 3/8: Más Recursos. Contenido EXACTO pedido, organizado en las
// categorías dadas. `href: null` en todos a propósito: no se inventaron
// URLs para estos recursos (algunos son confiables de adivinar bien —
// AoPS, GeoGebra — pero otros no, como la URL exacta de un canal de
// YouTube o de una editorial), así que se dejan sin link por ahora en
// vez de arriesgar un destino equivocado. Agregar el href real de cada
// uno es la siguiente edición pendiente de este archivo.
const CATEGORIAS = [
  {
    titulo: 'Material Oficial y Revistas en Español',
    recursos: [
      {
        nombre: 'Revista Tzaloa (OMM)',
        descripcion: 'Lectura obligatoria con problemas y artículos teóricos.',
        href: null,
      },
      {
        nombre: 'Editorial Dinosaurio / CARMA',
        descripcion: "Material amigable como el 'Diminuto Curso de Teoría de Números'.",
        href: null,
      },
    ],
  },
  {
    titulo: 'Foros y Problemas Avanzados',
    recursos: [
      {
        nombre: 'Art of Problem Solving (AoPS)',
        descripcion: 'El foro más grande del mundo para buscar exámenes pasados y soluciones alternativas.',
        href: null,
      },
      {
        nombre: 'Handouts de Evan Chen (OTIS)',
        descripcion: 'Guías de estudio avanzadas en Geometría, Álgebra y Combinatoria.',
        href: null,
      },
    ],
  },
  {
    titulo: 'Contenido en Video',
    recursos: [
      {
        nombre: '3Blue1Brown en Español',
        descripcion: 'Para entrenar la intuición visual detrás de conceptos complejos.',
        href: null,
      },
      {
        nombre: 'Ugesaurio / Canal de Ray Flores',
        descripcion: 'Para ver el proceso de pensamiento en vivo al resolver problemas.',
        href: null,
      },
    ],
  },
  {
    titulo: 'Herramientas de Práctica',
    recursos: [
      {
        nombre: 'GeoGebra',
        descripcion: 'Tu mejor amigo para comprobar conjeturas de Geometría antes de demostrarlas.',
        href: null,
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
