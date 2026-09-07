// Vuex module: gateway-side metadata for each LLM service
// (format, route, flavor, jobId, lastUpdate, generation→jobId index) —
// keyed by the service id used in the SDK core. The core itself keeps
// content/status/versions/generations; this module holds the host-only
// info needed to talk to the gateway.

export default {
  namespaced: true,

  state: () => ({
    services: {},
  }),

  mutations: {
    REGISTER(state, { id, data }) {
      state.services = {
        ...state.services,
        [id]: { generationJobIds: {}, ...data },
      }
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

    SET_GENERATION_JOB_IDS(state, { id, mapping }) {
      const current = state.services[id]
      if (!current) return
      state.services = {
        ...state.services,
        [id]: { ...current, generationJobIds: { ...mapping } },
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

    jobIdForGeneration: (state) => (id, generationId) => {
      const entry = state.services[id]
      if (!entry || !generationId) return null
      return entry.generationJobIds?.[generationId] ?? null
    },
  },
}
