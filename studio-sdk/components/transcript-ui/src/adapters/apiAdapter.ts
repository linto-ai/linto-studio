import type { ApiDocument } from '../types/api'
import type { EditorDocument, Speaker, Turn } from '../types/editor'
import { wordsFromApi } from '../utils/turnWords'

export function mapApiDocument(raw: ApiDocument): EditorDocument {
  const speakers = new Map<string, Speaker>()

  for (const s of raw.speakers) {
    speakers.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: '',
    })
  }

  const turns: Turn[] = raw.text.map((t) => {
    // Positional identity + local offsets (single-space layout matching the
    // doc seed); the wire wid is ignored by the editor.
    const words = wordsFromApi(t.turn_id, t.words)
    const startTime = words[0]?.startTime ?? t.stime
    const endTime = words.length > 0
      ? (words[words.length - 1]!.endTime ?? t.etime)
      : t.etime

    return {
      id: t.turn_id,
      speakerId: t.speaker_id || null,
      text: words.length > 0 ? null : t.segment,
      words,
      ...(startTime !== undefined && { startTime }),
      ...(endTime !== undefined && { endTime }),
      language: t.language,
    }
  })

  const sourceLanguage = raw.metadata.transcription.lang ?? raw.text[0]?.language ?? 'fr'

  return {
    title: raw.name,
    description: raw.description,
    speakers,
    channels: [
      {
        id: 'default',
        name: 'Canal 1',
        duration: raw.metadata.audio.duration,
        translations: [
          {
            id: 'source',
            languages: [sourceLanguage],
            isSource: true,
            audio: {
              src: raw.metadata.audio.filepath,
              filename: raw.metadata.audio.filename,
            },
            turns,
          },
        ],
      },
    ],
  }
}
