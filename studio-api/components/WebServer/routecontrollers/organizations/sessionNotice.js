const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { parseSessionNotice } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/sessionNotice`,
)

async function getSessionNotice(req, res, next) {
  try {
    const content = await model.organizations.getSessionNotice(
      req.params.organizationId,
    )
    if (content === null) throw new OrganizationNotFound()

    res.status(200).send({ content })
  } catch (err) {
    next(err)
  }
}

// An empty notice removes the field: the sessions then show none.
async function updateSessionNotice(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const content = parseSessionNotice(req.body?.content)

    const result = content
      ? await model.organizations.updateSessionNotice(organizationId, content)
      : await model.organizations.deleteSessionNotice(organizationId)
    if (result.matchedCount === 0) throw new OrganizationNotFound()

    res.status(200).send({ content })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSessionNotice,
  updateSessionNotice,
}
