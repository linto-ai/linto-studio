const debug = require("debug")(
  "linto:lib:mongodb:models:chatMessages",
)
const MongoModel = require(`../model`)

/**
 * ChatMessage Model
 *
 * Schema:
 * {
 *   _id: ObjectId,
 *   sessionId: string,
 *   role: string ("user" | "assistant"),
 *   content: string,
 *   tokenCount: number (optional, for assistant messages),
 *   created_at: Date,
 * }
 */
class ChatMessageModel extends MongoModel {
  constructor() {
    super("chatMessages")
  }

  async create(message) {
    try {
      message.created_at = new Date()
      return await this.mongoInsert(message)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySession(sessionId) {
    try {
      return await this.mongoRequest(
        { sessionId: sessionId.toString() },
        { sort: { created_at: 1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getLastBySession(sessionId, limit) {
    try {
      const messages = await this.mongoRequest(
        { sessionId: sessionId.toString() },
        { sort: { created_at: -1 }, limit },
      )
      return messages.reverse()
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async countBySessions(sessionIds) {
    try {
      if (!sessionIds || sessionIds.length === 0) return {}
      const results = await this.mongoAggregate([
        { $match: { sessionId: { $in: sessionIds } } },
        { $group: { _id: "$sessionId", count: { $sum: 1 } } },
      ])
      const counts = {}
      for (const r of results) {
        counts[r._id] = r.count
      }
      return counts
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteBySession(sessionId) {
    try {
      return await this.mongoDeleteMany({
        sessionId: sessionId.toString(),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ChatMessageModel()
