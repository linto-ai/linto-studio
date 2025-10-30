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
module.exports = {
  getActivity,
}
