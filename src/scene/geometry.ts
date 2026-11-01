import * as THREE from 'three'

export const PITCH_R = 1.1
export const BALL_R = 0.16
const GROOVE_R = 0.165

/**
 * Race ring built with LatheGeometry from a 2D cross-section (r, axial) with a ball groove,
 * then rotated so the bearing axis is +Z.
 */
export function latheRing(innerR: number, outerR: number, width: number, kind: 'outer' | 'inner', segments: number) {
  const w = width / 2
  const c = 0.02 // edge chamfer
  const pts: THREE.Vector2[] = []
  // Groove arc where the race face meets the ball path.
  const faceR = kind === 'outer' ? innerR : outerR
  const theta0 = Math.asin(Math.min(1, Math.sqrt(Math.max(0, GROOVE_R ** 2 - (faceR - PITCH_R) ** 2)) / GROOVE_R))
  const arc = (from: number, to: number) => {
    const n = 16
    for (let i = 0; i <= n; i++) {
      const a = from + ((to - from) * i) / n
      pts.push(new THREE.Vector2(PITCH_R + GROOVE_R * Math.cos(a), GROOVE_R * Math.sin(a)))
    }
  }

  if (kind === 'outer') {
    pts.push(new THREE.Vector2(innerR + c, -w))
    pts.push(new THREE.Vector2(outerR - c, -w))
    pts.push(new THREE.Vector2(outerR, -w + c))
    pts.push(new THREE.Vector2(outerR, w - c))
    pts.push(new THREE.Vector2(outerR - c, w))
    pts.push(new THREE.Vector2(innerR + c, w))
    pts.push(new THREE.Vector2(innerR, w - c))
    arc(theta0, -theta0)
    pts.push(new THREE.Vector2(innerR, -w + c))
    pts.push(new THREE.Vector2(innerR + c, -w))
  } else {
    pts.push(new THREE.Vector2(outerR - c, -w))
    pts.push(new THREE.Vector2(outerR, -w + c))
    arc(Math.PI + theta0, Math.PI - theta0)
    pts.push(new THREE.Vector2(outerR, w - c))
    pts.push(new THREE.Vector2(outerR - c, w))
    pts.push(new THREE.Vector2(innerR + c, w))
    pts.push(new THREE.Vector2(innerR, w - c))
    pts.push(new THREE.Vector2(innerR, -w + c))
    pts.push(new THREE.Vector2(innerR + c, -w))
    pts.push(new THREE.Vector2(outerR - c, -w))
  }

  const g = new THREE.LatheGeometry(pts, segments)
  g.rotateX(Math.PI / 2)
  g.computeVertexNormals()
  return g
}

/** Mono text around a ring: the decorative "6204-PW · TOL ±0.01" spec ring. */
export function specRingTexture(text: string) {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.translate(size / 2, size / 2)
  ctx.strokeStyle = '#ffffff'
  ctx.fillStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, size * 0.47, 0, Math.PI * 2)
  ctx.stroke()
  // Tick marks every 5°
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const r0 = size * (i % 6 === 0 ? 0.445 : 0.455)
    ctx.beginPath()
    ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0)
    ctx.lineTo(Math.cos(a) * size * 0.47, Math.sin(a) * size * 0.47)
    ctx.stroke()
  }
  ctx.font = '500 26px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const full = `${text} · ${text} · `
  const step = (Math.PI * 2) / full.length
  for (let i = 0; i < full.length; i++) {
    ctx.save()
    ctx.rotate(i * step)
    ctx.translate(0, -size * 0.41)
    ctx.fillText(full[i], 0, 0)
    ctx.restore()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/**
 * Roughness map of lathe turn lines. LatheGeometry UVs run u = around the ring, v = along the
 * profile, so turn lines are stripes that vary along v only (concentric circles would smear).
 */
export function latheTurnTexture() {
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  for (let y = 0; y < h; y++) {
    const lum = Math.round(64 + Math.sin(y * 0.9) * 8 + (Math.random() - 0.5) * 22) // ≈ roughness 0.2–0.32
    ctx.fillStyle = `rgb(${lum},${lum},${lum})`
    ctx.fillRect(0, y, 4, 1)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}
