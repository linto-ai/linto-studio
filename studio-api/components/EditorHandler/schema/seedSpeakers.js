/**
 * Seed a Y.Doc's "speakers" Y.Map from MongoDB conversation.speakers[].
 * Skips if the Y.Map already has content (e.g., restored from Redis).
 *
 * @param {import("yjs").Doc} ydoc
 * @param {Array<{speaker_id: string, speaker_name: string}>} mongoSpeakers
 */
function seedSpeakers(ydoc, mongoSpeakers) {
  const yMap = ydoc.getMap("speakers")
  if (yMap.size > 0) return
  if (!mongoSpeakers || mongoSpeakers.length === 0) return

  ydoc.transact(() => {
    for (const s of mongoSpeakers) {
      if (!s.speaker_id) continue
      yMap.set(s.speaker_id, { name: s.speaker_name ?? "" })
    }
  })
}

module.exports = { seedSpeakers }
