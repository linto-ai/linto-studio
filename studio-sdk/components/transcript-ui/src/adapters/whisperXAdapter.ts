import type { WhisperXDocument, WhisperXWord } from '../types/whisperx'
import type { EditorDocument, Speaker, Turn, Word } from '../types/editor'

let wordCounter = 0

function mapWord(w: WhisperXWord): Word {
  return {
    id: `w_${wordCounter++}`,
    text: w.word,
    startTime: w.start,
    endTime: w.end,
    confidence: w.score,
  }
}

export function mapWhisperXDocument(raw: WhisperXDocument): EditorDocument {
  wordCounter = 0
  const speakers = new Map<string, Speaker>()

  // Collect unique speakers from segments
  for (const seg of raw.segments) {
    if (seg.speaker && !speakers.has(seg.speaker)) {
      speakers.set(seg.speaker, {
        id: seg.speaker,
        name: seg.speaker,
        color: '',
      })
    }
  }

  const language = raw.language ?? 'fr'

  const turns: Turn[] = raw.segments.map((seg, i) => {
    const words = seg.words.map(mapWord)

    return {
      id: `turn_${i}`,
      speakerId: seg.speaker ?? null,
      text: words.length > 0 ? null : seg.text,
      words,
      startTime: seg.start,
      endTime: seg.end,
      language,
    }
  })

  // Compute total duration from last segment
  const duration = raw.segments.length > 0
    ? raw.segments[raw.segments.length - 1]!.end
    : 0

  return {
    title: '',
    speakers,
    channels: [
      {
        id: 'default',
        name: 'Canal 1',
        duration,
        translations: [
          {
            id: 'source',
            languages: [language],
            isSource: true,
            turns,
          },
        ],
      },
    ],
  }
}
