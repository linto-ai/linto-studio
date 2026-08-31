const debug = require("debug")("linto:components:EditorHandler:onRedo")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { isUndoable, applyForward } = require("../utils/applySpeakerRevision")

/**
 * Redo(revisionId): advance the track's undo cursor by one step and re-apply
 * the next revision's `after`. Symmetric to onUndo — same cursor, same
 * "does not append" rule; see editorRevisions.js for the fork/tie-break
 * that keeps this safe once a real new mutation has been made mid-history.
 *
 * revisionId here is the CURRENT cursor position (what the client would
 * send to undo further), not a target to redo TO — the target is looked up
 * from it. It may be `null`: that's the legitimate case of the cursor
 * sitting at the very start of history (everything has been undone).
 */
async function onRedo({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId } = payload || {}
    const revisionId = payload?.revisionId ?? null
    if (revisionId !== null && (typeof revisionId !== "string" || !revisionId)) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    let currentHead
    try {
      currentHead =
        revisionId === null ? null : model.editorRevisions.getObjectId(revisionId)
    } catch {
      return reply({ ok: false, reason: "invalid_payload" })
    }

    const revision = await model.editorRevisions.findByPreviousHead(
      translationId,
      currentHead,
    )
    if (!revision) {
      return reply({ ok: false, reason: "nothing_to_redo" })
    }
    if (!isUndoable(revision.type)) {
      // Defensive: same reasoning as onUndo.js.
      return reply({ ok: false, reason: "not_undoable" })
    }

    // Same gate as onUndo: only proceeds if the cursor is still exactly
    // where the client believes it is.
    const swapped = await model.conversationEditor.swapConversationUndoHead(
      translationId,
      currentHead,
      revision._id,
    )
    if (!swapped) {
      return reply({ ok: false, reason: "not_last_revision" })
    }

    const applied = await applyForward(translationId, revision)
    if (!applied) {
      debug(
        `redo restore failed after the cursor moved (revision=${revision._id}, type=${revision.type})`,
      )
      return reply({ ok: false, reason: "error" })
    }

    debug(`revision=${revision._id} type=${revision.type} redone`)
    io.to(computeEditorRoomName(parentId)).emit(applied.event, {
      translationId,
      ...applied.payload,
      version: applied.version,
      revisionId: revision._id,
    })
    reply({ ok: true, version: applied.version, revisionId: revision._id })
  } catch (err) {
    debug(`redo failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onRedo }
