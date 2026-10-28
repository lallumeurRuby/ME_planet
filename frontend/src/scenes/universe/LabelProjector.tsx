'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'

import { ME_RADIUS, SATELLITE_RADIUS, type SceneRegistry } from './registry'

const origin = new Vector3()

/** data-* 只在值改變時寫入，避免每幀觸發屬性選擇器的樣式重算 */
const setData = (el: HTMLElement, key: string, value: string) => {
  if (el.dataset[key] !== value) el.dataset[key] = value
}

/**
 * 每幀把 3D 座標投影成螢幕座標，直接更新 Canvas 外的 HTML 標籤與 SVG 引線（不觸發 React re-render）。
 * 引線：行星右上（或左上）斜出 → 短橫線 → 衛星名稱；行星在畫面左半時標籤翻到左側。
 */
export function LabelProjector({ focusedId, registry }: { focusedId: number | null; registry: SceneRegistry }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const v = useMemo(() => new Vector3(), [])
  const meBottom = useMemo(() => new Vector3(0, -2.9, 0), [])
  const lastPaths = useRef<string | null>(null)

  useFrame(() => {
    const { width: w, height: h } = size
    const toScreen = (p: Vector3) => {
      v.copy(p).project(camera)
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z }
    }
    const focalPx = h / (2 * Math.tan((camera.fov * Math.PI) / 360))
    const meScreen = toScreen(origin)
    const meDistance = camera.position.distanceTo(origin)
    const meRadiusPx = ((ME_RADIUS + 0.3) / meDistance) * focalPx

    // 先一次讀完所有標籤寬度再開始寫入樣式，避免「寫入 → 讀取」交錯造成每幀強制重排
    const widths = new Map<HTMLElement, number>()
    registry.satelliteLabels.forEach((el) => widths.set(el, el.offsetWidth))

    let paths = ''
    registry.satelliteLabels.forEach((el, id) => {
      const position = registry.satellitePositions.get(id)
      if (!position) return
      const sp = toScreen(position)
      const distance = camera.position.distanceTo(position)
      const rPx = (SATELLITE_RADIUS / distance) * focalPx
      const prefersLeft = sp.x < w * 0.55
      // 左側空間不夠（會壓到 hero）時改放右側
      const leftEdge = sp.x - rPx * 0.75 - 40 - 8 - (widths.get(el) ?? 0)
      const left = prefersLeft && leftEdge > registry.reservedLeft
      const dir = left ? -1 : 1
      const ax = sp.x + dir * rPx * 0.75
      const ay = sp.y - rPx * 0.75
      const bx = ax + dir * 26
      const by = ay - 26
      const cx = bx + dir * 14
      // 繞到 ME Planet 後方且被擋住時先隱藏
      const behindMe = distance > meDistance && Math.hypot(sp.x - meScreen.x, sp.y - meScreen.y) < meRadiusPx + rPx * 0.4
      // 飛入衛星時所有衛星標籤都隱藏（名稱已顯示在麵包屑，避免與子衛星膠囊重疊）
      const hidden = sp.z > 1 || behindMe || focusedId !== null
      setData(el, 'side', left ? 'left' : 'right')
      setData(el, 'hidden', String(hidden))
      el.style.left = left ? '' : `${cx + 8}px`
      el.style.right = left ? `${w - cx + 8}px` : ''
      el.style.top = `${by - 14}px`
      if (!hidden) paths += `<path d="M${ax.toFixed(1)},${ay.toFixed(1)} L${bx.toFixed(1)},${by.toFixed(1)} L${cx.toFixed(1)},${by.toFixed(1)}"/>`
    })
    // 引線沒變（例如暫停、reduced motion）時不重建 SVG
    if (registry.leaders && paths !== lastPaths.current) {
      registry.leaders.innerHTML = paths
      lastPaths.current = paths
    }

    if (registry.meLabel) {
      const sp = toScreen(meBottom)
      registry.meLabel.style.left = `${sp.x}px`
      registry.meLabel.style.top = `${sp.y + 10}px`
      setData(registry.meLabel, 'hidden', String(focusedId !== null))
    }

    registry.moonLabels.forEach((el, subId) => {
      const position = registry.moonPositions.get(subId)
      if (!position) return
      const sp = toScreen(position)
      el.style.left = `${sp.x}px`
      el.style.top = `${sp.y}px`
    })
  })

  return null
}
