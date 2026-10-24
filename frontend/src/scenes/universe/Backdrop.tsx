'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Points, Vector3 } from 'three'

import { ORBIT_RADII } from './registry'
import { glowTexture } from './textures'

/** 光：冷色環境光 + 暖色主光（行星上的金色晨昏線）+ 藍色輪廓光 */
export function SceneLighting() {
  return (
    <>
      <hemisphereLight args={[0x9db8ff, 0x0b1338, 0.9]} />
      <directionalLight color={0xffe2c0} intensity={2.4} position={[10, 8, 6]} />
      <directionalLight color={0x6ea2ff} intensity={1.2} position={[-10, 2, -8]} />
    </>
  )
}

export function Starfield({ spin }: { spin: number }) {
  const ref = useRef<Points>(null)
  const geometry = useMemo(() => {
    const positions: number[] = []
    for (let i = 0; i < 1400; i++) {
      const v = new Vector3().randomDirection().multiplyScalar(90 + Math.random() * 90)
      positions.push(v.x, v.y, v.z)
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(positions, 3))
    return g
  }, [])
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004 * spin
  })
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={0xcfdcff}
        size={0.55}
        transparent
        opacity={0.85}
        map={glowTexture()}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

/** 衛星公轉軌道（兩圈淡線） */
export function OrbitPaths() {
  return (
    <>
      {ORBIT_RADII.map((radius, i) => (
        <OrbitLine key={radius} radius={radius} opacity={i ? 0.14 : 0.2} />
      ))}
    </>
  )
}

export function OrbitLine({ radius, opacity }: { radius: number; opacity: number }) {
  const geometry = useMemo(() => {
    const points = Array.from({ length: 241 }, (_, i) => {
      const a = (i / 240) * Math.PI * 2
      return new Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
    })
    return new BufferGeometry().setFromPoints(points)
  }, [radius])
  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color={0xbcd0ff} transparent opacity={opacity} />
    </lineLoop>
  )
}

/** ME Planet 外圈的金色軌道 + 流動光點 */
export function GoldRing({ spin }: { spin: number }) {
  const sparks = useRef<Group>(null)
  const angles = useRef(Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2))
  useFrame((_, dt) => {
    sparks.current?.children.forEach((spark, i) => {
      const a = (angles.current[i] += dt * 0.15 * spin)
      spark.position.set(Math.cos(a) * 3.6, Math.sin(a) * 0.29, Math.sin(a) * 3.6)
    })
  })
  return (
    <>
      <mesh rotation={[Math.PI / 2 - 0.08, 0, 0]}>
        <torusGeometry args={[3.6, 0.012, 6, 220]} />
        <meshBasicMaterial color={0xffc98f} transparent opacity={0.75} />
      </mesh>
      <group ref={sparks}>
        {angles.current.map((_, i) => (
          <Glow key={i} color={0xffd29a} scale={0.45} opacity={0.9} />
        ))}
      </group>
    </>
  )
}

export function Glow({ color, scale, opacity }: { color: number | string; scale: number; opacity: number }) {
  return (
    <sprite scale={scale}>
      <spriteMaterial
        map={glowTexture()}
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  )
}
