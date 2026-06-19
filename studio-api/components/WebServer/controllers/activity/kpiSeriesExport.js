const tableExport = require("./tableExport")

const COLUMNS = [
  { key: "date", header: "Date", width: 14 },
  { key: "organizationId", header: "Organization ID", width: 26 },
  { key: "userId", header: "User ID", width: 26 },
  { key: "totalSessions", header: "Sessions", width: 12 },
  { key: "totalConnections", header: "Connections", width: 14 },
  { key: "watchTime", header: "Watch Time (s)", width: 16 },
  { key: "totalStreamingTime", header: "Streaming Time (s)", width: 18 },
  { key: "llmGenerated", header: "LLM Generated", width: 14 },
  { key: "llmTokens", header: "LLM Tokens", width: 14 },
  { key: "transcriptionGenerated", header: "Transcriptions", width: 14 },
  {
    key: "transcriptionDuration",
    header: "Transcription Duration (s)",
    width: 24,
  },
]

function transformSeriesPoint(point) {
  return {
    date: point.date,
    organizationId: point.organizationId || "",
    userId: point.userId || "",
    totalSessions: point.session?.totalSessions || 0,
    totalConnections: point.session?.totalConnections || 0,
    watchTime: point.session?.watchTime || 0,
    totalStreamingTime: point.session?.totalStreamingTime || 0,
    llmGenerated: point.llm?.generated || 0,
    llmTokens: point.llm?.tokens || 0,
    transcriptionGenerated: point.transcription?.generated || 0,
    transcriptionDuration: point.transcription?.duration || 0,
  }
}

function generateCsv(rows) {
  return tableExport.generateCsv(rows, COLUMNS)
}

function generateXlsx(rows) {
  return tableExport.generateXlsx(rows, COLUMNS, "KPI Series")
}

module.exports = {
  transformSeriesPoint,
  generateCsv,
  generateXlsx,
}
