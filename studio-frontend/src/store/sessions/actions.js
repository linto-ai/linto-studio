const actions = {
  updateOrCreateSession({ commit }, session) {
    commit("updateOrCreateSession", session)
  },
  updateOrCreateSessions({ commit }, sessions) {
    for (const session of sessions) {
      commit("updateOrCreateSession", session)
    }
  },
  // Single entry point of the organization sessions websocket feed.
  // "removed" means the session is no longer running on the server: a
  // terminated session vanishes from the broadcast, it is never pushed as
  // an update with a "terminated" status.
  applySessionsUpdate({ commit }, { added = [], updated = [], removed = [] }) {
    for (const session of [...added, ...updated]) {
      commit("mergeSessionUpdate", session)
    }
    for (const session of removed) {
      commit("markSessionTerminated", session.id)
    }
  },
}

export default actions
