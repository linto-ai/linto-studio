const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.3:activityLog`,
)

const collections_name = "activityLog"

const initIndexActivity = require(
  `${process.cwd()}/components/MongoMigration/controllers/schema/activityLog`,
)

module.exports = {
  async up(db) {
    await initIndexActivity(db, collections_name)
  },

  async down(db) {
    // No lower version for this migration
  },
}
