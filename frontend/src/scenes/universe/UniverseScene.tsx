'use client'

import Canvas3D from '@/components/3d/Canvas3D'
import { paletteAt } from '@/lib/palette'
import type { Satellite as SatelliteData, SubSatellite } from '@/lib/types'

import { GoldRing, OrbitPaths, SceneLighting, Starfield } from './Backdrop'
import { CameraRig } from './CameraRig'
import { LabelProjector } from './LabelProjector'
import { MePlanet } from './MePlanet'
import type { SceneRegistry } from './registry'
import { Satellite } from './Satellite'

export interface UniverseSceneProps {
  satellites: SatelliteData[]
  subSatellitesBySatellite: Record<number, SubSatellite[]>
  focusedId: number | null
  reducedMotion: boolean
  /** Modal 蓋住場景時暫停 render loop（只在 resize 等必要時重繪） */
  paused?: boolean
  registry: SceneRegistry
  onSelectSatellite: (satelliteId: number) => void
  onSelectSubSatellite: (sub: SubSatellite) => void
  onSelectMePlanet: () => void
  className?: string
}

/** 前台 3D 知識宇宙：ME Planet + 衛星（知識領域）+ 小衛星（子衛星） */
export default function UniverseScene({
  satellites,
  subSatellitesBySatellite,
  focusedId,
  reducedMotion,
  paused = false,
  registry,
  onSelectSatellite,
  onSelectSubSatellite,
  onSelectMePlanet,
  className,
}: UniverseSceneProps) {
  const spin = reducedMotion ? 0 : 1
  return (
    <Canvas3D
      className={className}
      shadows={false}
      frameloop={paused ? 'demand' : 'always'}
      camera={{ fov: 28, near: 0.1, far: 600, position: [0, 13, 36] }}
    >
      <SceneLighting />
      <Starfield spin={spin} />
      <MePlanet spin={spin} onSelect={onSelectMePlanet} />
      <GoldRing spin={spin} />
      <OrbitPaths />
      {satellites.map((satellite, index) => (
        <Satellite
          key={satellite.id}
          satelliteId={satellite.id}
          index={index}
          total={satellites.length}
          color={paletteAt(index).hex}
          subSatellites={subSatellitesBySatellite[satellite.id] ?? []}
          isFocused={focusedId === satellite.id}
          anyFocused={focusedId !== null}
          spin={spin}
          registry={registry}
          onSelect={onSelectSatellite}
          onSelectSub={onSelectSubSatellite}
        />
      ))}
      <CameraRig focusedId={focusedId} registry={registry} />
      <LabelProjector focusedId={focusedId} registry={registry} />
    </Canvas3D>
  )
}
