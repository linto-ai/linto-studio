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
        lastDisconnectionAt: new Date().toISOString(),
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
            firstConnectionAt: { $min: "$firstConnectionAt" },
            lastDisconnectionAt: { $max: "$lastDisconnectionAt" },
            userCount: { $sum: 1 },
            session: { $first: "$session" },
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
            sessionId: "$session.sessionId",
            organizationId: "$organization.id",
            session: {
              name: "$session.name",
              visibility: "$session.visibility",
            },
            userCount: {
              total: "$userCount",
              reconnections: "$totalConnections",
              above5Min: "$usersAbove5Min",
              below5Min: "$usersBelow5Min",
            },
            watchTime: {
              total: "$totalWatchTime",
              average: "$avgWatchTime",
              avgAbove5Min: "$avgWatchTimeAbove5Min",
              avgUnder5Min: "$avgWatchTimeBelow5Min",
            },
            firstConnectionAt: 1,
            lastDisconnectionAt: 1,
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

  async findSessionsWithActivity(sinceTimestamp) {
    try {
      const query = {
        "session.sessionId": { $exists: true, $ne: null },
      }
      if (sinceTimestamp) {
        const iso =
          sinceTimestamp instanceof Date
            ? sinceTimestamp.toISOString()
            : new Date(sinceTimestamp).toISOString()

        query.timestamp = { $gt: iso }
      }

      return await this.mongoDistinct("session.sessionId", query)
    } catch (error) {
      console.error("Error in findSessionInActivity:", error)
      return error
    }
  }

  async aggregateChannelMetrics(sessionId) {
    try {
      const query = [
        {
          $match: {
            activity: "channel",
            "session.sessionId": sessionId,
          },
        },
        { $sort: { timestamp: 1 } },
        {
          $group: {
            _id: "$channel.channelId",
            channelId: { $first: "$channel.channelId" },
            translations: { $first: "$channel.translations" },
            // Transcriber profile fields (flattened in channel)
            type: { $first: "$channel.type" },
            name: { $first: "$channel.name" },
            description: { $first: "$channel.description" },
            languages: { $first: "$channel.languages" },
            region: { $first: "$channel.region" },
            hasDiarization: { $first: "$channel.hasDiarization" },
            events: {
              $push: {
                action: "$action",
                timestamp: "$timestamp",
              },
            },
            firstMountAt: {
              $min: {
                $cond: [{ $eq: ["$action", "mount"] }, "$timestamp", null],
              },
            },
            lastUnmountAt: {
              $max: {
                $cond: [{ $eq: ["$action", "unmount"] }, "$timestamp", null],
              },
            },
          },
        },
      ]

      const channelGroups = await this.mongoAggregate(query)

      // Calculate durations from event pairs
      const channels = channelGroups.map((group) => {
        let totalDuration = 0
        let mountTime = null

        for (const event of group.events) {
          if (event.action === "mount") {
            mountTime = new Date(event.timestamp)
          } else if (event.action === "unmount" && mountTime) {
            totalDuration += (new Date(event.timestamp) - mountTime) / 1000
            mountTime = null
          }
        }

        return {
          channelId: group.channelId,
          translations: group.translations,
          // Transcriber profile fields (flattened)
          type: group.type,
          name: group.name,
          description: group.description,
          languages: group.languages,
          region: group.region,
          hasDiarization: group.hasDiarization,
          // Timing metrics
          mountedAt: group.firstMountAt ? new Date(group.firstMountAt) : null,
          unmountedAt: group.lastUnmountAt
            ? new Date(group.lastUnmountAt)
            : null,
          activeDuration: Math.round(totalDuration),
        }
      })

      // Calculate aggregate metrics
      const totalActiveDuration = channels.reduce(
        (sum, ch) => sum + ch.activeDuration,
        0,
      )
      const firstMountAt = channels
        .filter((ch) => ch.mountedAt)
        .sort((a, b) => a.mountedAt - b.mountedAt)[0]?.mountedAt
      const lastUnmountAt = channels
        .filter((ch) => ch.unmountedAt)
        .sort((a, b) => b.unmountedAt - a.unmountedAt)[0]?.unmountedAt

      return {
        channels,
        firstChannelMountAt: firstMountAt,
        lastChannelUnmountAt: lastUnmountAt,
        streaming: {
          totalChannels: channels.length,
          totalActiveDuration,
          averageChannelDuration:
            channels.length > 0
              ? Math.round(totalActiveDuration / channels.length)
              : 0,
        },
      }
    } catch (error) {
      console.error("Error in aggregateChannelMetrics:", error)
      return null
    }
  }
}

module.exports = new ActivityLog()
