import { motion, useScroll, useTransform } from 'framer-motion'

// Mancha borrosa y translúcida que flota suavemente (loop infinito) y
// además se desplaza un poco con el scroll de la página (mismo `depth`
// que FloatingSymbol.jsx). Se usa para "romper" el borde recto de una
// tarjeta o de una cuadrícula — colocada a propósito medio-afuera de su
// contenedor (con posiciones como "-left-10 -top-10"), no adentro.
//
// `className` posiciona el elemento (debe incluir "absolute" + top/left/
// right/bottom) — mismo contrato que FloatingSymbol.
export default function FloatingBlob({
  className = '',
  size = 180,
  color = '#FFB401',
  opacity = 0.25,
  delay = 0,
  duration = 9,
  depth = 0,
}) {
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -240 * depth])

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ y: parallaxY }}
    >
      <motion.div
        className="rounded-full blur-2xl"
        style={{ width: size, height: size, backgroundColor: color }}
        initial={{ opacity: 0, y: 0, scale: 0.92 }}
        animate={{
          opacity: [opacity * 0.6, opacity, opacity * 0.6],
          y: [0, -22, 0],
          scale: [0.94, 1.06, 0.94],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.div>
  )
}
