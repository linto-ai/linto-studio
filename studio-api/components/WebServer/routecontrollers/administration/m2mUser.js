const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:m2m",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { UserConflict, UserError, UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/machine/token`,
)
async function createM2MPlatformUser(req, res, next) {
  try {
    req.body.role = parseInt(req.body.role)

    if (!PLATFORM_ROLE.isValid(req.body.role))
      throw new UserUnsupportedMediaType("Role invalid")

    let token = await TokenHandler.createM2MUser(req, req.body.role)
    if (token === undefined) return res.status(500).send()

    res.status(201).send({
      message: "M2M user has been created",
      ...token,
    })
  } catch (err) {
    next(err)
  }
}

async function listM2MUser(req, res, next) {
  try {
    res.status(200).send(await model.users.listM2MUser())
  } catch (err) {
    next(err)
  }
}

async function getM2MTokens(req, res, next) {
  try {
    const tokens = await TokenHandler.getM2MTokens(req.params.tokenId)

    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function refreshM2MToken(req, res, next) {
  try {
    const tokens = await TokenHandler.refreshM2MToken(
      req.params.tokenId,
      req.body.expires_in,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function deleteM2Token(req, res, next) {
  try {
    const tokens = await TokenHandler.deleteM2Token(
      req.params.tokenId,
      req.query.revoke,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createM2MPlatformUser,
  listM2MUser,
  getM2MTokens,
  refreshM2MToken,
  deleteM2Token,
}
