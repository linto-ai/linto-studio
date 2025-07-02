const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:alias",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { SessionNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)
const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

async function getSessionMetric(req, res, next) {
  try {
    const metrics = await model.metrics.getBySession(req.params.sessionId)
    if (!metrics || metrics.length === 0) {
      throw new SessionNotFound()
    }

    const metric = calculateMetrics(metrics)
    res.status(200).json(metric)
  } catch (err) {
    next(err)
  }
}

async function getOrganizationMetric(req, res, next) {
  try {
    const metrics = await model.metrics.getByOrganization(
      req.params.organizationId,
    )
    if (!metrics || metrics.length === 0) {
      throw new OrganizationNotFound()
    }
    const metric = calculateMetrics(metrics)

    res.status(200).json(metric)
  } catch (err) {
    next(err)
  }
}

function calculateMetrics(metrics) {
  let watchTimeMs = 0
  let watchEntries = metrics.length

  for (const entry of metrics) {
    if (entry.startTime && entry.endTime) {
      const start = new Date(entry.startTime)
      const end = new Date(entry.endTime)
      const duration = end - start // in milliseconds
      if (duration > 0) {
        watchTimeMs += duration
      }
    }
  }

  return {
    watchEntries,
    watchTimeMs,
    watchTimeSeconds: Math.floor(watchTimeMs / 1000),
  }
}

module.exports = {
  getSessionMetric,
  getOrganizationMetric,
}
