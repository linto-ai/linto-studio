const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:organizations:m2m",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)
const TokenGenerator = require(
  `${process.cwd()}/components/WebServer/config/passport/token/generator`,
)
const { UserError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const { addM2mUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

async function generateM2MToken(userId, token) {
  try {
    const user = await model.users.getById(userId, true)
    if (user.length !== 1) throw new UserNotFound()

    let token_salt
    if (token === undefined) {
      token_salt = require("randomstring").generate(12)
      token = await model.tokens.insert(user[0]._id, token_salt)
    } else {
      token_salt = token.salt
    }

    let tokenData = {
      salt: token_salt,
      tokenId: token.insertedId || token._id.toString(),
      userId: user[0]._id,
      role: user[0].role,
    }

    return TokenGenerator(tokenData, {
      expires_in: "7d" || process.env.EXTENDED_TOKEN_DAYS_TIME,
    })
  } catch (error) {
    throw error
  }
}

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

    const createdUser = await model.users.createM2MUser({
      firstname: req.body.name,
    })
    if (createdUser.insertedCount !== 1) throw new UserError()

    addM2mUserToOrganization(
      req.params.organizationId,
      createdUser.insertedId.toString(),
      role,
    )

    const m2mToken = await generateM2MToken(createdUser.insertedId.toString())
    res.status(201).send({
      message: "M2M user has been created and linked to a new organization",
      ...m2mToken,
    })
  } catch (err) {
    next(err)
  }
}

async function refreshM2MToken(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    await model.tokens.deleteAllUserTokens(req.params.tokenId)

    res.status(200).send({
      message: "M2M token has been refreshed",
      ...(await generateM2MToken(req.params.tokenId)),
    })
  } catch (err) {
    next(err)
  }
}

async function getM2MTokens(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    const tokens = await model.tokens.getTokenByUser(req.params.tokenId)

    res.status(200).send({
      message: "M2M tokens have been retrieved",
      ...(await generateM2MToken(req.params.tokenId, tokens[0])),
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

async function deleteM2Token(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    await model.tokens.deleteAllUserTokens(req.params.tokenId)

    if (req.query.revoke === "true") {
      res.status(200).send({
        message: "M2M token has been revoked",
      })
    } else {
      await model.tokens.deleteAllUserTokens(req.params.tokenId)
      await model.users.delete(req.params.tokenId)
      res.status(200).send({
        message: "M2M token has been deleted",
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createM2MUser,
  listM2M,
  refreshM2MToken,
  generateM2MToken,
  getM2MTokens,
  deleteM2Token,
}
