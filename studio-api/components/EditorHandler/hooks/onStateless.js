const debug = require("debug")("linto:components:EditorHandler:onStateless")

const { buildWordsPayload } = require("../utils/buildWordsPayload")

// Initial words+timestamps are sent in chunks of this many turns, not one frame.
const TIMESTAMPS_CHUNK_TURNS = 50

// Send timestamps in several smaller stateless messages, yielding between
// chunks so a large transcript doesn't block the loop or send one huge frame.
async function sendTimestampsChunked(connection, documentName, turnsWithWords) {
  const size = TIMESTAMPS_CHUNK_TURNS
  const total = turnsWithWords.length
  for (let i = 0; i < total; i += size) {
    const chunk = turnsWithWords.slice(i, i + size)
    connection.sendStateless(
      JSON.stringify({
        type: "timestamps_recalc",
        turns: chunk,
      }),
    )
    if (i + size < total) {
      await new Promise((resolve) => setImmediate(resolve))
    }
  }
  debug(
    `Seeded words for doc=${documentName}: ${total} turns in ${Math.ceil(
      total / size,
    )} chunk(s)`,
  )
}

async function onStateless({ payload, documentName, document, connection }) {
  // The Y.Doc carries segments only — words+timestamps are delivered through
  // stateless messages, on client request. The client asks once its store is
  // hydrated from the Y.Doc sync (pushing at connect raced that hydration:
  // a payload arriving first was dropped, turn ids not found in the store).
  if (!connection) return

  let msg
  try {
    msg = JSON.parse(payload)
  } catch (err) {
    return
  }
  if (!msg || msg.type !== "request_words") return

  try {
    // Served from the live WordsState: this replica opened the doc, so its
    // state is hydrated and current (fresher than Mongo between flushes).
    const wordsState = document?.lintoWords
    if (!wordsState) return
    const turnsWithWords = buildWordsPayload(wordsState.serialize())
    if (turnsWithWords.length === 0) return

    await sendTimestampsChunked(connection, documentName, turnsWithWords)
  } catch (err) {
    debug(`request_words failed for doc=${documentName}: ${err.message}`)
  }
}

module.exports = { onStateless, TIMESTAMPS_CHUNK_TURNS }
