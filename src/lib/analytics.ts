// Cookieless analytics. Sends to Vercel Web Analytics or Umami when either script is present,
// and logs in dev. Event names follow User Flows § Analytics events.
export type AnalyticsEvent =
  | 'section_view'
  | 'resume_download'
  | 'project_open'
  | 'project_live_click'
  | 'demo_open'
  | 'demo_failed'
  | 'whatsapp_click'
  | 'contact_submit'
  | 'scene_tier'
  | 'github_click'

type Props = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    va?: (event: 'event', payload: { name: string; data?: Props }) => void
    umami?: { track: (name: string, data?: Props) => void }
  }
}

export function track(name: AnalyticsEvent, data?: Props) {
  try {
    window.va?.('event', { name, data })
    window.umami?.track(name, data)
  } catch {
    /* analytics must never break the page */
  }
  if (import.meta.env.DEV) console.debug('[track]', name, data ?? {})
}
