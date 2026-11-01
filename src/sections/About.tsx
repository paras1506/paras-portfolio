import { Section } from '../components/Bits'
import { profile } from '../content/profile'

export function About() {
  const e = profile.education
  return (
    <Section id="about" n="01" label="About" title="Small, precise parts that keep a business turning.">
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:max-w-[58%]">
        <div className="card p-6 sm:col-span-2" data-reveal>
          <p className="text-spec text-muted">Who</p>
          {profile.bio.map((p, i) => (
            <p key={i} className={`text-body-l ${i ? 'mt-4 text-muted' : 'mt-3'}`}>
              {p}
            </p>
          ))}
        </div>

        {profile.focus.map((f, i) => (
          <div
            key={f.label}
            className={`card card-hover p-6 ${i === 0 ? 'border-accent/60' : ''} ${i === 2 ? 'sm:col-span-2' : ''}`}
            data-reveal
            style={{ ['--i' as string]: i + 1 }}
          >
            <p className={`text-spec ${i === 0 ? 'text-accent' : 'text-muted'}`}>{f.label}</p>
            <p className="mt-3 text-lg leading-snug">{f.text}</p>
          </div>
        ))}

        <div className="card p-6" data-reveal style={{ ['--i' as string]: 4 }}>
          <p className="text-spec text-muted">Education</p>
          <p className="mt-3 leading-snug">{e.school}</p>
          <p className="mt-1 text-sm text-muted">
            B.Tech CSE · {e.year}
          </p>
        </div>
        <div className="card flex items-end justify-between p-6" data-reveal style={{ ['--i' as string]: 5 }}>
          <div>
            <p className="text-spec text-muted">CGPA</p>
            <p className="mt-3 font-mono text-4xl tabular">{e.cgpa}</p>
          </div>
          <p className="text-spec text-muted">{profile.location}</p>
        </div>
      </div>
    </Section>
  )
}
