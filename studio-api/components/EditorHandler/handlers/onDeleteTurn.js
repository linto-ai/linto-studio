const debug = require("debug")("linto:components:EditorHandler:onDeleteTurn")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

/**
 * Remove a turn (triggered by committing an emptied text); the track's last
 * turn is never deleted.
 */
async function onDeleteTurn({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, turnId } = payload || {}
    const parentId = socket.data.editorParentId

    const conversations = await model.conversations.getById(translationId, [
      "text",
    ])
    if (!conversations || conversations.length !== 1) {
      return reply({ ok: false, reason: "conflict" })
    }
    const turns = conversations[0].text || []
    const turn = turns.find((t) => t.turn_id === turnId)
    if (!turn) {
      return reply({ ok: false, reason: "conflict" })
    }
    if (turns.length <= 1) {
      return reply({ ok: false, reason: "last_turn" })
    }

    // GC prediction for the broadcast: the turn's speaker disappears when
    // this was its last assignment.
    const speakerId = turn.speaker_id
    const removedSpeakerId =
      speakerId &&
      !turns.some((t) => t.turn_id !== turnId && t.speaker_id === speakerId)
        ? speakerId
        : undefined

    const updated = await model.conversationEditor.deleteEditorTurn(
      translationId,
      turnId,
    )
    if (!updated) {
      return reply({ ok: false, reason: "conflict" })
    }

    debug(
      `deleted turn=${turnId} removed=${removedSpeakerId ?? "-"} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:turn_deleted", {
      translationId,
      turnId,
      ...(removedSpeakerId && { removedSpeakerId }),
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`delete failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onDeleteTurn }
