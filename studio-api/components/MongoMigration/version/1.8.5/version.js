const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.5:version`,
)

const previous_version = "1.8.3"
const version = "1.8.5"

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
