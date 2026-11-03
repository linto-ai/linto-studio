// Whether the "new transcription" modal is open, wherever it was opened from.
export default {
  namespaced: true,
  state: {
    isModalOpen: false,
    // Asked for by the URL: waits for the navigation to end, see openRequestedModal
    isModalRequested: false,
  },
  mutations: {
    setIsModalRequested(state, isModalRequested) {
      state.isModalRequested = isModalRequested
    },
    setIsModalOpen(state, isModalOpen) {
      state.isModalOpen = isModalOpen
    },
  },
  actions: {
    setModalOpen({ commit }, isModalOpen) {
      commit("setIsModalOpen", isModalOpen)
    },
    requestModal({ commit }) {
      commit("setIsModalRequested", true)
    },
    openRequestedModal({ commit, state }) {
      if (!state.isModalRequested) return
      commit("setIsModalRequested", false)
      commit("setIsModalOpen", true)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
  },
}
