const Y = require("yjs")

// Distinct fixed client id from seedYDoc (separate client/clock space).
const SEED_CLIENT_ID = 1

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
