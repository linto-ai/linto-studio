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
}

export default getters
