'use client'

import { useState } from 'react'

import { Dialog } from '@/components/ui/Dialog'
import { listParagraphs } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { paletteAt } from '@/lib/palette'
import { sanitizeRichText } from '@/lib/sanitize'
import type { Paragraph, Satellite, SubSatellite } from '@/lib/types'

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
        {/* key：換子衛星時重置展開狀態 */}
        {paragraphs.length > 0 && <ParagraphAccordion key={subSatellite?.id} paragraphs={paragraphs} />}
      </div>
    </Dialog>
  )
}

/** 段落以 accordion 呈現：同時只展開一篇，預設展開第一篇；點已展開的標題則全部收合 */
function ParagraphAccordion({ paragraphs }: { paragraphs: Paragraph[] }) {
  const [openId, setOpenId] = useState<number | null>(paragraphs[0].id)
  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id))

  return <>{paragraphs.map((paragraph, i) => {
    const open = openId === paragraph.id
    const triggerId = `paragraph-${paragraph.id}-trigger`
    const panelId = `paragraph-${paragraph.id}-panel`
    return (
      <article
        key={paragraph.id}
        className={styles.paragraphItem}
        data-open={open}
        style={{ animationDelay: `${i * 70}ms` }}
      >
        <header>
          <h4 className={styles.accordionHeading}>
            <button
              type="button"
              id={triggerId}
              className={styles.accordionTrigger}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(paragraph.id)}
            >
              <span className={styles.accordionChevron} aria-hidden="true" />
              <span>
                {paragraph.title}
                {paragraph.summary && <span className={styles.summary}>{paragraph.summary}</span>}
              </span>
            </button>
          </h4>
          {paragraph.link && (
            <a
              href={paragraph.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
              aria-label={`開啟「${paragraph.title}」網站（新分頁）`}
            >
              ↗
            </a>
          )}
          <time dateTime={paragraph.created_at}>{formatDate(paragraph.created_at)}</time>
        </header>
        <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.accordionPanel} data-open={open}>
          <div>
            <div className={`${styles.accordionBody} ${paragraph.image ? styles.paragraphMedia : ''}`}>
              {paragraph.image && (
                <figure className={styles.paragraphImage}>
                  {/* 靜態輸出（output: 'export'）不支援 next/image 最佳化，直接使用 img */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={paragraph.image} alt={paragraph.title} loading="lazy" decoding="async" />
                </figure>
              )}
              <div>
                <div
                  className={`rich-text ${styles.content}`}
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(paragraph.content) }}
                />
                {paragraph.tags && paragraph.tags.length > 0 && (
                  <ul className={styles.tags} aria-label="標籤">
                    {paragraph.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  })}</>
}
