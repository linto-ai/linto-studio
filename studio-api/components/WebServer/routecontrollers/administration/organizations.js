const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function listAllOrganization(req, res, next) {
  try {
    const organizations = await model.organizations.getAll()
    return res.status(200).send(organizations)
  } catch (err) {
    next(err)
  }
}

async function deleteOrganization(req, res, next) {
  try {
  } catch (err) {
    next(err)
  }
}

async function addUserInOrganization(req, res, next) {
  try {
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listAllOrganization,
  deleteOrganization,
  addUserInOrganization,
}
