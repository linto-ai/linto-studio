const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1:version`)

const version = 2

module.exports = {
  async up(db) {
    return db.collection('version').updateMany({}, { $set: { version: version} })
  },

  async down(db) {
    return db.collection('version').updateMany({}, { $set: { version: version} })
  }
};