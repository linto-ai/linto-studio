const model = require(`${process.cwd()}/lib/mongodb/models`)

// A category belongs to the organization of the URL directly, or through the
// conversation it is scoped to. Anything else must be treated as not found.
async function categoryBelongsToOrganization(category, organizationId) {
  if (!category || !organizationId) return false
  const scopeId = category.scopeId?.toString()
  if (scopeId === organizationId.toString()) return true

  const conversation = await model.conversations.getById(scopeId, [
    "organization",
  ])
  return (
    conversation.length === 1 &&
    conversation[0].organization?.organizationId?.toString() ===
      organizationId.toString()
  )
}

module.exports = { categoryBelongsToOrganization }
