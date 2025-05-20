const getters = {
  getUserInfos(state) {
    return state.userInfos
  },
  getUserId(state) {
    return state.userInfos._id
  },
  getUserPlatformRole(state) {
    return state.userInfos.role
  },
  isFavoriteConversation: (state) => (id) => {
    return state.favoritesConversationIds.includes(id)
  },
}

export default getters
