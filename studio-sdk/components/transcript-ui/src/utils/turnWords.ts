import { tokenize } from "./tokenize"
import type { Word } from "../types/editor"
import type { ApiWord } from "../types/api"

/**
 * Word identity is positional now that the document is plain text: a word IS
 * the i-th whitespace-delimited token of its turn. Word.id is derived
 * (`turnId#index`) — an opaque, recomputable key for consumers (karaoke,
 * follow-playback), never persisted and never on the wire.
 */
export function wordId(turnId: string, index: number): string {
  return `${turnId}#${index}`
}

export function parseWordId(
  id: string,
): { turnId: string; index: number } | null {
  const sep = id.lastIndexOf("#")
  if (sep <= 0) return null
  const index = Number(id.slice(sep + 1))
  if (!Number.isInteger(index) || index < 0) return null
  return { turnId: id.slice(0, sep), index }
}

/** Derive the word list from a turn's plain text (no timestamps — those are
 *  carried over or broadcast by the server). */
export function wordsFromText(turnId: string, text: string): Word[] {
  return tokenize(text).map((t, i) => ({
    id: wordId(turnId, i),
    text: t.text,
    charStart: t.charStart,
    charEnd: t.charEnd,
  }))
}

export interface TimedText {
  text: string
  startTime?: number
  endTime?: number
  confidence?: number
}

/**
 * Lay timed source words out as store Words matching the doc text EXACTLY.
 * The seed (client and server turnsToDoc alike) joins tokens with single
 * spaces and collapses all whitespace — so a stored word carrying irregular
 * whitespace (NBSP, internal space: "l'enfant ?") is SPLIT into its tokens
 * here, each keeping the source word's timing. Without this, every offset
 * after such a word would be shifted from the rendered text at load.
 * Empty/whitespace-only source words (silence placeholders) yield nothing.
 */
export function layoutWords(turnId: string, source: TimedText[]): Word[] {
  const out: Word[] = []
  let cursor = 0
  for (const src of source) {
    for (const part of (src.text ?? "").split(/\s+/)) {
      if (!part) continue
      const charStart = cursor
      const charEnd = charStart + part.length
      cursor = charEnd + 1
      out.push({
        id: wordId(turnId, out.length),
        text: part,
        charStart,
        charEnd,
        ...(src.startTime !== undefined && { startTime: src.startTime }),
        ...(src.endTime !== undefined && { endTime: src.endTime }),
        ...(src.confidence !== undefined && { confidence: src.confidence }),
      })
    }
  }
  return out
}

/** Build the word list from an API turn payload (see layoutWords). */
export function wordsFromApi(turnId: string, apiWords: ApiWord[]): Word[] {
  return layoutWords(
    turnId,
    apiWords.map((w) => ({
      text: w.word ?? "",
      ...(w.stime !== undefined && { startTime: w.stime }),
      ...(w.etime !== undefined && { endTime: w.etime }),
      ...(w.confidence !== undefined && { confidence: w.confidence }),
    })),
  )
}

/**
 * Carry timestamps from the previous word list onto freshly derived tokens by
 * anchoring on the common prefix and suffix (token text equality). The edited
 * middle stays untimed until the server broadcasts recomputed timings (it
 * re-flushes after every edit, so the gap lasts about a debounce). Cheap,
 * deterministic, and wrong only transiently — by design.
 */
export function carryWordTimes(next: Word[], prev: Word[]): Word[] {
  const max = Math.min(next.length, prev.length)
  let prefix = 0
  while (prefix < max && next[prefix]!.text === prev[prefix]!.text) prefix++
  let suffix = 0
  while (
    suffix < max - prefix &&
    next[next.length - 1 - suffix]!.text === prev[prev.length - 1 - suffix]!.text
  ) {
    suffix++
  }

  return next.map((w, i) => {
    const from =
      i < prefix
        ? prev[i]
        : i >= next.length - suffix
          ? prev[prev.length - (next.length - i)]
          : undefined
    if (!from) return w
    return {
      ...w,
      ...(from.startTime !== undefined && { startTime: from.startTime }),
      ...(from.endTime !== undefined && { endTime: from.endTime }),
      ...(from.confidence !== undefined && { confidence: from.confidence }),
    }
  })
}
