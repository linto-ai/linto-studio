import nextServices from "../const/nextServices"
import { sendRequest } from "../tools/sendRequest"

import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function getLangCode(lang) {
  const lang_code = {
    en: "en-US",
    fr: "fr-FR",
  }

  if (!lang_code[lang]) {
    throw new Error("Language not supported")
  }

  return lang_code[lang]
}
const lang_code_alias = {
  en: ["en-US", "en-GB", "en-AU", "en-CA", "en-IN", "en-NZ", "en-ZA"],
  fr: ["fr-FR", "fr-CA", "fr-BE", "fr-CH"],
}

export async function apiGetTranscriptionService(lang, signal) {
  const getTranscriptionService = await sendRequest(
    `${BASE_API}/services`,
    { method: "get", signal },
    {},
    null,
  )

  try {
    const res = getTranscriptionService?.data ?? []
    const transcriptionServicesList = res.filter(
      (service) => !service?.desc?.type,
    )

    if (lang && lang !== "*") {
      return transcriptionServicesList.filter(
        (service) => lang_code_alias[lang].indexOf(service.language) !== -1,
      )
    } else {
      return transcriptionServicesList
    }
  } catch (e) {
    return []
  }
}

export async function apiGetNlpService(notif) {
  const getHighlightsService = await sendRequest(
    `${BASE_API}/services`,
    { method: "get" },
    {},
    notif,
  )

  const res = (getHighlightsService?.data ?? [])
    .filter((service) => service.scope.indexOf("nlp") !== -1)
    .concat(nextServices)

  return res
}

export async function getLLMService() {
  const req = await sendRequest(
    `${BASE_API}/services/llm`,
    { method: "get" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data
  } else {
    return []
  }
}

export async function apiGetMetadataLLMService(conversationId) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/list`,
    { method: "get" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data || []
  } else {
    return []
  }
}

/**
 * Update job result (creates new version in LLM Gateway)
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - LLM Gateway job ID
 * @param {string} content - New content (markdown)
 * @returns {Promise<object|null>} Result with version number or null
 */
export async function apiUpdateExportResult(conversationId, jobId, content) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/${jobId}/result`,
    { method: "put" },
    { content },
    null,
  )

  if (req.status === "success") {
    return req.data
  } else {
    return null
  }
}

/**
 * List all versions for a job from LLM Gateway
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - LLM Gateway job ID
 * @returns {Promise<Array>} List of versions
 */
export async function apiListExportVersions(conversationId, jobId) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/${jobId}/versions`,
    { method: "get" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data?.versions || []
  } else {
    return []
  }
}

/**
 * Get a specific version by number from LLM Gateway
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - LLM Gateway job ID
 * @param {number} versionNumber - Version number
 * @returns {Promise<object|null>} Version data or null
 */
export async function apiGetExportVersion(conversationId, jobId, versionNumber) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/${jobId}/versions/${versionNumber}`,
    { method: "get" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data?.version || req.data
  } else {
    return null
  }
}

/**
 * Restore a specific version in LLM Gateway
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - LLM Gateway job ID
 * @param {number} versionNumber - Version number to restore
 * @returns {Promise<object|null>} Restored version data or null
 */
export async function apiRestoreExportVersion(conversationId, jobId, versionNumber) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/${jobId}/versions/${versionNumber}/restore`,
    { method: "post" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data
  } else {
    return null
  }
}

/**
 * Generate document (PDF/DOCX) from job result
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - LLM Gateway job ID
 * @param {string} format - Document format ('pdf' or 'docx')
 * @returns {Promise<Blob|null>} Document blob or null
 */
export async function apiExportDocument(conversationId, jobId, format) {
  const req = await sendRequest(
    `${BASE_API}/conversations/${conversationId}/export/${jobId}/document`,
    { method: "post", responseType: "blob" },
    { format },
    null,
  )

  if (req.status === "success") {
    return req.data
  } else {
    return null
  }
}
