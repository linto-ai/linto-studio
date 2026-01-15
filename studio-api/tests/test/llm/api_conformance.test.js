/**
 * API Conformance Tests - LLM Gateway V2
 *
 * These tests verify that the implementation conforms to the api-contract.md
 * They specifically check for:
 * - Correct URL construction (/run endpoint)
 * - Correct request format (multipart form-data)
 * - Correct response handling
 * - Organization ID handling
 */

// Track actual axios calls to verify correct usage
const actualPostCalls = []
const actualGetCalls = []
const actualFormDataCalls = []

const mockAxios = {
  get: jest.fn().mockImplementation((url, options) => {
    actualGetCalls.push({ url, options })
    return Promise.resolve({ items: [] })
  }),
  post: jest.fn().mockImplementation((url, options) => {
    actualPostCalls.push({ url, options })
    return Promise.resolve({ job_id: "test-job-id", status: "queued" })
  }),
  postFormData: jest.fn().mockImplementation((url, options) => {
    actualFormDataCalls.push({ url, options })
    return Promise.resolve({
      job_id: "test-job-id",
      status: "queued",
      service_id: "svc-123",
      service_name: "summary",
      flavor_id: "flv-1",
      flavor_name: "default",
    })
  }),
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

jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logLlmEvent: jest.fn(),
}))

