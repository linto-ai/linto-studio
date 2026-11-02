import extractLocales from "../extractLocales.js"

/**
 * Display name of a transcription service.
 * @param {{ name: string, desc?: object }} service - one entry of GET /services
 * @param {string} locale
 * @returns {string}
 */
export function computeServiceName(service, locale) {
  return extractLocales(service.desc, locale) || service.name
}
