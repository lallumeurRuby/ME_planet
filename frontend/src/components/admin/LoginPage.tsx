'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useToast } from '@/components/ui/Toast'
import { login, saveAuthToken } from '@/lib/api'
import { errorCodeOf, errorMessageOf } from '@/lib/errors'

import styles from './login.module.css'

type Alert = { kind: 'error' | 'locked'; message: string } | null

/** 進入後台：密碼登入 → 取得 24 小時 JWT（400 必填 / 401 密碼錯誤 / 429 鎖定） */
export function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState(false)
  const [alert, setAlert] = useState<Alert>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAlert(null)
    setFieldError(!password)
    if (!password) return
    setSubmitting(true)
    try {
      const { token } = await login({ password })
      saveAuthToken(token)
      toast('歡迎回來')
      router.replace('/admin')
    } catch (error) {
      const code = errorCodeOf(error)
      if (code === 'REQUIRED_FIELD_EMPTY') setFieldError(true)
      else if (code === 'LOGIN_LOCKED') setAlert({ kind: 'locked', message: '登入已鎖定，請 15 分鐘後再試。' })
      else if (code === 'INVALID_PASSWORD') setAlert({ kind: 'error', message: '密碼錯誤。連續錯誤 5 次會鎖定 15 分鐘。' })
      else setAlert({ kind: 'error', message: errorMessageOf(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.screen} aria-label="後台登入">
      <div className={styles.starfield} aria-hidden="true" />
      <div className={styles.card}>
        <span className={styles.miniPlanet} aria-hidden="true" />
        <span className={`eyebrow ${styles.eyebrow}`}>Mission Control</span>
        <h1 className={styles.title}>擁有者登入</h1>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={`field ${fieldError ? 'is-error' : ''}`}>
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {fieldError && <span className="error">請輸入密碼</span>}
          </div>
          {alert && (
            <div className={`alert ${alert.kind === 'locked' ? 'alert-locked' : 'alert-error'}`} role="alert">
              <span aria-hidden="true">{alert.kind === 'locked' ? '⏳' : '✕'}</span>
              <div>{alert.message}</div>
            </div>
          )}
          <button className={`btn btn-primary ${styles.submit}`} type="submit" disabled={submitting}>
            {submitting ? '登入中…' : '登入'}
          </button>
        </form>
        <div className={styles.back}>
          <Link href="/">← 回到宇宙</Link>
        </div>
      </div>
    </main>
  )
}
