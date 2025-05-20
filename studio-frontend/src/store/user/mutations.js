const mutations = {
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
    state.favoritesConversationIds = favoritesConversationIds
  },
}
export default mutations
