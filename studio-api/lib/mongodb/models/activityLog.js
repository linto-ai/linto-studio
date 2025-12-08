const MongoModel = require("../model")

function buildActivityMatchQuery(activity, orgaId, startDate, endDate) {
  const timestampQuery = {}

  if (startDate) timestampQuery.$gte = startDate
  if (endDate) timestampQuery.$lte = endDate

  return {
    $match: {
      activity,
      ...(orgaId && { "organization.id": orgaId }),
      ...(Object.keys(timestampQuery).length > 0 && {
        timestamp: timestampQuery,
      }),
    },
  }
}

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

  async getKpiLlm(orgaId, startDate, endDate) {
    try {
      const matchQuery = buildActivityMatchQuery(
        "llm",
        orgaId,
        startDate,
        endDate,
      )

      const query = [
        matchQuery,
        {
          $group: {
            _id: null,
            generated: { $sum: 1 },
            tokens: { $sum: "$llm.contentLength" },
          },
        },
        {
          $project: {
            _id: 0,
            generated: 1,
            tokens: 1,
          },
        },
      ]
      return await this.mongoAggregate(query)
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async getKpiTranscription(orgaId, startDate, endDate) {
    try {
      const matchQuery = buildActivityMatchQuery(
        "transcription",
        orgaId,
        startDate,
        endDate,
      )

      const query = [
        matchQuery,
        {
          $group: {
            _id: "$organization.id",
            generated: { $sum: 1 },
            duration: {
              $sum: "$transcription.duration",
            },
          },
        },
        {
          $project: {
            _id: 0,
            generated: 1,
            duration: 1,
          },
        },
      ]
      return await this.mongoAggregate(query)
    } catch (error) {
      console.error("Error in kpiTranscription:", error)
      return error
    }
  }

  async getKpiSession(orgaId, startDate, endDate) {
    try {
      const matchQuery = buildActivityMatchQuery(
        "session",
        orgaId,
        startDate,
        endDate,
      )

      const query = [
        matchQuery,
        {
          $group: {
            _id: "$organization.id",
            totalConnections: { $sum: 1 },
            watchTime: { $sum: "$socket.totalWatchTime" },
          },
        },
        {
          $project: {
            _id: 0,
            totalConnections: 1,
            watchTime: 1,
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
            usersAbove5Min: {
              $sum: {
                $cond: [{ $gte: ["$socket.totalWatchTime", 300] }, 1, 0],
              },
            },
            usersBelow5Min: {
              $sum: {
                $cond: [{ $lt: ["$socket.totalWatchTime", 300] }, 1, 0],
              },
            },
            avgWatchTimeAbove5Min: {
              $avg: {
                $cond: [
                  { $gte: ["$socket.totalWatchTime", 300] },
                  "$socket.totalWatchTime",
                  null,
                ],
              },
            },
            avgWatchTimeBelow5Min: {
              $avg: {
                $cond: [
                  { $lt: ["$socket.totalWatchTime", 300] },
                  "$socket.totalWatchTime",
                  null,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            sessionInfo: 1,
            organization: 1,
            userCount: {
              total: "$userCount",
              totalConnections: "$totalConnections",
              above5Min: "$usersAbove5Min",
              below5Min: "$usersBelow5Min",
            },
            totalWatchTimeSeconds: "$totalWatchTime",
            totalWatchTimeMinutes: { $divide: ["$totalWatchTime", 60] },
            totalWatchTimeHours: { $divide: ["$totalWatchTime", 3600] },
            avgWatchTimeSeconds: "$avgWatchTime",
            watchTime: {
              avgAbove5MinSeconds: "$avgWatchTimeAbove5Min",
              avgBelow5MinSeconds: "$avgWatchTimeBelow5Min",
              avgAbove5MinMinutes: { $divide: ["$avgWatchTimeAbove5Min", 60] },
              avgBelow5MinMinutes: { $divide: ["$avgWatchTimeBelow5Min", 60] },
            },
          },
        },
      ]

      return await this.mongoAggregate(query)
    } catch (error) {
      console.error("Error in kpiSessionById:", error)
      return error
    }
  }

  async findOrganizationsWithActivity() {
    try {
      return await this.mongoDistinct("organization.id", {
        "organization.id": { $exists: true, $ne: null },
      })
    } catch (error) {
      console.error("Error in findOrganizationsWithActivity:", error)
      return error
    }
  }
}

module.exports = new ActivityLog()
