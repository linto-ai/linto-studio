/**
 * Chooses the default transcription service: the one whose `serviceName`
 * matches the remembered preference, else the lowest explicit `order`, else
 * the first of the list. Null when the list is empty.
 * @param {object[]} services
 * @param {string|null} preferredServiceName
 * @returns {object|null}
 */
export function pickRecommendedService(services, preferredServiceName) {
  if (!services?.length) return null
  const preferred = services.find(
    (service) => service.serviceName === preferredServiceName,
  )
  if (preferred) return preferred
  const ordered = services.filter((service) => Number.isFinite(service.order))
  if (ordered.length === 0) return services[0]
  return ordered.reduce((best, service) =>
    service.order < best.order ? service : best,
  )
}
