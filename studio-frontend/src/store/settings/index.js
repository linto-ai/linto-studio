export default {
  namespaced: true,
  state: {
    isModalOpen: false,
    // Tab AppSettingsModal should select on its next open. Consumed (reset to
    // null) as soon as it's applied, so a later plain setModalOpen(true) call
    // doesn't reopen it on a stale tab.
    requestedTab: null,
  },
  mutations: {
    setIsModalOpen(state, isModalOpen) {
      state.isModalOpen = isModalOpen
    },
    setRequestedTab(state, tab) {
      state.requestedTab = tab
    },
  },
  actions: {
    setModalOpen({ commit, state }, isModalOpen) {
      commit("setIsModalOpen", isModalOpen)
    },
    toggleIsModalOpen({ commit, state }) {
      commit("setIsModalOpen", !state.isModalOpen)
    },
    // Opens the modal directly on a given tab (e.g. the billing shortcut from
    // SaasUsageFooter).
    openModalOnTab({ commit }, tab) {
      commit("setRequestedTab", tab)
      commit("setIsModalOpen", true)
    },
    // Consumed by AppSettingsModal once it applies the requested tab.
    setRequestedTab({ commit }, tab) {
      commit("setRequestedTab", tab)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
    requestedTab(state) {
      return state.requestedTab
    },
  },
}
