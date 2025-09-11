const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:alias",
)

const crypto = require("crypto")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const getSlug = require("speakingurl")

const {
  SessionNotFound,
  SessionForbidden,
  SessionUnsupportedMediaType,
  SessionConflict,
} = require(`${process.cwd()}/components/WebServer/error/exception/session`)

function hashPassword(password) {
  const derivedKey = crypto
    .pbkdf2Sync(password, process.env.SESSION_PSW_SALT, 100000, 64, "sha512")
    .toString("hex")
  return derivedKey
}

async function createSessionAlias(req, res, next) {
  try {
    let { sessionId, name, password } = req.body
    if (!sessionId) throw new SessionUnsupportedMediaType()

    if (!name && !password) {
      throw new SessionUnsupportedMediaType(
        "Either name or password must be provided",
      )
    }
    if (name) {
      name = getSlug(name, { lang: "en" })

      const existingSession = await model.sessionAlias.getByName(name)
      if (existingSession.length > 0)
        throw new SessionConflict(
          `Session alias with the name ${name} already exists`,
        )
    }

    try {
      await axios.get(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      throw new SessionNotFound("Session not found")
    }
    const sessionData = {
      sessionId,
      organizationId: req.params.organizationId,
    }
    if (name) sessionData.name = name
    if (password) sessionData.password = hashPassword(password)

    await model.sessionAlias.create(sessionData)

    const response = {
      message: "Alias created successfully",
      sessionId,
    }
    if (name) response.name = name

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

async function getSessionAlias(req, res, next) {
  try {
    const { organizationId } = req.params
    const sessionAlias = await model.sessionAlias.getByOrganization(
      organizationId,
      req.query,
    )

    res.status(200).json(sessionAlias)
  } catch (err) {
    next(err)
  }
}

async function getSessionAliasById(req, res, next) {
  try {
    const { id, organizationId } = req.params
    const sessionAlias = await model.sessionAlias.getByOrganizationAndId(
      organizationId,
      id,
    )
    if (sessionAlias.length === 0) throw new SessionNotFound("Alias not found")
    res.status(200).json(sessionAlias[0])
  } catch (err) {
    next(new SessionNotFound("Alias not found"))
  }
}

async function deleteSessionAlias(req, res, next) {
  try {
    const { id } = req.params
    const sessionAlias = await model.sessionAlias.getById(id)
    if (sessionAlias.length === undefined || sessionAlias.length === 0)
      throw new SessionNotFound("Alias not found")

    if (sessionAlias[0].organizationId !== req.params.organizationId)
      throw new SessionForbidden()

    await model.sessionAlias.delete(id)
    res.status(200).json({
      message: "Alias deleted",
    })
  } catch (err) {
    next(err)
  }
}

async function updateSessionAlias(req, res, next) {
  try {
    const { id } = req.params
    let { name, password } = req.body
    const updateData = {}

    const sessionAlias = await model.sessionAlias.getByOrganizationAndId(
      req.params.organizationId,
      id,
    )

    if (sessionAlias.length === 0) throw new SessionNotFound()
    if (!name && !password) throw new SessionUnsupportedMediaType()
    if (name !== undefined) {
      name = getSlug(req.body.name, { lang: "en" })

      const existingSession = await model.sessionAlias.getByName(name)
      if (existingSession.length > 0)
        throw new SessionConflict("Alias already exists")
      updateData.name = name
    }
    if (password !== undefined) {
      updateData.password = hashPassword(password)
    }

    await model.sessionAlias.update(id, updateData)

    res.status(200).json({
      message: "Session updated",
      ...(updateData.name ? { name: updateData.name } : {}),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSessionAliasById,
  getSessionAlias,
  createSessionAlias,
  deleteSessionAlias,
  updateSessionAlias,
}
