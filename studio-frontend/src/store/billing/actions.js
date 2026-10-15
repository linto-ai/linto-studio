import {
  apiGetPlans,
  apiGetUsage,
  apiGetUsageByMember,
  apiGetSubscriptions,
  apiChangeSubscription,
  apiCreateCreditsCheckout,
  apiGetPacks,
} from "@/api/cloud"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"

function currentOrg(rootGetters, orgId) {
  return orgId || rootGetters["organizations/getCurrentOrganizationScope"]
}

export default {
  async fetchPlans({ commit }) {
    const plans = await apiGetPlans()
    if (plans) commit("setPlans", plans)
    return plans
  },

  // Null when the catalog can't be read.
  async fetchPacks({ commit }) {
    const packs = await apiGetPacks()
    if (packs) commit("setPacks", packs)
    return packs || null
  },

  // What a pack purchase needs: the packs and the plans that may buy them.
  // Reloaded every time: the catalog differs from one organization to another.
  async loadPackCatalog({ dispatch }) {
    await Promise.all([dispatch("fetchPacks"), dispatch("fetchPlans")])
  },

  // Creates the Stripe Checkout of a pack. Returns the page to send the
  // browser to, which comes back to returnUrl with
  // ?type=credits&status=success|cancel; null when Stripe can't be reached.
  async startPackCheckout({ rootGetters }, { packKey, returnUrl, orgId }) {
    const organizationId = currentOrg(rootGetters, orgId)
    if (!organizationId) return null
    const session = await apiCreateCreditsCheckout(organizationId, {
      packKey,
      returnUrl,
    })
    return session?.url || null
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
    commit("setSubscriptions", subs)
    return subs
  },

  // Opens the onboarding/upgrade wizard (OnboardingWizard.vue). `reason` is
  // the optional { code, reason, capability, remaining } gating detail from
  // a 402/403 SaaS response, shown as a contextual hint.
  // A refusal in a locked team org comes from the lost plan: the plan list
  // can't lift it (Premium is refused to a team org, Business would create a
  // new one), so its admin goes to the reactivation instead. Opened without a
  // reason (return from Stripe, footer), the wizard stays where it is told.
  async openUpgradeModal(
    { commit, dispatch, getters, rootGetters },
    reason = null,
  ) {
    const isAdmin =
      rootGetters["organizations/getUserRoleInOrganization"] ===
      ORGANIZATION_ROLES.ADMINISTRATOR
    if (reason && getters.locked && isAdmin) {
      if (await dispatch("openReactivationModal")) return
    }
    commit("openUpgradeModal", reason)
  },
  // Opens the wizard straight on one plan's own step. The catalog is loaded
  // first: the wizard renders nothing for a plan it doesn't know yet.
  async openUpgradeModalOnPlan({ commit, dispatch, state }, planKey) {
    if (!state.plans.length) await dispatch("fetchPlans")
    commit("openUpgradeModalOnPlan", planKey)
  },
  // Opens the wizard on the reactivation of Business, the plan a locked team
  // org lost. Its ended subscription seeds the seats and the period, all its
  // members (API keys included, the API bills them a seat too) the floor.
  // False when the catalog can't be read: the wizard would have nothing to show.
  async openReactivationModal({ commit, dispatch, state }) {
    await Promise.all([
      state.plans.length ? null : dispatch("fetchPlans"),
      dispatch("fetchSubscriptions"),
      dispatch(
        "organizations/loadCurrentOrganizationAllUsers",
        {
          forceRefresh: true,
        },
        { root: true },
      ),
    ])
    if (!state.plans.some((plan) => plan.planKey === "business")) return false
    commit("openReactivationModal")
    return true
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
