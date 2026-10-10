import { useEffect, useRef } from 'react'

export default function useDialog(onClose) {
  const ref = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const selectors = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], select:not(:disabled)'
    const focusable = () => [...(ref.current?.querySelectorAll(selectors) || [])].filter((node) => node.getClientRects().length)
    ;(ref.current?.querySelector('input') || focusable()[0])?.focus()
    const keydown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      if (event.key !== 'Tab') return
      const nodes = focusable()
      const first = nodes[0]; const last = nodes.at(-1)
      if (!first) { event.preventDefault(); return }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = overflow; previous?.focus?.() }
  }, [onClose])
  return ref
}
