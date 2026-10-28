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

/**
 * 把已淨化的 HTML 拆成「開頭」與「其餘」兩段：
 * 開頭 = 第一個 <h3> 區塊（到第二個 <h3> 之前）；沒有兩個以上 <h3> 時，取到第一個 <p> 為止
 */
export function splitLead(html: string): [lead: string, rest: string] {
  if (typeof window === 'undefined' || !html) return [html, '']
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const blocks = Array.from((doc.body.firstElementChild as HTMLElement).childNodes)
  const headings = blocks.flatMap((node, i) => (node.nodeName === 'H3' ? [i] : []))
  const firstP = blocks.findIndex((node) => node.nodeName === 'P')
  const end = headings.length >= 2 ? headings[1] : firstP + 1
  if (end <= 0) return [html, '']
  const toHtml = (nodes: ChildNode[]) =>
    nodes.map((node) => (node instanceof Element ? node.outerHTML : node.textContent ?? '')).join('')
  return [toHtml(blocks.slice(0, end)).trim(), toHtml(blocks.slice(end)).trim()]
}
