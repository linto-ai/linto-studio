// Capabilities worth showing per member, in display order. api.calls is left
// out (its subject is an API key, not a person) and so is live.minutes: it is
// an organization credit, and the per-member payload only carries quota rules.
const MEMBER_CAPABILITIES = [
  { capability: "import.minutes", labelKey: "billing.meter.import" },
  { capability: "ai.generations", labelKey: "billing.meter.ai" },
  { capability: "ai.chat", labelKey: "billing.meter.chat" },
]

/**
 * Usage columns of the members table, derived from the plan's metered
 * capabilities. Column keys are flat on purpose: the table sorter walks a
 * dotted key as an object path and would throw on "import.minutes".
 * @param {object|null} capabilities - usage.capabilities from GET /cloud/usage/:orgId
 * @returns {Array<{capability: string, key: string, labelKey: string, unit: string}>}
 */
export function computeUsageColumns(capabilities) {
  if (!capabilities) return []
  return MEMBER_CAPABILITIES.filter(
    (entry) => capabilities[entry.capability]?.type === "quota",
  ).map((entry) => ({
    capability: entry.capability,
    key: `usage_${entry.capability.replace(/\./g, "_")}`,
    labelKey: entry.labelKey,
    unit: capabilities[entry.capability].unit || "count",
  }))
}
