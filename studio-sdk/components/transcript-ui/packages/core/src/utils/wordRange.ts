import type { Core } from "../core/types"
import type { Turn } from "../types/editor"
import { parseWordId } from "./turnWords"

/**
 * Locate a word in the rendered DOM as a character Range — the shared anchor
 * for the karaoke highlight (CSS Custom Highlight API) and follow-playback
 * scrolling. Nothing is ever inserted into the content: a Range is a
 * read-only view over the existing text nodes.
 */

/** Resolve the active word id (`turnId#index`) into a DOM Range under `root`
 *  (the editor DOM or any container holding the rendered turns). */
export function activeWordRange(
  root: ParentNode,
  core: Core,
  wordId: string,
): Range | null {
  const parsed = parseWordId(wordId)
  if (!parsed) return null
  const translation = core.activeChannel.value?.activeTranslation.value
  const turn = translation?.turns.value.find((t) => t.id === parsed.turnId)
  if (!turn) return null
  return findWordRange(root, turn, parsed.index)
}

export function findWordRange(
  root: ParentNode,
  turn: Turn,
  index: number,
): Range | null {
  const word = turn.words[index]
  if (!word || word.charStart == null || word.charEnd == null) return null

  const container = root.querySelector(
    `[data-turn-id="${cssEscape(turn.id)}"] .turn-text`,
  )
  if (!container) return null

  // Map the char offsets onto the container's text nodes. The store offsets
  // come from tokenizing the same text PM renders, so a full walk always
  // lands — unless an edit is mid-flight, in which case bail (null).
  const range = document.createRange()
  let offset = 0
  let startSet = false
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const len = node.nodeValue?.length ?? 0
    if (!startSet && word.charStart < offset + len) {
      range.setStart(node, word.charStart - offset)
      startSet = true
    }
    if (word.charEnd <= offset + len) {
      if (!startSet) return null
      range.setEnd(node, word.charEnd - offset)
      return range
    }
    offset += len
  }
  return null
}

function cssEscape(value: string): string {
  return typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(value)
    : value.replace(/["\\]/g, "\\$&")
}
