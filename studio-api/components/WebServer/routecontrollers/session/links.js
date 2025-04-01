const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:session:links",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

async function createSessionLink(req, res, next) {
  try {
    const { sessionId, name } = req.body
    if (!sessionId || !name) {
      return res.status(400).json({
        message: "Session ID and name are required",
      })
    }
    const existingSession = await model.sessionLinks.getByName(name)
    if (existingSession.length > 0) {
      return res.status(409).json({
        message: `Session links with the name ${name} already exists`,
      })
    }
    const newSession = await model.sessionLinks.create({
      sessionId,
      name,
      organizationId: req.params.organizationId,
    })

    res.status(201).json({
      message: "Session link created successfully",
    })
  } catch (err) {
    next(err)
  }
}

async function getSessionLinks(req, res, next) {
  try {
    const { organizationId } = req.params
    const sessionLinks = await model.sessionLinks.getByOrganization(
      organizationId,
      req.query,
    )

    res.status(200).json(sessionLinks)
  } catch (err) {
    next(err)
  }
}

async function getSessionLinkById(req, res, next) {
  try {
    const { id, organizationId } = req.params
    const sessionLinks = await model.sessionLinks.getByOrganizationAndId(
      organizationId,
      id,
    )
    if (sessionLinks.length === 0) {
      return res.status(404).json({
        message: "Session links not found",
      })
    }
    res.status(200).json(sessionLinks[0])
  } catch (err) {
    next(err)
  }
}

async function deleteSessionLink(req, res, next) {
  try {
    const { id } = req.params
    const sessionLinks = await model.sessionLinks.getById(id)
    if (sessionLinks.length === 0) {
      return res.status(404).json({
        message: "Session links not found",
      })
    }
    if (sessionLinks[0].organizationId !== req.params.organizationId) {
      return res.status(403).json({
        message: "Forbidden",
      })
    }

    await model.sessionLinks.delete(id)
    res.status(200).json({
      message: "Session links deleted successfully",
    })
  } catch (err) {
    next(err)
  }
}

async function updateSessionLink(req, res, next) {
  try {
    const { id } = req.params
    const sessionLinks = await model.sessionLinks.getByOrganizationAndId(
      req.params.organizationId,
      id,
    )
    if (sessionLinks.length === 0) {
      return res.status(404).json({
        message: "Session links not found",
      })
    }
    if (req.body.name !== undefined) {
      const existingSession = await model.sessionLinks.getByName(req.body.name)
      if (existingSession.length > 0) {
        return res.status(409).json({
          message: `Session links with the name ${req.body.name} already exists`,
        })
      }
    }

    const updatedSession = await model.sessionLinks.update(id, req.body)
    res.status(200).json({
      message: "Session links updated successfully",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSessionLinkById,
  getSessionLinks,
  createSessionLink,
  deleteSessionLink,
  updateSessionLink,
}
