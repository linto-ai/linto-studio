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

async function getCategoryInOrganization(
  categoryId,
  organizationId,
  NotFoundError,
) {
  const category = await model.categories.getById(categoryId)
  if (
    category.length !== 1 ||
    !(await categoryBelongsToOrganization(category[0], organizationId))
  )
    throw new NotFoundError("Category not found")
  return category[0]
}

module.exports = { categoryBelongsToOrganization, getCategoryInOrganization }
