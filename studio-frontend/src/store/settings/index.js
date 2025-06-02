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
    toggleIsModalOpen({ commit, state }) {
      commit("setIsModalOpen", !state.isModalOpen)
    },
    openModal({ commit, state }) {
      commit("setIsModalOpen", true)
      console.log("openModal", state.isModalOpen)
    },
    closeModal({ commit, state }) {
      commit("setIsModalOpen", false)
      console.log("closeModal", state.isModalOpen)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
  },
}
