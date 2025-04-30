const getters = {
  getOrganizations(state) {
    return state.organizations
  },
  getOrganizationById: (state) => (id) => {
    return state.organizations[id]
  },
  getDefaultOrganization(state) {
    return Object.values(state.organizations)?.[0] || null
  },
  getOrganizationsAsArray(state) {
    return Object.values(state.organizations)
  },
  getOrganizationLength(state) {
    console.log(state.organizations)
    return Object.keys(state.organizations).length
  },
}

export default getters
