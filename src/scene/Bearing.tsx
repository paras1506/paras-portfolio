import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { projects } from '../content/projects'
import { track } from '../lib/analytics'
import { useUI, type Tier } from '../store/ui'
import { BALL_R, PITCH_R, latheRing, latheTurnTexture, specRingTexture } from './geometry'
import { POSES, clonePose, scrollTarget, type Pose } from './poses'
import { useSceneColors } from './useSceneColors'

const { damp, lerp } = THREE.MathUtils
const TOUCH = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches
const isInteractive = (el: EventTarget | null) =>
  el instanceof Element && !!el.closest('a, button, input, textarea, select, label, summary, [role="tab"]')

function setFading(m: THREE.Material, fading: boolean) {
  if (m.transparent === fading) return
  m.transparent = fading
  m.depthWrite = !fading
  m.needsUpdate = true
}

/** Where the bearing sits and how big it is, per breakpoint (UI Guidelines § Layout). */
function layout(vw: number, visW: number, visH: number) {
  if (vw >= 1024) return { x: visW * 0.25, y: 0, avail: Math.min(visW * 0.4, visH * 0.8) }
  if (vw >= 640) return { x: visW * 0.25, y: 0, avail: Math.min(visW * 0.45, visH * 0.7) * 0.7 }
  return { x: 0, y: visH * 0.24, avail: Math.min(visW * 0.85, visH * 0.4) }
}

