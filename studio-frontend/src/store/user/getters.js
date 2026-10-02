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
  needsOnboarding(state) {
    // Only brand-new accounts carry onboarded:false. Existing users (field
    // absent) and already-onboarded users are skipped.
    return state.userInfos?.onboarded === false
  },
  getFavoriteOrganizationId(state) {
    return state.userInfos?.defaultOrganization ?? null
  },
  isFavoriteOrganization: (state) => (id) => {
    return state.userInfos?.defaultOrganization === id
  },
  isFavoriteConversation: (state) => (id) => {
    return state.favoritesConversationIds.includes(id)
  },
}

export default getters
