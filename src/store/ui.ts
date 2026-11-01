import { create } from 'zustand'
import { readPref, writePref } from '../lib/storage'

export type Theme = 'dark' | 'light'
export type BearingState = 'assembled' | 'tilted' | 'exploded' | 'focus' | 'settled'
export type Tier = 'high' | 'mid' | 'poster'

export interface ToastMsg {
  id: number
  kind: 'success' | 'error'
  text: string
}

interface UIState {
  theme: Theme
  setTheme: (t: Theme) => void

  /** Site motion toggle (in addition to prefers-reduced-motion). */
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void

  /** Slug of the project whose card / ball is highlighted. Shared by cards and the 3D scene. */
  activeProject: string | null
  setActiveProject: (slug: string | null) => void

  /** Project currently shown by the scroll-driven Work showcase; its ball glows when nothing is hovered. */
  showcaseProject: string | null
  setShowcaseProject: (slug: string | null) => void

  /** Last project the visitor opened or viewed live; used to prefill WhatsApp text. */
  lastProject: string | null
  setLastProject: (slug: string) => void

  /** Set when the visitor opens a live client site in a new tab; drives the return bar. */
  liveVisit: string | null
  setLiveVisit: (slug: string | null) => void

  bearingState: BearingState
  setBearingState: (s: BearingState) => void

  tier: Tier | null
  setTier: (t: Tier) => void

  toast: ToastMsg | null
  showToast: (kind: ToastMsg['kind'], text: string) => void
  clearToast: () => void
}

const systemReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const initialTheme = (): Theme => {
  const t = readPref('pw-theme')
  return t === 'light' ? 'light' : 'dark'
}

const initialMotion = () => {
  const m = readPref('pw-reduce-motion')
  return m === null ? systemReduced() : m === '1'
}

export const useUI = create<UIState>((set) => ({
  theme: initialTheme(),
  setTheme: (theme) => {
    writePref('pw-theme', theme)
    set({ theme })
  },

  reduceMotion: initialMotion(),
  setReduceMotion: (reduceMotion) => {
    writePref('pw-reduce-motion', reduceMotion ? '1' : '0')
    set({ reduceMotion })
  },

  activeProject: null,
  setActiveProject: (activeProject) => set({ activeProject }),

  showcaseProject: null,
  setShowcaseProject: (showcaseProject) => set({ showcaseProject }),

  lastProject: null,
  setLastProject: (lastProject) => set({ lastProject }),

  liveVisit: null,
  setLiveVisit: (liveVisit) => set({ liveVisit }),

  bearingState: 'assembled',
  setBearingState: (bearingState) => set({ bearingState }),

  tier: null,
  setTier: (tier) => set({ tier }),

  toast: null,
  showToast: (kind, text) => set({ toast: { id: Date.now(), kind, text } }),
  clearToast: () => set({ toast: null }),
}))
