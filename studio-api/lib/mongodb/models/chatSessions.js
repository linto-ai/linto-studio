const debug = require("debug")("linto:lib:mongodb:models:chatSessions")
const MongoModel = require(`../model`)

/**
 * ChatSession Model
 *
 * Schema:
 * {
 *   _id: ObjectId,
 *   conversationId: string (chat on a conversation),
 *   liveSessionId: string (chat on a live session, UUID),
 *   channelId: string (live session channel),
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
    try {
      const now = new Date()
      session.created_at = now
      session.updated_at = now
      return await this.mongoInsert(session)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByConversationAndUser(conversationId, userId) {
    try {
      return await this.mongoRequest(
        { conversationId, userId },
        { sort: { created_at: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getByLiveSessionAndUser(liveSessionId, userId, organizationId) {
    try {
      return await this.mongoRequest(
        { liveSessionId, userId, organizationId },
        { sort: { created_at: -1 } },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getById(sessionId) {
    try {
      return await this.mongoRequest({
        _id: this.getObjectId(sessionId),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async delete(sessionId) {
    try {
      return await this.mongoDelete({
        _id: this.getObjectId(sessionId),
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async updateTitle(sessionId, title) {
    try {
      return await this.mongoUpdateOne(
        { _id: this.getObjectId(sessionId) },
        "$set",
        { title, updated_at: new Date() },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async touch(sessionId) {
    try {
      return await this.mongoUpdateOne(
        { _id: this.getObjectId(sessionId) },
        "$set",
        { updated_at: new Date() },
      )
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ChatSessionModel()
