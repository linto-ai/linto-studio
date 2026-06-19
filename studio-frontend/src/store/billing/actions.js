import {
  apiGetPlans,
  apiGetUsage,
  apiGetUsageByMember,
  apiGetSubscriptions,
  apiCreateSubscription,
  apiCancelSubscription,
  apiGetInvoices,
  apiSetBillingProfile,
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

  async fetchInvoices({ commit, rootGetters }, orgId) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return []
    const invoices = await apiGetInvoices(organizationId)
    commit("setInvoices", invoices || [])
    return invoices
  },

  async fetchSubscriptions({ commit, rootGetters }, orgId) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const subs = await apiGetSubscriptions(organizationId)
    const active = Array.isArray(subs)
      ? subs.find((x) =>
          ["active", "trialing", "past_due"].includes(x.status),
        )
      : null
    commit("setSubscription", active || null)
    return subs
  },

  async refresh({ commit, dispatch }, orgId) {
    commit("setLoading", true)
    try {
      await Promise.all([
        dispatch("fetchPlans"),
        dispatch("fetchUsage", orgId),
        dispatch("fetchSubscriptions", orgId),
      ])
    } finally {
      commit("setLoading", false)
    }
  },

  // Persist the org's legal billing profile (company name, address, VAT) on the
  // Stripe customer so invoices are compliant. Called before upgrade in live mode.
  async saveBillingProfile({ rootGetters }, payload = {}) {
    const { orgId, ...profile } = payload
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    return apiSetBillingProfile(organizationId, profile)
  },

  // MVP upgrade: create a premium subscription (fake Stripe locally). Returns
  // { subscription, clientSecret } — clientSecret is used with real Stripe.
  async upgrade({ dispatch, rootGetters }, payload = {}) {
    const { planKey = "premium", seats = 1, orgId } = payload
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const result = await apiCreateSubscription(organizationId, planKey, seats)
    await dispatch("refresh", organizationId)
    return result
  },

  // Cancel the org's current subscription (back to free). immediate=false ->
  // cancel at period end (keeps premium until the period ends).
  async cancel({ dispatch, state, rootGetters }, payload = {}) {
    const { immediate = false, orgId } = payload
    const sub = state.subscription
    if (!sub || !sub._id) return null
    const result = await apiCancelSubscription(sub._id, immediate)
    await dispatch("refresh", currentOrg(rootGetters, orgId))
    return result
  },
}
