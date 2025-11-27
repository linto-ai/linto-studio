const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:loggin",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

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

    let result, date
    if (req.query.timestamp) {
      date = req.query.timestamp
    }

    switch (activity) {
      case "llm":
        result = await model.activityLog.getKpiLlm(organizationId, date)
        break
      case "transcription":
        result = await model.activityLog.getKpiTranscription(
          organizationId,
          date,
        )
        break
      case "session":
        result = await model.activityLog.getKpiSession(organizationId, date)
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

async function generateKpi(req, res, next) {
  try {
    const orgaIds = await model.activityLog.findOrganizationsWithActivity()

    orgaIds.map(async (orgaId) => {
      const oldKpi = await model.kpi.getByOrgaId(orgaId)

      let date = undefined
      if (oldKpi.length > 0) {
        date = oldKpi[0].timestamp
      }

      let activityKpi = {
        organization: {
          id: orgaId,
        },
        llm: (await model.activityLog.getKpiLlm(orgaId, date))[0],
        transcription: (
          await model.activityLog.getKpiTranscription(orgaId, date)
        )[0],
        session: (await model.activityLog.getKpiSession(orgaId, date))[0],
        timestamp: new Date().toISOString(),
      }

      if (oldKpi.length === 0) {
        await model.kpi.create(activityKpi)
      } else {
        const updatedKpi = mergeKpi(oldKpi[0], activityKpi)
        await model.kpi.update(updatedKpi)
      }
    })

    // Clean up processed activity logs ?
    res.status(201).send({ message: "KPI stored successfully" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getActivity,
  getKpiByActivity,
  getKpiBySession,
  generateKpi,
}
