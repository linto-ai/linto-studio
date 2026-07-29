const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.6:editorLocks`,
)

// Per-turn edit locks: the unique index is the lock (concurrent acquires
// resolve by duplicate-key error). The TTL index is garbage collection only,
// every query must compare expiresAt to now itself (lazy expiry).
module.exports = {
  async up(db) {
    const collection = db.collection("editorLocks")
    await collection.createIndex(
      { translationId: 1, turnId: 1 },
      { unique: true, name: "lock_key" },
    )
    await collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "lock_gc" },
    )
    await collection.createIndex({ socketId: 1 }, { name: "lock_by_socket" })
    await collection.createIndex({ parentId: 1 }, { name: "lock_by_parent" })
    debug("editorLocks indexes created")
  },

  async down(db) {
    // Locks are ephemeral runtime state: dropping the collection is safe.
    await db
      .collection("editorLocks")
      .drop()
      .catch(() => {})
    debug("editorLocks collection dropped")
  },
}
