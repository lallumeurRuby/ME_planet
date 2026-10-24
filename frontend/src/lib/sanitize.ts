/**
 * 段落 content 是擁有者編輯的 HTML（rich text）。公開頁面顯示前只保留編輯器會產生的標籤，
 * 移除 script、事件屬性與其他標籤，避免 HTML 注入。
 */
const ALLOWED_TAGS = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H3', 'DIV', 'SPAN'])

export function sanitizeRichText(html: string): string {
  if (typeof window === 'undefined') return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement
  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...(child.tagName === 'SCRIPT' || child.tagName === 'STYLE' ? [] : Array.from(child.childNodes)))
        continue
      }
      for (const attr of Array.from(child.attributes)) child.removeAttribute(attr.name)
      walk(child)
    }
  }
  walk(root)
  return root.innerHTML
}
