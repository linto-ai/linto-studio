const debug = require("debug")(
  `linto:components:MongoMigration:version:1.4.0:categories`,
)

const collections_name = "categories"

const migration_update = {
  color: "deep-purple",
}

module.exports = {
  async up(db) {
    db.collection(collections_name).updateMany(
      { name: "keyword" },
      { $set: migration_update },
    )
  },

  async down(db) {},
}
