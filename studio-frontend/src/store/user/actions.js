import { getCookie } from "@/tools/getCookie"
import { setCookie } from "@/tools/setCookie"
import { apiGetPersonalUserInfo } from "@/api/user"

const actions = {
  async fetchUser({ commit }) {
    const token = getCookie("authToken")
    const getUserInfos = await apiGetPersonalUserInfo()
    if (getUserInfos.status === "success") {
      commit("setUserInfos", {
        token,
        ...getUserInfos.data,
      })
    }
    return getUserInfos
  },
  async login({ commit }, payload) {},
  async logout({ commit }) {},
  async register({ commit }, payload) {},
  async updateUser({ commit }, payload) {},
}

export default actions
