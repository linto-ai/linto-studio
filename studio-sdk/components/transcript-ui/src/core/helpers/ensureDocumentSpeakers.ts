import type { EditorDocument } from "../../types/editor"

export function ensureDocumentSpeakers(
  doc: EditorDocument,
): { id: string; name: string }[] {
  const seen = new Set<string>()
  const refs: { id: string; name: string }[] = []

  for (const [id, speaker] of doc.speakers) {
    seen.add(id)
    refs.push({ id, name: speaker.name })
  }

  for (const channel of doc.channels) {
    for (const translation of channel.translations) {
      for (const turn of translation.turns) {
        if (turn.speakerId && !seen.has(turn.speakerId)) {
          seen.add(turn.speakerId)
          refs.push({ id: turn.speakerId, name: turn.speakerId })
        }
      }
    }
  }

  return refs
}
