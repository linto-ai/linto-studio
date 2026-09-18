/**
 * Publication Feature Tests
 *
 * Tests for the publication proxy endpoints that connect LinTO Studio
 * to LLM Gateway for template management and document export.
 *
 * API contract tests for publication endpoints.
 * Updated to match the refactored implementation using custom error classes
 * and global error handler pattern.
 */

// Mock dependencies before requiring the module
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationExport: {
    updateStatus: jest.fn().mockResolvedValue({}),
    getByJobId: jest.fn().mockResolvedValue([]),
  },
}))

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

describe("Publication Feature - API Contract Conformance", () => {
  let getTemplates, getTemplatePlaceholders, exportWithTemplate

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    // Re-require to get fresh module with mocks
    jest.resetModules()
    const publication = require(
      `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
    )
    getTemplates = publication.getTemplates
    getTemplatePlaceholders = publication.getTemplatePlaceholders
    exportWithTemplate = publication.exportWithTemplate
  })

  describe("GET /api/publication/templates", () => {
    it("[CONTRACT] should return { status: success, templates: [...] } on success", async () => {
      // LLM Gateway returns array of templates directly from /api/v1/document-templates
      const mockLLMGatewayResponse = [
        {
          id: "template-uuid-1",
          name_fr: "Rapport de synthese",
          name_en: "Summary Report",
          description_fr: "Modele pour les syntheses",
          description_en: "Template for summaries",
          placeholders: ["output", "title", "summary"],
          is_default: false,
          scope: "system",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
        },
      ]

      mockAxios.get.mockResolvedValue(mockLLMGatewayResponse)

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        templates: expect.arrayContaining([
          expect.objectContaining({
            id: "template-uuid-1",
            name_fr: "Rapport de synthese",
            name_en: "Summary Report",
            placeholders: ["output", "title", "summary"],
          }),
        ]),
      })
    })

    it("[CONTRACT] should call correct LLM Gateway URL: /api/v1/document-templates", async () => {
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Per API contract and bug fix: must call /api/v1/document-templates (NOT /api/v1/templates)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/document-templates"),
        expect.any(Object),
      )
      // Should NOT call the old incorrect endpoint
      expect(mockAxios.get).not.toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/v1\/templates[^/]/),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should scope the listing to the organization from the path", async () => {
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = {
        query: { organization_id: "untrusted-org-id" },
        params: { organizationId: "org-uuid-123" },
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("organization_id=org-uuid-123"),
        expect.any(Object),
      )
      // Should NOT use a client-supplied query value
      expect(mockAxios.get).not.toHaveBeenCalledWith(
        expect.stringContaining("organization_id=untrusted-org-id"),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should pass user_id from JWT payload (not query param) for security", async () => {
      // Implementation uses JWT-based user for security instead of query param
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      // Query param user_id should be ignored - JWT payload is used instead
      const mockReq = {
        query: { user_id: "untrusted-user-id" },
        params: { organizationId: "org-uuid-123" },
        payload: { data: { userId: "jwt-authenticated-user-123" } },
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Should use JWT-derived user, not the query param
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("user_id=jwt-authenticated-user-123"),
        expect.any(Object),
      )
      // Should NOT use the untrusted query param
      expect(mockAxios.get).not.toHaveBeenCalledWith(
        expect.stringContaining("user_id=untrusted-user-id"),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should pass include_system=true by default", async () => {
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("include_system=true"),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should always use include_system=true regardless of query param", async () => {
      // Implementation hardcodes include_system=true for better UX
      // This ensures users always see system templates along with their scoped ones
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = {
        query: { include_system: "false" },
        params: { organizationId: "org-uuid-123" },
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Implementation always includes system templates (hardcoded to true)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("include_system=true"),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      // Re-require to pick up env change
      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
      )

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await publication.getTemplates(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationNotConfigured",
          status: 500,
          message: "LLM Gateway not configured",
        }),
      )
    })

    it("[CONTRACT] should call next with error on LLM Gateway connection failure", async () => {
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await getTemplates(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Connection refused",
        }),
      )
    })

    it("[CONTRACT] should preserve name_fr and name_en fields (i18n support)", async () => {
      const mockResponse = [
        {
          id: "template-1",
          name_fr: "Compte rendu de reunion",
          name_en: "Meeting Minutes",
          description_fr: null,
          description_en: null,
          placeholders: ["output"],
          is_default: true,
          scope: "system",
        },
      ]
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      const response = mockRes.json.mock.calls[0][0]
      expect(response.templates[0]).toHaveProperty(
        "name_fr",
        "Compte rendu de reunion",
      )
      expect(response.templates[0]).toHaveProperty("name_en", "Meeting Minutes")
      // Should NOT have a single "name" field that overwrites i18n fields
      expect(response.templates[0]).not.toHaveProperty("name")
    })
  })

  describe("GET /api/publication/templates/:templateId/placeholders", () => {
    it("[CONTRACT] should return { status: success, placeholders: [...] } for valid template", async () => {
      // LLM Gateway returns placeholders array
      const mockPlaceholders = [
        {
          name: "output",
          description: "Main content output",
          is_standard: true,
        },
        { name: "title", description: "Document title", is_standard: true },
        { name: "summary", description: "Summary", is_standard: false },
      ]

      mockAxios.get.mockResolvedValue(mockPlaceholders)

      const mockReq = { params: { templateId: "template-uuid-1" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplatePlaceholders(mockReq, mockRes, jest.fn())

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        placeholders: expect.arrayContaining([
          expect.objectContaining({ name: "output", is_standard: true }),
          expect.objectContaining({ name: "title", is_standard: true }),
        ]),
      })
    })

    it("[CONTRACT] should call correct LLM Gateway URL: /api/v1/document-templates/{id}/placeholders", async () => {
      const mockPlaceholders = []
      mockAxios.get.mockResolvedValue(mockPlaceholders)

      const mockReq = { params: { templateId: "template-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplatePlaceholders(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/document-templates/template-uuid-123/placeholders",
        expect.any(Object),
      )
    })

    it("[CONTRACT] should call next with PublicationIdRequired error when templateId is missing", async () => {
      const mockReq = { params: {} }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await getTemplatePlaceholders(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationIdRequired",
          status: 400,
          message: "templateId is required",
        }),
      )
    })

    it("[CONTRACT] should call next with PublicationNotFound error when template not found", async () => {
      const error = new Error("Template not found")
      error.response = { status: 404 }
      mockAxios.get.mockRejectedValue(error)

      const mockReq = { params: { templateId: "nonexistent-uuid" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await getTemplatePlaceholders(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationNotFound",
          status: 404,
          message: "Template not found",
        }),
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
      )

      const mockReq = { params: { templateId: "template-uuid-1" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await publication.getTemplatePlaceholders(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationNotConfigured",
          status: 500,
          message: "LLM Gateway not configured",
        }),
      )
    })
  })

  describe("GET /api/publication/:jobId/export/:format", () => {
    it("[CONTRACT] should export PDF document successfully", async () => {
      const mockPdfBuffer = Buffer.from("PDF content")
      mockAxios.get.mockResolvedValue(mockPdfBuffer)

      const mockReq = {
        params: { jobId: "job-uuid-1", format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn(),
        send: jest.fn(),
      }

      await exportWithTemplate(mockReq, mockRes, jest.fn())

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/pdf",
      )
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining("export.pdf"),
      )
      expect(mockRes.send).toHaveBeenCalled()
    })

    it("[CONTRACT] should export DOCX document successfully", async () => {
      const mockDocxBuffer = Buffer.from("DOCX content")
      mockAxios.get.mockResolvedValue(mockDocxBuffer)

      const mockReq = {
        params: { jobId: "job-uuid-1", format: "docx" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn(),
        send: jest.fn(),
      }

      await exportWithTemplate(mockReq, mockRes, jest.fn())

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      )
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining("export.docx"),
      )
    })

    it("[CONTRACT] should call LLM Gateway with correct export URL", async () => {
      const mockBuffer = Buffer.from("content")
      mockAxios.get.mockResolvedValue(mockBuffer)

      const mockReq = {
        params: { jobId: "job-uuid-123", format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn(),
        send: jest.fn(),
      }

      await exportWithTemplate(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-123/export/pdf",
        expect.objectContaining({ responseType: "arraybuffer" }),
      )
    })

    it("[CONTRACT] should pass template_id query parameter when provided", async () => {
      const mockBuffer = Buffer.from("content")
      mockAxios.get.mockResolvedValue(mockBuffer)

      const mockReq = {
        params: { jobId: "job-uuid-123", format: "pdf" },
        query: { templateId: "template-uuid-456" },
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        setHeader: jest.fn(),
        send: jest.fn(),
      }

      await exportWithTemplate(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("template_id=template-uuid-456"),
        expect.any(Object),
      )
    })

    it("[CONTRACT] should call next with PublicationInvalidFormat error for invalid format", async () => {
      const mockReq = {
        params: { jobId: "job-uuid-1", format: "txt" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await exportWithTemplate(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationInvalidFormat",
          status: 400,
          message: "Invalid format. Allowed: pdf, docx, html",
        }),
      )
    })

    it("[CONTRACT] should call next with PublicationIdRequired error when jobId is missing", async () => {
      const mockReq = {
        params: { format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await exportWithTemplate(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationIdRequired",
          status: 400,
          message: "jobId is required",
        }),
      )
    })

    it("[CONTRACT] should call next with PublicationNotFound error when job not found", async () => {
      const error = new Error("Job not found")
      error.response = { status: 404 }
      mockAxios.get.mockRejectedValue(error)

      const mockReq = {
        params: { jobId: "nonexistent-uuid", format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await exportWithTemplate(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationNotFound",
          status: 404,
          message: "Job not found",
        }),
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
      )

      const mockReq = {
        params: { jobId: "job-uuid-1", format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await publication.exportWithTemplate(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "PublicationNotConfigured",
          status: 500,
          message: "LLM Gateway not configured",
        }),
      )
    })

    it("[CONTRACT] should call next with error on document generation failure", async () => {
      const error = new Error("Internal server error")
      error.response = { status: 500 }
      mockAxios.get.mockRejectedValue(error)

      const mockReq = {
        params: { jobId: "job-uuid-1", format: "pdf" },
        query: {},
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await exportWithTemplate(mockReq, mockRes, mockNext)

      // For 500 errors without special handling, the original error is passed to next()
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Internal server error",
        }),
      )
    })
  })

  describe("Response Format Conformance", () => {
    it("[CONTRACT] getTemplates response should have { status: 'success', templates: [...] } format", async () => {
      const mockResponse = [{ id: "1", name_fr: "Test", name_en: "Test" }]
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      const response = mockRes.json.mock.calls[0][0]
      // Per api-contract.md, response MUST be { status: "success", templates: [...] }
      expect(response).toHaveProperty("status", "success")
      expect(response).toHaveProperty("templates")
      expect(Array.isArray(response.templates)).toBe(true)
    })

    it("[CONTRACT] getTemplatePlaceholders response should have { status: 'success', placeholders: [...] } format", async () => {
      const mockResponse = [{ name: "output", is_standard: true }]
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { params: { templateId: "test-id" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplatePlaceholders(mockReq, mockRes, jest.fn())

      const response = mockRes.json.mock.calls[0][0]
      expect(response).toHaveProperty("status", "success")
      expect(response).toHaveProperty("placeholders")
      expect(Array.isArray(response.placeholders)).toBe(true)
    })

    it("[CONTRACT] errors should be passed to next() with proper error class properties", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
      )

      const mockReq = { query: {}, params: { organizationId: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await publication.getTemplates(mockReq, mockRes, mockNext)

      // Errors are now passed to next() for global handler
      expect(mockNext).toHaveBeenCalled()
      const error = mockNext.mock.calls[0][0]
      expect(error).toHaveProperty("name")
      expect(error).toHaveProperty("status")
      expect(error).toHaveProperty("message")
    })
  })
})

describe("Publication Routes Configuration", () => {
  it("should export routes with correct configuration", () => {
    const routes = require(
      `${process.cwd()}/components/WebServer/routes/api/publication/publication.js`,
    )
    const webserver = {}
    const routeConfig = routes(webserver)

    expect(routeConfig).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/organizations/:organizationId/templates",
          method: "get",
          requireAuth: true,
          requireOrganizationMemberAccess: true,
        }),
        expect.objectContaining({
          path: "/organizations/:organizationId/templates/:templateId/placeholders",
          method: "get",
          requireAuth: true,
          requireOrganizationMemberAccess: true,
        }),
        expect.objectContaining({
          path: "/conversations/:conversationId/jobs/:jobId/export/:format",
          method: "get",
          requireAuth: true,
          requireConversationReadAccess: true,
        }),
      ]),
    )
  })
})

describe("Publication templates - ownership and organization sharing", () => {
  let createTemplate, deleteTemplate, updateTemplateScope, downloadTemplate
  const mockNativeAxios = { post: jest.fn(), put: jest.fn() }

  const ROLES = { MEMBER: 1, MAINTAINER: 5, ADMIN: 6 }
  const ORG = "org-1"
  const ME = "user-1"

  function reqFor({
    role = ROLES.MEMBER,
    userId = ME,
    body = {},
    params = {},
  } = {}) {
    return {
      params: { organizationId: ORG, templateId: "tpl-1", ...params },
      payload: { data: { userId } },
      userRole: role,
      body,
      files: {
        file: {
          name: "mine.docx",
          data: Buffer.from("PK"),
          size: 10,
          mimetype:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      },
    }
  }
  function resMock() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    }
  }
  const personalOfMe = {
    id: "tpl-1",
    scope: "user",
    owner_user_id: ME,
    allowed_organization_ids: [ORG],
    allowed_user_ids: [ME],
    file_name: "mine.docx",
  }
  const sharedByOther = {
    id: "tpl-1",
    scope: "organization",
    owner_user_id: "user-2",
    allowed_organization_ids: [ORG],
    allowed_user_ids: [],
    file_name: "shared.docx",
  }
  const personalOfOther = {
    ...personalOfMe,
    owner_user_id: "user-2",
    allowed_user_ids: ["user-2"],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
    jest.resetModules()
    jest.doMock("axios", () => mockNativeAxios)
    mockAxios.delete = jest.fn().mockResolvedValue({})
    const publication = require(
      `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
    )
    createTemplate = publication.createTemplate
    deleteTemplate = publication.deleteTemplate
    updateTemplateScope = publication.updateTemplateScope
    downloadTemplate = publication.downloadTemplate
  })

  describe("service identifier resolution", () => {
    const publicationModule = () =>
      require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`,
      )

    it("resolves a service route to the gateway UUID when listing", async () => {
      mockAxios.get
        .mockResolvedValueOnce({
          items: [
            { id: "0b1c2d3e-0000-4000-8000-000000000001", route: "resumé" },
          ],
        })
        .mockResolvedValueOnce([])
      const res = resMock()
      await publicationModule().getTemplates(
        {
          query: { service_id: "resumé" },
          params: { organizationId: ORG },
          payload: { data: { userId: ME } },
        },
        res,
        jest.fn(),
      )
      expect(mockAxios.get.mock.calls[1][0]).toContain(
        "/api/v1/services/0b1c2d3e-0000-4000-8000-000000000001/templates",
      )
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it("uses a UUID as-is without asking the gateway", async () => {
      mockAxios.get.mockResolvedValueOnce([])
      await publicationModule().getTemplates(
        {
          query: { service_id: "0b1c2d3e-0000-4000-8000-000000000001" },
          params: { organizationId: ORG },
          payload: { data: { userId: ME } },
        },
        resMock(),
        jest.fn(),
      )
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
    })

    it("fails with not found for an unknown route", async () => {
      mockAxios.get.mockResolvedValueOnce({ items: [] })
      const next = jest.fn()
      await publicationModule().getTemplates(
        {
          query: { service_id: "nope" },
          params: { organizationId: ORG },
          payload: { data: { userId: ME } },
        },
        resMock(),
        next,
      )
      expect(next.mock.calls[0][0].name).toBe("PublicationNotFound")
    })
  })

  describe("createTemplate", () => {
    it("records the uploader and links the service", async () => {
      mockNativeAxios.post.mockResolvedValue({ data: { id: "tpl-1" } })
      const res = resMock()
      await createTemplate(
        reqFor({
          body: {
            name_fr: "Mien",
            service_id: "0b1c2d3e-0000-4000-8000-000000000001",
          },
        }),
        res,
        jest.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(201)
      const form = mockNativeAxios.post.mock.calls[0][1]
      const payload = form.getBuffer().toString()
      expect(payload).toContain('name="owner_user_id"')
      expect(payload).toContain(ME)
      expect(payload).toContain('name="service_id"')
      expect(payload).toContain("0b1c2d3e-0000-4000-8000-000000000001")
      expect(payload).toContain('name="user_id"')
    })

    it("refuses an organization template from a plain member", async () => {
      const next = jest.fn()
      await createTemplate(
        reqFor({ body: { name_fr: "Mien", scope: "organization" } }),
        resMock(),
        next,
      )
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
      expect(mockNativeAxios.post).not.toHaveBeenCalled()
    })

    it("lets a maintainer upload an organization template", async () => {
      mockNativeAxios.post.mockResolvedValue({ data: { id: "tpl-1" } })
      const res = resMock()
      await createTemplate(
        reqFor({
          role: ROLES.MAINTAINER,
          body: { name_fr: "Orga", scope: "organization" },
        }),
        res,
        jest.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(201)
      const payload = mockNativeAxios.post.mock.calls[0][1]
        .getBuffer()
        .toString()
      expect(payload).not.toContain('name="user_id"')
    })
  })

  describe("deleteTemplate", () => {
    it("owner can delete a personal template", async () => {
      mockAxios.get.mockResolvedValue(personalOfMe)
      const res = resMock()
      await deleteTemplate(reqFor(), res, jest.fn())
      expect(mockAxios.delete).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
    })

    it("member cannot delete a template shared by someone else", async () => {
      mockAxios.get.mockResolvedValue(sharedByOther)
      const next = jest.fn()
      await deleteTemplate(reqFor(), resMock(), next)
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
      expect(mockAxios.delete).not.toHaveBeenCalled()
    })

    it("maintainer can delete a template shared with the organization", async () => {
      mockAxios.get.mockResolvedValue(sharedByOther)
      const res = resMock()
      await deleteTemplate(reqFor({ role: ROLES.MAINTAINER }), res, jest.fn())
      expect(mockAxios.delete).toHaveBeenCalled()
    })

    it("maintainer cannot delete someone else's personal template", async () => {
      mockAxios.get.mockResolvedValue(personalOfOther)
      const next = jest.fn()
      await deleteTemplate(reqFor({ role: ROLES.ADMIN }), resMock(), next)
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
    })

    it("system templates are never deleted", async () => {
      mockAxios.get.mockResolvedValue({ id: "tpl-1", scope: "system" })
      const next = jest.fn()
      await deleteTemplate(reqFor({ role: ROLES.ADMIN }), resMock(), next)
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
    })
  })

  describe("updateTemplateScope", () => {
    it("maintainer shares their own template with the organization", async () => {
      mockAxios.get.mockResolvedValue(personalOfMe)
      mockNativeAxios.put.mockResolvedValue({
        data: { ...personalOfMe, scope: "organization" },
      })
      const res = resMock()
      await updateTemplateScope(
        reqFor({ role: ROLES.MAINTAINER, body: { scope: "organization" } }),
        res,
        jest.fn(),
      )
      expect(res.status).toHaveBeenCalledWith(200)
      const [url, form] = mockNativeAxios.put.mock.calls[0]
      expect(url).toBe("http://localhost:8010/api/v1/document-templates/tpl-1")
      const payload = form.getBuffer().toString()
      expect(payload).toContain('name="replace_scope"')
      expect(payload).toContain('name="allowed_organization_ids"')
      expect(payload).not.toContain('name="allowed_user_ids"')
    })

    it("back to personal keeps the owner in the user list", async () => {
      mockAxios.get.mockResolvedValue({
        ...personalOfMe,
        scope: "organization",
      })
      mockNativeAxios.put.mockResolvedValue({ data: personalOfMe })
      await updateTemplateScope(
        reqFor({ role: ROLES.ADMIN, body: { scope: "personal" } }),
        resMock(),
        jest.fn(),
      )
      const payload = mockNativeAxios.put.mock.calls[0][1]
        .getBuffer()
        .toString()
      expect(payload).toContain('name="allowed_user_ids"')
      expect(payload).toContain(ME)
    })

    it("plain member cannot share", async () => {
      mockAxios.get.mockResolvedValue(personalOfMe)
      const next = jest.fn()
      await updateTemplateScope(
        reqFor({ body: { scope: "organization" } }),
        resMock(),
        next,
      )
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
      expect(mockNativeAxios.put).not.toHaveBeenCalled()
    })

    it("maintainer cannot share someone else's template", async () => {
      mockAxios.get.mockResolvedValue(personalOfOther)
      const next = jest.fn()
      await updateTemplateScope(
        reqFor({ role: ROLES.MAINTAINER, body: { scope: "organization" } }),
        resMock(),
        next,
      )
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
    })

    it("rejects an unknown scope", async () => {
      const next = jest.fn()
      await updateTemplateScope(
        reqFor({ role: ROLES.ADMIN, body: { scope: "everyone" } }),
        resMock(),
        next,
      )
      expect(next.mock.calls[0][0].name).toBe("PublicationError")
    })
  })

  describe("downloadTemplate", () => {
    it("streams the docx of a visible template", async () => {
      mockAxios.get
        .mockResolvedValueOnce({
          id: "tpl-1",
          scope: "system",
          file_name: "base.docx",
        })
        .mockResolvedValueOnce(Buffer.from("PKdocx"))
      const res = resMock()
      await downloadTemplate(reqFor(), res, jest.fn())
      expect(mockAxios.get.mock.calls[1][0]).toBe(
        "http://localhost:8010/api/v1/document-templates/tpl-1/download",
      )
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        'attachment; filename="base.docx"',
      )
      expect(res.send).toHaveBeenCalled()
    })

    it("refuses someone else's personal template", async () => {
      mockAxios.get.mockResolvedValueOnce(personalOfOther)
      const next = jest.fn()
      await downloadTemplate(reqFor(), resMock(), next)
      expect(next.mock.calls[0][0].name).toBe("PublicationForbidden")
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
    })
  })

  it("routes expose the scope and download endpoints to members", () => {
    const routes = require(
      `${process.cwd()}/components/WebServer/routes/api/publication/publication.js`,
    )
    expect(routes({})).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/organizations/:organizationId/templates/:templateId",
          method: "patch",
          requireOrganizationMemberAccess: true,
        }),
        expect.objectContaining({
          path: "/organizations/:organizationId/templates/:templateId/download",
          method: "get",
          requireOrganizationMemberAccess: true,
        }),
      ]),
    )
  })
})
