const debug = require("debug")(
  `linto:components:MongoMigration:controllers:schema:conversationGenerations`,
)
const logger = require(`${process.cwd()}/lib/logger/logger`)

module.exports = async function (db, collectionName) {
  try {
    if (!collectionName) return

    const collection = db.collection(collectionName)

    // Compound index for listing generations by conversation and service
    await collection.createIndex(
      { conversationId: 1, serviceId: 1, createdAt: -1 },
      { name: "conversationId_serviceId_createdAt" },
    )

    // Unique index on generationId
    await collection.createIndex(
      { generationId: 1 },
      { name: "generationId_unique", unique: true, sparse: true },
    )

    // Index on jobId for lookups
    await collection.createIndex({ jobId: 1 }, { name: "jobId", sparse: true })

    // Index for finding current generation
    await collection.createIndex(
      { conversationId: 1, serviceId: 1, isCurrent: 1 },
      { name: "conversationId_serviceId_isCurrent" },
    )

  } catch (error) {
    logger.error("Error creating indexes:", error)
  }
}
