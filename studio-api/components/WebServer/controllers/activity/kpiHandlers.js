const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:controllers:activity:kpiHandlers",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const kpiHandlers = {
  session: model.activityLog.getKpiSession.bind(model.activityLog),
  transcription: model.activityLog.getKpiTranscription.bind(model.activityLog),
  llm: model.activityLog.getKpiLlm.bind(model.activityLog),
}

async function fillEmptyKpi(activityKpi) {
  if (activityKpi.session == null) {
    activityKpi.session = { totalConnections: 0, watchTime: 0 }
  }
  if (activityKpi.llm == null) {
    activityKpi.llm = { generated: 0, tokens: 0 }
  }
  if (activityKpi.transcription == null) {
    activityKpi.transcription = { generated: 0, duration: 0 }
  }
  return activityKpi
}

async function generateKpi(organizationId, startDate, endDate) {
  let activityKpi = {
    organizationId,
    session: (await kpiHandlers.session(organizationId, startDate, endDate))[0],
    llm: (await kpiHandlers.llm(organizationId, startDate, endDate))[0],
    transcription: (
      await kpiHandlers.transcription(organizationId, startDate, endDate)
    )[0],
  }

  activityKpi = fillEmptyKpi(activityKpi)
  return activityKpi
}

function getDayRange(dayOffset) {
  // const start = new Date("2025-11-20T17:17:51.671Z") // TODO: remove placeholder date for testing
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - dayOffset)

  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    date: start.toISOString().split("T")[0],
  }
}

function getMonthRange(monthOffset) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const start = new Date(Date.UTC(year, month - monthOffset, 1, 0, 0, 0, 0))

  const end = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1, 0, 0, 0, 0) -
      1,
  )
  const label = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}`

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    date: label,
  }
}

async function getLast7DaysKpi(organizationId) {
  const results = []

  for (let i = 6; i >= 0; i--) {
    const { startDate, endDate, date } = getDayRange(i)
    const kpi = await generateKpi(organizationId, startDate, endDate)
    results.push({ date: date, ...kpi })
  }
  return results
}

async function getLast12MonthsKpi(organizationId) {
  const results = []

  for (let i = 11; i >= 0; i--) {
    const { startDate, endDate, date } = getMonthRange(i)
    const kpi = await generateKpi(organizationId, startDate, endDate)
    results.push({ date: date, ...kpi })
  }

  return results
}

function getYearRange(yearOffset) {
  const now = new Date()
  const year = now.getUTCFullYear() - yearOffset
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    date: String(year),
  }
}

async function getLastYearsKpi(organizationId, years = 5) {
  const results = []

  for (let i = years - 1; i >= 0; i--) {
    const { startDate, endDate, date } = getYearRange(i)
    const kpi = await generateKpi(organizationId, startDate, endDate)
    results.push({ date: date, ...kpi })
  }

  return results
}

module.exports = {
  getLast7DaysKpi,
  getLast12MonthsKpi,
  getLastYearsKpi,
  generateKpi,
}
