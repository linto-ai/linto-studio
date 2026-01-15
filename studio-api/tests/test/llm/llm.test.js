/**
 * LLM Gateway V2 Integration Tests
 *
 * Tests the V2 API integration according to api-contract.md
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

describe("LLM Gateway V2 Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"
  })

  describe("listLlmServices (GET /api/v1/services)", () => {
    const { listLlmServices } = require(
      `${process.cwd()}/components/WebServer/controllers/services/utility`
    )

    it("should call V2 API with correct URL and pagination", async () => {
      const mockV2Response = {
        items: [
          {
            id: "service-uuid-1",
            name: "summary-fr",
            route: "summary-fr",
            service_type: "summary",
            description: { en: "Summarization", fr: "Resume" },
            is_active: true,
            flavors: [
              {
                id: "flavor-uuid-1",
                name: "default",
                is_active: true,
                is_default: true,
                processing_mode: "single_pass",
                output_type: "markdown",
                model: { model_name: "gpt-4" },
              },
            ],
          },
        ],
        total: 1,
        page: 1,
        page_size: 100,
        pages: 1,
      }

      mockAxios.get.mockResolvedValue(mockV2Response)

      const services = await listLlmServices()

      // Implementation includes timeout option for reliability
      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/services?page=1&page_size=100",
        expect.objectContaining({ timeout: expect.any(Number) })
      )
      expect(services).toHaveLength(1)
      expect(services[0]).toHaveProperty("id", "service-uuid-1")
      expect(services[0]).toHaveProperty("name", "summary-fr")
      expect(services[0]).toHaveProperty("service_type", "summary")
      expect(services[0].flavors).toHaveLength(1)
      expect(services[0].flavors[0]).toHaveProperty("is_default", true)
    })

    it("should return empty array on API failure for graceful degradation", async () => {
      // Implementation returns [] on error instead of throwing
      // This allows the page to load with just Verbatim option when LLM Gateway is down
      mockAxios.get.mockRejectedValue(new Error("Connection refused"))

      const result = await listLlmServices()
      expect(result).toEqual([])
    })

    it("should handle empty service list", async () => {
      mockAxios.get.mockResolvedValue({ items: [], total: 0, page: 1, page_size: 100, pages: 0 })

      const services = await listLlmServices()

      expect(services).toEqual([])
    })

    it("should transform service response to expected format", async () => {
      const mockV2Response = {
        items: [
          {
            id: "uuid-1",
            name: "test-service",
            route: "test-route",
            service_type: "summary",
            description: { en: "English desc" },
            is_active: true,
            flavors: [
              {
                id: "fl-1",
                name: "default",
                description: "Default flavor",
                is_active: true,
                is_default: true,
                processing_mode: "iterative",
                output_type: "text",
                model: { model_name: "gpt-3.5-turbo" },
              },
              {
                id: "fl-2",
                name: "fast",
                is_active: true,
                is_default: false,
                processing_mode: "single_pass",
                output_type: "markdown",
              },
            ],
          },
        ],
        total: 1,
        page: 1,
        page_size: 100,
        pages: 1,
      }

      mockAxios.get.mockResolvedValue(mockV2Response)

      const services = await listLlmServices()

      // Verify transformation
      const service = services[0]
      expect(service.id).toBe("uuid-1")
      expect(service.name).toBe("test-service")
      expect(service.route).toBe("test-route")
      expect(service.service_type).toBe("summary")
      expect(service.flavors).toHaveLength(2)

      const defaultFlavor = service.flavors.find((f) => f.is_default)
      expect(defaultFlavor.processing_mode).toBe("iterative")
      expect(defaultFlavor.output_type).toBe("text")
    })

    it("should filter by organizationId when provided", async () => {
      mockAxios.get.mockResolvedValue({ items: [], total: 0, page: 1, page_size: 100, pages: 0 })

      await listLlmServices("org-123")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/services?page=1&page_size=100&organization_id=org-123",
        expect.objectContaining({ timeout: expect.any(Number) })
      )
    })

    it("should not add organization_id param when not provided", async () => {
      mockAxios.get.mockResolvedValue({ items: [], total: 0, page: 1, page_size: 100, pages: 0 })

      await listLlmServices()

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/services?page=1&page_size=100",
        expect.objectContaining({ timeout: expect.any(Number) })
      )
    })

    it("should URL-encode organizationId with special characters", async () => {
      mockAxios.get.mockResolvedValue({ items: [], total: 0, page: 1, page_size: 100, pages: 0 })

      await listLlmServices("org/with spaces&special")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/services?page=1&page_size=100&organization_id=org%2Fwith%20spaces%26special",
        expect.objectContaining({ timeout: expect.any(Number) })
      )
    })
  })

  describe("generateText", () => {
    const { generateText } = require(
      `${process.cwd()}/components/WebServer/controllers/llm/index`
    )

    it("should generate plain text from conversation", async () => {
      const conversation = {
        text: [
          { speaker_name: "Speaker1", segment: "Hello world" },
          { speaker_name: "Speaker2", segment: "How are you?" },
        ],
      }
      const metadata = { speakers: true }

      const result = await generateText(conversation, metadata)

      expect(result).toContain("Speaker1 : Hello world")
      expect(result).toContain("Speaker2 : How are you?")
    })

    it("should omit speaker names when speakers=false", async () => {
      const conversation = {
        text: [
          { speaker_name: "Speaker1", segment: "Hello world" },
        ],
      }
      const metadata = { speakers: false }

      const result = await generateText(conversation, metadata)

      expect(result).not.toContain("Speaker1")
      expect(result).toBe("Hello world")
    })
  })

  describe("getJobStatus (GET /api/v1/jobs/{job_id})", () => {
    const { getJobStatus } = require(
      `${process.cwd()}/components/WebServer/controllers/llm/index`
    )

    it("should fetch job status from V2 API", async () => {
      const mockJobResponse = {
        id: "job-uuid",
        service_id: "service-uuid",
        service_name: "summary-fr",
        flavor_name: "default",
        status: "processing",
        progress: { current: 50, total: 100, percentage: 50 },
        created_at: "2024-01-01T00:00:00Z",
      }

      mockAxios.get.mockResolvedValue(mockJobResponse)

      const result = await getJobStatus("job-uuid")

      expect(mockAxios.get).toHaveBeenCalledWith(
        "http://localhost:8010/api/v1/jobs/job-uuid"
      )
      expect(result).toEqual(mockJobResponse)
    })

    it("should return null for null job ID", async () => {
      const result = await getJobStatus(null)
      expect(result).toBeNull()
    })

    it("should handle API errors gracefully", async () => {
      mockAxios.get.mockRejectedValue(new Error("Not found"))

      const result = await getJobStatus("invalid-job")

      expect(result).toBeNull()
    })
  })

  describe("completedJob status check", () => {
    const { completedJob } = require(
      `${process.cwd()}/components/WebServer/controllers/llm/index`
    )

    it("should recognize V2 terminal statuses", () => {
      expect(completedJob({ status: "completed" })).toBe(true)
      expect(completedJob({ status: "complete" })).toBe(true)
      expect(completedJob({ status: "failed" })).toBe(true)
      expect(completedJob({ status: "error" })).toBe(true)
      expect(completedJob({ status: "cancelled" })).toBe(true)
      expect(completedJob({ status: "unknown" })).toBe(true)
    })

    it("should recognize non-terminal statuses", () => {
      expect(completedJob({ status: "queued" })).toBe(false)
      expect(completedJob({ status: "started" })).toBe(false)
      expect(completedJob({ status: "processing" })).toBe(false)
    })
  })
})
