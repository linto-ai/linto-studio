const debug = require("debug")("linto:lib:mongodb:models:conversationExport")
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
 *   status: string,              // queued | started | processing | complete | error | unknown
 *   processing: number,          // Progress percentage (0-100)
 *   data: string | object,       // DEPRECATED: Result data from LLM (kept for backward compatibility)
 *                                // Content is now fetched directly from LLM Gateway (single source of truth)
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
    const dateTime = moment().format()
    payload.created = dateTime
    payload.last_update = dateTime

    if (payload.progress === undefined) {
      payload.progress = {
        current: 0,
        total: 100,
        percentage: 0,
        phase: "processing",
      }
    }
    return await this.mongoInsert(payload)
  }

  async update(payload) {
    const query = { _id: this.getObjectId(payload._id) }
    payload.last_update = moment().format()
    return await this.mongoUpdateOne(query, "$set", payload)
  }

  async updateStatus(payload) {
    const query = { convId: payload.convId, format: payload.format }
    const dateTime = moment().format()

    const values = {
      status: payload.status,
      processing: payload.processing,
      last_update: dateTime,
    }
    const passthrough = [
      "data",
      "error",
      "jobId",
      "organizationId",
      "progress",
      "tokenMetrics",
      "serviceId",
      "serviceName",
      "flavorId",
      "flavorName",
      "fallbackApplied",
      "originalFlavorName",
      "fallbackReason",
    ]
    for (const key of passthrough) {
      if (payload[key] !== undefined) values[key] = payload[key]
    }
    return await this.mongoUpdateOne(query, "$set", values)
  }

  async delete(id) {
    return await this.mongoDelete({ _id: this.getObjectId(id) })
  }

  async deleteAllFromConv(idConv) {
    if (typeof idConv === "string") idConv = this.getObjectId(idConv)
    return await this.mongoDeleteMany({ conv_id: idConv })
  }

  async getById(id) {
    return await this.mongoRequest({ _id: this.getObjectId(id) })
  }

  async getByConvAndFormat(id, format = undefined) {
    const query = { convId: id.toString() }
    if (format) query.format = format
    return await this.mongoRequest(query)
  }

  async getByConvId(id, projection) {
    return await this.mongoRequest({ convId: id.toString() }, projection)
  }

  async getByJobId(id) {
    return await this.mongoRequest({ jobId: id.toString() })
  }
}

module.exports = new ConversationExportModel()
