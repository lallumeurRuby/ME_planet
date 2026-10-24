'use client'

import { useEffect, useRef, useState } from 'react'

import { errorCodeOf } from '@/lib/errors'
import { charCount } from '@/lib/format'
import { useInert } from '@/lib/hooks'
import { sanitizeRichText } from '@/lib/sanitize'
import { TITLE_MAX_LENGTH } from '@/lib/types'
import type { Paragraph } from '@/lib/types'

import styles from './admin.module.css'

export interface ParagraphFormValues {
  title: string
  summary: string | null
  content: string
}

const TOOLBAR = [
  { cmd: 'bold', label: '粗體', icon: <b>B</b> },
  { cmd: 'italic', label: '斜體', icon: <i>I</i> },
  { cmd: 'insertUnorderedList', label: '項目清單', icon: '•' },
  { cmd: 'formatBlock', arg: 'h3', label: '小標題', icon: 'H' },
] as const

/**
 * 段落新增／編輯抽屜：標題（必填、≤100 字）、摘要（選填）、內容（rich text，必填）。
 * 編輯為整筆覆蓋：摘要留空送出 null，即清空摘要。
 */
export function ParagraphDrawer({
  open,
  paragraph,
  onClose,
  onSubmit,
  onError,
}: {
  open: boolean
  paragraph: Paragraph | null
  onClose: () => void
  onSubmit: (values: ParagraphFormValues) => Promise<void>
  onError: (error: unknown) => void
}) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState(false)
  const [saving, setSaving] = useState(false)
  const editor = useRef<HTMLDivElement>(null)
  const titleInput = useRef<HTMLInputElement>(null)
  const drawerRef = useInert<HTMLFormElement>(!open)

  useEffect(() => {
    if (!open) return
    setTitle(paragraph?.title ?? '')
    setSummary(paragraph?.summary ?? '')
    setTitleError(null)
    setContentError(false)
    if (editor.current) editor.current.innerHTML = paragraph ? sanitizeRichText(paragraph.content) : ''
    const timer = setTimeout(() => titleInput.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [open, paragraph])

  const titleLength = charCount(title)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const content = editor.current?.textContent?.trim() ? editor.current.innerHTML : ''
    const nextTitleError = !title.trim() ? '標題為必填' : titleLength > TITLE_MAX_LENGTH ? `標題不可超過 ${TITLE_MAX_LENGTH} 字` : null
    setTitleError(nextTitleError)
    setContentError(!content)
    if (nextTitleError || !content) return
    setSaving(true)
    try {
      await onSubmit({ title, summary: summary || null, content })
    } catch (error) {
      const code = errorCodeOf(error)
      if (code === 'REQUIRED_FIELD_EMPTY') setTitleError('標題與內容為必填')
      else if (code === 'FIELD_TOO_LONG') setTitleError(`標題不可超過 ${TITLE_MAX_LENGTH} 字`)
      else onError(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {open && <div className={styles.drawerBackdrop} onClick={onClose} />}
      <form
        ref={drawerRef}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-labelledby="paragraph-form-title"
        onSubmit={submit}
        noValidate
      >
        <div className={styles.drawerHead}>
          <h2 id="paragraph-form-title">{paragraph ? '編輯段落' : '新增段落'}</h2>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="關閉">
            ✕
          </button>
        </div>
        <div className={styles.drawerBody}>
          <div className={`field ${titleError ? 'is-error' : ''}`}>
            <label htmlFor="paragraph-title">
              標題{' '}
              <span className={`counter ${titleLength > TITLE_MAX_LENGTH ? 'is-over' : ''}`}>
                {titleLength} / {TITLE_MAX_LENGTH}
              </span>
            </label>
            <input
              id="paragraph-title"
              ref={titleInput}
              value={title}
              placeholder="例如：銀河系簡介"
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <span className="error">{titleError}</span>}
          </div>
          <div className="field">
            <label htmlFor="paragraph-summary">
              摘要 <span>選填</span>
            </label>
            <input
              id="paragraph-summary"
              value={summary}
              placeholder="一句話說明這段筆記"
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="field">
            <span className="label">內容</span>
            <div className={styles.editor}>
              <div className={styles.toolbar} role="toolbar" aria-label="格式">
                {TOOLBAR.map((tool) => (
                  <button
                    key={tool.cmd}
                    type="button"
                    aria-label={tool.label}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.current?.focus()
                      document.execCommand(tool.cmd, false, 'arg' in tool ? tool.arg : undefined)
                    }}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>
              <div
                ref={editor}
                className={`rich-text ${styles.editorArea}`}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="內容"
                data-placeholder="寫下你的筆記…"
              />
            </div>
            {contentError && <span className="error">內容為必填</span>}
          </div>
        </div>
        <div className={styles.drawerFoot}>
          <button type="button" className="btn" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '儲存中…' : '儲存'}
          </button>
        </div>
      </form>
    </>
  )
}
