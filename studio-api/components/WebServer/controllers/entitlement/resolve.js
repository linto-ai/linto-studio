const model = require(`${process.cwd()}/lib/mongodb/models`)
const { emailDomain } = require(`${process.cwd()}/lib/utility/emailDomain`)

async function resolveFeatures(identity, rootOrganizationId) {
  const domain = emailDomain(identity.email)
  const [userRecords, domainRecords] = await Promise.all([
    model.externalEntitlements.findUser(rootOrganizationId, identity),
    domain
      ? model.externalEntitlements.findDomain(rootOrganizationId, domain)
      : [],
  ])
  const record =
    userRecords.find(
      ({ provider, subject }) =>
        provider === identity.provider && subject === identity.subject,
    ) ||
    userRecords[0] ||
    domainRecords[0]
  return record ? record.features : null
}

module.exports = { resolveFeatures }
