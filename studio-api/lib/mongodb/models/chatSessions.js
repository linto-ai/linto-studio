const debug = require("debug")("linto:lib:mongodb:models:chatSessions")
const MongoModel = require(`../model`)

/**
 * ChatSession Model
 *
 * Schema:
 * {
 *   _id: ObjectId,
 *   conversationId: string,
 *   organizationId: string,
 *   userId: string,
 *   title: string,
 *   flavorId: string (UUID),
 *   created_at: Date,
 *   updated_at: Date,
 * }
 */
class ChatSessionModel extends MongoModel {
  constructor() {
    super("chatSessions")
  }

  async create(session) {
    const now = new Date()
    session.created_at = now
    session.updated_at = now
    return await this.mongoInsert(session)
  }

  async getByConversationAndUser(conversationId, userId) {
    return await this.mongoRequest(
      { conversationId, userId },
      { sort: { created_at: -1 } },
    )
  }

  async getById(sessionId) {
    return await this.mongoRequest({
      _id: this.getObjectId(sessionId),
    })
  }

  async delete(sessionId) {
    return await this.mongoDelete({
      _id: this.getObjectId(sessionId),
    })
  }

  async updateTitle(sessionId, title) {
    return await this.mongoUpdateOne(
      { _id: this.getObjectId(sessionId) },
      "$set",
      { title, updated_at: new Date() },
    )
  }
}

module.exports = new ChatSessionModel()
