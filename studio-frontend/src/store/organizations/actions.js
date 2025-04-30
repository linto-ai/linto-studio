import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
} from "@/api/organisation"

const actions = {
  async fetchOrganizations({ commit }) {
    const getOrganizations = await apiGetUserOrganizations()
    if (getOrganizations.status === "success") {
      console.log(getOrganizations.data)
      commit("setOrganizationsFromList", getOrganizations.data)
    }
    return getOrganizations
  },
  async createOrganization({ commit }, payload) {},
  async updateOrganization({ commit }, id, payload) {},
  async deleteOrganization({ commit }, id) {},
}

export default actions
