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
}

export default mutations
