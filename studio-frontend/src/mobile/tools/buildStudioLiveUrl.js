/**
 * Classic Studio page of the user's running quick session.
 * @param {string} organizationId
 * @returns {string} absolute path on the same origin
 */
export function buildStudioLiveUrl(organizationId) {
  return `/interface/${encodeURIComponent(organizationId)}/quick-session`
}
