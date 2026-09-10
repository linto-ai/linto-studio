const debug = require("debug")(
  "linto:components:WebServer:controllers:organization:externalDomain",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const { OrganizationError } = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

/**
 * One Studio organization per external domain.
 *
 * `PUT /api/v1/organizations/{root}/entitlements/domains/{domain}` gives the
 * domain its own organization: same creation path as `POST /api/organizations`
 * (the caller becomes ADMIN and owner, default permissions, system categories,
 * shared ASR profiles apply as they do to any organization), plus the two
 * marks that make it ours:
 *
 *   metadata.parentOrganizationId  the root organization it belongs to
 *                                  (Studio has no hierarchy of its own)
 *   metadata.externalDomain        the domain it stands for
 *   metadata.managed               managed by LinTO (plans are driven by the
 *                                  entitlements, not by a self-service plan)
 *
 * It is created ONCE and never deleted by these routes: `features: {}` takes
 * the rights away, the organization and its data stay (removing one is an
 * administration act, never the effect of a message).
 */
async function ensureDomainOrganization({
  rootOrganizationId,
  domain,
  provider,
  callerId,
}) {
  const existing = await model.organizations.getByExternalDomain(
    rootOrganizationId,
    domain,
  )
  if (Array.isArray(existing) && existing.length > 0) {
    return { organization: existing[0], created: false }
  }

  const payload = {
    name: domain,
    description: `External domain ${domain}`,
    users: [{ userId: callerId, role: ROLES.ADMIN }],
    owner: callerId,
    token: "",
    metadata: {
      parentOrganizationId: rootOrganizationId,
      externalDomain: domain,
      provider,
      managed: true,
    },
  }

  const result = await model.organizations.create(payload)
  if (!result || result.insertedCount !== 1) {
    throw new OrganizationError(
      `Could not create the organization of ${domain}`,
    )
  }

  const created = await model.organizations.getById(
    result.insertedId.toString(),
  )
  if (!Array.isArray(created) || created.length !== 1) {
    throw new OrganizationError(
      `Could not read back the organization of ${domain}`,
    )
  }

  logger.info(
    `entitlements: organization ${created[0]._id} created for domain ${domain} under ${rootOrganizationId} by ${callerId}`,
  )
  return { organization: created[0], created: true }
}

module.exports = { ensureDomainOrganization }
