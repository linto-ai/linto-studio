/**
 * Versioning and Document Export API Tests
 *
 * Tests the versioning and document export endpoints per api-contract.md:
 * - PUT /api/conversations/:conversationId/export/:jobId/result
 * - GET /api/conversations/:conversationId/export/:jobId/versions
 * - GET /api/conversations/:conversationId/export/:jobId/versions/:versionNumber
 * - POST /api/conversations/:conversationId/export/:jobId/versions/:versionNumber/restore
 * - POST /api/conversations/:conversationId/export/:jobId/document
 */

// Track axios calls
const axiosGetCalls = []
const axiosPatchCalls = []
const axiosPostCalls = []

const mockAxios = {
  get: jest.fn().mockImplementation((url, options) => {
    axiosGetCalls.push({ url, options })
    return Promise.resolve([])
  }),
  patch: jest.fn().mockImplementation((url, data) => {
    axiosPatchCalls.push({ url, data })
    return Promise.resolve({ current_version: 2 })
  }),
  post: jest.fn().mockImplementation((url, data) => {
    axiosPostCalls.push({ url, data })
    return Promise.resolve({ current_version: 3, result: { output: "Restored content" } })
  }),
}

jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationExport: {
    getByJobId: jest.fn().mockResolvedValue([{ _id: "export-123", jobId: "job-uuid", currentVersion: 1 }]),
    update: jest.fn().mockResolvedValue({}),
  },
  conversations: {
    getById: jest.fn().mockResolvedValue([{ _id: "conv-123", name: "Test Conversation" }]),
  },
}))

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

// Mock express request/response
const createMockReq = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query,
})

const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  }
  return res
}

