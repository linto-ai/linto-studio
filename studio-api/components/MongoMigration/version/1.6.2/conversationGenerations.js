/**
 * Migration: Create conversationGenerations collection
 *
 * This collection tracks generation history per conversation + service combination.
 * Each generation maps to a jobId in LLM Gateway.
 */
const initConversationGenerations = require(
  `${process.cwd()}/components/MongoMigration/controllers/schema/conversationGenerations`,
)

const COLLECTION_NAME = "conversationGenerations"

module.exports = {
  async up(db) {
    // Check if collection exists
    const collections = await db
      .listCollections({ name: COLLECTION_NAME })
      .toArray()
    if (collections.length === 0) {
      await db.createCollection(COLLECTION_NAME)
    }

    // Create indexes using schema helper
    await initConversationGenerations(db, COLLECTION_NAME)
  },

  async down(db) {
    const collections = await db
      .listCollections({ name: COLLECTION_NAME })
      .toArray()
    if (collections.length > 0) {
      await db.collection(COLLECTION_NAME).drop()
    }
  },
}
