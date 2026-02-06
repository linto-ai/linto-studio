const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:session:data",
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

async function createSessionData(req, res, next) {
  try {
    let { sessionId, name, password } = req.body
    if (!sessionId) throw new SessionUnsupportedMediaType()

    const existingData = await model.sessionData.getBySessionId(sessionId)
    if (existingData.length > 0)
      throw new SessionConflict("Session data already exists for this session")

    if (!name && !password) {
      throw new SessionUnsupportedMediaType(
        "Either name or password must be provided",
      )
    }
    if (name) {
      name = getSlug(name, { lang: "en" })

      const existingSession = await model.sessionData.getByName(name)
      if (existingSession.length > 0)
        throw new SessionConflict(
          `Session data with the name ${name} already exists`,
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

    await model.sessionData.create(sessionData)

    const response = {
      message: "Session data created successfully",
      sessionId,
    }
    if (name) response.name = name

    res.status(201).json(response)
  } catch (err) {
    next(err)
  }
}

async function getSessionData(req, res, next) {
  try {
    const { organizationId } = req.params
    const sessionData = await model.sessionData.getByOrganization(
      organizationId,
      req.query,
    )

    res.status(200).json(sessionData)
  } catch (err) {
    next(err)
  }
}

async function getSessionDataById(req, res, next) {
  try {
    const { id, organizationId } = req.params
    const sessionData = await model.sessionData.getByOrganizationAndId(
      organizationId,
      id,
    )
    if (sessionData.length === 0) throw new SessionNotFound("Session not found")
    res.status(200).json(sessionData[0])
  } catch (err) {
    next(new SessionNotFound("Session not found"))
  }
}

async function deleteSessionData(req, res, next) {
  try {
    const { id } = req.params
    const sessionData = await model.sessionData.getById(id)
    if (sessionData.length === undefined || sessionData.length === 0)
      throw new SessionNotFound("Session not found")

    if (sessionData[0].organizationId !== req.params.organizationId)
      throw new SessionForbidden()

    await model.sessionData.delete(id)
    res.status(200).json({
      message: "Session data deleted",
    })
  } catch (err) {
    next(err)
  }
}

async function updateSessionData(req, res, next) {
  try {
    const { id } = req.params
    let { name, password } = req.body
    const updateData = {}

    const sessionData = await model.sessionData.getByOrganizationAndId(
      req.params.organizationId,
      id,
    )

    if (sessionData.length === 0) throw new SessionNotFound()
    if (!name && !password) throw new SessionUnsupportedMediaType()
    if (name !== undefined) {
      name = getSlug(req.body.name, { lang: "en" })

      const existingSession = await model.sessionData.getByName(name)
      if (existingSession.length > 0)
        throw new SessionConflict("Session already exists")
      updateData.name = name
    }
    if (password !== undefined) {
      updateData.password = hashPassword(password)
    }

    await model.sessionData.update(id, updateData)

    res.status(200).json({
      message: "Session updated",
      ...(updateData.name ? { name: updateData.name } : {}),
    })
  } catch (err) {
    next(err)
  }
}

async function removePasswordFromSessionData(req, res, next) {
  try {
    const { id } = req.params
    await model.sessionData.unset(id, { password: "" })
    res.status(200).json({ message: "Password removed from session data" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSessionDataById,
  getSessionData,
  createSessionData,
  deleteSessionData,
  updateSessionData,
  removePasswordFromSessionData,
}