describe("Versioning API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axiosGetCalls.length = 0
    axiosPatchCalls.length = 0
    axiosPostCalls.length = 0
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
  })

  describe("PUT /conversations/:conversationId/export/:jobId/result - Update Result", () => {
    it("[CONTRACT] should send PATCH to LLM Gateway /api/v1/jobs/:jobId/result", async () => {
      const {
        updateExportResult,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid-abc" },
        { content: "# Updated markdown content" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await updateExportResult(req, res, next)

      // Verify correct LLM Gateway URL was called
      expect(mockAxios.patch).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-abc/result",
        { content: "# Updated markdown content" }
      )
    })

    it("[CONTRACT] should return success response with jobId and version", async () => {
      const {
        updateExportResult,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.patch.mockResolvedValueOnce({ current_version: 5 })

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid-xyz" },
        { content: "# New content" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await updateExportResult(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          jobId: "job-uuid-xyz",
          version: 5,
        })
      )
    })

    it("[CONTRACT] should pass validation error to next middleware when content is missing", async () => {
      // Reset modules to ensure fresh import
      jest.resetModules()

      // Re-mock dependencies
      jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
      jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
        conversationExport: {
          getByJobId: jest.fn().mockResolvedValue([]),
          update: jest.fn().mockResolvedValue({}),
        },
        conversations: {
          getById: jest.fn().mockResolvedValue([]),
        },
      }))

      const {
        updateExportResult,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        {} // No content - should trigger validation error
      )
      const res = createMockRes()
      const next = jest.fn()

      // The controller throws ConversationMetadataRequire which should be caught
      // and passed to next() in the try-catch block
      try {
        await updateExportResult(req, res, next)
      } catch (e) {
        // If error propagates, it means the controller is not catching it properly
        // In actual Express middleware, this would be caught by the error handler
      }

      // The error should have been passed to next or the function should throw
      // Since the function has a try-catch that calls next(error), we verify via next
      // OR the controller sends error response directly
      // Based on the code, it throws ConversationMetadataRequire which the error middleware handles
      const wasErrorHandled =
        next.mock.calls.length > 0 || res.status.mock.calls.length > 0

      expect(wasErrorHandled).toBe(true)
    })

    it("[CONTRACT] should pass ExportNotConfigured error to next() when LLM Gateway is not configured", async () => {
      const {
        updateExportResult,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      process.env.LLM_GATEWAY_SERVICES = ""

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        { content: "Test" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await updateExportResult(req, res, next)

      // With new error handling pattern, errors are passed to next()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].name).toBe("ExportNotConfigured")
      expect(next.mock.calls[0][0].status).toBe(500)
    })
  })

  describe("GET /conversations/:conversationId/export/:jobId/versions - List Versions", () => {
    it("[CONTRACT] should proxy to LLM Gateway GET /api/v1/jobs/:jobId/versions", async () => {
      const {
        listExportVersions,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce([
        { version_number: 1, created_at: "2025-12-11T10:00:00Z", content_length: 1000 },
        { version_number: 2, created_at: "2025-12-11T11:00:00Z", content_length: 1200 },
      ])

      const req = createMockReq({ conversationId: "conv-123", jobId: "job-uuid-list" })
      const res = createMockRes()
      const next = jest.fn()

      await listExportVersions(req, res, next)

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-list/versions"
      )
    })

    it("[CONTRACT] should return success response with versions array", async () => {
      const {
        listExportVersions,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      const mockVersions = [
        { version_number: 1, created_at: "2025-12-11T10:00:00Z", created_by: null, content_length: 1000 },
        { version_number: 2, created_at: "2025-12-11T11:00:00Z", created_by: null, content_length: 1500 },
      ]
      mockAxios.get.mockResolvedValueOnce(mockVersions)

      const req = createMockReq({ conversationId: "conv-123", jobId: "job-uuid" })
      const res = createMockRes()
      const next = jest.fn()

      await listExportVersions(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          versions: mockVersions,
        })
      )
    })

    it("[CONTRACT] should return empty versions array when no versions exist", async () => {
      const {
        listExportVersions,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce([])

      const req = createMockReq({ conversationId: "conv-123", jobId: "job-uuid" })
      const res = createMockRes()
      const next = jest.fn()

      await listExportVersions(req, res, next)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          versions: [],
        })
      )
    })
  })

  describe("GET /conversations/:conversationId/export/:jobId/versions/:versionNumber - Get Version", () => {
    it("[CONTRACT] should proxy to LLM Gateway GET /api/v1/jobs/:jobId/versions/:versionNumber", async () => {
      const {
        getExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce({
        version_number: 1,
        created_at: "2025-12-11T10:00:00Z",
        created_by: null,
        content: "# Full markdown content",
      })

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid-version",
        versionNumber: "1",
      })
      const res = createMockRes()
      const next = jest.fn()

      await getExportVersion(req, res, next)

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-version/versions/1"
      )
    })

    it("[CONTRACT] should return success response with version detail", async () => {
      const {
        getExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      const mockVersion = {
        version_number: 2,
        created_at: "2025-12-11T11:00:00Z",
        created_by: null,
        content: "# Version 2 content",
      }
      mockAxios.get.mockResolvedValueOnce(mockVersion)

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid",
        versionNumber: "2",
      })
      const res = createMockRes()
      const next = jest.fn()

      await getExportVersion(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          version: mockVersion,
        })
      )
    })

    it("[CONTRACT] should pass ExportGatewayError to next() when version not found", async () => {
      const {
        getExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockRejectedValueOnce({
        response: { status: 404, data: { detail: "Version not found" } },
      })

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid",
        versionNumber: "999",
      })
      const res = createMockRes()
      const next = jest.fn()

      await getExportVersion(req, res, next)

      // With new error handling pattern, errors are passed to next()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].name).toBe("ExportGatewayError")
      expect(next.mock.calls[0][0].message).toContain("not found")
    })
  })

  describe("POST /conversations/:conversationId/export/:jobId/versions/:versionNumber/restore - Restore Version", () => {
    it("[CONTRACT] should proxy to LLM Gateway POST /api/v1/jobs/:jobId/versions/:versionNumber/restore", async () => {
      const {
        restoreExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.post.mockResolvedValueOnce({
        current_version: 4,
        result: { output: "Restored content from version 2" },
      })

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid-restore",
        versionNumber: "2",
      })
      const res = createMockRes()
      const next = jest.fn()

      await restoreExportVersion(req, res, next)

      expect(mockAxios.post).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-restore/versions/2/restore",
        {}
      )
    })

    it("[CONTRACT] should return success response with new version and content", async () => {
      const {
        restoreExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.post.mockResolvedValueOnce({
        current_version: 5,
        result: { output: "# Restored markdown" },
      })

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid",
        versionNumber: "1",
      })
      const res = createMockRes()
      const next = jest.fn()

      await restoreExportVersion(req, res, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          version: 5,
          content: "# Restored markdown",
        })
      )
    })
  })

  describe("POST /conversations/:conversationId/export/:jobId/document - Generate Document", () => {
    it("[CONTRACT] should proxy to LLM Gateway GET /api/v1/jobs/:jobId/export/:format for PDF", async () => {
      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce(Buffer.from("%PDF-1.4 mock content"))

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid-pdf" },
        { format: "pdf" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await generateExportDocument(req, res, next)

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-pdf/export/pdf",
        { responseType: "arraybuffer" }
      )
    })

    it("[CONTRACT] should proxy to LLM Gateway GET /api/v1/jobs/:jobId/export/:format for DOCX", async () => {
      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce(Buffer.from("PK mock docx content"))

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid-docx" },
        { format: "docx" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await generateExportDocument(req, res, next)

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid-docx/export/docx",
        { responseType: "arraybuffer" }
      )
    })

    it("[CONTRACT] should set correct Content-Type for PDF", async () => {
      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce(Buffer.from("PDF content"))

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        { format: "pdf" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await generateExportDocument(req, res, next)

      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf")
    })

    it("[CONTRACT] should set correct Content-Type for DOCX", async () => {
      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce(Buffer.from("DOCX content"))

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        { format: "docx" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await generateExportDocument(req, res, next)

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    })

    it("[CONTRACT] should set Content-Disposition header with filename", async () => {
      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockResolvedValueOnce(Buffer.from("PDF content"))

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        { format: "pdf" }
      )
      const res = createMockRes()
      const next = jest.fn()

      await generateExportDocument(req, res, next)

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining("attachment")
      )
      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringContaining(".pdf")
      )
    })

    it("[CONTRACT] should handle invalid format validation", async () => {
      // Reset modules to ensure fresh import
      jest.resetModules()

      // Re-mock dependencies
      jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)
      jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
        conversationExport: {
          getByJobId: jest.fn().mockResolvedValue([]),
          update: jest.fn().mockResolvedValue({}),
        },
        conversations: {
          getById: jest.fn().mockResolvedValue([{ _id: "conv-123", name: "Test" }]),
        },
      }))

      const {
        generateExportDocument,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      const req = createMockReq(
        { conversationId: "conv-123", jobId: "job-uuid" },
        { format: "invalid" }
      )
      const res = createMockRes()
      const next = jest.fn()

      // The controller throws ConversationMetadataRequire for invalid format
      try {
        await generateExportDocument(req, res, next)
      } catch (e) {
        // Error propagation is expected
      }

      // The error should have been passed to next or response sent
      const wasErrorHandled =
        next.mock.calls.length > 0 || res.status.mock.calls.length > 0

      expect(wasErrorHandled).toBe(true)
    })
  })
})

describe("Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
  })

  describe("Error Response Format", () => {
    it("[CONTRACT] should pass ExportGatewayError to next() for gateway errors", async () => {
      const {
        listExportVersions,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockRejectedValueOnce({
        response: { status: 500, data: { detail: "Internal server error" } },
      })

      const req = createMockReq({ conversationId: "conv-123", jobId: "job-uuid" })
      const res = createMockRes()
      const next = jest.fn()

      await listExportVersions(req, res, next)

      // With new error handling pattern, errors are passed to next()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].name).toBe("ExportGatewayError")
      expect(next.mock.calls[0][0].status).toBe(502)
    })

    it("[CONTRACT] should pass error to next() for network errors", async () => {
      const {
        getExportVersion,
      } = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export.js`)

      mockAxios.get.mockRejectedValueOnce(new Error("ECONNREFUSED"))

      const req = createMockReq({
        conversationId: "conv-123",
        jobId: "job-uuid",
        versionNumber: "1",
      })
      const res = createMockRes()
      const next = jest.fn()

      await getExportVersion(req, res, next)

      // Network errors without response.status are passed directly to next()
      expect(next).toHaveBeenCalled()
      expect(next.mock.calls[0][0].message).toBe("ECONNREFUSED")
    })
  })
})
