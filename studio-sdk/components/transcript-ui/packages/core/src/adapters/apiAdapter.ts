import type { ApiDocument } from '../types/api'
import type { EditorDocument, Speaker } from '../types/editor'
import { mapApiTurns } from './mapApiTurns'

export function mapApiDocument(raw: ApiDocument): EditorDocument {
  const speakers = new Map<string, Speaker>()

  for (const s of raw.speakers) {
    speakers.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: '',
    })
  }

  const turns = mapApiTurns(raw.text)

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
