/**
 * The profile and service a draft points to.
 * @param {{ profileId: *, serviceName: string|null }} draft
 * @param {{ profiles: object[], services: object[] }} catalog
 * @returns {{ profile: object|null, service: object|null }}
 */
export function computeDraftEngines(draft, catalog) {
  return {
    profile: catalog.profiles.find((p) => p.id === draft.profileId) ?? null,
    service:
      catalog.services.find((s) => s.serviceName === draft.serviceName) ?? null,
  }
}
