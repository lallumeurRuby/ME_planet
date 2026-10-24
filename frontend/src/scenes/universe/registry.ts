import type { Vector3 } from 'three'

/**
 * 3D 場景 ↔ 2D 疊加層的共用登記表（mutable，不經過 React state）。
 *   Satellite 每幀寫入世界座標 → CameraRig 讀取以飛入 → LabelProjector 投影成螢幕座標並直接更新 DOM。
 */
export interface SceneRegistry {
  satellitePositions: Map<number, Vector3>
  moonPositions: Map<number, Vector3>
  satelliteLabels: Map<number, HTMLElement>
  moonLabels: Map<number, HTMLElement>
  leaders: SVGSVGElement | null
  meLabel: HTMLElement | null
  /** 左側被 hero 佔用的寬度（px）；標籤翻到左側會壓到 hero 時改放右側 */
  reservedLeft: number
}

export const createRegistry = (): SceneRegistry => ({
  satellitePositions: new Map(),
  moonPositions: new Map(),
  satelliteLabels: new Map(),
  moonLabels: new Map(),
  leaders: null,
  meLabel: null,
  reservedLeft: 0,
})

/** 場景尺寸常數（與 layout.html 原型一致） */
export const ORBIT_RADII = [7.6, 10.4] as const
export const SATELLITE_RADIUS = 0.95
export const MOON_ORBIT_RADIUS = 1.55
export const ME_RADIUS = 2.3
export const SYSTEM_RADIUS = ORBIT_RADII[1] + MOON_ORBIT_RADIUS + SATELLITE_RADIUS
