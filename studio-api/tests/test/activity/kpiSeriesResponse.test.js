/**
 * Unit tests for KPI Series Response Structure
 * Validates that the API response conforms to the API contract
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

// Mock the kpiHandlers module
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

describe("KPI Series Response - API Contract Compliance", () => {
  let mockRes

  beforeEach(() => {
    mockRes = createMockRes()
    mockNext.mockReset()
    mockGetLast7DaysKpi.mockReset()
    mockGetLast12MonthsKpi.mockReset()
    mockGetLastYearsKpi.mockReset()
  })

  describe("Response Structure", () => {
    it("should return step and data fields for daily step", async () => {
      const mockData = [
        {
          date: "2026-01-01",
          session: { totalConnections: 15, watchTime: 3600 },
          llm: { generated: 5, tokens: 1200 },
          transcription: { generated: 8, duration: 7200 },
        },
      ]
      mockGetLast7DaysKpi.mockResolvedValue(mockData)

      const req = { query: { step: "daily", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "daily",
        data: mockData,
      })
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
      mockGetLast12MonthsKpi.mockResolvedValue(mockData)

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
      mockGetLastYearsKpi.mockResolvedValue(mockData)

      const req = { query: { step: "yearly", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "yearly",
        data: mockData,
      })
    })
  })

  describe("Default Behavior", () => {
    it("should default to daily step when step is not provided", async () => {
      const mockData = [
        {
          date: "2026-01-07",
          session: { totalConnections: 10, watchTime: 1800 },
          llm: { generated: 3, tokens: 600 },
          transcription: { generated: 5, duration: 3600 },
        },
      ]
      mockGetLast7DaysKpi.mockResolvedValue(mockData)

      const req = { query: { userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetLast7DaysKpi).toHaveBeenCalled()
      expect(mockRes.json).toHaveBeenCalledWith({
        step: "daily",
        data: mockData,
      })
    })

    it("should default to daily step when invalid step is provided", async () => {
      const mockData = []
      mockGetLast7DaysKpi.mockResolvedValue(mockData)

      const req = { query: { step: "invalid_step", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetLast7DaysKpi).toHaveBeenCalled()
    })
  })

  describe("Organization Filter", () => {
    it("should pass organizationId to handler when provided", async () => {
      const mockData = []
      mockGetLast7DaysKpi.mockResolvedValue(mockData)

      const orgId = "test-org-456"
      const req = {
        query: { step: "daily", userScope: "backoffice", organizationId: orgId },
      }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetLast7DaysKpi).toHaveBeenCalledWith(orgId)
    })

    it("should work without organizationId for platform-wide data", async () => {
      const mockData = []
      mockGetLast7DaysKpi.mockResolvedValue(mockData)

      const req = { query: { step: "daily", userScope: "backoffice" } }
      await getKpiSeries(req, mockRes, mockNext)

      expect(mockGetLast7DaysKpi).toHaveBeenCalledWith(undefined)
    })
  })

  describe("Error Handling", () => {
    it("should call next with error when handler throws", async () => {
      const testError = new Error("Database connection failed")
      mockGetLast7DaysKpi.mockRejectedValue(testError)

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
