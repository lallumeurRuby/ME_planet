'use client'

import { formatDate } from '@/lib/format'
import type { Paragraph } from '@/lib/types'

import styles from './admin.module.css'

/** 段落欄：卡片清單（新→舊）＋ 新增／編輯／刪除 */
export function ParagraphColumn({
  context,
  paragraphs,
  disabled,
  onAdd,
  onEdit,
  onDelete,
}: {
  context: string
  paragraphs: Paragraph[]
  disabled: boolean
  onAdd: () => void
  onEdit: (paragraph: Paragraph) => void
  onDelete: (paragraph: Paragraph) => void
}) {
  return (
    <section className={styles.column} aria-label="段落" data-testid="paragraph-column">
      <div className={styles.columnHead}>
        <h2>段落</h2>
        <span className={styles.count}>{paragraphs.length}</span>
        <button className="btn btn-primary" disabled={disabled} onClick={onAdd}>
          ＋ 新增段落
        </button>
      </div>
      <div className={styles.columnSub}>{context}</div>
      <div className={styles.paragraphList}>
        {!disabled && paragraphs.length === 0 && (
          <div className={styles.empty}>
            還沒有段落
            <br />
            按「＋ 新增段落」寫下第一則筆記
          </div>
        )}
        {paragraphs.map((paragraph) => (
          <article key={paragraph.id} className={styles.paragraphCard}>
            <div className={styles.cardTop}>
              <h3>{paragraph.title}</h3>
              <button className="btn btn-ghost btn-icon" aria-label={`編輯 ${paragraph.title}`} onClick={() => onEdit(paragraph)}>
                ✎
              </button>
              <button className="btn btn-ghost btn-icon" aria-label={`刪除 ${paragraph.title}`} onClick={() => onDelete(paragraph)}>
                🗑
              </button>
            </div>
            {paragraph.summary ? <p>{paragraph.summary}</p> : <p className={styles.noSummary}>（無摘要）</p>}
            <span className={styles.dates}>
              建立 {formatDate(paragraph.created_at)} · 更新 {formatDate(paragraph.updated_at)}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