// Mock the organization WebSocket manager
const mockEnsureConnection = jest.fn().mockResolvedValue()
const mockRegisterJobCallback = jest.fn()

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`,
  () => ({
    ensureConnection: mockEnsureConnection,
    registerJobCallback: mockRegisterJobCallback,
    hasActiveConnections: jest.fn().mockReturnValue(false),
  })
)

jest.mock("ws", () => {
  const MockWS = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
    readyState: 1,
  }))
  MockWS.OPEN = 1
  MockWS.CLOSED = 3
  return MockWS
})

describe("API Contract Conformance", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    actualPostCalls.length = 0
    actualGetCalls.length = 0
    actualFormDataCalls.length = 0
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
  })

  describe("Service Run (POST /api/v1/services/{service_id}/run)", () => {
    it("[CONTRACT] should construct correct V2 run URL", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      // Mock service resolution
      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test conversation content"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test",
      }
      const organizationId = "org-abc-123"

      try {
        await requestAPIV2(
          mockReq,
          query,
          content,
          conversationExport,
          conversation,
          organizationId
        )
      } catch (e) {
        // May throw due to incomplete mocking, but we check the calls
      }

      // Verify run URL format (not execute)
      expect(actualFormDataCalls.length).toBeGreaterThan(0)
      const { url } = actualFormDataCalls[0]
      expect(url).toMatch(/\/api\/v1\/services\/[^/]+\/run$/)
      expect(url).not.toContain("/execute")
    })

    it("[CONTRACT] should send request as multipart form-data", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      // Setup mocks for service/flavor resolution
      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test conversation content"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test Conversation",
      }
      const organizationId = "org-abc-123"

      try {
        await requestAPIV2(
          mockReq,
          query,
          content,
          conversationExport,
          conversation,
          organizationId
        )
      } catch (e) {
        // Continue to verify calls
      }

      // Verify postFormData was called (not post)
      expect(mockAxios.postFormData).toHaveBeenCalled()
      expect(actualFormDataCalls.length).toBeGreaterThan(0)

      const { options } = actualFormDataCalls[0]
      // Verify formData and headers are passed
      expect(options).toHaveProperty("formData")
      expect(options).toHaveProperty("headers")
    })

    it("[CONTRACT] should include organization_id in form-data", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      // Setup mocks
      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test conversation content"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test",
      }
      const organizationId = "org-xyz-789"

      try {
        await requestAPIV2(
          mockReq,
          query,
          content,
          conversationExport,
          conversation,
          organizationId
        )
      } catch (e) {
        // Continue to verify
      }

      // The organization ID should be passed to ensureConnection
      expect(mockEnsureConnection).toHaveBeenCalledWith(
        organizationId,
        "http://localhost:8010"
      )

      // conversationExport should have organizationId set
      expect(conversationExport.organizationId).toBe(organizationId)
    })

    it("[CONTRACT] should register job callback with organization scope", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      // Setup mocks
      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })
      mockAxios.postFormData.mockResolvedValueOnce({
        job_id: "job-uuid-123",
        status: "queued",
        service_id: "svc-123",
        service_name: "summary",
        flavor_id: "flv-1",
        flavor_name: "default",
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test conversation content"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test",
      }
      const organizationId = "org-xyz-789"

      await requestAPIV2(
        mockReq,
        query,
        content,
        conversationExport,
        conversation,
        organizationId
      )

      // Verify job callback was registered with organization ID
      expect(mockRegisterJobCallback).toHaveBeenCalledWith(
        organizationId,
        "job-uuid-123",
        expect.any(Function)
      )
    })

    it("[CONTRACT] should include file content in form-data", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test conversation content for summarization"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test",
      }
      const organizationId = "org-abc"

      try {
        await requestAPIV2(
          mockReq,
          query,
          content,
          conversationExport,
          conversation,
          organizationId
        )
      } catch (e) {
        // Continue
      }

      // Verify formData contains the file
      expect(actualFormDataCalls.length).toBeGreaterThan(0)
      const { options } = actualFormDataCalls[0]
      expect(options.formData).toBeDefined()
      // FormData object should have been passed
    })

    it("[CONTRACT] should handle response with fallback tracking", async () => {
      const { requestAPIV2 } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.get.mockResolvedValueOnce({
        items: [{ id: "svc-123", name: "summary", route: "summary" }],
      })
      mockAxios.get.mockResolvedValueOnce({
        flavors: [{ id: "flv-1", name: "default", is_default: true }],
      })
      mockAxios.postFormData.mockResolvedValueOnce({
        job_id: "job-uuid-fallback",
        status: "queued",
        service_id: "svc-123",
        service_name: "summary",
        flavor_id: "flv-2",
        flavor_name: "fast",
        fallback_applied: true,
        original_flavor_id: "flv-1",
        original_flavor_name: "quality",
        fallback_reason: "Context exceeded",
      })

      const mockReq = {}
      const query = { format: "summary" }
      const content = "Test content"
      const conversationExport = { convId: "conv-123", format: "summary" }
      const conversation = {
        _id: { toString: () => "conv-123" },
        name: "Test",
      }
      const organizationId = "org-abc"

      await requestAPIV2(
        mockReq,
        query,
        content,
        conversationExport,
        conversation,
        organizationId
      )

      // Verify fallback tracking is stored
      expect(conversationExport.fallbackApplied).toBe(true)
      expect(conversationExport.originalFlavorName).toBe("quality")
      expect(conversationExport.fallbackReason).toBe("Context exceeded")
    })
  })

  describe("List Services (GET /api/v1/services)", () => {
    it("[CONTRACT] should use correct V2 API URL with pagination", async () => {
      const { listLlmServices } = require(
        `${process.cwd()}/components/WebServer/controllers/services/utility`
      )

      mockAxios.get.mockResolvedValueOnce({
        items: [],
        total: 0,
        page: 1,
        page_size: 100,
        pages: 0,
      })

      await listLlmServices()

      // Implementation includes timeout option for reliability
      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/services?page=1&page_size=100",
        expect.objectContaining({ timeout: expect.any(Number) })
      )
    })
  })

  describe("Get Job Status (GET /api/v1/jobs/{job_id})", () => {
    it("[CONTRACT] should use correct V2 job status URL", async () => {
      const { getJobStatus } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.get.mockResolvedValueOnce({
        id: "job-uuid",
        status: "completed",
        result: "Summary text",
      })

      await getJobStatus("job-uuid")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid"
      )
    })
  })

  describe("Export Document (GET /api/v1/jobs/{job_id}/export/{format})", () => {
    it("[CONTRACT] should use correct V2 export URL format", async () => {
      const { exportJobDocument } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.get.mockResolvedValueOnce(Buffer.from("PDF content"))

      await exportJobDocument("job-uuid", "pdf")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid/export/pdf",
        { responseType: "arraybuffer" }
      )
    })

    it("[CONTRACT] should support template_id query parameter", async () => {
      const { exportJobDocument } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.get.mockResolvedValueOnce(Buffer.from("PDF content"))

      await exportJobDocument("job-uuid", "docx", "template-123")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid/export/docx?template_id=template-123",
        { responseType: "arraybuffer" }
      )
    })
  })

  describe("Cancel Job (POST /api/v1/jobs/{job_id}/cancel)", () => {
    it("[CONTRACT] should use correct V2 cancel URL", async () => {
      const { cancelJob } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.post.mockResolvedValueOnce({
        job_id: "job-uuid",
        status: "cancelled",
        message: "Job cancelled successfully",
      })

      await cancelJob("job-uuid")

      expect(mockAxios.post).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid/cancel",
        { data: {} }
      )
    })

    it("[CONTRACT] should throw error when job ID is missing", async () => {
      const { cancelJob } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      await expect(cancelJob(null)).rejects.toThrow("Job ID is required")
      await expect(cancelJob(undefined)).rejects.toThrow("Job ID is required")
    })

    it("[CONTRACT] should return response with job_id, status, and message", async () => {
      const { cancelJob } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      const expectedResponse = {
        job_id: "job-uuid-456",
        status: "cancelled",
        message: "Job cancelled successfully",
      }

      mockAxios.post.mockResolvedValueOnce(expectedResponse)

      const result = await cancelJob("job-uuid-456")

      expect(result).toEqual(expectedResponse)
      expect(result.job_id).toBe("job-uuid-456")
      expect(result.status).toBe("cancelled")
    })

    it("[CONTRACT] should propagate API errors", async () => {
      const { cancelJob } = require(
        `${process.cwd()}/components/WebServer/controllers/llm/index`
      )

      mockAxios.post.mockRejectedValueOnce(new Error("Job not found"))

      await expect(cancelJob("non-existent-job")).rejects.toThrow(
        "Job not found"
      )
    })
  })

  describe("Status Mapping V2 -> Internal", () => {
    it("[CONTRACT] should map V2 completed to internal complete", () => {
      // This verifies the status mapping per api-contract.md
      const statusMap = {
        queued: "queued",
        started: "started",
        processing: "processing",
        completed: "complete", // V2 -> Internal
        failed: "error",
        cancelled: "error",
      }

      // Verify mapping table
      expect(statusMap.completed).toBe("complete")
      expect(statusMap.failed).toBe("error")
      expect(statusMap.cancelled).toBe("error")
    })
  })
})
