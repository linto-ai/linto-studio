const debug = require("debug")(
  `linto:components:MongoMigration:version:1.2.0:token`,
)

const collections_name = "tokens"

const initToken = require(
  `${process.cwd()}/components/MongoMigration/controllers/schema/tokens`,
)

module.exports = {
  async up(db) {
    await initToken(db, collections_name)
  },

  async down(db) {
    // No lower version for this migration
  },
}
