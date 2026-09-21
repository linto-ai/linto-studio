import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

// The SaaS plugin (linto-saas) is mounted at /cloud on studio-api, sibling to
// /api (so the Stripe webhook bypasses studio auth). VUE_APP_CONVO_API ends in
// /api, so we strip it to reach /cloud.
const CLOUD_API =
  getEnv("VUE_APP_CONVO_API").replace(/\/api\/?$/, "") + "/cloud"

// GET /cloud/plans -> [{ planKey, displayName, description, pricing, entitlements }]
export async function apiGetPlans(notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/plans`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/usage/:orgId -> { planKey, mode, seats, capabilities, live }
export async function apiGetUsage(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/usage/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/usage/:orgId/members -> { planKey, seats, members: { userId: {cap:{used,events}} } }
export async function apiGetUsageByMember(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/usage/${organizationId}/members`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/credits/:orgId -> { balance, expiresAt, lowBalance, lots }
export async function apiGetCredits(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/credits/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/subscriptions?organizationId=... -> [subscription] (org admin)
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
// -> { subscription, clientSecret }. Replaced by Checkout in J2.
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

// POST /cloud/checkout. payload: { organizationId, planKey, seats?, interval?,
// returnUrl? }, or for a plan bought with a new org { organizationName, seats?,
// planKey, ... } where seats is the number of collaborator seats bought on a
// per-seat plan (never below the plan floor).
// -> { url, sessionId, organizationId } (the caller redirects the browser to
// url; organizationId is the org the plan is bought for, created hidden for a
// new org), or
// { errorCode } carrying the API error code ("already_subscribed"…, null when
// the API gave none).
export async function apiCreateCheckout(payload, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/checkout`,
    { method: "post" },
    payload,
    notif,
  )
  if (res?.status === "success" && res.data?.url) return res.data
  return { errorCode: res?.error?.response?.data?.error ?? null }
}

// DELETE /cloud/subscriptions/:id  (?immediate=true) -> updated subscription
export async function apiCancelSubscription(
  subscriptionId,
  immediate = false,
  notif = null,
) {
  const url = `${CLOUD_API}/subscriptions/${subscriptionId}${immediate ? "?immediate=true" : ""}`
  const res = await sendRequest(url, { method: "delete" }, {}, notif)
  return res?.data
}

// --- Backoffice (platform sys-admin; sendRequest adds userScope=backoffice on
// /backoffice pages) ---

// GET /cloud/admin/orgs/:orgId -> { planKey, seats, mode, subscription, usage, lots }
export async function apiAdminGetOrgBilling(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/mode { mode: normal|comp|managed } -> { subscription }
export async function apiAdminSetOrgMode(organizationId, mode, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}/mode`,
    { method: "post" },
    { mode },
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/credits { minutes, reason } -> { granted, balance }
export async function apiAdminGrantCredits(
  organizationId,
  { minutes, reason },
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}/credits`,
    { method: "post" },
    { minutes, reason },
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/seats { seats } -> { updated, seats }
export async function apiAdminSetSeats(organizationId, seats, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}/seats`,
    { method: "post" },
    { seats },
    notif,
  )
  return res?.data
}
