const model = require(`${process.cwd()}/lib/mongodb/models`)

/**
 * Apply one speaker revision, in either direction — shared by onUndo
 * (applies `before`, going backward) and onRedo (applies `after`, going
 * forward). Both directions reuse the SAME underlying mutation methods and
 * broadcast shapes as a plain mutation, so the SDK's apply* handlers need no
 * undo/redo-specific code — they just see another broadcast.
 *
 * rename_speaker / update_turn_speaker are symmetric: `before` and `after`
 * are the same shape, so one function serves both directions (it just needs
 * to know which one is the TARGET and which is the ONE-BEING-LEFT, for the
 * removedSpeakerId hint). replace_speaker is NOT symmetric: its forward
 * broadcast (editor:speaker_replaced) means "fromSpeaker absorbed", which is
 * not what going backward does (it resurrects fromSpeaker and moves back
 * ONLY the turnIds this revision recorded) — so going backward broadcasts a
 * dedicated editor:speaker_restored event instead.
 */

async function applyRenameSpeaker(translationId, target) {
  const updated = await model.conversationEditor.renameEditorSpeaker(
    translationId,
    target.speakerId,
    target.name,
  )
  if (!updated) return null
  return {
    version: updated.version,
    event: "editor:speaker_renamed",
    payload: { speakerId: target.speakerId, name: target.name },
  }
}

/**
 * @param target the assignment to apply (revision.before going backward,
 *   revision.after going forward)
 * @param leftSpeakerId the OTHER side's speakerId — the one this turn is
 *   moving away from, for the removedSpeakerId hint. The DB pipeline already
 *   drops it from `speakers` when orphaned regardless; this just lets
 *   clients do the same locally without a full reload. Server-side this is
 *   only a hint (unlike onUpdateTurnSpeaker.js it isn't verified against
 *   other turns) — the client's own removeSpeakerIfUnused re-checks before
 *   actually dropping it, so an occasional false positive is harmless.
 */
async function applyUpdateTurnSpeaker(translationId, target, leftSpeakerId) {
  const updated = await model.conversationEditor.updateEditorTurnSpeaker(
    translationId,
    target.turnId,
    { speaker_id: target.speakerId, speaker_name: target.speakerName },
  )
  if (!updated) return null
  const removedSpeakerId =
    leftSpeakerId && leftSpeakerId !== target.speakerId ? leftSpeakerId : undefined
  return {
    version: updated.version,
    event: "editor:turn_speaker_updated",
    payload: {
      turnId: target.turnId,
      speaker: { id: target.speakerId, name: target.speakerName },
      ...(removedSpeakerId && { removedSpeakerId }),
    },
  }
}

const APPLY_BACKWARD = {
  rename_speaker: (translationId, revision) =>
    applyRenameSpeaker(translationId, revision.before),

  update_turn_speaker: (translationId, revision) =>
    applyUpdateTurnSpeaker(translationId, revision.before, revision.after.speakerId),

  async replace_speaker(translationId, revision) {
    const { fromSpeaker, toSpeakerId, turnIds } = revision.before
    const updated = await model.conversationEditor.restoreReplacedSpeaker(
      translationId,
      fromSpeaker,
      toSpeakerId,
      turnIds,
    )
    if (!updated) return null
    return {
      version: updated.version,
      event: "editor:speaker_restored",
      payload: { fromSpeaker, toSpeakerId, turnIds },
    }
  },
}

const APPLY_FORWARD = {
  rename_speaker: (translationId, revision) =>
    applyRenameSpeaker(translationId, revision.after),

  update_turn_speaker: (translationId, revision) =>
    applyUpdateTurnSpeaker(translationId, revision.after, revision.before.speakerId),

  async replace_speaker(translationId, revision) {
    const { fromSpeakerId, toSpeakerId } = revision.after
    const updated = await model.conversationEditor.replaceEditorSpeaker(
      translationId,
      fromSpeakerId,
      toSpeakerId,
    )
    if (!updated) return null
    return {
      version: updated.version,
      event: "editor:speaker_replaced",
      payload: { fromSpeakerId, toSpeakerId },
    }
  },
}

/** A revision type this module knows how to undo/redo (future turn-edit
 *  revisions won't, until that scope grows — see onUndo.js/onRedo.js). */
function isUndoable(type) {
  return Object.prototype.hasOwnProperty.call(APPLY_BACKWARD, type)
}

/**
 * @returns {Promise<{version:number, event:string, payload:object}|null>}
 *   null when the underlying mutation itself found nothing to write (DB-level
 *   inconsistency past the head swap — see onUndo.js). Callers must check
 *   isUndoable(revision.type) first; an unsupported type throws here.
 */
function applyBackward(translationId, revision) {
  return APPLY_BACKWARD[revision.type](translationId, revision)
}

/** @see applyBackward */
function applyForward(translationId, revision) {
  return APPLY_FORWARD[revision.type](translationId, revision)
}

module.exports = { isUndoable, applyBackward, applyForward }
