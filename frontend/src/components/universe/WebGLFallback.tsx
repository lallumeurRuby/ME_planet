'use client'

import { paletteAt } from '@/lib/palette'
import type { Satellite } from '@/lib/types'

import styles from './universe.module.css'

/** WebGL 不支援時的靜態星系圖（瀏覽3D宇宙 Rule：WebGL fallback）。點衛星會打開「所有衛星」清單 */
export function WebGLFallback({
  satellites,
  indexOf,
  onOpenDrawer,
}: {
  satellites: Satellite[]
  indexOf: (satellite: Satellite) => number
  onOpenDrawer: () => void
}) {
  return (
    <div className={styles.fallback} data-testid="webgl-fallback">
      <div className={styles.fallbackNote}>你的瀏覽器不支援 3D 顯示，已改用靜態星系圖</div>
      <div className={styles.fallbackOrbit} />
      <div className={styles.fallbackPlanet} role="img" aria-label="ME Planet" />
      {satellites.map((satellite, i) => {
        const a = (i / satellites.length) * Math.PI * 2 - Math.PI / 2
        return (
          <div
            key={satellite.id}
            className={styles.fallbackSat}
            style={{ left: `calc(58% + ${Math.cos(a) * 40}vmin)`, top: `calc(52% + ${Math.sin(a) * 19}vmin)` }}
          >
            <div className={styles.fallbackBall} style={{ background: paletteAt(indexOf(satellite)).css }} />
            <button className={styles.satName} onClick={onOpenDrawer}>
              {satellite.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}
