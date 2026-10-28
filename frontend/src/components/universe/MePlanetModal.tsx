'use client'

import { useMemo } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { getMePlanetContent } from '@/lib/content'
import { sanitizeRichText, splitLead } from '@/lib/sanitize'

import styles from './universe.module.css'

/** 查看ME星球：點擊 ME Planet 後以 Modal 呈現靜態內容（內容留空時顯示空狀態） */
export function MePlanetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = getMePlanetContent()
  // 第一排：照片（左）＋開頭段落（右）；第二排：其餘內容佔滿寬度
  // 只在開啟時才解析 HTML（關閉時 UniversePage 每次 re-render 都不必重算）
  const [lead, rest] = useMemo(
    () => (open && content ? splitLead(sanitizeRichText(content)) : ['', '']),
    [open, content]
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="me-planet-modal-title"
      className={styles.paragraphDialog}
    >
      <div className={styles.modalHead}>
        <span className={`${styles.modalPlanet} ${styles.modalMePlanet}`} />
        <div>
          <div className="eyebrow">About Me</div>
          <h3 id="me-planet-modal-title" className={styles.modalTitle}>
            Ruby Oz (吳珮如)
          </h3>
        </div>
        <button className="btn btn-icon" onClick={onClose} aria-label="關閉">
          ✕
        </button>
      </div>
      <div className={styles.modalBody} data-testid="me-planet-content">
        <div className={styles.meIntro}>
          <figure className={styles.mePhoto}>
            {/* 靜態輸出（output: 'export'）不支援 next/image 最佳化，直接使用 img */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/me.jpg" alt="Ruby Oz" loading="lazy" decoding="async" />
          </figure>
          {content ? (
            <div className={`rich-text ${styles.content} ${styles.meLead}`} dangerouslySetInnerHTML={{ __html: lead }} />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyMoon} />
              <strong>ME Planet 還沒有內容</strong>
              之後寫下的內容會出現在這裡
            </div>
          )}
        </div>
        {rest && <div className={`rich-text ${styles.content} ${styles.meRest}`} dangerouslySetInnerHTML={{ __html: rest }} />}
      </div>
    </Dialog>
  )
}
