import { Link } from 'react-router-dom'
import type { Project } from '../content/projects'
import { track } from '../lib/analytics'
import { onLiveClick } from '../lib/live'
import { Chip, LiveBadge } from './Bits'
import { ArrowRight, ArrowUpRight } from './Icons'

/** Browser-framed screenshot, or a spec card with the headline stat when there is no screenshot. */
export function ProjectVisual({ p, className = '' }: { p: Project; className?: string }) {
  const shot = p.shots.find((s) => s.kind === 'desktop')
  if (shot)
    return (
      <figure className={`card overflow-hidden ${className}`}>
        <div aria-hidden className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
          <i className="size-2.5 rounded-full bg-line" />
          <i className="size-2.5 rounded-full bg-line" />
          <i className="size-2.5 rounded-full bg-line" />
          <span className="ml-3 truncate font-mono text-[11px] text-muted">{p.live?.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
        </div>
        <img
          src={shot.src}
          srcSet={shot.small ? `${shot.small} 800w, ${shot.src} 1600w` : undefined}
          sizes="(min-width: 1024px) 760px, 100vw"
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-cover object-top"
        />
      </figure>
    )
  return (
    <div className={`card relative flex flex-col justify-between overflow-hidden p-6 ${className}`}>
      <span aria-hidden className="pointer-events-none absolute -right-6 -top-10 font-mono text-[160px] leading-none text-line">
        {p.ball}
      </span>
      <p className="text-spec relative text-muted">{p.type}</p>
      {p.stat && (
        <div className="relative mt-10">
          <p className="font-display text-6xl font-semibold tabular tracking-tight">{p.stat.value}</p>
          <p className="mt-2 text-muted">{p.stat.label}</p>
        </div>
      )}
      <ul className="relative mt-8 flex flex-wrap gap-2" aria-label="Stack">
        {p.stack.map((s) => (
          <li key={s}>
            <Chip>{s}</Chip>
          </li>
        ))}
      </ul>
    </div>
  )
}

const STEPS = ['Problem', 'What I built', 'Result'] as const

/**
 * One project, told in full: outcome, visual, problem → built → result, links.
 * `reveal` (0–1) brightens the three steps in order as the visitor scrolls the pinned showcase.
 */
export function ShowcasePanel({ p, reveal = 1, compact = false }: { p: Project; reveal?: number; compact?: boolean }) {
  const texts = [p.problem, p.built, p.result]
  return (
    <article aria-labelledby={`sp-${p.slug}`} className="flex flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-spec flex items-center gap-3 text-muted">
            <span className="text-accent">B{p.ball}</span> {p.type} <LiveBadge status={p.status} />
          </p>
          <h3 id={`sp-${p.slug}`} className="text-h3 mt-2">
            {p.title}
          </h3>
        </div>
        {p.stat && p.shots.length > 0 && (
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-2xl tabular">{p.stat.value}</span>
            <span className="text-sm text-muted">{p.stat.label}</span>
          </p>
        )}
      </header>

      <p className="text-body-l -mt-1 text-muted">{p.outcome}</p>

      <ProjectVisual p={p} className={compact ? '' : 'max-h-[min(34vh,320px)] [&_img]:max-h-[calc(min(34vh,320px)-37px)]'} />

      <ol className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
        {texts.map((t, i) => {
          const on = reveal >= (i + 0.5) / 3.5
          return (
            <li
              key={STEPS[i]}
              className={`card p-4 transition-[opacity,border-color] duration-[400ms] ${on ? 'opacity-100' : 'opacity-35'} ${
                on && reveal < (i + 1.5) / 3.5 ? 'border-accent/50' : ''
              }`}
            >
              <p className="text-spec text-muted">
                0{i + 1} · {STEPS[i]}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed">{t}</p>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
        {p.live && p.status !== 'offline' && (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLiveClick(p.slug)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-on-accent"
          >
            Open live site <ArrowUpRight />
            <span className="sr-only">(new tab)</span>
          </a>
        )}
        <Link
          to={`/work/${p.slug}`}
          onClick={() => track('project_open', { slug: p.slug, from: 'card' })}
          className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent"
        >
          Full case study{p.hasDemo ? ' + demo login' : ''} <ArrowRight />
          <span className="sr-only">: {p.title}</span>
        </Link>
      </div>
    </article>
  )
}
