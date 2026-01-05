const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:activity",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const kpiHandler = require("../../controllers/activity/kpiHandlers")

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

module.exports = {
  getActivity,
  getKpiByRessource,
  getKpiBySession,
  refreshSessionKpi,
}
