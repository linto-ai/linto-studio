const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:administration:activity",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const kpiHandler = require("../../controllers/activity/kpiHandlers")
const kpiExport = require("../../controllers/activity/kpiExport")
const kpiSeriesExport = require("../../controllers/activity/kpiSeriesExport")
const activityExport = require("../../controllers/activity/activityExport")
const exportResponse = require("../../controllers/activity/exportResponse")

/**
 * Validate an optional date range. Sends a 400 response and returns true when
 * startDate is after endDate.
 */
function isInvalidDateRange(startDate, endDate, res) {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    res.status(400).json({
      error: "Invalid date range: startDate must be before endDate",
    })
    return true
  }
  return false
}

async function getActivity(req, res, next) {
  try {
    const activity = await model.activityLog.getAll(req.query)
    res.status(200).json(activity)
  } catch (err) {
    next(err)
  }
}

async function getKpiByRessource(req, res, next) {
  try {
    const { startDate, endDate, resource, organizationId } = req.query

    let result
    switch (resource) {
      case "llm":
        result = await model.activityLog.getKpiLlm(
          organizationId,
          startDate,
          endDate,
        )
        break
      case "transcription":
        result = await model.activityLog.getKpiTranscription(
          organizationId,
          startDate,
          endDate,
        )
        break
      case "session":
        result = await model.activityLog.getKpiSession(
          organizationId,
          startDate,
          endDate,
        )
        break
      default:
        result = await kpiHandler.generateKpi(
          organizationId,
          startDate,
          endDate,
        )
        break
    }

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

async function getKpiBySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const [kpiGenerated] = await model.activityLog.kpiSessionById(sessionId)

    // Aggregate channel metrics and merge into KPI data
    const channelMetrics =
      await model.activityLog.aggregateChannelMetrics(sessionId)
    if (channelMetrics) {
      Object.assign(kpiGenerated, channelMetrics)
    }

    return res.status(200).json(kpiGenerated)
  } catch (err) {
    next(err)
  }
}

async function refreshSessionKpi(req, res, next) {
  try {
    // 1. Retrieve the most recent KPI entry (used as baseline timestamp)
    const [lastKpi] = await model.kpi.sessions.getLastKpi()

    // 2. Find all sessions with new activity after the last KPI timestamp
    const sessionIds = await model.activityLog.findSessionsWithActivity(
      lastKpi?.timestamp,
    )

    // 3. Retrieve existing KPI entries for those sessions (if any)
    const existingSession = await model.kpi.sessions.getBySessions(sessionIds)

    // 4. Delete outdated KPI entries for sessions that had new activity
    await model.kpi.sessions.deleteSessions(existingSession)

    // 5. Recompute KPI for each session with new activity
    await Promise.all(
      sessionIds.map(async (sessionId) => {
        const [kpiData] = await model.activityLog.kpiSessionById(sessionId)

        // Aggregate channel metrics and merge into KPI data
        const channelMetrics =
          await model.activityLog.aggregateChannelMetrics(sessionId)
        if (channelMetrics) {
          Object.assign(kpiData, channelMetrics)
        }

        await model.kpi.sessions.create(kpiData)
      }),
    )

    // 6. Fetch and return the full list of updated session KPI
    const sessionKpi = await model.kpi.sessions.getAll(req.query)
    res.status(200).json(sessionKpi)
  } catch (err) {
    next(err)
  }
}

async function getKpiSeries(req, res, next) {
  try {
    const { step, organizationId, userId, startDate, endDate } = req.query

    if (isInvalidDateRange(startDate, endDate, res)) return

    const granularity = step || "daily"
    const result = await kpiHandler.getKpiByDateRange(
      organizationId,
      startDate,
      endDate,
      granularity,
      userId,
    )

    res.status(200).json({
      step: granularity,
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

async function exportKpiSeries(req, res, next) {
  try {
    const { format, step, organizationId, userId, startDate, endDate } =
      req.query

    if (exportResponse.isInvalidFormat(format, res)) return
    if (isInvalidDateRange(startDate, endDate, res)) return

    const granularity = step || "daily"
    const series = await kpiHandler.getKpiByDateRange(
      organizationId,
      startDate,
      endDate,
      granularity,
      userId,
    )

    const dateStr = new Date().toISOString().split("T")[0]

    return await exportResponse.sendExport(res, format, {
      filename: `kpi-series-${granularity}-${dateStr}`,
      list: series,
      toRows: (list) => list.map(kpiSeriesExport.transformSeriesPoint),
      generateCsv: kpiSeriesExport.generateCsv,
      generateXlsx: kpiSeriesExport.generateXlsx,
    })
  } catch (err) {
    next(err)
  }
}

async function exportKpiSessions(req, res, next) {
  try {
    const { format, organizationId, startDate, endDate } = req.query

    if (exportResponse.isInvalidFormat(format, res)) return
    if (isInvalidDateRange(startDate, endDate, res)) return

    // Build query params
    const queryParams = {}
    if (organizationId) queryParams.organizationId = organizationId
    if (startDate) queryParams.startDate = startDate
    if (endDate) queryParams.endDate = endDate

    // Fetch all session KPI data (no pagination for export)
    const sessionKpiList = await model.kpi.sessions.getBy({
      ...queryParams,
      size: 10000, // Large limit for export
      page: 0,
    })

    const dateStr = new Date().toISOString().split("T")[0]

    return await exportResponse.sendExport(res, format, {
      filename: `kpi-sessions-${dateStr}`,
      list: sessionKpiList.list,
      // Flatten since each session may have multiple channel rows
      toRows: (list) => list.flatMap(kpiExport.transformSessionData),
      generateCsv: kpiExport.generateCsv,
      generateXlsx: kpiExport.generateXlsx,
    })
  } catch (err) {
    next(err)
  }
}

async function exportActivity(req, res, next) {
  try {
    const { format } = req.query

    if (exportResponse.isInvalidFormat(format, res)) return

    // Forward the same filters as the list endpoint (source, scope, user.id...),
    // dropping pagination so the export contains the full matching dataset.
    const filters = { ...req.query }
    delete filters.format

    const activity = await model.activityLog.getAll({
      ...filters,
      size: 10000, // Large limit for export
      page: 0,
    })

    const dateStr = new Date().toISOString().split("T")[0]
    const scopeLabel = req.query.scope || req.query.source || "activity"

    return await exportResponse.sendExport(res, format, {
      filename: `activity-${scopeLabel}-${dateStr}`,
      list: activity?.list || [],
      toRows: (list) => list.map(activityExport.transformActivityLog),
      generateCsv: activityExport.generateCsv,
      generateXlsx: activityExport.generateXlsx,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getActivity,
  getKpiByRessource,
  getKpiBySession,
  refreshSessionKpi,
  getKpiSeries,
  exportKpiSeries,
  exportKpiSessions,
  exportActivity,
}
