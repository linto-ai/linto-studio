/**
 * OrganizationWebSocketManager Tests - LLM Gateway V2
 *
 * Tests organization-scoped WebSocket connection management and message handling
 * according to api-contract.md
 *
 * WebSocket endpoint: /ws/jobs?organization_id={organization_id}
 *
 * Message types:
 * - jobs_snapshot: Initial message with current jobs state
 * - job_update: Individual job status updates
 */

// Mock WebSocket before requiring module
const mockWsOn = jest.fn()
const mockWsClose = jest.fn()
const mockWsSend = jest.fn()

let mockWsInstances = []
let mockWsEventHandlers = {}

jest.mock("ws", () => {
  const MockWebSocket = jest.fn().mockImplementation((url) => {
    const instance = {
      on: jest.fn((event, handler) => {
        mockWsEventHandlers[event] = handler
        mockWsOn(event, handler)
      }),
      close: mockWsClose,
      send: mockWsSend,
      readyState: 1, // OPEN
      url: url,
    }
    mockWsInstances.push(instance)
    return instance
  })
  MockWebSocket.OPEN = 1
  MockWebSocket.CLOSED = 3
  return MockWebSocket
})

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversationExport: {
    updateStatus: jest.fn().mockResolvedValue({}),
    getByJobId: jest.fn().mockResolvedValue([
      {
        convId: "conv-123",
        format: "summary-fr",
        status: "processing",
        processing: 0,
        jobId: "job-uuid-123",
        organizationId: "org-abc",
      },
    ]),
  },
}))

