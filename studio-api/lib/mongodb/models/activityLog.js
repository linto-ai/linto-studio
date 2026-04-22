const MongoModel = require("../model")

const VIEWER_THRESHOLD_SECONDS = 300

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
    return await this.mongoInsert(payload)
  }

  async getAll(params) {
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
  }

  async getBySocketId(socketId) {
    return await this.mongoRequest({ "socket.id": socketId })
  }

  async getBySocketAndSession(socketId, sessionId) {
    return await this.mongoRequest({
      "socket.id": socketId,
      "session.sessionId": sessionId,
    })
  }

  async getByUserAndSession(userId, sessionId) {
    return await this.mongoRequest({
      "user.id": userId,
      "session.sessionId": sessionId,
    })
  }

  async getLastByVisitorAndSession(visitorId, sessionId) {
    return await this.mongoRequest(
      {
        "socket.visitorId": visitorId,
        "session.sessionId": sessionId,
      },
      { sort: { timestamp: -1 }, limit: 1 },
    )
  }

  async getLastChannelEvent(sessionId, channelId) {
    try {
      const events = await this.mongoRequest(
        {
          activity: "channel",
          source: "mqtt",
          "session.sessionId": sessionId,
          "channel.channelId": channelId,
        },
        { sort: { timestamp: -1 }, limit: 1 },
      )
      return events?.[0] || null
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getActiveByVisitorId(visitorId) {
    return await this.mongoRequest(
      {
        "socket.visitorId": visitorId,
        lastDisconnectionAt: null,
      },
      { sort: { timestamp: -1 }, limit: 1 },
    )
  }

  async socketReconnect(activity, timestamp, newSocketId = null) {
    const payload = activity.socket
    payload.connectionCount = ++activity.socket.connectionCount
    payload.lastJoinedAt = timestamp
    if (newSocketId) payload.id = newSocketId

    await this.mongoUpdateOne({ _id: activity._id }, "$set", {
      socket: payload,
      timestamp,
      lastDisconnectionAt: null,
    })
  }

  async socketLeft(activity, socket, timestamp) {
    await this.mongoUpdateOne({ _id: activity._id }, "$set", {
      socket,
      timestamp,
      lastDisconnectionAt: new Date().toISOString(),
    })
  }

  async getKpiLlm(orgaId, startDate, endDate) {
    const matchQuery = buildActivityMatchQuery(
      "llm",
      orgaId,
      startDate,
      endDate,
    )

    return await this.mongoAggregate([
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
    ])
  }

  async getKpiTranscription(orgaId, startDate, endDate) {
    const matchQuery = buildActivityMatchQuery(
      "transcription",
      orgaId,
      startDate,
      endDate,
    )

    const groupId = orgaId ? "$organization.id" : null
    return await this.mongoAggregate([
      matchQuery,
      {
        $group: {
          _id: groupId,
          generated: { $sum: 1 },
          duration: { $sum: "$transcription.duration" },
        },
      },
      {
        $project: {
          _id: 0,
          generated: 1,
          duration: 1,
        },
      },
    ])
  }

  async getKpiSession(orgaId, startDate, endDate) {
    const sessionMatchQuery = buildActivityMatchQuery(
      "session",
      orgaId,
      startDate,
      endDate,
    )

    const groupId = orgaId ? "$organization.id" : null
    const sessionQuery = [
      sessionMatchQuery,
      {
        $group: {
          _id: groupId,
          totalConnections: { $sum: 1 },
          watchTime: { $sum: "$socket.totalWatchTime" },
          uniqueSessions: { $addToSet: "$session.sessionId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalConnections: 1,
          watchTime: 1,
          totalSessions: { $size: "$uniqueSessions" },
        },
      },
    ]

    const timestampQuery = {}
    if (startDate) timestampQuery.$gte = startDate
    if (endDate) timestampQuery.$lte = endDate

    const channelMatchQuery = {
      $match: {
        activity: "channel",
        source: "mqtt",
        ...(orgaId && { "organization.id": orgaId }),
        ...(Object.keys(timestampQuery).length > 0 && {
          timestamp: timestampQuery,
        }),
      },
    }

    const channelQuery = [
      channelMatchQuery,
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: {
            sessionId: "$session.sessionId",
            channelId: "$channel.channelId",
          },
          events: {
            $push: {
              action: "$action",
              timestamp: "$timestamp",
            },
          },
        },
      },
    ]

    const [sessionResult, channelGroups] = await Promise.all([
      this.mongoAggregate(sessionQuery),
      this.mongoAggregate(channelQuery),
    ])

    let totalStreamingTime = 0
    for (const group of channelGroups) {
      let mountTime = null
      for (const event of group.events) {
        if (event.action === "mount") {
          mountTime = new Date(event.timestamp)
        } else if (event.action === "unmount" && mountTime) {
          totalStreamingTime += (new Date(event.timestamp) - mountTime) / 1000
          mountTime = null
        }
      }
    }

    if (sessionResult.length > 0) {
      return [
        {
          ...sessionResult[0],
          totalStreamingTime: Math.round(totalStreamingTime),
        },
      ]
    }

    return [
      {
        totalConnections: 0,
        watchTime: 0,
        totalSessions: 0,
        totalStreamingTime: Math.round(totalStreamingTime),
      },
    ]
  }

  async kpiSessionById(sessionId) {
    if (!sessionId) throw new Error("Missing sessionId")

    return await this.mongoAggregate([
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
              $cond: [
                {
                  $gte: ["$socket.totalWatchTime", VIEWER_THRESHOLD_SECONDS],
                },
                1,
                0,
              ],
            },
          },
          usersBelow5Min: {
            $sum: {
              $cond: [
                { $lt: ["$socket.totalWatchTime", VIEWER_THRESHOLD_SECONDS] },
                1,
                0,
              ],
            },
          },
          avgWatchTimeAbove5Min: {
            $avg: {
              $cond: [
                {
                  $gte: ["$socket.totalWatchTime", VIEWER_THRESHOLD_SECONDS],
                },
                "$socket.totalWatchTime",
                null,
              ],
            },
          },
          avgWatchTimeBelow5Min: {
            $avg: {
              $cond: [
                { $lt: ["$socket.totalWatchTime", VIEWER_THRESHOLD_SECONDS] },
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
    ])
  }

  async findSessionsWithActivity(sinceTimestamp) {
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

      const channels = channelGroups.map((group) => {
        let totalDuration = 0
        let mountTime = null
        const mountedAtList = []
        const unmountedAtList = []

        for (const event of group.events) {
          if (event.action === "mount") {
            mountTime = new Date(event.timestamp)
            mountedAtList.push(mountTime)
          } else if (event.action === "unmount") {
            const unmountTime = new Date(event.timestamp)
            unmountedAtList.push(unmountTime)
            if (mountTime) {
              totalDuration += (unmountTime - mountTime) / 1000
              mountTime = null
            }
          }
        }

        return {
          channelId: group.channelId,
          translations: group.translations,
          type: group.type,
          name: group.name,
          description: group.description,
          languages: group.languages,
          region: group.region,
          hasDiarization: group.hasDiarization,
          mountedAt: mountedAtList,
          unmountedAt: unmountedAtList,
          activeDuration: Math.round(totalDuration),
        }
      })

      const totalStreamingTime = channels.reduce(
        (sum, ch) => sum + ch.activeDuration,
        0,
      )
      const allMounts = channels.flatMap((ch) => ch.mountedAt).filter(Boolean)
      const allUnmounts = channels
        .flatMap((ch) => ch.unmountedAt)
        .filter(Boolean)
      const firstMountAt =
        allMounts.length > 0 ? allMounts.sort((a, b) => a - b)[0] : null
      const lastUnmountAt =
        allUnmounts.length > 0 ? allUnmounts.sort((a, b) => b - a)[0] : null

      return {
        channels,
        firstChannelMountAt: firstMountAt,
        lastChannelUnmountAt: lastUnmountAt,
        streaming: {
          totalChannels: channels.length,
          totalStreamingTime,
          averageChannelDuration:
            channels.length > 0
              ? Math.round(totalStreamingTime / channels.length)
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
