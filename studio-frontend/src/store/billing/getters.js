// i18n label key + display kind per metered capability.
const METER_META = {
  "media.import.duration": { label: "billing.meter.import", kind: "duration" },
  "ai.insights.count": { label: "billing.meter.ai", kind: "count" },
  "live.duration": { label: "billing.meter.live", kind: "duration" },
}

export default {
  plans: (s) => s.plans,
  usage: (s) => s.usage,
  usageByMember: (s) => s.usageByMember,
  subscription: (s) => s.subscription,
  billingExempt: (s) =>
    !!(s.usage?.billingExempt || s.subscription?.billingExempt),
  invoices: (s) => s.invoices || [],
  // live (direct) breakdown surfaced by the usage summary: { channels, translationLangs, byProfile }
  liveDetail: (s) => s.usage?.live || null,
  loading: (s) => s.loading,
  planKey: (s) => s.usage?.planKey || s.subscription?.planKey || "free_payg",
  isFree: (s, g) => g.planKey === "free_payg",
  currentPlan: (s, g) => s.plans.find((p) => p.planKey === g.planKey) || null,
  // Anything that is not the implicit free plan. Deliberately NOT "is premium":
  // the grid has two paid plans (flat solo + per-seat team) and the UI must not
  // hardcode either of them.
  isPaid: (s, g) => !g.isFree,
  // Paid plans the catalog offers, cheapest first. Drives the upgrade choice.
  paidPlans: (s) =>
    s.plans
      .filter((p) => p.pricing && p.pricing.model !== "free")
      .sort(
        (a, b) => (a.pricing.amountCents || 0) - (b.pricing.amountCents || 0),
      ),
  // Display name of the plan in force, from the catalog (never a hardcoded label).
  planLabel: (s, g) => g.currentPlan?.displayName || "",
  // Is the plan in force billed per seat? Only then does promoting a member cost
  // money, so only then does the UI warn about it.
  isPerSeat: (s, g) => g.currentPlan?.pricing?.perSeat === true,

  // Is a capability available on the current plan? Drives UI feature-gating.
  // boolean -> its value; enum/quota/payg present -> available (the precise
  // value/limit is enforced server-side). Absent -> locked.
  can: (s, g) => (capability) => {
    const rule = g.currentPlan?.entitlements?.[capability]
    if (!rule) return false
    if (rule.type === "boolean") return rule.value === true
    return true
  },

  // All metered quotas as display-ready bars.
  meters: (s) => {
    const caps = s.usage?.capabilities
    if (!caps) return []
    return Object.entries(caps).map(([key, c]) => {
      const unlimited = c.limit == null
      const percent = unlimited
        ? 0
        : Math.min(100, Math.round((c.used / Math.max(1, c.limit)) * 100))
      const meta = METER_META[key] || { label: key, kind: "count" }
      return {
        key,
        used: c.used,
        limit: c.limit,
        remaining: c.remaining,
        resetAt: c.resetAt,
        unit: c.unit,
        unlimited,
        percent,
        label: meta.label,
        kind: meta.kind,
      }
    })
  },

  // Headline meter for the sidebar footer bar.
  primaryMeter: (s, g) =>
    g.meters.find((m) => m.key === "media.import.duration") ||
    g.meters[0] ||
    null,

  // True when any metered quota is exhausted (drives the upsell emphasis).
  needsUpgrade: (s, g) =>
    g.meters.some((m) => !m.unlimited && m.remaining <= 0),
}
