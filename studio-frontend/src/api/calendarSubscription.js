import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function getCalendarSubscriptions(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/calendar-subscriptions`,
    { method: "get" },
    {},
    null,
  )

  return res?.data || []
}

export async function createCalendarSubscription(organizationId, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/calendar-subscriptions`,
    { method: "post" },
    payload,
    null,
  )

  return res
}

export async function getCalendarSubscription(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/calendar-subscriptions/${id}`,
    { method: "get" },
    {},
    null,
  )

  return res
}

export async function updateCalendarSubscription(organizationId, id, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/calendar-subscriptions/${id}`,
    { method: "put" },
    payload,
    null,
  )

  return res
}

export async function deleteCalendarSubscription(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/calendar-subscriptions/${id}`,
    { method: "delete" },
    {},
    null,
  )

  return res
}
