const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:activity",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const kpiHandler = require("../../controllers/activity/kpiHandlers")
const kpiExport = require("../../controllers/activity/kpiExport")

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
    //TODO: rework if no orgaId
    // const { organizationId } = req.params
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
    const { step, organizationId, startDate, endDate } = req.query

    // Validate date range if both dates are provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: "Invalid date range: startDate must be before endDate",
      })
    }

    const granularity = step || "daily"
    const result = await kpiHandler.getKpiByDateRange(
      organizationId,
      startDate,
      endDate,
      granularity,
    )

    res.status(200).json({
      step: granularity,
      data: result,
    })
  } catch (err) {
    next(err)
  }
}

async function exportKpiSessions(req, res, next) {
  try {
    const { format, organizationId, startDate, endDate } = req.query

    // Validate format
    const validFormats = ["json", "csv", "xls"]
    if (!format || !validFormats.includes(format)) {
      return res.status(400).json({
        error: `Invalid format. Must be one of: ${validFormats.join(", ")}`,
      })
    }

    // Validate date range if both provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: "Invalid date range: startDate must be before endDate",
      })
    }

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

    // Generate filename with current date
    const dateStr = new Date().toISOString().split("T")[0]
    const filename = `kpi-sessions-${dateStr}`

    // Return appropriate format
    switch (format) {
      case "json":
        // Return raw database data for JSON
        res.setHeader("Content-Type", "application/json")
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}.json"`,
        )
        return res.json(sessionKpiList.list)

      case "csv":
        // Transform data (flatten since each session may have multiple channel rows)
        const csvData = sessionKpiList.list.flatMap(kpiExport.transformSessionData)
        const csvContent = kpiExport.generateCsv(csvData)
        res.setHeader("Content-Type", "text/csv; charset=utf-8")
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}.csv"`,
        )
        return res.send(csvContent)

      case "xls":
        // Transform data (flatten since each session may have multiple channel rows)
        const xlsData = sessionKpiList.list.flatMap(kpiExport.transformSessionData)
        const xlsxBuffer = await kpiExport.generateXlsx(xlsData)
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}.xlsx"`,
        )
        return res.send(Buffer.from(xlsxBuffer))
    }
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
  exportKpiSessions,
}
