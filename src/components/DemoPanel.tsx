import { useEffect, useState } from 'react'
import type { Project } from '../content/projects'
import { track } from '../lib/analytics'
import { onLiveClick } from '../lib/live'
import { LinkButton } from './Button'
import { ArrowUpRight, Check, Copy } from './Icons'

// Dummy demo logins supplied by Paras. Never put a real client's login here.
const MEMBER = { phone: '9876500001', pin: '2580' }
const STAFF = { id: 'S001', password: 'owner1234', path: '/admin' }

type Role = 'member' | 'staff'

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between gap-4 rounded-[4px] bg-surface-2 px-4 py-2">
      <div>
        <p className="text-spec text-muted">{label}</p>
        <p className="font-mono tabular">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          } catch {
            /* clipboard blocked; the value is visible to copy by hand */
          }
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm hover:text-accent"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="text-success" /> : <Copy />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

export function DemoPanel({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<Role>('member')
  const [opened, setOpened] = useState(false)
  const [returned, setReturned] = useState(false)
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)

  // After the visitor comes back from the demo tab, ask whether it loaded.
  useEffect(() => {
    if (!opened) return
    const onVis = () => document.visibilityState === 'visible' && setReturned(true)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [opened])

  if (!project.live) return null

  return (
    <section aria-labelledby="demo-title" className="rounded-xl border border-line bg-surface">
      <h2 id="demo-title">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="demo-body"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 p-6 text-left"
        >
          <span>
            <span className="text-spec block text-muted">Guided demo</span>
            <span className="text-h3 mt-1 block">Try the demo</span>
          </span>
          <span aria-hidden className={`font-mono text-2xl text-muted transition-transform ${open ? 'rotate-45' : ''}`}>
            +
          </span>
        </button>
      </h2>

      {open && (
        <div id="demo-body" className="border-t border-line p-6">
          <div role="tablist" aria-label="Demo role" className="inline-flex rounded-full border border-line bg-surface-2 p-1">
            {(['member', 'staff'] as Role[]).map((r) => (
              <button
                key={r}
                role="tab"
                type="button"
                id={`tab-${r}`}
                aria-selected={role === r}
                aria-controls={`panel-${r}`}
                onClick={() => setRole(r)}
                className={`h-10 rounded-full px-5 text-sm capitalize ${role === r ? 'bg-text text-bg' : 'text-muted hover:text-text'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {role === 'member' ? (
            <div role="tabpanel" id="panel-member" aria-labelledby="tab-member" className="mt-6 grid gap-6 md:grid-cols-2">
              <ol className="list-inside list-decimal space-y-2 text-[15px]">
                <li>Open the site and choose Member login.</li>
                <li>Paste the demo phone number and PIN.</li>
                <li>See the plan, expiry date and attendance.</li>
              </ol>
              <div className="grid gap-2">
                <CopyRow label="Demo phone" value={MEMBER.phone} />
                <CopyRow label="Demo PIN" value={MEMBER.pin} />
                <LinkButton
                  className="mt-2"
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onLiveClick(project.slug)
                    track('demo_open', { role: 'member' })
                    setOpened(true)
                  }}
                >
                  Open member demo <ArrowUpRight />
                </LinkButton>
              </div>
            </div>
          ) : (
            <div role="tabpanel" id="panel-staff" aria-labelledby="tab-staff" className="mt-6 grid gap-6 md:grid-cols-2">
              <ol className="list-inside list-decimal space-y-2 text-[15px]">
                <li>Open the admin page.</li>
                <li>Sign in with the demo owner ID and password.</li>
                <li>Browse members, renewals and attendance as the owner sees them.</li>
              </ol>
              <div className="grid gap-2">
                <CopyRow label="Owner ID" value={STAFF.id} />
                <CopyRow label="Password" value={STAFF.password} />
                <LinkButton
                  className="mt-2"
                  href={new URL(STAFF.path, project.live).href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onLiveClick(project.slug)
                    track('demo_open', { role: 'staff' })
                    setOpened(true)
                  }}
                >
                  Open admin demo <ArrowUpRight />
                </LinkButton>
              </div>
            </div>
          )}

          {returned && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm" aria-live="polite">
              {answer === null ? (
                <>
                  <span>Did the demo load?</span>
                  <button type="button" className="min-h-11 rounded-full border border-line px-4 hover:bg-surface-2" onClick={() => setAnswer('yes')}>
                    Yes
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-full border border-line px-4 hover:bg-surface-2"
                    onClick={() => {
                      setAnswer('no')
                      track('demo_failed', { role })
                    }}
                  >
                    No
                  </button>
                </>
              ) : answer === 'yes' ? (
                <span className="text-muted">Great. Thanks for trying it.</span>
              ) : (
                <span className="text-muted">
                  Sorry about that. {project.video ? 'Here is a recording instead.' : 'The demo may be waking up; try again in a minute.'}
                </span>
              )}
            </div>
          )}
          {answer === 'no' && project.video && (
            <video className="mt-4 w-full rounded-xl border border-line" src={project.video} controls muted playsInline autoPlay />
          )}
        </div>
      )}
    </section>
  )
}
