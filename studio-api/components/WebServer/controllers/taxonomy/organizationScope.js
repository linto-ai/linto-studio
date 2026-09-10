const model = require(`${process.cwd()}/lib/mongodb/models`)

// Scoped to the organization itself or to one of its conversations
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