export function Bearing({ tier, mode }: { tier: Tier; mode: 'scroll' | 'focus' }) {
  const navigate = useNavigate()
  const { camera, size } = useThree()
  const colors = useSceneColors()
  const segments = tier === 'high' ? 96 : 48

  const root = useRef<THREE.Group>(null!)
  const spinner = useRef<THREE.Group>(null!)
  const outer = useRef<THREE.Mesh>(null!)
  const inner = useRef<THREE.Mesh>(null!)
  const balls = useRef<(THREE.Mesh | null)[]>([])
  const ring = useRef<THREE.Mesh>(null!)

  const pose = useRef<Pose>(clonePose(POSES.assembled))
  const target = useRef<Pose>(clonePose(POSES.assembled))
  const pointer = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const drag = useRef({ active: false, startX: 0, rot: 0, base: 0 })
  const ballFocus = useRef<number[]>(projects.map(() => 0))
  const ballGlow = useRef<number[]>(projects.map(() => 0))

  const geo = useMemo(
    () => ({
      outer: latheRing(1.25, 1.6, 0.55, 'outer', segments),
      inner: latheRing(0.6, 0.95, 0.55, 'inner', segments),
      ball: new THREE.SphereGeometry(BALL_R, tier === 'high' ? 48 : 32, tier === 'high' ? 32 : 20),
      cage: new THREE.TorusGeometry(PITCH_R, 0.028, 16, segments),
      bridge: new THREE.BoxGeometry(0.055, 0.022, 0.24),
      rivet: new THREE.CylinderGeometry(0.016, 0.016, 0.265, 12),
      ring: new THREE.PlaneGeometry(4, 4),
    }),
    [segments, tier],
  )
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo])

  const mat = useMemo(() => {
    const turnLines = latheTurnTexture()
    const steel = new THREE.MeshPhysicalMaterial({
      metalness: 1,
      roughness: 1, // scaled by the turn-line map (≈ 0.2–0.32)
      roughnessMap: turnLines,
      clearcoat: 0.25,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.4,
      side: THREE.DoubleSide,
    })
    const cage = new THREE.MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.36, envMapIntensity: 1.2 })
    const balls = projects.map(
      () => new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.8 }),
    )
    const ring = new THREE.MeshBasicMaterial({ map: specRingTexture('6204-PW · TOL ±0.01'), transparent: true, opacity: 0.25, depthWrite: false })
    return { steel, cage, balls, ring, turnLines }
  }, [])
  useEffect(
    () => () => {
      mat.steel.dispose()
      mat.cage.dispose()
      mat.balls.forEach((m) => m.dispose())
      mat.ring.map?.dispose()
      mat.ring.dispose()
      mat.turnLines.dispose()
    },
    [mat],
  )

  // Materials re-read the CSS tokens when the theme changes.
  useEffect(() => {
    mat.steel.color.set(colors.steel)
    mat.cage.color.set(colors.cage)
    mat.cage.emissive.set(colors.accent)
    mat.balls.forEach((m) => {
      m.color.set(colors.ball)
      m.emissive.set(colors.accent)
    })
    mat.ring.color.set(colors.text)
  }, [colors, mat])

  // Cursor parallax input (off on touch). The canvas sits behind the page, so listen on window.
  useEffect(() => {
    if (TOUCH) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      if (drag.current.active) drag.current.rot = drag.current.base + (e.clientX - drag.current.startX) * 0.01
    }
    const onUp = () => {
      if (!drag.current.active) return
      drag.current.active = false
      document.body.style.userSelect = ''
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const state = useUI.getState()
    const active = state.activeProject ?? state.showcaseProject
    const activeIdx = projects.findIndex((p) => p.slug === active)

    // 1. Target pose: scroll-scrubbed on home, focus on a project page.
    if (mode === 'focus') Object.assign(target.current, POSES.focus)
    else scrollTarget(target.current)

    // 2. Damp the current pose toward the target (≈ scrub: 0.6).
    const p = pose.current
    for (const k of Object.keys(p) as (keyof Pose)[]) p[k] = damp(p[k], target.current[k], 5, dt)

    // 3. Camera.
    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(0, p.camY, p.camZ)
    if (Math.abs(cam.fov - p.fov) > 0.01) {
      cam.fov = p.fov
      cam.updateProjectionMatrix()
    }
    cam.lookAt(0, p.camY * 0.5, 0)

    // 4. Placement and size per breakpoint, measured at the current camera distance.
    const visH = 2 * p.camZ * Math.tan(THREE.MathUtils.degToRad(p.fov / 2))
    const visW = visH * (size.width / size.height)
    const lay = layout(size.width, visW, visH)
    // Size is fitted at the reference camera, so pulling the camera back (Exploded) really zooms out.
    const refH = 2 * 6 * Math.tan(THREE.MathUtils.degToRad(35 / 2))
    const fit = Math.min(1, layout(size.width, refH * (size.width / size.height), refH).avail / 3.6)
    root.current.position.set(lay.x + p.shiftX * visW, lay.y, 0)
    root.current.scale.setScalar(fit)

    // 5. Rotation: pose + damped cursor parallax (±0.15 rad) + drag-to-spin that snaps back.
    const ptr = pointer.current
    const parallaxOn = !TOUCH && p.focus < 0.5
    ptr.px = lerp(ptr.px, parallaxOn ? ptr.x * 0.15 : 0, 0.08)
    ptr.py = lerp(ptr.py, parallaxOn ? ptr.y * 0.15 : 0, 0.08)
    if (!drag.current.active) drag.current.rot = damp(drag.current.rot, 0, 4, dt)
    root.current.rotation.set(p.rotX + ptr.py, p.rotY + ptr.px + drag.current.rot, 0)
    spinner.current.rotation.z += p.spin * dt
    // While exploded, turn the bearing so the active project's ball rolls round to the clear right-hand side.
    const explodeW = THREE.MathUtils.clamp((p.ballR - 1.1) / 0.95, 0, 1)
    if (activeIdx >= 0 && explodeW > 0.3 && mode === 'scroll') {
      const cur = spinner.current.rotation.z
      const want = -(activeIdx / projects.length) * Math.PI * 2
      const delta = Math.atan2(Math.sin(want - cur), Math.cos(want - cur))
      spinner.current.rotation.z = cur + delta * (1 - Math.exp(-4 * explodeW * dt))
    }

    // 6. Parts: races slide apart along the axis; balls move out to the exploded radius.
    outer.current.position.z = p.outerZ
    inner.current.position.z = p.innerZ
    const fadeOthers = lerp(1, 0, p.focus)
    // Opaque unless actually fading (project page): transparent metal sorts badly and dulls reflections.
    setFading(mat.steel, fadeOthers < 0.99)
    setFading(mat.cage, fadeOthers < 0.99)
    mat.steel.opacity = fadeOthers
    mat.cage.opacity = fadeOthers
    mat.cage.emissiveIntensity = p.cageGlow * 0.35
    mat.ring.opacity = 0.25 * (1 - p.focus) * (1 - Math.min(1, Math.abs(p.outerZ)))

    balls.current.forEach((m, i) => {
      if (!m) return
      const isActive = i === activeIdx
      ballFocus.current[i] = damp(ballFocus.current[i], isActive ? p.focus : 0, 6, dt)
      ballGlow.current[i] = damp(ballGlow.current[i], isActive ? 1 : 0, 10, dt)
      const f = ballFocus.current[i]
      const a = (i / projects.length) * Math.PI * 2
      // A focused ball is pulled to the centre of the spinner, so undo the spin for it.
      const cx = Math.cos(a) * p.ballR
      const cy = Math.sin(a) * p.ballR
      m.position.set(lerp(cx, 0, f), lerp(cy, 0, f), lerp(0, 0.6, f))
      m.scale.setScalar(1 + f * 2)
      const bm = mat.balls[i]
      bm.emissiveIntensity = ballGlow.current[i] * 0.6
      setFading(bm, !isActive && fadeOthers < 0.99)
      bm.opacity = isActive ? 1 : fadeOthers
    })
  })

  const exploded = () => {
    const p = pose.current
    return p.ballR > 1.9 && p.focus < 0.1
  }

  const onBallOver = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    if (TOUCH || !exploded() || isInteractive(e.nativeEvent.target)) return
    e.stopPropagation()
    useUI.getState().setActiveProject(projects[i].slug)
    document.body.style.cursor = 'pointer'
  }
  const onBallOut = () => {
    document.body.style.cursor = ''
    if (exploded()) useUI.getState().setActiveProject(null)
  }
  const onBallClick = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    if (TOUCH || !exploded() || isInteractive(e.nativeEvent.target)) return
    e.stopPropagation()
    document.body.style.cursor = ''
    track('project_open', { slug: projects[i].slug, from: 'ball' })
    navigate(`/work/${projects[i].slug}`)
  }
  const onRaceDown = (e: ThreeEvent<PointerEvent>) => {
    // Drag-to-spin only in the Assembled state, on desktop, when not starting on page content.
    const p = pose.current
    if (TOUCH || p.spin < 0.1 || p.rotY > 0.2 || mode !== 'scroll' || isInteractive(e.nativeEvent.target)) return
    if ((e.nativeEvent.target as Element)?.closest?.('p, h1, h2, h3, li')) return
    drag.current = { active: true, startX: e.nativeEvent.clientX, rot: drag.current.rot, base: drag.current.rot }
    document.body.style.userSelect = 'none'
  }

  return (
    <group ref={root}>
      <mesh ref={ring} geometry={geo.ring} material={mat.ring} position-z={-0.3} />
      <group ref={spinner}>
        <mesh ref={outer} geometry={geo.outer} material={mat.steel} onPointerDown={onRaceDown} />
        <mesh ref={inner} geometry={geo.inner} material={mat.steel} onPointerDown={onRaceDown} />
        <mesh geometry={geo.cage} material={mat.cage} position-z={0.12} scale-z={0.55} />
        <mesh geometry={geo.cage} material={mat.cage} position-z={-0.12} scale-z={0.55} />
        {projects.map((_, i) => {
          const a = ((i + 0.5) / projects.length) * Math.PI * 2
          return (
            <group key={`bridge-${i}`} position={[Math.cos(a) * PITCH_R, Math.sin(a) * PITCH_R, 0]} rotation-z={a}>
              <mesh geometry={geo.bridge} material={mat.cage} />
              <mesh geometry={geo.rivet} material={mat.steel} rotation-x={Math.PI / 2} />
            </group>
          )
        })}
        {projects.map((p, i) => (
          <mesh
            key={p.slug}
            ref={(m) => {
              balls.current[i] = m
            }}
            geometry={geo.ball}
            material={mat.balls[i]}
            onPointerOver={onBallOver(i)}
            onPointerOut={onBallOut}
            onClick={onBallClick(i)}
          />
        ))}
      </group>
    </group>
  )
}
