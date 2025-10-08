const getters = {
  getSessionById: (state) => (id) => {
    return state.sessionsIndexedById[id]
  },
  getAllSessions: (state) => {
    return state.sessionsIndexedById.values()
  },
}

export default getters
