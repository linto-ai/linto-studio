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

async function getKpiByActivity(req, res, next) {
  try {
    const { organizationId, activity } = req.params
    const { startDate, endDate } = req.query
    let result
    switch (activity) {
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
        throw new Error("Activity type not supported")
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

async function generateOrgaDailyKpi(req, res, next) {
  try {
    let daily = await kpiHandler.getLast7DaysKpi(req.params.organizationId)
    res.status(201).send({ message: "Daily KPI generated successfully", daily })
  } catch (err) {
    next(err)
  }
}

async function generateOrgaMonthlyKpi(req, res, next) {
  try {
    let monthly = await kpiHandler.getLast12MonthsKpi(req.params.organizationId)
    res
      .status(201)
      .send({ message: "Daily KPI generated successfully", monthly })
  } catch (err) {
    next(err)
  }
}

async function generateDailyKpi(req, res, next) {
  try {
    let orgaIds = await model.activityLog.findOrganizationsWithActivity()

    await orgaIds.map(async (orgaId) => {
      const daily = await kpiHandler.getLast7DaysKpi(orgaId)
      daily.map((day) => {
        model.kpiDaily.createOrUpdate(day)
      })
    })
    res.status(201).send({ message: "Daily KPI generated successfully" })
  } catch (err) {
    next(err)
  }
}

async function getDailyKpi(req, res, next) {
  try {
    const result = await model.kpiDaily.getBy(req.query)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

async function generateMonthlyKpi(req, res, next) {
  try {
    let orgaIds = await model.activityLog.findOrganizationsWithActivity()

    await orgaIds.map(async (orgaId) => {
      const monthly = await kpiHandler.getLast12MonthsKpi(orgaId)
      monthly.map((month) => {
        model.kpiMontly.createOrUpdate(month)
      })
    })
    res.status(201).send({ message: "Montly KPI generated successfully" })
  } catch (err) {
    next(err)
  }
}

async function getMonthlyKpi(req, res, next) {
  try {
    const result = await model.kpiMontly.getBy(req.query)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
module.exports = {
  getActivity,
  getKpiByActivity,
  getKpiBySession,
  generateOrgaDailyKpi,
  generateOrgaMonthlyKpi,
  generateDailyKpi,
  getDailyKpi,
  generateMonthlyKpi,
  getMonthlyKpi,
}
