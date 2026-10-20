export default {
  setPlans(state, plans) {
    state.plans = plans || []
  },
  setPacks(state, packs) {
    state.packs = packs || null
  },
  setSubscription(state, subscription) {
    state.subscription = subscription || null
  },
  setSubscriptions(state, subscriptions) {
    state.subscriptions = Array.isArray(subscriptions) ? subscriptions : []
  },
  setUsage(state, usage) {
    state.usage = usage || null
  },
  setCreditLots(state, lots) {
    state.creditLots = Array.isArray(lots) ? lots : null
  },
  setUsageByMember(state, data) {
    state.usageByMember = data || null
  },
  setLoading(state, value) {
    state.loading = !!value
  },
  openUpgradeModal(state, reason) {
    state.upgradeModalOpen = true
    state.upgradeReason = reason || null
  },
  openUpgradeModalOnPlan(state, planKey) {
    state.upgradeModalOpen = true
    state.upgradePlanKey = planKey
  },
  openReactivationModal(state) {
    state.upgradeModalOpen = true
    state.reactivationRequested = true
  },
  closeUpgradeModal(state) {
    state.upgradeModalOpen = false
    state.upgradeReason = null
    state.upgradePlanKey = null
    state.reactivationRequested = false
  },
}
