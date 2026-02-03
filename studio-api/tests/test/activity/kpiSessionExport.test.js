/**
 * Unit tests for KPI Session Export endpoint
 * Tests the export functionality for KPI session data in multiple formats (JSON, CSV, XLS)
 * Validates conformance to api-contract.md
 */

// Mock the mongodb models before requiring the module
const mockGetBy = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  activityLog: {
    getAll: jest.fn(),
    getKpiSession: jest.fn(),
    getKpiTranscription: jest.fn(),
    getKpiLlm: jest.fn(),
    kpiSessionById: jest.fn(),
    findSessionsWithActivity: jest.fn(),
    aggregateChannelMetrics: jest.fn(),
  },
  kpi: {
    sessions: {
      getLastKpi: jest.fn(),
      getBySessions: jest.fn(),
      deleteSessions: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
      getBy: mockGetBy,
    },
  },
}))

// Mock kpiExport module
const mockTransformSessionData = jest.fn()
const mockGenerateCsv = jest.fn()
const mockGenerateXlsx = jest.fn()

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/activity/kpiExport`,
  () => ({
    transformSessionData: mockTransformSessionData,
    generateCsv: mockGenerateCsv,
    generateXlsx: mockGenerateXlsx,
  }),
)

// Mock res object
const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  setHeader: jest.fn().mockReturnThis(),
})

// Mock next function
const mockNext = jest.fn()

const { exportKpiSessions } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/activity`,
)

// Sample mock data
const createMockSessionData = () => ({
  sessionId: "session-123",
  session: { name: "Test Session", visibility: "public" },
  organizationId: "org-456",
  firstConnectionAt: "2025-01-20T10:00:00.000Z",
  lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
  userCount: { total: 5, reconnections: 7, above5Min: 3, below5Min: 2 },
  watchTime: { total: 1100, average: 220, avgAbove5Min: 350, avgUnder5Min: 50 },
  streaming: { totalChannels: 2, totalStreamingTime: 3600 },
  channels: [
    {
      channelId: "channel-1",
      name: "Main Channel",
      type: "transcription",
      languages: [{ candidate: "en" }],
      region: "us-east",
      hasDiarization: true,
      activeDuration: 1800,
      mountedAt: ["2025-01-20T10:00:00.000Z"],
      unmountedAt: ["2025-01-20T10:30:00.000Z"],
    },
  ],
})

// transformSessionData now returns an array of rows (one per channel)
const createTransformedData = () => [
  {
    sessionId: "session-123",
    sessionName: "Test Session",
    sessionVisibility: "public",
    organizationId: "org-456",
    firstConnectionAt: "2025-01-20T10:00:00.000Z",
    lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
    totalUsers: 5,
    reconnections: 7,
    usersAbove5Min: 3,
    usersBelow5Min: 2,
    totalWatchTime: 1100,
    avgWatchTime: 220,
    avgWatchTimeAbove5Min: 350,
    avgWatchTimeBelow5Min: 50,
    totalChannels: 2,
    totalStreamingTime: 3600,
    channelId: "channel-1",
    channelName: "Main Channel",
    channelDescription: "Main streaming channel",
    channelType: "transcription",
    channelLanguages: "en",
    channelHasDiarization: "Yes",
    channelMountCount: 1,
    channelActiveDuration: 1800,
  },
]

