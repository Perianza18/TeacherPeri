import { useId } from 'react'

// Divisor orgánico entre secciones: un SVG con forma de ola en vez de un
// borde recto. `colors` acepta 1 color (relleno sólido) o varios (se
// arma un gradiente horizontal entre ellos, útil para una franja de luz
// translúcida en vez de un bloque de color que compita con el fondo).
//
// Se posiciona solo (`absolute inset-x-0 bottom-0`) pegado al borde de
// abajo de la sección que lo contiene — esa sección necesita
// `className="relative"` (o similar) para que la posición funcione.
export default function WaveDivider({ colors = ['#120303'], flip = false, className = '' }) {
  const gradientId = useId()
  const fill = colors.length > 1 ? `url(#${gradientId})` : colors[0]

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden leading-[0] ${
        flip ? 'rotate-180' : ''
      } ${className}`}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-20 w-full sm:h-28">
        {colors.length > 1 && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              {colors.map((color, i) => (
                <stop key={color + i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
        )}
        <path
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
