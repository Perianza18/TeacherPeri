import { MeshGradient } from '@paper-design/shaders-react'

// Sección Contacto (id="contacto")
// Fondo animado con shaders (@paper-design/shaders-react), mismo tipo de
// mesh gradient que el Hero, en la paleta TeacherPeri: rojo #7C3AED,
// naranja #5B5FE9 y amarillo dorado #2563EB.
//
// TODO: href de mailto y de cada red son placeholders — no son datos
// inventados sobre vos, son literalmente marcadores de posición que hay
// que reemplazar con tu correo/redes reales antes de publicar el sitio.
const CORREO_CONTACTO = 'tu-correo@ejemplo.com'

const REDES = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/tu-usuario',
    icon: '/icons8-instagram-logo-48.png',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/tu-usuario',
    icon: '/icons8-linkedin-50.png',
  },
]

export default function Contacto() {
  return (
    <section
      id="contacto"
      className="relative mx-auto w-full overflow-hidden bg-[#0B0B0F] px-6 py-12 sm:px-10"
    >
      {/* Fondo shader: mismo mesh gradient animado del Hero, paleta TeacherPeri */}
      <div className="pointer-events-none absolute inset-0">
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={['#7C3AED', '#5B5FE9', '#2563EB', '#0B0B0F']}
          speed={0.3}
          distortion={0.85}
          swirl={0.3}
          grainMixer={0.05}
          grainOverlay={0.05}
        />
        {/* Overlay oscuro para mantener contraste y legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/75 via-[#0B0B0F]/35 to-[#0B0B0F]/85" />
      </div>

      {/* CONTÁCTANOS */}
      <div className="relative text-center">
        <h2 className="text-4xl font-bold uppercase text-white drop-shadow-[0_0_25px_rgba(229,117,5,0.45)] sm:text-5xl">
          Contáctame
        </h2>

        <a
          href={`mailto:${CORREO_CONTACTO}`}
          className="mt-6 inline-block text-2xl font-medium text-white drop-shadow-[0_0_18px_rgba(255,180,1,0.4)] hover:underline"
        >
          Correo
        </a>
      </div>

      {/* FOOTER — REDES SOCIALES. Antes era un <p> envolviendo un <div>,
          HTML inválido (un div no puede vivir dentro de un p) que el
          navegador "arregla" cerrando el <p> antes de tiempo y rompe el
          layout de todo lo que sigue. */}
      <div className="relative text-center text-lg text-white">
        <div className="mt-6 flex justify-center gap-8">
          {REDES.map((red) => (
            <a
              key={red.label}
              href={red.href}
              target="_blank"
              rel="noreferrer"
              aria-label={red.label}
              className="rounded-full transition-transform hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(183,11,13,0.6)]"
            >
              <img
                src={red.icon}
                alt={red.label}
                className="h-12 w-12 object-contain drop-shadow-[0_0_10px_rgba(255,180,1,0.35)]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
