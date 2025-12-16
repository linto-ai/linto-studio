/**
 * Sprint 10 Tests - GET /api/conversations/:conversationId/export/:jobId/content
 *
 * Tests the new content fetch endpoint that retrieves job content directly
 * from LLM Gateway (single source of truth - no local caching).
 *
 * API Contract reference: .claude/sprint/10/api-contract.md
 * QA Specs reference: .claude/sprint/10/qa-specs.md
 */

const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

const mockConversationExportModel = {
  getByJobId: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationExport: mockConversationExportModel,
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

jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logLlmEvent: jest.fn(),
}))

// Mock WebSocket
jest.mock("ws", () => {
  const mockWS = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
    readyState: 1,
  }))
  mockWS.OPEN = 1
  mockWS.CLOSED = 3
  return mockWS
})

// Mock the LLM controller
jest.mock(`${process.cwd()}/components/WebServer/controllers/llm/index`, () => ({
  getJobStatus: jest.fn(),
}))

describe("Sprint 10: GET /export/:jobId/content", () => {
  let getExportContent
  let mockReq
  let mockRes
  let mockNext
  let mockGetJobStatus

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    // Reset modules to get fresh state
    jest.resetModules()

    // Get the actual function and mock
    mockGetJobStatus = require(`${process.cwd()}/components/WebServer/controllers/llm/index`).getJobStatus
    const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
    getExportContent = exportModule.getExportContent

    // Setup mock request/response
    mockReq = {
      params: {
        conversationId: "conv-123",
        jobId: "job-uuid-123",
      },
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }

    mockNext = jest.fn()
  })

  describe("Test 1.1: Successful content fetch", () => {
    it("should return 200 with status=success, content, and version when job exists", async () => {
      mockGetJobStatus.mockResolvedValue({
        id: "job-uuid-123",
        status: "completed",
        result: { output: "# Summary\n\nThe meeting discussed important topics." },
        current_version: 3,
        updated_at: "2025-01-15T10:30:00Z",
      })

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        content: "# Summary\n\nThe meeting discussed important topics.",
        version: 3,
        lastModified: "2025-01-15T10:30:00Z",
      })
    })

    it("should handle string result format", async () => {
      mockGetJobStatus.mockResolvedValue({
        id: "job-uuid-123",
        status: "completed",
        result: "Raw string content from LLM",
        current_version: 1,
        created_at: "2025-01-15T09:00:00Z",
      })

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "success",
        content: "Raw string content from LLM",
        version: 1,
        lastModified: "2025-01-15T09:00:00Z",
      })
    })

    it("should return processing status when job is not yet complete", async () => {
      mockGetJobStatus.mockResolvedValue({
        id: "job-uuid-123",
        status: "processing",
        progress: { current: 50, total: 100, percentage: 50 },
      })

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "processing",
        jobStatus: "processing",
        progress: { current: 50, total: 100, percentage: 50 },
      })
    })
  })

  describe("Test 1.2: Job not found - gateway healthy", () => {
    it("should return 404 with job_not_found when job does not exist and gateway is healthy", async () => {
      // Job not found
      mockGetJobStatus.mockResolvedValue(null)

      // Health check returns healthy
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // Mock conversationExport lookup for deletion
      mockConversationExportModel.getByJobId.mockResolvedValue([
        { _id: "export-123", jobId: "job-uuid-123" },
      ])
      mockConversationExportModel.delete.mockResolvedValue({})

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "job_not_found",
        gatewayAvailable: true,
        error: "Job no longer exists on LLM Gateway",
      })
    })

    it("should delete orphan conversationExport reference when job not found", async () => {
      mockGetJobStatus.mockResolvedValue(null)
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      const orphanExport = { _id: "export-123", jobId: "job-uuid-123" }
      mockConversationExportModel.getByJobId.mockResolvedValue([orphanExport])
      mockConversationExportModel.delete.mockResolvedValue({})

      await getExportContent(mockReq, mockRes, mockNext)

      // Verify deletion was called
      expect(mockConversationExportModel.delete).toHaveBeenCalledWith("export-123")
    })

    it("should handle 404 error from gateway with health check", async () => {
      // Gateway returns 404 error
      const error404 = new Error("Not found")
      error404.response = { status: 404 }
      mockGetJobStatus.mockRejectedValue(error404)

      // Health check returns healthy
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      mockConversationExportModel.getByJobId.mockResolvedValue([
        { _id: "export-123", jobId: "job-uuid-123" },
      ])
      mockConversationExportModel.delete.mockResolvedValue({})

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "job_not_found",
        gatewayAvailable: true,
        error: "Job no longer exists on LLM Gateway",
      })
    })
  })

  describe("Test 1.3: Job not found - gateway unavailable", () => {
    it("should return 503 with gateway_unavailable when gateway is down", async () => {
      // Job lookup fails (gateway unreachable)
      mockGetJobStatus.mockResolvedValue(null)

      // Health check fails
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(503)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "gateway_unavailable",
        gatewayAvailable: false,
        error: "LLM Gateway is not reachable",
      })
    })

    it("should NOT delete conversationExport reference when gateway is unavailable", async () => {
      mockGetJobStatus.mockResolvedValue(null)
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      await getExportContent(mockReq, mockRes, mockNext)

      // Verify deletion was NOT called
      expect(mockConversationExportModel.delete).not.toHaveBeenCalled()
    })

    it("should return 503 for 404 error when health check fails", async () => {
      const error404 = new Error("Not found")
      error404.response = { status: 404 }
      mockGetJobStatus.mockRejectedValue(error404)

      // Health check fails
      mockAxios.get.mockRejectedValue(new Error("Connection timeout"))

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(503)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "gateway_unavailable",
        gatewayAvailable: false,
        error: "LLM Gateway is not reachable",
      })
    })
  })

  describe("Edge cases and error handling", () => {
    it("should return 500 when LLM_GATEWAY_SERVICES is not configured", async () => {
      delete process.env.LLM_GATEWAY_SERVICES

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        error: "LLM Gateway not configured",
      })
    })

    it("should require conversationId parameter", async () => {
      mockReq.params.conversationId = undefined

      await getExportContent(mockReq, mockRes, mockNext)

      // The function either calls next() with error or returns error response
      const nextCalled = mockNext.mock.calls.length > 0
      const errorResponse = mockRes.status.mock.calls.length > 0 &&
        mockRes.status.mock.calls[0][0] >= 400

      expect(nextCalled || errorResponse).toBe(true)
    })

    it("should require jobId parameter", async () => {
      mockReq.params.jobId = undefined

      await getExportContent(mockReq, mockRes, mockNext)

      // The function either calls next() with error or returns error response
      const nextCalled = mockNext.mock.calls.length > 0
      const errorResponse = mockRes.status.mock.calls.length > 0 &&
        mockRes.status.mock.calls[0][0] >= 400

      expect(nextCalled || errorResponse).toBe(true)
    })

    it("should handle unexpected errors gracefully", async () => {
      const unexpectedError = new Error("Database connection lost")
      unexpectedError.response = { status: 500, data: { detail: "Internal error" } }
      mockGetJobStatus.mockRejectedValue(unexpectedError)

      await getExportContent(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "error",
        error: "Internal error",
      })
    })
  })
})

