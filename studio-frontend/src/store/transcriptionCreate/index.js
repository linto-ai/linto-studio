// Whether the "new transcription" modal is open, wherever it was opened from.
export default {
  namespaced: true,
  state: {
    isModalOpen: false,
  },
  mutations: {
    setIsModalOpen(state, isModalOpen) {
      state.isModalOpen = isModalOpen
    },
  },
  actions: {
    setModalOpen({ commit }, isModalOpen) {
      commit("setIsModalOpen", isModalOpen)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
  },
}
