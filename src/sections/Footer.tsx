import { profile } from '../content/profile'
import { track } from '../lib/analytics'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="container-site grid gap-8 py-12 md:grid-cols-2">
        <div>
          <p className="font-mono text-sm tracking-[0.12em]">PW-01</p>
          <p className="mt-2 text-sm text-muted">
            © {new Date().getFullYear()} {profile.name} · {profile.company}, {profile.companyLine}
          </p>
        </div>

        <details className="group rounded-xl border border-line bg-surface p-5 md:justify-self-end md:max-w-md">
          <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
            How this site is built
            <span aria-hidden className="font-mono text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              Vite, React and TypeScript, with Tailwind tokens shared by the HTML and the 3D materials. The bearing is built in code
              with three.js (lathe geometry, instanced balls), so there is no model file to download.
            </p>
            <p>
              Each device gets a tier: High (full scene), Mid (no post-processing) or Poster (a still image). The tier drops if the frame
              rate stays under 24 fps. All content is plain HTML, so the page works before the 3D loads, or without it.
            </p>
            <p>
              <a
                href={profile.siteRepo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('github_click', { from: 'footer' })}
                className="text-text underline underline-offset-4 hover:text-accent"
              >
                Read the source on GitHub
              </a>
            </p>
          </div>
        </details>
      </div>
    </footer>
  )
}
