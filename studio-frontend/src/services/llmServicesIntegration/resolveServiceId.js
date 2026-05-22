// Resolves a service id from a WS update payload. Tries jobId first, then
// falls back to the format/serviceFormat/serviceName field. When falling
// back, the resolved id gets its jobId synced in the Vuex store so the
// next update lands on the fast path.

export function resolveServiceId(store, update) {
  const byJob = store.getters["llmServices/findIdByJobId"](update.jobId)
  if (byJob) return byJob

  const fmt = update.serviceFormat || update.serviceName || update.format
  const byFmt = store.getters["llmServices/findIdByFormat"](fmt)
  if (byFmt) {
    store.commit("llmServices/SET_JOB_ID", { id: byFmt, jobId: update.jobId })
  }
  return byFmt
}
