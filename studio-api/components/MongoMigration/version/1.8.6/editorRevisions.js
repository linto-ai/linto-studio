const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.6:editorRevisions`,
)

// Undo/redo history for speaker mutations (rename/replace/update_turn_speaker).
// One append-only document per mutation, chained via previousHead so undo/redo
// move a cursor without a scan; the same collection doubles as the audit trail.
module.exports = {
  async up(db) {
    const collection = db.collection("editorRevisions")
    // History listing (listByTranslation) and redo's fork tie-break
    // (findByPreviousHead) both sort by (at, _id) desc — see editorRevisions.js.
    await collection.createIndex(
      { translationId: 1, at: -1, _id: -1 },
      { name: "revisions_by_translation" },
    )
    await collection.createIndex(
      { translationId: 1, previousHead: 1, at: -1, _id: -1 },
      { name: "revisions_by_previous_head" },
    )
    debug("editorRevisions indexes created")
  },

  async down(db) {
    // History is derived state, not source of truth: dropping is safe.
    await db
      .collection("editorRevisions")
      .drop()
      .catch(() => {})
    debug("editorRevisions collection dropped")
  },
}
