import { useState } from 'react'
import PeriPenguin from './PeriPenguin'
import CathCat from './CathCat'

// One of the two mascots, Peri's penguin or Cath the cat, picked at random
// each time it appears, for the places where they take turns (the 404 page,
// «no results» notes). Takes the same options as PeriPenguin and CathCat.
export default function RandomMascot(props) {
  const [isCath] = useState(() => Math.random() < 0.5)
  return isCath ? <CathCat {...props} /> : <PeriPenguin {...props} />
}
