import { useId, useState, type FormEvent } from 'react'
import { Section } from '../components/Bits'
import { Button, LinkButton, Nudge } from '../components/Button'
import { ArrowRight, Check, Download, GitHub, LinkedIn, Mail, WhatsApp } from '../components/Icons'
import { profile } from '../content/profile'
import { track } from '../lib/analytics'
import { getReferrer } from '../lib/referrer'
import { waEnquiry } from '../lib/whatsapp'
import { useUI } from '../store/ui'

type Kind = 'job' | 'project' | 'other'
type Status = 'idle' | 'sending' | 'sent' | 'failed'
type Field = 'name' | 'email' | 'message'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined

const kinds: { id: Kind; label: string }[] = [
  { id: 'job', label: 'Job' },
  { id: 'project', label: 'Project' },
  { id: 'other', label: 'Other' },
]

function validate(f: Field, v: string): string | null {
  const t = v.trim()
  if (f === 'name') return t ? null : 'Please enter your name.'
  if (f === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? null : 'Please enter a valid email, like name@company.com.'
  return t.length >= 10 ? null : 'Please write at least a sentence (10+ characters).'
}

function mailto(kind: Kind, name: string, message: string) {
  const subject = `[${kind}] Enquiry from ${name || 'portfolio'}`
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
}

export function Contact() {
  const uid = useId()
  const showToast = useUI((s) => s.showToast)
  const last = useUI((s) => s.lastProject)
  const [kind, setKind] = useState<Kind>(() => (getReferrer() === 'wa' ? 'project' : 'job'))
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')

  const set = (f: Field) => (v: string) => {
    setValues((s) => ({ ...s, [f]: v }))
    if (errors[f]) setErrors((e) => ({ ...e, [f]: validate(f, v) ?? undefined }))
  }
  const blur = (f: Field) => () => setErrors((e) => ({ ...e, [f]: validate(f, values[f]) ?? undefined }))

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const next: Partial<Record<Field, string>> = {}
    ;(['name', 'email', 'message'] as Field[]).forEach((f) => {
      const err = validate(f, values[f])
      if (err) next[f] = err
    })
    setErrors(next)
    const first = (Object.keys(next) as Field[])[0]
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    // Honeypot: bots fill hidden fields. Pretend success, send nothing.
    if ((form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value) {
      setStatus('sent')
      return
    }

    if (!FORMSPREE_ID) {
      window.location.href = mailto(kind, values.name, values.message)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, type: kind, lastProject: last ?? undefined }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setValues({ name: '', email: '', message: '' })
      showToast('success', 'Message sent. I reply within 24 hours.')
      track('contact_submit', { type: kind })
    } catch {
      setStatus('failed')
      showToast('error', 'Could not send. Your message is still here.')
    }
  }

  const input =
    'mt-2 block w-full rounded-[4px] border bg-surface-2 px-4 py-3 text-text placeholder:text-muted/70 transition-colors duration-[120ms] focus:border-accent focus:outline-none'

  const field = (f: Field, label: string, props: Record<string, unknown> = {}, multiline = false) => {
    const id = `${uid}-${f}`
    const err = errors[f]
    const common = {
      id,
      name: f,
      value: values[f],
      onBlur: blur(f),
      'aria-invalid': !!err || undefined,
      'aria-describedby': err ? `${id}-err` : undefined,
      className: `${input} ${err ? 'border-danger' : 'border-line'}`,
      ...props,
    }
    return (
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {multiline ? (
          <textarea {...common} rows={5} onChange={(e) => set(f)(e.target.value)} />
        ) : (
          <input {...common} onChange={(e) => set(f)(e.target.value)} />
        )}
        {err && (
          <p id={`${id}-err`} className="mt-2 text-sm text-danger">
            {err}
          </p>
        )}
      </div>
    )
  }

  return (
    <Section
      id="contact"
      n="06"
      label="Contact"
      title="Let's build the next part."
      intro="Hiring, or need a website for your business? Send a message, or chat on WhatsApp."
    >
      <div className="mt-12 grid gap-12 lg:max-w-[58%]">
        <div>
          {status === 'sent' ? (
            <div className="card p-8" role="status">
              <Check className="text-success" width={28} height={28} />
              <p className="text-h3 mt-4">Thanks, message received.</p>
              <p className="mt-2 text-muted">I reply within 24 hours, usually sooner.</p>
              <Button variant="secondary" size="sm" className="mt-6" onClick={() => setStatus('idle')}>
                Send another
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="card grid gap-6 p-6 sm:p-8" aria-describedby={`${uid}-help`}>
              <fieldset>
                <legend className="text-sm font-medium">What is this about?</legend>
                <div className="mt-2 inline-flex rounded-full border border-line bg-surface-2 p-1">
                  {kinds.map((k) => (
                    <label
                      key={k.id}
                      className={`relative inline-flex h-10 cursor-pointer items-center rounded-full px-5 text-sm transition-colors duration-[120ms] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        kind === k.id ? 'bg-text text-bg' : 'text-muted hover:text-text'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={k.id}
                        checked={kind === k.id}
                        onChange={() => setKind(k.id)}
                        className="sr-only"
                      />
                      {k.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-6 sm:grid-cols-2">
                {field('name', 'Name', { autoComplete: 'name' })}
                {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
              </div>
              {field(
                'message',
                'Message',
                {
                  placeholder:
                    kind === 'job' ? 'Role, team and location' : kind === 'project' ? 'Your business and what you need' : '',
                },
                true,
              )}

              {/* Honeypot, hidden from people and assistive tech */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label>
                  Leave empty
                  <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" loading={status === 'sending'}>
                  {status === 'sending' ? 'Sending' : 'Send message'}
                  {status !== 'sending' && (
                    <Nudge>
                      <ArrowRight />
                    </Nudge>
                  )}
                </Button>
                <p id={`${uid}-help`} className="text-sm text-muted">
                  I reply within 24 hours.
                </p>
              </div>

              {status === 'failed' && (
                <p className="rounded-[4px] border border-danger/50 p-4 text-sm" role="alert">
                  The form service did not respond. Your text is still above.{' '}
                  <a className="underline underline-offset-4 hover:text-accent" href={mailto(kind, values.name, values.message)}>
                    Send it by email instead
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </div>

        <div>
          <h3 className="text-spec text-muted">Direct</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            <li>
              <a
                href={waEnquiry(last)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { ref: getReferrer(), project: last ?? 'none' })}
                className="card card-hover flex min-h-16 items-center gap-3 px-5 hover:text-accent"
              >
                <WhatsApp width={18} height={18} /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="card card-hover flex min-h-16 items-center gap-3 px-5 hover:text-accent">
                <Mail width={18} height={18} className="shrink-0" /> <span className="truncate">{profile.email}</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="card card-hover flex min-h-16 items-center gap-3 px-5 hover:text-accent">
                <LinkedIn width={18} height={18} /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('github_click', { from: 'contact' })}
                className="card card-hover flex min-h-16 items-center gap-3 px-5 hover:text-accent"
              >
                <GitHub width={18} height={18} /> GitHub
              </a>
            </li>
          </ul>
          <LinkButton
            variant="secondary"
            size="sm"
            className="mt-6"
            href={profile.resume}
            target="_blank"
            rel="noopener"
            onClick={() => track('resume_download', { from: 'contact' })}
          >
            Resume PDF <Download />
          </LinkButton>
        </div>
      </div>
    </Section>
  )
}
