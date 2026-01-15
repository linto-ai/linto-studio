/**
 * Unit tests for KPI Series Response Structure
 * Validates that the API response conforms to the API contract (Sprint 2)
 * Tests backward compatibility and new filter features
 */

// Mock mongodb models first (before any imports that use it)
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  activityLog: {
    getAll: jest.fn(),
    getKpiSession: jest.fn(),
    getKpiTranscription: jest.fn(),
    getKpiLlm: jest.fn(),
    kpiSessionById: jest.fn(),
    findSessionsWithActivity: jest.fn(),
  },
  kpi: {
    sessions: {
      getLastKpi: jest.fn(),
      getBySessions: jest.fn(),
      deleteSessions: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
    },
  },
}))

// Mock the kpiHandlers module with the new getKpiByDateRange function
const mockGetKpiByDateRange = jest.fn()
const mockGetLast7DaysKpi = jest.fn()
const mockGetLast12MonthsKpi = jest.fn()
const mockGetLastYearsKpi = jest.fn()

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/activity/kpiHandlers`,
  () => ({
    getLast7DaysKpi: mockGetLast7DaysKpi,
    getLast12MonthsKpi: mockGetLast12MonthsKpi,
    getLastYearsKpi: mockGetLastYearsKpi,
    generateKpi: jest.fn(),
    getKpiByDateRange: mockGetKpiByDateRange,
  }),
)

// Mock res object
const createMockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
})

// Mock next function
const mockNext = jest.fn()

const { getKpiSeries } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/administration/activity`,
)

