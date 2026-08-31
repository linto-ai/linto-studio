const debug = require("debug")(
  "linto:components:EditorHandler:onUpdateTurnSpeaker",
)
const { randomUUID } = require("crypto")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { recordSpeakerRevision } = require("../utils/recordSpeakerRevision")

/**
 * Point a turn at an existing speaker (speakerId) or create one (speakerName).
 * No lock; removedSpeakerId when the previous speaker lost its last assignment.
 */
async function onUpdateTurnSpeaker({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, turnId, speakerId } = payload || {}
    const speakerName = (payload?.speakerName ?? "").trim()
    // Exactly one of speakerId / speakerName.
    if (!turnId || !speakerId === !speakerName) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    const conversations = await model.conversations.getById(translationId, [
      "text",
      "speakers",
    ])
    if (!conversations || conversations.length !== 1) {
      return reply({ ok: false, reason: "conflict" })
    }
    const turns = conversations[0].text || []
    const oldTurn = turns.find((t) => t.turn_id === turnId)
    if (!oldTurn) {
      return reply({ ok: false, reason: "conflict" })
    }

    let speaker
    if (speakerId) {
      const existing = (conversations[0].speakers || []).find(
        (s) => s.speaker_id === speakerId,
      )
      if (!existing) {
        return reply({ ok: false, reason: "unknown_speaker" })
      }
      speaker = {
        speaker_id: existing.speaker_id,
        speaker_name: existing.speaker_name,
      }
    } else {
      speaker = { speaker_id: randomUUID(), speaker_name: speakerName }
    }

    // Already assigned: nothing to write, nothing to broadcast.
    if (oldTurn.speaker_id === speaker.speaker_id) {
      return reply({ ok: true })
    }

    // GC prediction for the broadcast: the previous speaker disappears when
    // this turn was its last assignment.
    const previous = oldTurn.speaker_id
    const removedSpeakerId =
      previous &&
      !turns.some((t) => t.turn_id !== turnId && t.speaker_id === previous)
        ? previous
        : undefined

    const updated = await model.conversationEditor.updateEditorTurnSpeaker(
      translationId,
      turnId,
      speaker,
    )
    if (!updated) {
      return reply({ ok: false, reason: "conflict" })
    }

    // No previous speaker on this turn (shouldn't happen — diarization
    // always assigns one — but there's nothing to undo back TO): skip
    // recording a revision, the mutation itself still applies and broadcasts.
    const revisionId = updated.previousSpeaker
      ? await recordSpeakerRevision({
          translationId,
          parentId,
          type: "update_turn_speaker",
          before: {
            turnId,
            speakerId: updated.previousSpeaker.speaker_id,
            speakerName: updated.previousSpeaker.speaker_name,
          },
          after: {
            turnId,
            speakerId: speaker.speaker_id,
            speakerName: speaker.speaker_name,
          },
          previousHead: updated.undoHead,
          author: socket.data.editorUser,
        })
      : null

    debug(
      `turn=${turnId} speaker=${speaker.speaker_id} removed=${removedSpeakerId ?? "-"} version=${updated.version}`,
    )
    io.to(computeEditorRoomName(parentId)).emit("editor:turn_speaker_updated", {
      translationId,
      turnId,
      speaker: { id: speaker.speaker_id, name: speaker.speaker_name },
      ...(removedSpeakerId && { removedSpeakerId }),
      version: updated.version,
      revisionId,
      // @see onRenameSpeaker.js
      redoRevisionId: null,
    })
    reply({ ok: true, version: updated.version, revisionId, redoRevisionId: null })
  } catch (err) {
    debug(`update turn speaker failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onUpdateTurnSpeaker }
