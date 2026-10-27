'use client'

import { Dialog } from '@/components/ui/Dialog'
import { getMePlanetContent } from '@/lib/content'
import { sanitizeRichText } from '@/lib/sanitize'

import styles from './universe.module.css'

/** 查看ME星球：點擊 ME Planet 後以 Modal 呈現靜態內容（內容留空時顯示空狀態） */
export function MePlanetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = getMePlanetContent()

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
        {content ? (
          <div className={`rich-text ${styles.content}`} dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }} />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyMoon} />
            <strong>ME Planet 還沒有內容</strong>
            之後寫下的內容會出現在這裡
          </div>
        )}
      </div>
    </Dialog>
  )
}
