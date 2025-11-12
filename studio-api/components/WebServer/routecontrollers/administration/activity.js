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
    const { orgaId, activity } = req.params

    let result
    switch (activity) {
      case "llm":
        result = await model.activityLog.getKpiLlm(orgaId)
        break
      case "transcription":
        result = await model.activityLog.getKpiTranscription(orgaId)
        break
      case "session":
        result = await model.activityLog.getKpiSession(orgaId)
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

module.exports = {
  getActivity,
  getKpiByActivity,
  getKpiBySession,
}
