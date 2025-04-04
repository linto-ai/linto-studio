const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:alias",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const getSlug = require("speakingurl")

const {
  SessionNotFound,
  SessionForbidden,
  SessionUnsupportedMediaType,
  SessionConflict,
} = require(`${process.cwd()}/components/WebServer/error/exception/session`)

async function createSessionAlias(req, res, next) {
  try {
    let { sessionId, name } = req.body
    if (!sessionId || !name) throw new SessionUnsupportedMediaType()
    name = getSlug(name, { lang: "en" })

    const existingSession = await model.sessionAlias.getByName(name)
    if (existingSession.length > 0)
      throw new SessionConflict(
        `Session alias with the name ${name} already exists`,
      )

    try {
      await axios.get(
        process.env.SESSION_API_ENDPOINT + `/sessions/${sessionId}`,
      )
    } catch (err) {
      throw new SessionNotFound("Session not found")
    }

    await model.sessionAlias.create({
      sessionId,
      name,
      organizationId: req.params.organizationId,
    })

    res.status(201).json({
      message: "Alias created successfully",
      name: name,
      sessionId: sessionId,
    })
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
    const sessionAlias = await model.sessionAlias.getByOrganizationAndId(
      req.params.organizationId,
      id,
    )

    if (sessionAlias.length === 0) throw new SessionNotFound()
    if (req.body.name === undefined) throw new SessionUnsupportedMediaType()
    const name = getSlug(req.body.name, { lang: "en" })

    const existingSession = await model.sessionAlias.getByName(name)
    if (existingSession.length > 0)
      throw new SessionConflict("Alias already exists")

    const updatedSession = await model.sessionAlias.update(id, {
      name,
    })
    res.status(200).json({
      message: "Alias name updated",
      name: name,
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
