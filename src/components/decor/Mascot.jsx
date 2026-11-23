import { POSES } from '../../lib/mascots'

// One pose as a decorative image (aria-hidden). `className` sets its height;
// the width follows. `flip` mirrors it.
export default function Mascot({ pose, className = '', flip = false }) {
  const { src, width, height } = POSES[pose]
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      draggable="false"
      decoding="async"
      className={`pointer-events-none w-auto select-none ${flip ? '-scale-x-100' : ''} ${className}`}
    />
  )
}
