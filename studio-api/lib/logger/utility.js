const debug = require("debug")("linto:lib:logger:utility")

function calculateWatchTime(activityLog, ctx) {
  if (!activityLog?.socket?.lastJoinedAt) return activityLog.socket

  const joinedAt = new Date(activityLog.socket.lastJoinedAt)
  const durationMs = new Date(ctx.timestamp) - joinedAt
  const durationSeconds = Math.max(0, Math.round(durationMs / 1000))

  const payload = activityLog.socket
  payload.totalWatchTime = activityLog.socket.totalWatchTime + durationSeconds

  delete payload.lastLeftAt
  delete payload.lastJoinedAt
  return payload
}

function reduceToLastActivity(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) return null
  return logs.reduce((latest, current) =>
    new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest,
  )
}

module.exports = {
  calculateWatchTime,
  reduceToLastActivity,
}
