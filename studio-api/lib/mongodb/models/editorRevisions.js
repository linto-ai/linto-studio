const MongoModel = require(`../model`)
const MongoDriver = require(`../driver`)

// Undo window, enforced by the revisions_expiration TTL index.
const REVISION_TTL_MS = 1000 * 60 * 60

/**
 * Undo/redo history for speaker mutations: one append-only document per
 * ORIGINAL mutation (rename_speaker / replace_speaker / update_turn_speaker),
 * chained via previousHead. Undo/redo do NOT append — they only move the
 * cursor (conversations.undoHead, see conversationEditor.js) back and forth
 * along this same chain and re-apply before/after; see EditorHandler's
 * onUndo/onRedo. Revisions expire after one hour (expiresAt +
 * revisions_expiration TTL index), so history listing only covers that window.
 *
 * A revision can have several "children" sharing the same previousHead: an
 * undo rewinds the cursor, and a genuinely NEW mutation made from there
 * forks — the old (now unreachable) branch stays in the collection for
 * history but is never picked again, see findByPreviousHead.
 */
class EditorRevisionsModel extends MongoModel {
  constructor() {
    super("editorRevisions")
  }

  getCollection() {
    return MongoDriver.constructor.db.collection(this.collection)
  }

  /**
   * Append one revision with a caller-provided id (so the id is known before
   * insertion — the conversation's undoHead is set to it in the same logical
   * write, see EditorHandler/utils/recordSpeakerRevision.js).
   *
   * `at` is assigned by mongod itself via $currentDate, not computed in Node
   * — no cross-replica clock skew, and it doubles as findByPreviousHead's
   * fork tie-breaker (see there) and as the audit-log timestamp.
   */
  async insert({
    _id,
    translationId,
    parentId,
    type,
    before,
    after,
    previousHead,
    author,
  }) {
    await this.getCollection().findOneAndUpdate(
      { _id },
      {
        $set: {
          translationId,
          parentId,
          type,
          before,
          after,
          previousHead,
          author,
          expiresAt: new Date(Date.now() + REVISION_TTL_MS),
        },
        $currentDate: { at: true },
      },
      { upsert: true },
    )
  }

  async findById(revisionId) {
    return await this.getCollection().findOne({ _id: revisionId })
  }

  /**
   * Redo target: the revision that comes right after `previousHead` in the
   * chain. Several can share that previousHead if a fork happened (undo,
   * then a fresh mutation) — (at, _id) descending always resolves to the
   * live branch, since a fork's new side is by construction written AFTER
   * the abandoned one (see the class doc comment).
   */
  async findByPreviousHead(translationId, previousHead) {
    return await this.getCollection()
      .find({ translationId, previousHead })
      .sort({ at: -1, _id: -1 })
      .limit(1)
      .next()
  }

  /** History listing, most recent first. */
  async listByTranslation(translationId, limit = 50) {
    return await this.getCollection()
      .find({ translationId })
      .sort({ at: -1, _id: -1 })
      .limit(limit)
      .toArray()
  }
}

module.exports = new EditorRevisionsModel()
