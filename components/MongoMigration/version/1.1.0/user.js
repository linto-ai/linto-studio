const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.1.0:users`)

const collections_name = 'users'

const migration_update = {
  private: false,
}

module.exports = {
  up: async (db) => {
    // migration code example
    db.collection(collections_name).updateMany({}, { $set: migration_update })
  },
  down: async (db) => {
    // rollback code example
    db.collection(collections_name).updateMany({}, { $unset: migration_update })
  }
}