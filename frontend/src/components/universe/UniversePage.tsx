'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { useToast } from '@/components/ui/Toast'
import { listSatellites, listSubSatellites } from '@/lib/api'
import { errorMessageOf } from '@/lib/errors'
import { usePrefersReducedMotion, useWebGLSupport } from '@/lib/hooks'
import type { Satellite, SubSatellite } from '@/lib/types'
import { createRegistry } from '@/scenes/universe/registry'

import { MePlanetModal } from './MePlanetModal'
import { ParagraphModal } from './ParagraphModal'
import { SatelliteDrawer } from './SatelliteDrawer'
import styles from './universe.module.css'
import { WebGLFallback } from './WebGLFallback'

// WebGL 只在瀏覽器執行
const UniverseScene = dynamic(() => import('@/scenes/universe/UniverseScene'), { ssr: false })

/** 前台首頁（瀏覽3D宇宙 → 查看ME星球／探索衛星 → 查看段落） */
export function UniversePage() {
  const toast = useToast()
  const webgl = useWebGLSupport()
  const reducedMotion = usePrefersReducedMotion()
  const registry = useMemo(createRegistry, [])

  const [satellites, setSatellites] = useState<Satellite[]>([])
  const [subsBySatellite, setSubsBySatellite] = useState<Record<number, SubSatellite[]>>({})
  const [loadError, setLoadError] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openSub, setOpenSub] = useState<SubSatellite | null>(null)
  const [mePlanetOpen, setMePlanetOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await listSatellites()
        const subs = await Promise.all(list.map((s) => listSubSatellites(s.id)))
        if (cancelled) return
        setSatellites(list)
        setSubsBySatellite(Object.fromEntries(list.map((s, i) => [s.id, subs[i]])))
      } catch (error) {
        if (!cancelled) setLoadError(errorMessageOf(error))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (loadError) toast(`載入宇宙失敗：${loadError}`, { error: true })
  }, [loadError, toast])

  const focused = satellites.find((s) => s.id === focusedId) ?? null

  // hero 佔用的左側寬度：hero 顯示時標籤不可翻進這塊區域
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const update = () => {
      const rect = hero.getBoundingClientRect()
      registry.reservedLeft = focused || rect.top > innerHeight / 2 ? 0 : rect.right + 16
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(hero)
    addEventListener('resize', update)
    return () => {
      observer.disconnect()
      removeEventListener('resize', update)
    }
  }, [registry, focused])
  const satelliteIndex = (satellite: Satellite) => satellites.findIndex((s) => s.id === satellite.id)
  const focusSatellite = useCallback((id: number | null) => setFocusedId(id), [])

  const registerSatelliteLabel = (id: number) => (el: HTMLElement | null) => {
    if (el) registry.satelliteLabels.set(id, el)
    else registry.satelliteLabels.delete(id)
  }
  const registerMoonLabel = (id: number) => (el: HTMLElement | null) => {
    if (el) registry.moonLabels.set(id, el)
    else registry.moonLabels.delete(id)
  }

  return (
    <main className={styles.universe} aria-label="ME Planet 知識宇宙">
      {webgl && (
        <>
          <UniverseScene
            className={styles.canvas}
            satellites={satellites}
            subSatellitesBySatellite={subsBySatellite}
            focusedId={focusedId}
            reducedMotion={reducedMotion}
            registry={registry}
            onSelectSatellite={focusSatellite}
            onSelectSubSatellite={setOpenSub}
            onSelectMePlanet={() => setMePlanetOpen(true)}
          />
          <svg className={styles.leaders} aria-hidden="true" ref={(el) => void (registry.leaders = el)} />
          <div className={styles.sceneLabels}>
            {satellites.map((satellite) => (
              <div key={satellite.id} className={styles.satLabel} data-hidden="true" ref={registerSatelliteLabel(satellite.id)}>
                <button className={styles.satName} onClick={() => focusSatellite(satellite.id)}>
                  {satellite.name}
                </button>
              </div>
            ))}
            <div className={styles.meLabel} ref={(el) => void (registry.meLabel = el)}>
              <button className={styles.meName} onClick={() => setMePlanetOpen(true)} aria-label="查看 ME Planet 內容">
                <strong>ME</strong>
              </button>
              <span>
                一位終身學習者
                <br />
                每天長出一點新的知識
              </span>
            </div>
            {focused &&
              (subsBySatellite[focused.id] ?? []).map((sub) => (
                <button key={sub.id} className={styles.moonLabel} ref={registerMoonLabel(sub.id)} onClick={() => setOpenSub(sub)}>
                  {sub.name}
                </button>
              ))}
          </div>
        </>
      )}
      {webgl === false && (
        <WebGLFallback satellites={satellites} indexOf={satelliteIndex} onOpenDrawer={() => setDrawerOpen(true)} />
      )}

      <header className={styles.siteNav}>
        <Logo />
        <span className={styles.spacer} />
        <Link className={styles.navLink} href="/" aria-current="page">
          宇宙
        </Link>
        <Link className={`btn ${styles.pillCta}`} href="/admin">
          後台 <span className={styles.ctaDot} />
        </Link>
      </header>

      <section ref={heroRef} className={`${styles.hero} ${focused ? styles.heroHidden : ''}`}>
        <div className="eyebrow">My Knowledge Universe</div>
        <h1>
          好奇心，
          <br />
          <em>持續</em>公轉中。
        </h1>
        <p>
          在不同的知識領域中持續探索、連結與累積，
          <br />
          讓學習成為推動我前進的引力。
        </p>
        <button className={`btn ${styles.exploreBtn}`} onClick={() => setDrawerOpen(true)}>
          探索我的宇宙 <span aria-hidden="true">→</span>
        </button>
      </section>

      {focused && (
        <nav className={styles.breadcrumb} aria-label="目前位置">
          <button className={styles.crumbRoot} onClick={() => focusSatellite(null)}>
            ME Planet
          </button>
          <span aria-hidden="true">›</span>
          <span className={styles.crumbCurrent}>{focused.name}</span>
          <button className="btn btn-ghost btn-icon" onClick={() => focusSatellite(null)} aria-label="返回整個宇宙">
            ✕
          </button>
        </nav>
      )}

      <SatelliteDrawer
        open={drawerOpen}
        satellites={satellites}
        indexOf={satelliteIndex}
        subsBySatellite={subsBySatellite}
        canFlyTo={!!webgl}
        onClose={() => setDrawerOpen(false)}
        onSelectSatellite={(id) => {
          setDrawerOpen(false)
          focusSatellite(id)
        }}
        onOpenSub={setOpenSub}
      />

      {webgl && (
        <div className={styles.sceneHint}>
          <span className={styles.mouse} aria-hidden="true" />
          點擊衛星，飛近看看
        </div>
      )}

      <ParagraphModal
        subSatellite={openSub}
        satellite={openSub ? satellites.find((s) => s.id === openSub.satellite_id) ?? null : null}
        satelliteIndex={openSub ? satellites.findIndex((s) => s.id === openSub.satellite_id) : 0}
        onClose={() => setOpenSub(null)}
      />

      <MePlanetModal open={mePlanetOpen} onClose={() => setMePlanetOpen(false)} />
    </main>
  )
}
