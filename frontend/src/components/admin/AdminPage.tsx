'use client'

import { useCallback, useEffect, useState } from 'react'

import { ConfirmDialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import {
  createParagraph,
  createSatellite,
  createSubSatellite,
  deleteParagraph,
  deleteSatellite,
  deleteSubSatellite,
  listParagraphs,
  listSatellites,
  listSubSatellites,
  updateParagraph,
  updateSatellite,
  updateSubSatellite,
} from '@/lib/api'
import { errorCodeOf, errorMessageOf } from '@/lib/errors'
import { paletteAt } from '@/lib/palette'
import type { Paragraph, Satellite, SubSatellite } from '@/lib/types'

import styles from './admin.module.css'
import { useSessionExpired } from './AdminShell'
import { NameColumn } from './NameColumn'
import { ParagraphColumn } from './ParagraphColumn'
import { ParagraphDrawer, type ParagraphFormValues } from './ParagraphDrawer'

type PendingDelete =
  | { kind: 'satellite'; item: Satellite }
  | { kind: 'subSatellite'; item: SubSatellite }
  | { kind: 'paragraph'; item: Paragraph }

const DELETE_LABEL = { satellite: '衛星', subSatellite: '子衛星', paragraph: '段落' } as const

/** 後台管理：衛星 → 子衛星 → 段落 三欄下鑽 CRUD */
export function AdminPage() {
  const toast = useToast()
  const onSessionExpired = useSessionExpired()

  const [satellites, setSatellites] = useState<Satellite[]>([])
  const [subsBySatellite, setSubsBySatellite] = useState<Record<number, SubSatellite[]>>({})
  const [paragraphsBySub, setParagraphsBySub] = useState<Record<number, Paragraph[]>>({})
  const [selectedSatelliteId, setSelectedSatelliteId] = useState<number | null>(null)
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [drawer, setDrawer] = useState<{ paragraph: Paragraph | null } | null>(null)

  /** 非欄位層級的錯誤：401 → 回登入頁；其他 → toast */
  const handleError = useCallback(
    (error: unknown) => {
      if (errorCodeOf(error) === 'UNAUTHORIZED') onSessionExpired()
      else toast(errorMessageOf(error), { error: true })
    },
    [onSessionExpired, toast]
  )

  const loadSatellites = useCallback(async () => {
    try {
      const list = await listSatellites()
      const subs = await Promise.all(list.map((s) => listSubSatellites(s.id)))
      setSatellites(list)
      setSubsBySatellite(Object.fromEntries(list.map((s, i) => [s.id, subs[i]])))
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const loadParagraphs = useCallback(
    async (subs: SubSatellite[]) => {
      try {
        const lists = await Promise.all(subs.map((u) => listParagraphs(u.id)))
        setParagraphsBySub((prev) => ({ ...prev, ...Object.fromEntries(subs.map((u, i) => [u.id, lists[i]])) }))
      } catch (error) {
        handleError(error)
      }
    },
    [handleError]
  )

  useEffect(() => {
    loadSatellites()
  }, [loadSatellites])

  // 選取狀態跟著資料修正：選取的衛星／子衛星被刪除時，改選第一筆
  const selectedSatellite = satellites.find((s) => s.id === selectedSatelliteId) ?? satellites[0] ?? null
  const subs = selectedSatellite ? subsBySatellite[selectedSatellite.id] ?? [] : []
  const selectedSub = subs.find((u) => u.id === selectedSubId) ?? subs[0] ?? null
  const paragraphs = selectedSub ? paragraphsBySub[selectedSub.id] ?? [] : []

  useEffect(() => {
    if (subs.length) loadParagraphs(subs)
  }, [subs, loadParagraphs])

  const satelliteIndex = (satellite: Satellite) => satellites.findIndex((s) => s.id === satellite.id)

  async function confirmDelete() {
    if (!pendingDelete) return
    const { kind, item } = pendingDelete
    const name = 'name' in item ? item.name : item.title
    setPendingDelete(null)
    try {
      if (kind === 'satellite') await deleteSatellite(item.id)
      if (kind === 'subSatellite') await deleteSubSatellite(item.id)
      if (kind === 'paragraph') await deleteParagraph(item.id)
      toast(`已刪除${DELETE_LABEL[kind]}「${name}」`)
      if (kind === 'paragraph') await loadParagraphs(subs)
      else await loadSatellites()
    } catch (error) {
      if (errorCodeOf(error) === 'HAS_CHILDREN') {
        const children = kind === 'satellite' ? '子衛星' : '段落'
        toast(`「${name}」底下還有${children}，請先刪除它們`, { error: true })
      } else handleError(error)
    }
  }

  async function saveParagraph(values: ParagraphFormValues) {
    const editing = drawer?.paragraph
    if (editing) await updateParagraph(editing.id, values)
    else if (selectedSub) await createParagraph(selectedSub.id, values)
    toast(editing ? '段落已更新' : '段落已新增')
    setDrawer(null)
    await loadParagraphs(subs)
  }

  return (
    <main className={styles.columns}>
      <NameColumn
        title="衛星"
        testId="satellite-column"
        context="依建立時間 舊 → 新"
        emptyText={loading ? '載入中…' : '還沒有衛星，先新增一個知識領域吧'}
        placeholder="例如：天文"
        items={satellites.map((s) => ({
          id: s.id,
          name: s.name,
          meta: `${subsBySatellite[s.id]?.length ?? 0} 子衛星`,
          dot: paletteAt(satelliteIndex(s)).css,
        }))}
        selectedId={selectedSatellite?.id ?? null}
        onSelect={(id) => {
          setSelectedSatelliteId(id)
          setSelectedSubId(null)
        }}
        onCreate={async (name) => {
          const created = await createSatellite({ name })
          toast(`已新增衛星「${name}」`)
          await loadSatellites()
          setSelectedSatelliteId(created.id)
        }}
        onRename={async (id, name) => {
          await updateSatellite(id, { name })
          toast('已儲存')
          await loadSatellites()
        }}
        onDelete={(id) => {
          const item = satellites.find((s) => s.id === id)
          if (item) setPendingDelete({ kind: 'satellite', item })
        }}
        onError={handleError}
      />

      <NameColumn
        title="子衛星"
        testId="sub-satellite-column"
        context={selectedSatellite ? `「${selectedSatellite.name}」底下 · 舊 → 新` : '請先選擇衛星'}
        emptyText={selectedSatellite ? '這顆衛星還沒有子衛星' : ''}
        placeholder="例如：星系"
        disabled={!selectedSatellite}
        items={subs.map((u) => ({ id: u.id, name: u.name, meta: `${paragraphsBySub[u.id]?.length ?? 0} 段落` }))}
        selectedId={selectedSub?.id ?? null}
        onSelect={setSelectedSubId}
        onCreate={async (name) => {
          if (!selectedSatellite) return
          const created = await createSubSatellite(selectedSatellite.id, { name })
          toast(`已新增子衛星「${name}」`)
          await loadSatellites()
          setSelectedSubId(created.id)
        }}
        onRename={async (id, name) => {
          await updateSubSatellite(id, { name })
          toast('已儲存')
          await loadSatellites()
        }}
        onDelete={(id) => {
          const item = subs.find((u) => u.id === id)
          if (item) setPendingDelete({ kind: 'subSatellite', item })
        }}
        onError={handleError}
      />

      <ParagraphColumn
        context={selectedSub && selectedSatellite ? `「${selectedSatellite.name} › ${selectedSub.name}」· 新 → 舊` : '請先選擇子衛星'}
        paragraphs={paragraphs}
        disabled={!selectedSub}
        onAdd={() => setDrawer({ paragraph: null })}
        onEdit={(paragraph) => setDrawer({ paragraph })}
        onDelete={(item) => setPendingDelete({ kind: 'paragraph', item })}
      />

      <ParagraphDrawer
        open={!!drawer}
        paragraph={drawer?.paragraph ?? null}
        onClose={() => setDrawer(null)}
        onSubmit={saveParagraph}
        onError={handleError}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={
          pendingDelete
            ? `刪除${DELETE_LABEL[pendingDelete.kind]}「${'name' in pendingDelete.item ? pendingDelete.item.name : pendingDelete.item.title}」？`
            : ''
        }
        message="刪除後無法復原。"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </main>
  )
}
