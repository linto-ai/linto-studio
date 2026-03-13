import type { EditorDocument } from "../../types/editor"

export function ensureDocumentSpeakers(
  doc: EditorDocument,
): { id: string; name: string }[] {
  const refs: { id: string; name: string }[] = []

  for (const [id, speaker] of doc.speakers) {
    refs.push({ id, name: speaker.name })
  }

  for (const channel of doc.channels) {
    for (const translation of channel.translations) {
      for (const turn of translation.turns) {
        if (turn.speakerId) {
          refs.push({ id: turn.speakerId, name: turn.speakerId })
        }
      }
    }
  }

  return refs
}
