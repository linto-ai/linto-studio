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

  describe("getKpiByDateRange (Sprint 2 feature)", () => {
    beforeEach(() => {
      mockKpiSession.mockReset()
      mockKpiTranscription.mockReset()
      mockKpiLlm.mockReset()

      mockKpiSession.mockResolvedValue([{ totalConnections: 5, watchTime: 100 }])
      mockKpiTranscription.mockResolvedValue([{ generated: 3, duration: 200 }])
      mockKpiLlm.mockResolvedValue([{ generated: 2, tokens: 500 }])
    })

    it("should use getLast7DaysKpi when no dates provided and granularity is daily", async () => {
      const result = await kpiHandlers.getKpiByDateRange(null, null, null, "daily")

      expect(result).toHaveLength(7)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it("should use getLast12MonthsKpi when no dates provided and granularity is monthly", async () => {
      const result = await kpiHandlers.getKpiByDateRange(null, null, null, "monthly")

      expect(result).toHaveLength(12)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}$/)
      })
    })

    it("should use getLastYearsKpi when no dates provided and granularity is yearly", async () => {
      const result = await kpiHandlers.getKpiByDateRange(null, null, null, "yearly")

      expect(result).toHaveLength(5)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}$/)
      })
    })

    it("should default to daily granularity when not specified", async () => {
      const result = await kpiHandlers.getKpiByDateRange(null, null, null)

      expect(result).toHaveLength(7)
    })

    it("should compute custom daily intervals when dates provided", async () => {
      const result = await kpiHandlers.getKpiByDateRange(
        null,
        "2026-01-01",
        "2026-01-03",
        "daily",
      )

      // Should return 3 consecutive days
      expect(result).toHaveLength(3)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
      // Verify dates are consecutive
      const dates = result.map(e => e.date)
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i-1])
        const curr = new Date(dates[i])
        expect(curr.getTime() - prev.getTime()).toBe(24 * 60 * 60 * 1000)
      }
    })

    it("should compute custom monthly intervals when dates provided", async () => {
      const result = await kpiHandlers.getKpiByDateRange(
        null,
        "2025-01-01",
        "2025-03-31",
        "monthly",
      )

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe("2025-01")
      expect(result[1].date).toBe("2025-02")
      expect(result[2].date).toBe("2025-03")
    })

    it("should compute custom yearly intervals when dates provided", async () => {
      const result = await kpiHandlers.getKpiByDateRange(
        null,
        "2023-01-01",
        "2025-12-31",
        "yearly",
      )

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe("2023")
      expect(result[1].date).toBe("2024")
      expect(result[2].date).toBe("2025")
    })

    it("should pass organizationId filter to generateKpi", async () => {
      const orgId = "test-org-456"
      await kpiHandlers.getKpiByDateRange(orgId, "2026-01-01", "2026-01-01", "daily")

      // Should have been called with organizationId
      expect(mockKpiSession.mock.calls[0][0]).toBe(orgId)
    })

    it("should use default start date when only endDate provided (daily)", async () => {
      const result = await kpiHandlers.getKpiByDateRange(
        null,
        null,
        "2026-01-07",
        "daily",
      )

      // Should compute 7 days back by default for daily
      expect(result.length).toBeGreaterThan(0)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it("should use current date as end when only startDate provided", async () => {
      // Use a date from last month for predictable behavior
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      lastMonth.setDate(1)
      const startDateStr = lastMonth.toISOString().split("T")[0]

      const result = await kpiHandlers.getKpiByDateRange(
        null,
        startDateStr,
        null,
        "daily",
      )

      // Should have entries from startDate to today
      expect(result.length).toBeGreaterThan(0)
      // First date should be close to startDate (may vary by timezone)
      result.forEach((entry) => {
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it("should include proper KPI structure in each data point", async () => {
      const result = await kpiHandlers.getKpiByDateRange(
        null,
        "2026-01-01",
        "2026-01-01",
        "daily",
      )

      expect(result).toHaveLength(1)
      const entry = result[0]

      expect(entry).toHaveProperty("date")
      expect(entry).toHaveProperty("session")
      expect(entry).toHaveProperty("llm")
      expect(entry).toHaveProperty("transcription")

      expect(entry.session).toHaveProperty("totalConnections")
      expect(entry.session).toHaveProperty("watchTime")
      expect(entry.llm).toHaveProperty("generated")
      expect(entry.llm).toHaveProperty("tokens")
      expect(entry.transcription).toHaveProperty("generated")
      expect(entry.transcription).toHaveProperty("duration")
    })
  })
})
