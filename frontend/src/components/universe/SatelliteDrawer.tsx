'use client'

import { useInert } from '@/lib/hooks'
import { paletteAt } from '@/lib/palette'
import type { Satellite, SubSatellite } from '@/lib/types'

import styles from './universe.module.css'

/** 所有衛星清單：不依賴 3D 操作也能瀏覽全部衛星與子衛星 */
export function SatelliteDrawer({
  open,
  satellites,
  indexOf,
  subsBySatellite,
  canFlyTo,
  onClose,
  onSelectSatellite,
  onOpenSub,
}: {
  open: boolean
  satellites: Satellite[]
  indexOf: (satellite: Satellite) => number
  subsBySatellite: Record<number, SubSatellite[]>
  canFlyTo: boolean
  onClose: () => void
  onSelectSatellite: (id: number) => void
  onOpenSub: (sub: SubSatellite) => void
}) {
  const ref = useInert<HTMLElement>(!open)
  return (
    <nav ref={ref} className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-label="所有知識衛星">
      <button className={`btn btn-ghost btn-icon ${styles.drawerClose}`} onClick={onClose} aria-label="關閉">
        ✕
      </button>
      <div className="eyebrow">All Satellites</div>
      <h2>所有知識衛星</h2>
      {satellites.length === 0 && <p className={styles.drawerEmpty}>宇宙裡還沒有衛星</p>}
      <ol>
        {satellites.map((satellite) => (
          <li key={satellite.id}>
            <button className={styles.drawerSat} onClick={() => canFlyTo && onSelectSatellite(satellite.id)}>
              <span className={styles.dotPlanet} style={{ background: paletteAt(indexOf(satellite)).css }} />
              {satellite.name}
            </button>
            <div className={styles.drawerSubs}>
              {(subsBySatellite[satellite.id] ?? []).map((sub) => (
                <button key={sub.id} onClick={() => onOpenSub(sub)}>
                  {sub.name}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
