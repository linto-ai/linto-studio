const debug = require("debug")(
  "linto:lib:mongodb:models:conversationGenerations",
)
const MongoModel = require(`../model`)
const { v4: uuidv4 } = require("uuid")
const moment = require("moment")

/**
 * ConversationGenerations Model
 *
 * Tracks generation history per conversation + service combination.
 * Each generation maps to a jobId in LLM Gateway.
 *
 * Schema:
 * {
 *   _id: ObjectId,
 *   generationId: string,        // UUID
 *   conversationId: string,      // Reference to conversation
 *   serviceId: string,           // LLM service ID (route)
 *   serviceName: string,         // Human-readable service name
 *   jobId: string,               // LLM Gateway job ID
 *   status: string,              // pending | processing | completed | error
 *   isCurrent: boolean,          // True if this is the active generation
 *   createdAt: string,           // Creation timestamp
 *   updatedAt: string,           // Last update timestamp
 *   error: string,               // Error message if failed
 *   organizationId: string,      // For scoping
 * }
 */
class ConversationGenerationsModel extends MongoModel {
  constructor() {
    super("conversationGenerations")
  }

  async create(payload) {
    const dateTime = moment().format()
    payload.generationId = payload.generationId || uuidv4()
    payload.createdAt = dateTime
    payload.updatedAt = dateTime
    payload.status = payload.status || "pending"
    payload.isCurrent =
      payload.isCurrent !== undefined ? payload.isCurrent : true
    return await this.mongoInsert(payload)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.updatedAt = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async getByGenerationId(generationId) {
    return await this.mongoRequest({ generationId })
  }

  async getByJobId(jobId) {
    return await this.mongoRequest({ jobId })
  }

  async listByConversationAndService(conversationId, serviceId = null) {
    const matchQuery = { conversationId: conversationId.toString() }
    if (serviceId) {
      matchQuery.serviceId = serviceId
    }
    return await this.mongoAggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
    ])
  }

  async archiveAllGenerations(conversationId, serviceId) {
    const query = {
      conversationId: conversationId.toString(),
      serviceId,
      isCurrent: true,
    }
    return await this.mongoUpdateMany(query, "$set", {
      isCurrent: false,
      updatedAt: moment().format(),
    })
  }

  async updateStatus(jobId, status, error = null) {
    const values = {
      status,
      updatedAt: moment().format(),
    }
    if (error) {
      values.error = error
    }
    return await this.mongoUpdateOne({ jobId }, "$set", values)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }
}

module.exports = new ConversationGenerationsModel()
