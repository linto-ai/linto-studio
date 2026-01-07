/**
 * Unit tests for KPI Handlers
 * Tests the date range calculation functions and KPI response structure
 */

// Mock the mongodb models before requiring the module
const mockKpiSession = jest.fn()
const mockKpiTranscription = jest.fn()
const mockKpiLlm = jest.fn()

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  activityLog: {
    getKpiSession: mockKpiSession,
    getKpiTranscription: mockKpiTranscription,
    getKpiLlm: mockKpiLlm,
  },
}))

const kpiHandlers = require(`${process.cwd()}/components/WebServer/controllers/activity/kpiHandlers`)

describe("KPI Handlers - Date Range Functions", () => {
  describe("getLast7DaysKpi", () => {
    beforeEach(() => {
      // Reset mocks
      mockKpiSession.mockReset()
      mockKpiTranscription.mockReset()
      mockKpiLlm.mockReset()

      // Setup default mock responses
      mockKpiSession.mockResolvedValue([{ totalConnections: 5, watchTime: 100 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 3, duration: 200 }])
      mockKpiLlm.mockResolvedValue([{ generated: 2, tokens: 500 }])
    })

    it("should return 7 data points for daily step", async () => {
      const result = await kpiHandlers.getLast7DaysKpi()

      expect(result).toHaveLength(7)
    })

    it("should return dates in YYYY-MM-DD format for daily step", async () => {
      const result = await kpiHandlers.getLast7DaysKpi()

      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it("should include session, llm, and transcription objects in each entry", async () => {
      const result = await kpiHandlers.getLast7DaysKpi()

      result.forEach((entry) => {
        expect(entry).toHaveProperty("date")
        expect(entry).toHaveProperty("session")
        expect(entry).toHaveProperty("llm")
        expect(entry).toHaveProperty("transcription")

        // Verify session structure
        expect(entry.session).toHaveProperty("totalConnections")
        expect(entry.session).toHaveProperty("watchTime")

        // Verify llm structure
        expect(entry.llm).toHaveProperty("generated")
        expect(entry.llm).toHaveProperty("tokens")

        // Verify transcription structure
        expect(entry.transcription).toHaveProperty("generated")
        expect(entry.transcription).toHaveProperty("duration")
      })
    })

    it("should pass organizationId to database queries", async () => {
      const orgId = "test-org-123"
      await kpiHandlers.getLast7DaysKpi(orgId)

      // Each day makes 3 calls (session, transcription, llm)
      expect(mockKpiSession).toHaveBeenCalledTimes(7)
      expect(mockKpiTranscription).toHaveBeenCalledTimes(7)
      expect(mockKpiLlm).toHaveBeenCalledTimes(7)

      // Check that organizationId was passed
      expect(mockKpiSession.mock.calls[0][0]).toBe(orgId)
    })
  })

  describe("getLast12MonthsKpi", () => {
    beforeEach(() => {
      mockKpiSession.mockReset()
      mockKpiTranscription.mockReset()
      mockKpiLlm.mockReset()

      mockKpiSession.mockResolvedValue([{ totalConnections: 10, watchTime: 500 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 5, duration: 1000 }])
      mockKpiLlm.mockResolvedValue([{ generated: 3, tokens: 1500 }])
    })

    it("should return 12 data points for monthly step", async () => {
      const result = await kpiHandlers.getLast12MonthsKpi()

      expect(result).toHaveLength(12)
    })

    it("should return dates in YYYY-MM format for monthly step", async () => {
      const result = await kpiHandlers.getLast12MonthsKpi()

      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}$/)
      })
    })

    it("should include all required KPI fields for each month", async () => {
      const result = await kpiHandlers.getLast12MonthsKpi()

      result.forEach((entry) => {
        expect(entry).toHaveProperty("date")
        expect(entry).toHaveProperty("session")
        expect(entry).toHaveProperty("llm")
        expect(entry).toHaveProperty("transcription")
      })
    })
  })

  describe("getLastYearsKpi", () => {
    beforeEach(() => {
      mockKpiSession.mockReset()
      mockKpiTranscription.mockReset()
      mockKpiLlm.mockReset()

      mockKpiSession.mockResolvedValue([{ totalConnections: 100, watchTime: 5000 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 50, duration: 10000 }])
      mockKpiLlm.mockResolvedValue([{ generated: 30, tokens: 15000 }])
    })

    it("should return 5 data points for yearly step by default", async () => {
      const result = await kpiHandlers.getLastYearsKpi()

      expect(result).toHaveLength(5)
    })

    it("should return dates in YYYY format for yearly step", async () => {
      const result = await kpiHandlers.getLastYearsKpi()

      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}$/)
      })
    })

    it("should include all required KPI fields for each year", async () => {
      const result = await kpiHandlers.getLastYearsKpi()

      result.forEach((entry) => {
        expect(entry).toHaveProperty("date")
        expect(entry).toHaveProperty("session")
        expect(entry).toHaveProperty("llm")
        expect(entry).toHaveProperty("transcription")
      })
    })

    it("should allow custom number of years", async () => {
      const result = await kpiHandlers.getLastYearsKpi(null, 3)

      expect(result).toHaveLength(3)
    })
  })

  describe("generateKpi", () => {
    beforeEach(() => {
      mockKpiSession.mockReset()
      mockKpiTranscription.mockReset()
      mockKpiLlm.mockReset()
    })

    it("should fill empty KPI values with zeros when no data exists", async () => {
      mockKpiSession.mockResolvedValue([null])
      mockKpiTranscription.mockResolvedValue([null])
      mockKpiLlm.mockResolvedValue([null])

      const result = await kpiHandlers.generateKpi("org-123", "2026-01-01", "2026-01-07")

      expect(result.session).toEqual({ totalConnections: 0, watchTime: 0 })
      expect(result.llm).toEqual({ generated: 0, tokens: 0 })
      expect(result.transcription).toEqual({ generated: 0, duration: 0 })
    })

    it("should return actual values when data exists", async () => {
      mockKpiSession.mockResolvedValue([{ totalConnections: 15, watchTime: 3600 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 8, duration: 7200 }])
      mockKpiLlm.mockResolvedValue([{ generated: 5, tokens: 1200 }])

      const result = await kpiHandlers.generateKpi("org-123", "2026-01-01", "2026-01-07")

      expect(result.session.totalConnections).toBe(15)
      expect(result.session.watchTime).toBe(3600)
      expect(result.llm.generated).toBe(5)
      expect(result.llm.tokens).toBe(1200)
      expect(result.transcription.generated).toBe(8)
      expect(result.transcription.duration).toBe(7200)
    })

    it("should include organizationId in response", async () => {
      mockKpiSession.mockResolvedValue([{ totalConnections: 1, watchTime: 100 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 1, duration: 100 }])
      mockKpiLlm.mockResolvedValue([{ generated: 1, tokens: 100 }])

      const result = await kpiHandlers.generateKpi("org-123", "2026-01-01", "2026-01-07")

      expect(result.organizationId).toBe("org-123")
    })
  })
})
