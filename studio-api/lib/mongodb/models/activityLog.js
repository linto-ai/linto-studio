const MongoModel = require("../model")

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

  async getAll(params) {
    try {
      const filterKeys = ["size", "page", "sortField", "sortCriteria"]
      const projection = { skipProjection: true }

      const filter = {}
      const query = {}

      for (const [key, value] of Object.entries(params)) {
        if (key === "userScope") continue

        if (filterKeys.includes(key)) filter[key] = value
        else query[key] = value
      }
      return await this.mongoAggregatePaginate(query, projection, filter)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySocketId(socketId) {
    try {
      const query = {
        "socket.id": socketId,
      }

      return await this.mongoRequest(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getBySocketAndSession(socketId, sessionId) {
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

  async socketReconnect(activity, timestamp) {
    try {
      const operator = "$set"
      const query = { _id: activity._id }
      const payload = activity.socket

      payload.connectionCount = ++activity.socket.connectionCount
      payload.lastJoinedAt = timestamp

      await this.mongoUpdateOne(query, operator, {
        socket: payload,
        timestamp: timestamp,
      })
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async socketLeft(activity, socket, timestamp) {
    try {
      const operator = "$set"
      const query = { _id: activity._id }

      await this.mongoUpdateOne(query, operator, {
        socket: socket,
        timestamp: timestamp,
      })
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

  async deleteAllSocketLog(socketId, underDuration) {
    try {
      const query = {
        "socket.id": socketId,
        "socket.totalWatchTime": { $lt: underDuration }, // Delete all tuple being inferior to underDuration value
      }
      await this.mongoDelete(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

module.exports = new ActivityLog()
