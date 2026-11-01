import { useEffect } from 'react'
import { track } from './analytics'

/** Fires `section_view` once per section when it is 50% visible for 1 s. */
export function useSectionViews() {
  useEffect(() => {
    const seen = new Set<string>()
    const timers = new Map<string, ReturnType<typeof setTimeout>>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.section!
          if (seen.has(id)) continue
          if (e.isIntersecting) {
            timers.set(
              id,
              setTimeout(() => {
                seen.add(id)
                track('section_view', { section: id })
              }, 1000),
            )
          } else {
            clearTimeout(timers.get(id))
          }
        }
      },
      // Tall sections can never be 50% visible on a short screen, so also accept "fills half the viewport".
      { threshold: [0.5], rootMargin: '-25% 0px -25% 0px' },
    )
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])
}
