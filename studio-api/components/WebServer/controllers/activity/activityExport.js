const tableExport = require("./tableExport")

const ACTIVITY_COLUMNS = [
  { key: "timestamp", header: "Timestamp", width: 24 },
  { key: "source", header: "Source", width: 12 },
  { key: "scope", header: "Scope", width: 14 },
  { key: "action", header: "Event", width: 22 },
  { key: "details", header: "Details", width: 40 },
  { key: "message", header: "Message", width: 30 },
  { key: "userId", header: "User ID", width: 26 },
  { key: "userEmail", header: "User Email", width: 28 },
  { key: "userName", header: "User Name", width: 24 },
  { key: "userPlatformRole", header: "Platform Role", width: 16 },
  { key: "organizationId", header: "Organization ID", width: 26 },
  { key: "organizationName", header: "Organization", width: 24 },
  { key: "organizationRole", header: "Organization Role", width: 18 },
  { key: "httpMethod", header: "HTTP Method", width: 12 },
  { key: "httpStatus", header: "HTTP Status", width: 12 },
  { key: "httpUrl", header: "URL", width: 40 },
  { key: "ip", header: "IP", width: 16 },
]

/**
 * Flatten a raw activity log document into a single export row.
 */
function transformActivityLog(log) {
  const user = log.user || {}
  const organization = log.organization || {}
  const http = log.http || {}
  const info = user.info || {}
  const userName = [info.firstname, info.lastname].filter(Boolean).join(" ")

  // SaaS/billing rows carry a free-form `saas` payload; flatten it to a compact
  // key=value string so the export keeps the detail without per-action columns.
  const details = log.saas
    ? Object.entries(log.saas)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join(", ")
    : ""

  return {
    timestamp: log.timestamp || "",
    source: log.source || "",
    scope: log.scope || "",
    action: log.action || "",
    details,
    message: log.message || "",
    userId: user.id || "",
    userEmail: info.email || "",
    userName,
    userPlatformRole: user.role?.name || user.role?.value || "",
    organizationId: organization.id || "",
    organizationName: organization.info?.name || "",
    organizationRole: organization.role?.name || organization.role?.value || "",
    httpMethod: http.method || "",
    httpStatus: http.status ?? "",
    httpUrl: http.url || "",
    ip: http.ip || "",
  }
}

function generateCsv(rows) {
  return tableExport.generateCsv(rows, ACTIVITY_COLUMNS)
}

function generateXlsx(rows) {
  return tableExport.generateXlsx(rows, ACTIVITY_COLUMNS, "Activity")
}

module.exports = {
  ACTIVITY_COLUMNS,
  transformActivityLog,
  generateCsv,
  generateXlsx,
}
