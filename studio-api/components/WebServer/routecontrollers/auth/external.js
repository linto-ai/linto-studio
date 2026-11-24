const { exchangeExternalIdentity, resolveExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)

async function resolveIdentity(req, res, next) {
  try {
    res
      .status(200)
      .send(await resolveExternalIdentity(req.body, req.payload.data.userId))
  } catch (err) {
    next(err)
  }
}

async function exchangeToken(req, res, next) {
  try {
    res
      .status(200)
      .send(await exchangeExternalIdentity(req.body, req.payload.data.userId))
  } catch (err) {
    next(err)
  }
}

module.exports = { resolveIdentity, exchangeToken }
