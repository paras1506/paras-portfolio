import { useUI } from '../store/ui'
import { track } from './analytics'

/** Call from every "open live site" link. Remembers the project for the WhatsApp prefill and the return bar. */
export function onLiveClick(slug: string) {
  const s = useUI.getState()
  s.setLastProject(slug)
  s.setLiveVisit(slug)
  track('project_live_click', { slug })
}
