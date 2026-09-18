const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:publication:publication",
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const FormData = require("form-data")
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Gateway service UUID for a UUID, route or name (null when unknown). */
async function resolveServiceId(baseUrl, identifier) {
  if (UUID_PATTERN.test(identifier)) return identifier
  const response = await axios.get(
    `${baseUrl}/api/v1/services?page=1&page_size=100`,
    { timeout: 5000 },
  )
  const service = (response?.items || []).find(
    (s) => s.route === identifier || s.name === identifier,
  )
  return service ? service.id : null
}

const {
  PublicationError,
  PublicationNotConfigured,
  PublicationNotFound,
  PublicationInvalidFormat,
  PublicationUploadFailed,
  PublicationForbidden,
  PublicationAuthRequired,
  PublicationIdRequired,
} = require(`${process.cwd()}/components/WebServer/error/exception/publication`)

/**
 * Get all publication templates from LLM Gateway
 * GET /publication/organizations/:organizationId/templates
 *
 * Returns templates visible to the current user:
 * - System templates (always included)
 * - Organization templates (organization taken from the path, enforced by middleware)
 * - User templates (for authenticated user within organization)
 */
async function getTemplates(req, res, next) {
  try {
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId
    // Organization comes from the path param, membership enforced by the route middleware
    const organizationId = req.params.organizationId

    // When a service_id is provided, return only the templates the admin made
    // available for that service (falls back to the global default if none are
    // linked). Otherwise return all templates visible to the org/user.
    let url
    if (req.query.service_id) {
      // The editor may send the service route instead of the gateway UUID
      const serviceId = await resolveServiceId(baseUrl, req.query.service_id)
      if (!serviceId) {
        throw new PublicationNotFound("Service not found")
      }
      const params = new URLSearchParams()
      params.append("organization_id", organizationId)
      if (authenticatedUserId) {
        params.append("user_id", authenticatedUserId)
      }
      url = `${baseUrl}/api/v1/services/${serviceId}/templates?${params.toString()}`
    } else {
      // Build query params for hierarchical visibility
      const params = new URLSearchParams()
      params.append("include_system", "true")
      params.append("organization_id", organizationId)

      // Add user_id for authenticated user (to get user-scoped templates)
      if (authenticatedUserId) {
        params.append("user_id", authenticatedUserId)
      }

      // CORRECT endpoint: /api/v1/document-templates (NOT /api/v1/templates)
      url = `${baseUrl}/api/v1/document-templates?${params.toString()}`
    }

    const response = await axios.get(url, { timeout: 5000 })

    // Return with status wrapper, preserve all fields from LLM Gateway (including name_fr, name_en, etc.)
    return res.status(200).json({
      status: "success",
      templates: response || [],
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get template placeholders
 * GET /publication/organizations/:organizationId/templates/:templateId/placeholders
 *
 * Returns the list of placeholder fields that need to be filled for the template
 */
async function getTemplatePlaceholders(req, res, next) {
  try {
    const { templateId } = req.params

    if (!templateId) {
      throw new PublicationIdRequired("templateId is required")
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    // CORRECT endpoint: /api/v1/document-templates/{id}/placeholders
    const url = `${baseUrl}/api/v1/document-templates/${templateId}/placeholders`
    const response = await axios.get(url, { timeout: 5000 })

    // Return with status wrapper per API contract
    return res.status(200).json({
      status: "success",
      placeholders: response || [],
    })
  } catch (err) {
    if (err.response?.status === 404) {
      return next(new PublicationNotFound("Template not found"))
    }
    next(err)
  }
}

/**
 * Export a document using a template
 * GET /publication/conversations/:conversationId/jobs/:jobId/export/:format
 *
 * Query params:
 *   - templateId: Template ID to use for export (optional, uses job's template if not provided)
 *   - placeholders: JSON string of placeholder values (optional)
 *
 * Path params:
 *   - conversationId: Conversation the export relates to (read access enforced by middleware)
 *   - jobId: The LLM Gateway job ID
 *   - format: Export format (pdf, docx, html)
 */
async function exportWithTemplate(req, res, next) {
  let url = null // Declare outside try for error logging
  try {
    const { jobId, format } = req.params

    if (!jobId) {
      throw new PublicationIdRequired("jobId is required")
    }
    if (!format || !["pdf", "docx", "html"].includes(format)) {
      throw new PublicationInvalidFormat(
        "Invalid format. Allowed: pdf, docx, html",
      )
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
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
    if (req.query.timezone) {
      queryParams.append("timezone", req.query.timezone)
    }

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`
    }

    // HTML returns text, others return binary
    const isHtml = format === "html"
    const exportTimeout = parseInt(process.env.EXPORT_TIMEOUT_MS, 10) || 600000 // Default: 10 minutes
    const response = await axios.get(url, {
      responseType: isHtml ? undefined : "arraybuffer",
      timeout: exportTimeout,
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
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      )
      res.setHeader("Content-Disposition", `attachment; filename="export.docx"`)
      res.send(Buffer.from(response))
    }
  } catch (err) {
    // Parse error response if it's an arraybuffer
    let errorDetail = err.message
    if (err.response?.data) {
      try {
        const errorText = Buffer.from(err.response.data).toString("utf8")
        const errorJson = JSON.parse(errorText)
        errorDetail = errorJson.detail || errorJson.message || errorText
      } catch (e) {
        // If parsing fails, use raw message
        errorDetail = err.message
      }
    }

    if (err.response?.status === 404) {
      return next(new PublicationNotFound("Job not found"))
    }
    if (err.response?.status === 400) {
      return next(new PublicationError(errorDetail || "Invalid request"))
    }

    next(err)
  }
}

/** Org maintainers and admins manage organization-wide templates. */
function canManageOrgTemplates(req) {
  return ROLES.hasRoleAccess(req.userRole || ROLES.UNDEFINED, ROLES.MAINTAINER)
}

/** True when the caller uploaded the template (legacy user_id as fallback). */
function isTemplateOwner(template, userId) {
  const owner = template.owner_user_id || template.user_id
  return Boolean(owner) && owner === userId
}

/** Visibility of a gateway template for a member of `organizationId`. */
function isTemplateVisible(template, organizationId, userId) {
  if (template.scope === "system") return true
  if (isTemplateOwner(template, userId)) return true
  if (template.scope === "user") {
    return (template.allowed_user_ids || []).includes(userId)
  }
  return (template.allowed_organization_ids || []).includes(organizationId)
}

async function fetchTemplate(baseUrl, templateId) {
  try {
    return await axios.get(
      `${baseUrl}/api/v1/document-templates/${templateId}`,
      {
        timeout: 5000,
      },
    )
  } catch (err) {
    if (err.response?.status === 404) {
      throw new PublicationNotFound("Template not found")
    }
    throw err
  }
}

/**
 * Upload a new publication template (DOCX file)
 * POST /publication/organizations/:organizationId/templates
 *
 * Form data (multipart/form-data):
 *   - file: DOCX template file (required)
 *   - name_fr: French name (required)
 *   - name_en: English name (optional)
 *   - description_fr: French description (optional)
 *   - description_en: English description (optional)
 *   - scope: "personal" (default) or "organization" - determines template visibility
 *   - service_id: LLM service the template is uploaded for (linked on the gateway)
 *
 * Scope behavior:
 *   - "personal": Template is scoped to the authenticated user (user_id from JWT)
 *   - "organization": Template is scoped to the organization from the path,
 *     reserved to maintainers and admins
 * The authenticated user is recorded as owner of the template.
 *
 * Note: The template file should contain {{output}} placeholder for AI-generated content
 */
async function createTemplate(req, res, next) {
  try {
    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      throw new PublicationAuthRequired()
    }

    // Check for file upload
    if (!req.files || !req.files.file) {
      throw new PublicationError("A DOCX file is required")
    }

    const file = req.files.file
    const {
      name_fr,
      name_en,
      description_fr,
      description_en,
      scope,
      service_id,
    } = req.body
    // Organization comes from the path param, membership enforced by the route middleware
    const organization_id = req.params.organizationId

    // Validate required fields
    if (!name_fr || !name_fr.trim()) {
      throw new PublicationError("name_fr is required")
    }

    // Handle scope: personal (user) or organization
    // Default to personal scope using authenticated user's ID
    const templateScope = scope || "personal"
    if (!["personal", "organization"].includes(templateScope)) {
      throw new PublicationError("scope must be personal or organization")
    }
    if (templateScope === "organization" && !canManageOrgTemplates(req)) {
      throw new PublicationForbidden(
        "Only maintainers and admins can share a template with the organization",
      )
    }

    // Validate file type
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream", // Some browsers send this for .docx
    ]
    const isValidType =
      validMimeTypes.includes(file.mimetype) ||
      file.name.toLowerCase().endsWith(".docx")

    if (!isValidType) {
      throw new PublicationInvalidFormat(
        "Invalid file type. Only DOCX files are accepted.",
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new PublicationError("File too large. Maximum size is 10MB.")
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    // Create FormData for multipart request to LLM Gateway
    const formData = new FormData()

    // Append file - express-fileupload provides file.data as Buffer
    formData.append("file", file.data, {
      filename: file.name,
      contentType:
        file.mimetype ||
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

    // Organization ID is required for all scoped templates (LLM Gateway enforces this)
    formData.append("organization_id", organization_id)
    formData.append("owner_user_id", authenticatedUserId)
    if (service_id) {
      const resolvedServiceId = await resolveServiceId(baseUrl, service_id)
      if (!resolvedServiceId) {
        throw new PublicationNotFound("Service not found")
      }
      formData.append("service_id", resolvedServiceId)
    }

    if (templateScope === "organization") {
      // Organization-scoped template: org_id only, no user_id
      debug(`Creating org-scoped template for org: ${organization_id}`)
    } else {
      // Personal/user-scoped template (default): org_id + user_id
      // Use authenticated user's MongoDB ObjectId directly (LLM Gateway accepts any string ID)
      formData.append("user_id", authenticatedUserId)
      debug(
        `Creating user-scoped template for user: ${authenticatedUserId} in org: ${organization_id}`,
      )
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

    debug(`Template uploaded successfully: ${response.data?.id}`)

    return res.status(201).json({
      status: "success",
      template: response.data || {},
    })
  } catch (err) {
    // Handle axios errors from LLM Gateway
    if (err.response?.status) {
      let errorDetail =
        err.response?.data?.detail || err.response?.data?.message || err.message
      if (err.response.status === 400) {
        return next(new PublicationError(errorDetail))
      }
      if (err.response.status === 500) {
        return next(new PublicationUploadFailed(errorDetail))
      }
    }
    next(err)
  }
}

/**
 * Delete a publication template
 * DELETE /publication/organizations/:organizationId/templates/:templateId
 *
 * System templates cannot be deleted. Otherwise the owner can always delete,
 * and maintainers/admins can delete any template shared with the organization.
 */
async function deleteTemplate(req, res, next) {
  try {
    const { templateId, organizationId } = req.params

    if (!templateId) {
      throw new PublicationIdRequired("templateId is required")
    }

    // Get authenticated user's ID from JWT payload
    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      throw new PublicationAuthRequired()
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    const template = await fetchTemplate(baseUrl, templateId)

    if (template.scope === "system") {
      throw new PublicationForbidden("Cannot delete system templates")
    }

    const sharedWithOrg =
      template.scope === "organization" &&
      (template.allowed_organization_ids || []).includes(organizationId)
    const allowed =
      isTemplateOwner(template, authenticatedUserId) ||
      (sharedWithOrg && canManageOrgTemplates(req))
    if (!allowed) {
      throw new PublicationForbidden("You can only delete your own templates")
    }

    // Delete the template via LLM Gateway
    const deleteUrl = `${baseUrl}/api/v1/document-templates/${templateId}`
    await axios.delete(deleteUrl, { timeout: 5000 })

    debug(`Template deleted: ${templateId} by user ${authenticatedUserId}`)

    return res.status(200).json({
      status: "success",
      message: "Template deleted successfully",
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Share a template with the organization, or make it personal again
 * PATCH /publication/organizations/:organizationId/templates/:templateId
 *
 * Body: { scope: "organization" | "personal" }
 * Only the owner can change the scope, and only maintainers/admins can share
 * with the organization. System templates are read-only.
 */
async function updateTemplateScope(req, res, next) {
  try {
    const { templateId, organizationId } = req.params
    const { scope } = req.body || {}

    if (!templateId) {
      throw new PublicationIdRequired("templateId is required")
    }
    if (!["personal", "organization"].includes(scope)) {
      throw new PublicationError("scope must be personal or organization")
    }

    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      throw new PublicationAuthRequired()
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    const template = await fetchTemplate(baseUrl, templateId)

    if (template.scope === "system") {
      throw new PublicationForbidden("System templates cannot be changed")
    }
    if (!isTemplateOwner(template, authenticatedUserId)) {
      throw new PublicationForbidden("You can only share your own templates")
    }
    if (!canManageOrgTemplates(req)) {
      throw new PublicationForbidden(
        "Only maintainers and admins can share a template with the organization",
      )
    }

    // Gateway PUT is multipart: replace_scope lets us send an empty user list.
    const formData = new FormData()
    formData.append("replace_scope", "true")
    formData.append("allowed_organization_ids", organizationId)
    if (scope === "personal") {
      formData.append("allowed_user_ids", authenticatedUserId)
    }

    const nativeAxios = require("axios")
    const response = await nativeAxios.put(
      `${baseUrl}/api/v1/document-templates/${templateId}`,
      formData,
      { headers: { ...formData.getHeaders() }, timeout: 10000 },
    )

    debug(
      `Template ${templateId} scope set to ${scope} by user ${authenticatedUserId}`,
    )

    return res.status(200).json({
      status: "success",
      template: response.data || {},
    })
  } catch (err) {
    if (err.response?.status === 404) {
      return next(new PublicationNotFound("Template not found"))
    }
    if (err.response?.status === 400) {
      return next(
        new PublicationError(err.response?.data?.detail || "Invalid request"),
      )
    }
    next(err)
  }
}

/**
 * Download the DOCX file of a template (to customize it)
 * GET /publication/organizations/:organizationId/templates/:templateId/download
 *
 * Any template visible to the caller can be downloaded.
 */
async function downloadTemplate(req, res, next) {
  try {
    const { templateId, organizationId } = req.params

    if (!templateId) {
      throw new PublicationIdRequired("templateId is required")
    }

    const authenticatedUserId = req.payload?.data?.userId
    if (!authenticatedUserId) {
      throw new PublicationAuthRequired()
    }

    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      throw new PublicationNotConfigured()
    }

    const template = await fetchTemplate(baseUrl, templateId)
    if (!isTemplateVisible(template, organizationId, authenticatedUserId)) {
      throw new PublicationForbidden("Template not available")
    }

    const content = await axios.get(
      `${baseUrl}/api/v1/document-templates/${templateId}/download`,
      { responseType: "arraybuffer", timeout: 30000 },
    )

    const safeName = (template.file_name || "template.docx").replace(
      /[^a-zA-Z0-9-_.]/g,
      "_",
    )
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`)
    return res.send(Buffer.from(content))
  } catch (err) {
    if (err.response?.status === 404) {
      return next(new PublicationNotFound("Template not found"))
    }
    next(err)
  }
}

module.exports = {
  getTemplates,
  getTemplatePlaceholders,
  exportWithTemplate,
  createTemplate,
  deleteTemplate,
  updateTemplateScope,
  downloadTemplate,
}
