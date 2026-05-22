// Vuex module: gateway-side metadata for each LLM service
// (format, route, flavor, jobId, lastUpdate) — keyed by the service id used
// in the SDK core. The core itself keeps content/status/versions; this module
// holds the host-only info needed to talk to the gateway.

export default {
  namespaced: true,

  state: () => ({
    services: {},
  }),

  mutations: {
    REGISTER(state, { id, data }) {
      state.services = { ...state.services, [id]: { ...data } }
    },

    SET_JOB_ID(state, { id, jobId }) {
      const current = state.services[id]
      if (!current) return
      state.services = {
        ...state.services,
        [id]: { ...current, jobId },
      }
    },

    SET_LAST_UPDATE(state, { id, lastUpdate }) {
      const current = state.services[id]
      if (!current) return
      state.services = {
        ...state.services,
        [id]: { ...current, lastUpdate },
      }
    },

    RESET(state) {
      state.services = {}
    },
  },

  getters: {
    byId: (state) => (id) => state.services[id] ?? null,

    all: (state) => state.services,

    findIdByJobId: (state) => (jobId) => {
      if (!jobId) return null
      for (const [id, entry] of Object.entries(state.services)) {
        if (entry.jobId === jobId) return id
      }
      return null
    },

    findIdByFormat: (state) => (format) => {
      if (!format) return null
      for (const [id, entry] of Object.entries(state.services)) {
        if (entry.format === format || id === format) return id
      }
      return null
    },
  },
}
