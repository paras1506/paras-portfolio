import { Chip, Section } from '../components/Bits'
import { ArrowRight } from '../components/Icons'
import { profile } from '../content/profile'
import { achievements, certificates, experience } from '../content/journey'

export function Journey() {
  const e = profile.education
  return (
    <Section
      id="journey"
      n="03"
      label="Journey"
      title="From campus to client work to industry."
      intro="Read left to right: each step builds on the one before."
    >
      {/* Experience path */}
      <ol className="relative mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {experience.map((x, i) => (
          <li
            key={x.company}
            data-reveal
            style={{ ['--i' as string]: i }}
            className={`card card-hover relative flex flex-col p-6 ${x.current ? 'border-accent/70' : ''}`}
          >
            <div className="flex min-h-7 items-center justify-between gap-3">
              <p className="font-mono text-xs tabular text-muted">
                {x.start} – {x.end}
              </p>
              {x.current ? (
                <span className="text-spec inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-1 text-on-accent">
                  <span className="size-1.5 animate-pulse rounded-full bg-on-accent" /> Now
                </span>
              ) : (
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              )}
            </div>
            <h3 className="text-h3 mt-5">{x.company}</h3>
            {x.role && <p className="mt-1 text-sm text-muted">{x.role}</p>}
            <ul className="mt-4 grid gap-2.5">
              {x.points.map((pt) => (
                <li key={pt} className="flex gap-2.5 text-[15px] leading-relaxed">
                  <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
            {x.tags.length > 0 && (
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {x.tags.map((t) => (
                  <li key={t}>
                    <Chip>{t}</Chip>
                  </li>
                ))}
              </ul>
            )}
            {i < experience.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-[11px] top-1/2 z-10 hidden size-5 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg text-muted xl:flex"
              >
                <ArrowRight width={12} height={12} />
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* Bento: education, achievements, certificates */}
      <div className="mt-6 grid gap-4 md:grid-cols-6 lg:grid-cols-12">
        <div className="card p-6 md:col-span-6 lg:col-span-5" data-reveal>
          <p className="text-spec text-muted">Education</p>
          <p className="text-h3 mt-4">{e.degree}</p>
          <p className="mt-1 text-muted">
            {e.school} · {e.year}
          </p>
          <div className="mt-6 flex items-baseline gap-2 border-t border-line pt-5">
            <span className="font-mono text-4xl tabular">{e.cgpa}</span>
            <span className="text-muted">CGPA / 10</span>
          </div>
        </div>

        <div className="card p-6 md:col-span-6 lg:col-span-7" data-reveal style={{ ['--i' as string]: 1 }}>
          <p className="text-spec text-muted">Certificates</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {certificates.map((c) => (
              <li key={c.title} className="rounded-xl bg-surface-2 p-4">
                <p className="text-spec text-accent">{c.org}</p>
                <p className="mt-2 text-[15px] leading-snug">{c.title}</p>
              </li>
            ))}
          </ul>
        </div>

        {achievements.map((a, i) => (
          <div
            key={a.title}
            className="card card-hover p-5 md:col-span-3 lg:col-span-3"
            data-reveal
            style={{ ['--i' as string]: Math.min(i, 5) }}
          >
            <div className="flex items-center justify-between">
              <p className="text-spec text-muted">{a.kind}</p>
              <p className="font-mono text-xs text-faint">{a.year}</p>
            </div>
            <p className="mt-4 font-medium leading-snug">{a.title}</p>
            <p className="mt-1 text-sm text-muted">{a.detail}</p>
          </div>
        ))}
        <div className="card p-5 md:col-span-3 lg:col-span-3" data-reveal style={{ ['--i' as string]: 5 }}>
          <p className="text-spec text-muted">Practice</p>
          <p className="mt-4 font-mono text-3xl tabular">400+</p>
          <p className="mt-1 text-sm text-muted">LeetCode and CodeChef problems</p>
        </div>
      </div>
    </Section>
  )
}
