import type { BearingState } from '../store/ui'

/** Target transforms for each bearing state (UI Guidelines § State transforms). */
export interface Pose {
  rotX: number
  rotY: number
  /** Extra horizontal offset, in units of the visible width. */
  shiftX: number
  outerZ: number
  innerZ: number
  ballR: number
  camY: number
  camZ: number
  fov: number
  /** Idle spin speed, rad/s. */
  spin: number
  /** Cage accent glow, 0..1. */
  cageGlow: number
  /** 0 = normal; 1 = selected ball pulled to centre and the rest faded. */
  focus: number
}

export const POSES: Record<BearingState, Pose> = {
  assembled: { rotX: 0.35, rotY: 0, shiftX: 0, outerZ: 0, innerZ: 0, ballR: 1.1, camY: 0, camZ: 6, fov: 35, spin: 0.15, cageGlow: 0, focus: 0 },
  tilted: { rotX: 0.35, rotY: 0.6, shiftX: 0.04, outerZ: 0, innerZ: 0, ballR: 1.1, camY: 0.4, camZ: 6, fov: 35, spin: 0.15, cageGlow: 0, focus: 0 },
  exploded: { rotX: 0.9, rotY: 0, shiftX: -0.03, outerZ: -1.2, innerZ: 1.2, ballR: 2.05, camY: 0, camZ: 7.5, fov: 35, spin: 0, cageGlow: 0, focus: 0 },
  focus: { rotX: 0.35, rotY: 0.3, shiftX: 0, outerZ: 0, innerZ: 0, ballR: 1.1, camY: 0, camZ: 4.5, fov: 28, spin: 0.05, cageGlow: 0, focus: 1 },
  settled: { rotX: 0.35, rotY: 0, shiftX: 0, outerZ: 0, innerZ: 0, ballR: 1.1, camY: 0, camZ: 6, fov: 35, spin: 0, cageGlow: 1, focus: 0 },
}

/** Which bearing state each home section shows. */
export const SECTION_STATE: Record<string, BearingState> = {
  home: 'assembled',
  about: 'tilted',
  work: 'exploded',
  journey: 'tilted',
  skills: 'tilted',
  services: 'tilted',
  contact: 'settled',
}

const KEYS = Object.keys(POSES.assembled) as (keyof Pose)[]

export function lerpPose(a: Pose, b: Pose, t: number, out: Pose): Pose {
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * t
  return out
}

/** Smoothstep-ish easing matching `ease-seat` closely enough for scrubbing. */
export const easeSeat = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Scroll-scrubbed target: blends between the states of neighbouring sections as their boundary
 * crosses the middle of the viewport. Pure function of scroll position, so scrolling back reverses exactly.
 */
export function scrollTarget(out: Pose): Pose {
  const sections = document.querySelectorAll<HTMLElement>('[data-section]')
  const mid = window.innerHeight / 2
  const band = window.innerHeight * 0.35

  let current: BearingState = 'assembled'
  let next: BearingState | null = null
  let t = 0

  for (let i = 0; i < sections.length; i++) {
    const r = sections[i].getBoundingClientRect()
    if (r.top <= mid && r.bottom > mid) {
      current = SECTION_STATE[sections[i].dataset.section!] ?? 'tilted'
      const nextEl = sections[i + 1]
      const toEnd = r.bottom - mid
      if (nextEl && toEnd < band) {
        next = SECTION_STATE[nextEl.dataset.section!] ?? 'tilted'
        t = 1 - toEnd / band
      }
      break
    }
  }

  if (!next || next === current) return Object.assign(out, POSES[current])
  return lerpPose(POSES[current], POSES[next], easeSeat(t), out)
}

export const clonePose = (p: Pose): Pose => ({ ...p })
