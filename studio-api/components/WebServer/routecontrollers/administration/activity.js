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
    const result = await model.activityLog.kpiSessionById(sessionId)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

function mergeKpi(oldKpi, newKpi) {
  // clone old KPI → base object
  const merged = {
    ...oldKpi,
    timestamp: newKpi.timestamp || new Date().toISOString(),
  }

  // ---- LLM ----
  if (newKpi.llm) {
    merged.llm = {
      totalGenerations:
        (oldKpi.llm?.totalGenerations || 0) +
        (newKpi.llm.totalGenerations || 0),
      totalContentLength:
        (oldKpi.llm?.totalContentLength || 0) +
        (newKpi.llm.totalContentLength || 0),
    }
  }

  // ---- TRANSCRIPTION ----
  if (newKpi.transcription) {
    merged.transcription = {
      totalTranscriptions:
        (oldKpi.transcription?.totalTranscriptions || 0) +
        (newKpi.transcription.totalTranscriptions || 0),
      totalDurationSeconds:
        (oldKpi.transcription?.totalDurationSeconds || 0) +
        (newKpi.transcription.totalDurationSeconds || 0),
      totalHours:
        (oldKpi.transcription?.totalHours || 0) +
        (newKpi.transcription.totalHours || 0),
    }
  }

  // ---- SESSION ----
  if (newKpi.session) {
    const totalSessions =
      (oldKpi.session?.totalSessions || 0) + (newKpi.session.totalSessions || 0)

    const totalWatchTimeHours =
      (oldKpi.session?.totalWatchTimeHours || 0) +
      (newKpi.session.totalWatchTimeHours || 0)

    merged.session = {
      totalSessions,
      totalWatchTimeHours,
      avgWatchTimeMinutes:
        totalSessions > 0 ? (totalWatchTimeHours * 60) / totalSessions : 0,
    }
  }

  return merged
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
  getKpi,
  generateKpi,
  generateOrgaKpi,
}