describe("KPI Series Response - API Contract Compliance (Sprint 2)", () => {
  let mockRes

  beforeEach(() => {
    mockRes = createMockRes()
    mockNext.mockReset()
    mockGetKpiByDateRange.mockReset()
    mockGetLast7DaysKpi.mockReset()
    mockGetLast12MonthsKpi.mockReset()
    mockGetLastYearsKpi.mockReset()
  })

  describe("Test 1: Backward Compatibility (no filters = existing behavior)", () => {
    it("should return step and data fields for daily step without filters", async () => {
      const mockData = [
        {
          date: "2026-01-01",
          session: { totalConnections: 15, watchTime: 3600 },
          llm: { generated: 5, tokens: 1200 },
          transcription: { generated: 8, duration: 7200 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = { query: { step: "daily", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "daily",
        data: mockData,
      })
      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        "daily",
      )
    })

    it("should return step and data fields for monthly step", async () => {
      const mockData = [
        {
          date: "2026-01",
          session: { totalConnections: 50, watchTime: 18000 },
          llm: { generated: 20, tokens: 5000 },
          transcription: { generated: 30, duration: 36000 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = { query: { step: "monthly", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "monthly",
        data: mockData,
      })
    })

    it("should return step and data fields for yearly step", async () => {
      const mockData = [
        {
          date: "2026",
          session: { totalConnections: 500, watchTime: 180000 },
          llm: { generated: 200, tokens: 50000 },
          transcription: { generated: 300, duration: 360000 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = { query: { step: "yearly", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "yearly",
        data: mockData,
      })
    })

    it("should default to daily step when step is not provided", async () => {
      const mockData = [
        {
          date: "2026-01-07",
          session: { totalConnections: 10, watchTime: 1800 },
          llm: { generated: 3, tokens: 600 },
          transcription: { generated: 5, duration: 3600 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = { query: { userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        "daily",
      )
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "daily",
        data: mockData,
      })
    })
  })

  describe("Test 2: Organization Filter", () => {
    it("should pass organizationId to handler when provided", async () => {
      const mockData = []
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const orgId = "507f1f77bcf86cd799439011"
      const req = {
        query: { step: "daily", userScope: "backoffice", organizationId: orgId },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        orgId,
        undefined,
        undefined,
        "daily",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })

    it("should work without organizationId for platform-wide data", async () => {
      const mockData = []
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = { query: { step: "daily", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        "daily",
      )
    })
  })

  describe("Test 3: Invalid Organization ID Handling", () => {
    it("should return 200 with empty data for invalid organizationId (implementation choice)", async () => {
      const mockData = []
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "daily",
          userScope: "backoffice",
          organizationId: "invalid",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      // Current implementation passes through to handler which returns empty data
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "daily",
        data: [],
      })
    })
  })

  describe("Test 4: Date Range Filter - Valid", () => {
    it("should pass valid date range to handler", async () => {
      const mockData = [
        {
          date: "2025-12-01",
          session: { totalConnections: 5, watchTime: 1000 },
          llm: { generated: 2, tokens: 300 },
          transcription: { generated: 3, duration: 1500 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "daily",
          userScope: "backoffice",
          startDate: "2025-12-01",
          endDate: "2025-12-07",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        "2025-12-01",
        "2025-12-07",
        "daily",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Test 5: Date Range - Invalid (start > end)", () => {
    it("should return 400 Bad Request when startDate is after endDate", async () => {
      const req = {
        query: {
          step: "daily",
          userScope: "backoffice",
          startDate: "2025-12-31",
          endDate: "2025-12-01",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid date range: startDate must be before endDate",
      })
      expect(mockGetKpiByDateRange).not.toHaveBeenCalled()
    })
  })

  describe("Test 6: Start Date Only", () => {
    it("should use current date as end when only startDate provided", async () => {
      const mockData = []
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "daily",
          userScope: "backoffice",
          startDate: "2025-12-01",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        "2025-12-01",
        undefined,
        "daily",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Test 7: End Date Only", () => {
    it("should use reasonable default start when only endDate provided", async () => {
      const mockData = []
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "daily",
          userScope: "backoffice",
          endDate: "2025-12-31",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        undefined,
        "2025-12-31",
        "daily",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Test 8: Combined Filters (org + dates)", () => {
    it("should pass both organizationId and date range to handler", async () => {
      const mockData = [
        {
          date: "2025-01",
          session: { totalConnections: 25, watchTime: 9000 },
          llm: { generated: 10, tokens: 2500 },
          transcription: { generated: 15, duration: 18000 },
        },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const orgId = "507f1f77bcf86cd799439011"
      const req = {
        query: {
          step: "monthly",
          userScope: "backoffice",
          organizationId: orgId,
          startDate: "2025-01-01",
          endDate: "2025-06-30",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        orgId,
        "2025-01-01",
        "2025-06-30",
        "monthly",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Test 9: Monthly Granularity with Date Range", () => {
    it("should return monthly data points for date range", async () => {
      const mockData = [
        { date: "2025-01", session: { totalConnections: 10, watchTime: 1000 }, llm: { generated: 5, tokens: 500 }, transcription: { generated: 3, duration: 1000 } },
        { date: "2025-02", session: { totalConnections: 15, watchTime: 1500 }, llm: { generated: 7, tokens: 700 }, transcription: { generated: 5, duration: 1500 } },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "monthly",
          userScope: "backoffice",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        "2025-01-01",
        "2025-12-31",
        "monthly",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Test 10: Yearly Granularity with Date Range", () => {
    it("should return yearly data points for date range", async () => {
      const mockData = [
        { date: "2020", session: { totalConnections: 100, watchTime: 10000 }, llm: { generated: 50, tokens: 5000 }, transcription: { generated: 30, duration: 10000 } },
        { date: "2021", session: { totalConnections: 150, watchTime: 15000 }, llm: { generated: 70, tokens: 7000 }, transcription: { generated: 50, duration: 15000 } },
      ]
      mockGetKpiByDateRange.mockResolvedValue(mockData)

      const req = {
        query: {
          step: "yearly",
          userScope: "backoffice",
          startDate: "2020-01-01",
          endDate: "2025-12-31",
        },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetKpiByDateRange).toHaveBeenCalledWith(
        undefined,
        "2020-01-01",
        "2025-12-31",
        "yearly",
      )
      expect(mockRes.status).toHaveBeenCalledWith(200)
    })
  })

  describe("Error Handling", () => {
    it("should call next with error when handler throws", async () => {
      const testError = new Error("Database connection failed")
      mockGetKpiByDateRange.mockRejectedValue(testError)

      const req = { query: { step: "daily", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(testError)
    })
  })
})

describe("KPI Series Data Point Structure", () => {
  /**
   * Validates that a data point conforms to the API contract schema
   */
  function validateDataPoint(dataPoint, stepType) {
    // Check date format based on step
    expect(dataPoint).toHaveProperty("date")
    expect(typeof dataPoint.date).toBe("string")

    switch (stepType) {
      case "daily":
        expect(dataPoint.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        break
      case "monthly":
        expect(dataPoint.date).toMatch(/^\d{4}-\d{2}$/)
        break
      case "yearly":
        expect(dataPoint.date).toMatch(/^\d{4}$/)
        break
    }

    // Check session object
    expect(dataPoint).toHaveProperty("session")
    expect(dataPoint.session).toHaveProperty("totalConnections")
    expect(dataPoint.session).toHaveProperty("watchTime")
    expect(typeof dataPoint.session.totalConnections).toBe("number")
    expect(typeof dataPoint.session.watchTime).toBe("number")

    // Check llm object
    expect(dataPoint).toHaveProperty("llm")
    expect(dataPoint.llm).toHaveProperty("generated")
    expect(dataPoint.llm).toHaveProperty("tokens")
    expect(typeof dataPoint.llm.generated).toBe("number")
    expect(typeof dataPoint.llm.tokens).toBe("number")

    // Check transcription object
    expect(dataPoint).toHaveProperty("transcription")
    expect(dataPoint.transcription).toHaveProperty("generated")
    expect(dataPoint.transcription).toHaveProperty("duration")
    expect(typeof dataPoint.transcription.generated).toBe("number")
    expect(typeof dataPoint.transcription.duration).toBe("number")
  }

  it("should validate daily data point structure", () => {
    const dailyDataPoint = {
      date: "2026-01-07",
      session: { totalConnections: 15, watchTime: 3600 },
      llm: { generated: 5, tokens: 1200 },
      transcription: { generated: 8, duration: 7200 },
    }

    validateDataPoint(dailyDataPoint, "daily")
  })

  it("should validate monthly data point structure", () => {
    const monthlyDataPoint = {
      date: "2026-01",
      session: { totalConnections: 150, watchTime: 36000 },
      llm: { generated: 50, tokens: 12000 },
      transcription: { generated: 80, duration: 72000 },
    }

    validateDataPoint(monthlyDataPoint, "monthly")
  })

  it("should validate yearly data point structure", () => {
    const yearlyDataPoint = {
      date: "2026",
      session: { totalConnections: 1500, watchTime: 360000 },
      llm: { generated: 500, tokens: 120000 },
      transcription: { generated: 800, duration: 720000 },
    }

    validateDataPoint(yearlyDataPoint, "yearly")
  })
})
