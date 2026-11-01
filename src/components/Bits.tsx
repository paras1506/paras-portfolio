import type { ReactNode } from 'react'
import type { ProjectStatus } from '../content/projects'

/** `SPEC 03 / WORK` — opens every section; the number matches nav order. */
export function SpecLabel({ n, label, className = '' }: { n: string; label: string; className?: string }) {
  return (
    <p className={`text-spec text-muted flex items-center gap-3 ${className}`}>
      <span aria-hidden className="inline-block h-px w-6 bg-accent" />
      <span>
        SPEC {n} / {label}
      </span>
    </p>
  )
}

export function Chip({ children, selected }: { children: ReactNode; selected?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-2.5 py-1 text-[13px] leading-5 ${
        selected ? 'bg-accent text-on-accent' : 'bg-surface-2 text-text'
      }`}
    >
      {children}
    </span>
  )
}

export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono tabular text-2xl font-medium text-text">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}

const badge: Record<ProjectStatus, { text: string; dot: string }> = {
  live: { text: 'Live', dot: 'bg-success' },
  'in-progress': { text: 'In progress', dot: 'bg-warning' },
  archived: { text: 'Archived', dot: 'bg-muted' },
  offline: { text: 'Demo offline', dot: 'bg-muted' },
}

export function LiveBadge({ status }: { status: ProjectStatus }) {
  const b = badge[status]
  return (
    <span className="text-spec inline-flex items-center gap-2 text-muted">
      <span aria-hidden className={`size-2 rounded-full ${b.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      {b.text}
    </span>
  )
}

/** Wraps a section with the shared heading pattern and aria-labelledby. */
export function Section({
  id,
  n,
  label,
  title,
  intro,
  children,
  className = '',
}: {
  id: string
  n: string
  label: string
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} data-section={id} className={`section-pad scroll-mt-16 ${className}`}>
      <div className="container-site">
        <div className="max-w-[68ch]">
          <SpecLabel n={n} label={label} />
          <h2 id={`${id}-title`} className="text-display-l mt-5" data-reveal>
            {title}
          </h2>
          {intro && (
            <p className="text-body-l text-muted mt-5" data-reveal style={{ ['--i' as string]: 1 }}>
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
