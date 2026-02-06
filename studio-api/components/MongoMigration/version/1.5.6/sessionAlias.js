const debug = require("debug")(
  `linto:components:MongoMigration:version:1.5.6:sessionAlias`,
)

const initDb = require(
  `${process.cwd()}/components/MongoMigration/controllers/migration/init`,
)
const collectionName = "sessionAlias"

module.exports = {
  async up(db) {
    await initDb(db, collectionName)
  },

  async down(db) {},
}
