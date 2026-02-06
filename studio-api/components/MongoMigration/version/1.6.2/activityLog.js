const debug = require("debug")(
  `linto:components:MongoMigration:version:1.6.2:activityLog`,
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
