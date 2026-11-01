import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Chip, LiveBadge, SpecLabel } from '../components/Bits'
import { LinkButton } from '../components/Button'
import { DemoPanel } from '../components/DemoPanel'
import { ProjectVisual } from '../components/ShowcasePanel'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '../components/Icons'
import { getProject, projects } from '../content/projects'
import { profile } from '../content/profile'
import { track } from '../lib/analytics'
import { onLiveClick } from '../lib/live'
import { useMeta } from '../lib/useMeta'
import { useReveal } from '../lib/useReveal'
import { useUI } from '../store/ui'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = getProject(slug)
  const showToast = useUI((s) => s.showToast)
  const setActive = useUI((s) => s.setActiveProject)
  const setLast = useUI((s) => s.setLastProject)

  useMeta(p ? `${p.title} · ${profile.name}` : profile.name, p ? p.outcome : profile.value)
  useReveal(slug)

  useEffect(() => {
    if (!p) return
    window.scrollTo(0, 0)
    setActive(p.slug)
    setLast(p.slug)
    return () => setActive(null)
  }, [p, setActive, setLast])

  useEffect(() => {
    if (!p) showToast('error', 'Project not found')
  }, [p, showToast])

  if (!p) return <Navigate to="/#work" replace />

  const i = projects.indexOf(p)
  const next = projects[(i + 1) % projects.length]

  return (
    <article className="pt-16" aria-labelledby="project-title">
      <div className="container-site py-16 lg:py-24">
        <div className="grid grid-cols-4 gap-x-4 md:grid-cols-8 md:gap-x-6 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <Link
              to="/"
              state={{ restore: true }}
              className="text-spec inline-flex min-h-11 items-center gap-2 text-muted hover:text-text"
            >
              <ArrowLeft /> Back to work
            </Link>

            {/* 1. Spec label + title + badge + live link */}
            <SpecLabel n={`B${p.ball}`} label={p.type} className="mt-8" />
            <h1 id="project-title" className="text-display-l mt-5" data-reveal>
              {p.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4" data-reveal style={{ ['--i' as string]: 1 }}>
              <LiveBadge status={p.status} />
              {p.live && p.status !== 'offline' && (
                <LinkButton href={p.live} target="_blank" rel="noopener noreferrer" size="sm" onClick={() => onLiveClick(p.slug)}>
                  Open live site <ArrowUpRight />
                </LinkButton>
              )}
              {p.repo && (
                <LinkButton
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="secondary"
                  onClick={() => track('github_click', { from: p.slug })}
                >
                  Source <ArrowUpRight />
                </LinkButton>
              )}
            </div>

            {/* 2. One-line outcome */}
            <p className="text-body-l mt-8 max-w-[52ch]" data-reveal style={{ ['--i' as string]: 2 }}>
              {p.outcome}
            </p>

            {/* 3. Facts row: role first, for recruiters */}
            <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Role', p.role],
                ['Timeline', p.timeline],
                ['Client', p.client],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-spec text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px]">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-spec text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </dd>
              </div>
            </dl>

            {/* 4. Problem → What I built → Result */}
            <div className="mt-12 grid gap-10">
              {[
                ['Problem', p.problem],
                ['What I built', p.built],
                ['Result', p.result],
              ].map(([k, v], n) => (
                <section key={k} data-reveal style={{ ['--i' as string]: n }}>
                  <h2 className="text-spec text-muted">
                    0{n + 1} · {k}
                  </h2>
                  <p className="text-body-l mt-3 max-w-[68ch]">{v}</p>
                </section>
              ))}
            </div>

            {p.stat && (
              <p className="mt-12 flex items-baseline gap-3">
                <span className="font-mono tabular text-4xl">{p.stat.value}</span>
                <span className="text-muted">{p.stat.label}</span>
              </p>
            )}
          </div>
        </div>

        {/* 5. Screenshot / video */}
        {(p.shots.length > 0 || p.video) && (
          <div className="mt-16 grid gap-6 lg:max-w-[58%]">
            {p.shots.length > 0 && <ProjectVisual p={p} />}
            {p.video && <video className="card w-full" src={p.video} controls muted playsInline preload="none" />}
          </div>
        )}

        {/* 6. Try the demo (gym only) */}
        {p.hasDemo && (
          <div className="mt-16 lg:max-w-[58%]">
            <DemoPanel project={p} />
          </div>
        )}

        {/* 7. Next project */}
        <nav aria-label="More projects" className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <Link to="/" state={{ restore: true }} className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-text">
            <ArrowLeft /> Back to work
          </Link>
          <Link
            to={`/work/${next.slug}`}
            onClick={() => track('project_open', { slug: next.slug, from: 'next' })}
            className="group text-right"
          >
            <span className="text-spec block text-muted">Next · B{next.ball}</span>
            <span className="text-h3 inline-flex items-center gap-2 group-hover:text-accent">
              {next.title} <ArrowRight />
            </span>
          </Link>
        </nav>
      </div>
    </article>
  )
}
