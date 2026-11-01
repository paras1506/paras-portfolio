import { useUI } from '../store/ui'

let timer: ReturnType<typeof setTimeout> | undefined

/** Scroll the Work section to a project (pinned slice or stacked card) and make its ball glow. */
export function highlightProject(slug: string) {
  const el = document.getElementById(`project-${slug}`)
  if (!el) return
  const { setActiveProject, setLastProject, reduceMotion } = useUI.getState()
  setLastProject(slug)
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  setActiveProject(slug)
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (useUI.getState().activeProject === slug) setActiveProject(null)
  }, 2500)
}
