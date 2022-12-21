const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1:conversation`)

const init = require(`${process.cwd()}/components/MongoMigration/controllers/migration/init`)

const collectionName = 'conversations'

module.exports = {
  async up(db) {
    await init(db, collectionName)
  },

  async down(db) {
    // No lower version for this migration
  }
}