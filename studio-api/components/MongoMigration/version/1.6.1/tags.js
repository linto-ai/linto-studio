const debug = require("debug")(
  `linto:components:MongoMigration:controllers:version:1.5.1:users`,
)

const TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const collections_name = "users"

const migration_update = {
  type: TYPE.USER,
}

module.exports = {
  up: async (db) => {
    db.collection(collections_name).updateMany(
      { type: { $exists: false } },
      { $set: migration_update },
    )
  },
  down: async (db) => {
    //No need to downgrade, it will only be an unused field
  },
}
