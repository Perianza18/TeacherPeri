import peri from '../assets/penguin.webp'
import periSaludando from '../assets/peri-saludando.webp'
import periEstudioso from '../assets/peri-estudioso.webp'
import cath from '../assets/cath.webp'
import cathPatita from '../assets/cath-patita.webp'
import cathAcostada from '../assets/cath-acostada.webp'
import cathJugando from '../assets/cath-jugando.webp'

// Every pose of the two mascots, Peri's penguin and Cath the cat, cut out of
// their white backgrounds (src/assets/*.webp, 640–800 px on the long side).
// Each pose has its place on the site (docs/DESIGN.md, «Mascots»):
//   peri-saludando  «Entrar / Crear cuenta» and Contacto: hello
//   peri-estudioso  Teoría and Rutas: studying
//   cath-jugando    Problemas and Exámenes: practice
//   cath-acostada   «Próximamente» pages: nothing here yet
//   cath-patita     thank-you and empty notes
// The plain poses (peri, cath) also have PeriPenguin and CathCat, which add
// the «?» and the sticker rim. Drawn by src/components/decor/Mascot.jsx.
export const POSES = {
  peri: { src: peri, width: 468, height: 800 },
  'peri-saludando': { src: periSaludando, width: 458, height: 640 },
  'peri-estudioso': { src: periEstudioso, width: 457, height: 640 },
  cath: { src: cath, width: 438, height: 640 },
  'cath-patita': { src: cathPatita, width: 414, height: 640 },
  'cath-acostada': { src: cathAcostada, width: 640, height: 344 },
  'cath-jugando': { src: cathJugando, width: 640, height: 465 },
}

export const isWidePose = (pose) => POSES[pose].width > POSES[pose].height
