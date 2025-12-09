const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:activity",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const { kpi } = require("../../../../lib/mongodb/models")
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
    const { organizationId } = req.params
    const { startDate, endDate, resource } = req.query
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
        throw new Error("Resource type not supported")
    }

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

async function getKpiBySession(req, res, next) {
  try {
    const { sessionId } = req.params
    const [kpi] = await model.kpi.sessions.getBySessionId(sessionId)
    if (kpi) {
      return res.status(200).json(kpi)
    }
    const [kpiGenerated] = await model.activityLog.kpiSessionById(sessionId)
    return res.status(200).json(kpiGenerated)
  } catch (err) {
    next(err)
  }
}

async function getSessionKpi(req, res, next) {
  try {
    const sessionKpi = await model.kpi.sessions.getAll(req.query)
    res.status(200).json(sessionKpi)
  } catch (err) {
    next(err)
  }
}

async function generateSessionKpi(req, res, next) {
  try {
    const sessionIds = await model.activityLog.findSessionsWithActivity()
    const existingSession = await model.kpi.sessions.getBySessions(sessionIds)
    const missingIds = sessionIds.filter((id) => !existingSession.includes(id))
    missingIds.map(async (sessionId) => {
      const [kpiData] = await model.activityLog.kpiSessionById(sessionId)
      model.kpi.sessions.create(kpiData)
    })

    res.status(201).send({
      message: "KPI generation for sessions in progress",
    })
  } catch (err) {
    next(err)
  }
}

async function generateOrgaKpi(req, res, next) {
  try {
    const orgaId = req.params.organizationId

    let result
    if (req.params.interval === "daily") {
      result = await kpiHandler.getLast7DaysKpi(orgaId)
    } else if (req.params.interval === "monthly") {
      result = await kpiHandler.getLast12MonthsKpi(orgaId)
    }

    res
      .status(201)
      .send({ message: "KPI generated " + req.params.interval, result })
  } catch (err) {
    next(err)
  }
}

async function getKpi(req, res, next) {
  try {
    let result
    if (req.params.interval === "daily") {
      result = await model.kpiDaily.getBy(req.query)
    } else if (req.params.interval === "monthly") {
      result = await model.kpiMontly.getBy(req.query)
    }
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

async function generateKpi(req, res, next) {
  try {
    let orgaIds = await model.activityLog.findOrganizationsWithActivity()

    await orgaIds.map(async (orgaId) => {
      if (req.params.interval === "daily") {
        const daily = await kpiHandler.getLast7DaysKpi(orgaId)
        daily.map((day) => {
          model.kpiDaily.createOrUpdate(day)
        })
      } else if (req.params.interval === "monthly") {
        const monthly = await kpiHandler.getLast12MonthsKpi(orgaId)
        monthly.map((month) => {
          model.kpiMontly.createOrUpdate(month)
        })
      }
    })
    res.status(201).send({
      message: "KPI " + req.params.interval + " generated successfully",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getActivity,
  getKpiByRessource,
  getKpiBySession,
  getSessionKpi,
  generateSessionKpi,
  getKpi,
  generateKpi,
  generateOrgaKpi,
}
