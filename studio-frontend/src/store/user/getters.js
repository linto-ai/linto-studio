const getters = {
  getUserInfos(state) {
    return state.userInfos
  },
  getUserId(state) {
    return state.userInfos.id
  },
}

export default getters
