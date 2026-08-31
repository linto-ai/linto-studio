const model = require(`${process.cwd()}/lib/mongodb/models`)

/**
 * Append one entry to the speaker undo/redo history and advance the track's
 * undo cursor to it. Shared by the three ORIGINAL speaker mutation handlers
 * (rename/replace/updateTurnSpeaker) — onUndo/onRedo do NOT call this, they
 * only move the cursor along the existing chain, see editorRevisions.js.
 *
 * Insert-then-swap order matters: the cursor is only ever moved to an id
 * that has JUST been confirmed to exist (the insert that precedes the
 * swap), so a failure here can never leave undoHead pointing at a revision
 * that doesn't exist. The two ways this can still fail:
 *  - the insert itself fails: the cursor never moves, nothing is chained.
 *  - the insert succeeds but the swap loses the race (something else moved
 *    the cursor first): the revision stays in the collection, orphaned —
 *    same as any abandoned fork branch (see findByPreviousHead) — but never
 *    reachable, so it can't corrupt anything either.
 * Either way the caller gets `null` back and moves on: the mutation this
 * revision was FOR has already committed and must still broadcast — this
 * function never throws. No retry: single maintainer, not mission-critical,
 * a revision lost this way just means that one action isn't undoable.
 */
async function recordSpeakerRevision({
  translationId,
  parentId,
  type,
  before,
  after,
  previousHead,
  author,
}) {
  try {
    const revisionId = model.editorRevisions.createObjectId()
    await model.editorRevisions.insert({
      _id: revisionId,
      translationId,
      parentId,
      type,
      before,
      after,
      previousHead,
      author,
    })
    const swapped = await model.conversationEditor.swapConversationUndoHead(
      translationId,
      previousHead,
      revisionId,
    )
    return swapped ? revisionId : null
  } catch (err) {
    console.error(
      `[EditorHandler] failed to record ${type} revision (translation=${translationId}): ${err.message}`,
    )
    return null
  }
}

module.exports = { recordSpeakerRevision }
