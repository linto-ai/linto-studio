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

/**
 * Compute date intervals for a custom date range based on granularity
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @param {string} granularity - "daily", "monthly", or "yearly"
 * @returns {Array} Array of intervals with startDate, endDate, and label
 */
function computeIntervalsForRange(start, end, granularity) {
  const intervals = []

  if (granularity === "daily") {
    const current = new Date(start)
    current.setHours(0, 0, 0, 0)

    while (current <= end) {
      const dayStart = new Date(current)
      const dayEnd = new Date(current)
      dayEnd.setHours(23, 59, 59, 999)

      intervals.push({
        startDate: dayStart.toISOString(),
        endDate: dayEnd.toISOString(),
        label: dayStart.toISOString().split("T")[0],
      })

      current.setDate(current.getDate() + 1)
    }
  } else if (granularity === "monthly") {
    const current = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1),
    )

    while (current <= end) {
      const monthStart = new Date(current)
      const monthEnd = new Date(
        Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 1) - 1,
      )

      const label = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, "0")}`

      intervals.push({
        startDate: monthStart.toISOString(),
        endDate: monthEnd.toISOString(),
        label: label,
      })

      current.setUTCMonth(current.getUTCMonth() + 1)
    }
  } else if (granularity === "yearly") {
    const currentYear = start.getUTCFullYear()
    const endYear = end.getUTCFullYear()

    for (let year = currentYear; year <= endYear; year++) {
      const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
      const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

      intervals.push({
        startDate: yearStart.toISOString(),
        endDate: yearEnd.toISOString(),
        label: String(year),
      })
    }
  }

  return intervals
}

/**
 * Get default start date based on granularity when only endDate is provided
 * @param {string} granularity - "daily", "monthly", or "yearly"
 * @returns {Date} Default start date
 */
function getDefaultStartDate(granularity) {
  const now = new Date()
  switch (granularity) {
    case "daily":
      const dailyStart = new Date(now)
      dailyStart.setDate(dailyStart.getDate() - 6)
      return dailyStart
    case "monthly":
      const monthlyStart = new Date(now)
      monthlyStart.setMonth(monthlyStart.getMonth() - 11)
      return monthlyStart
    case "yearly":
      const yearlyStart = new Date(now)
      yearlyStart.setFullYear(yearlyStart.getFullYear() - 4)
      return yearlyStart
    default:
      return now
  }
}

/**
 * Unified function to get KPI data for a date range with specified granularity
 * Maintains backward compatibility: no dates = existing behavior (last N periods)
 * @param {string|null} organizationId - Optional organization filter
 * @param {string|null} startDate - Optional custom start date (ISO 8601)
 * @param {string|null} endDate - Optional custom end date (ISO 8601)
 * @param {string} granularity - "daily", "monthly", or "yearly"
 * @returns {Array} Array of KPI data points
 */
async function getKpiByDateRange(
  organizationId,
  startDate,
  endDate,
  granularity = "daily",
) {
  // If no custom dates provided, use default behavior
  if (!startDate && !endDate) {
    switch (granularity) {
      case "daily":
        return getLast7DaysKpi(organizationId)
      case "monthly":
        return getLast12MonthsKpi(organizationId)
      case "yearly":
        return getLastYearsKpi(organizationId)
      default:
        return getLast7DaysKpi(organizationId)
    }
  }

  // Parse dates, using defaults if only one is provided
  const end = endDate ? new Date(endDate) : new Date()
  const start = startDate
    ? new Date(startDate)
    : getDefaultStartDate(granularity)

  // Compute intervals based on granularity
  const intervals = computeIntervalsForRange(start, end, granularity)

  // Generate KPI for each interval
  const results = []
  for (const interval of intervals) {
    const kpi = await generateKpi(
      organizationId,
      interval.startDate,
      interval.endDate,
    )
    results.push({ date: interval.label, ...kpi })
  }

  return results
}

module.exports = {
  getLast7DaysKpi,
  getLast12MonthsKpi,
  getLastYearsKpi,
  generateKpi,
  getKpiByDateRange,
}
