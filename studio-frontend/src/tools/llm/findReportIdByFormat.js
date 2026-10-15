/**
 * The report a job update concerns when its job is not known yet: matched
 * on the service format (or the report id itself).
 * @param {Map<string, { format: string }>} catalog - report catalog
 * @param {{ serviceFormat?: string, serviceName?: string, format?: string }} update
 * @returns {string|null}
 */
export function findReportIdByFormat(catalog, update) {
  const format = update.serviceFormat || update.serviceName || update.format
  if (!format) return null
  for (const [id, entry] of catalog) {
    if (entry.format === format || id === format) return id
  }
  return null
}
