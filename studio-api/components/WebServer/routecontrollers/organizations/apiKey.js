const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:apiKey",
)
const ms = require("ms")

const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationError, OrganizationUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { UserError, UserUnsupportedMediaType } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)

const { addM2mUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)
const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)
const {
  normalizeEmail,
  parseExternalSubject,
  identityMatches,
  parseBoolean,
} = require(`${process.cwd()}/lib/utility/externalIdentity`)

const { storeFile, defaultPicture, deleteFile, getStorageFolder } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

const ACCEPTED_PICTURE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
]

// Remove a user's custom picture from disk so we do not leak orphan files.
// The default picture is shared with every user without a custom one — it
// must never be deleted.
function deletePictureIfCustom(img) {
  if (!img || img === defaultPicture()) return
  try {
    deleteFile(`${getStorageFolder()}/${img}`)
  } catch (err) {
    debug("Failed to remove API key picture %s: %s", img, err.message)
  }
}

async function checkTokenBelongsToOrganization(params) {
  try {
    // Full document: the public projection has no `type`, which used to turn
    // this check into a no-op (and the condition was inverted).
    const user = await model.users.getById(params.tokenId, true)
    if (user.length !== 1 || user[0].type !== USER_TYPE.M2M) {
      throw new UserError("Requested API key not found")
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
      throw new UserError("Request API key does not belong to the organization")
    }

    return {
      user: user[0],
      organization: organization[0],
    }
  } catch (error) {
    throw error
  }
}
async function createApiKey(req, res, next) {
  try {
    requireParam(req.body.role, OrganizationUnsupportedMediaType, "Role is required")
    const role = parseInt(req.body.role, 10)

    if (isNaN(role) && ROLES.checkValue(role)) {
      throw new OrganizationUnsupportedMediaType("Role value is not valid")
    }
    if (role >= ROLES.ADMIN) {
      throw new OrganizationUnsupportedMediaType(
        "The requested role is too high. Only roles below Admin can be assigned.",
      )
    }

    let token = await TokenHandler.createApiKey(req)
    if (!token) throw new UserError("API key not created")
    await addM2mUserToOrganization(
      req.params.organizationId,
      token.user_id.toString(),
      role,
    )

    res.status(201).send({
      message: "Api key has been created and linked to a new organization",
      ...token,
    })
  } catch (err) {
    next(err)
  }
}

async function listApiKeyFromOrga(req, res, next) {
  try {
    const organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length !== 1)
      throw new OrganizationUnsupportedMediaType("Organization not found")

    const apiKeyUsers = organization[0].users
      .filter((u) => u.type === USER_TYPE.M2M)
      .map((u) => u.userId)

    let apiKeyList = await TokenHandler.listApiKey(
      apiKeyUsers,
      organization[0].users,
    )

    // ?externalSubject=<provider>:<subject> / ?externalEmail=<email>: the
    // keys standing for that external identity (used by provisioning systems
    // to make their upserts idempotent).
    const filter = externalIdentityFilter(req.query)
    if (filter) {
      apiKeyList = apiKeyList.filter((key) =>
        identityMatches(key.metadata?.externalIdentity, filter),
      )
    }

    res.status(200).send(apiKeyList)
  } catch (err) {
    next(err)
  }
}

function externalIdentityFilter(query = {}) {
  const filter = {}
  if (query.externalSubject !== undefined) {
    const parsed = parseExternalSubject(query.externalSubject)
    if (!parsed) {
      throw new UserError("externalSubject must be <provider>:<subject>")
    }
    Object.assign(filter, parsed)
  }
  if (query.externalEmail !== undefined) {
    const email = normalizeEmail(query.externalEmail)
    if (!email) throw new UserError("externalEmail is not a valid email")
    filter.email = email
  }
  return Object.keys(filter).length ? filter : null
}

