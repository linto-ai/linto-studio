import { getCookie } from "@/tools/getCookie"
import { setCookie } from "@/tools/setCookie"
import { apiGetPersonalUserInfo } from "@/api/user"

const actions = {
  async fetchUser({ commit }) {
    const getUserInfos = await apiGetPersonalUserInfo()
    if (getUserInfos?.error) {
      throw getUserInfos
    } else {
      commit("setUserInfos", getUserInfos.data)
    }
  },
  async login({ commit }, payload) {},
  async logout({ commit }) {},
  async register({ commit }, payload) {},
  async updateUser({ commit }, payload) {},
}

export default actions
