const debug = require("debug")("linto:components:EditorHandler:onUndo")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { computeEditorRoomName } = require("../utils/computeEditorRoomName")
const { isUndoable, applyBackward } = require("../utils/applySpeakerRevision")

/**
 * Undo(revisionId): rewind the track's undo cursor by one step and re-apply
 * that revision's `before`. Does NOT append a new revision — undo/redo only
 * move the cursor along the existing chain (see editorRevisions.js); onRedo
 * is the symmetric forward move.
 */
async function onUndo({ io, socket }, payload, ack) {
  const reply = typeof ack === "function" ? ack : () => {}
  try {
    const { translationId, revisionId } = payload || {}
    if (typeof revisionId !== "string" || !revisionId) {
      return reply({ ok: false, reason: "invalid_payload" })
    }
    const parentId = socket.data.editorParentId

    let objectRevisionId
    try {
      objectRevisionId = model.editorRevisions.getObjectId(revisionId)
    } catch {
      return reply({ ok: false, reason: "invalid_payload" })
    }

    const revision = await model.editorRevisions.findById(objectRevisionId)
    if (!revision || revision.translationId !== translationId) {
      return reply({ ok: false, reason: "unknown_revision" })
    }
    if (!isUndoable(revision.type)) {
      // Defensive: a revision type this handler doesn't know how to undo
      // (future turn-edit revisions land here once that scope grows).
      return reply({ ok: false, reason: "not_undoable" })
    }

    // The gate: only proceeds if this IS still the track's undo cursor. A
    // concurrent undo/redo, or ANY mutation written since (which would
    // already have moved the cursor), makes this fail cleanly — see
    // conversationEditor.swapConversationUndoHead for why the cursor is the
    // single serialization point every speaker mutation goes through.
    const swapped = await model.conversationEditor.swapConversationUndoHead(
      translationId,
      objectRevisionId,
      revision.previousHead,
    )
    if (!swapped) {
      return reply({ ok: false, reason: "not_last_revision" })
    }

    // Past the swap, the data is guaranteed to be exactly as `revision` left
    // it (nothing else could have touched it without moving the cursor
    // first) — the restore below is deterministic, not racing anything.
    const applied = await applyBackward(translationId, revision)
    if (!applied) {
      // The cursor already moved back; the restore itself failing here is a
      // genuine DB-level inconsistency (not a stale/race case) — logged for
      // manual follow-up, same class of residual risk as any two-write
      // non-transactional sequence elsewhere in this codebase.
      debug(
        `undo restore failed after the cursor moved (revision=${revisionId}, type=${revision.type})`,
      )
      return reply({ ok: false, reason: "error" })
    }

    debug(`revision=${revisionId} type=${revision.type} undone`)
    io.to(computeEditorRoomName(parentId)).emit(applied.event, {
      translationId,
      ...applied.payload,
      version: applied.version,
      revisionId: revision.previousHead,
    })
    reply({ ok: true, version: applied.version, revisionId: revision.previousHead })
  } catch (err) {
    debug(`undo failed: ${err.message}`)
    reply({ ok: false, reason: "error" })
  }
}

module.exports = { onUndo }
