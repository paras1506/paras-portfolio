import { Component, type ErrorInfo, type ReactNode } from 'react'
import { profile } from '../content/profile'

interface Props {
  children: ReactNode
  /** Rendered instead of the default page-level fallback (e.g. `null` for the 3D layer). */
  fallback?: ReactNode
}

export class ErrorBoundary extends Component<Props, { error: boolean }> {
  state = { error: false }

  static getDerivedStateFromError() {
    return { error: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback !== undefined) return this.props.fallback
    return (
      <div className="container-site flex min-h-[100svh] flex-col justify-center" role="alert">
        <p className="text-spec text-muted">SPEC ERR / FAULT</p>
        <h1 className="text-display-l mt-5">Something slipped out of place.</h1>
        <p className="text-body-l mt-4 text-muted">Reload the page, or reach me directly.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="button" className="underline underline-offset-4" onClick={() => window.location.reload()}>
            Reload
          </button>
          <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>
            Email me
          </a>
          <a className="underline underline-offset-4" href={profile.resume}>
            Resume PDF
          </a>
        </div>
      </div>
    )
  }
}
