import { Section } from '../components/Bits'
import { LinkButton } from '../components/Button'
import { ArrowRight, WhatsApp } from '../components/Icons'
import { services } from '../content/profile'
import { projects } from '../content/projects'
import { track } from '../lib/analytics'
import { highlightProject } from '../lib/highlight'
import { useReferrer } from '../lib/referrer'
import { waEnquiry } from '../lib/whatsapp'
import { useUI } from '../store/ui'

export function Services() {
  const ref = useReferrer()
  const last = useUI((s) => s.lastProject)
  return (
    <Section
      id="services"
      n="05"
      label="Services · Grovanta"
      title="Websites and AI tools for local businesses."
      intro="Grovanta is my studio. I build the tools a gym, salon or restaurant needs to take bookings and orders without extra staff."
    >
      <ul className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
        {services.map((s, i) => {
          const p = projects.find((x) => x.category === s.category)
          const shot = p?.shots[0]
          return (
            <li key={s.id} className="card card-hover flex flex-col overflow-hidden" data-reveal style={{ ['--i' as string]: i }}>
              {shot && (
                <img
                  src={shot.small ?? shot.src}
                  alt=""
                  width={800}
                  height={Math.round((shot.height / shot.width) * 800)}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/8] w-full border-b border-line object-cover object-top"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-sm text-faint">0{i + 1}</span>
                <h3 className="text-h3 mt-3">{s.title}</h3>
                <p className="mt-3 text-muted">{s.text}</p>
                <p className="mt-4 text-sm">{s.example}</p>
                {p && (
                  <button
                    type="button"
                    onClick={() => highlightProject(p.slug)}
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-4 text-sm font-medium hover:text-accent"
                  >
                    {s.seeLabel} <ArrowRight />
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-6" data-reveal>
        <p className="text-h3">Have a business like these? Let's talk.</p>
        <div className="flex flex-wrap items-center gap-4">
        <LinkButton
          href={waEnquiry(last)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('whatsapp_click', { ref, project: last ?? 'none' })}
        >
          <WhatsApp width={18} height={18} /> Chat on WhatsApp
        </LinkButton>
          <p className="text-sm text-muted">Usually replies the same day.</p>
        </div>
      </div>
    </Section>
  )
}
