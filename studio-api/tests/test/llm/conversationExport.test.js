/**
 * ConversationExport Model V2 Tests
 *
 * Tests the V2 schema fields and model methods
 * according to api-contract.md
 */

const mockMongoInsert = jest.fn()
const mockMongoUpdateOne = jest.fn()
const mockMongoRequest = jest.fn()
const mockMongoDelete = jest.fn()
const mockGetObjectId = jest.fn().mockImplementation((id) => id)

// Mock the parent MongoModel class
jest.mock(`${process.cwd()}/lib/mongodb/model`, () => {
  return class MongoModel {
    constructor(collectionName) {
      this.collectionName = collectionName
    }
    mongoInsert(payload) {
      return mockMongoInsert(payload)
    }
    mongoUpdateOne(query, operator, data) {
      return mockMongoUpdateOne(query, operator, data)
    }
    mongoRequest(query, projection) {
      return mockMongoRequest(query, projection)
    }
    mongoDelete(query) {
      return mockMongoDelete(query)
    }
    mongoDeleteMany(query) {
      return mockMongoDelete(query)
    }
    getObjectId(id) {
      return mockGetObjectId(id)
    }
  }
})

describe("ConversationExportModel V2", () => {
  let model

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    model = require(`${process.cwd()}/lib/mongodb/models/conversationExport`)
  })

  describe("create", () => {
    it("should initialize V2 progress fields with defaults", async () => {
      mockMongoInsert.mockResolvedValue({ insertedId: "new-id" })

      const payload = {
        convId: "conv-123",
        format: "summary-fr",
        status: "processing",
      }

      await model.create(payload)

      expect(mockMongoInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          convId: "conv-123",
          format: "summary-fr",
          progress: {
            current: 0,
            total: 100,
            percentage: 0,
            phase: "processing",
          },
        })
      )
    })

    it("should preserve custom progress if provided", async () => {
      mockMongoInsert.mockResolvedValue({ insertedId: "new-id" })

      const payload = {
        convId: "conv-123",
        format: "summary-fr",
        progress: {
          current: 50,
          total: 100,
          percentage: 50,
          phase: "reducing",
        },
      }

      await model.create(payload)

      expect(mockMongoInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          progress: {
            current: 50,
            total: 100,
            percentage: 50,
            phase: "reducing",
          },
        })
      )
    })

    it("should add timestamp fields", async () => {
      mockMongoInsert.mockResolvedValue({ insertedId: "new-id" })

      await model.create({ convId: "test" })

      const insertedPayload = mockMongoInsert.mock.calls[0][0]
      expect(insertedPayload).toHaveProperty("created")
      expect(insertedPayload).toHaveProperty("last_update")
    })
  })

  describe("updateStatus", () => {
    it("should update V2 fields when present", async () => {
      mockMongoUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const payload = {
        convId: "conv-123",
        format: "summary-fr",
        status: "complete",
        processing: 100,
        data: "Summary result",
        jobId: "job-uuid",
        progress: { current: 100, total: 100, percentage: 100, phase: "completed" },
        tokenMetrics: {
          totalTokens: 1500,
          totalPromptTokens: 1000,
          totalCompletionTokens: 500,
          totalDurationMs: 5000,
          estimatedCost: 0.01,
        },
        serviceName: "summary-fr",
        flavorName: "default",
      }

      await model.updateStatus(payload)

      expect(mockMongoUpdateOne).toHaveBeenCalledWith(
        { convId: "conv-123", format: "summary-fr" },
        "$set",
        expect.objectContaining({
          status: "complete",
          processing: 100,
          data: "Summary result",
          jobId: "job-uuid",
          progress: expect.objectContaining({ percentage: 100 }),
          tokenMetrics: expect.objectContaining({ totalTokens: 1500 }),
          serviceName: "summary-fr",
          flavorName: "default",
        })
      )
    })

    it("should update fallback tracking fields", async () => {
      mockMongoUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const payload = {
        convId: "conv-123",
        format: "summary-fr",
        status: "processing",
        processing: 50,
        fallbackApplied: true,
        originalFlavorName: "quality",
        fallbackReason: "Context exceeded",
      }

      await model.updateStatus(payload)

      const updateData = mockMongoUpdateOne.mock.calls[0][2]
      expect(updateData.fallbackApplied).toBe(true)
      expect(updateData.originalFlavorName).toBe("quality")
      expect(updateData.fallbackReason).toBe("Context exceeded")
    })

    it("should only include fields that are present", async () => {
      mockMongoUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const payload = {
        convId: "conv-123",
        format: "summary-fr",
        status: "processing",
        processing: 25,
      }

      await model.updateStatus(payload)

      const updateData = mockMongoUpdateOne.mock.calls[0][2]
      expect(updateData).not.toHaveProperty("data")
      expect(updateData).not.toHaveProperty("tokenMetrics")
      expect(updateData).not.toHaveProperty("fallbackApplied")
    })
  })

  describe("getByJobId", () => {
    it("should query by V2 job ID", async () => {
      mockMongoRequest.mockResolvedValue([{ jobId: "job-uuid", status: "processing" }])

      const result = await model.getByJobId("job-uuid")

      // Check the call was made with expected query
      expect(mockMongoRequest).toHaveBeenCalled()
      const callArgs = mockMongoRequest.mock.calls[0]
      expect(callArgs[0]).toEqual({ jobId: "job-uuid" })
      expect(result).toHaveLength(1)
    })
  })

  describe("Schema compliance with api-contract.md", () => {
    it("should support all V2 status values", async () => {
      mockMongoUpdateOne.mockResolvedValue({ modifiedCount: 1 })

      const statuses = ["queued", "started", "processing", "complete", "error"]

      for (const status of statuses) {
        await model.updateStatus({
          convId: "test",
          format: "test",
          status: status,
          processing: 0,
        })
      }

      expect(mockMongoUpdateOne).toHaveBeenCalledTimes(5)
    })

    it("should support V2 progress phases", async () => {
      mockMongoInsert.mockResolvedValue({ insertedId: "id" })

      const phases = ["processing", "reducing", "generating_document"]

      for (const phase of phases) {
        await model.create({
          convId: "test",
          format: "test",
          progress: { current: 0, total: 100, percentage: 0, phase },
        })
      }

      const calls = mockMongoInsert.mock.calls
      expect(calls[0][0].progress.phase).toBe("processing")
      expect(calls[1][0].progress.phase).toBe("reducing")
      expect(calls[2][0].progress.phase).toBe("generating_document")
    })
  })
})
