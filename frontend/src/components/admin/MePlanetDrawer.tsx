'use client'

import { useEffect, useRef, useState } from 'react'

import { getMePlanetContent, updateMePlanetContent } from '@/lib/api'
import { useInert } from '@/lib/hooks'
import { sanitizeRichText } from '@/lib/sanitize'

import styles from './admin.module.css'
import { RICH_TEXT_TOOLBAR } from './ParagraphDrawer'

/**
 * ME Planet 內容編輯抽屜：只有一個 rich text 內容欄位（無標題、選填）。
 * 整份覆蓋；編輯器沒有文字時送出 ""，即清空前台 Modal 的內容。
 */
export function MePlanetDrawer({
  open,
  onClose,
  onSaved,
  onError,
}: {
  open: boolean
  onClose: () => void
  onSaved: () => void
  onError: (error: unknown) => void
}) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const editor = useRef<HTMLDivElement>(null)
  const drawerRef = useInert<HTMLFormElement>(!open)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    if (editor.current) editor.current.innerHTML = ''
    getMePlanetContent()
      .then(({ content }) => {
        if (!cancelled && editor.current) editor.current.innerHTML = content ? sanitizeRichText(content) : ''
      })
      .catch((error) => !cancelled && onError(error))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [open, onError])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const content = editor.current?.textContent?.trim() ? editor.current.innerHTML : ''
    setSaving(true)
    try {
      await updateMePlanetContent({ content })
      onSaved()
    } catch (error) {
      onError(error)
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
        aria-labelledby="me-planet-form-title"
        onSubmit={submit}
        noValidate
      >
        <div className={styles.drawerHead}>
          <h2 id="me-planet-form-title">編輯 ME Planet 內容</h2>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="關閉">
            ✕
          </button>
        </div>
        <div className={styles.drawerBody}>
          <div className="field">
            <span className="label">
              內容 <span>選填；清空後前台顯示空狀態</span>
            </span>
            <div className={styles.editor}>
              <div className={styles.toolbar} role="toolbar" aria-label="格式">
                {RICH_TEXT_TOOLBAR.map((tool) => (
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
                contentEditable={!loading}
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="ME Planet 內容"
                data-placeholder={loading ? '載入中…' : '介紹一下自己…'}
              />
            </div>
          </div>
        </div>
        <div className={styles.drawerFoot}>
          <button type="button" className="btn" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving || loading}>
            {saving ? '儲存中…' : '儲存'}
          </button>
        </div>
      </form>
    </>
  )
}
