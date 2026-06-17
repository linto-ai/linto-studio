export default {
  setPlans(state, plans) {
    state.plans = plans || []
  },
  setSubscription(state, subscription) {
    state.subscription = subscription || null
  },
  setUsage(state, usage) {
    state.usage = usage || null
  },
  setLoading(state, value) {
    state.loading = !!value
  },
}
