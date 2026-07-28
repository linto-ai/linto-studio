const debug = require("debug")(
  "linto:components:EditorHandler:onReplaceSpeaker",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// Reassign every turn of a speaker to another (speaker merge). The replaced
// speaker disappears by construction — its removal is implied by the
// broadcast, no separate event. No lock (atomic, LWW) — decorated
// requireWrite.
async function onReplaceSpeaker({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, fromSpeakerId, toSpeakerId } = payload || {}
    // typeof: a non-string id would reach the pipeline as an expression and
    // be stored as the turns' speaker_id, dropping the replaced speaker.
    if (
      typeof fromSpeakerId !== "string" ||
      typeof toSpeakerId !== "string" ||
      !fromSpeakerId ||
      !toSpeakerId ||
      fromSpeakerId === toSpeakerId
    ) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    const updated = await model.conversations.replaceEditorSpeaker(
      translationId,
      fromSpeakerId,
      toSpeakerId,
    )
    if (!updated) {
      return reply({ ok: false, reason: "unknown_speaker" })
    }

    debug(
      `speaker=${fromSpeakerId} replaced by ${toSpeakerId} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:speaker_replaced", {
      translationId,
      fromSpeakerId,
      toSpeakerId,
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`replace speaker failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onReplaceSpeaker }
