'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { Logo } from '@/components/ui/Logo'
import { useToast } from '@/components/ui/Toast'
import { clearAuthToken, getAuthToken, readTokenExpiry } from '@/lib/api'
import { errorCodeOf, errorMessageOf } from '@/lib/errors'

import styles from './admin.module.css'
import { MePlanetDrawer } from './MePlanetDrawer'

/** 後台任一 API 回 401 時呼叫：清除 token、提示並回登入頁 */
const SessionExpiredContext = createContext<() => void>(() => {})
export const useSessionExpired = () => useContext(SessionExpiredContext)

const formatExpiry = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

/** 後台外殼：檢查 JWT（未帶或過期 → /admin/login）＋ 頂部列（含 ME Planet 內容編輯） */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const toast = useToast()
  const [expiry, setExpiry] = useState<Date | null>(null)
  const [mePlanetOpen, setMePlanetOpen] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    const exp = token ? readTokenExpiry(token) : null
    if (!exp || exp.getTime() <= Date.now()) {
      clearAuthToken()
      router.replace('/admin/login')
      return
    }
    setExpiry(exp)
  }, [router])

  const onSessionExpired = useCallback(() => {
    clearAuthToken()
    toast('登入已失效，請重新登入', { error: true })
    router.replace('/admin/login')
  }, [router, toast])

  const handleMePlanetError = useCallback(
    (error: unknown) => {
      if (errorCodeOf(error) === 'UNAUTHORIZED') onSessionExpired()
      else toast(errorMessageOf(error), { error: true })
    },
    [onSessionExpired, toast]
  )

  function logout() {
    clearAuthToken()
    router.replace('/admin/login')
  }

  if (!expiry) return null
  return (
    <SessionExpiredContext.Provider value={onSessionExpired}>
      <div className={styles.screen}>
        <header className={styles.top}>
          <Logo />
          <span className={styles.tag}>ADMIN</span>
          <span className={styles.spacer} />
          <span className={styles.session}>登入有效至 {formatExpiry(expiry)}</span>
          <button className="btn" onClick={() => setMePlanetOpen(true)}>
            ME Planet 內容
          </button>
          <Link className="btn" href="/">
            檢視前台
          </Link>
          <button className="btn" onClick={logout}>
            登出
          </button>
        </header>
        {children}
        <MePlanetDrawer
          open={mePlanetOpen}
          onClose={() => setMePlanetOpen(false)}
          onSaved={() => {
            setMePlanetOpen(false)
            toast('ME Planet 內容已更新')
          }}
          onError={handleMePlanetError}
        />
      </div>
    </SessionExpiredContext.Provider>
  )
}
