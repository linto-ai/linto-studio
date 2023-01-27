const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.0.1:organization`)

const initDb = require(`${process.cwd()}/components/MongoMigration/controllers/migration/init`)
const collections_name = 'organization'

const removed_keys = {
  personal: false
}
const migration_update = {

}

module.exports = {
  async up(db) {
    db.collection(collections_name).updateMany({}, { $unset: removed_keys })
  },

  async down(db) {
    db.collection(collections_name).updateMany({}, { $set: removed_keys })

    // No lower version for this migration
  }
}