const debug = require("debug")("linto:components:EditorHandler:onUpdateTurn")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeRetimedTurn } = require("../utils/computeRetimedTurn")
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { toWireWords } = require("../utils/toWireWords")

/**
 * Save an edited turn: retime, atomic persist + version bump, broadcast.
 * The ms between requireLock's check and the write are an accepted race.
 */
async function onUpdateTurn({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, turnId, text } = payload || {}
    if (typeof text !== "string") {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    // Same whitespace contract as the client and the tokenizer: single
    // spaces, no leading/trailing runs.
    const normalized = text.replace(/\s+/g, " ").trim()

    const conversations = await model.conversations.getById(translationId, [
      "text",
    ])
    if (!conversations || conversations.length !== 1) {
      return reply({ ok: false, reason: "conflict" })
    }
    const oldTurn = (conversations[0].text || []).find(
      (t) => t.turn_id === turnId,
    )
    if (!oldTurn) {
      return reply({ ok: false, reason: "conflict" })
    }

    const retimed = computeRetimedTurn(oldTurn, normalized)
    const updated = await model.conversationEditor.updateEditorTurn(
      translationId,
      turnId,
      retimed,
    )
    if (!updated) {
      return reply({ ok: false, reason: "conflict" })
    }

    debug(
      `saved turn=${turnId} translation=${translationId} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:turn_updated", {
      translationId,
      turnId,
      text: normalized,
      words: toWireWords(retimed.words),
      stime: retimed.stime,
      etime: retimed.etime,
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`save failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onUpdateTurn }
