import { useEffect, useRef, useState, type ComponentType } from 'react'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { track } from '../lib/analytics'
import { downgrade, pickTier } from '../lib/capability'
import { useActiveSection } from '../lib/useActiveSection'
import { useUI } from '../store/ui'
import { Poster } from './Poster'
import type { SceneProps } from './Scene'
import { SECTION_STATE } from './poses'

const DIM_SECTIONS = new Set(['journey', 'skills', 'services'])

const idle = (cb: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 800)

/**
 * Fixed layer behind the page. Always shows the poster first; on High/Mid tiers it imports the
 * three.js chunk once the browser is idle and crossfades the canvas in over 300 ms.
 */
export function SceneLayer() {
  const { pathname } = useLocation()
  const tier = useUI((s) => s.tier)
  const setTier = useUI((s) => s.setTier)
  const reduceMotion = useUI((s) => s.reduceMotion)
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null)
  const [ready, setReady] = useState(false)
  const [faint, setFaint] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)
  const dropped = useRef(false)
  const lost = useRef(0)

  const isHome = pathname === '/'
  const isProject = pathname.startsWith('/work/')
  const section = useActiveSection(isHome)

  // Choose the tier on load and whenever the motion setting changes. A tier dropped for speed never comes back.
  useEffect(() => {
    const r = pickTier(reduceMotion)
    const next = dropped.current && r.tier !== 'poster' ? useUI.getState().tier ?? r.tier : r.tier
    setTier(next)
    track('scene_tier', { tier: next, reason: r.reason })
  }, [reduceMotion, setTier])

  useEffect(() => {
    if (!tier || tier === 'poster' || Scene) return
    let cancelled = false
    idle(() => {
      import('./Scene')
        .then((m) => !cancelled && setScene(() => m.default))
        .catch(() => setTier('poster'))
    })
    return () => {
      cancelled = true
    }
  }, [tier, Scene, setTier])

  useEffect(() => {
    if (tier === 'poster') setReady(false)
  }, [tier])

  // Mobile: the bearing owns the top of the hero, then fades to 15% as the reader scrolls.
  useEffect(() => {
    const onScroll = () => setFaint(window.innerWidth < 640 && (window.scrollY > window.innerHeight * 0.35 || !isHome))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHome])

  if (!isHome && !isProject) return null

  const sectionState = SECTION_STATE[section ?? 'home'] ?? 'assembled'
  // Full-width card sections get the whole screen; the bearing steps back behind them.
  const dim = isHome && DIM_SECTIONS.has(section ?? '')
  const posterState = isProject ? 'focus' : sectionState === 'exploded' ? 'exploded' : 'assembled'
  const live = Scene && tier && tier !== 'poster'

  const drop = () => {
    dropped.current = true
    const t = downgrade(useUI.getState().tier ?? 'mid')
    setTier(t)
    track('scene_tier', { tier: t, reason: 'low-fps' })
  }
  const onContextLost = () => {
    lost.current += 1
    setReady(false)
    if (lost.current === 1) setCanvasKey((k) => k + 1)
    else {
      setTier('poster')
      track('scene_tier', { tier: 'poster', reason: 'context-lost' })
    }
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[600ms]"
      style={{ opacity: dim ? 0.07 : faint ? 0.15 : 1 }}
    >
      {/* Poster: same footprint as the live bearing (cols 7–12 on desktop, top of hero on mobile). */}
      <div
        className="absolute transition-opacity duration-300 left-[7.5%] right-[7.5%] top-[4.5rem] h-[38svh] md:left-auto md:right-[6%] md:top-[22%] md:h-[48vh] md:w-[38%] lg:right-[8%] lg:top-[18%] lg:h-[64vh] lg:w-[36%]"
        style={{ opacity: ready ? 0 : 1 }}
      >
        <Poster state={posterState} />
      </div>

      {live && (
        <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: ready ? 1 : 0 }}>
          <ErrorBoundary fallback={null}>
            <Scene
              key={canvasKey}
              tier={tier}
              mode={isProject ? 'focus' : 'scroll'}
              onReady={() => setReady(true)}
              onDrop={drop}
              onContextLost={onContextLost}
            />
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}
