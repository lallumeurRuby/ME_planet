'use client'

import { type ThreeEvent, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Group, InstancedMesh, Object3D, SphereGeometry, Vector3 } from 'three'

import { Glow } from './Backdrop'
import { clampDelta, ME_RADIUS } from './registry'

const LAND_RADIUS = 2.36
const PUFFS_PER_CLOUD = 4
const onSurface = (lat: number, lon: number, radius: number) => new Vector3().setFromSphericalCoords(radius, lat, lon)

/** 讓物件立在球面上（局部 Y 軸朝外） */
function standOn(object: Object3D, lat: number, lon: number, radius: number) {
  object.position.copy(onSurface(lat, lon, radius))
  object.lookAt(object.position.clone().multiplyScalar(2))
  object.rotateX(Math.PI / 2)
}

function Standing({ lat, lon, radius, children }: { lat: number; lon: number; radius: number; children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  useLayoutEffect(() => {
    if (ref.current) standOn(ref.current, lat, lon, radius)
  }, [lat, lon, radius])
  return <group ref={ref}>{children}</group>
}

const matte = { roughness: 0.9, metalness: 0 } as const

/** 中央 ME Planet：藍色海洋 + 綠地小島（雪山、樹、小屋、雲）；點擊開啟 ME Planet 內容（相機不移動） */
export function MePlanet({ spin, onSelect }: { spin: number; onSelect: () => void }) {
  const planet = useRef<Group>(null)
  const clouds = useRef<Group>(null)

  const landGeometry = useMemo(() => {
    const geometry = new SphereGeometry(LAND_RADIUS, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.36)
    const positions = geometry.attributes.position
    const v = new Vector3()
    for (let i = 0; i < positions.count; i++) {
      v.fromBufferAttribute(positions, i)
      const bump = Math.sin(v.x * 3.1) * Math.cos(v.z * 2.7) * 0.06 + Math.sin(v.x * 7 + v.z * 5) * 0.025
      v.multiplyScalar(1 + bump)
      positions.setXYZ(i, v.x, v.y, v.z)
    }
    geometry.computeVertexNormals()
    return geometry
  }, [])

  const trees = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        lat: 0.25 + Math.random() * 0.8,
        lon: Math.random() * Math.PI * 2,
        scale: 0.6 + Math.random() * 0.5,
        color: i % 3 ? 0x3e8a4a : 0x2f6e3e,
      })),
    []
  )
  const cloudPuffs = useMemo(
    () =>
      Array.from({ length: 9 }, () => ({
        position: onSurface(0.9 + Math.random() * 1.1, Math.random() * Math.PI * 2, 2.75),
        puffs: Array.from({ length: PUFFS_PER_CLOUD }, (_, j) => ({
          radius: 0.16 + Math.random() * 0.12,
          position: [j * 0.18 - 0.27, Math.random() * 0.08, Math.random() * 0.1] as const,
        })),
      })),
    []
  )

  const treeMesh = useRef<InstancedMesh>(null)
  const cloudMesh = useRef<InstancedMesh>(null)

  // instance 的 matrix／顏色只在掛載時寫一次
  useLayoutEffect(() => {
    const mesh = treeMesh.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    trees.forEach((tree, i) => {
      standOn(dummy, tree.lat, tree.lon, 2.5 + 0.1 * tree.scale)
      dummy.scale.setScalar(tree.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, color.setHex(tree.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [trees])

  useLayoutEffect(() => {
    const mesh = cloudMesh.current
    if (!mesh) return
    // 雲團只平移不旋轉（與原本外觀一致）
    const dummy = new Object3D()
    cloudPuffs.forEach((cloud, i) => {
      cloud.puffs.forEach((puff, j) => {
        dummy.position.set(...puff.position).add(cloud.position)
        dummy.scale.setScalar(puff.radius)
        dummy.updateMatrix()
        mesh.setMatrixAt(i * PUFFS_PER_CLOUD + j, dummy.matrix)
      })
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [cloudPuffs])

  useFrame((_, delta) => {
    const dt = clampDelta(delta)
    if (planet.current) planet.current.rotation.y += dt * 0.08 * spin
    if (clouds.current) clouds.current.rotation.y += dt * 0.03 * spin
  })

  return (
    <group ref={planet} rotation={[0.35, 0, 0]}>
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <mesh>
          <sphereGeometry args={[ME_RADIUS, 64, 48]} />
          <meshStandardMaterial color={0x2f74e8} roughness={0.45} metalness={0.05} emissive={0x0b2a7a} emissiveIntensity={0.35} />
        </mesh>
        <mesh geometry={landGeometry}>
          <meshStandardMaterial color={0x6fae5d} {...matte} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.33, 64, 8, 0, Math.PI * 2, Math.PI * 0.34, Math.PI * 0.06]} />
          <meshStandardMaterial color={0xb59a7c} {...matte} />
        </mesh>

        {[
          [0.12, 0.4, 1.1],
          [0.32, 2.2, 0.75],
          [0.28, 4.4, 0.6],
        ].map(([lat, lon, h]) => (
          <group key={lon}>
            <Standing lat={lat} lon={lon} radius={2.3 + 0.6 * h}>
              <mesh>
                <coneGeometry args={[0.55 * h, 1.3 * h, 7]} />
                <meshStandardMaterial color={0x8d8178} flatShading {...matte} />
              </mesh>
            </Standing>
            <Standing lat={lat} lon={lon} radius={2.3 + 1.05 * h}>
              <mesh>
                <coneGeometry args={[0.2 * h, 0.4 * h, 7]} />
                <meshStandardMaterial color={0xf4f6ff} flatShading {...matte} />
              </mesh>
            </Standing>
          </group>
        ))}

        {/* 樹：單一 instancedMesh（1 個 draw call），顏色用 instanceColor */}
        <instancedMesh ref={treeMesh} args={[undefined, undefined, trees.length]}>
          <coneGeometry args={[0.11, 0.34, 6]} />
          <meshStandardMaterial flatShading {...matte} />
        </instancedMesh>

        <Standing lat={0.52} lon={1.2} radius={2.47}>
          <mesh>
            <boxGeometry args={[0.42, 0.26, 0.32]} />
            <meshStandardMaterial color={0xf4efe6} {...matte} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.5, 0.06, 0.4]} />
            <meshStandardMaterial color={0xb3563f} {...matte} />
          </mesh>
          <mesh position={[0.05, 0.02, 0.161]}>
            <planeGeometry args={[0.12, 0.08]} />
            <meshBasicMaterial color={0xffd28a} />
          </mesh>
        </Standing>

        {/* 雲：所有 puff 合成單一 instancedMesh（單位球 × 半徑縮放） */}
        <group ref={clouds}>
          <instancedMesh ref={cloudMesh} args={[undefined, undefined, cloudPuffs.length * PUFFS_PER_CLOUD]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={0xffffff} roughness={1} metalness={0} />
          </instancedMesh>
        </group>
      </group>

      <Glow color={0x5b9bff} scale={9.5} opacity={0.55} />
    </group>
  )
}
