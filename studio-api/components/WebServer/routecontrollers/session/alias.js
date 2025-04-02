const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:alias",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  SessionError,
  SessionNotFound,
  SessionForbidden,
  SessionNotStarted,
  SessionUnsupportedMediaType,
  SessionConflict,
  TranscriberUnavailable,
} = require(`${process.cwd()}/components/WebServer/error/exception/session`)

async function createSessionAlias(req, res, next) {
  try {
    const { sessionId, name } = req.body
    if (!sessionId || !name) throw new SessionUnsupportedMediaType()

    const existingSession = await model.sessionAlias.getByName(name)
    if (existingSession.length > 0)
      throw new SessionConflict(
        `Session alias with the name ${name} already exists`,
      )

    const newSession = await model.sessionAlias.create({
      sessionId,
      name,
      organizationId: req.params.organizationId,
    })

    res.status(201).json({
      message: "Alias created successfully",
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
    if (sessionAlias.length === 0) throw new SessionNotFound()
    res.status(200).json(sessionAlias[0])
  } catch (err) {
    next(err)
  }
}

async function deleteSessionAlias(req, res, next) {
  try {
    const { id } = req.params
    const sessionAlias = await model.sessionAlias.getById(id)
    if (sessionAlias.length === 0) throw new SessionNotFound()

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
    if (req.body.name !== undefined) {
      const existingSession = await model.sessionAlias.getByName(req.body.name)
      if (existingSession.length > 0) throw new SessionConflict()
    }

    const updatedSession = await model.sessionAlias.update(id, req.body)
    res.status(200).json({
      message: "Alias updated",
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
