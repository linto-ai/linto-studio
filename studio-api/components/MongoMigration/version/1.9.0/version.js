const debug = require("debug")(
  `linto:components:MongoMigration:version:1.9.0:version`,
)

const previous_version = "1.8.7"
const version = "1.9.0"

module.exports = {
  async up(db) {
    return db
      .collection("version")
      .updateMany({}, { $set: { version: version } })
  },

  async down(db) {
    return db
      .collection("version")
      .updateMany({}, { $set: { version: previous_version } })
  },
}
