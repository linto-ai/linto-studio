import { sendRequest } from "@/tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function getAllKpiDaily() {
  const res = await sendRequest(`${BASE_API}/administration/activity/daily`)

  return res
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
