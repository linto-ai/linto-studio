import { buildServiceConfig } from "./buildServiceConfig.js"

/**
 * What apiCreateConversation expects for one file of the draft.
 * @param {object} draft
 * @param {object} service - one entry of GET /services
 * @param {{ value: string, file: File }} fileField
 * @returns {object}
 */
export function buildConversationRequest(draft, service, fileField) {
  const config = buildServiceConfig(draft, service)
  return {
    name: fileField.value,
    description: "",
    membersRight: draft.membersRight,
    securityLevel: draft.securityLevel,
    serviceName: config.serviceName,
    transcriptionConfig: JSON.stringify(config.config),
    speakerIdentificationCollections: config.speakerIdentificationCollections,
    lang: config.lang,
    endpoint: config.endpoint,
    tracks: [fileField.file],
    folderId: draft.folderId,
  }
}
