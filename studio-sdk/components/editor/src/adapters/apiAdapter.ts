import type { ApiDocument, ApiWord } from '../types/api'
import type { EditorDocument, Speaker, Turn, Word } from '../types/editor'

function mapWord(w: ApiWord): Word {
  return {
    id: w.wid,
    text: w.word,
    ...(w.stime !== undefined && { startTime: w.stime }),
    ...(w.etime !== undefined && { endTime: w.etime }),
    ...(w.confidence !== undefined && { confidence: w.confidence }),
  }
}

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
    const words = t.words.map(mapWord)
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
