const model = require(`${process.cwd()}/lib/mongodb/models`)

const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const MEDIA_RETENTION = require(
  `${process.cwd()}/lib/dao/organization/mediaRetention`,
)

// null removes the retention: the media created afterwards are kept
function parseMediaRetention(input) {
  if (input === null) return null

  const retention = MEDIA_RETENTION.parse(input)
  if (!retention) {
    throw new OrganizationError(
      `mediaRetention expects a value from 1 to ${MEDIA_RETENTION.MAX_VALUE} and a unit among: ${MEDIA_RETENTION.UNITS.join(", ")}`,
    )
  }
  return retention
}

async function updateOrganization(req, res, next) {
  try {
    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    if (req.body.token) organization.token = req.body.token
    if (req.body.description) organization.description = req.body.description
    if (req.body.name) organization.name = req.body.name
    if (req.body.mediaRetention !== undefined) {
      organization.mediaRetention = parseMediaRetention(req.body.mediaRetention)
    }

    const result = await model.organizations.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send({
      message: "Organization has been updated",
    })
  } catch (err) {
    next(err)
  }
}

async function deleteOrganization(req, res, next) {
  try {
    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0)
      throw new OrganizationError("Organization not found")
    organization = organization[0]

    await orgaUtility.deleteOrganizationCascade(organization._id.toString())

    res.status(200).send({
      message: "Organization has been deleted",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  updateOrganization,
  deleteOrganization,
}