jest.mock(`${process.cwd()}/lib/logger/logger.js`, () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

describe("OrganizationWebSocketManager", () => {
  let wsManager

  beforeEach(() => {
    jest.clearAllMocks()
    mockWsInstances = []
    mockWsEventHandlers = {}
    process.env.LLM_GATEWAY_SERVICES = "http://localhost:8010"

    // Reset singleton by clearing require cache
    jest.resetModules()
    wsManager = require(
      `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
    )
  })

  describe("ensureConnection", () => {
    it("should connect to organization-scoped WebSocket endpoint", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )

      // Simulate WebSocket open
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()

      await connectionPromise

      expect(mockWsInstances).toHaveLength(1)
      expect(mockWsInstances[0].url).toBe(
        "ws://localhost:8010/ws/jobs?organization_id=org-123"
      )
    })

    it("should reuse existing connection for same organization", async () => {
      // First connection
      const promise1 = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler1 = mockWsEventHandlers["open"]
      if (openHandler1) openHandler1()
      await promise1

      // Second call should reuse
      await wsManager.ensureConnection("org-123", "http://localhost:8010")

      expect(mockWsInstances).toHaveLength(1) // Still only one instance
    })

    it("should create separate connections for different organizations", async () => {
      // First organization
      const promise1 = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )

      // Reset handlers for next connection
      mockWsEventHandlers = {}

      const openHandler1 = mockWsOn.mock.calls.find((c) => c[0] === "open")
      if (openHandler1) openHandler1[1]()
      await promise1

      // Second organization
      const promise2 = wsManager.ensureConnection(
        "org-456",
        "http://localhost:8010"
      )
      const openHandler2 = mockWsEventHandlers["open"]
      if (openHandler2) openHandler2()
      await promise2

      expect(mockWsInstances).toHaveLength(2)
      expect(mockWsInstances[0].url).toContain("organization_id=org-123")
      expect(mockWsInstances[1].url).toContain("organization_id=org-456")
    })

    it("should not connect if organization ID is null", async () => {
      await wsManager.ensureConnection(null, "http://localhost:8010")

      expect(mockWsInstances).toHaveLength(0)
    })

    it("should convert HTTP URL to WebSocket URL", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )

      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      expect(mockWsInstances[0].url).toMatch(/^ws:\/\//)
      expect(mockWsInstances[0].url).not.toMatch(/^http:\/\//)
    })

    it("should convert HTTPS URL to WSS URL", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "https://api.example.com"
      )

      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      expect(mockWsInstances[0].url).toMatch(/^wss:\/\//)
    })
  })

  describe("registerJobCallback", () => {
    it("should store callback for job ID within organization", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const mockCallback = jest.fn()
      wsManager.registerJobCallback("org-123", "job-abc", mockCallback)

      // Simulate job_update message
      const messageHandler = mockWsEventHandlers["message"]
      const updateMessage = JSON.stringify({
        type: "job_update",
        job_id: "job-abc",
        status: "processing",
        progress: { current: 50, total: 100, percentage: 50 },
        timestamp: "2024-01-01T00:00:00Z",
      })

      messageHandler(Buffer.from(updateMessage))

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "job_update",
          job_id: "job-abc",
          status: "processing",
        })
      )
    })

    it("should not call callback for different job ID", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const mockCallback = jest.fn()
      wsManager.registerJobCallback("org-123", "job-abc", mockCallback)

      // Simulate update for different job
      const messageHandler = mockWsEventHandlers["message"]
      const updateMessage = JSON.stringify({
        type: "job_update",
        job_id: "job-different",
        status: "completed",
        timestamp: "2024-01-01T00:00:00Z",
      })

      messageHandler(Buffer.from(updateMessage))

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe("jobs_snapshot message handling", () => {
    it("should update active jobs set from snapshot", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const mockCallback = jest.fn()
      wsManager.registerJobCallback("org-123", "job-1", mockCallback)

      // Simulate jobs_snapshot message
      const messageHandler = mockWsEventHandlers["message"]
      const snapshotMessage = JSON.stringify({
        type: "jobs_snapshot",
        jobs: [
          {
            job_id: "job-1",
            status: "processing",
            progress: { current: 25, total: 100, percentage: 25 },
            service_name: "summary-fr",
            flavor_name: "default",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            job_id: "job-2",
            status: "queued",
            service_name: "summary-en",
            flavor_name: "fast",
            created_at: "2024-01-01T00:01:00Z",
          },
        ],
        timestamp: "2024-01-01T00:00:00Z",
      })

      messageHandler(Buffer.from(snapshotMessage))

      // Callback should be invoked for matching job
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          job_id: "job-1",
          status: "processing",
        })
      )
    })

    it("should track active jobs from snapshot", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      // Simulate jobs_snapshot with active jobs
      const messageHandler = mockWsEventHandlers["message"]
      const snapshotMessage = JSON.stringify({
        type: "jobs_snapshot",
        jobs: [
          { job_id: "job-active-1", status: "processing" },
          { job_id: "job-active-2", status: "queued" },
          { job_id: "job-done", status: "completed" },
        ],
        timestamp: "2024-01-01T00:00:00Z",
      })

      // Register callbacks to keep connection open
      wsManager.registerJobCallback("org-123", "job-active-1", jest.fn())
      wsManager.registerJobCallback("org-123", "job-active-2", jest.fn())

      messageHandler(Buffer.from(snapshotMessage))

      // Active jobs should include processing and queued
      const activeJobs = wsManager.getAllActiveJobs()
      expect(activeJobs.has("job-active-1")).toBe(true)
      expect(activeJobs.has("job-active-2")).toBe(true)
      expect(activeJobs.has("job-done")).toBe(false) // completed is terminal
    })
  })

  describe("job_update message handling", () => {
    it("should invoke registered callback with update data", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const mockCallback = jest.fn()
      wsManager.registerJobCallback("org-123", "job-xyz", mockCallback)

      // Keep connection active
      wsManager.registerJobCallback("org-123", "job-other", jest.fn())

      // Simulate job_update message
      const messageHandler = mockWsEventHandlers["message"]
      const updateMessage = JSON.stringify({
        type: "job_update",
        job_id: "job-xyz",
        status: "completed",
        result: { output: "Summary text here" },
        progress: { current: 100, total: 100, percentage: 100 },
        timestamp: "2024-01-01T00:05:00Z",
      })

      messageHandler(Buffer.from(updateMessage))

      expect(mockCallback).toHaveBeenCalledWith({
        type: "job_update",
        job_id: "job-xyz",
        status: "completed",
        result: { output: "Summary text here" },
        progress: { current: 100, total: 100, percentage: 100 },
        timestamp: "2024-01-01T00:05:00Z",
      })
    })

    it("should remove job from active set when terminal status received", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      // Register two callbacks to prevent early close
      wsManager.registerJobCallback("org-123", "job-1", jest.fn())
      wsManager.registerJobCallback("org-123", "job-2", jest.fn())

      // First add job to active set via snapshot
      const messageHandler = mockWsEventHandlers["message"]
      const snapshotMessage = JSON.stringify({
        type: "jobs_snapshot",
        jobs: [
          { job_id: "job-1", status: "processing" },
          { job_id: "job-2", status: "processing" },
        ],
        timestamp: "2024-01-01T00:00:00Z",
      })
      messageHandler(Buffer.from(snapshotMessage))

      // Now send completed update for job-1
      const updateMessage = JSON.stringify({
        type: "job_update",
        job_id: "job-1",
        status: "completed",
        timestamp: "2024-01-01T00:05:00Z",
      })
      messageHandler(Buffer.from(updateMessage))

      const activeJobs = wsManager.getAllActiveJobs()
      expect(activeJobs.has("job-1")).toBe(false) // Removed
      expect(activeJobs.has("job-2")).toBe(true) // Still active
    })

    it("should handle failed status as terminal", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      wsManager.registerJobCallback("org-123", "job-1", jest.fn())
      wsManager.registerJobCallback("org-123", "job-2", jest.fn())

      const messageHandler = mockWsEventHandlers["message"]

      // Add to active
      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "jobs_snapshot",
            jobs: [
              { job_id: "job-1", status: "processing" },
              { job_id: "job-2", status: "processing" },
            ],
            timestamp: "2024-01-01T00:00:00Z",
          })
        )
      )

      // Send failed update
      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "job_update",
            job_id: "job-1",
            status: "failed",
            error: "Processing error",
            timestamp: "2024-01-01T00:05:00Z",
          })
        )
      )

      const activeJobs = wsManager.getAllActiveJobs()
      expect(activeJobs.has("job-1")).toBe(false)
    })

    it("should handle cancelled status as terminal", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      wsManager.registerJobCallback("org-123", "job-1", jest.fn())
      wsManager.registerJobCallback("org-123", "job-2", jest.fn())

      const messageHandler = mockWsEventHandlers["message"]

      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "jobs_snapshot",
            jobs: [
              { job_id: "job-1", status: "processing" },
              { job_id: "job-2", status: "processing" },
            ],
            timestamp: "2024-01-01T00:00:00Z",
          })
        )
      )

      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "job_update",
            job_id: "job-1",
            status: "cancelled",
            timestamp: "2024-01-01T00:05:00Z",
          })
        )
      )

      const activeJobs = wsManager.getAllActiveJobs()
      expect(activeJobs.has("job-1")).toBe(false)
    })
  })

  describe("Connection lifecycle", () => {
    it("should close connection when all jobs reach terminal state", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      // Register single callback
      const mockCallback = jest.fn()
      wsManager.registerJobCallback("org-123", "job-only", mockCallback)

      const messageHandler = mockWsEventHandlers["message"]

      // Send snapshot with one active job
      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "jobs_snapshot",
            jobs: [{ job_id: "job-only", status: "processing" }],
            timestamp: "2024-01-01T00:00:00Z",
          })
        )
      )

      // Complete the job
      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "job_update",
            job_id: "job-only",
            status: "completed",
            result: "Done",
            timestamp: "2024-01-01T00:05:00Z",
          })
        )
      )

      // Wait for async _handleJobUpdate to complete (database lookup)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Connection should be closed
      expect(mockWsClose).toHaveBeenCalled()
    })

    it("should not close connection while jobs are pending", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      // Register callback for pending job
      wsManager.registerJobCallback("org-123", "job-pending", jest.fn())

      const messageHandler = mockWsEventHandlers["message"]

      // Send empty snapshot (job not yet visible)
      messageHandler(
        Buffer.from(
          JSON.stringify({
            type: "jobs_snapshot",
            jobs: [],
            timestamp: "2024-01-01T00:00:00Z",
          })
        )
      )

      // Connection should NOT be closed because there's a pending job
      expect(mockWsClose).not.toHaveBeenCalled()
    })
  })

  describe("Terminal states", () => {
    it("should recognize completed as terminal", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.TERMINAL_STATES.includes("completed")
      ).toBe(true)
    })

    it("should recognize failed as terminal", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.TERMINAL_STATES.includes("failed")
      ).toBe(true)
    })

    it("should recognize cancelled as terminal", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.TERMINAL_STATES.includes("cancelled")
      ).toBe(true)
    })
  })

  describe("Active states", () => {
    it("should recognize queued as active", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.ACTIVE_STATES.includes("queued")
      ).toBe(true)
    })

    it("should recognize started as active", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.ACTIVE_STATES.includes("started")
      ).toBe(true)
    })

    it("should recognize processing as active", () => {
      const OrganizationWebSocketManager = require(
        `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`
      ).constructor
      expect(
        OrganizationWebSocketManager.ACTIVE_STATES.includes("processing")
      ).toBe(true)
    })
  })

  describe("Legacy compatibility", () => {
    it("getSocket should return object with readyState", async () => {
      const socket = wsManager.getSocket()

      expect(socket).toHaveProperty("readyState")
    })

    it("hasActiveConnections should return false when no connections", () => {
      expect(wsManager.hasActiveConnections()).toBe(false)
    })

    it("hasActiveConnections should return true when connected", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      // Keep connection open
      wsManager.registerJobCallback("org-123", "job-1", jest.fn())

      expect(wsManager.hasActiveConnections()).toBe(true)
    })

    it("completedJob should recognize terminal statuses", () => {
      expect(wsManager.completedJob("complete")).toBe(true)
      expect(wsManager.completedJob("completed")).toBe(true)
      expect(wsManager.completedJob("error")).toBe(true)
      expect(wsManager.completedJob("failed")).toBe(true)
      expect(wsManager.completedJob("cancelled")).toBe(true)
      expect(wsManager.completedJob("unknown")).toBe(true)
      expect(wsManager.completedJob("processing")).toBe(false)
      expect(wsManager.completedJob("queued")).toBe(false)
    })

    it("connectToJob should warn about deprecation", async () => {
      const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

      wsManager.connectToJob("job-123")

      expect(appLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("deprecated")
      )
    })

    it("watchJobs should warn about deprecation", () => {
      const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

      wsManager.watchJobs(["job-1", "job-2"])

      expect(appLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("deprecated")
      )
    })
  })

  describe("closeAll", () => {
    it("should close all active connections", async () => {
      // Create two connections
      const promise1 = wsManager.ensureConnection(
        "org-1",
        "http://localhost:8010"
      )
      let openHandler1 = mockWsEventHandlers["open"]
      if (openHandler1) openHandler1()
      await promise1

      mockWsEventHandlers = {}

      const promise2 = wsManager.ensureConnection(
        "org-2",
        "http://localhost:8010"
      )
      let openHandler2 = mockWsEventHandlers["open"]
      if (openHandler2) openHandler2()
      await promise2

      // Keep connections open
      wsManager.registerJobCallback("org-1", "job-1", jest.fn())
      wsManager.registerJobCallback("org-2", "job-2", jest.fn())

      wsManager.closeAll()

      expect(mockWsClose).toHaveBeenCalled()
    })
  })

  describe("Error handling", () => {
    it("should handle malformed JSON messages", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
      const messageHandler = mockWsEventHandlers["message"]

      // Should not throw, should log error
      expect(() => {
        messageHandler(Buffer.from("invalid json {{{"))
      }).not.toThrow()

      expect(appLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error parsing message")
      )
    })

    it("should handle callback errors gracefully", async () => {
      const connectionPromise = wsManager.ensureConnection(
        "org-123",
        "http://localhost:8010"
      )
      const openHandler = mockWsEventHandlers["open"]
      if (openHandler) openHandler()
      await connectionPromise

      const throwingCallback = jest.fn(() => {
        throw new Error("Callback error")
      })
      wsManager.registerJobCallback("org-123", "job-throw", throwingCallback)
      wsManager.registerJobCallback("org-123", "job-other", jest.fn())

      const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
      const messageHandler = mockWsEventHandlers["message"]

      // Should not throw
      expect(() => {
        messageHandler(
          Buffer.from(
            JSON.stringify({
              type: "job_update",
              job_id: "job-throw",
              status: "processing",
              timestamp: "2024-01-01T00:00:00Z",
            })
          )
        )
      }).not.toThrow()

      expect(appLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error in callback")
      )
    })
  })
})
