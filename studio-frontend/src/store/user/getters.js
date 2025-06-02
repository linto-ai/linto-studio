import { userName } from "@/tools/userName.js"
import userAvatar from "@/tools/userAvatar"

const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated
  },
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
