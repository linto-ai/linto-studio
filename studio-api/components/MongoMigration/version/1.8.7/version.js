const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.7:version`,
)

const previous_version = "1.8.6"
const version = "1.8.7"

module.exports = {
  async up(db) {
    debug(`Migrating to ${version}`)
    return db
      .collection("version")
      .updateMany({}, { $set: { version: version } })
  },

  async down(db) {
    debug(`Rolling back to ${previous_version}`)
    return db
      .collection("version")
      .updateMany({}, { $set: { version: previous_version } })
  },
}
