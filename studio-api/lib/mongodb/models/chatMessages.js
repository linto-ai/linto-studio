const debug = require("debug")("linto:lib:mongodb:models:chatMessages")
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
    message.created_at = new Date()
    return await this.mongoInsert(message)
  }

  async getBySession(sessionId) {
    return await this.mongoRequest(
      { sessionId: sessionId.toString() },
      { sort: { created_at: 1 } },
    )
  }

  async deleteBySession(sessionId) {
    return await this.mongoDeleteMany({
      sessionId: sessionId.toString(),
    })
  }
}

module.exports = new ChatMessageModel()
