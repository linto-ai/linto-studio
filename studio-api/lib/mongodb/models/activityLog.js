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

  async getKpiLlm(orgaId) {
    try {
      const query = [
        {
          $match: {
            activity: "llm",
            ...(orgaId && { "organization.id": orgaId }),
          },
        },
        {
          $group: {
            _id: null, // 👈 Global aggregation (or remove null if you want to group per org)
            totalGenerations: { $sum: 1 },
            totalContentLength: { $sum: "$llm.contentLength" },
          },
        },
        {
          $project: {
            _id: 0,
            totalGenerations: 1,
            totalContentLength: 1, // keep as bytes
          },
        },
      ]
      return await this.mongoAggregate(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getKpiTranscription(orgaId) {
    try {
      const query = [
        {
          $match: {
            activity: "transcription",
            ...(orgaId && { "organization.id": orgaId }),
          },
        },
        {
          $group: {
            _id: "$organization.id",
            totalTranscriptions: { $sum: 1 },
            totalDurationSeconds: {
              $sum: "$transcription.conversation.transcription.duration",
            },
          },
        },
        {
          $project: {
            _id: 0,
            // organizationId: "$_id",
            totalTranscriptions: 1,
            totalDurationSeconds: 1,
            totalHours: { $divide: ["$totalDurationSeconds", 3600] },
          },
        },
      ]

      return await this.mongoAggregate(query)
    } catch (error) {
      console.error("Error in kpiTranscription:", error)
      return error
    }
  }

  async getKpiSession(orgaId) {
    try {
      const query = [
        {
          $match: {
            activity: "session",
            ...(orgaId && { "organization.id": orgaId }),
          },
        },
        {
          $group: {
            _id: "$organization.id",
            totalSessions: { $sum: 1 },
            totalWatchTimeSeconds: { $sum: "$socket.totalWatchTime" },
            avgWatchTimeSeconds: { $avg: "$socket.totalWatchTime" },
          },
        },
        {
          $project: {
            _id: 0,
            organizationId: "$_id",
            totalSessions: 1,
            totalWatchTimeHours: { $divide: ["$totalWatchTimeSeconds", 3600] },
            avgWatchTimeMinutes: { $divide: ["$avgWatchTimeSeconds", 60] },
          },
        },
      ]

      return await this.mongoAggregate(query)
    } catch (error) {
      console.error("Error in kpiSession:", error)
      return error
    }
  }

  async kpiSessionById(sessionId) {
    try {
      if (!sessionId) throw new Error("Missing sessionId")

      const query = [
        {
          $match: {
            activity: "session",
            "session.sessionId": sessionId,
          },
        },
        {
          $group: {
            _id: "$session.sessionId",
            totalWatchTime: { $sum: "$socket.totalWatchTime" },
            avgWatchTime: { $avg: "$socket.totalWatchTime" },
            totalConnections: { $sum: "$socket.connectionCount" },
            userCount: { $sum: 1 },
            sessionInfo: { $first: "$session" },
            organization: { $first: "$organization" },
          },
        },
        {
          $project: {
            _id: 0,
            sessionInfo: 1,
            organization: 1,
            totalConnections: 1,
            userCount: 1,
            totalWatchTimeSeconds: "$totalWatchTime",
            totalWatchTimeMinutes: { $divide: ["$totalWatchTime", 60] },
            totalWatchTimeHours: { $divide: ["$totalWatchTime", 3600] },
            avgWatchTimeSeconds: "$avgWatchTime",
          },
        },
      ]

      return await this.mongoAggregate(query)
    } catch (error) {
      console.error("Error in kpiSessionById:", error)
      return error
    }
  }
}

module.exports = new ActivityLog()