describe("Sprint 10: Health Check Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
  })

  describe("checkLlmGatewayHealth", () => {
    it("should return true when healthcheck returns healthy status", async () => {
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // The health check is internal, test via getExportContent behavior
      const mockGetJobStatus = require(`${process.cwd()}/components/WebServer/controllers/llm/index`).getJobStatus
      mockGetJobStatus.mockResolvedValue(null)

      const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      await exportModule.getExportContent(
        { params: { conversationId: "c1", jobId: "j1" } },
        mockRes,
        jest.fn()
      )

      // Health check should have been called
      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/healthcheck",
        expect.objectContaining({ timeout: 5000 })
      )
    })

    it("should return false when healthcheck fails", async () => {
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      const mockGetJobStatus = require(`${process.cwd()}/components/WebServer/controllers/llm/index`).getJobStatus
      mockGetJobStatus.mockResolvedValue(null)

      const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      await exportModule.getExportContent(
        { params: { conversationId: "c1", jobId: "j1" } },
        mockRes,
        jest.fn()
      )

      // Should return gateway_unavailable
      expect(mockRes.status).toHaveBeenCalledWith(503)
    })

    it("should return false when healthcheck returns unhealthy status", async () => {
      mockAxios.get.mockResolvedValue({ status: "unhealthy" })

      const mockGetJobStatus = require(`${process.cwd()}/components/WebServer/controllers/llm/index`).getJobStatus
      mockGetJobStatus.mockResolvedValue(null)

      const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

      await exportModule.getExportContent(
        { params: { conversationId: "c1", jobId: "j1" } },
        mockRes,
        jest.fn()
      )

      // Should return gateway_unavailable since status != "healthy"
      expect(mockRes.status).toHaveBeenCalledWith(503)
    })
  })
})

describe("Sprint 10: Response Format Compliance", () => {
  let getExportContent
  let mockGetJobStatus

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    mockGetJobStatus = require(`${process.cwd()}/components/WebServer/controllers/llm/index`).getJobStatus
    getExportContent = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`).getExportContent
  })

  it("should return correct response format for 200 OK (per api-contract.md)", async () => {
    mockGetJobStatus.mockResolvedValue({
      status: "completed",
      result: { output: "Test content" },
      current_version: 3,
      updated_at: "2025-01-15T10:30:00Z",
    })

    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await getExportContent(
      { params: { conversationId: "c1", jobId: "j1" } },
      mockRes,
      jest.fn()
    )

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        content: expect.any(String),
        version: expect.any(Number),
        lastModified: expect.any(String),
      })
    )
  })

  it("should return correct response format for 404 (per api-contract.md)", async () => {
    mockGetJobStatus.mockResolvedValue(null)
    mockAxios.get.mockResolvedValue({ status: "healthy" })
    mockConversationExportModel.getByJobId.mockResolvedValue([])

    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await getExportContent(
      { params: { conversationId: "c1", jobId: "j1" } },
      mockRes,
      jest.fn()
    )

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "job_not_found",
        gatewayAvailable: true,
        error: expect.any(String),
      })
    )
  })

  it("should return correct response format for 503 (per api-contract.md)", async () => {
    mockGetJobStatus.mockResolvedValue(null)
    mockAxios.get.mockRejectedValue(new Error("Connection refused"))

    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }

    await getExportContent(
      { params: { conversationId: "c1", jobId: "j1" } },
      mockRes,
      jest.fn()
    )

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "gateway_unavailable",
        gatewayAvailable: false,
        error: expect.any(String),
      })
    )
  })
})
