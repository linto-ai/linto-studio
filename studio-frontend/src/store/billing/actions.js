import {
  apiGetPlans,
  apiGetUsage,
  apiGetUsageByMember,
  apiGetSubscriptions,
  apiCreateSubscription,
  apiCancelSubscription,
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

  // What every member may load: the catalog and the org's usage summary.
  async refresh({ commit, dispatch }, orgId) {
    commit("setLoading", true)
    try {
      await Promise.all([dispatch("fetchPlans"), dispatch("fetchUsage", orgId)])
    } finally {
      commit("setLoading", false)
    }
  },

  // Subscribe the org to a paid plan. Returns { subscription, clientSecret }.
  // Seats are derived server-side from membership. Checkout replaces this in J2.
  async subscribe({ dispatch, rootGetters }, payload = {}) {
    const { planKey, orgId } = payload
    if (!planKey) return null
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const result = await apiCreateSubscription(organizationId, planKey, 1)
    await dispatch("refresh", organizationId)
    return result
  },

  // Cancel at period end. Kept for the API; the UI hands this to the Stripe
  // Customer Portal in J2.
  async cancel({ dispatch, state, rootGetters }, payload = {}) {
    const { immediate = false, orgId } = payload
    const sub = state.subscription
    if (!sub || !sub._id) return null
    const result = await apiCancelSubscription(sub._id, immediate)
    await dispatch("refresh", currentOrg(rootGetters, orgId))
    return result
  },
}
