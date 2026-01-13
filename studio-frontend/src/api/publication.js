import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

/**
 * Get all publication templates from the API
 * @param {Object} options - Optional filters
 * @param {string} [options.category] - Filter by category (e.g., "summary", "report")
 * @param {string} [options.organizationId] - Filter by organization ID
 * @returns {Promise<Array>} List of templates
 */
export async function apiGetPublicationTemplates(options = {}) {
  const params = {}
  if (options.category) {
    params.category = options.category
  }
  if (options.organizationId) {
    params.organization_id = options.organizationId
  }

  const req = await sendRequest(
    `${BASE_API}/publication/templates`,
    { method: "get" },
    params,
    null,
  )

  if (req.status === "success") {
    // Backend returns { status: "success", templates: [...] }
    // sendRequest wraps it as { status: "success", data: { status: "success", templates: [...] } }
    return req.data?.templates || []
  }
  return []
}

/**
 * Get placeholders for a specific template
 * @param {string} templateId - The template ID
 * @returns {Promise<Object|null>} Template placeholders or null
 */
export async function apiGetTemplatePlaceholders(templateId) {
  const req = await sendRequest(
    `${BASE_API}/publication/templates/${templateId}/placeholders`,
    { method: "get" },
    {},
    null,
  )

  if (req.status === "success") {
    return req.data
  }
  return null
}

/**
 * Export a document using a template
 * @param {string} jobId - The LLM Gateway job ID
 * @param {string} format - Export format ('pdf' or 'docx')
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.templateId] - Template ID to use for export
 * @param {Object} [options.placeholders] - Placeholder values for the template
 * @param {number} [options.versionNumber] - Version number to export (uses current if not provided)
 * @returns {Promise<Blob|null>} Document blob or null
 */
export async function apiExportWithTemplate(jobId, format, options = {}) {
  const params = {}
  if (options.templateId) {
    params.templateId = options.templateId
  }
  if (options.placeholders) {
    params.placeholders = JSON.stringify(options.placeholders)
  }
  if (options.versionNumber !== null && options.versionNumber !== undefined) {
    params.versionNumber = options.versionNumber
  }

  const req = await sendRequest(
    `${BASE_API}/publication/${jobId}/export/${format}`,
    { method: "get", responseType: "blob" },
    params,
    null,
  )

  if (req.status === "success") {
    return req.data
  }
  return null
}

/**
 * Get HTML preview of a document using a template
 * @param {string} jobId - The LLM Gateway job ID
 * @param {Object} [options] - Optional parameters
 * @param {string} [options.templateId] - Template ID to use for preview
 * @returns {Promise<string|null>} HTML string or null
 */
export async function apiGetHtmlPreview(jobId, options = {}) {
  const params = {}
  if (options.templateId) {
    params.templateId = options.templateId
  }

  // Use sendRequest without blob responseType for HTML
  const req = await sendRequest(
    `${BASE_API}/publication/${jobId}/export/html`,
    { method: "get" },
    params,
    null,
  )

  if (req.status === "success") {
    return req.data
  }
  return null
}

/**
 * Upload a new publication template (DOCX file)
 * @param {Object} options - Upload options
 * @param {File} options.file - DOCX template file
 * @param {string} options.name_fr - French name (required)
 * @param {string} [options.name_en] - English name
 * @param {string} [options.description_fr] - French description
 * @param {string} [options.description_en] - English description
 * @param {string} [options.organization_id] - Organization ID for org-scoped template
 * @param {string} [options.user_id] - User ID for user-scoped template
 * @returns {Promise<Object|null>} Created template or null
 */
export async function apiUploadPublicationTemplate(options) {
  const formData = new FormData()
  formData.append("file", options.file)
  formData.append("name_fr", options.name_fr)

  if (options.name_en) {
    formData.append("name_en", options.name_en)
  }
  if (options.description_fr) {
    formData.append("description_fr", options.description_fr)
  }
  if (options.description_en) {
    formData.append("description_en", options.description_en)
  }
  if (options.organization_id) {
    formData.append("organization_id", options.organization_id)
  }
  if (options.scope) {
    formData.append("scope", options.scope)
  }

  const req = await sendRequest(
    `${BASE_API}/publication/templates`,
    { method: "post" },
    formData,
    null,
  )

  if (req.status === "success") {
    return req.data?.template || req.data
  }
  return null
}

/**
 * @deprecated Use apiUploadPublicationTemplate instead
 */
export async function apiCreatePublicationTemplate(templateData) {
  return apiUploadPublicationTemplate(templateData)
}

/**
 * Delete a publication template
 * @param {string} templateId - The template ID to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function apiDeletePublicationTemplate(templateId) {
  const req = await sendRequest(
    `${BASE_API}/publication/templates/${templateId}`,
    { method: "delete" },
    {},
    null,
  )

  return req.status === "success"
}
