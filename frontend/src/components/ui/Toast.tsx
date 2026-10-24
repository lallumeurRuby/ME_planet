'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

import styles from './Toast.module.css'

type ShowToast = (message: string, options?: { error?: boolean }) => void

const ToastContext = createContext<ShowToast>(() => {})

/** 全站共用 Toast：useToast()('訊息') / useToast()('錯誤訊息', { error: true }) */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null)
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const show = useCallback<ShowToast>((message, options) => {
    setToast({ message, error: !!options?.error })
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2800)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        data-testid="toast"
        role="status"
        aria-live="polite"
        className={`${styles.toast} ${visible ? styles.visible : ''} ${toast?.error ? styles.error : ''}`}
      >
        {toast?.message}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
