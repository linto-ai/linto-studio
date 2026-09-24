import {
  apiGetPlans,
  apiGetUsage,
  apiGetUsageByMember,
  apiGetSubscriptions,
  apiChangeSubscription,
} from "@/api/cloud"

function currentOrg(rootGetters, orgId) {
  return orgId || rootGetters["organizations/getCurrentOrganizationScope"]
}

export default {
  async fetchPlans({ commit }) {
    const plans = await apiGetPlans()
    if (plans) commit("setPlans", plans)
    return plans
  },

  async fetchUsage({ commit, rootGetters }, orgId) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const usage = await apiGetUsage(organizationId)
    if (usage) commit("setUsage", usage)
    return usage
  },

  async fetchUsageByMember({ commit, rootGetters }, orgId) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const data = await apiGetUsageByMember(organizationId)
    if (data) commit("setUsageByMember", data)
    return data
  },

  // Org admin only (the route is admin-guarded): dispatched by the subscription
  // panel, never by the shared footer.
  async fetchSubscriptions({ commit, rootGetters }, orgId) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const subs = await apiGetSubscriptions(organizationId)
    const active = Array.isArray(subs)
      ? subs.find((x) => ["active", "trialing", "past_due"].includes(x.status))
      : null
    commit("setSubscription", active || null)
    return subs
  },

  // Opens the onboarding/upgrade wizard (OnboardingWizard.vue). `reason` is
  // the optional { code, reason, capability, remaining } gating detail from
  // a 402/403 SaaS response, shown as a contextual hint.
  openUpgradeModal({ commit }, reason = null) {
    commit("openUpgradeModal", reason)
  },
  closeUpgradeModal({ commit }) {
    commit("closeUpgradeModal")
  },

  // Seat capacity of a per-seat plan, bought and released in place. `seats` is
  // the TOTAL, never a delta, and the API floors it at the org's current
  // collaborators and at the plan's included seats — so the caller reads the
  // seat count back from the refreshed usage, never from what it asked for.
  // Stripe invoices the prorated difference right away (proration_behavior
  // "always_invoice"). Org admin only; null when the change is refused.
  async changeSeats({ dispatch, rootGetters }, payload = {}) {
    const { seats, orgId } = payload
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId || typeof seats !== "number") return null
    const subscription = await apiChangeSubscription(organizationId, { seats })
    if (!subscription) return null
    await dispatch("refresh", organizationId)
    await dispatch("fetchSubscriptions", organizationId)
    return subscription
  },

  // What every member may load: the catalog and the org's usage summary.
  async refresh({ commit, dispatch }, orgId) {
    commit("setLoading", true)
    try {
      await Promise.all([dispatch("fetchPlans"), dispatch("fetchUsage", orgId)])
    } finally {
      commit("setLoading", false)
    }
  },
}
