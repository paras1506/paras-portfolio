import { useMemo } from 'react'
import { useUI } from '../store/ui'

/** Reads the shared CSS tokens so HTML and 3D materials use one palette. Recomputed on theme change. */
export function useSceneColors() {
  const theme = useUI((s) => s.theme)
  return useMemo(() => {
    const cs = getComputedStyle(document.documentElement)
    const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback
    return {
      theme,
      steel: v('--steel', '#B8C0CA'),
      ball: v('--ball', '#E6EAEE'),
      cage: v('--cage', '#2A2E34'),
      accent: v('--accent', '#FF6A1A'),
      text: v('--text', '#EDEEF0'),
    }
    // theme is the trigger: data-theme is updated before this re-renders.
  }, [theme])
}
