const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:alias",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {} = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

async function getAllSessionAlias(req, res, next) {
  try {
    const sessionAlias = await model.sessionAlias.getAll()
    res.status(200).json(sessionAlias)
  } catch (err) {
    next(err)
  }
}
module.exports = {
  getAllSessionAlias,
}
