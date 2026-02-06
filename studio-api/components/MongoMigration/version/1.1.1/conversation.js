const debug = require("debug")(
  `linto:components:MongoMigration:version:1.1.1:conversation`,
)

const collections_name = "conversations"

const migration_update_add = {
  tags: [],
}

module.exports = {
  async up(db) {
    db.collection(collections_name).updateMany(
      {},
      { $set: migration_update_add },
    )
  },

  async down(db) {
    db.collection(collections_name).updateMany(
      {},
      { $unset: migration_update_add },
    )
  },
}
