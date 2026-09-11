import Navbar from '../components/Navbar'
import Contacto from '../components/sections/Contacto'

// Página 5/9: Contacto — antes era una sección pegada al final de
// Inicio (HomePage.jsx), ahora es su propia página independiente.
// Por ahora sigue reutilizando el mismo componente Contacto.jsx de
// siempre (correo + redes) — el formulario segmentado por perfiles que
// se pidió todavía no está construido, llega con el contenido real.
export default function ContactoPage() {
  return (
    <>
      <Navbar />
      <main>
        <Contacto />
      </main>
    </>
  )
}
