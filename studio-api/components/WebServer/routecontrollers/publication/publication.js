const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routeControllers:publication",
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const FormData = require("form-data")

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

/**
 * Get all publication templates from LLM Gateway
 * GET /publication/templates
 *
 * Query params:
 *   - organization_id: Filter by organization scope (optional)
 *
 * Returns templates visible to the current user:
 * - System templates (always included)
 * - Organization templates (if organization_id provided)
 * - User templates (for authenticated user within organization)
 */
async function getTemplates(req, res, next) {
  try {
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId

    // Build query params for hierarchical visibility
    const params = new URLSearchParams()
    params.append("include_system", "true")

    // Add organization_id if provided (to get org-scoped templates)
    if (req.query.organization_id) {
      params.append("organization_id", req.query.organization_id)
    }

    // Add user_id for authenticated user (to get user-scoped templates)
    if (authenticatedUserId) {
      params.append("user_id", authenticatedUserId)
    }

    // CORRECT endpoint: /api/v1/document-templates (NOT /api/v1/templates)
    const url = `${baseUrl}/api/v1/document-templates?${params.toString()}`
    const response = await axios.get(url, { timeout: 5000 })

    // Return with status wrapper, preserve all fields from LLM Gateway (including name_fr, name_en, etc.)
    return res.status(200).json({
      status: "success",
      templates: response || []
    })
  } catch (err) {
    appLogger.error(`[Publication] getTemplates error: ${err.message}`)
    return res.status(err.response?.status || 502).json({
      status: "error",
      error: err.response?.data?.detail || "Failed to fetch templates from LLM Gateway"
    })
  }
}

/**
 * Get template placeholders
 * GET /publication/templates/:templateId/placeholders
 *
 * Returns the list of placeholder fields that need to be filled for the template
 */
