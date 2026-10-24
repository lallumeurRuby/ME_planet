'use client'

import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** null = 檢查中；網址加 ?fallback=1 可強制預覽靜態版本 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null)
  useEffect(() => {
    if (new URLSearchParams(location.search).has('fallback')) return setSupported(false)
    try {
      const canvas = document.createElement('canvas')
      setSupported(!!(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    } catch {
      setSupported(false)
    }
  }, [])
  return supported
}

/** 關閉中的抽屜設為 inert：不可聚焦、輔助技術也略過（取代 aria-hidden + tabIndex） */
export function useInert<T extends HTMLElement>(inert: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.toggleAttribute('inert', inert)
    if (inert && el.contains(document.activeElement)) (document.activeElement as HTMLElement).blur()
  }, [inert])
  return ref
}
