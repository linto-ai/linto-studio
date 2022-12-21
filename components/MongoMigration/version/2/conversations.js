const debug = require('debug')(`linto:components:MongoMigration:controllers:version:2:conversations`)

const migration_update = {
  // place new fields here
}

module.exports = {
  up(db) {
    // return db.collection('organization').updateMany({}, { $set: migration_update })
  },

  down(db) {
    // return db.collection('organization').updateMany({}, { $unset: migration_update })
  }
}