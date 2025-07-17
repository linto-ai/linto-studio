import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
} from "@/api/organisation"
import { indexOrganizationsRoles } from "@/tools/indexOrganizationsRoles"

const actions = {
  async fetchOrganizations({ commit, rootGetters }) {
    const getOrganizations = await apiGetUserOrganizations()
    if (getOrganizations.status === "success") {
      commit("setOrganizationsFromList", getOrganizations.data)
      let indexedOrganizations = indexOrganizationsRoles(
        getOrganizations.data,
        rootGetters["user/getUserId"],
      )
      commit("setRolesInOrganizations", indexedOrganizations)
    }
    return getOrganizations
  },
  async createOrganization({ commit }, payload) {},
  async updateOrganization({ commit }, id, payload) {},
  async deleteOrganization({ commit }, id) {},
  async setCurrentOrganizationScope({ commit, dispatch }, organizationId) {
    let organization = await apiGetOrganizationById(organizationId)
    commit("setCurrentOrganization", organization)
    commit("setCurrentOrganizationScope", organizationId)
    
    // Clear selected tags when switching organizations
    await dispatch("tags/clearExploreSelectedTags", null, { root: true })
  },
}

export default actions
