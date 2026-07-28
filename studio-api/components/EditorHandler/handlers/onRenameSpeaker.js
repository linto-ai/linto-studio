const debug = require("debug")("linto:components:EditorHandler:onRenameSpeaker")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")

// No lock (atomic, last-write-wins); WRITE comes from requireWrite.
async function onRenameSpeaker({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, speakerId } = payload || {}
    const name = (payload?.name ?? "").trim()
    // typeof: a non-string id would reach the query filter as an operator
    // object ({$gt: ""} renames whatever speaker comes first).
    if (typeof speakerId !== "string" || !speakerId || !name) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    const updated = await model.conversationEditor.renameEditorSpeaker(
      translationId,
      speakerId,
      name,
    )
    if (!updated) {
      return reply({ ok: false, reason: "unknown_speaker" })
    }

    debug(`speaker=${speakerId} renamed version=${updated.version}`)
    io.to(computeEditorRoomName(parentId)).emit("editor:speaker_renamed", {
      translationId,
      speakerId,
      name,
      version: updated.version,
    })
    reply({ ok: true, version: updated.version })
  } catch (err) {
    debug(`rename speaker failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onRenameSpeaker }
