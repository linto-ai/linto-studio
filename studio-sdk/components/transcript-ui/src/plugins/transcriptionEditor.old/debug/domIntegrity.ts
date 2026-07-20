import type { EditorView } from "@tiptap/pm/view"

/**
 * ViewDesc ↔ DOM integrity checker.
 *
 * The production crash (`addDOM(null)` in readDOMChange → parseBetween) is a
 * SYMPTOM: prosemirror-view's parseRange computes childNodes offsets from the
 * DOM nodes its viewDescs believe they rendered; when a node was moved,
 * removed or duplicated behind PM's back, fromOffset can land after toOffset
 * and addAll walks past the last sibling into null. This checker walks the
 * (private but long-stable) viewDesc tree and reports every way the real DOM
 * can disagree with it — catching the desync when it is CREATED, not when a
 * later DOM-observer flush crashes on it.
 */

/** Minimal structural view of prosemirror-view's internal ViewDesc tree.
 *  Private API — only read here, and only when the debug flag is on. */
interface ViewDescLike {
  dom: Node
  contentDOM?: Node | null
  children: ViewDescLike[]
  node?: { type: { name: string }; attrs: Record<string, unknown> } | null
}

export interface IntegrityViolation {
  kind:
    | "misparented-child" // a desc's dom is not under the contentDOM PM expects
    | "duplicate-dom" // two sibling descs reference the same DOM node
    | "order-mismatch" // DOM sibling order differs from desc order
    | "foreign-node" // a node PM doesn't know about sits inside a contentDOM
    | "disconnected-content" // a contentDOM is detached from the document
    | "parent-snapshot" // side-by-side desc/DOM children of a violated parent
  /** Closest enclosing turn id, when the violation sits inside a turn. */
  turnId: string | null
  detail: string
}

export function checkDescIntegrity(view: EditorView): IntegrityViolation[] {
  // Before the web component mounts the editor everything is detached —
  // checking would only produce noise.
  if (!view.dom.isConnected) return []
  const docView = (view as unknown as { docView?: ViewDescLike }).docView
  const violations: IntegrityViolation[] = []
  if (docView) walk(docView, null, violations)
  return violations
}

function walk(
  desc: ViewDescLike,
  turnId: string | null,
  out: IntegrityViolation[],
): void {
  if (desc.node?.type.name === "turn") {
    turnId = typeof desc.node.attrs.id === "string" ? desc.node.attrs.id : null
  }
  if (desc.contentDOM && desc.children.length > 0) {
    checkChildren(desc, desc.contentDOM, turnId, out)
  }
  for (const child of desc.children) walk(child, turnId, out)
}

function checkChildren(
  desc: ViewDescLike,
  content: Node,
  turnId: string | null,
  out: IntegrityViolation[],
): void {
  const before = out.length
  if (!content.isConnected) {
    out.push({
      kind: "disconnected-content",
      turnId,
      detail: describeNode(content),
    })
  }

  const known = new Set<Node>()
  let prevDom: Node | null = null
  for (const child of desc.children) {
    if (known.has(child.dom)) {
      // The exact hazard of a reused/cached widget DOM (remote caret span):
      // insertion at the new position auto-detached it from the old one.
      out.push({
        kind: "duplicate-dom",
        turnId,
        detail: describeNode(child.dom),
      })
      continue
    }
    known.add(child.dom)

    if (child.dom.parentNode !== content) {
      out.push({
        kind: "misparented-child",
        turnId,
        detail:
          `${describeNode(child.dom)} expected under ${describeNode(content)}, ` +
          (child.dom.parentNode
            ? `actually under ${describeNode(child.dom.parentNode)}`
            : "actually detached"),
      })
      continue // sibling-order check is meaningless for a node living elsewhere
    }

    if (prevDom) {
      const pos = prevDom.compareDocumentPosition(child.dom)
      // This ordering break is precisely what makes parseRange emit
      // fromOffset > toOffset and readDOMChange crash on addDOM(null).
      if (!(pos & Node.DOCUMENT_POSITION_FOLLOWING)) {
        out.push({
          kind: "order-mismatch",
          turnId,
          detail: `${describeNode(child.dom)} does not follow ${describeNode(prevDom)}`,
        })
      }
    }
    prevDom = child.dom
  }

  // Nodes PM doesn't know about: Firefox's bare caret text node (see
  // wordMark.ts), leftovers from an external DOM writer… PM's own hack nodes
  // (trailingBreak/separator) have a desc, so they don't false-positive here.
  for (const node of Array.from(content.childNodes)) {
    if (known.has(node)) continue
    if ((node as Node & { pmViewDesc?: unknown }).pmViewDesc) continue
    out.push({ kind: "foreign-node", turnId, detail: describeNode(node) })
  }

  // Any violation in this parent: capture what PM believes vs what the DOM
  // holds, so the divergence can be read without reproducing again.
  if (out.length > before) {
    out.push({
      kind: "parent-snapshot",
      turnId,
      detail:
        `descs=[${desc.children.map((c) => describeNode(c.dom)).join(" ")}] ` +
        `dom=[${Array.from(content.childNodes).map(describeNode).join(" ")}]`,
    })
  }
}

export function describeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return `#text "${(node.nodeValue ?? "").slice(0, 30)}"`
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const wid = el.getAttribute("data-wid")
    const cls =
      typeof el.className === "string" && el.className
        ? `.${el.className.trim().split(/\s+/).join(".")}`
        : ""
    return `<${el.nodeName.toLowerCase()}${cls}${wid ? ` data-wid="${wid}"` : ""}>`
  }
  return node.nodeName
}