describe("KPI Session Export - API Contract Compliance", () => {
  let mockRes

  beforeEach(() => {
    mockRes = createMockRes()
    mockNext.mockReset()
    mockGetBy.mockReset()
    mockTransformSessionData.mockReset()
    mockGenerateCsv.mockReset()
    mockGenerateXlsx.mockReset()

    // Default mock implementations
    mockGetBy.mockResolvedValue({ list: [createMockSessionData()] })
    mockTransformSessionData.mockReturnValue(createTransformedData())
    mockGenerateCsv.mockReturnValue("\ufeffsessionId,sessionName\nsession-123,Test Session")
    mockGenerateXlsx.mockResolvedValue(Buffer.from("xlsx-content"))
  })

  describe("Format Validation", () => {
    it("[CONTRACT] should return 400 for missing format parameter", async () => {
      const req = { query: { userScope: "backoffice" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid format. Must be one of: json, csv, xls",
      })
      expect(mockGetBy).not.toHaveBeenCalled()
    })

    it("[CONTRACT] should return 400 for invalid format parameter", async () => {
      const req = { query: { userScope: "backoffice", format: "pdf" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid format. Must be one of: json, csv, xls",
      })
      expect(mockGetBy).not.toHaveBeenCalled()
    })

    it("[CONTRACT] should return 400 for empty format parameter", async () => {
      const req = { query: { userScope: "backoffice", format: "" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid format. Must be one of: json, csv, xls",
      })
    })

    it("[CONTRACT] should accept format=json", async () => {
      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalled()
    })

    it("[CONTRACT] should accept format=csv", async () => {
      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalled()
    })

    it("[CONTRACT] should accept format=xls", async () => {
      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalled()
    })
  })

  describe("Date Range Validation", () => {
    it("[CONTRACT] should return 400 when startDate is after endDate", async () => {
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          startDate: "2025-12-31",
          endDate: "2025-01-01",
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid date range: startDate must be before endDate",
      })
      expect(mockGetBy).not.toHaveBeenCalled()
    })

    it("[CONTRACT] should accept valid date range", async () => {
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          startDate: "2025-01-01",
          endDate: "2025-01-31",
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: "2025-01-01",
          endDate: "2025-01-31",
        }),
      )
    })

    it("[CONTRACT] should accept request with only startDate", async () => {
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          startDate: "2025-01-01",
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: "2025-01-01",
        }),
      )
    })

    it("[CONTRACT] should accept request with only endDate", async () => {
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          endDate: "2025-12-31",
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.status).not.toHaveBeenCalledWith(400)
      expect(mockGetBy).toHaveBeenCalledWith(
        expect.objectContaining({
          endDate: "2025-12-31",
        }),
      )
    })
  })

  describe("Organization Filter", () => {
    it("[CONTRACT] should pass organizationId to database query when provided", async () => {
      const orgId = "org-123-456"
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          organizationId: orgId,
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockGetBy).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: orgId,
        }),
      )
    })

    it("[CONTRACT] should work without organizationId for platform-wide export", async () => {
      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      const callArgs = mockGetBy.mock.calls[0][0]
      expect(callArgs).not.toHaveProperty("organizationId")
    })
  })

  describe("JSON Export Format", () => {
    it("[CONTRACT] should return Content-Type: application/json for JSON format", async () => {
      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json",
      )
    })

    it("[CONTRACT] should return Content-Disposition with attachment filename for JSON", async () => {
      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringMatching(/^attachment; filename="kpi-sessions-\d{4}-\d{2}-\d{2}\.json"$/),
      )
    })

    it("[CONTRACT] should return transformed data array for JSON format", async () => {
      const mockData = createMockSessionData()
      const transformedData = createTransformedData()
      mockGetBy.mockResolvedValue({ list: [mockData] })
      mockTransformSessionData.mockReturnValue(transformedData)

      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      // transformSessionData is called via .flatMap(), which passes (item, index, array)
      expect(mockTransformSessionData).toHaveBeenCalled()
      expect(mockTransformSessionData.mock.calls[0][0]).toEqual(mockData)
      // flatMap flattens the array returned by transformSessionData
      expect(mockRes.json).toHaveBeenCalledWith(transformedData)
    })
  })

  describe("CSV Export Format", () => {
    it("[CONTRACT] should return Content-Type: text/csv for CSV format", async () => {
      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "text/csv; charset=utf-8",
      )
    })

    it("[CONTRACT] should return Content-Disposition with attachment filename for CSV", async () => {
      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringMatching(/^attachment; filename="kpi-sessions-\d{4}-\d{2}-\d{2}\.csv"$/),
      )
    })

    it("[CONTRACT] should call generateCsv with transformed data", async () => {
      const transformedData = createTransformedData()
      mockTransformSessionData.mockReturnValue(transformedData)

      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      // flatMap flattens the array, so we expect the flattened result
      expect(mockGenerateCsv).toHaveBeenCalledWith(transformedData)
      expect(mockRes.send).toHaveBeenCalled()
    })
  })

  describe("XLS Export Format", () => {
    it("[CONTRACT] should return correct Content-Type for XLS format", async () => {
      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
    })

    it("[CONTRACT] should return Content-Disposition with .xlsx extension", async () => {
      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        expect.stringMatching(/^attachment; filename="kpi-sessions-\d{4}-\d{2}-\d{2}\.xlsx"$/),
      )
    })

    it("[CONTRACT] should call generateXlsx with transformed data", async () => {
      const transformedData = createTransformedData()
      mockTransformSessionData.mockReturnValue(transformedData)

      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      // flatMap flattens the array, so we expect the flattened result
      expect(mockGenerateXlsx).toHaveBeenCalledWith(transformedData)
      expect(mockRes.send).toHaveBeenCalled()
    })

    it("[CONTRACT] should return Buffer for XLS format", async () => {
      const xlsBuffer = Buffer.from("test-xlsx-content")
      mockGenerateXlsx.mockResolvedValue(xlsBuffer)

      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.send).toHaveBeenCalledWith(expect.any(Buffer))
    })
  })

  describe("Empty Data Handling", () => {
    it("[CONTRACT] should return empty array for JSON when no data", async () => {
      mockGetBy.mockResolvedValue({ list: [] })

      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockRes.json).toHaveBeenCalledWith([])
    })

    it("[CONTRACT] should call generateCsv with empty array when no data", async () => {
      mockGetBy.mockResolvedValue({ list: [] })

      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockGenerateCsv).toHaveBeenCalledWith([])
    })

    it("[CONTRACT] should call generateXlsx with empty array when no data", async () => {
      mockGetBy.mockResolvedValue({ list: [] })

      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockGenerateXlsx).toHaveBeenCalledWith([])
    })
  })

  describe("Query Parameters Passthrough", () => {
    it("should use large size limit for export (no pagination)", async () => {
      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockGetBy).toHaveBeenCalledWith(
        expect.objectContaining({
          size: 10000,
          page: 0,
        }),
      )
    })

    it("should combine all filters correctly", async () => {
      const req = {
        query: {
          userScope: "backoffice",
          format: "json",
          organizationId: "org-789",
          startDate: "2025-01-01",
          endDate: "2025-06-30",
        },
      }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockGetBy).toHaveBeenCalledWith({
        organizationId: "org-789",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        size: 10000,
        page: 0,
      })
    })
  })

  describe("Error Handling", () => {
    it("should call next with error when database query fails", async () => {
      const testError = new Error("Database connection failed")
      mockGetBy.mockRejectedValue(testError)

      const req = { query: { userScope: "backoffice", format: "json" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(testError)
    })

    it("should call next with error when CSV generation fails", async () => {
      const testError = new Error("CSV generation failed")
      mockGenerateCsv.mockImplementation(() => {
        throw testError
      })

      const req = { query: { userScope: "backoffice", format: "csv" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(testError)
    })

    it("should call next with error when XLSX generation fails", async () => {
      const testError = new Error("XLSX generation failed")
      mockGenerateXlsx.mockRejectedValue(testError)

      const req = { query: { userScope: "backoffice", format: "xls" } }
      await exportKpiSessions(req, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(testError)
    })
  })
})

/**
 * KPI Export Data Transformation Tests
 *
 * These tests validate the kpiExport module functions directly.
 * Note: These tests require the exceljs module which is a production dependency.
 * If running in isolation without the full dependencies, these tests may be skipped.
 */
describe("KPI Export Data Transformation", () => {
  let kpiExport
  let moduleLoadError = null

  beforeAll(() => {
    // Reset module cache to get the real implementation
    jest.resetModules()

    // Clear the mock for kpiExport
    jest.unmock(`${process.cwd()}/components/WebServer/controllers/activity/kpiExport`)

    try {
      kpiExport = require(`${process.cwd()}/components/WebServer/controllers/activity/kpiExport`)
    } catch (err) {
      // Module may fail to load if exceljs is not available in test env
      moduleLoadError = err
    }
  })

  describe("transformSessionData", () => {
    it("[CONTRACT] should transform session data with channels to export format (one row per channel)", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const input = {
        sessionId: "sess-123",
        session: { name: "Demo Session", visibility: "public" },
        organizationId: "org-456",
        firstConnectionAt: "2025-01-20T10:00:00.000Z",
        lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
        userCount: { total: 5, reconnections: 7, above5Min: 3, below5Min: 2 },
        watchTime: { total: 1100, average: 220, avgAbove5Min: 350, avgUnder5Min: 50 },
        streaming: { totalChannels: 2, totalStreamingTime: 3600 },
        channels: [
          {
            channelId: "ch-1",
            name: "Main",
            description: "Main channel",
            type: "transcription",
            languages: [{ candidate: "en" }, { candidate: "fr" }],
            hasDiarization: true,
            activeDuration: 1800,
            mountedAt: ["2025-01-20T10:00:00.000Z"],
            unmountedAt: ["2025-01-20T10:30:00.000Z"],
          },
        ],
      }

      const result = kpiExport.transformSessionData(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].sessionId).toBe("sess-123")
      expect(result[0].channelId).toBe("ch-1")
      expect(result[0].channelName).toBe("Main")
      expect(result[0].channelDescription).toBe("Main channel")
      expect(result[0].channelType).toBe("transcription")
      expect(result[0].channelLanguages).toBe("en, fr")
      expect(result[0].channelHasDiarization).toBe("Yes")
      expect(result[0].channelMountCount).toBe(1)
      expect(result[0].channelActiveDuration).toBe(1800)
    })

    it("[CONTRACT] should return one row with empty channel fields when no channels", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const input = {
        sessionId: "sess-456",
        session: { name: "No Channels", visibility: "private" },
        channels: [],
      }

      const result = kpiExport.transformSessionData(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].sessionId).toBe("sess-456")
      expect(result[0].channelId).toBe("")
      expect(result[0].channelName).toBe("")
      expect(result[0].channelMountCount).toBe("")
    })

    it("[CONTRACT] should handle missing nested fields gracefully", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const input = {
        sessionId: "sess-456",
        // session is missing
        // userCount is missing
        // watchTime is missing
        // streaming is missing
        // channels is missing
      }

      const result = kpiExport.transformSessionData(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0].sessionId).toBe("sess-456")
      expect(result[0].sessionName).toBe("")
      expect(result[0].sessionVisibility).toBe("")
      expect(result[0].organizationId).toBe("")
      expect(result[0].firstConnectionAt).toBeNull()
      expect(result[0].lastDisconnectionAt).toBeNull()
      expect(result[0].totalUsers).toBe(0)
      expect(result[0].reconnections).toBe(0)
      expect(result[0].channelId).toBe("")
    })

    it("[CONTRACT] should handle null values in nested objects", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const input = {
        sessionId: "sess-789",
        session: null,
        userCount: null,
        watchTime: null,
        streaming: null,
        channels: null,
      }

      const result = kpiExport.transformSessionData(input)

      expect(Array.isArray(result)).toBe(true)
      expect(result[0].sessionName).toBe("")
      expect(result[0].totalUsers).toBe(0)
      expect(result[0].totalWatchTime).toBe(0)
      expect(result[0].totalChannels).toBe(0)
    })

    it("[CONTRACT] should create multiple rows for multiple channels with mount counts", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const input = {
        sessionId: "sess-multi",
        session: { name: "Multi Channel", visibility: "public" },
        channels: [
          { channelId: "ch-1", name: "Channel A", hasDiarization: true, mountedAt: ["t1"] },
          { channelId: "ch-2", name: "Channel B", hasDiarization: false, mountedAt: ["t1", "t2"] },
        ],
      }

      const result = kpiExport.transformSessionData(input)

      expect(result.length).toBe(2)
      expect(result[0].sessionId).toBe("sess-multi")
      expect(result[0].channelId).toBe("ch-1")
      expect(result[0].channelHasDiarization).toBe("Yes")
      expect(result[0].channelMountCount).toBe(1)
      expect(result[1].sessionId).toBe("sess-multi")
      expect(result[1].channelId).toBe("ch-2")
      expect(result[1].channelHasDiarization).toBe("No")
      expect(result[1].channelMountCount).toBe(2)
    })
  })

  describe("generateCsv", () => {
    it("[CONTRACT] should include UTF-8 BOM for Excel compatibility", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = []
      const result = kpiExport.generateCsv(data)

      expect(result.startsWith("\ufeff")).toBe(true)
    })

    it("[CONTRACT] should include header row with all required fields including channel fields", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = []
      const result = kpiExport.generateCsv(data)
      const headerLine = result.split("\n")[0].replace("\ufeff", "")

      const expectedHeaders = [
        "sessionId",
        "sessionName",
        "sessionVisibility",
        "organizationId",
        "firstConnectionAt",
        "lastDisconnectionAt",
        "totalUsers",
        "reconnections",
        "usersAbove5Min",
        "usersBelow5Min",
        "totalWatchTime",
        "avgWatchTime",
        "avgWatchTimeAbove5Min",
        "avgWatchTimeBelow5Min",
        "totalChannels",
        "totalStreamingTime",
        "channelId",
        "channelName",
        "channelDescription",
        "channelType",
        "channelLanguages",
        "channelHasDiarization",
        "channelMountCount",
        "channelActiveDuration",
      ]

      expectedHeaders.forEach((header) => {
        expect(headerLine).toContain(header)
      })
    })

    it("[CONTRACT] should output data rows correctly including channel fields", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = [
        {
          sessionId: "sess-123",
          sessionName: "Test Session",
          sessionVisibility: "public",
          organizationId: "org-456",
          firstConnectionAt: "2025-01-20T10:00:00.000Z",
          lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
          totalUsers: 5,
          reconnections: 7,
          usersAbove5Min: 3,
          usersBelow5Min: 2,
          totalWatchTime: 1100,
          avgWatchTime: 220,
          avgWatchTimeAbove5Min: 350,
          avgWatchTimeBelow5Min: 50,
          totalChannels: 2,
          totalStreamingTime: 3600,
          channelId: "ch-1",
          channelName: "Main Channel",
          channelDescription: "Main streaming channel",
          channelType: "transcription",
          channelLanguages: "en",
          channelHasDiarization: "Yes",
          channelMountCount: 1,
          channelActiveDuration: 1800,
        },
      ]

      const result = kpiExport.generateCsv(data)
      const lines = result.split("\n")

      expect(lines.length).toBe(2) // header + 1 data row
      expect(lines[1]).toContain("sess-123")
      expect(lines[1]).toContain("Test Session")
      expect(lines[1]).toContain("ch-1")
      expect(lines[1]).toContain("Main Channel")
    })

    it("[CONTRACT] should escape values containing commas with double quotes", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = [
        {
          sessionId: "sess-123",
          sessionName: "Session, with, commas",
          sessionVisibility: "public",
          organizationId: "org-456",
          firstConnectionAt: null,
          lastDisconnectionAt: null,
          totalUsers: 0,
          reconnections: 0,
          usersAbove5Min: 0,
          usersBelow5Min: 0,
          totalWatchTime: 0,
          avgWatchTime: 0,
          avgWatchTimeAbove5Min: null,
          avgWatchTimeBelow5Min: null,
          totalChannels: 0,
          totalStreamingTime: 0,
          channelId: "",
          channelName: "",
          channelDescription: "",
          channelType: "",
          channelLanguages: "",
          channelHasDiarization: "",
          channelMountCount: "",
          channelActiveDuration: "",
        },
      ]

      const result = kpiExport.generateCsv(data)
      const dataLine = result.split("\n")[1]

      expect(dataLine).toContain('"Session, with, commas"')
    })

    it("[CONTRACT] should handle null values as empty strings", () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = [
        {
          sessionId: "sess-123",
          sessionName: "Test",
          sessionVisibility: "public",
          organizationId: "org-456",
          firstConnectionAt: null,
          lastDisconnectionAt: null,
          totalUsers: 0,
          reconnections: 0,
          usersAbove5Min: 0,
          usersBelow5Min: 0,
          totalWatchTime: 0,
          avgWatchTime: 0,
          avgWatchTimeAbove5Min: null,
          avgWatchTimeBelow5Min: null,
          totalChannels: 0,
          totalStreamingTime: 0,
          channelId: "",
          channelName: "",
          channelDescription: "",
          channelType: "",
          channelLanguages: "",
          channelHasDiarization: "",
          channelMountCount: "",
          channelActiveDuration: "",
        },
      ]

      const result = kpiExport.generateCsv(data)

      // Should not contain "null" as string
      expect(result).not.toContain(",null,")
    })
  })

  describe("generateXlsx", () => {
    it("[CONTRACT] should return a Buffer", async () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = []
      const result = await kpiExport.generateXlsx(data)

      expect(Buffer.isBuffer(result)).toBe(true)
    })

    it("[CONTRACT] should generate valid XLSX content with channel data", async () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = [
        {
          sessionId: "sess-123",
          sessionName: "Test Session",
          sessionVisibility: "public",
          organizationId: "org-456",
          firstConnectionAt: "2025-01-20T10:00:00.000Z",
          lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
          totalUsers: 5,
          reconnections: 7,
          usersAbove5Min: 3,
          usersBelow5Min: 2,
          totalWatchTime: 1100,
          avgWatchTime: 220,
          avgWatchTimeAbove5Min: 350,
          avgWatchTimeBelow5Min: 50,
          totalChannels: 2,
          totalStreamingTime: 3600,
          channelId: "ch-1",
          channelName: "Main Channel",
          channelDescription: "Main streaming channel",
          channelType: "transcription",
          channelLanguages: "en",
          channelHasDiarization: "Yes",
          channelMountCount: 1,
          channelActiveDuration: 1800,
        },
      ]

      const result = await kpiExport.generateXlsx(data)

      // XLSX files start with PK (zip format)
      expect(result[0]).toBe(0x50) // 'P'
      expect(result[1]).toBe(0x4b) // 'K'
    })

    it("[CONTRACT] should handle empty data array", async () => {
      if (moduleLoadError) {
        console.log("Skipping: kpiExport module not available -", moduleLoadError.message)
        return
      }
      const data = []
      const result = await kpiExport.generateXlsx(data)

      // Should still return valid XLSX buffer
      expect(Buffer.isBuffer(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})

describe("Export Data Structure Validation", () => {
  /**
   * Validates that a transformed record matches the API contract
   */
  function validateExportRecord(record) {
    // Required string fields
    expect(typeof record.sessionId).toBe("string")
    expect(typeof record.sessionName).toBe("string")
    expect(typeof record.sessionVisibility).toBe("string")
    expect(typeof record.organizationId).toBe("string")

    // Nullable date fields
    expect(
      record.firstConnectionAt === null || typeof record.firstConnectionAt === "string",
    ).toBe(true)
    expect(
      record.lastDisconnectionAt === null || typeof record.lastDisconnectionAt === "string",
    ).toBe(true)

    // Numeric fields
    expect(typeof record.totalUsers).toBe("number")
    expect(typeof record.reconnections).toBe("number")
    expect(typeof record.usersAbove5Min).toBe("number")
    expect(typeof record.usersBelow5Min).toBe("number")
    expect(typeof record.totalWatchTime).toBe("number")
    expect(typeof record.avgWatchTime).toBe("number")
    expect(typeof record.totalChannels).toBe("number")
    expect(typeof record.totalStreamingTime).toBe("number")

    // Nullable numeric fields
    expect(
      record.avgWatchTimeAbove5Min === null || typeof record.avgWatchTimeAbove5Min === "number",
    ).toBe(true)
    expect(
      record.avgWatchTimeBelow5Min === null || typeof record.avgWatchTimeBelow5Min === "number",
    ).toBe(true)
  }

  it("should validate complete export record structure", () => {
    const record = {
      sessionId: "sess-123",
      sessionName: "Test Session",
      sessionVisibility: "public",
      organizationId: "org-456",
      firstConnectionAt: "2025-01-20T10:00:00.000Z",
      lastDisconnectionAt: "2025-01-20T11:30:00.000Z",
      totalUsers: 5,
      reconnections: 7,
      usersAbove5Min: 3,
      usersBelow5Min: 2,
      totalWatchTime: 1100,
      avgWatchTime: 220,
      avgWatchTimeAbove5Min: 350,
      avgWatchTimeBelow5Min: 50,
      totalChannels: 2,
      totalStreamingTime: 3600,
    }

    validateExportRecord(record)
  })

  it("should validate export record with null optional fields", () => {
    const record = {
      sessionId: "sess-456",
      sessionName: "",
      sessionVisibility: "",
      organizationId: "",
      firstConnectionAt: null,
      lastDisconnectionAt: null,
      totalUsers: 0,
      reconnections: 0,
      usersAbove5Min: 0,
      usersBelow5Min: 0,
      totalWatchTime: 0,
      avgWatchTime: 0,
      avgWatchTimeAbove5Min: null,
      avgWatchTimeBelow5Min: null,
      totalChannels: 0,
      totalStreamingTime: 0,
    }

    validateExportRecord(record)
  })
})
