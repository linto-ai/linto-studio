const debug = require("debug")(
  "linto:migration:1.6.2:conversationGenerations",
)

/**
 * Migration: Create conversationGenerations collection
 *
 * This collection tracks generation history per conversation + service combination.
 * Each generation maps to a jobId in LLM Gateway.
 */
module.exports = {
  async up(db) {
    debug("Creating conversationGenerations collection and indexes")

    // Check if collection exists
    const collections = await db.listCollections({ name: "conversationGenerations" }).toArray()
    if (collections.length === 0) {
      await db.createCollection("conversationGenerations")
      debug("Created conversationGenerations collection")
    }

    const collection = db.collection("conversationGenerations")

    // Create indexes
    // Compound index for listing generations by conversation and service
    await collection.createIndex(
      { conversationId: 1, serviceId: 1, createdAt: -1 },
      { name: "conversationId_serviceId_createdAt" }
    )
    debug("Created compound index: conversationId_serviceId_createdAt")

    // Unique index on generationId
    await collection.createIndex(
      { generationId: 1 },
      { name: "generationId_unique", unique: true, sparse: true }
    )
    debug("Created unique index: generationId_unique")

    // Index on jobId for lookups
    await collection.createIndex(
      { jobId: 1 },
      { name: "jobId", sparse: true }
    )
    debug("Created index: jobId")

    // Index for finding current generation
    await collection.createIndex(
      { conversationId: 1, serviceId: 1, isCurrent: 1 },
      { name: "conversationId_serviceId_isCurrent" }
    )
    debug("Created index: conversationId_serviceId_isCurrent")

    debug("Migration 1.6.2 conversationGenerations: UP complete")
  },

  async down(db) {
    debug("Dropping conversationGenerations collection")

    const collections = await db.listCollections({ name: "conversationGenerations" }).toArray()
    if (collections.length > 0) {
      await db.collection("conversationGenerations").drop()
      debug("Dropped conversationGenerations collection")
    }

    debug("Migration 1.6.2 conversationGenerations: DOWN complete")
  },
}
