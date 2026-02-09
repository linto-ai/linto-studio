const mutations = {
  setIsAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },
  setUserInfos(state, userInfos) {
    state.userInfos = userInfos
  },
  addFavoritesConversationId(state, conversationId) {
    state.favoritesConversationIds.push(conversationId)
  },
  removeFavoritesConversationId(state, conversationId) {
    state.favoritesConversationIds = state.favoritesConversationIds.filter(
      (id) => id !== conversationId,
    )
  },
  setFavoritesConversationIds(state, favoritesConversationIds) {
    const append = (ids) => {
      if (Array.isArray(ids)) {
        return [...state.favoritesConversationIds, ...ids]
      } else {
        return [...state.favoritesConversationIds, ids]
      }
    }

    if (typeof favoritesConversationIds === 'string') {
      state.favoritesConversationIds = append(favoritesConversationIds)
    } else {
      state.favoritesConversationIds = append(favoritesConversationIds)
    }
  },
}
export default mutations
