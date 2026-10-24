'use client'

import { useEffect } from 'react'

import styles from './Dialog.module.css'

interface DialogProps {
  open: boolean
  onClose: () => void
  labelledBy: string
  role?: 'dialog' | 'alertdialog'
  className?: string
  children: React.ReactNode
}

/** 置中對話框：點背景或按 Esc 關閉 */
export function Dialog({ open, onClose, labelledBy, role = 'dialog', className, children }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div role={role} aria-modal="true" aria-labelledby={labelledBy} className={`${styles.dialog} ${className ?? ''}`}>
        {children}
      </div>
    </div>
  )
}

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

/** 刪除確認對話框（刪除衛星／子衛星／段落 Rule：前置（確認）） */
export function ConfirmDialog({ open, title, message, confirmLabel = '刪除', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} labelledBy="confirm-title" role="alertdialog">
      <h3 id="confirm-title" className={styles.title}>
        {title}
      </h3>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button className="btn" onClick={onCancel}>
          取消
        </button>
        <button className="btn btn-danger" onClick={onConfirm} data-testid="confirm-ok">
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
