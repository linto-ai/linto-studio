const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.7:editorRevisionsTtl`,
)

// Separate file so databases that already played editorRevisions.js still get
// the index (the runner tracks played migrations per file name). Same TTL
// pattern as editorLocks/tokens: expiresAt set at insertion, mongod purges
// past it (GC only, ~60s lag; readers do not need to filter on it).
module.exports = {
  async up(db) {
    await db
      .collection("editorRevisions")
      .createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, name: "revisions_expiration" },
      )
    debug("editorRevisions TTL index created")
  },

  async down(db) {
    await db
      .collection("editorRevisions")
      .dropIndex("revisions_expiration")
      .catch(() => {})
    debug("editorRevisions TTL index dropped")
  },
}
