import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Contacto from '../components/sections/Contacto'
import ContactForm from '../components/contact/ContactForm'
import { fadeUp, revealProps } from '../components/motion/variants'

// Página 6/8: Contacto. Antes esta página solo envolvía Contacto.jsx
// (correo + redes) — ahora ese componente se queda como una opción de
// contacto directo AL FINAL de la página, y arriba se agrega la
// bienvenida (contenido exacto pedido) + el formulario segmentado
// fusionado con la sesión global (ver ContactForm.jsx).
//
// Contacto.jsx ya no es lo PRIMERO en la página (antes tenía pt-28 para
// no quedar tapado por el navbar fijo; ahora ese padding se le quitó —
// ver el diff de ese archivo — porque el intro de abajo es lo que
// necesita esa separación ahora).
export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main>
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl px-4 pb-8 pt-28 text-center sm:px-6"
        >
          <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">Contáctame</h1>
          <p className="mt-4 text-brand-700">
            ¡Holaaa! Qué gusto que quieras ponerte en contacto. 🚀
          </p>
          <p className="mt-4 text-brand-700">
            TeacherPeri es un proyecto hecho con mucho cariño para acompañarte en tu camino
            olímpico y en tu meta de estudiar en el extranjero. Ya seas un estudiante buscando
            orientación, un exolímpico con ganas de aportar, o un profesor o papá/mamá buscando
            material, ¡este espacio es para ti!
          </p>
          <p className="mt-4 text-brand-700">
            No hay pregunta pequeña ni duda tonta. ¡Escríbeme con toda la confianza!
          </p>
        </motion.section>

        <motion.section variants={fadeUp} {...revealProps} className="px-4 pb-20 sm:px-6">
          <ContactForm />
        </motion.section>

        <Contacto />
      </main>
    </>
  )
}
