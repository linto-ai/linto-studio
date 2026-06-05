const Y = require("yjs")

// Distinct fixed client id from seedYDoc so the two seed updates don't share a
// (client, clock) space when applied to the same document. See seedYDoc for why
// deterministic seeding keeps concurrent multi-replica loads idempotent.
const SEED_CLIENT_ID = 1

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

  const seedDoc = new Y.Doc()
  seedDoc.clientID = SEED_CLIENT_ID
  const seedMap = seedDoc.getMap("speakers")
  seedDoc.transact(() => {
    for (const s of mongoSpeakers) {
      if (!s.speaker_id) continue
      seedMap.set(s.speaker_id, { name: s.speaker_name ?? "" })
    }
  })
  Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(seedDoc))
}

module.exports = { seedSpeakers }
