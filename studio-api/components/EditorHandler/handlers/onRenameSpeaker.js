const debug = require("debug")("linto:components:EditorHandler:onRenameSpeaker")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { recordSpeakerRevision } = require("../utils/recordSpeakerRevision")

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

    const revisionId = await recordSpeakerRevision({
      translationId,
      parentId,
      type: "rename_speaker",
      before: { speakerId, name: updated.previousName },
      after: { speakerId, name },
      previousHead: updated.undoHead,
      author: socket.data.editorUser,
    })

    debug(`speaker=${speakerId} renamed version=${updated.version}`)
    io.to(computeEditorRoomName(parentId)).emit("editor:speaker_renamed", {
      translationId,
      speakerId,
      name,
      version: updated.version,
      revisionId,
    })
    reply({ ok: true, version: updated.version, revisionId })
  } catch (err) {
    debug(`rename speaker failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onRenameSpeaker }
