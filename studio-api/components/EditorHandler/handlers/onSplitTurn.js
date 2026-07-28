const debug = require("debug")("linto:components:EditorHandler:onSplitTurn")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeSplitTurns } = require("../utils/computeSplitTurns")
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { toWireTurn } = require("../utils/toWireTurn")

/**
 * Split a turn at a character offset of its saved text (the client sequences
 * save THEN split, so the offset targets the state both sides agree on).
 * Deterministic — no retime; the split itself is computeSplitTurns.
 * Lock ownership is enforced by the requireLock decorator.
 */
async function onSplitTurn({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, turnId, offset } = payload || {}
    if (typeof offset !== "number") {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

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

    const split = computeSplitTurns(oldTurn, offset)
    if (!split) {
      return reply({ ok: false, reason: "invalid_offset" })
    }

    const updated = await model.conversations.splitEditorTurn(
      translationId,
      turnId,
      split.left,
      split.right,
    )
    if (!updated) {
      return reply({ ok: false, reason: "conflict" })
    }

    debug(
      `split turn=${turnId} at offset=${offset} → ${split.right.turn_id} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:turn_split", {
      translationId,
      originalTurnId: turnId,
      turns: [toWireTurn(split.left), toWireTurn(split.right)],
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`split failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onSplitTurn }
