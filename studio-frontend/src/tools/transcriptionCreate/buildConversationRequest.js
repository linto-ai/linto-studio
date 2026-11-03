import { buildServiceConfig } from "./buildServiceConfig.js"

/**
 * What apiCreateConversation expects for one file or URL of the draft.
 * @param {object} draft
 * @param {object} service - one entry of GET /services
 * @param {{ value: string, file: File|string, uploadType: string }} fileField
 * @returns {object}
 */
export function buildConversationRequest(draft, service, fileField) {
  const config = buildServiceConfig(draft, service)
  const isUrl = fileField.uploadType === "url"
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
    tracks: isUrl ? null : [fileField.file],
    url: isUrl ? fileField.file : null,
    folderId: draft.folderId,
  }
}
