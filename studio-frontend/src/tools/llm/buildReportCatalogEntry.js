import getDescriptionByLanguage from "../getDescriptionByLanguage.js"

/**
 * What the host keeps of an LLM service of the gateway catalog. The SDK id is
 * the service route (or its name), the gateway UUID is kept for the
 * publication endpoints.
 * @param {object} service - gateway LLM service
 * @param {string} locale - app locale, picks the label
 * @returns {{ id: string, label: string, serviceId: string|null, format: string, route: string, flavor: string|null }}
 */
export function buildReportCatalogEntry(service, locale) {
  const id = service.route || service.name
  const defaultFlavor =
    service.flavors?.find((flavor) => flavor.is_default) || service.flavors?.[0]
  return {
    id,
    label: getDescriptionByLanguage(service.description, locale, service.name),
    serviceId: service.id ?? null,
    format: service.format || id,
    route: service.route || id,
    flavor: defaultFlavor?.name ?? null,
  }
}
