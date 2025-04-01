const debug = require("debug")(
  `linto:components:MongoMigration:controllers:version:1.5.6::sessionLinks`,
)

const initDb = require(
  `${process.cwd()}/components/MongoMigration/controllers/migration/init`,
)
const collectionName = "sessionLinks"

module.exports = {
  async up(db) {
    await initDb(db, collectionName)
  },

  async down(db) {},
}
