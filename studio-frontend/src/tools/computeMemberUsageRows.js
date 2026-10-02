/**
 * Flattens each member's consumption onto its table row, one field per usage
 * column. Quotas are pooled per organization, so a row carries what the member
 * spent, never a personal limit. A member absent from the payload spent
 * nothing: the counter is 0, not unknown.
 * @param {Array<{_id: string, userId?: string}>} members
 * @param {object|null} usageByMember - the `members` map of GET /cloud/usage/:orgId/members
 * @param {Array<{capability: string, key: string}>} columns - from computeUsageColumns
 * @returns {Array} the members, each with its usage fields added
 */
export function computeMemberUsageRows(members, usageByMember, columns) {
  const usage = usageByMember || {}
  return (members || []).map((member) => {
    const memberUsage = usage[member.userId || member._id] || {}
    const row = { ...member }
    for (const column of columns || []) {
      row[column.key] = memberUsage[column.capability]?.used || 0
    }
    return row
  })
}
