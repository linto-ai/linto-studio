import { sendRequest } from "@/tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")
const DEFAULT_PAGE_SIZE = 10

export async function getAllKpiDaily() {
  const res = await sendRequest(`${BASE_API}/administration/activity/daily`)

  return res
}

export async function getSessionListKpi(
  page = 0,
  {
    pageSize = DEFAULT_PAGE_SIZE,
    sortField = "timestamp",
    sortOrder = -1,
    organizationId,
  } = {},
) {
  const res = await sendRequest(
    `${BASE_API}/administration/activity/session`,
    {
      method: "get",
    },
    {
      page,
      size: pageSize,
      sortField,
      sortCriteria: sortOrder,
      organizationId,
    },
  )
  return res?.data ?? { list: [], count: 0 }
}

export async function getKpiByOrganization(organizationId, step) {
  const res = await sendRequest(
    `${BASE_API}/administration/activity/${step}/organization/${organizationId}`,
  )

  return res
}

function mergeKpi() {
  return async function () {
    const kpiDailyReq = await getAllKpiDaily()
    let res = {}

    if (!kpiDailyReq.status === "success") {
      return kpiDailyReq
    }

    for (kpi of kpiDailyReq.data.list) {
      const date = kpi.date
      if (!res[date]) {
        res[date] = kpi
      } else {
        res[date] = {
          transcription: {
            totalTranscriptions:
              res[date].transcription.totalTranscriptions +
              kpi.transcription.totalTranscriptions,
            totalDurationSeconds:
              res[date].transcription.totalDurationSeconds +
              kpi.transcription.totalDurationSeconds,
          },
          session: {
            totalSessions:
              res[date].session.totalSessions + kpi.session.totalSessions,
            totalWatchTimeHours:
              res[date].session.totalWatchTimeHours +
              kpi.session.totalWatchTimeHours,
            avgWatchTimeMinutes:
              (res[date].session.avgWatchTimeMinutes *
                res[date].session.totalSessions +
                kpi.session.avgWatchTimeMinutes * kpi.session.totalSessions) /
              (res[date].session.totalSessions + kpi.session.totalSessions),
          },
        }
      }
    }
  }
}

export const getAllKpiDailyMerged = mergeKpi(getAllKpiDaily)

export async function apiGetPlatformKpiSeries(filters = {}) {
  const { step = "daily", organizationId, startDate, endDate } = filters

  const params = { userScope: "backoffice", step }
  if (organizationId) params.organizationId = organizationId
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  const res = await sendRequest(
    `${BASE_API}/administration/activity/compute/series`,
    { method: "get" },
    params,
  )
  return res?.data || { step, data: [] }
}

/**
 * Fetches detailed KPI data for a specific session.
 * Includes channel-level metrics and timeline information.
 * @param {string} sessionId - The session ID to fetch KPIs for
 * @returns {Promise<Object|null>} Session detailed KPI data or null if not found
 */
export async function getSessionKpiById(sessionId) {
  const res = await sendRequest(
    `${BASE_API}/administration/activity/session/${sessionId}`,
    { method: "get" },
    { userScope: "backoffice" },
  )
  return res?.data ?? null
}

/**
 * Export KPI session data in the specified format
 * @param {string} format - Export format: 'json', 'csv', or 'xls'
 * @param {Object} filters - Optional filters
 * @param {string} [filters.organizationId] - Filter by organization ID
 * @param {string} [filters.startDate] - Filter from date (ISO 8601)
 * @param {string} [filters.endDate] - Filter to date (ISO 8601)
 * @returns {Promise<Blob|null>} File blob for download
 */
export async function exportKpiSessions(format, filters = {}) {
  const params = { userScope: "backoffice", format }
  if (filters.organizationId) params.organizationId = filters.organizationId
  if (filters.startDate) params.startDate = filters.startDate
  if (filters.endDate) params.endDate = filters.endDate

  const res = await sendRequest(
    `${BASE_API}/administration/activity/session/export`,
    { method: "get", responseType: "blob" },
    params,
  )

  return res?.data ?? null
}
