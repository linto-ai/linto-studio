/**
 * Whether the reader may generate reports. Left unset, the SDK default
 * applies: generating is allowed.
 * @param {{ summary?: { generate: boolean } }} capabilities - core capabilities
 * @returns {boolean}
 */
export function computeCanGenerateReports(capabilities) {
  return capabilities.summary?.generate ?? true
}
