import Navbar from '../components/Navbar'
import Hero from '../components/sections/Hero'
import QueEsTeacherPeri from '../components/sections/QueEsTeacherPeri'

// Página 1/9: Inicio. Ya no incluye Contacto (ahora es su propia
// página, ver ContactoPage.jsx) — y como cada página del sitio es
// ahora una ruta real (ver Navbar.jsx), ya no hace falta el
// useEffect/location.state que reenviaba un scroll-to-sección desde
// otra ruta: eso solo existía para el patrón de one-pager que ya no
// aplica.
function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QueEsTeacherPeri />
      </main>
    </>
  )
}

export default HomePage
