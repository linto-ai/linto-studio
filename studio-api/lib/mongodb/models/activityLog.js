const MongoModel = require("../model")
const debug = require("debug")(
  "linto:conversation-manager:models:mongodb:models:activityLog",
)

class ActivityLog extends MongoModel {
  constructor() {
    super("activityLog")
  }

  async create(payload) {
    try {
      return await this.mongoInsert(payload)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySocketId(socketId, sessionId) {
    try {
      const query = {
        "socket.id": socketId,
        "session.sessionId": sessionId,
      }
      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async socketReconnect(activity, joinedAt) {
    try {
      const operator = "$set"
      const query = { _id: activity._id }
      const payload = activity.socket

      payload.connectionCount = ++activity.socket.connectionCount
      payload.joinedAt = joinedAt

      await this.mongoUpdateOne(query, operator, { socket: payload })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async socketLeft(activity, payload) {
    try {
      const operator = "$set"
      const query = { _id: activity._id }

      await this.mongoUpdateOne(query, operator, { socket: payload })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteLog(activityId) {
    try {
      await this.mongoDelete({ _id: activityId })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async deleteAllSocketLog(socketId, watchingDuration) {
    try {
      const query = {
        "socket.id": socketId,
        "socket.totalWatchTime": { $lt: watchingDuration },
      }
      await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ActivityLog()
