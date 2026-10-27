'use client'

import { useEffect, useState } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { getMePlanetContent } from '@/lib/api'
import { errorMessageOf } from '@/lib/errors'
import { sanitizeRichText } from '@/lib/sanitize'

import styles from './universe.module.css'

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; content: string | null }

/** 查看ME星球：點擊 ME Planet 後以 Modal 呈現後台設定的內容（從未設定或已清空時顯示空狀態） */
export function MePlanetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setState({ status: 'loading' })
    getMePlanetContent()
      .then(({ content }) => !cancelled && setState({ status: 'ready', content }))
      .catch((error) => !cancelled && setState({ status: 'error', message: errorMessageOf(error) }))
    return () => {
      cancelled = true
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} labelledBy="me-planet-modal-title" className={styles.paragraphDialog}>
      <div className={styles.modalHead}>
        <span className={`${styles.modalPlanet} ${styles.modalMePlanet}`} />
        <div>
          <div className="eyebrow">My Knowledge Universe</div>
          <h3 id="me-planet-modal-title" className={styles.modalTitle}>
            ME Planet
          </h3>
        </div>
        <button className="btn btn-icon" onClick={onClose} aria-label="關閉">
          ✕
        </button>
      </div>
      <div className={styles.modalBody} data-testid="me-planet-content">
        {state.status === 'loading' && <p className={styles.modalStatus}>載入中…</p>}
        {state.status === 'error' && <p className={styles.modalStatus}>{state.message}</p>}
        {state.status === 'ready' && !state.content && (
          <div className={styles.emptyState}>
            <div className={styles.emptyMoon} />
            <strong>ME Planet 還沒有內容</strong>
            之後在後台設定的內容會出現在這裡
          </div>
        )}
        {state.status === 'ready' && state.content && (
          <div className={`rich-text ${styles.content}`} dangerouslySetInnerHTML={{ __html: sanitizeRichText(state.content) }} />
        )}
      </div>
    </Dialog>
  )
}
