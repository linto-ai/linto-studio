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
      `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`
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

      const mockReq = { query: {} }
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

      const mockReq = { query: {} }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Per API contract and bug fix: must call /api/v1/document-templates (NOT /api/v1/templates)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/document-templates"),
        expect.any(Object)
      )
      // Should NOT call the old incorrect endpoint
      expect(mockAxios.get).not.toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/v1\/templates[^/]/),
        expect.any(Object)
      )
    })

    it("[CONTRACT] should pass organization_id query parameter when provided", async () => {
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: { organization_id: "org-uuid-123" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("organization_id=org-uuid-123"),
        expect.any(Object)
      )
    })

    it("[CONTRACT] should pass user_id from JWT payload (not query param) for security", async () => {
      // Implementation uses JWT-based user for security instead of query param
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      // Query param user_id should be ignored - JWT payload is used instead
      const mockReq = {
        query: { user_id: "untrusted-user-id" },
        payload: { data: { userId: "jwt-authenticated-user-123" } }
      }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Should use JWT-derived user, not the query param
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("user_id=jwt-authenticated-user-123"),
        expect.any(Object)
      )
      // Should NOT use the untrusted query param
      expect(mockAxios.get).not.toHaveBeenCalledWith(
        expect.stringContaining("user_id=untrusted-user-id"),
        expect.any(Object)
      )
    })

    it("[CONTRACT] should pass include_system=true by default", async () => {
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {} }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("include_system=true"),
        expect.any(Object)
      )
    })

    it("[CONTRACT] should always use include_system=true regardless of query param", async () => {
      // Implementation hardcodes include_system=true for better UX
      // This ensures users always see system templates along with their scoped ones
      const mockResponse = []
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: { include_system: "false" } }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      // Implementation always includes system templates (hardcoded to true)
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("include_system=true"),
        expect.any(Object)
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      // Re-require to pick up env change
      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`
      )

      const mockReq = { query: {} }
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
        })
      )
    })

    it("[CONTRACT] should call next with error on LLM Gateway connection failure", async () => {
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      const mockReq = { query: {} }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const mockNext = jest.fn()

      await getTemplates(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Connection refused",
        })
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

      const mockReq = { query: {} }
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await getTemplates(mockReq, mockRes, jest.fn())

      const response = mockRes.json.mock.calls[0][0]
      expect(response.templates[0]).toHaveProperty("name_fr", "Compte rendu de reunion")
      expect(response.templates[0]).toHaveProperty("name_en", "Meeting Minutes")
      // Should NOT have a single "name" field that overwrites i18n fields
      expect(response.templates[0]).not.toHaveProperty("name")
    })
  })

  describe("GET /api/publication/templates/:templateId/placeholders", () => {
    it("[CONTRACT] should return { status: success, placeholders: [...] } for valid template", async () => {
      // LLM Gateway returns placeholders array
      const mockPlaceholders = [
        { name: "output", description: "Main content output", is_standard: true },
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
        expect.any(Object)
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
        })
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
        })
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`
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
        })
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
        "application/pdf"
      )
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining("export.pdf")
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
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining("export.docx")
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
        expect.objectContaining({ responseType: "arraybuffer" })
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
        expect.any(Object)
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
        })
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
        })
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
        })
      )
    })

    it("[CONTRACT] should call next with PublicationNotConfigured error when LLM Gateway not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      jest.resetModules()
      const publication = require(
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`
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
        })
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
        })
      )
    })
  })

  describe("Response Format Conformance", () => {
    it("[CONTRACT] getTemplates response should have { status: 'success', templates: [...] } format", async () => {
      const mockResponse = [{ id: "1", name_fr: "Test", name_en: "Test" }]
      mockAxios.get.mockResolvedValue(mockResponse)

      const mockReq = { query: {} }
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
        `${process.cwd()}/components/WebServer/routecontrollers/publication/publication.js`
      )

      const mockReq = { query: {} }
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
      `${process.cwd()}/components/WebServer/routes/api/publication/publication.js`
    )
    const webserver = {}
    const routeConfig = routes(webserver)

    expect(routeConfig).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/templates",
          method: "get",
          requireAuth: true,
        }),
        expect.objectContaining({
          path: "/templates/:templateId/placeholders",
          method: "get",
          requireAuth: true,
        }),
        expect.objectContaining({
          path: "/:jobId/export/:format",
          method: "get",
          requireAuth: true,
        }),
      ])
    )
  })
})
