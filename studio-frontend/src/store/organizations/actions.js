import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
  apiDeleteOrganisation,
} from "@/api/organisation"
import {
  apiGetVoiceprintCollections,
  apiCreateVoiceprintCollection,
  apiUpdateVoiceprintCollection,
  apiDeleteVoiceprintCollection,
} from "@/api/voiceprintCollection"
import { indexOrganizationsRoles } from "@/tools/indexOrganizationsRoles"
import { getEnv } from "@/tools/getEnv"
import store from "@/store/index.js"
import createMediaModule from "../modules/mediaModuleFactory"
import { setCookie } from "@/tools/setCookie"

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
  async deleteOrganization({ commit }, id) {
    let req = await apiDeleteOrganisation(id)
    if (req.status === "success") {
      commit("deleteOrganization", id)
    }
    return req
  },
  async setCurrentOrganizationScope(
    { commit, dispatch, state },
    organizationId,
  ) {
    // This action also runs on same-org navigations (router guard), so guard
    // org-scoped reference data on an actual org change.
    const orgChanged = state.currentOrganizationScope !== organizationId
    let organization = await apiGetOrganizationById(organizationId)

    const scope = `organizations/${organizationId}/conversations`

    setCookie("organizationScope", organizationId, 365)

    if (!store.hasModule(`${organizationId}/done/conversations`)) {
      store.registerModule(
        `${organizationId}/done/conversations`,
        createMediaModule(scope, "done"),
      )
    }

    if (!store.hasModule(`${organizationId}/processing/conversations`)) {
      store.registerModule(
        `${organizationId}/processing/conversations`,
        createMediaModule(scope, "processing"),
      )
    }

    if (!store.hasModule(`${organizationId}/error/conversations`)) {
      store.registerModule(
        `${organizationId}/error/conversations`,
        createMediaModule(scope, "error"),
      )
    }

    commit("setCurrentOrganization", organization)
    commit("setCurrentOrganizationScope", organizationId)
    // Reset the M2M-augmented cache: it belongs to the previous org.
    commit("setCurrentOrganizationAllUsers", [])

    if (orgChanged) {
      // Voiceprint collections are org-scoped reference data: drop the previous
      // org's list and eagerly reload it once so the whole app (settings UI +
      // media-creation service picker) can just read the store. Fire-and-forget
      // to avoid blocking navigation; gated by the feature flag to skip the
      // request entirely when speaker identification is disabled.
      commit("setVoiceprintCollections", [])
      if (getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true") {
        dispatch("loadVoiceprintCollections")
      }
    }

    // Clear selected tags when switching organizations
    await dispatch("tags/clearExploreSelectedTags", null, { root: true })
  },
  async setCurrentFilterStatus({ commit }, status) {
    commit("setCurrentFilterStatus", status)
  },
  /**
   * Load the current organization with M2M users (API keys) included in
   * the users array. Stored separately from currentOrganization to avoid
   * leaking API keys into UIs that only want human members.
   *
   * Idempotent: subsequent calls reuse the cached value unless forceRefresh.
   */
  async loadCurrentOrganizationAllUsers(
    { commit, state },
    { forceRefresh = false } = {},
  ) {
    const organizationId = state.currentOrganizationScope
    if (!organizationId) return []
    if (
      !forceRefresh &&
      state.currentOrganizationAllUsers &&
      state.currentOrganizationAllUsers.length > 0
    ) {
      return state.currentOrganizationAllUsers
    }
    const organization = await apiGetOrganizationById(organizationId, null, {
      includeM2m: true,
    })
    const users = organization?.users ?? []
    commit("setCurrentOrganizationAllUsers", users)
    return users
  },
  /**
   * Load the speaker-identification voiceprint collections for the current
   * org. Shared between the settings management UI and the media-creation
   * service picker.
   *
   * Idempotent: subsequent calls reuse the cached list unless forceRefresh.
   * Note: an org with zero collections re-fetches every call (empty list is
   * indistinguishable from "not loaded yet") — matches loadCurrentOrganizationAllUsers.
   */
  async loadVoiceprintCollections(
    { commit, state },
    { forceRefresh = false } = {},
  ) {
    const organizationId = state.currentOrganizationScope
    if (!organizationId) return []
    if (!forceRefresh && state.voiceprintCollections.length > 0) {
      return state.voiceprintCollections
    }
    const collections = await apiGetVoiceprintCollections(organizationId)
    commit("setVoiceprintCollections", collections)
    return state.voiceprintCollections
  },
  async createVoiceprintCollection({ commit, state }, payload) {
    const organizationId = state.currentOrganizationScope
    const collection = await apiCreateVoiceprintCollection(
      organizationId,
      payload,
    )
    commit("updateOrCreateVoiceprintCollection", collection)
    return collection
  },
  async updateVoiceprintCollection(
    { commit, state },
    { collectionId, payload },
  ) {
    const organizationId = state.currentOrganizationScope
    const res = await apiUpdateVoiceprintCollection(
      organizationId,
      collectionId,
      payload,
    )
    if (res.status === "success") {
      const existing = state.voiceprintCollections.find(
        (c) => c._id === collectionId,
      )
      commit("updateOrCreateVoiceprintCollection", {
        ...(existing || {}),
        ...payload,
        _id: collectionId,
      })
    }
    return res
  },
  async deleteVoiceprintCollection({ commit, state }, collectionId) {
    const organizationId = state.currentOrganizationScope
    const res = await apiDeleteVoiceprintCollection(organizationId, collectionId)
    if (res.status === "success") {
      commit("removeVoiceprintCollection", collectionId)
    }
    return res
  },
}

export default actions
