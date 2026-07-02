import type { EditorState, Transaction } from "@tiptap/pm/state"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"

// Above this many operations means a bulk paste/seed; still fixable, but guard
// against pathological single-transaction cost on a huge document.
const MAX_MARK_OPS = 5000

type MarkOp =
  | { kind: "mark"; from: number; to: number; wid: string }
  | { kind: "clear"; from: number; to: number }

/**
 * Enforce the word-identity invariant on every local change (mirrors
 * fixTurnIds): **one `word` mark = one whitespace-delimited token = one unique
 * wid**, whitespace unmarked. A single symmetric rule repairs every case:
 *
 * For each whitespace-delimited token, its wid is the wid of its first marked
 * character — UNLESS that wid was already claimed by an earlier token in the
 * same turn (or the char is unmarked), in which case a fresh wid is minted.
 *
 *  - typed/pasted text (unmarked)      → fresh wid per token
 *  - a mark grown across a space (split: "le genre" both w1) → "le" keeps w1,
 *    "genre" sees w1 already used → fresh wid
 *  - two words glued by deleting the space (merge: "legenre" = w1·w2) → one
 *    token, first char is w1 → whole token becomes w1, w2 dropped
 *  - a plain in-word edit → token stays uniform, no change
 *
 * Only the turns overlapping the range changed by `transactions` are scanned
 * (with a selection-turn fallback for mark-only re-runs), so cost is
 * proportional to the edit, not to the transcript length. Returns a
 * history-less transaction, or null when nothing needs repair.
 */
export function fixWordMarks(
  state: EditorState,
  transactions: readonly Transaction[],
): Transaction | null {
  const wordMarkType = state.schema.marks.word
  if (!wordMarkType) return null

  // Union of the ranges these transactions changed, in the NEW doc's coords.
  let from = Infinity
  let to = -Infinity
  for (const tr of transactions) {
    for (const map of tr.mapping.maps) {
      map.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
        if (newStart < from) from = newStart
        if (newEnd > to) to = newEnd
      })
    }
  }

  if (to < from) {
    // Mark/attr-only transactions (e.g. a re-run after fixTurnIds) carry no
    // positional range. Fall back to the turn holding the cursor so a repair
    // still happens — still scoped to one turn, never the whole doc.
    const $from = state.selection.$from
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === "turn") {
        from = $from.before(d)
        to = $from.after(d)
        break
      }
    }
    if (to < from) return null
  }

  from = Math.max(0, from)
  to = Math.min(state.doc.content.size, to)

  // Collect the turns overlapping the changed range (don't descend into them —
  // each is processed whole below so cross-node merges are visible).
  const turns: Array<{ node: ProseMirrorNode; pos: number }> = []
  state.doc.nodesBetween(from, to, (node: ProseMirrorNode, pos: number) => {
    if (node.type.name === "turn") {
      turns.push({ node, pos })
      return false
    }
    return true
  })

  const ops: MarkOp[] = []
  // Claimed wids span ALL scanned turns, so a wid duplicated across turns (e.g.
  // pasting a marked word into a neighbouring turn) is re-minted rather than
  // kept twice.
  const assigned = new Set<string>()

  for (const { node: turn, pos: turnPos } of turns) {
    const contentStart = turnPos + 1
    const text = turn.textContent
    if (!text) continue

    // Word wid carried by each character (null = unmarked). Inline text in a
    // turn occupies contiguous positions, so char offset i sits at
    // contentStart + i.
    const charWid: Array<string | null> = new Array(text.length).fill(null)
    let off = 0
    turn.forEach((child: ProseMirrorNode) => {
      if (child.isText) {
        const wm = child.marks.find((m) => m.type === wordMarkType)
        const wid = wm ? (wm.attrs.wid as string) : null
        const len = child.text ? child.text.length : 0
        for (let k = 0; k < len; k++) charWid[off + k] = wid
        off += len
      } else {
        off += child.nodeSize
      }
    })

    let cursor = 0
    const re = /\S+/g
    let m: RegExpExecArray | null
    while ((m = re.exec(text)) !== null) {
      const s = m.index
      const e = m.index + m[0].length

      // Whitespace gap before this token → unmark if it still carries a wid.
      if (s > cursor && rangeHasWid(charWid, cursor, s)) {
        ops.push({ kind: "clear", from: contentStart + cursor, to: contentStart + s })
      }
      cursor = e

      const firstWid = charWid[s]
      const chosen =
        firstWid && !assigned.has(firstWid) ? firstWid : crypto.randomUUID()
      assigned.add(chosen)

      if (!rangeUniform(charWid, s, e, chosen)) {
        ops.push({ kind: "mark", from: contentStart + s, to: contentStart + e, wid: chosen })
      }
    }

    if (cursor < text.length && rangeHasWid(charWid, cursor, text.length)) {
      ops.push({ kind: "clear", from: contentStart + cursor, to: contentStart + text.length })
    }
  }

  if (ops.length === 0) return null
  if (ops.length > MAX_MARK_OPS) {
    console.warn(
      `[storeSync] ${ops.length} word-mark repairs — skipping inline fix (likely bulk load)`,
    )
    return null
  }

  // Marks don't change doc length, so positions stay valid without remapping.
  const tr = state.tr
  for (const op of ops) {
    if (op.kind === "mark") {
      tr.addMark(op.from, op.to, wordMarkType.create({ wid: op.wid }))
    } else {
      tr.removeMark(op.from, op.to, wordMarkType)
    }
  }
  // Out-of-history: keeping the repair in the Yjs undo stack made redo→undo
  // leave an orphaned split fragment (the edit + repair are two transactions
  // grouped fragilely). Until the repair is made atomic with the triggering
  // keystroke, keep it out of history (wid-structural edits are then not
  // individually undoable, but nothing corrupts).
  tr.setMeta("addToHistory", false)
  return tr
}

function rangeHasWid(charWid: Array<string | null>, a: number, b: number): boolean {
  for (let i = a; i < b; i++) if (charWid[i]) return true
  return false
}

function rangeUniform(
  charWid: Array<string | null>,
  a: number,
  b: number,
  wid: string,
): boolean {
  for (let i = a; i < b; i++) if (charWid[i] !== wid) return false
  return true
}
