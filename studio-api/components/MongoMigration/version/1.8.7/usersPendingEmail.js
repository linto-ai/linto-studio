const debug = require("debug")(
  `linto:components:MongoMigration:version:1.8.7:usersPendingEmail`,
)

const logger = require(`${process.cwd()}/lib/logger/logger`)
const users = require("../1.8.6/users.js")

// 1.8.6/users.js came from next after some saas databases had already moved
// to 1.8.7, and the runner never goes back to a lower version. Its index tells
// whether it already ran.
const PENDING_INDEX_NAME = "pendingEmail.address_1"

module.exports = {
  async up(db) {
    const indexes = await db
      .collection("users")
      .indexes()
      .catch(() => [])
    if (indexes.some((index) => index.name === PENDING_INDEX_NAME)) {
      logger.info("1.8.6/users.js already played, skipping")
      return
    }
    await users.up(db)
  },

  // 1.8.6 expects pending addresses too, nothing to revert
  async down() {},
}
