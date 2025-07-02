const actions = {
  updateSession({ commit }, session) {
    commit("updateSession", session)
  },
  removeSession({ commit }, sessionId) {
    commit("removeSession", sessionId)
  },
  addSession({ commit }, session) {
    commit("addSession", session)
  },
}

export default actions
