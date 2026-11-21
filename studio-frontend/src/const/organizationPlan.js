// Plan state of an organization as the backoffice listing receives it from the cloud plugin
export const PLAN_STATE_EXPIRED = "expired"

// Tabs of the backoffice organization list, in display order, with the plan
// filter each one sends. Together they hold every organization exactly once.
export const ORGANIZATION_TABS = {
  free: {
    icon: "leaf",
    query: { plan: "free_payg", state: "active", mode: "normal" },
  },
  premium: {
    icon: "star",
    query: { plan: "premium", state: "active", mode: "normal" },
  },
  business: {
    icon: "briefcase",
    query: { plan: "business", state: "active", mode: "normal" },
  },
  expired: { icon: "lock", query: { state: "expired" } },
  comp: { icon: "gift", query: { state: "active", mode: "comp" } },
  managed: { icon: "hard-drives", query: { state: "active", mode: "managed" } },
}
