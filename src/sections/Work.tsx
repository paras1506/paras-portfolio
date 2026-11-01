import { useEffect, useRef, useState } from 'react'
import { Section } from '../components/Bits'
import { ShowcasePanel } from '../components/ShowcasePanel'
import { archive, projects } from '../content/projects'
import { highlightProject } from '../lib/highlight'
import { useMediaQuery } from '../lib/useMediaQuery'
import { useUI } from '../store/ui'

/** Viewport heights of scroll given to each project in the pinned showcase. */
const SLICE = 110
const NAV = 64

/**
 * Desktop: the showcase pins and scrolling moves through the six projects one by one, revealing
 * problem → built → result for each, while the matching ball glows. No clicks needed to read it all.
 */
function PinnedShowcase() {
  const track = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  const [sub, setSub] = useState(0)
  const [range, setRange] = useState(0)
  const setShowcase = useUI((s) => s.setShowcaseProject)
  const n = projects.length

  useEffect(() => {
    let raf = 0
    const measure = () => {
      const el = track.current
      if (!el) return
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      const span = r.height - (vh - NAV)
      setRange(span)
      const prog = Math.min(1, Math.max(0, (NAV - r.top) / span))
      const i = Math.min(n - 1, Math.floor(prog * n))
      setIdx(i)
      setSub(Math.round(Math.min(1, prog * n - i) * 20) / 20)
      const inView = r.top < vh * 0.5 && r.bottom > vh * 0.5
      setShowcase(inView ? projects[i].slug : null)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      setShowcase(null)
    }
  }, [n, setShowcase])

  return (
    <div ref={track} className="relative mt-12" style={{ height: `${n * SLICE}vh` }}>
      {/* Scroll anchors, one per project, so "See a gym" and the progress buttons land on the right slice. */}
      {projects.map((p, i) => (
        <span
          key={p.slug}
          id={`project-${p.slug}`}
          aria-hidden
          className="absolute left-0 w-px scroll-mt-16"
          style={{ top: range ? ((i + 0.15) * range) / n : `${i * SLICE}vh` }}
        />
      ))}

      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center">
        <div className="w-full lg:w-[58%]">
          {/* Progress: which part of the bearing we are looking at */}
          <div className="mb-6 flex items-center gap-4">
            <p className="font-mono text-sm tabular" aria-live="polite">
              <span className="text-accent">{projects[idx].ball}</span>
              <span className="text-muted"> / 0{n}</span>
            </p>
            <ol className="flex flex-1 gap-1.5" aria-label="Jump to project">
              {projects.map((p, i) => (
                <li key={p.slug} className="flex-1">
                  <button
                    type="button"
                    onClick={() => highlightProject(p.slug)}
                    aria-label={`Project ${p.ball}: ${p.title}`}
                    aria-current={i === idx ? 'step' : undefined}
                    className="group block w-full py-3"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-line group-hover:bg-muted/50">
                      <span
                        className="block h-full origin-left bg-accent transition-transform duration-150"
                        style={{ transform: `scaleX(${i < idx ? 1 : i === idx ? Math.max(sub, 0.04) : 0})` }}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid">
            {projects.map((p, i) => (
              <div
                key={p.slug}
                inert={i !== idx}
                aria-hidden={i !== idx}
                className="[grid-area:1/1] transition-[opacity,transform] duration-500 ease-out"
                style={{
                  opacity: i === idx ? 1 : 0,
                  transform: `translateY(${i === idx ? 0 : i < idx ? -28 : 28}px)`,
                }}
              >
                <ShowcasePanel p={p} reveal={i === idx ? sub * 1.25 : i < idx ? 1 : 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StackedShowcase() {
  return (
    <div className="mt-12 grid gap-6">
      {projects.map((p, i) => (
        <div key={p.slug} id={`project-${p.slug}`} className="card min-w-0 scroll-mt-20 p-5 sm:p-6" data-reveal style={{ ['--i' as string]: Math.min(i, 2) }}>
          <ShowcasePanel p={p} compact />
        </div>
      ))}
    </div>
  )
}

export function Work() {
  const pinned = useMediaQuery('(min-width: 1024px) and (min-height: 720px)')
  return (
    <Section
      id="work"
      n="02"
      label="Work"
      title="Six parts. Keep scrolling."
      intro="Each ball in the bearing is one project. Scroll and they come to you one by one: the problem, what I built, and what changed."
    >
      {pinned ? <PinnedShowcase /> : <StackedShowcase />}

      <div className="mt-16">
        <h3 className="text-spec text-muted">Archive</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:max-w-[58%]">
          {archive.map((a, i) => (
            <li key={a.title} className="card card-hover p-5" data-reveal style={{ ['--i' as string]: i }}>
              <p className="text-spec text-muted">{a.type}</p>
              <p className="mt-2 font-medium">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
