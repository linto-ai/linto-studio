const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:controllers:activity:kpiExport",
)
const ExcelJS = require("exceljs")

/**
 * Get base session data (without channel-specific fields)
 */
function getBaseSessionData(session) {
  return {
    sessionId: session.sessionId,
    sessionName: session.session?.name || "",
    sessionVisibility: session.session?.visibility || "",
    organizationId: session.organizationId || "",
    firstConnectionAt: session.firstConnectionAt || null,
    lastDisconnectionAt: session.lastDisconnectionAt || null,
    totalUsers: session.userCount?.total || 0,
    reconnections: session.userCount?.reconnections || 0,
    usersAbove5Min: session.userCount?.above5Min || 0,
    usersBelow5Min: session.userCount?.below5Min || 0,
    totalWatchTime: session.watchTime?.total || 0,
    avgWatchTime: session.watchTime?.average || 0,
    avgWatchTimeAbove5Min: session.watchTime?.avgAbove5Min || null,
    avgWatchTimeBelow5Min: session.watchTime?.avgUnder5Min || null,
    totalChannels: session.streaming?.totalChannels || 0,
    totalStreamingTime: session.streaming?.totalStreamingTime || 0,
  }
}

/**
 * Format languages array to readable string
 */
function formatLanguages(languages) {
  if (!languages || !Array.isArray(languages)) return ""
  return languages.map((lang) => lang.candidate || lang).join(", ")
}

/**
 * Transform raw KPI session data to export format (one row per channel)
 * If session has no channels, returns one row with empty channel fields
 */
function transformSessionData(session) {
  const baseData = getBaseSessionData(session)
  const channels = session.channels || []

  if (channels.length === 0) {
    return [
      {
        ...baseData,
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
  }

  return channels.map((channel) => ({
    ...baseData,
    channelId: channel.channelId || "",
    channelName: channel.name || "",
    channelDescription: channel.description || "",
    channelType: channel.type || "",
    channelLanguages: formatLanguages(channel.languages),
    channelHasDiarization: channel.hasDiarization ? "Yes" : "No",
    channelMountCount: Array.isArray(channel.mountedAt) ? channel.mountedAt.length : 0,
    channelActiveDuration: channel.activeDuration || 0,
  }))
}

/**
 * Generate CSV content from session data
 */
function generateCsv(rows) {
  const headers = [
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

  const csvRows = rows.map((row) =>
    headers
      .map((h) => {
        const val = row[h]
        if (val === null || val === undefined) return ""
        if (typeof val === "string" && (val.includes(",") || val.includes(";") || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`
        }
        return val
      })
      .join(","),
  )

  // UTF-8 BOM for Excel compatibility
  return "\ufeff" + headers.join(",") + "\n" + csvRows.join("\n")
}

/**
 * Generate Excel workbook from session data
 */
async function generateXlsx(rows) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("KPI Sessions")

  worksheet.columns = [
    { header: "Session ID", key: "sessionId", width: 36 },
    { header: "Session Name", key: "sessionName", width: 30 },
    { header: "Visibility", key: "sessionVisibility", width: 15 },
    { header: "Organization ID", key: "organizationId", width: 26 },
    { header: "First Connection", key: "firstConnectionAt", width: 22 },
    { header: "Last Disconnection", key: "lastDisconnectionAt", width: 22 },
    { header: "Total Users", key: "totalUsers", width: 12 },
    { header: "Reconnections", key: "reconnections", width: 14 },
    { header: "Users > 5min", key: "usersAbove5Min", width: 14 },
    { header: "Users < 5min", key: "usersBelow5Min", width: 14 },
    { header: "Total Watch Time (s)", key: "totalWatchTime", width: 20 },
    { header: "Avg Watch Time (s)", key: "avgWatchTime", width: 18 },
    { header: "Avg > 5min (s)", key: "avgWatchTimeAbove5Min", width: 14 },
    { header: "Avg < 5min (s)", key: "avgWatchTimeBelow5Min", width: 14 },
    { header: "Total Channels", key: "totalChannels", width: 14 },
    { header: "Streaming Time (s)", key: "totalStreamingTime", width: 18 },
    { header: "Channel ID", key: "channelId", width: 12 },
    { header: "Channel Name", key: "channelName", width: 20 },
    { header: "Channel Description", key: "channelDescription", width: 25 },
    { header: "Channel Type", key: "channelType", width: 15 },
    { header: "Channel Languages", key: "channelLanguages", width: 15 },
    { header: "Has Diarization", key: "channelHasDiarization", width: 15 },
    { header: "Mount Count", key: "channelMountCount", width: 12 },
    { header: "Channel Duration (s)", key: "channelActiveDuration", width: 18 },
  ]

  // Bold header row
  worksheet.getRow(1).font = { bold: true }

  rows.forEach((row) => worksheet.addRow(row))

  return workbook.xlsx.writeBuffer()
}

module.exports = {
  transformSessionData,
  generateCsv,
  generateXlsx,
}
