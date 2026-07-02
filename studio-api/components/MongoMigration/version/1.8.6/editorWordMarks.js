const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.6:editorWordMarks`,
)

// Word identity (wid) now lives inside the collaborative editor Y.Doc as an
// inline `word` mark. Y-states persisted BEFORE this change are text-only (no
// marks); if replayed, docToTurns would read no wids and the next flush would
// wipe every word. Bumping editorEpoch on every conversation invalidates every
// persisted editorState (stored.epoch !== new epoch), so the next open reseeds
// the doc from Mongo turns — which carry wids — through the new turnsToDoc.
//
// missing editorEpoch ≡ 0, so $inc creates it = 1 everywhere (harmless for
// conversations that never opened the editor: they just reseed on next open).
// The stale editorStates row is overwritten by the first flush of the new
// lineage (set() upserts), so no explicit cleanup is needed.
//
// down bumps too: reverting the code (schema without the word mark) must also
// invalidate the now-marked persisted states so they reseed as text-only.
module.exports = {
  async up(db) {
    const result = await db
      .collection("conversations")
      .updateMany({}, { $inc: { editorEpoch: 1 } })
    debug(`Bumped editorEpoch on ${result.modifiedCount} conversations`)
  },

  async down(db) {
    const result = await db
      .collection("conversations")
      .updateMany({}, { $inc: { editorEpoch: 1 } })
    debug(
      `Bumped editorEpoch on ${result.modifiedCount} conversations (rollback reseed)`,
    )
  },
}
