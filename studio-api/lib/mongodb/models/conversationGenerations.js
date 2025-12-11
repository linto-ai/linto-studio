const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:conversationGenerations",
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

  /**
   * Create a new generation record
   * @param {Object} payload - Generation data
   * @returns {Promise<Object>} - Created generation
   */
  async create(payload) {
    try {
      const dateTime = moment().format()
      payload.generationId = payload.generationId || uuidv4()
      payload.createdAt = dateTime
      payload.updatedAt = dateTime
      payload.status = payload.status || "pending"
      payload.isCurrent = payload.isCurrent !== undefined ? payload.isCurrent : true

      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Update a generation record
   * @param {Object} payload - Generation data with _id
   * @returns {Promise<Object>} - Update result
   */
  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      const dateTime = moment().format()
      payload.updatedAt = dateTime

      let mutableElements = payload
      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Get generation by generationId
   * @param {string} generationId - UUID of the generation
   * @returns {Promise<Array>} - Generation records
   */
  async getByGenerationId(generationId) {
    try {
      const query = {
        generationId: generationId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Get generation by jobId
   * @param {string} jobId - LLM Gateway job ID
   * @returns {Promise<Array>} - Generation records
   */
  async getByJobId(jobId) {
    try {
      const query = {
        jobId: jobId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * List all generations for a conversation and service
   * @param {string} conversationId - Conversation ID
   * @param {string} serviceId - Service ID (optional)
   * @returns {Promise<Array>} - List of generations
   */
  async listByConversationAndService(conversationId, serviceId = null) {
    try {
      const matchQuery = {
        conversationId: conversationId.toString(),
      }
      if (serviceId) {
        matchQuery.serviceId = serviceId
      }

      // Use aggregate pipeline for sorting by createdAt descending (newest first)
      const pipeline = [
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
      ]
      return await this.mongoAggregate(pipeline)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Get the current active generation for a conversation and service
   * @param {string} conversationId - Conversation ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object|null>} - Current generation or null
   */
  async getCurrentGeneration(conversationId, serviceId) {
    try {
      const query = {
        conversationId: conversationId.toString(),
        serviceId: serviceId,
        isCurrent: true,
      }
      const results = await this.mongoRequest(query)
      return results.length > 0 ? results[0] : null
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Archive a generation (mark as not current)
   * @param {string} conversationId - Conversation ID
   * @param {string} serviceId - Service ID
   * @param {string} jobId - Job ID to archive
   * @returns {Promise<Object>} - Update result
   */
  async archiveGeneration(conversationId, serviceId, jobId) {
    try {
      const operator = "$set"
      const query = {
        conversationId: conversationId.toString(),
        serviceId: serviceId,
        jobId: jobId,
      }
      const dateTime = moment().format()
      const mutableElements = {
        isCurrent: false,
        updatedAt: dateTime,
      }

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Archive all generations for a conversation and service (mark all as not current)
   * @param {string} conversationId - Conversation ID
   * @param {string} serviceId - Service ID
   * @returns {Promise<Object>} - Update result
   */
  async archiveAllGenerations(conversationId, serviceId) {
    try {
      const operator = "$set"
      const query = {
        conversationId: conversationId.toString(),
        serviceId: serviceId,
        isCurrent: true,
      }
      const dateTime = moment().format()
      const mutableElements = {
        isCurrent: false,
        updatedAt: dateTime,
      }

      return await this.mongoUpdateMany(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Update generation status
   * @param {string} jobId - LLM Gateway job ID
   * @param {string} status - New status
   * @param {string} error - Error message (optional)
   * @returns {Promise<Object>} - Update result
   */
  async updateStatus(jobId, status, error = null) {
    try {
      const operator = "$set"
      const query = {
        jobId: jobId,
      }
      const dateTime = moment().format()
      const mutableElements = {
        status: status,
        updatedAt: dateTime,
      }
      if (error) {
        mutableElements.error = error
      }

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Delete a generation by ID
   * @param {string} id - MongoDB _id
   * @returns {Promise<Object>} - Delete result
   */
  async delete(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }
      return await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Delete all generations for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} - Delete result
   */
  async deleteAllByConversation(conversationId) {
    try {
      const query = {
        conversationId: conversationId.toString(),
      }
      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ConversationGenerationsModel()
