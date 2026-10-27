'use client'

import { Dialog } from '@/components/ui/Dialog'
import { listParagraphs } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { paletteAt } from '@/lib/palette'
import { sanitizeRichText } from '@/lib/sanitize'
import type { Satellite, SubSatellite } from '@/lib/types'

import styles from './universe.module.css'

/** 查看段落：點擊子衛星後以 Modal 呈現段落清單（依靜態資料順序；無段落時顯示空狀態） */
export function ParagraphModal({
  subSatellite,
  satellite,
  satelliteIndex,
  onClose,
}: {
  subSatellite: SubSatellite | null
  satellite: Satellite | null
  satelliteIndex: number
  onClose: () => void
}) {
  const paragraphs = subSatellite ? listParagraphs(subSatellite.id) : []

  return (
    <Dialog open={!!subSatellite} onClose={onClose} labelledBy="paragraph-modal-title" className={styles.paragraphDialog}>
      <div className={styles.modalHead}>
        <span className={styles.modalPlanet} style={{ background: paletteAt(satelliteIndex).css }} />
        <div>
          <div className="eyebrow">{satellite?.name}</div>
          <h3 id="paragraph-modal-title" className={styles.modalTitle}>
            {subSatellite?.name}
          </h3>
        </div>
        <button className="btn btn-icon" onClick={onClose} aria-label="關閉">
          ✕
        </button>
      </div>
      <div className={styles.modalBody} data-testid="paragraph-list">
        {paragraphs.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyMoon} />
            <strong>這顆子衛星還沒有筆記</strong>
            之後寫下的學習筆記會出現在這裡
          </div>
        )}
        {paragraphs.map((paragraph, i) => (
          <article key={paragraph.id} className={styles.paragraphItem} style={{ animationDelay: `${i * 70}ms` }}>
            <header>
              <h4>{paragraph.title}</h4>
              <time dateTime={paragraph.created_at}>{formatDate(paragraph.created_at)}</time>
            </header>
            {paragraph.summary && <p className={styles.summary}>{paragraph.summary}</p>}
            <div className={`rich-text ${styles.content}`} dangerouslySetInnerHTML={{ __html: sanitizeRichText(paragraph.content) }} />
          </article>
        ))}
      </div>
    </Dialog>
  )
}
