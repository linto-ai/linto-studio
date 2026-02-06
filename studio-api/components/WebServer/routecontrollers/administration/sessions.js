const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:administration:sessions",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {} = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

async function getAllSessionData(req, res, next) {
  try {
    const sessionAlias = await model.sessionData.getAll()
    res.status(200).json(sessionAlias)
  } catch (err) {
    next(err)
  }
}
module.exports = {
  getAllSessionData,
}
