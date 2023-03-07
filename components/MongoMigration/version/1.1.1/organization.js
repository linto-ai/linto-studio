const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.1.1:organization`)

const collections_name = 'organization'

const migration_update_add = {
  tags: [],
}

module.exports = {
  async up(db) {
    db.collection(collections_name).updateMany({}, { $set: migration_update_add })
  },

  async down(db) {
    db.collection(collections_name).updateMany({}, { $unset: migration_update_add })
  }
}