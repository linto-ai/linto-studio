// i18n label per metered capability (quota rules of the catalog).
const METER_LABEL = {
  "import.minutes": "billing.meter.import",
  "ai.generations": "billing.meter.ai",
  "ai.chat": "billing.meter.chat",
  "api.calls": "billing.meter.api",
}

export default {
  plans: (s) => s.plans,
  usage: (s) => s.usage,
  usageByMember: (s) => s.usageByMember,
  subscription: (s) => s.subscription,
  loading: (s) => s.loading,
  planKey: (s) => s.usage?.planKey || s.subscription?.planKey || "free_payg",
  // normal | comp | managed
  mode: (s) => s.usage?.mode || s.subscription?.mode || "normal",
  // comp and managed orgs have no gate and no limit.
  isUnmetered: (s, g) => g.mode !== "normal",
  isFree: (s, g) => g.planKey === "free_payg",
  currentPlan: (s, g) => s.plans.find((p) => p.planKey === g.planKey) || null,
  isPaid: (s, g) => !g.isFree,
  // Paid plans the catalog offers, cheapest first. Drives the upgrade choice.
  paidPlans: (s) =>
    s.plans
      .filter((p) => p.pricing && p.pricing.model !== "free")
      .sort(
        (a, b) => (a.pricing.amountCents || 0) - (b.pricing.amountCents || 0),
      ),
  planLabel: (s, g) => g.currentPlan?.displayName || "",
  // Only a per-seat plan bills a seat on promotion.
  isPerSeat: (s, g) => g.currentPlan?.pricing?.perSeat === true,
  // Live balance block of the usage summary (null until loaded).
  live: (s) => s.usage?.live || null,

  // Is a capability available on the current plan? Drives UI locks. The usage
  // summary is authoritative (it already applies the org mode); the catalog is
  // the fallback while it loads. Quota and credit capabilities are "available",
  // their limit is enforced server-side.
  can: (s, g) => (capability) => {
    if (g.isUnmetered) return true
    const c = s.usage?.capabilities?.[capability]
    if (c) {
      if (c.type === "boolean") return c.enabled === true
      return true
    }
    const rule = g.currentPlan?.entitlements?.[capability]
    if (!rule) return false
    if (rule.type === "boolean") return rule.value === true
    return true
  },

  // Quota gauges, display-ready.
  meters: (s) => {
    const caps = s.usage?.capabilities
    if (!caps) return []
    return Object.entries(caps)
      .filter(([, c]) => c && c.type === "quota")
      .map(([key, c]) => {
        const unlimited = c.limit == null
        const percent = unlimited
          ? 0
          : Math.min(100, Math.round((c.used / Math.max(1, c.limit)) * 100))
        return {
          key,
          used: c.used,
          limit: c.limit,
          remaining: c.remaining,
          resetAt: c.resetAt,
          unit: c.unit, // minutes | count
          period: c.period,
          unlimited,
          percent,
          label: METER_LABEL[key] || key,
        }
      })
  },

  // Headline meter for the sidebar footer bar.
  primaryMeter: (s, g) =>
    g.meters.find((m) => m.key === "import.minutes") || g.meters[0] || null,

  // True when any quota is exhausted (drives the upsell emphasis).
  needsUpgrade: (s, g) =>
    g.meters.some((m) => !m.unlimited && m.remaining <= 0),
}
