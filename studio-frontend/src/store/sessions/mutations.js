const mutations = {
  addSession(state, session) {
    state.sessionsIndexedById[session.id] = session
  },
  populateFromArray(state, sessions) {
    state.sessionsIndexedById = sessions.reduce((acc, session) => {
      acc[session.id] = session
      return acc
    }, {})
  },
  updateSession(state, session) {
    state.sessionsIndexedById[session.id] = {
      ...state.sessionsIndexedById?.[session.id],
      ...session,
    }
  },
  removeSession(state, sessionId) {
    delete state.sessionsIndexedById[sessionId]
  },
}

export default mutations
