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
