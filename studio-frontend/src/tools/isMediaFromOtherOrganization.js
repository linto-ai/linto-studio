// A media pushed by the websocket for another organization than the watched
// one (stale room after an organization switch, race between watch and
// unwatch on the server). A media that does not say its organization is
// trusted: the payload carries no way to tell.
export function isMediaFromOtherOrganization(media, organizationId) {
  const mediaOrganizationId = media?.organization?.organizationId
  return !!mediaOrganizationId && mediaOrganizationId !== organizationId
}
