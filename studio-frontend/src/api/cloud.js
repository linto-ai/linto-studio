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

// GET /cloud/packs -> [{ packKey, kind, displayName, minutes, amountCents, currency, plans }]
export async function apiGetPacks(notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/packs`,
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

// POST /cloud/subscriptions { organizationId | organizationName, planKey, seats?, interval?, returnUrl? }
// -> { url, sessionId, organizationId }: the Checkout page to redirect to, and the
// org the plan is bought for (created hidden with organizationName). On refusal,
// { errorCode } ("already_subscribed"…, null when the API gave none).
export async function apiCreateCheckout(payload, notif = null) {
  const res = await sendRequest(
    `${CLOUD_API}/subscriptions`,
    { method: "post" },
    payload,
    notif,
  )
  if (res?.status === "success" && res.data?.url) return res.data
  return { errorCode: res?.error?.response?.data?.error ?? null }
}

// POST /cloud/credits/checkout { organizationId, packKey, returnUrl? }
// -> { url, sessionId }. One-time payment for a live pack; the caller redirects
// the browser to url and comes back with ?type=credits&status=success|cancel.
export async function apiCreateCreditsCheckout(
  organizationId,
  { packKey, returnUrl } = {},
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/credits/checkout`,
    { method: "post" },
    { organizationId, packKey, returnUrl },
    notif,
  )
  return res?.data
}

// POST /cloud/portal { organizationId, returnUrl? } -> { url, sessionId }
// Stripe Customer Portal (invoices, card, billing details, cancellation); the
// caller redirects to url. 409 no_stripe_customer when the org never paid.
export async function apiCreatePortalSession(
  organizationId,
  { returnUrl } = {},
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/portal`,
    { method: "post" },
    { organizationId, returnUrl },
    notif,
  )
  return res?.data
}

// POST /cloud/subscriptions/change -> updated subscription. Plan, period or
// seats of a billed org, in place with proration; a free planKey cancels, at
// period end unless immediate.
export async function apiChangeSubscription(
  organizationId,
  { planKey, interval, seats, immediate } = {},
  notif = null,
) {
  const res = await sendRequest(
    `${CLOUD_API}/subscriptions/change`,
    { method: "post" },
    { organizationId, planKey, interval, seats, immediate },
    notif,
  )
  return res?.data
}

// --- Backoffice (platform sys-admin). sendRequest adds userScope=backoffice on
// /backoffice pages; elsewhere (the dev block) pass { backoffice: true }. ---

function adminUrl(path, backoffice) {
  return `${CLOUD_API}/admin${path}${backoffice ? "?userScope=backoffice" : ""}`
}

// GET /cloud/admin/orgs/:orgId -> { planKey, seats, mode, subscription, usage, lots }
export async function apiAdminGetOrgBilling(
  organizationId,
  { backoffice = false } = {},
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}`, backoffice),
    { method: "get" },
    {},
    notif,
  )
  return res?.data
}

// GET /cloud/admin/orgs?enriched&limit&offset -> [subscription row], most
// recent first; enriched adds usage, the org summary (live, gauges, locked).
export async function apiAdminListOrgs(
  query = {},
  { backoffice = false } = {},
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/orgs`, backoffice),
    { method: "get" },
    query,
    notif,
  )
  return res?.data
}

// GET /cloud/admin/ledger.csv?from&to&format -> CSV text, or { from, to, rows }
// with format=json
export async function apiAdminGetLedgerExport(
  query = {},
  { backoffice = false } = {},
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/ledger.csv`, backoffice),
    { method: "get" },
    query,
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/lots/:lotId/refund -> { refunded, stripeRefundId, lotId }
// Refunds the pack at Stripe; the minutes come back through the webhook.
export async function apiAdminRefundLot(
  organizationId,
  lotId,
  { backoffice = false } = {},
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}/lots/${lotId}/refund`, backoffice),
    { method: "post" },
    {},
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/mode { mode: normal|comp|managed } -> { subscription }
export async function apiAdminSetOrgMode(organizationId, mode, notif = null) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}/mode`),
    { method: "post" },
    { mode },
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/plan { planKey, seats?, until?, reason? }
// -> { updated, subscription } ; 409 { reason } when Stripe bills the org or
// its mode is not normal. A plan billed outside Stripe; free_payg takes any
// non-Stripe plan off (200 { reason: "already_free" } when there is none).
export async function apiAdminSetManualPlan(
  organizationId,
  payload,
  { backoffice = false } = {},
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}/plan`, backoffice),
    { method: "post" },
    payload,
    notif,
  )
  // A refusal is an answer too: { updated: false, reason } comes back as is
  return res?.data ?? res?.error?.response?.data
}

// POST /cloud/admin/orgs/:orgId/credits { minutes, reason } -> { granted, balance }
export async function apiAdminGrantCredits(
  organizationId,
  { minutes, reason },
  notif = null,
) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}/credits`),
    { method: "post" },
    { minutes, reason },
    notif,
  )
  return res?.data
}

// POST /cloud/admin/orgs/:orgId/seats { seats } -> { updated, seats }
export async function apiAdminSetSeats(organizationId, seats, notif = null) {
  const res = await sendRequest(
    adminUrl(`/orgs/${organizationId}/seats`),
    { method: "post" },
    { seats },
    notif,
  )
  return res?.data
}
