const getters = {
  getSessionById: (state) => (id) => {
    return state.sessionsIndexedById[id]
  },
}

export default getters
