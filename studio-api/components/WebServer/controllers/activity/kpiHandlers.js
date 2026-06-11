const debug = require("debug")(
  "linto:components:WebServer:controllers:activity:kpiHandlers",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const kpiHandlers = {
  session: model.activityLog.getKpiSession.bind(model.activityLog),
  transcription: model.activityLog.getKpiTranscription.bind(model.activityLog),
  llm: model.activityLog.getKpiLlm.bind(model.activityLog),
}

function fillEmptyKpi(activityKpi) {
  if (activityKpi.session == null) {
    activityKpi.session = {
      totalConnections: 0,
      watchTime: 0,
      totalSessions: 0,
      totalStreamingTime: 0,
    }
  }
  if (activityKpi.llm == null) {
    activityKpi.llm = { generated: 0, tokens: 0 }
  }
  if (activityKpi.transcription == null) {
    activityKpi.transcription = { generated: 0, duration: 0 }
  }
  return activityKpi
}

async function generateKpi(organizationId, startDate, endDate, userId) {
  const [session, llm, transcription] = await Promise.all([
    kpiHandlers.session(organizationId, startDate, endDate, userId),
    kpiHandlers.llm(organizationId, startDate, endDate, userId),
    kpiHandlers.transcription(organizationId, startDate, endDate, userId),
  ])

  return fillEmptyKpi({
    organizationId,
    userId,
    session: session[0],
    llm: llm[0],
    transcription: transcription[0],
  })
}

// Batch size caps Mongo pressure: each interval runs 3-4 queries, so a
// batch of 6 means at most ~24 concurrent operations per series request
const INTERVALS_BATCH_SIZE = 6

async function generateKpiSeries(intervals, organizationId, userId) {
  const results = []
  for (let i = 0; i < intervals.length; i += INTERVALS_BATCH_SIZE) {
    const batch = intervals.slice(i, i + INTERVALS_BATCH_SIZE)
    const kpis = await Promise.all(
      batch.map((interval) =>
        generateKpi(
          organizationId,
          interval.startDate,
          interval.endDate,
          userId,
        ),
      ),
    )
    kpis.forEach((kpi, j) => results.push({ date: batch[j].label, ...kpi }))
  }
  return results
}

function getDayRange(dayOffset) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - dayOffset)

  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    label: start.toISOString().split("T")[0],
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
    label,
  }
}

async function getLast7DaysKpi(organizationId, userId) {
  const intervals = []
  for (let i = 6; i >= 0; i--) intervals.push(getDayRange(i))
  return generateKpiSeries(intervals, organizationId, userId)
}

async function getLast12MonthsKpi(organizationId, userId) {
  const intervals = []
  for (let i = 11; i >= 0; i--) intervals.push(getMonthRange(i))
  return generateKpiSeries(intervals, organizationId, userId)
}

function getYearRange(yearOffset) {
  const now = new Date()
  const year = now.getUTCFullYear() - yearOffset
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    label: String(year),
  }
}

async function getLastYearsKpi(organizationId, userId, years = 5) {
  const intervals = []
  for (let i = years - 1; i >= 0; i--) intervals.push(getYearRange(i))
  return generateKpiSeries(intervals, organizationId, userId)
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
 * @param {Date} referenceDate - Reference date to calculate from (defaults to now)
 * @returns {Date} Default start date
 */
function getDefaultStartDate(granularity, referenceDate = new Date()) {
  const ref = new Date(referenceDate)
  switch (granularity) {
    case "daily":
      const dailyStart = new Date(ref)
      dailyStart.setDate(dailyStart.getDate() - 6)
      return dailyStart
    case "monthly":
      const monthlyStart = new Date(ref)
      monthlyStart.setMonth(monthlyStart.getMonth() - 11)
      return monthlyStart
    case "yearly":
      const yearlyStart = new Date(ref)
      yearlyStart.setFullYear(yearlyStart.getFullYear() - 4)
      return yearlyStart
    default:
      return ref
  }
}

/**
 * Unified function to get KPI data for a date range with specified granularity
 * Maintains backward compatibility: no dates = existing behavior (last N periods)
 * @param {string|null} organizationId - Optional organization filter
 * @param {string|null} startDate - Optional custom start date (ISO 8601)
 * @param {string|null} endDate - Optional custom end date (ISO 8601)
 * @param {string} granularity - "daily", "monthly", or "yearly"
 * @param {string|null} userId - Optional user filter
 * @returns {Array} Array of KPI data points
 */
async function getKpiByDateRange(
  organizationId,
  startDate,
  endDate,
  granularity = "daily",
  userId,
) {
  if (!startDate && !endDate) {
    switch (granularity) {
      case "daily":
        return getLast7DaysKpi(organizationId, userId)
      case "monthly":
        return getLast12MonthsKpi(organizationId, userId)
      case "yearly":
        return getLastYearsKpi(organizationId, userId)
      default:
        return getLast7DaysKpi(organizationId, userId)
    }
  }

  const end = endDate ? new Date(endDate) : new Date()
  const start = startDate
    ? new Date(startDate)
    : getDefaultStartDate(granularity, end)

  const intervals = computeIntervalsForRange(start, end, granularity)
  return generateKpiSeries(intervals, organizationId, userId)
}

module.exports = {
  getLast7DaysKpi,
  getLast12MonthsKpi,
  getLastYearsKpi,
  generateKpi,
  getKpiByDateRange,
}
