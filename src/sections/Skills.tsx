import { Chip, Section } from '../components/Bits'
import { skills } from '../content/profile'

export function Skills() {
  return (
    <Section id="skills" n="04" label="Skills" title="The toolbox.">
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {skills.map((g, i) => (
          <div key={g.group} className="card card-hover flex flex-col p-6" data-reveal style={{ ['--i' as string]: i }}>
            <div className="flex items-center justify-between">
              <h3 className="text-h3">{g.group}</h3>
              <span className="font-mono text-xs text-faint">0{i + 1}</span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
