const model = require(`${process.cwd()}/lib/mongodb/models`)
const moment = require("moment")
const { throwIfError } = require(`${process.cwd()}/lib/utility/throwIfError`)

const {
  OrganizationError,
  OrganizationNotFound,
  OrganizationSsoNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { buildSsoConfig, toPublic } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/sso`,
)
const { callbackUrl } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/ssoLogin`,
)

// The redirect URI to register on the identity provider comes with the config,
// so the admin sees the one the API will actually send.
function ssoResponse(req, sso) {
  return { callbackUrl: callbackUrl(req), sso: sso ? toPublic(sso) : null }
}

async function loadOrganization(organizationId) {
  const organization = await model.organizations.getById(organizationId)
  if (!Array.isArray(organization) || organization.length === 0)
    throw new OrganizationNotFound()
  return organization[0]
}

async function getSso(req, res, next) {
  try {
    const organization = await loadOrganization(req.params.organizationId)

    res.status(200).send(ssoResponse(req, organization.sso))
  } catch (err) {
    next(err)
  }
}

async function upsertSso(req, res, next) {
  try {
    const organization = await loadOrganization(req.params.organizationId)

    const sso = buildSsoConfig(req.body || {}, organization.sso, {
      matchingMail: organization.matchingMail,
    })
    const now = moment().format()
    sso.created = organization.sso?.created || now
    sso.last_update = now

    const result = throwIfError(
      await model.organizations.update({ _id: organization._id, sso }),
    )
    if (result.matchedCount === 0) throw new OrganizationError()

    res.status(200).send(ssoResponse(req, sso))
  } catch (err) {
    next(err)
  }
}

async function deleteSso(req, res, next) {
  try {
    const result = throwIfError(
      await model.organizations.deleteSso(req.params.organizationId),
    )
    if (result.matchedCount === 0) throw new OrganizationSsoNotFound()

    res.status(200).send({ message: "Organization SSO has been removed" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSso,
  upsertSso,
  deleteSso,
}
