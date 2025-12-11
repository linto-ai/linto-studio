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

async function getSessionKpi(req, res, next) {
  try {
    const sessionIds = await model.activityLog.findSessionsWithActivity()
    const existingSession = await model.kpi.sessions.getBySessions(sessionIds)
    const missingIds = sessionIds.filter((id) => !existingSession.includes(id))
    await Promise.all(
      missingIds.map(async (sessionId) => {
        const [kpiData] = await model.activityLog.kpiSessionById(sessionId)
        await model.kpi.sessions.create(kpiData)
      }),
    )

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
  getSessionKpi,
}
