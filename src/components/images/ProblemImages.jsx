import { byPlacement, imageSrc } from '../../lib/images'

// The pictures of a problem for one place (under the statement, or inside the
// solution). One image is centered; two or more sit in a row and stack on
// phones, like lesson figures (DESIGN §5 «Figura»).
export default function ProblemImages({ images, placement = 'statement', className = '' }) {
  const list = byPlacement(images, placement)
  if (!list.length) return null
  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {list.map((entry) => (
        <figure key={entry.image} className={`m-0 ${list.length > 1 ? 'min-w-[220px] flex-[1_1_220px]' : 'w-full'} max-w-[560px]`}>
          <img src={imageSrc(entry.image)} alt={entry.alt} loading="lazy" decoding="async" className="mx-auto block h-auto max-h-[480px] w-auto max-w-full rounded-[14px] border-2 border-tp-ink bg-tp-surface object-contain" />
        </figure>
      ))}
    </div>
  )
}
