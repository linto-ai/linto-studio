import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

// The SaaS plugin (linto-saas) is mounted at /cloud on studio-api, sibling to
// /api (so the Stripe webhook bypasses studio auth). VUE_APP_CONVO_API ends in
// /api, so we strip it to reach /cloud.
const CLOUD_API = getEnv("VUE_APP_CONVO_API").replace(/\/api\/?$/, "") + "/cloud"

// GET /cloud/plans -> [{ planKey, displayName, pricing, entitlements }]
export async function apiGetPlans(notif = null) {
  const res = await sendRequest(`${CLOUD_API}/plans`, { method: "get" }, {}, notif)
  return res?.data
}

// GET /cloud/usage/:orgId -> { planKey, seats, capabilities: {...} }
export async function apiGetUsage(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/usage/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/subscriptions?organizationId=... -> [subscription]
export async function apiGetSubscriptions(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/subscriptions`,
    { method: "get" },
    { organizationId },
    notif,
  )
  return res?.data
}

// POST /cloud/subscriptions { organizationId, planKey, seats }
// -> { subscription, clientSecret }
export async function apiCreateSubscription(
  organizationId,
  planKey,
  seats = 1,
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/subscriptions`,
    { method: "post" },
    { organizationId, planKey, seats },
    notif,
  )
  return res?.data
}
