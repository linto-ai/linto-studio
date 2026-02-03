/**
 * Sprint 10 Tests - Auto-regeneration Flow
 *
 * Tests the auto-regeneration behavior when job is not found on LLM Gateway.
 *
 * API Contract reference: .claude/sprint/10/api-contract.md
 * QA Specs reference: .claude/sprint/10/qa-specs.md
 *
 * Key scenarios:
 * - Test 3.1: Auto-regenerate on job not found (gateway healthy)
 * - Test 3.2: No regeneration when gateway down
 */

const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  postFormData: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/utility/axios`, () => mockAxios)

const mockConversationExportModel = {
  getByConvAndFormat: jest.fn(),
  getByJobId: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
}

const mockConversationsModel = {
  getById: jest.fn(),
}

const mockConversationGenerationsModel = {
  archiveAllGenerations: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
}

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationExport: mockConversationExportModel,
  conversations: mockConversationsModel,
  conversationGenerations: mockConversationGenerationsModel,
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

// Mock WebSocket manager
jest.mock(`${process.cwd()}/components/WebServer/controllers/llm/llm_ws`, () => ({
  ensureConnection: jest.fn().mockResolvedValue(),
  registerJobCallback: jest.fn(),
  hasActiveConnections: jest.fn().mockReturnValue(false),
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

// Mock LLM controller
const mockLlmRequest = jest.fn()
const mockLlmGetJobStatus = jest.fn()
const mockLlmPollingLlm = jest.fn()

jest.mock(`${process.cwd()}/components/WebServer/controllers/llm/index`, () => ({
  request: mockLlmRequest,
  getJobStatus: mockLlmGetJobStatus,
  pollingLlm: mockLlmPollingLlm,
  generateText: jest.fn().mockResolvedValue("Generated text content"),
}))

// Mock DOCX export
jest.mock(`${process.cwd()}/components/WebServer/controllers/export/docx`, () => ({
  generateDocxOnFormat: jest.fn(),
  convertToPDF: jest.fn(),
}))

describe("Sprint 10: Auto-regeneration Flow", () => {
  let exportConversation
  let mockReq
  let mockRes
  let mockNext

  const mockConversation = {
    _id: { toString: () => "conv-123" },
    name: "Test Conversation",
    organization: { organizationId: { toString: () => "org-456" } },
    text: [
      {
        turn_id: "t1",
        speaker_id: "s1",
        speaker_name: "Speaker1",
        segment: "Hello world",
        stime: 0,
        etime: 5,
        words: [{ stime: 0, etime: 5 }]
      }
    ],
    speakers: [{ speaker_id: "s1", speaker_name: "Speaker1" }],
    tags: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
    exportConversation = exportModule.exportConversation

    mockReq = {
      params: { conversationId: "conv-123" },
      query: { format: "summary-fr" },
      body: {},
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    }

    mockNext = jest.fn()

    // Default setup: conversation exists
    mockConversationsModel.getById.mockResolvedValue([mockConversation])
  })

  describe("Test 3.1: Auto-regenerate on job not found", () => {
    it("should check gateway health when status is unknown", async () => {
      // Existing export with 'unknown' status (orphan)
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "old-job-deleted",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])

      // Health check succeeds
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // Setup for recursive call
      mockConversationExportModel.delete.mockResolvedValue({})
      mockConversationExportModel.getByConvAndFormat
        .mockResolvedValueOnce([orphanExport])
        .mockResolvedValueOnce([])
      mockConversationExportModel.create.mockResolvedValue({ insertedId: { toString: () => "new-export" } })
      mockConversationExportModel.update.mockResolvedValue({})
      mockLlmRequest.mockResolvedValue("new-job-uuid")

      await exportConversation(mockReq, mockRes, mockNext)

      // Should check gateway health
      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/healthcheck",
        expect.objectContaining({ timeout: 5000 })
      )
    })

    it("should trigger regeneration flow when gateway is healthy and status is unknown", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "old-job",
        organizationId: "org-456",
      }

      // First call returns orphan, second call after delete returns empty (triggers new creation)
      mockConversationExportModel.getByConvAndFormat
        .mockResolvedValueOnce([orphanExport])
        .mockResolvedValueOnce([])

      mockConversationExportModel.delete.mockResolvedValue({})
      mockConversationExportModel.create.mockResolvedValue({ insertedId: { toString: () => "new-export" } })
      mockConversationExportModel.update.mockResolvedValue({})
      mockAxios.get.mockResolvedValue({ status: "healthy" })
      mockLlmRequest.mockResolvedValue("new-job-uuid")

      await exportConversation(mockReq, mockRes, mockNext)

      // The flow should have called getByConvAndFormat twice (once for unknown, once for regenerate)
      expect(mockConversationExportModel.getByConvAndFormat).toHaveBeenCalled()
    })
  })

  describe("Test 3.2: No regeneration when gateway down", () => {
    it("should return 503 gateway_unavailable when status is unknown and gateway is down", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "old-job",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])

      // Health check fails
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      await exportConversation(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(503)
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "gateway_unavailable",
          gatewayAvailable: false,
        })
      )
    })

    it("should NOT delete reference when gateway is unavailable", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "old-job",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      await exportConversation(mockReq, mockRes, mockNext)

      // Should NOT delete the reference
      expect(mockConversationExportModel.delete).not.toHaveBeenCalled()
    })
  })

  describe("Job verification before content display", () => {
    it("should call verifyJobExists for markdown/text output type with jobId", async () => {
      const completeExport = {
        _id: { toString: () => "export-123" },
        convId: "conv-123",
        format: "summary-fr",
        status: "complete",
        jobId: "job-uuid",
        llmOutputType: "markdown",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([completeExport])

      // Job still exists on gateway
      mockLlmGetJobStatus.mockResolvedValue({
        status: "completed",
        result: { output: "Fresh content from gateway" },
      })

      await exportConversation(mockReq, mockRes, mockNext)

      // For markdown/text output type with jobId, getJobStatus should be called to verify
      expect(mockLlmGetJobStatus).toHaveBeenCalled()
    })

    it("should handle job not found scenario with health check", async () => {
      const completeExport = {
        _id: { toString: () => "export-123" },
        convId: "conv-123",
        format: "summary-fr",
        status: "complete",
        jobId: "job-uuid",
        llmOutputType: "markdown",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([completeExport])

      // Job NOT found on gateway
      mockLlmGetJobStatus.mockResolvedValue(null)

      // Gateway is healthy - triggers health check
      mockAxios.get.mockResolvedValue({ status: "healthy" })
      mockConversationExportModel.update.mockResolvedValue({})

      await exportConversation(mockReq, mockRes, mockNext)

      // When job is not found and gateway is healthy, should trigger health check
      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/healthcheck",
        expect.any(Object)
      )
    })

    it("should handle gateway unavailable scenario", async () => {
      const completeExport = {
        _id: { toString: () => "export-123" },
        convId: "conv-123",
        format: "summary-fr",
        status: "complete",
        jobId: "job-uuid",
        llmOutputType: "text",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([completeExport])

      // Job NOT found
      mockLlmGetJobStatus.mockResolvedValue(null)

      // Gateway is unhealthy
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      await exportConversation(mockReq, mockRes, mockNext)

      // Should return 503 when gateway is unavailable
      expect(mockRes.status).toHaveBeenCalledWith(503)
    })
  })
})

describe("Sprint 10 Iteration 2: Conditional Auto-regeneration", () => {
  let exportConversation
  let mockReq
  let mockRes
  let mockNext

  const mockConversation = {
    _id: { toString: () => "conv-123" },
    name: "Test Conversation",
    organization: { organizationId: { toString: () => "org-456" } },
    text: [
      {
        turn_id: "t1",
        speaker_id: "s1",
        speaker_name: "Speaker1",
        segment: "Hello world",
        stime: 0,
        etime: 5,
        words: [{ stime: 0, etime: 5 }]
      }
    ],
    speakers: [{ speaker_id: "s1", speaker_name: "Speaker1" }],
    tags: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
    exportConversation = exportModule.exportConversation

    mockReq = {
      params: { conversationId: "conv-123" },
      query: { format: "summary-fr" },
      body: {},
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    }

    mockNext = jest.fn()

    mockConversationsModel.getById.mockResolvedValue([mockConversation])
  })

  describe("job_removed response with hasOtherGenerations flag", () => {
    it("should return job_removed with hasOtherGenerations=true when other valid generations exist", async () => {
      // Export with 'unknown' status (orphan job)
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "deleted-job",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])
      mockConversationExportModel.delete.mockResolvedValue({})

      // Gateway is healthy
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // Other valid generations exist for this service
      mockConversationGenerationsModel.listByConversationAndService = jest.fn().mockResolvedValue([
        { _id: "gen-1", jobId: "valid-job-1", status: "completed" },
        { _id: "gen-2", jobId: "valid-job-2", status: "completed" },
      ])

      // Both jobs still exist on gateway
      mockLlmGetJobStatus
        .mockResolvedValueOnce({ status: "completed", result: { output: "content 1" } })
        .mockResolvedValueOnce({ status: "completed", result: { output: "content 2" } })

      await exportConversation(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "job_removed",
          hasOtherGenerations: true,
          generationCount: 2,
        })
      )
    })

    it("should NOT auto-regenerate when other valid generations exist", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "deleted-job",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])
      mockConversationExportModel.delete.mockResolvedValue({})
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // One other valid generation exists
      mockConversationGenerationsModel.listByConversationAndService = jest.fn().mockResolvedValue([
        { _id: "gen-1", jobId: "valid-job", status: "completed" },
      ])

      mockLlmGetJobStatus.mockResolvedValue({ status: "completed", result: { output: "content" } })

      await exportConversation(mockReq, mockRes, mockNext)

      // Should NOT trigger regeneration - llm.request should NOT be called
      expect(mockLlmRequest).not.toHaveBeenCalled()

      // Should return job_removed status
      expect(mockRes.send).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "job_removed",
          hasOtherGenerations: true,
        })
      )
    })

    it("should auto-regenerate only when NO valid generations exist", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "deleted-job",
        organizationId: "org-456",
      }

      // First call returns orphan, second call (after regenerate=true) returns empty
      mockConversationExportModel.getByConvAndFormat
        .mockResolvedValueOnce([orphanExport])
        .mockResolvedValueOnce([])
      mockConversationExportModel.delete.mockResolvedValue({})
      mockConversationExportModel.create.mockResolvedValue({ insertedId: { toString: () => "new-export" } })
      mockConversationExportModel.update.mockResolvedValue({})

      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // No other generations exist
      mockConversationGenerationsModel.listByConversationAndService = jest.fn().mockResolvedValue([])

      mockLlmRequest.mockResolvedValue("new-job-uuid")

      await exportConversation(mockReq, mockRes, mockNext)

      // Should trigger regeneration since no other valid generations exist
      expect(mockLlmRequest).toHaveBeenCalled()
    })

    it("should delete orphan generation records when validating generations", async () => {
      const orphanExport = {
        _id: { toString: () => "export-orphan" },
        convId: "conv-123",
        format: "summary-fr",
        status: "unknown",
        jobId: "deleted-job",
        organizationId: "org-456",
      }

      mockConversationExportModel.getByConvAndFormat.mockResolvedValue([orphanExport])
      mockConversationExportModel.delete.mockResolvedValue({})
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      // One generation exists but its job is also deleted
      mockConversationGenerationsModel.listByConversationAndService = jest.fn().mockResolvedValue([
        { _id: "gen-orphan", jobId: "also-deleted-job", status: "completed" },
      ])
      mockConversationGenerationsModel.delete = jest.fn().mockResolvedValue({})

      // Job does not exist on gateway
      mockLlmGetJobStatus.mockResolvedValue(null)

      // Setup for regeneration flow (after orphan cleanup)
      mockConversationExportModel.getByConvAndFormat
        .mockResolvedValueOnce([orphanExport])
        .mockResolvedValueOnce([])
      mockConversationExportModel.create.mockResolvedValue({ insertedId: { toString: () => "new-export" } })
      mockLlmRequest.mockResolvedValue("new-job-uuid")

      await exportConversation(mockReq, mockRes, mockNext)

      // Should have deleted the orphan generation record
      expect(mockConversationGenerationsModel.delete).toHaveBeenCalledWith("gen-orphan")
    })
  })
})

describe("Sprint 10 Iteration 2: listExport Orphan Filtering", () => {
  let listExport

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
    listExport = exportModule.listExport
  })

  describe("Orphan filtering in list endpoints", () => {
    it("should filter out exports where job returns 404 from LLM Gateway", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-valid" },
          convId: "conv-123",
          format: "summary-fr",
          status: "complete",
          jobId: "valid-job",
          processing: 100,
        },
        {
          _id: { toString: () => "export-orphan" },
          convId: "conv-123",
          format: "report-en",
          status: "complete",
          jobId: "orphan-job",
          processing: 100,
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)
      mockConversationExportModel.delete = jest.fn().mockResolvedValue({})

      // First job exists, second does not
      mockLlmGetJobStatus
        .mockResolvedValueOnce({ status: "completed" })
        .mockResolvedValueOnce(null)

      // Gateway is healthy (for orphan deletion)
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      // Should only return the valid export
      expect(mockRes.send).toHaveBeenCalled()
      const response = mockRes.send.mock.calls[0][0]
      expect(response).toHaveLength(1)
      expect(response[0]._id).toBe("export-valid")
    })

    it("should delete orphan references when gateway is healthy and job returns 404", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-orphan" },
          convId: "conv-123",
          format: "summary-fr",
          status: "complete",
          jobId: "orphan-job",
          processing: 100,
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)
      mockConversationExportModel.delete = jest.fn().mockResolvedValue({})

      // Job does not exist
      mockLlmGetJobStatus.mockResolvedValue(null)

      // Gateway is healthy
      mockAxios.get.mockResolvedValue({ status: "healthy" })

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      // Should have deleted the orphan (called with the _id object)
      expect(mockConversationExportModel.delete).toHaveBeenCalled()
      // Verify the _id was passed (the object, which has toString method)
      const callArg = mockConversationExportModel.delete.mock.calls[0][0]
      expect(callArg.toString()).toBe("export-orphan")
    })

    it("should NOT delete orphan references when gateway is unhealthy", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-maybe-orphan" },
          convId: "conv-123",
          format: "summary-fr",
          status: "complete",
          jobId: "maybe-orphan-job",
          processing: 100,
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)
      mockConversationExportModel.delete = jest.fn().mockResolvedValue({})

      // Job check fails (gateway might be down)
      mockLlmGetJobStatus.mockResolvedValue(null)

      // Gateway is unhealthy
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      // Should NOT delete since gateway is unhealthy
      expect(mockConversationExportModel.delete).not.toHaveBeenCalled()

      // Should still include the export in the list (keep reference)
      const response = mockRes.send.mock.calls[0][0]
      expect(response).toHaveLength(1)
    })

    it("should skip validation for non-complete exports", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-processing" },
          convId: "conv-123",
          format: "summary-fr",
          status: "processing",
          jobId: "processing-job",
          processing: 50,
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      // Should NOT call getJobStatus for processing exports
      expect(mockLlmGetJobStatus).not.toHaveBeenCalled()

      // Should include the export in the list
      const response = mockRes.send.mock.calls[0][0]
      expect(response).toHaveLength(1)
    })
  })
})

describe("Sprint 10: No Local Caching Verification", () => {
  let listExport

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    const exportModule = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/export`)
    listExport = exportModule.listExport
  })

  describe("Test 2.1: listExport should NOT return data field", () => {
    it("should exclude data field from response (per api-contract.md)", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-1" },
          convId: "conv-123",
          format: "summary-fr",
          status: "complete",
          jobId: "job-1",
          processing: 100,
          last_update: "2025-01-15T10:00:00Z",
          serviceName: "summary-fr",
          flavorName: "default",
          tokenMetrics: { totalTokens: 1500 },
          organizationId: "org-456",
          data: "THIS SHOULD NOT BE IN RESPONSE", // Old cached data
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      expect(mockRes.send).toHaveBeenCalled()
      const response = mockRes.send.mock.calls[0][0]

      // Verify data field is NOT present
      expect(response[0]).not.toHaveProperty("data")

      // Verify expected fields ARE present
      expect(response[0]).toHaveProperty("_id")
      expect(response[0]).toHaveProperty("format")
      expect(response[0]).toHaveProperty("status")
      expect(response[0]).toHaveProperty("jobId")
      expect(response[0]).toHaveProperty("processing")
      expect(response[0]).toHaveProperty("last_update")
      expect(response[0]).toHaveProperty("serviceName")
      expect(response[0]).toHaveProperty("flavorName")
      expect(response[0]).toHaveProperty("tokenMetrics")
      expect(response[0]).toHaveProperty("organizationId")
    })

    it("should include error field when status is error", async () => {
      const mockExports = [
        {
          _id: { toString: () => "export-1" },
          convId: "conv-123",
          format: "summary-fr",
          status: "error",
          jobId: "job-1",
          processing: 0,
          last_update: "2025-01-15T10:00:00Z",
          error: "Processing failed",
          data: "should be excluded",
        },
      ]

      mockConversationExportModel.getByConvAndFormat = jest.fn().mockResolvedValue(mockExports)

      const mockReq = { params: { conversationId: "conv-123" } }
      const mockRes = { status: jest.fn().mockReturnThis(), send: jest.fn() }
      const mockNext = jest.fn()

      await listExport(mockReq, mockRes, mockNext)

      const response = mockRes.send.mock.calls[0][0]
      expect(response[0]).toHaveProperty("error", "Processing failed")
      expect(response[0]).not.toHaveProperty("data")
    })
  })
})
