import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../content/profile'
import { track } from '../lib/analytics'
import { useActiveSection } from '../lib/useActiveSection'
import { buttonClass } from './Button'
import { Close, Download, Menu } from './Icons'
import { MotionToggle, ThemeToggle } from './Toggles'

export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
]

/** Thin accent bar under the nav showing how much of the page has been read. */
function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])
  return (
    <span aria-hidden className="absolute inset-x-0 -bottom-px h-0.5">
      <span ref={bar} className="block h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </span>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const active = useActiveSection(pathname === '/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const resume = (
    <a
      href={profile.resume}
      target="_blank"
      rel="noopener"
      onClick={() => track('resume_download', { from: 'nav' })}
      className={buttonClass('secondary', 'sm', 'h-10!')}
    >
      Resume <Download />
    </a>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-[240ms] ${
        scrolled || open ? 'border-b border-line bg-surface/90 backdrop-blur-sm' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="container-site flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-mono text-sm font-medium tracking-[0.12em]" aria-label="Paras Wane, home">
          PW-01
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <Link
                to={`/#${l.id}`}
                aria-current={active === l.id ? 'location' : undefined}
                className={`relative inline-flex h-11 items-center px-3 text-[15px] transition-colors duration-[120ms] hover:text-text ${
                  active === l.id ? 'text-text' : 'text-muted'
                }`}
              >
                {l.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-2 h-0.5 origin-left bg-accent transition-transform duration-[240ms] ease-out ${
                    active === l.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex">
            <MotionToggle />
          </div>
          <ThemeToggle />
          <div className="ml-2 hidden sm:block">{resume}</div>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close width={20} height={20} /> : <Menu width={20} height={20} />}
          </button>
        </div>
      </nav>

      <ScrollProgress />

      {open && (
        <div id="mobile-nav" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg md:hidden">
          <ul className="container-site flex flex-col py-6">
            {navLinks.map((l, i) => (
              <li key={l.id} className="border-b border-line">
                <Link
                  to={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 text-h3"
                >
                  <span className="text-spec text-muted">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-site flex items-center gap-3">
            {resume}
            <MotionToggle />
          </div>
        </div>
      )}
    </header>
  )
}
