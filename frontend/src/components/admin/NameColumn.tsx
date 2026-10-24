'use client'

import { useState } from 'react'

import { errorCodeOf } from '@/lib/errors'
import { charCount } from '@/lib/format'
import { NAME_MAX_LENGTH } from '@/lib/types'

import styles from './admin.module.css'

interface Item {
  id: number
  name: string
  meta: string
  dot?: string
}

interface NameColumnProps {
  title: string
  testId: string
  context: string
  emptyText: string
  placeholder: string
  items: Item[]
  selectedId: number | null
  disabled?: boolean
  onSelect: (id: number) => void
  onCreate: (name: string) => Promise<void>
  onRename: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => void
  onError: (error: unknown) => void
}

/** 名稱驗證（與後端一致）：必填、≤ 50 字 */
function validateName(name: string): string | null {
  if (!name) return '名稱為必填'
  if (charCount(name) > NAME_MAX_LENGTH) return `名稱不可超過 ${NAME_MAX_LENGTH} 字`
  return null
}

/** 衛星／子衛星欄：清單 + 列內新增／改名 + 刪除 */
export function NameColumn(props: NameColumnProps) {
  const { title, testId, context, emptyText, placeholder, items, selectedId, disabled, onSelect, onDelete } = props
  const [editing, setEditing] = useState<number | 'new' | null>(null)

  return (
    <section className={styles.column} aria-label={title} data-testid={testId}>
      <div className={styles.columnHead}>
        <h2>{title}</h2>
        <span className={styles.count}>{items.length}</span>
        <button className="btn btn-primary" disabled={disabled} onClick={() => setEditing('new')}>
          ＋ 新增
        </button>
      </div>
      <div className={styles.columnSub}>{context}</div>
      <ul className={styles.list}>
        {editing === 'new' && (
          <InlineNameForm
            placeholder={placeholder}
            onCancel={() => setEditing(null)}
            onSave={async (name) => {
              await props.onCreate(name)
              setEditing(null)
            }}
            onError={props.onError}
          />
        )}
        {items.map((item) =>
          editing === item.id ? (
            <InlineNameForm
              key={item.id}
              initial={item.name}
              placeholder={placeholder}
              onCancel={() => setEditing(null)}
              onSave={async (name) => {
                await props.onRename(item.id, name)
                setEditing(null)
              }}
              onError={props.onError}
            />
          ) : (
            <li
              key={item.id}
              className={`${styles.row} ${item.id === selectedId ? styles.selected : ''}`}
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onSelect(item.id)}
              aria-current={item.id === selectedId}
            >
              {item.dot && <span className={styles.rowPlanet} style={{ background: item.dot }} />}
              <span className={styles.rowName}>{item.name}</span>
              <span className={styles.meta}>{item.meta}</span>
              <span className={styles.rowActions}>
                <button
                  className="btn btn-ghost btn-icon"
                  aria-label={`編輯 ${item.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditing(item.id)
                  }}
                >
                  ✎
                </button>
                <button
                  className="btn btn-ghost btn-icon"
                  aria-label={`刪除 ${item.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item.id)
                  }}
                >
                  🗑
                </button>
              </span>
            </li>
          )
        )}
        {items.length === 0 && editing !== 'new' && emptyText && <li className={styles.empty}>{emptyText}</li>}
      </ul>
    </section>
  )
}

function InlineNameForm({
  initial = '',
  placeholder,
  onSave,
  onCancel,
  onError,
}: {
  initial?: string
  placeholder: string
  onSave: (name: string) => Promise<void>
  onCancel: () => void
  onError: (error: unknown) => void
}) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const length = charCount(name)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const problem = validateName(name)
    setError(problem)
    if (problem) return
    setSaving(true)
    try {
      await onSave(name)
    } catch (err) {
      const code = errorCodeOf(err)
      if (code === 'NAME_DUPLICATED') setError(`「${name}」已存在`)
      else if (code === 'REQUIRED_FIELD_EMPTY') setError('名稱為必填')
      else if (code === 'FIELD_TOO_LONG') setError(`名稱不可超過 ${NAME_MAX_LENGTH} 字`)
      else onError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <li>
      <form className={styles.inlineForm} onSubmit={submit} noValidate>
        <div className={`field ${error ? 'is-error' : ''}`}>
          <label>
            名稱 <span className={`counter ${length > NAME_MAX_LENGTH ? 'is-over' : ''}`}>{length} / {NAME_MAX_LENGTH}</span>
          </label>
          <input name="name" value={name} placeholder={placeholder} autoFocus onChange={(e) => setName(e.target.value)} />
          {error && <span className="error">{error}</span>}
        </div>
        <div className={styles.inlineActions}>
          <button type="button" className="btn" onClick={onCancel}>
            取消
          </button>
          <button className="btn btn-primary" disabled={saving}>
            儲存
          </button>
        </div>
      </form>
    </li>
  )
}
