import { useState } from 'react'
import PeriPenguin from './PeriPenguin'
import CathCat from './CathCat'
import Mascot from './Mascot'
import { POSES, isWidePose } from '../../lib/mascots'

const ALL = Object.keys(POSES)

// Any of the seven poses of Peri and Cath, picked at random each time it
// appears, for the places where they take turns (the 404 page, «no results»
// notes). The plain poses can show the «?»; the wide ones (Cath lying down or
// playing) use `wideClassName` for their height when it is given, so they
// don't take more room than the tall ones.
export default function RandomMascot({ className = '', wideClassName = null, question = false, flip = false }) {
  const [pose] = useState(() => ALL[Math.floor(Math.random() * ALL.length)])
  if (pose === 'peri') return <PeriPenguin className={className} question={question} flip={flip} />
  if (pose === 'cath') return <CathCat className={className} question={question} flip={flip} />
  return <Mascot pose={pose} flip={flip} className={isWidePose(pose) && wideClassName ? wideClassName : className} />
}