async function getTemplatePlaceholders(req, res, next) {
  try {
    const { templateId } = req.params

    if (!templateId) {
      return res.status(400).json({ status: "error", error: "templateId is required" })
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    // CORRECT endpoint: /api/v1/document-templates/{id}/placeholders
    const url = `${baseUrl}/api/v1/document-templates/${templateId}/placeholders`
    const response = await axios.get(url, { timeout: 5000 })

    // Return with status wrapper per API contract
    return res.status(200).json({
      status: "success",
      placeholders: response || []
    })
  } catch (err) {
    appLogger.error(`[Publication] getTemplatePlaceholders error: ${err.message}`)
    const status = err.response?.status || 500
    return res.status(status).json({
      status: "error",
      error: status === 404 ? "Template not found" : (err.response?.data?.detail || err.message)
    })
  }
}

/**
 * Export a document using a template
 * GET /publication/:jobId/export/:format
 *
 * Query params:
 *   - templateId: Template ID to use for export (optional, uses job's template if not provided)
 *   - placeholders: JSON string of placeholder values (optional)
 *
 * Path params:
 *   - jobId: The LLM Gateway job ID
 *   - format: Export format (pdf, docx, html)
 */
async function exportWithTemplate(req, res, next) {
  let url = null // Declare outside try for error logging
  try {
    const { jobId, format } = req.params

    if (!jobId) {
      return res.status(400).json({ status: "error", error: "jobId is required" })
    }
    if (!format || !["pdf", "docx", "html"].includes(format)) {
      return res.status(400).json({ status: "error", error: "Invalid format" })
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    // Build request URL
    url = `${baseUrl}/api/v1/jobs/${jobId}/export/${format}`

    // Add template, placeholders, and version_number if provided
    const queryParams = new URLSearchParams()
    if (req.query.templateId) {
      queryParams.append("template_id", req.query.templateId)
    }
    if (req.query.placeholders) {
      try {
        const placeholders = JSON.parse(req.query.placeholders)
        queryParams.append("placeholders", JSON.stringify(placeholders))
      } catch (e) {
        appLogger.warn(`[Publication] Invalid placeholders JSON: ${e.message}`)
      }
    }
    if (req.query.versionNumber) {
      queryParams.append("version_number", req.query.versionNumber)
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }

    // HTML returns text, others return binary
    const isHtml = format === "html"
    const response = await axios.get(url, {
      responseType: isHtml ? undefined : "arraybuffer",
      timeout: 30000, // 30 second timeout for document generation
    })

    // Set appropriate content type and return response
    if (format === "html") {
      res.setHeader("Content-Type", "text/html; charset=utf-8")
      res.send(response)
    } else if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="export.pdf"`)
      res.send(Buffer.from(response))
    } else {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      res.setHeader("Content-Disposition", `attachment; filename="export.docx"`)
      res.send(Buffer.from(response))
    }
  } catch (err) {
    // Parse error response if it's an arraybuffer
    let errorDetail = err.message
    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString('utf8')
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.detail || errorJson.message || errorText
      } catch (e) {
        // If parsing fails, use raw message
        errorDetail = err.message
      }
    }

    appLogger.error(`[Publication] exportWithTemplate error: ${errorDetail}`)
    appLogger.error(`[Publication] URL called: ${url}`)

    if (err.response?.status === 404) {
      return res.status(404).json({ status: "error", error: "Job not found" })
    }
    if (err.response?.status === 400) {
      return res.status(400).json({ status: "error", error: errorDetail || "Invalid request" })
    }

    return res.status(500).json({ status: "error", error: errorDetail || "Document generation failed" })
  }
}

/**
 * Upload a new publication template (DOCX file)
 * POST /publication/templates
 *
 * Form data (multipart/form-data):
 *   - file: DOCX template file (required)
 *   - name_fr: French name (required)
 *   - name_en: English name (optional)
 *   - description_fr: French description (optional)
 *   - description_en: English description (optional)
 *   - organization_id: Organization ID for org-scoped template (optional)
 *   - scope: "personal" (default) or "organization" - determines template visibility
 *
 * Scope behavior:
 *   - "personal": Template is scoped to the authenticated user (user_id from JWT)
 *   - "organization": Template is scoped to the specified organization_id
 *
 * Note: The template file should contain {{output}} placeholder for AI-generated content
 */
async function createTemplate(req, res, next) {
  try {
    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      return res.status(401).json({
        status: "error",
        error: "Authentication required"
      })
    }

    // Check for file upload
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        status: "error",
        error: "A DOCX file is required"
      })
    }

    const file = req.files.file
    const { name_fr, name_en, description_fr, description_en, organization_id, scope } = req.body

    // Validate required fields
    if (!name_fr || !name_fr.trim()) {
      return res.status(400).json({
        status: "error",
        error: "name_fr is required"
      })
    }

    // Validate file type
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream" // Some browsers send this for .docx
    ]
    const isValidType = validMimeTypes.includes(file.mimetype) ||
                        file.name.toLowerCase().endsWith(".docx")

    if (!isValidType) {
      return res.status(400).json({
        status: "error",
        error: "Invalid file type. Only DOCX files are accepted."
      })
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return res.status(400).json({
        status: "error",
        error: "File too large. Maximum size is 10MB."
      })
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({
        status: "error",
        error: "LLM Gateway not configured"
      })
    }

    // Create FormData for multipart request to LLM Gateway
    const formData = new FormData()

    // Append file - express-fileupload provides file.data as Buffer
    formData.append("file", file.data, {
      filename: file.name,
      contentType: file.mimetype || "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    })

    // Append required field
    formData.append("name_fr", name_fr.trim())

    // Append optional fields if provided
    if (name_en && name_en.trim()) {
      formData.append("name_en", name_en.trim())
    }
    if (description_fr && description_fr.trim()) {
      formData.append("description_fr", description_fr.trim())
    }
    if (description_en && description_en.trim()) {
      formData.append("description_en", description_en.trim())
    }

    // Handle scope: personal (user) or organization
    // Default to personal scope using authenticated user's ID
    const templateScope = scope || "personal"

    // Organization ID is required for all scoped templates (LLM Gateway enforces this)
    if (organization_id) {
      formData.append("organization_id", organization_id)
    }

    if (templateScope === "organization") {
      // Organization-scoped template: org_id only, no user_id
      appLogger.info(`[Publication] Creating org-scoped template for org: ${organization_id}`)
    } else {
      // Personal/user-scoped template (default): org_id + user_id
      // Use authenticated user's MongoDB ObjectId directly (LLM Gateway accepts any string ID)
      formData.append("user_id", authenticatedUserId)
      appLogger.info(`[Publication] Creating user-scoped template for user: ${authenticatedUserId} in org: ${organization_id}`)
    }

    // Forward to LLM Gateway
    const url = `${baseUrl}/api/v1/document-templates`

    // Use native axios (not wrapped) for multipart/form-data with proper headers
    const nativeAxios = require("axios")
    const response = await nativeAxios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 seconds for file upload
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    appLogger.info(`[Publication] Template uploaded successfully: ${response.data?.id}`)

    return res.status(201).json({
      status: "success",
      template: response.data || {}
    })
  } catch (err) {
    appLogger.error(`[Publication] createTemplate error: ${err.message}`)

    // Parse error detail from LLM Gateway if available
    let errorDetail = err.message
    if (err.response?.data?.detail) {
      errorDetail = err.response.data.detail
    } else if (err.response?.data?.message) {
      errorDetail = err.response.data.message
    }

    const status = err.response?.status || 500
    return res.status(status).json({
      status: "error",
      error: errorDetail || "Failed to upload template"
    })
  }
}

/**
 * Delete a publication template
 * DELETE /publication/templates/:templateId
 *
 * Only allows deletion of non-system templates.
 * Users can only delete their own templates (user-scoped) or organization templates
 * if they have appropriate permissions.
 */
async function deleteTemplate(req, res, next) {
  try {
    const { templateId } = req.params

    if (!templateId) {
      return res.status(400).json({ status: "error", error: "templateId is required" })
    }

    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      return res.status(401).json({
        status: "error",
        error: "Authentication required"
      })
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    // First, get the template to check its scope and ownership
    const getUrl = `${baseUrl}/api/v1/document-templates/${templateId}`
    let template
    try {
      const getResponse = await axios.get(getUrl, { timeout: 5000 })
      template = getResponse
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({ status: "error", error: "Template not found" })
      }
      throw err
    }

    // Check if it's a system template (cannot be deleted via this endpoint)
    if (template.scope === "system") {
      return res.status(403).json({
        status: "error",
        error: "Cannot delete system templates"
      })
    }

    // Check ownership for user-scoped templates
    if (template.scope === "user" && template.user_id !== authenticatedUserId) {
      return res.status(403).json({
        status: "error",
        error: "You can only delete your own templates"
      })
    }

    // For organization-scoped templates, we could add permission checks here
    // For now, allow any authenticated user in the org to delete org templates

    // Delete the template via LLM Gateway
    const deleteUrl = `${baseUrl}/api/v1/document-templates/${templateId}`
    await axios.delete(deleteUrl, { timeout: 5000 })

    appLogger.info(`[Publication] Template deleted: ${templateId} by user ${authenticatedUserId}`)

    return res.status(200).json({
      status: "success",
      message: "Template deleted successfully"
    })
  } catch (err) {
    appLogger.error(`[Publication] deleteTemplate error: ${err.message}`)

    let errorDetail = err.message
    if (err.response?.data?.detail) {
      errorDetail = err.response.data.detail
    }

    const status = err.response?.status || 500
    return res.status(status).json({
      status: "error",
      error: errorDetail || "Failed to delete template"
    })
  }
}

module.exports = {
  getTemplates,
  getTemplatePlaceholders,
  exportWithTemplate,
  createTemplate,
  deleteTemplate,
}
