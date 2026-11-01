import type { Tier } from '../store/ui'

export interface TierResult {
  tier: Tier
  reason: string
}

const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render|microsoft basic/i

/**
 * Picks the 3D tier on first load (UI Guidelines § Performance tiers).
 * Uses local heuristics only, so it makes no network request (detect-gpu fetches benchmarks from a CDN).
 */
export function pickTier(reduceMotion: boolean): TierResult {
  if (reduceMotion) return { tier: 'poster', reason: 'reduced-motion' }

  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData) return { tier: 'poster', reason: 'save-data' }

  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let webgl2 = false
  try {
    const c = document.createElement('canvas')
    gl = c.getContext('webgl2')
    webgl2 = !!gl
    if (!gl) gl = c.getContext('webgl')
  } catch {
    gl = null
  }
  if (!gl) return { tier: 'poster', reason: 'no-webgl' }

  let renderer = ''
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
  } catch {
    /* ignore */
  }
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  if (SOFTWARE_GPU.test(renderer)) return { tier: 'poster', reason: 'software-gpu' }

  const touch = matchMedia('(pointer: coarse)').matches
  const cores = nav.hardwareConcurrency ?? 4
  const mem = nav.deviceMemory ?? 8

  if (webgl2 && !touch && cores >= 4 && mem >= 4) return { tier: 'high', reason: 'capable' }
  if (webgl2 && touch && cores >= 8 && mem >= 6) return { tier: 'high', reason: 'high-end-mobile' }
  return { tier: 'mid', reason: webgl2 ? 'modest-device' : 'webgl1' }
}

export const downgrade = (t: Tier): Tier => (t === 'high' ? 'mid' : 'poster')
