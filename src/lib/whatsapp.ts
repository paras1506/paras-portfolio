import { waLink } from '../content/profile'
import { getProject } from '../content/projects'

const noun = { gym: 'gym website', salon: 'salon website', restaurant: 'restaurant website' } as const

/** Prefilled WhatsApp link naming the project the visitor last viewed (User Flows § Flow B). */
export function waEnquiry(lastSlug: string | null) {
  const p = getProject(lastSlug ?? undefined)
  const seen = p ? (p.category ? `your ${noun[p.category]}` : p.title) : 'your website'
  return waLink(`Hi Paras, I saw ${seen}. I run a ___ in ___.`)
}
