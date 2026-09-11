import { motion, useScroll, useTransform } from 'framer-motion'

// Símbolo matemático flotante. Combina una animación de flotación
// constante (loop) con parallax: se desplaza según cuánto se ha hecho
// scroll en la página, multiplicado por `depth` (0 = no se mueve con el
// scroll, valores más altos = se mueve más).
//
// Antes este comentario ya prometía el parallax pero el código nunca lo
// implementaba (no había useScroll/useTransform en ningún lado) — esto
// lo pone de verdad. depth=0 por defecto, así que todos los usos
// existentes de este componente (Hero, Problemas, SobreMiPage...) siguen
// viéndose exactamente igual sin tocarlos; el parallax es opt-in.
//
// El loop de flotación y el desplazamiento por scroll van en DOS
// elementos anidados (no en el mismo) a propósito: Framer Motion no deja
// combinar `animate` y un `style.y` con motion value en el mismo
// elemento sin que se pisen entre sí — cada uno necesita su propia capa.
export default function FloatingSymbol({
  symbol,
  className = '',
  delay = 0,
  duration = 6,
  rotate = 0,
  depth = 0,
}) {
  const { scrollYProgress } = useScroll()
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -240 * depth])

  return (
    <motion.div className={`pointer-events-none ${className}`} style={{ y: parallaxY }}>
      <motion.span
        aria-hidden="true"
        className="select-none font-serif italic"
        initial={{ opacity: 0, y: 12, rotate: rotate - 6 }}
        animate={{
          opacity: 1,
          y: [0, -14, 0],
          rotate: [rotate - 4, rotate + 4, rotate - 4],
        }}
        transition={{
          opacity: { duration: 0.8, delay },
          y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
          rotate: { duration: duration * 1.4, repeat: Infinity, ease: 'easeInOut', delay },
        }}
      >
        {symbol}
      </motion.span>
    </motion.div>
  )
}
