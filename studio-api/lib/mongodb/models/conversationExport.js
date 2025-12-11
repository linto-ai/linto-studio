const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:conversationExport",
)
const MongoModel = require(`../model`)

const moment = require("moment")

/**
 * ConversationExport Model
 *
 * Schema for LLM Gateway V2 integration:
 * {
 *   _id: ObjectId,
 *   convId: string,              // Conversation ID
 *   format: string,              // Service name/type (e.g., "summary", "keywords")
 *   status: string,              // queued | started | processing | complete | error
 *   processing: number,          // Progress percentage (0-100)
 *   data: string | object,       // Result data from LLM
 *   error: string,               // Error message if failed
 *   jobId: string,               // V2 job UUID
 *   created: string,             // Creation timestamp
 *   last_update: string,         // Last update timestamp
 *
 *   // V2 Additional Fields
 *   organizationId: string,      // LinTO organization ID (for organization-scoped WebSocket)
 *   serviceId: string,           // V2 service UUID
 *   serviceName: string,         // V2 service name
 *   flavorId: string,            // V2 flavor UUID
 *   flavorName: string,          // V2 flavor name
 *   llmOutputType: string,       // Output type (text, markdown, json)
 *
 *   // V2 Progress tracking
 *   progress: {
 *     current: number,
 *     total: number,
 *     percentage: number,
 *     phase: string              // processing | reducing | generating_document
 *   },
 *
 *   // V2 Token metrics
 *   tokenMetrics: {
 *     totalTokens: number,
 *     totalPromptTokens: number,
 *     totalCompletionTokens: number,
 *     totalDurationMs: number,
 *     estimatedCost: number
 *   },
 *
 *   // V2 Fallback tracking
 *   fallbackApplied: boolean,
 *   originalFlavorName: string,
 *   fallbackReason: string
 * }
 */
class ConversationExportModel extends MongoModel {
  constructor() {
    super("conversationExport")
  }

  async create(payload) {
    try {
      const dateTime = moment().format()
      payload.created = dateTime
      payload.last_update = dateTime

      // Initialize V2 fields if not provided
      if (payload.progress === undefined) {
        payload.progress = {
          current: 0,
          total: 100,
          percentage: 0,
          phase: "processing",
        }
      }

      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async update(payload) {
    try {
      const operator = "$set"
      const query = {
        _id: this.getObjectId(payload._id),
      }
      const dateTime = moment().format()
      payload.last_update = dateTime

      let mutableElements = payload
      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  /**
   * Update status and V2 progress fields
   */
  async updateStatus(payload) {
    try {
      const operator = "$set"
      const query = {
        convId: payload.convId,
        format: payload.format,
      }
      const dateTime = moment().format()
      payload.last_update = dateTime

      // Build update object with all V2 fields
      const mutableElements = {
        status: payload.status,
        processing: payload.processing,
        last_update: dateTime,
      }

      // Include V2 fields if present
      if (payload.data !== undefined) mutableElements.data = payload.data
      if (payload.error !== undefined) mutableElements.error = payload.error
      if (payload.jobId !== undefined) mutableElements.jobId = payload.jobId
      if (payload.organizationId !== undefined) mutableElements.organizationId = payload.organizationId
      if (payload.progress !== undefined) mutableElements.progress = payload.progress
      if (payload.tokenMetrics !== undefined) mutableElements.tokenMetrics = payload.tokenMetrics
      if (payload.serviceId !== undefined) mutableElements.serviceId = payload.serviceId
      if (payload.serviceName !== undefined) mutableElements.serviceName = payload.serviceName
      if (payload.flavorId !== undefined) mutableElements.flavorId = payload.flavorId
      if (payload.flavorName !== undefined) mutableElements.flavorName = payload.flavorName
      if (payload.fallbackApplied !== undefined) mutableElements.fallbackApplied = payload.fallbackApplied
      if (payload.originalFlavorName !== undefined) mutableElements.originalFlavorName = payload.originalFlavorName
      if (payload.fallbackReason !== undefined) mutableElements.fallbackReason = payload.fallbackReason

      return await this.mongoUpdateOne(query, operator, mutableElements)
    } catch (error) {
      console.error(error)
      return error
    }
  }

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

  async deleteAllFromConv(idConv) {
    try {
      if (typeof idConv === "string") idConv = this.getObjectId(idConv)
      const query = { conv_id: idConv }

      return await this.mongoDeleteMany(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(id) {
    try {
      const query = {
        _id: this.getObjectId(id),
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByConvAndFormat(id, format = undefined) {
    try {
      let query = {
        convId: id.toString(),
      }

      if (format) {
        query.format = format
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByConvId(id, projection) {
    try {
      const query = {
        convId: id.toString(),
      }

      return await this.mongoRequest(query, projection)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByJobId(id) {
    try {
      let query = {
        jobId: id.toString(),
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ConversationExportModel()
