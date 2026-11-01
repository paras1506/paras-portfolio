import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { Tier } from '../store/ui'
import { Bearing } from './Bearing'
import { useSceneColors } from './useSceneColors'

const TOUCH = matchMedia('(pointer: coarse)').matches

/** Reflections only: a procedural studio room baked once into a PMREM map, so no HDR download. */
function StudioEnvironment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pmrem.fromScene(room, 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.9
    return () => {
      scene.environment = null
      env.dispose()
      room.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

function Lights() {
  const { accent } = useSceneColors()
  return (
    <>
      {/* Key light from top-left */}
      <directionalLight position={[-4, 5, 5]} intensity={2.2} />
      {/* Accent rim from behind-right */}
      <pointLight position={[3.5, 1.5, -3]} intensity={6} distance={12} color={accent} />
      <StudioEnvironment />
    </>
  )
}

/** Drops one tier when the frame rate stays under 24 fps for 2 s (never rises again). */
function FpsGuard({ onDrop }: { onDrop: () => void }) {
  const acc = useRef({ t: 0, frames: 0, slow: 0, warm: 0, done: false })
  useFrame((_, dt) => {
    const a = acc.current
    if (a.done) return
    a.warm += dt
    if (a.warm < 2 || document.visibilityState !== 'visible') return
    a.t += dt
    a.frames++
    if (a.t >= 0.5) {
      const fps = a.frames / a.t
      a.slow = fps < 24 ? a.slow + a.t : 0
      a.t = 0
      a.frames = 0
      if (a.slow >= 2) {
        a.done = true
        onDrop()
      }
    }
  })
  return null
}

export interface SceneProps {
  tier: Exclude<Tier, 'poster'>
  mode: 'scroll' | 'focus'
  onReady: () => void
  onDrop: () => void
  onContextLost: () => void
}

export default function Scene({ tier, mode, onReady, onDrop, onContextLost }: SceneProps) {
  return (
    <Canvas
      aria-hidden
      // Events come from the page root so balls stay hoverable under the HTML layer.
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      dpr={tier === 'high' ? [1, TOUCH ? 1.25 : 1.5] : 1}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 50 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost()
        })
        requestAnimationFrame(() => requestAnimationFrame(onReady))
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Lights />
      <Bearing tier={tier} mode={mode} />
      <FpsGuard onDrop={onDrop} />
    </Canvas>
  )
}
