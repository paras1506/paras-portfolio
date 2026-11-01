import { useEffect, useState } from 'react'
import { ArrowRight, Download } from '../components/Icons'
import { LinkButton, Nudge } from '../components/Button'
import { profile } from '../content/profile'
import { stats } from '../content/journey'
import { projects } from '../content/projects'
import { track } from '../lib/analytics'
import { useUI } from '../store/ui'

const SPEC = 'SPEC 00 / INTRO'

/** Types the spec label in, 20 ms per character (UI Guidelines § Motion, page load). */
function useTyped(text: string, skip: boolean) {
  const [n, setN] = useState(skip ? text.length : 0)
  useEffect(() => {
    if (skip) return setN(text.length)
    let i = 0
    const t = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) clearInterval(t)
    }, 20)
    return () => clearInterval(t)
  }, [text, skip])
  return text.slice(0, n)
}

export function Hero() {
  const reduce = useUI((s) => s.reduceMotion)
  const typed = useTyped(SPEC, reduce)

  return (
    <section
      id="home"
      data-section="home"
      aria-labelledby="home-title"
      className="relative flex min-h-[100svh] flex-col pt-[45svh] md:pt-16"
    >
      <div className="container-site grid flex-1 grid-cols-4 items-center gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12">
        <div className="col-span-4 py-12 md:col-span-5 lg:col-span-7">
          <p className="text-spec text-muted flex items-center gap-3" aria-label={SPEC}>
            <span aria-hidden className="inline-block h-px w-6 bg-accent" />
            <span aria-hidden className="min-h-[1.4em]">
              {typed}
              <span className="ml-0.5 inline-block w-[0.6em] animate-pulse bg-accent/80 align-[-2px]">&nbsp;</span>
            </span>
          </p>

          <h1 id="home-title" className="text-display-xl mt-6 hero-rise" style={{ ['--d' as string]: '260ms' }}>
            {profile.name}
          </h1>
          <p className="text-h3 mt-5 hero-rise" style={{ ['--d' as string]: '360ms' }}>
            {profile.role}.
            <br />
            <span className="text-muted">Founder, {profile.company}.</span>
          </p>
          <p className="text-body-l mt-6 max-w-[34ch] text-muted hero-rise" style={{ ['--d' as string]: '460ms' }}>
            {profile.value}
          </p>

          <div className="mt-10 flex flex-wrap gap-3 hero-rise" style={{ ['--d' as string]: '600ms' }}>
            <LinkButton href="#work">
              View work
              <Nudge>
                <ArrowRight />
              </Nudge>
            </LinkButton>
            <LinkButton
              variant="secondary"
              href={profile.resume}
              target="_blank"
              rel="noopener"
              onClick={() => track('resume_download', { from: 'hero' })}
            >
              Resume PDF <Download />
            </LinkButton>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 hero-rise" style={{ ['--d' as string]: '760ms' }}>
            {stats.map((st) => (
              <li key={st.label} className="card px-4 py-3">
                <p className="font-mono text-xl tabular">{st.value}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{st.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <p
          aria-hidden
          className="text-spec col-span-4 hidden self-end pb-10 text-right text-muted md:col-span-3 md:block lg:col-span-5"
        >
          TOL ±0.01 · {projects.length} PARTS · {profile.location.toUpperCase()}
        </p>
      </div>

      <div className="container-site flex items-center justify-between border-t border-line py-4">
        <span className="text-spec text-muted">Scroll ↓</span>
        <span className="text-spec text-muted">Bearing ref. 6204-PW</span>
      </div>
    </section>
  )
}
