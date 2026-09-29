// Returns the owner id shared by every conversation, or null when the list is
// empty or the conversations have different owners.
export function computeCommonOwnerId(conversations) {
  if (conversations.length === 0) return null
  const ownerId = conversations[0].owner ?? null
  if (conversations.every((c) => c.owner === ownerId)) return ownerId
  return null
}
