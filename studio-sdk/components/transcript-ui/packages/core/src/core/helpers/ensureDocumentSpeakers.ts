import type { EditorDocument } from "../../types/editor"

interface SpeakerRef {
  id: string
  name: string
  defined?: boolean
}

export function ensureDocumentSpeakers(doc: EditorDocument): SpeakerRef[] {
  const seen = new Set<string>()
  const refs: SpeakerRef[] = []

  for (const [id, speaker] of doc.speakers) {
    seen.add(id)
    refs.push({ id, name: speaker.name, defined: speaker.defined })
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
