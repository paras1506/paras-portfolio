import { SpecLabel } from '../components/Bits'
import { RouteButton } from '../components/Button'
import { ArrowRight } from '../components/Icons'
import { useMeta } from '../lib/useMeta'

export default function NotFound() {
  useMeta('Part not found · Paras Wane', 'This page does not exist.')
  return (
    <section className="container-site flex min-h-[100svh] flex-col justify-center pt-16" aria-labelledby="nf-title">
      <SpecLabel n="404" label="Not found" />
      <h1 id="nf-title" className="text-display-l mt-5">
        This part isn't in stock.
      </h1>
      <p className="text-body-l mt-4 text-muted">The page you asked for doesn't exist or has moved.</p>

      {/* A single ball rolling to a stop */}
      <div aria-hidden className="relative mt-12 h-10 max-w-md border-b border-line">
        <span className="nf-ball absolute bottom-0 left-0 size-8 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,var(--ball)_35%,var(--steel)_70%,#555)]" />
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <RouteButton to="/#work">
          See the work <ArrowRight />
        </RouteButton>
        <RouteButton to="/" variant="secondary">
          Home
        </RouteButton>
      </div>
    </section>
  )
}
