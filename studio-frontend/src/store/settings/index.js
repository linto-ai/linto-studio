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
    setModalOpen({ commit, state }, isModalOpen) {
      commit("setIsModalOpen", isModalOpen)
    },
    toggleIsModalOpen({ commit, state }) {
      commit("setIsModalOpen", !state.isModalOpen)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
  },
}
