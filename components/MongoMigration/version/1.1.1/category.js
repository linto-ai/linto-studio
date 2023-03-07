const debug = require('debug')(`linto:components:MongoMigration:controllers:version:1.1.1:categories`)

const collections_name = 'categories'

const category ={
  name: 'taxonomy', //vocal
  enum_type : 'keyword, conversation_text, conversation_metadata, commentaires, conversation_video', // conversation_metadata
  organizationId: 'organizationId',
  color: 'color'
}


const initDb = require(`${process.cwd()}/components/MongoMigration/controllers/migration/init`)
const dropDb = require(`${process.cwd()}/components/MongoMigration/controllers/migration/drop`)

module.exports = {
  async up(db) {
    await initDb(db, collections_name)
  },

  async down(db) {
    await dropDb(db, collections_name)
  }
}