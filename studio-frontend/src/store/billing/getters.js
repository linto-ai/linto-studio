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
  loading: (s) => s.loading,
  planKey: (s) =>
    s.usage?.planKey || s.subscription?.planKey || "free_payg",
  isFree: (s, g) => g.planKey === "free_payg",
  isPremium: (s, g) => g.planKey === "premium",
  premiumPlan: (s) => s.plans.find((p) => p.planKey === "premium") || null,
  currentPlan: (s, g) => s.plans.find((p) => p.planKey === g.planKey) || null,

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
