const mutations = {
  setOrganizationsFromList(state, organizationsList) {
    let organizations = {}
    organizationsList.forEach((organization) => {
      organizations[organization._id] = organization
    })
    state.organizations = organizations
  },
  updateOrganization(state, id, organization) {
    state.organizations[id] = organization
  },
  setRolesInOrganizations(state, indexedOrganizations) {
    state.rolesInOrganizations = indexedOrganizations
  },
  setCurrentOrganizationScope(state, organizationId) {
    state.currentOrganizationScope = organizationId
  },
  setCurrentOrganization(state, organization) {
    state.currentOrganization = organization
  },
  deleteOrganization(state, id) {
    delete state.organizations[id]
    state.rolesInOrganizations.delete(id)
    const orgasIds = Object.keys(state.organizations)
    if (orgasIds.length === 0) {
      state.currentOrganizationScope = null
      state.currentOrganization = null
    } else {
      state.currentOrganizationScope = orgasIds[0]._id
      state.currentOrganization = state.organizations[orgasIds[0]]
    }
  },
  setScope(state, scope) {
    if (scope === "organization" || scope === "favorites" || scope === "shared")
      state.currentScope = scope
    else throw "Invalid scope value"
  },
}

export default mutations
