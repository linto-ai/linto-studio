import processSessionCaptions from "./processSessionCaptions.js"
import computeSessionTurnUniqueId from "../const/computeSessionTurnUniqueId.js"

/**
 * Converts a live session object into an EditorDocument.
 *
 * @param {object} session - The live session from the API
 * @returns {{ title: string, description?: string, speakers: Map, channels: Array }}
 */
export default function sessionToEditorDocument(session) {
  const sessionStartMs = new Date(session.startTime).getTime()

  function toSessionTime(astart, offset) {
    if (!astart) return offset
    return Math.max(
      0,
      (new Date(astart).getTime() - sessionStartMs) / 1000 + offset,
    )
  }

  const channels = session.channels.map((channel) => {
    const events = processSessionCaptions({
      closedCaptions: channel.closedCaptions,
      translatedCaptions: channel.translatedCaptions,
      sessionStartMs,
      diarization: channel.diarization,
      defaultLanguage: channel.languages[0] ?? "*",
    })

    const sourceTurns = events.map((e) => ({
      id: e.turnId,
      text: e.text,
      words: e.words,
      speakerId: e.speakerId,
      startTime: e.startTime,
      endTime: e.endTime,
      language: e.language,
    }))

    // Build translation buckets from declared targets
    const translations = {}
    for (const translationTarget of channel.translations ?? []) {
      translations[translationTarget.target] = {
        id: translationTarget.target,
        languages: [translationTarget.target],
        isSource: false,
        turns: [],
      }
    }

    // Populate from translatedCaptions directly (preserves own timing + handles orphans)
    for (const tc of channel.translatedCaptions ?? []) {
      if (!translations[tc.targetLang]) {
        translations[tc.targetLang] = {
          id: tc.targetLang,
          languages: [tc.targetLang],
          isSource: false,
          turns: [],
        }
      }
      translations[tc.targetLang].turns.push({
        id: computeSessionTurnUniqueId(tc),
        text: tc.text ?? null,
        words: [],
        speakerId: tc.locutor ?? null,
        startTime: toSessionTime(tc.astart, tc.start),
        endTime: toSessionTime(tc.astart, tc.end),
        language: tc.targetLang,
      })
    }

    return {
      id: String(channel.id),
      name: channel.name ?? "",
      duration: 0,
      translations: [
        ...Object.values(translations),
        {
          id: "source",
          turns: sourceTurns,
          languages: channel.languages,
          isSource: true,
        },
      ],
    }
  })

  return {
    title: session.name ?? "",
    speakers: new Map(),
    channels,
  }
}
