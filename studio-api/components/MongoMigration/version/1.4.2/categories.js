const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.4.2:categories`)

const collections_name = 'categories'

module.exports = {
  async up(db) {
    db.collection(collections_name).updateMany({}, { $rename: { 'organizationId': 'scopeId' } });
  },

  async down(db) {
    db.collection(collections_name).updateMany({}, { $rename: { 'scopeId': 'organizationId' } });
  }
}