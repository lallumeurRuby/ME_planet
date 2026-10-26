'use client'

import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, Group, Mesh, Vector3 } from 'three'

import type { SubSatellite } from '@/lib/types'

import { Glow, OrbitLine } from './Backdrop'
import { MOON_ORBIT_RADIUS, ORBIT_RADII, SATELLITE_RADIUS, type SceneRegistry } from './registry'
import { planetTexture } from './textures'

interface SatelliteProps {
  satelliteId: number
  index: number
  total: number
  color: string
  subSatellites: SubSatellite[]
  isFocused: boolean
  anyFocused: boolean
  spin: number
  registry: SceneRegistry
  onSelect: (satelliteId: number) => void
  onSelectSub: (sub: SubSatellite) => void
}

const pointer = {
  onPointerOver: (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  },
  onPointerOut: () => {
    document.body.style.cursor = ''
  },
}

/** 衛星（知識領域）：有紋理的霧面行星 + 傾斜的小軌道 + 小衛星（子衛星） */
export function Satellite({
  satelliteId,
  index,
  total,
  color,
  subSatellites,
  isFocused,
  anyFocused,
  spin,
  registry,
  onSelect,
  onSelectSub,
}: SatelliteProps) {
  const group = useRef<Group>(null)
  const body = useRef<Mesh>(null)
  const moons = useRef<(Mesh | null)[]>([])
  const orbit = useRef({
    radius: ORBIT_RADII[index % 2],
    angle: (index / total) * Math.PI * 2 + 0.4,
    speed: 0.025 + (index % 3) * 0.006,
  })
  const moonAngles = useRef<number[]>([])
  const texture = useMemo(() => planetTexture(color, index * 97 + 13), [color, index])
  const moonColor = useMemo(() => new Color(color).lerp(new Color(0xffffff), 0.35), [color])

  useEffect(() => {
    moonAngles.current = subSatellites.map((_, k) => (k / subSatellites.length) * Math.PI * 2)
  }, [subSatellites])

  useEffect(() => {
    const position = new Vector3()
    registry.satellitePositions.set(satelliteId, position)
    return () => {
      registry.satellitePositions.delete(satelliteId)
    }
  }, [registry, satelliteId])

  useFrame((_, dt) => {
    const o = orbit.current
    // 飛入某顆衛星時：它停住，其他衛星放慢
    if (!isFocused) o.angle += dt * o.speed * spin * (anyFocused ? 0.25 : 1)
    group.current?.position.set(Math.cos(o.angle) * o.radius, Math.sin(o.angle * 1.3) * 0.4, Math.sin(o.angle) * o.radius)
    if (group.current) registry.satellitePositions.get(satelliteId)?.copy(group.current.position)
    if (body.current) body.current.rotation.y += dt * 0.15 * spin

    moons.current.forEach((moon, k) => {
      if (!moon) return
      const a = (moonAngles.current[k] = (moonAngles.current[k] ?? 0) + dt * (0.1 + k * 0.03) * spin)
      moon.position.set(Math.cos(a) * MOON_ORBIT_RADIUS, 0, Math.sin(a) * MOON_ORBIT_RADIUS)
      const world = registry.moonPositions.get(subSatellites[k].id) ?? new Vector3()
      registry.moonPositions.set(subSatellites[k].id, moon.getWorldPosition(world))
    })
  })

  return (
    <group ref={group}>
      <mesh
        ref={body}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(satelliteId)
        }}
        {...pointer}
      >
        <sphereGeometry args={[SATELLITE_RADIUS, 48, 32]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0} />
      </mesh>
      <Glow color={color} scale={3.4} opacity={0.22} />
      <group rotation={[0.35 + (index % 3) * 0.12, 0, (index % 2 ? -1 : 1) * 0.25]}>
        <OrbitLine radius={MOON_ORBIT_RADIUS} opacity={0.35} />
        {subSatellites.map((sub, k) => (
          <mesh
            key={sub.id}
            ref={(node) => {
              moons.current[k] = node
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectSub(sub)
            }}
            {...pointer}
          >
            <sphereGeometry args={[0.13 + (k % 2) * 0.04, 20, 14]} />
            <meshStandardMaterial color={moonColor} roughness={0.9} metalness={0} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
