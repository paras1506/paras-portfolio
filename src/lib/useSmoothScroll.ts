import Lenis from 'lenis'
import { useEffect } from 'react'
import { useUI } from '../store/ui'

/** Lenis smooth scroll (lerp 0.1) on desktop only; off under reduced motion and on touch devices. */
export function useSmoothScroll() {
  const reduce = useUI((s) => s.reduceMotion)
  useEffect(() => {
    if (reduce || matchMedia('(pointer: coarse)').matches) return
    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true })
    return () => lenis.destroy()
  }, [reduce])
}
