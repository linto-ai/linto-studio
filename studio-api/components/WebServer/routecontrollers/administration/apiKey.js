const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:administration:m2m",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const PLATFORM_ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)
async function createApiKeyPlatform(req, res, next) {
  try {
    req.body.role = parseInt(req.body.role)

    if (!PLATFORM_ROLE.isValid(req.body.role))
      throw new UserUnsupportedMediaType("Role invalid")

    let token = await TokenHandler.createApiKey(req, req.body.role)
    if (token === undefined) return res.status(500).send()

    res.status(201).send({
      message: "API Key has been created",
      ...token,
    })
  } catch (err) {
    next(err)
  }
}

async function listApiKey(req, res, next) {
  try {
    res.status(200).send(await model.users.listApiKey())
  } catch (err) {
    next(err)
  }
}

async function getApiKey(req, res, next) {
  try {
    const tokens = await TokenHandler.getApiKey(req.params.tokenId)

    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function refreshApiKey(req, res, next) {
  try {
    const tokens = await TokenHandler.refreshApiKey(
      req.params.tokenId,
      req.body.expires_in,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function deleteApiKey(req, res, next) {
  try {
    const tokens = await TokenHandler.deleteApiKey(
      req.params.tokenId,
      req.query.revoke,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createApiKeyPlatform,
  listApiKey,
  getApiKey,
  refreshApiKey,
  deleteApiKey,
}
