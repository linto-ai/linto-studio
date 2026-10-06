export default {
  namespaced: true,
  state: {
    isModalOpen: false,
    // Tab AppSettingsModal should select on its next open. Consumed (reset to
    // null) as soon as it's applied, so a later plain setModalOpen(true) call
    // doesn't reopen it on a stale tab.
    requestedTab: null,
    // Kind of pack (live, transcription) whose purchase the billing tab
    // should open on its next load. Consumed the same way as requestedTab.
    requestedPackKind: null,
  },
  mutations: {
    setIsModalOpen(state, isModalOpen) {
      state.isModalOpen = isModalOpen
    },
    setRequestedTab(state, tab) {
      state.requestedTab = tab
    },
    setRequestedPackKind(state, kind) {
      state.requestedPackKind = kind
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
    // Opens the billing tab with the purchase of a kind of pack already on
    // screen (e.g. from the "live credit spent" banner).
    openPackPicker({ dispatch, commit }, kind) {
      commit("setRequestedPackKind", kind)
      dispatch("openModalOnTab", "billing")
    },
    // Consumed by the billing tab once it opens the purchase.
    consumePackPickerRequest({ commit }) {
      commit("setRequestedPackKind", null)
    },
  },
  getters: {
    isModalOpen(state) {
      return state.isModalOpen
    },
    requestedTab(state) {
      return state.requestedTab
    },
    requestedPackKind(state) {
      return state.requestedPackKind
    },
  },
}