async function refreshApiKey(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    const tokens = await TokenHandler.refreshApiKey(
      req.params.tokenId,
      req.body.expires_in,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function getApiKey(req, res, next) {
  try {
    await checkTokenBelongsToOrganization(req.params)
    const tokens = await TokenHandler.getApiKey(req.params.tokenId)

    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function deleteApiKey(req, res, next) {
  try {
    const { organization, user } = await checkTokenBelongsToOrganization(
      req.params,
    )

    // ?revoke=true only drops the key's tokens: the machine user stays a
    // member of the organization (listed as expired), so it can be refreshed
    // (PUT) later and past usage keeps its attribution. A plain DELETE
    // removes the membership and the user.
    const revokeOnly = req.query.revoke === "true"
    if (!revokeOnly) {
      // Clean up the custom picture file (if any) before deleting the user
      // so we do not leak orphan files on disk.
      deletePictureIfCustom(user.img)

      organization.users = organization.users.filter(
        (oUser) => oUser.userId !== req.params.tokenId,
      )
      const result = await model.organizations.update(organization)
      if (result.matchedCount === 0) throw new OrganizationError()
    }

    const tokens = await TokenHandler.deleteApiKey(
      req.params.tokenId,
      req.query.revoke,
    )
    res.status(200).send(tokens)
  } catch (err) {
    next(err)
  }
}

async function updateApiKeyPicture(req, res, next) {
  try {
    if (
      !req.files ||
      Object.keys(req.files).length === 0 ||
      !req.files.file
    ) {
      throw new UserUnsupportedMediaType("Image file is required")
    }

    const file = req.files.file
    if (!ACCEPTED_PICTURE_MIME_TYPES.includes(file.mimetype)) {
      throw new UserUnsupportedMediaType(
        `Invalid image type ${file.mimetype}. Accepted: ${ACCEPTED_PICTURE_MIME_TYPES.join(", ")}`,
      )
    }

    const { user } = await checkTokenBelongsToOrganization(req.params)

    const imagePath = await storeFile(file, "picture")

    deletePictureIfCustom(user.img)

    const result = await model.users.update({
      _id: req.params.tokenId,
      img: imagePath,
    })
    if (result.matchedCount === 0) throw new UserError("API key not updated")

    res.status(200).send({
      message: "API key picture updated",
      img: imagePath,
    })
  } catch (err) {
    next(err)
  }
}

// Metadata keys a client may change after creation. The external identity is
// immutable (it IS the key's meaning), and the server-owned keys stay.
const IMMUTABLE_METADATA_KEYS = ["externalIdentity", "createdBy", "organizationId"]

async function updateApiKey(req, res, next) {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : ""
    const hasMetadata =
      req.body.metadata !== undefined && req.body.metadata !== null
    if (!name && !hasMetadata) throw new UserError("Name or metadata is required")

    const { user } = await checkTokenBelongsToOrganization(req.params)

    const values = { _id: req.params.tokenId }
    if (name) values.firstname = name
    if (hasMetadata) {
      const patch = TokenHandler.parseClientMetadata(req.body.metadata)
      for (const key of IMMUTABLE_METADATA_KEYS) {
        if (patch[key] !== undefined) {
          throw new UserError(`metadata.${key} cannot be changed`)
        }
      }
      if (patch.quickMeeting !== undefined) {
        patch.quickMeeting = parseBoolean(patch.quickMeeting)
      }
      values.metadata = { ...(user.metadata || {}), ...patch }
    }

    const result = await model.users.update(values)
    if (result.matchedCount === 0) throw new UserError("API key not updated")

    res.status(200).send({
      message: "API key updated",
      ...(name ? { name } : {}),
      ...(values.metadata ? { metadata: values.metadata } : {}),
    })
  } catch (err) {
    next(err)
  }
}

async function deleteApiKeyPicture(req, res, next) {
  try {
    const { user } = await checkTokenBelongsToOrganization(req.params)

    deletePictureIfCustom(user.img)

    const result = await model.users.update({
      _id: req.params.tokenId,
      img: null,
    })
    if (result.matchedCount === 0) throw new UserError("API key not updated")

    res.status(200).send({ message: "API key picture removed" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createApiKey,
  listApiKeyFromOrga,
  refreshApiKey,
  getApiKey,
  deleteApiKey,
  updateApiKey,
  updateApiKeyPicture,
  deleteApiKeyPicture,
}
