import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"

/**
 * Language codes a transcription service lists, detection included. Without
 * any, it can only detect.
 * @param {{ language?: string }} service - one entry of GET /services
 * @returns {string[]}
 */
export function computeServiceLanguages(service) {
  return (service.language || AUTO_LANGUAGE).split(",")
}
