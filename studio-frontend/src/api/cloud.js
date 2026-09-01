import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

// The SaaS plugin (linto-saas) is mounted at /cloud on studio-api, sibling to
// /api (so the Stripe webhook bypasses studio auth). VUE_APP_CONVO_API ends in
// /api, so we strip it to reach /cloud.
const CLOUD_API =
  getEnv("VUE_APP_CONVO_API").replace(/\/api\/?$/, "") + "/cloud"

// GET /cloud/plans -> [{ planKey, displayName, pricing, entitlements }]
export async function apiGetPlans(notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/plans`,
    { method: "get" },
    {},
    notif,
  )
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

// PUT /cloud/subscriptions/billing-profile { organizationId, legalName, email?, address, vatId? }
// Persist legal billing details on the Stripe customer (compliant invoices).
export async function apiSetBillingProfile(
  organizationId,
  profile,
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/subscriptions/billing-profile`,
    { method: "put" },
    { organizationId, ...profile },
    notif,
  )
  return res?.data
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

// GET /cloud/invoices/:orgId -> [{ id, created, amount, currency, status, pdf, url }]
export async function apiGetInvoices(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/invoices/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// --- Backoffice (platform sys-admin; sendRequest adds userScope=backoffice on
// /backoffice pages) ---

// GET /cloud/admin/orgs/:orgId -> { planKey, seats, billingExempt, subscription, usage }
export async function apiAdminGetOrgBilling(organizationId, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}`,
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/exempt { exempt } -> updated subscription
export async function apiAdminSetExempt(organizationId, exempt, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/admin/orgs/${organizationId}/exempt`,
    { method: "post" },
    { exempt },
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
