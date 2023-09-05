const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.0.0:version`)

const initDb = require(`${process.cwd()}/components/MongoMigration/controllers/migration/init`)
const dropDb = require(`${process.cwd()}/components/MongoMigration/controllers/migration/drop`)

const version = '1.0.0'

const collectionName = 'version'


module.exports = {
  async up(db) {
    await initDb(db, collectionName)
    await db.collection(collectionName).insertOne({ version: version })
  },

  async down(db) {
    await dropDb(db, collections_name)
  }
}