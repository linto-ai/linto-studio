const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations:m2m",
)
const ms = require("ms")

const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const { addM2mUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/machine/token`,
)

async function checkTokenBelongsToOrganization(params) {
  try {
    if (!params.organizationId) throw new OrganizationUnsupportedMediaType()
    if (!params.tokenId)
      throw new OrganizationUnsupportedMediaType("UserId is required")

    const user = await model.users.getById(params.tokenId)
    if (user.length !== 1 || user[0].type === USER_TYPE.M2M) {
      throw new UserError("Requested M2M not found")
    }

    const organization = await model.organizations.getById(
      params.organizationId,
    )
    if (
      organization.length !== 1 ||
      !organization[0].users.find(
        (u) =>
          u.userId.toString() === user[0]._id.toString() &&
          u.type === USER_TYPE.M2M,
      )
    ) {
      throw new UserError("Request M2M id does not belong to the organization")
    }

    return {
      user: user[0],
      organization: organization[0],
    }
  } catch (error) {
    throw error
  }
}
async function createM2MUser(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()
    if (!req.body.role)
      throw new OrganizationUnsupportedMediaType("Role is required")
    const role = parseInt(req.body.role, 10)

    if (isNaN(role) && ROLES.checkValue(role)) {
      throw new OrganizationUnsupportedMediaType("Role value is not valid")
    }
    if (role >= ROLES.ADMIN) {
      throw new OrganizationUnsupportedMediaType(
        "Cannot assign a role higher than Admin",
      )
    }

    let token = await TokenHandler.createM2MUser(req, role)
    if (!token) throw new UserError("M2M user not created")
    addM2mUserToOrganization(
      req.params.organizationId,
      token.user_id.toString(),
      role,
    )

    res.status(201).send({
      message: "M2M user has been created and linked to a new organization",
      ...token,
    })
  } catch (err) {
    next(err)
  }
}

async function listM2M(req, res, next) {
  try {
    if (!req.params.organizationId) throw new OrganizationUnsupportedMediaType()
    const organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length !== 1)
      throw new OrganizationUnsupportedMediaType("Organization not found")

    const m2mUsers = organization[0].users.filter(
      (u) => u.type === USER_TYPE.M2M,
    )
    res.status(200).send(m2mUsers)
  } catch (err) {
    next(err)
  }
}

async function refreshM2MToken(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    const tokens = await TokenHandler.refreshM2MToken(
      req.params.tokenId,
      req.body.expires_in,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function getM2MTokens(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    const tokens = await TokenHandler.getM2MTokens(req.params.tokenId)

    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function deleteM2Token(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
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
  createM2MUser,
  listM2M,
  refreshM2MToken,
  getM2MTokens,
  deleteM2Token,
}
