import type { ApiDocument } from '../types/api'
import type { EditorDocument, Speaker, Turn, Word } from '../types/editor'

const SPEAKER_COLORS = [
  '#D4736D',
  '#6A9FCA',
  '#6DAD72',
  '#D4A055',
  '#9B7BB8',
  '#5BA8A0',
  '#CC7E9B',
  '#9E8577',
  '#7E959E',
  '#C4A94D',
]

function mapWord(w: { wid: string; stime: number; etime: number; word: string; confidence: number }): Word {
  return {
    id: w.wid,
    text: w.word,
    startTime: w.stime,
    endTime: w.etime,
    confidence: w.confidence,
  }
}

export function mapApiDocument(raw: ApiDocument): EditorDocument {
  const speakers = new Map<string, Speaker>()

  for (let i = 0; i < raw.speakers.length; i++) {
    const s = raw.speakers[i]!
    speakers.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: SPEAKER_COLORS[i % SPEAKER_COLORS.length]!,
    })
  }

  const turns: Turn[] = raw.text.map((t) => {
    const words = t.words.map(mapWord)
    const startTime = words.length > 0 ? words[0]!.startTime : 0
    const endTime = words.length > 0 ? words[words.length - 1]!.endTime : 0

    return {
      id: t.turn_id,
      speakerId: t.speaker_id,
      text: t.segment,
      rawText: t.raw_segment,
      words,
      startTime,
      endTime,
      language: t.language,
    }
  })

  return {
    metadata: {
      title: raw.name,
      description: raw.description,
      duration: raw.metadata.audio.duration,
      audioFilename: raw.metadata.audio.filename,
      language: raw.text[0]?.language ?? 'fr',
    },
    speakers,
    turns,
  }
}
