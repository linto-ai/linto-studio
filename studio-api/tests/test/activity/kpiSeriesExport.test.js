/**
 * Unit tests for KPI Series Export
 * Tests the flattening of series data points and CSV generation
 */

const kpiSeriesExport = require(
  `${process.cwd()}/components/WebServer/controllers/activity/kpiSeriesExport`,
)

const SERIES_POINT = {
  date: "2026-01-07",
  organizationId: "507f1f77bcf86cd799439011",
  userId: "607f1f77bcf86cd799439022",
  session: {
    totalConnections: 15,
    watchTime: 3600,
    totalSessions: 5,
    totalStreamingTime: 1200,
  },
  llm: { generated: 5, tokens: 1200 },
  transcription: { generated: 8, duration: 7200 },
}

describe("KPI Series Export", () => {
  describe("transformSeriesPoint", () => {
    it("should flatten a series data point to an export row", () => {
      const row = kpiSeriesExport.transformSeriesPoint(SERIES_POINT)

      expect(row).toEqual({
        date: "2026-01-07",
        organizationId: "507f1f77bcf86cd799439011",
        userId: "607f1f77bcf86cd799439022",
        totalSessions: 5,
        totalConnections: 15,
        watchTime: 3600,
        totalStreamingTime: 1200,
        llmGenerated: 5,
        llmTokens: 1200,
        transcriptionGenerated: 8,
        transcriptionDuration: 7200,
      })
    })

    it("should default missing metrics and filters to zero or empty", () => {
      const row = kpiSeriesExport.transformSeriesPoint({ date: "2026-01" })

      expect(row).toEqual({
        date: "2026-01",
        organizationId: "",
        userId: "",
        totalSessions: 0,
        totalConnections: 0,
        watchTime: 0,
        totalStreamingTime: 0,
        llmGenerated: 0,
        llmTokens: 0,
        transcriptionGenerated: 0,
        transcriptionDuration: 0,
      })
    })
  })

  describe("generateCsv", () => {
    it("should produce a header row and one line per data point", () => {
      const rows = [kpiSeriesExport.transformSeriesPoint(SERIES_POINT)]
      const csv = kpiSeriesExport.generateCsv(rows)

      const lines = csv.split("\n")
      expect(lines).toHaveLength(2)
      expect(lines[0]).toContain("date")
      expect(lines[0]).toContain("userId")
      expect(lines[0]).toContain("organizationId")
      expect(lines[1]).toContain("2026-01-07")
      expect(lines[1]).toContain("607f1f77bcf86cd799439022")
    })
  })

  describe("generateXlsx", () => {
    it("should produce a non-empty workbook buffer", async () => {
      const rows = [kpiSeriesExport.transformSeriesPoint(SERIES_POINT)]
      const buffer = await kpiSeriesExport.generateXlsx(rows)

      expect(buffer.byteLength).toBeGreaterThan(0)
    })
  })
})
