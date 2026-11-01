import { useEffect, useState } from 'react'
import { getProject } from '../content/projects'
import { track } from '../lib/analytics'
import { getReferrer } from '../lib/referrer'
import { waEnquiry } from '../lib/whatsapp'
import { useUI } from '../store/ui'
import { Close, WhatsApp } from './Icons'

/** After a visitor opens a client's live site and comes back, offer a WhatsApp chat (User Flows § Flow B, step 5). */
export function ReturnBar() {
  const liveVisit = useUI((s) => s.liveVisit)
  const setLiveVisit = useUI((s) => s.setLiveVisit)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!liveVisit || !getProject(liveVisit)?.category) return
    const onVis = () => document.visibilityState === 'visible' && setShow(true)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [liveVisit])

  if (!show || !liveVisit) return null

  const dismiss = () => {
    setShow(false)
    setLiveVisit(null)
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4" role="region" aria-label="Enquiry">
      <div className="flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-5 pr-1.5 text-sm">
        <span className="hidden sm:inline">Want one like this?</span>
        <a
          href={waEnquiry(liveVisit)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track('whatsapp_click', { ref: getReferrer(), project: liveVisit })
            dismiss()
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 font-medium text-on-accent"
        >
          <WhatsApp /> Chat on WhatsApp
        </a>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-2">
          <Close />
        </button>
      </div>
    </div>
  )
}
