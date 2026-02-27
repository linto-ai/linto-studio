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
    return Math.max(0, (new Date(astart).getTime() - sessionStartMs) / 1000 + offset)
  }

  const channels = session.channels.map((channel) => {
    const originalTurns = (channel.closedCaptions ?? [])
      .filter((c) => c.segmentId != null)
      .map((c) => ({
        id: String(c.segmentId),
        text: c.text ?? null,
        words: [],
        speakerId: c.locutor ?? null,
        startTime: toSessionTime(c.astart, c.start),
        endTime: toSessionTime(c.astart, c.end),
        language: c.lang ?? channel.languages[0] ?? "*",
      }))

    const translations = {}
    for (const translationTarget of (channel.translations ?? [])) {
      translations[translationTarget.target] = {
        id: translationTarget.target,
        languages: [translationTarget.target],
        isSource: false,
        turns: [],
      }
    }

    for (const translationCaption of (channel.translatedCaptions ?? [])) {
      if (!translations[translationCaption.targetLang]) {
        translations[translationCaption.targetLang] = {
          id: translationCaption.targetLang,
          languages: [translationCaption.targetLang],
          isSource: false,
          turns: [],
        }
      }
      translations[translationCaption.targetLang].turns.push({
        id: String(translationCaption.segmentId),
        startTime: toSessionTime(translationCaption.astart, translationCaption.start),
        endTime: toSessionTime(translationCaption.astart, translationCaption.end),
        language: translationCaption.targetLang,
        text: translationCaption.text ?? null,
        words: [],
        speakerId: translationCaption.locutor ?? null,
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
          turns: originalTurns,
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
