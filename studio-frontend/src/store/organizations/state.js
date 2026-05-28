const state = {
  organizations: {}, // key: organizationId, value: organization
  currentOrganizationScope: null, // orgaId
  rolesInOrganizations: {}, // {organizationId: {myrole: number, users: {userId: {role: number}}}, otherOrgaId: {...}}
  currentOrganization: null,
  currentScope: null, // "organization" or "favorites" or "shared"
  currentFilterStatus: "done", // done, processing, error
  // Full member list including M2M users (API keys). Loaded lazily when a
  // consumer needs to resolve a media/conversation owner that may be an
  // API key. Kept separate from currentOrganization.users so that human
  // member listings (pickers, invitation UIs) stay unaffected.
  currentOrganizationAllUsers: [],
}

export default state
